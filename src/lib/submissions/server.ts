import "server-only";
import { createHmac } from "node:crypto";
import { createClient, type SanityClient } from "@sanity/client";
import { NextResponse } from "next/server";
import { projectId, apiVersion, dataset as publicDataset } from "@/sanity/env";
import { SubmissionError, validateSubmission, type SubmissionKind } from "./validation";

const privateDataset = process.env.SANITY_SUBMISSIONS_DATASET || "submissions";
let privacyVerifiedUntil = 0;

async function privateClient(): Promise<SanityClient> {
  const token = process.env.SANITY_SUBMISSIONS_WRITE_TOKEN || process.env.SANITY_API_TOKEN;
  if (!token || privateDataset === publicDataset) throw new SubmissionError("আবেদন গ্রহণের ব্যবস্থা সাময়িকভাবে বন্ধ। অনুগ্রহ করে অফিসে যোগাযোগ করুন।", 503);
  const client = createClient({ projectId, apiVersion, dataset: privateDataset, token, useCdn: false, perspective: "published", timeout: 10_000, maxRetries: 1 });
  if (Date.now() > privacyVerifiedUntil) {
    const datasets = await client.datasets.list();
    // Sanity's fixed access rules require authentication for IDs containing a dot,
    // including in Free public datasets. Never create root IDs or public assets here.
    // https://www.sanity.io/docs/content-lake/ids#access-control
    const unsafe = await client.fetch<number>('count(*[!(_type in ["system.group", "system.retention"]) && (_type != "incomingSubmission" || !(_id in path("incoming.*")) || length(_id) != 73)])', {}, { perspective: "raw" });
    if (!datasets.some((entry) => entry.name === privateDataset) || unsafe !== 0) throw new SubmissionError("আবেদন গ্রহণের ব্যবস্থা সাময়িকভাবে বন্ধ। অনুগ্রহ করে অফিসে যোগাযোগ করুন।", 503);
    privacyVerifiedUntil = Date.now() + 60_000;
  }
  return client;
}

export async function receiveSubmission(request: Pick<Request, "headers" | "text"> & { nextUrl: { origin: string } }, kind: SubmissionKind) {
  try {
    const origin = request.headers.get("origin");
    if (origin && origin !== request.nextUrl.origin) throw new SubmissionError("এই ঠিকানা থেকে ফরম পাঠানো যাবে না।", 403);
    const length = Number(request.headers.get("content-length") || 0);
    if (length > 420_000) throw new SubmissionError("ছবি বা তথ্যের আকার অতিরিক্ত বড়।", 413);
    const text = await request.text();
    if (Buffer.byteLength(text) > 420_000) throw new SubmissionError("ছবি বা তথ্যের আকার অতিরিক্ত বড়।", 413);
    let body: unknown;
    try { body = JSON.parse(text); } catch { throw new SubmissionError("ফরমের তথ্য পড়া যায়নি।"); }
    const fields = validateSubmission(kind, body);
    const key = request.headers.get("idempotency-key") || "";
    if (!/^[a-zA-Z0-9-]{20,80}$/.test(key)) throw new SubmissionError("পাতাটি রিফ্রেশ করে আবার ফরম পাঠান।");
    const client = await privateClient();
    const secret = process.env.SANITY_SUBMISSIONS_WRITE_TOKEN || process.env.SANITY_API_TOKEN || "";
    const digest = (input: string) => createHmac("sha256", secret).update(input).digest("hex");
    // This operational record uses a request-derived ID solely for atomic retry deduplication.
    const id = `incoming.${digest(`${kind}:${key}`)}`;
    if (!/^incoming\.[a-f0-9]{64}$/.test(id)) throw new SubmissionError("আবেদন সংরক্ষণের ব্যবস্থা যাচাই করা যায়নি।", 503);
    const existing = await client.getDocument<{ reference: string }>(id);
    if (existing) return NextResponse.json({ success: true, applicationId: existing.reference, reference: existing.reference }, { headers: { "Cache-Control": "no-store" } });
    const fingerprint = digest(request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local");
    const recent = await client.fetch<number>('count(*[_type == "incomingSubmission" && requestFingerprint == $fingerprint && receivedAt > $since])', { fingerprint, since: new Date(Date.now() - 600_000).toISOString() });
    if (recent >= 8) throw new SubmissionError("অল্প সময়ে অনেক আবেদন এসেছে। কিছুক্ষণ পরে আবার চেষ্টা করুন।", 429);
    if (fields.studentImage) {
      const image = Buffer.from(String(fields.studentImage).split(",")[1], "base64");
      const jpeg = image[0] === 0xff && image[1] === 0xd8;
      const png = image.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
      const webp = image.subarray(0, 4).toString() === "RIFF" && image.subarray(8, 12).toString() === "WEBP";
      if (image.length > 262_144 || !(jpeg || png || webp)) throw new SubmissionError("ছবির ফাইলটি সঠিক নয়। অন্য ছবি দিন।");
    }
    const reference = `${kind === "admission" ? "JNI" : kind === "contact" ? "MSG" : "BDR"}-${new Date().getUTCFullYear()}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
    const saved = await client.createIfNotExists({ _id: id, _type: "incomingSubmission", kind, reference, fields, status: "new", receivedAt: new Date().toISOString(), requestFingerprint: fingerprint, notes: "" });
    return NextResponse.json({ success: true, applicationId: saved.reference, reference: saved.reference, message: "আপনার তথ্য সফলভাবে সংরক্ষিত হয়েছে।" }, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    const known = error instanceof SubmissionError;
    return NextResponse.json({ success: false, message: known ? error.message : "তথ্য সংরক্ষণ করা যায়নি। আপনার লেখা অক্ষত আছে—কিছুক্ষণ পরে আবার চেষ্টা করুন।" }, { status: known ? error.status : 503, headers: { "Cache-Control": "no-store" } });
  }
}
