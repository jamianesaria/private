import InstitutionalIdentity from "./InstitutionalIdentity";
import Link from "next/link";
import { BookOpen, HeartHandshake, Images, Mail, Megaphone, Newspaper, ScrollText, Users, UserRoundCheck, type LucideIcon } from "lucide-react";
import { stegaClean } from "@sanity/client/stega";
import { getFieldAttribute } from "@/content/server";
import { getPageSeoRecords } from "@/lib/seo";
import { pageFrameDefaults } from "@/data/pageFrameDefaults";

const icons: Record<string, LucideIcon> = {
  "/committee": Users, "/teachers": UserRoundCheck, "/admission": BookOpen,
  "/results/academic": ScrollText, "/notices": Megaphone,
  "/orphanage": HeartHandshake, "/badri-kafila": HeartHandshake,
  "/gallery": Images, "/blog": Newspaper, "/contact": Mail,
};

/**
 * Shared top identity frame for the ten main navigation pages added on 2026-11-06.
 * Page-specific controls apply to the ribbon and back link. The identity body
 * shares the About page's CMS content through InstitutionalIdentity.
 */
export default async function PageIdentityFrame({ route }: { route: string }) {
  const fallback = pageFrameDefaults[route];
  if (!fallback) return null;
  const [pages, attribute] = await Promise.all([getPageSeoRecords(), getFieldAttribute()]);
  const page = pages.find((entry) => stegaClean(entry.route) === route);
  if (page?.frameEnabled === false) return null;
  const Icon = icons[route];
  const title = stegaClean(page?.frameEyebrow ?? fallback.eyebrow);
  const backHref = stegaClean(page?.frameBackUrl || "/");
  const safeBackHref = backHref.startsWith("/") && !backHref.startsWith("//") ? backHref : "/";

  return <section aria-label={title} className="mb-6 sm:mb-8 overflow-hidden rounded-xl border border-gray-200/90 bg-white shadow-sm">
    <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-[#D9822B] bg-gradient-to-r from-[#014d26] via-[#016332] to-[#02733b] px-4 py-3 text-white sm:px-6">
      <div className="flex items-center gap-2.5"><Icon size={18} className="shrink-0 text-amber-300" aria-hidden="true" />
        <span className="text-sm font-bold tracking-wide sm:text-base" data-sanity={attribute(page, "frameEyebrow")}>{title}</span>
      </div>
      <Link href={safeBackHref} className="rounded-full border border-amber-300/30 bg-black/20 px-3 py-1 text-xs font-semibold text-amber-200 transition-colors hover:text-white" data-sanity={attribute(page, "frameBackLabel")}>{stegaClean(page?.frameBackLabel ?? "← হোমপেজে ফিরে যান")}</Link>
    </div>
    <InstitutionalIdentity route={route} />
  </section>;
}
