import InstitutionalIdentity from "./InstitutionalIdentity";

import { physicalInfrastructureData as _fallback_physicalInfrastructureData } from "@/data/siteData";
import { Building2, CheckCircle, ShieldCheck } from "lucide-react";
import { getEditableData, EditableText } from "@/content/server";


export default async function PhysicalInfrastructureSection() {
  const physicalInfrastructureData = await getEditableData("copy.data.physicalInfrastructureData", _fallback_physicalInfrastructureData);

  return (
    <article className="bg-white rounded-2xl border border-gray-200/90 shadow-xs overflow-hidden">
      {/* Header Bar */}
      <div className="bg-gradient-to-r from-[#016332] to-[#014222] text-white px-5 py-3.5 flex items-center gap-2.5 font-bold text-sm sm:text-base shadow-xs border-b-2 border-[#D9822B]">
        <Building2 size={18} className="text-[#ffd86b]" />
        <span>{physicalInfrastructureData.title}</span>
      </div>

      <div className="p-6 sm:p-10 space-y-8">
        {/* Center: Madrasa Logo and Identification */}
        <InstitutionalIdentity route="/about/infrastructure" />

        {/* Infrastructure Highlights Grid */}
        <div className="pt-6 border-t border-gray-200">
          <h4 className="text-base sm:text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <ShieldCheck size={20} className="text-[#016332]" />
            <span><EditableText document="copy.ui.PhysicalInfrastructureSection" entry="e2zmkay" fallback={"ভৌত অবকাঠামো ও প্রাতিষ্ঠানিক সুযোগ-সুবিধা"} /></span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {physicalInfrastructureData.features.map((feat, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-gray-200 bg-gray-50/60 hover:bg-[#016332]/[0.03] hover:border-[#016332]/30 transition-colors"
              >
                <div className="flex items-start gap-2.5">
                  <CheckCircle size={18} className="text-[#016332] shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-sm text-[#8B111A]">{feat.title}</h5>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

