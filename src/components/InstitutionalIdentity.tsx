import { Calendar, MapPin, Phone } from "lucide-react";
import { aboutPageData as fallbackAbout, siteSettings as fallbackSettings } from "@/data/siteData";
import { EditableImage as Image, getEditableData, getFieldAttribute, EditableText } from "@/content/server";
import { fieldSource } from "@/content/model";
import { clean, getPageSeoRecords } from "@/lib/seo";
import { seoRoutes } from "@/data/seoData";

/** One CMS-backed institutional profile, shared by all existing identity cards. */
export default async function InstitutionalIdentity({ headingAs: Heading = "h2", route = "/about" }: { headingAs?: "h1" | "h2"; route?: string }) {
  const [data, siteSettings, pages, attribute] = await Promise.all([
    getEditableData("copy.data.aboutPageData", fallbackAbout),
    getEditableData("siteSettings", fallbackSettings), getPageSeoRecords(), getFieldAttribute(),
  ]);
  const { header } = data;
  const pageSeo = pages.find(page => clean(page.route) === route);
  const isAbout = route === "/about";
  return (<div data-institutional-identity className="p-6 sm:p-8 bg-gradient-to-b from-[#FAF7F0]/70 to-white">
          <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
            {/* Official Seal */}
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-3 border-[#8B111A] ring-4 ring-amber-100/80 p-0.5 bg-white shadow-md shrink-0 relative overflow-hidden">
              <Image document="copy.ui.AboutJamiaSection" entry="eoadomy" source={fieldSource(siteSettings, "logoUrl")}
                src={siteSettings.logoUrl || "/jamia-logo-v2.png"}
                alt={header.title}
                width={128}
                height={128}
                className="w-full h-full object-contain rounded-full scale-105"
              />
            </div>

            <div className="flex-1 space-y-2.5">
              <Heading className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#016332] tracking-tight" data-sanity={attribute(pageSeo, "pageHeading")}>
                {clean(pageSeo?.pageHeading, seoRoutes[route]?.label || seoRoutes["/about"].label)}
              </Heading>
              <p className="text-sm sm:text-base font-semibold text-gray-700">{header.title}</p>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-0.5">
                <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#8B111A] bg-amber-50 border border-[#D9822B]/40 px-3.5 py-1 rounded-full">
                  <Calendar size={14} className="text-[#8B111A]" />
                  <span>{header.established}</span>
                </span>
              </div>

              <p className="text-xs sm:text-sm md:text-[15px] text-gray-700 font-medium flex items-center justify-center md:justify-start gap-1.5 pt-0.5">
                <MapPin size={15} className="text-[#8B111A] shrink-0" />
                <span>{header.address}</span>
              </p>

              {isAbout ? <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-2 text-xs">
                <span className="bg-[#016332]/10 text-[#016332] border border-[#016332]/20 font-bold px-3 py-1 rounded-md"><EditableText document="copy.ui.AboutJamiaSection" entry="egsag8g" fallback={"আল-হাইআতুল উলয়া নিবন্ধন: ০০৬৮৫"} /></span>
                <span className="bg-[#8B111A]/10 text-[#8B111A] border border-[#8B111A]/20 font-bold px-3 py-1 rounded-md"><EditableText document="copy.ui.AboutJamiaSection" entry="e9c3s87" fallback={"বেফাক নিবন্ধন: ১/৭৪৩"} /></span>
                <span className="bg-amber-500/15 text-amber-900 border border-amber-500/30 font-bold px-3 py-1 rounded-md"><EditableText document="copy.ui.AboutJamiaSection" entry="evak6cg" fallback={"এতিমখানা নিবন্ধন (সমাজসেবা অধিদপ্তর): ঢ-০৫০৪"} /></span>
              </div> : <p className="text-xs sm:text-sm md:text-[15px] text-gray-700 font-medium flex items-center justify-center md:justify-start gap-1.5">
                <Phone size={15} className="text-[#8B111A] shrink-0" />
                <a href={`tel:${clean(siteSettings.phone, fallbackSettings.phone).replace(/[^+\d]/g, "")}`} data-sanity={attribute(siteSettings, "phone")}>{clean(siteSettings.phone, fallbackSettings.phone)}</a>
              </p>}
            </div>
          </div>
        </div>);
}
