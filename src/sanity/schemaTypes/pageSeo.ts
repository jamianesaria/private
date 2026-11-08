import { defineArrayMember, defineField, defineType } from "sanity";
import { seoRoutes } from "../../data/seoData";

export const pageSeoType = defineType({
  name: "pageSeo", title: "পাতার সার্চ ও ব্রেডক্রাম্ব (Page SEO)", type: "document",
  fields: [
    defineField({ name: "route", title: "ওয়েব পাতা (Page)", type: "string", options: { list: Object.entries(seoRoutes).map(([value, page]) => ({ title: `${page.label} · ${value}`, value })) }, validation: (rule) => rule.required().custom(async (value, context) => {
      if (!value) return true;
      const id = context.document?._id.replace(/^drafts\./, "");
      const exists = await context.getClient({ apiVersion: "2026-03-01" }).fetch('count(*[_type=="pageSeo" && route==$route && !(_id in [$id,$draft])])', { route: value, id: id || "", draft: `drafts.${id}` });
      return exists === 0 || "এই পাতার SEO সেটিংস ইতিমধ্যে রয়েছে। (This page already has SEO settings.)";
    }) }),
    defineField({ name: "seoTitle", title: "সার্চের শিরোনাম (Search title)", type: "string", description: "খালি রাখলে পাতার নাম ও প্রতিষ্ঠানের নাম ব্যবহার হবে। (Leave empty for the automatic title.)" }),
    defineField({ name: "seoDescription", title: "সার্চের পরিচিতি (Search description)", type: "text", rows: 3 }),
    defineField({ name: "breadcrumbLabel", title: "ব্রেডক্রাম্বের নাম (Breadcrumb label)", type: "string" }),
    defineField({ name: "pageHeading", title: "প্রধান শিরোনাম (Page heading)", type: "string", description: "পাতার প্রধান শিরোনাম ও পরিচিতি ফ্রেমে ব্যবহৃত নাম। খালি রাখলে পাতার নাম দেখাবে। (Page and identity frame heading; defaults to the page name.)" }),
    // The ribbon is page-specific; the profile body is shared with the About page.
    defineField({ name: "frameEnabled", title: "উপরের পরিচিতি ফ্রেম দেখাবেন (Show top frame)", type: "boolean", initialValue: true }),
    defineField({ name: "frameEyebrow", title: "ফ্রেমের সবুজ বারের লেখা (Top ribbon)", type: "string" }),
    defineField({ deprecated: { reason: "?? ?????? ??????? ???????? ???? ?????? ???? ?????? ???? ???????? ???? (Uses the shared About identity.)" }, readOnly: true, hidden: true, name: "frameTitle", title: "ফ্রেমের প্রধান শিরোনাম (Frame title)", type: "string" }),
    defineField({ deprecated: { reason: "?? ?????? ??????? ???????? ???? ?????? ???? ?????? ???? ???????? ???? (Uses the shared About identity.)" }, readOnly: true, hidden: true, name: "frameSubtitle", title: "ফ্রেমের পরিচিতি (Subtitle)", type: "string" }),
    defineField({ deprecated: { reason: "?? ?????? ??????? ???????? ???? ?????? ???? ?????? ???? ???????? ???? (Uses the shared About identity.)" }, readOnly: true, hidden: true, name: "frameMeta", title: "ফ্রেমের ছোট পরিচয় (Highlight)", type: "string" }),
    defineField({ deprecated: { reason: "?? ?????? ??????? ???????? ???? ?????? ???? ?????? ???? ???????? ???? (Uses the shared About identity.)" }, readOnly: true, hidden: true, name: "frameDetail", title: "ফ্রেমের তথ্যের লাইন (Detail line)", type: "string" }),
    defineField({ deprecated: { reason: "?? ?????? ??????? ???????? ???? ?????? ???? ?????? ???? ???????? ???? (Uses the shared About identity.)" }, readOnly: true, hidden: true, name: "frameBadges", title: "ফ্রেমের বিষয়সূচক ট্যাগ (Badges)", type: "array", of: [defineArrayMember({ type: "string" })], validation: (rule) => rule.max(6) }),
    defineField({ deprecated: { reason: "?? ?????? ??????? ???????? ???? ?????? ???? ?????? ???? ???????? ???? (Uses the shared About identity.)" }, readOnly: true, hidden: true, name: "frameImage", title: "ফ্রেমের গোল ছবি (Frame image)", type: "image", options: { hotspot: true }, description: "খালি থাকলে প্রতিষ্ঠানের লোগো দেখাবে।" }),
    defineField({ deprecated: { reason: "?? ?????? ??????? ???????? ???? ?????? ???? ?????? ???? ???????? ???? (Uses the shared About identity.)" }, readOnly: true, hidden: true, name: "frameImageAlt", title: "ফ্রেমের ছবির বিবরণ (Image description)", type: "string" }),
    defineField({ name: "frameBackLabel", title: "ফিরে যাওয়ার লিংকের লেখা (Back label)", type: "string" }),
    defineField({ name: "frameBackUrl", title: "ফিরে যাওয়ার গন্তব্য (Back URL)", type: "string", validation: (rule) => rule.custom((value) => !value || (value.startsWith("/") && !value.startsWith("//")) || "সাইটের ভেতরের / দিয়ে শুরু হওয়া ঠিকানা দিন।") }),
    defineField({ name: "relatedLinksTitle", title: "সম্পর্কিত পাতার শিরোনাম (Related pages heading)", type: "string" }),
    defineField({ name: "relatedLinks", title: "সম্পর্কিত গুরুত্বপূর্ণ পাতা (Related important pages)", type: "array", of: [defineArrayMember({ type: "publicPageLink" })], validation: (rule) => rule.max(6).custom((links, context) => !links?.some((link) => (link as { href?: string }).href === context.document?.route) || "একই পাতায় আবার লিংক দেবেন না। (Choose a different destination page.)") }),
    defineField({ name: "backToBlogLabel", title: "ব্লগে ফেরার লিংক (Back to blog label)", type: "string", hidden: ({ document }) => document?.route !== "/blog" }),
    defineField({ name: "articleAuthorLabel", title: "লেখকের পরিচয় (Author label)", type: "string", hidden: ({ document }) => document?.route !== "/blog" }),
    defineField({ name: "articleDateLabel", title: "প্রকাশের তারিখের পরিচয় (Publication date label)", type: "string", hidden: ({ document }) => document?.route !== "/blog" }),
    defineField({ name: "seoImage", title: "শেয়ার করার ছবি (Sharing image)", type: "image", options: { hotspot: true } }),
    defineField({ name: "noIndex", title: "সার্চে দেখাবেন না (Hide from search)", type: "boolean", initialValue: false, description: "এটি গোপনীয়তার ব্যবস্থা নয়। (This is not access control.)" }),
  ],
  preview: { select: { route: "route", title: "seoTitle" }, prepare({ route, title }) { return { title: title || seoRoutes[route]?.label || "পাতার SEO", subtitle: route }; } },
});
