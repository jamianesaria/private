import InstitutionalIdentity from "./InstitutionalIdentity";

import { stegaClean } from "@sanity/client/stega";
import Link from "next/link";
import type { AcademicDepartment } from "@/sanity/lib/departments";
import { departmentForSection } from "@/sanity/lib/departments";
import AcademicDepartmentSummary from "./AcademicDepartmentSummary";
import { academicsPageData as _fallback_academicsPageData, siteSettings as _fallback_siteSettings } from "@/data/siteData";
import {
  GraduationCap,
  BookOpen,
  Clock,
  Award,
  CheckCircle2,
  Library,
  Compass,
  Sparkles,
  ArrowRight,
  Phone,
  Layers,
  Rocket,
  ShieldCheck,
} from "lucide-react";
import { getEditableData, getFieldAttribute, EditableText } from "@/content/server";


interface AcademicsPageSectionProps {
  initialDepartments?: AcademicDepartment[];
}

export default async function AcademicsPageSection({ initialDepartments }: AcademicsPageSectionProps = {}) {
  const academicsPageData = await getEditableData("copy.data.academicsPageData", _fallback_academicsPageData);
  const siteSettings = await getEditableData("siteSettings", _fallback_siteSettings);
  const attribute = await getFieldAttribute();
  const maktabRecord = departmentForSection(initialDepartments, "maktab");
  const hifzRecord = departmentForSection(initialDepartments, "hifz");
  const kitabRecord = departmentForSection(initialDepartments, "kitab");
  const madaniRecord = departmentForSection(initialDepartments, "madani-nisab");

  const {
    header,
    overview,
    departments,
    syllabus,
    training,
    futurePlans,
    academicGoals,
    conclusion,
  } = academicsPageData;

  const tocItems = await getEditableData("copy.ui.AcademicsPageSection", [
    { id: "overview", num: "০", label: "শিক্ষাব্যবস্থার পরিচিতি" },
    { id: "maktab", num: "১", label: "মক্তব বিভাগ" },
    { id: "hifz", num: "২", label: "হিফজ বিভাগ" },
    { id: "kitab", num: "৩", label: "কিতাব বিভাগ" },
    { id: "madani-nisab", num: "৪", label: "মাদানি নেসাব বিভাগ" },
    { id: "syllabus", num: "৫", label: "সিলেবাস ও পাঠ্যবিষয়" },
    { id: "training", num: "৬", label: "ছাত্র প্রশিক্ষণ বিভাগ" },
    { id: "future-plans", num: "৭", label: "ভবিষ্যৎ পরিকল্পনা" },
    { id: "academic-goals", num: "৮", label: "শিক্ষার লক্ষ্য ও প্রত্যয়" },
    { id: "conclusion", num: "❖", label: "উপসংহার" },
  ], ["local","tocItems"]);

  const maktabDept = departments[0];
  const hifzDept = departments[1];
  const kitabDept = departments[2];
  const madaniDept = departments[3];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* =====================================================================
          TOP ACADEMIC HEADER HERO CARD
      ===================================================================== */}
      <div className="bg-white rounded-xl border border-gray-200/90 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-[#014d26] via-[#016332] to-[#02733b] text-white px-4 sm:px-6 py-3 border-b-2 border-[#D9822B] flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <GraduationCap size={19} className="text-amber-300 shrink-0" />
            <span className="font-bold text-sm sm:text-base tracking-wide">
              {header.pageTitle}<EditableText document="copy.ui.AcademicsPageSection" entry="ewuvzo" fallback={" — পূর্ণাঙ্গ একাডেমিক বিবরণী ও পাঠ্যক্রম"} /></span>
          </div>
          <Link
            href="/"
            className="text-xs font-semibold text-amber-200 hover:text-white bg-black/20 px-3 py-1 rounded-full border border-amber-300/30 transition-colors"
          ><EditableText document="copy.ui.AcademicsPageSection" entry="e1k1qppm" fallback={"← হোমপেজে ফিরে যান"} /></Link>
        </div>

        <InstitutionalIdentity headingAs="h1" route="/academics" />
      </div>

      {/* =====================================================================
          MAIN 2-COLUMN LAYOUT: STICKY TABLE OF CONTENTS + ACADEMIC SECTIONS
      ===================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-7 items-start">
        {/* LEFT STICKY TABLE OF CONTENTS (3 cols on Desktop) */}
        <aside className="lg:col-span-3 lg:sticky lg:top-16 space-y-5">
          <div className="bg-white rounded-xl border border-gray-200/90 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-[#750d15] via-[#8B111A] to-[#9e141e] text-white px-4 py-2.5 border-b-2 border-[#D9822B] flex items-center gap-2">
              <Compass size={16} className="text-amber-300" />
              <h2 className="text-sm font-bold tracking-wide"><EditableText document="copy.ui.AcademicsPageSection" entry="emuic32" fallback={"শিক্ষা বিভাগ সূচিপত্র"} /></h2>
            </div>

            <nav className="p-2 divide-y divide-gray-100">
              {tocItems.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs sm:text-[13px] font-semibold text-gray-700 hover:text-[#016332] hover:bg-[#FAF7F0] rounded-lg transition-colors group"
                >
                  <span className="w-5 h-5 rounded-full bg-[#016332]/10 text-[#016332] group-hover:bg-[#016332] group-hover:text-white font-bold text-[11px] flex items-center justify-center shrink-0 transition-colors">
                    {item.num}
                  </span>
                  <span className="truncate">{item.label}</span>
                </a>
              ))}
            </nav>
          </div>

          {/* Admission Quick CTA Card */}
          <div className="bg-gradient-to-br from-[#014d26] to-[#016332] text-white rounded-xl p-4 border border-[#D9822B]/50 shadow-sm space-y-3 hidden lg:block">
            <h3 className="text-sm font-bold text-amber-200 flex items-center gap-1.5">
              <GraduationCap size={16} />
              <span><EditableText document="copy.ui.AcademicsPageSection" entry="e1y5dm0q" fallback={"ভর্তি ও তথ্য ডেস্ক"} /></span>
            </h3>
            <p className="text-xs text-emerald-100 leading-relaxed"><EditableText document="copy.ui.AcademicsPageSection" entry="ebkpcfu" fallback={"সকল বিভাগে নির্ধারিত শিক্ষাবর্ষের শুরুতে ও আসন খালি থাকা সাপেক্ষে ভর্তি কার্যক্রম পরিচালিত হয়।"} /></p>
            <div className="space-y-2 pt-1">
              <Link
                href="/apply"
                className="w-full inline-flex items-center justify-center gap-1.5 bg-[#8B111A] hover:bg-[#6e0b13] text-white text-xs font-bold py-2 px-3 rounded-md border border-amber-300/30 transition-colors"
              >
                <span><EditableText document="copy.ui.AcademicsPageSection" entry="e4l0ov8" fallback={"অনলাইন ভর্তি আবেদন"} /></span>
                <ArrowRight size={13} />
              </Link>
              <a
                href={`tel:${stegaClean(siteSettings.phone)}`}
                className="w-full inline-flex items-center justify-center gap-1.5 bg-white text-[#016332] hover:bg-amber-50 text-xs font-bold py-2 px-3 rounded-md transition-colors"
              >
                <Phone size={12} />
                <span><EditableText document="copy.ui.AcademicsPageSection" entry="e12rrbb8" fallback={"হটলাইন: "} />{siteSettings.phone}</span>
              </a>
            </div>
          </div>
        </aside>

        {/* RIGHT MAIN CONTENT AREA (9 cols on Desktop) */}
        <div className="lg:col-span-9 space-y-6">
          {/* শিক্ষাব্যবস্থার পরিচিতি */}
          <section
            id="overview"
            className="bg-white rounded-xl border border-gray-200/90 shadow-sm overflow-hidden scroll-mt-16"
          >
            <div className="bg-gradient-to-r from-[#014d26] via-[#016332] to-[#02733b] text-white px-4 sm:px-6 py-3 border-b-2 border-[#D9822B] flex items-center gap-2.5">
              <BookOpen size={18} className="text-amber-300 shrink-0" />
              <h2 className="text-base sm:text-lg font-bold">
                {overview.title}
              </h2>
            </div>

            <div className="p-5 sm:p-7 space-y-4">
              {overview.paragraphs.map((para, idx) => (
                <p
                  key={idx}
                  className={
                    idx === overview.paragraphs.length - 1
                      ? "bg-[#FAF7F0] border-l-4 border-l-[#016332] p-4 rounded-r-lg text-sm sm:text-[15.5px] font-semibold text-gray-900 leading-relaxed"
                      : "text-sm sm:text-[15.5px] text-gray-700 leading-relaxed text-justify"
                  }
                >
                  {para}
                </p>
              ))}
            </div>
          </section>

          {/* ১। মক্তব বিভাগ */}
          <section
            id="maktab"
            className="bg-white rounded-xl border border-gray-200/90 shadow-sm overflow-hidden scroll-mt-16"
          >
            <div className="bg-gradient-to-r from-[#014d26] via-[#016332] to-[#02733b] text-white px-4 sm:px-6 py-3 border-b-2 border-[#D9822B] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-1.5 h-5 bg-[#D9822B] rounded-full inline-block" />
                <h2 data-sanity={attribute(maktabRecord, "title")} className="text-base sm:text-lg font-bold">
                  {maktabRecord?.name || maktabDept.title}
                </h2>
              </div>
              <span className="text-xs bg-white/15 text-amber-200 px-2.5 py-0.5 rounded-full font-semibold"><EditableText document="copy.ui.AcademicsPageSection" entry="ebbmzyv" fallback={"প্রাথমিক দ্বীনি ও সাধারণ শিক্ষা"} /></span>
            </div>

            <div className="p-5 sm:p-7 grid grid-cols-1 md:grid-cols-2 gap-5">
              {maktabRecord && <div className="md:col-span-2"><AcademicDepartmentSummary department={maktabRecord} /></div>}
              {maktabDept.subDepartments?.map((sub, idx) => (
                <div
                  key={idx}
                  className="bg-[#FAF7F0]/70 border border-gray-200/90 rounded-xl p-5 flex flex-col justify-between shadow-2xs"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                      <span className="w-7 h-7 rounded-lg bg-[#016332] text-white font-bold text-xs flex items-center justify-center shrink-0">
                        {sub.code}
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-[#8B111A]">
                        {sub.name}
                      </h3>
                    </div>

                    {sub.paragraphs.map((p, pIdx) => (
                      <p
                        key={pIdx}
                        className="text-xs sm:text-sm text-gray-700 leading-relaxed text-justify"
                      >
                        {p}
                      </p>
                    ))}
                  </div>

                  {sub.duration && (
                    <div className="mt-4 pt-3 border-t border-gray-200/80 flex items-center gap-2 text-xs sm:text-sm font-bold text-[#016332]">
                      <Clock size={15} className="text-[#8B111A] shrink-0" />
                      <span>{sub.duration}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* ২। হিফজ বিভাগ */}
          <section
            id="hifz"
            className="bg-white rounded-xl border border-gray-200/90 shadow-sm overflow-hidden scroll-mt-16"
          >
            <div className="bg-gradient-to-r from-[#014d26] via-[#016332] to-[#02733b] text-white px-4 sm:px-6 py-3 border-b-2 border-[#D9822B] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-1.5 h-5 bg-[#D9822B] rounded-full inline-block" />
                <h2 data-sanity={attribute(hifzRecord, "title")} className="text-base sm:text-lg font-bold">
                  {hifzRecord?.name || hifzDept.title}
                </h2>
              </div>
              <span className="text-xs bg-white/15 text-amber-200 px-2.5 py-0.5 rounded-full font-semibold"><EditableText document="copy.ui.AcademicsPageSection" entry="e10le5c9" fallback={"তাহফিজুল কুরআন ও ইয়াদ"} /></span>
            </div>

            <div className="p-5 sm:p-7 grid grid-cols-1 md:grid-cols-2 gap-5">
              {hifzRecord && <div className="md:col-span-2"><AcademicDepartmentSummary department={hifzRecord} /></div>}
              {hifzDept.subDepartments?.map((sub, idx) => (
                <div
                  key={idx}
                  className="bg-[#FAF7F0]/70 border border-gray-200/90 rounded-xl p-5 flex flex-col justify-between shadow-2xs"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                      <span className="w-7 h-7 rounded-lg bg-[#8B111A] text-white font-bold text-xs flex items-center justify-center shrink-0">
                        {sub.code}
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-[#016332]">
                        {sub.name}
                      </h3>
                    </div>

                    {sub.paragraphs.map((p, pIdx) => (
                      <p
                        key={pIdx}
                        className="text-xs sm:text-sm text-gray-700 leading-relaxed text-justify"
                      >
                        {p}
                      </p>
                    ))}
                  </div>

                  {sub.duration && (
                    <div className="mt-4 pt-3 border-t border-gray-200/80 flex items-center gap-2 text-xs sm:text-sm font-bold text-[#8B111A]">
                      <Clock size={15} className="text-[#016332] shrink-0" />
                      <span>{sub.duration}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* ৩। কিতাব বিভাগ */}
          <section
            id="kitab"
            className="bg-white rounded-xl border border-gray-200/90 shadow-sm overflow-hidden scroll-mt-16"
          >
            <div className="bg-gradient-to-r from-[#014d26] via-[#016332] to-[#02733b] text-white px-4 sm:px-6 py-3 border-b-2 border-[#D9822B] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-1.5 h-5 bg-[#D9822B] rounded-full inline-block" />
                <h2 data-sanity={attribute(kitabRecord, "title")} className="text-base sm:text-lg font-bold">
                  {kitabRecord?.name || kitabDept.title}
                </h2>
              </div>
              <span className="text-xs bg-white/15 text-amber-200 px-2.5 py-0.5 rounded-full font-semibold"><EditableText document="copy.ui.AcademicsPageSection" entry="e1cve7xb" fallback={"ইবতেদায়ী থেকে দাওরায়ে হাদিস (মাস্টার্স সমমান)"} /></span>
            </div>

            <div className="p-5 sm:p-7 space-y-6">
              <div className="space-y-3">
                <AcademicDepartmentSummary department={kitabRecord} />
                {kitabDept.introParagraphs?.map((p, idx) => (
                  <p
                    key={idx}
                    className="text-sm sm:text-[15.5px] text-gray-700 leading-relaxed text-justify"
                  >
                    {p}
                  </p>
                ))}
              </div>

              {/* কিতাব বিভাগের শিক্ষাস্তর ও সময়কাল */}
              <div className="bg-[#FAF7F0] border border-gray-200/90 rounded-xl p-4 sm:p-5">
                <h3 className="text-sm sm:text-base font-bold text-[#8B111A] mb-3.5 pb-2 border-b border-gray-200 flex items-center gap-2">
                  <Layers size={17} className="text-[#016332]" />
                  <span>{kitabDept.levelsTitle}</span>
                </h3>

                <div className="divide-y divide-gray-200/80 border border-gray-200 rounded-lg overflow-hidden bg-white">
                  {kitabDept.levels?.map((lvl, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 sm:px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-[#FAF7F0]/50 transition-colors"
                    >
                      <div className="flex items-start sm:items-center gap-2.5">
                        <span className="w-6 h-6 rounded-full bg-[#016332] text-white font-bold text-xs flex items-center justify-center shrink-0">
                          {lvl.step}
                        </span>
                        <div>
                          <span className="font-bold text-sm sm:text-[15px] text-gray-900">
                            {lvl.name}<EditableText document="copy.ui.AcademicsPageSection" entry="e4pv6f5" fallback={":"} /></span>{" "}
                          <span className="text-xs sm:text-sm text-gray-700 font-medium">
                            {lvl.classes}
                          </span>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-[#8B111A] bg-[#8B111A]/10 border border-[#8B111A]/20 px-3 py-1 rounded-full shrink-0 self-start sm:self-center">
                        <Clock size={12} />
                        <span>{lvl.duration}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* বোর্ড ও পরীক্ষা */}
              <div className="bg-gradient-to-r from-[#016332]/5 via-[#FAF7F0] to-white border border-[#016332]/25 border-l-4 border-l-[#016332] rounded-r-xl p-4 sm:p-5 space-y-2.5">
                <h3 className="text-sm sm:text-base font-bold text-[#016332] flex items-center gap-2">
                  <Award size={17} className="text-[#8B111A]" />
                  <span>{kitabDept.boardTitle}</span>
                </h3>
                {kitabDept.boardParagraphs?.map((bp, idx) => (
                  <p
                    key={idx}
                    className="text-xs sm:text-sm text-gray-800 leading-relaxed font-medium"
                  ><EditableText document="copy.ui.AcademicsPageSection" entry="e1ces204" fallback={"▪ "} />{bp}
                  </p>
                ))}
              </div>
            </div>
          </section>

          {/* ৪। মাদানি নেসাব বিভাগ */}
          <section
            id="madani-nisab"
            className="bg-white rounded-xl border border-gray-200/90 shadow-sm overflow-hidden scroll-mt-16"
          >
            <div className="bg-gradient-to-r from-[#750d15] via-[#8B111A] to-[#9e141e] text-white px-4 sm:px-6 py-3 border-b-2 border-[#D9822B] flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className="w-1.5 h-5 bg-[#D9822B] rounded-full inline-block" />
                <h2 className="text-base sm:text-lg font-bold">
                  <span data-sanity={attribute(madaniRecord, "title")}>{madaniRecord?.name || madaniDept.title}</span>
                </h2>
              </div>
              <span className="text-xs bg-amber-400/20 text-amber-200 border border-amber-300/40 px-3 py-0.5 rounded-full font-bold">
                {madaniDept.sessionBadge}
              </span>
            </div>

            <div className="p-5 sm:p-7 space-y-6">
              <p className="text-sm sm:text-[15.5px] text-gray-700 leading-relaxed text-justify">
                {madaniRecord?.overview || madaniDept.intro}
              </p>
              {madaniRecord && <AcademicDepartmentSummary department={{ ...madaniRecord, overview: "" }} />}

              {/* মাদানি নেসাব বিভাগের বৈশিষ্ট্য ও শিক্ষার লক্ষ্য (১–৬) */}
              <div>
                <h3 className="text-sm sm:text-base font-bold text-[#016332] mb-3.5 pb-2 border-b border-gray-200">
                  {madaniDept.featuresTitle}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {madaniDept.features?.map((feat, idx) => (
                    <div
                      key={idx}
                      className="bg-[#FAF7F0]/70 border border-gray-200/90 rounded-xl p-4 hover:border-[#8B111A]/40 transition-colors"
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="w-6 h-6 rounded-md bg-[#8B111A] text-white font-bold text-xs flex items-center justify-center shrink-0">
                          {feat.num}
                        </span>
                        <h4 className="text-xs sm:text-sm font-bold text-gray-900">
                          {feat.title}
                        </h4>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed text-justify">
                        {feat.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* মাদানি নেসাব বিভাগের মূল লক্ষ্য */}
              <div className="bg-gradient-to-r from-[#FAF7F0] to-white border border-[#D9822B]/40 border-l-4 border-l-[#8B111A] rounded-r-xl p-4 sm:p-5 space-y-1.5">
                <h3 className="text-sm sm:text-base font-bold text-[#8B111A]">
                  {madaniDept.mainGoalTitle}
                </h3>
                <p className="text-xs sm:text-sm text-gray-800 leading-relaxed text-justify font-medium">
                  {madaniDept.mainGoal}
                </p>
              </div>
            </div>
          </section>

          {/* ৫। জামিয়ার সিলেবাস ও পাঠ্যবিষয় */}
          <section
            id="syllabus"
            className="bg-white rounded-xl border border-gray-200/90 shadow-sm overflow-hidden scroll-mt-16"
          >
            <div className="bg-gradient-to-r from-[#014d26] via-[#016332] to-[#02733b] text-white px-4 sm:px-6 py-3 border-b-2 border-[#D9822B] flex items-center gap-2.5">
              <BookOpen size={18} className="text-amber-300 shrink-0" />
              <h2 className="text-base sm:text-lg font-bold">
                {syllabus.title}
              </h2>
            </div>

            <div className="p-5 sm:p-7 space-y-5">
              <p className="text-sm sm:text-[15.5px] text-gray-700 leading-relaxed text-justify">
                {syllabus.intro}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {syllabus.categories.map((cat, idx) => (
                  <div
                    key={idx}
                    className="bg-[#FAF7F0]/80 border border-gray-200/90 rounded-xl p-4 flex flex-col justify-between hover:border-[#016332]/50 transition-colors shadow-2xs"
                  >
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-[#016332] pb-2 mb-2.5 border-b border-gray-200">
                        {cat.title}
                      </h3>
                      <ul className="space-y-1.5">
                        {cat.subjects.map((subj, sIdx) => (
                          <li
                            key={sIdx}
                            className="text-xs text-gray-800 font-medium flex items-start gap-1.5"
                          >
                            <span className="text-[#8B111A] font-bold"><EditableText document="copy.ui.AcademicsPageSection" entry="efj8xef" fallback={"•"} /></span>
                            <span>{subj}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-amber-50/80 border border-[#D9822B]/40 rounded-lg px-4 py-2.5 text-xs sm:text-sm font-bold text-[#8B111A]">
                {syllabus.note}
              </div>
            </div>
          </section>

          {/* ৬। ছাত্র প্রশিক্ষণ বিভাগ */}
          <section
            id="training"
            className="bg-white rounded-xl border border-gray-200/90 shadow-sm overflow-hidden scroll-mt-16"
          >
            <div className="bg-gradient-to-r from-[#014d26] via-[#016332] to-[#02733b] text-white px-4 sm:px-6 py-3 border-b-2 border-[#D9822B] flex items-center gap-2.5">
              <Library size={18} className="text-amber-300 shrink-0" />
              <h2 className="text-base sm:text-lg font-bold">
                {training.title}
              </h2>
            </div>

            <div className="p-5 sm:p-7 space-y-5">
              <p className="text-sm sm:text-[15.5px] text-gray-700 leading-relaxed text-justify">
                {training.intro}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {training.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-gradient-to-b from-[#FAF7F0] to-white border border-gray-200/90 border-t-3 border-t-[#8B111A] rounded-xl p-4 sm:p-5 space-y-2.5 shadow-2xs"
                  >
                    <span className="inline-block text-[11px] font-bold text-[#016332] bg-[#016332]/10 px-2.5 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-gray-900">
                      {item.title}
                    </h3>
                    <div className="space-y-2 pt-1">
                      {item.paragraphs.map((p, pIdx) => (
                        <p
                          key={pIdx}
                          className="text-xs text-gray-700 leading-relaxed text-justify"
                        >
                          {p}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ৭। ভবিষ্যৎ পরিকল্পনা */}
          <section
            id="future-plans"
            className="bg-white rounded-xl border-2 border-[#D9822B] shadow-sm overflow-hidden scroll-mt-16"
          >
            <div className="bg-gradient-to-r from-[#750d15] via-[#8B111A] to-[#9e141e] text-white px-4 sm:px-6 py-3 border-b-2 border-[#D9822B] flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <Rocket size={18} className="text-amber-300 shrink-0" />
                <h2 className="text-base sm:text-lg font-bold">
                  {futurePlans.title}
                </h2>
              </div>
              <span className="text-xs bg-amber-400/20 text-amber-200 border border-amber-300/40 px-2.5 py-0.5 rounded-full font-semibold"><EditableText document="copy.ui.AcademicsPageSection" entry="e106ch56" fallback={"উন্নয়ন ও সম্প্রসারণ রূপরেখা"} /></span>
            </div>

            <div className="p-5 sm:p-7 space-y-5">
              <p className="text-sm sm:text-[15.5px] text-gray-700 leading-relaxed text-justify">
                {futurePlans.intro}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {futurePlans.items.map((plan, idx) => (
                  <div
                    key={idx}
                    className="bg-[#FAF7F0]/70 border border-gray-200/90 rounded-xl p-4 flex items-start gap-3 hover:border-[#016332]/50 transition-colors shadow-2xs"
                  >
                    <span className="w-8 h-8 rounded-lg bg-[#016332] text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {plan.num}
                    </span>
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-[#8B111A]">
                        {plan.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-700 mt-1 leading-relaxed">
                        {plan.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ৮। শিক্ষার লক্ষ্য ও প্রত্যয় */}
          <section
            id="academic-goals"
            className="bg-white rounded-xl border border-gray-200/90 shadow-sm overflow-hidden scroll-mt-16"
          >
            <div className="bg-gradient-to-r from-[#014d26] via-[#016332] to-[#02733b] text-white px-4 sm:px-6 py-3 border-b-2 border-[#D9822B] flex items-center gap-2.5">
              <Sparkles size={18} className="text-amber-300 shrink-0" />
              <h2 className="text-base sm:text-lg font-bold">
                {academicGoals.title}
              </h2>
            </div>

            <div className="p-5 sm:p-7 space-y-4">
              <div className="bg-[#FAF7F0] border-l-4 border-l-[#8B111A] p-4 rounded-r-lg">
                <p className="text-sm sm:text-base font-bold text-gray-900 leading-relaxed">
                  {academicGoals.mainGoal}
                </p>
              </div>

              <h3 className="text-sm font-bold text-[#016332]">
                {academicGoals.pointsIntro}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {academicGoals.points.map((pt, idx) => (
                  <div
                    key={idx}
                    className="bg-[#FAF7F0]/60 border border-gray-200/90 rounded-lg p-3 flex items-start gap-2.5"
                  >
                    <CheckCircle2
                      size={16}
                      className="text-[#016332] shrink-0 mt-0.5"
                    />
                    <span className="text-xs sm:text-sm font-medium text-gray-800 leading-relaxed">
                      {pt}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* উপসংহার */}
          <section
            id="conclusion"
            className="bg-gradient-to-br from-[#014d26] via-[#016332] to-[#024222] text-white rounded-xl border-2 border-[#D9822B] shadow-md overflow-hidden scroll-mt-16"
          >
            <div className="px-5 sm:px-7 py-4 border-b border-emerald-700/70 flex items-center gap-2.5">
              <ShieldCheck size={20} className="text-amber-300 shrink-0" />
              <h2 className="text-base sm:text-lg font-bold text-amber-200">
                {conclusion.title}
              </h2>
            </div>

            <div className="p-5 sm:p-7 space-y-4">
              {conclusion.paragraphs.map((p, idx) => (
                <p
                  key={idx}
                  className="text-sm sm:text-base text-emerald-50 leading-relaxed text-justify"
                >
                  {p}
                </p>
              ))}

              <div className="pt-3 border-t border-emerald-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white">
                    {conclusion.footerName}
                  </h3>
                  <p className="text-xs sm:text-sm text-amber-300 font-semibold">
                    {conclusion.footerSlogan}
                  </p>
                </div>

                <Link
                  href="/apply"
                  className="inline-flex items-center gap-1.5 bg-[#8B111A] hover:bg-[#6e0b13] text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-md border border-amber-300/40 transition-colors self-start sm:self-center"
                >
                  <GraduationCap size={15} className="text-amber-300" />
                  <span><EditableText document="copy.ui.AcademicsPageSection" entry="e1wg0ehb" fallback={"ভর্তি আবেদন করুন"} /></span>
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

