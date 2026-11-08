"use client";

import { useState } from "react";
import Image from "next/image";
import { preparePrivatePhoto, useSubmission } from "@/lib/submissions/useSubmission";

import Link from "next/link";
import { 
  UserCheck, 
  User, 
  ShieldCheck, 
  Heart, 
  MapPin, 
  GraduationCap, 
  Camera, 
  Printer, 
  CheckCircle,
  Upload,
  ArrowRight
} from "lucide-react";
import { availableClasses as _fallback_availableClasses, siteSettings as _fallback_siteSettings } from "@/data/siteData";
import { useEditableData, EditableText as CmsText } from "@/content/client";

const formTranslations: Record<string, string> = {
  "Online Registration": "অনলাইন নিবন্ধন",
  "Student's Details": "শিক্ষার্থীর তথ্য",
  "Student Name: ": "শিক্ষার্থীর নাম: ",
  "Student UID:": "শিক্ষার্থীর পরিচিতি নম্বর:",
  "Date of Birth: ": "জন্ম তারিখ: ",
  "Birth Certificate Number:": "জন্ম নিবন্ধন নম্বর:",
  "Gender: ": "লিঙ্গ: ",
  "Male": "পুরুষ",
  "Female": "মহিলা",
  "Father's Details": "পিতার তথ্য",
  "Father's Name: ": "পিতার নাম: ",
  "Father's Profession:": "পিতার পেশা:",
  "Father's Mobile No.: ": "পিতার মোবাইল নম্বর: ",
  "Father's NID: ": "পিতার জাতীয় পরিচয়পত্র নম্বর: ",
  "Guardian Name:": "অভিভাবকের নাম:",
  "Relation:": "সম্পর্ক:",
  "Mother's Details": "মাতার তথ্য",
  "Mother's Name: ": "মাতার নাম: ",
  "Mother's Profession:": "মাতার পেশা:",
  "Mother's Mobile No:": "মাতার মোবাইল নম্বর:",
  "Mother's NID:": "মাতার জাতীয় পরিচয়পত্র নম্বর:",
  "Present Address": "বর্তমান ঠিকানা",
  "Country: ": "দেশ: ",
  "Bangladesh": "বাংলাদেশ",
  "Division: ": "বিভাগ: ",
  "Select Division": "বিভাগ নির্বাচন করুন",
  "District: ": "জেলা: ",
  "Select District": "জেলা নির্বাচন করুন",
  "Upazila/Thana: ": "উপজেলা/থানা: ",
  "Select Upazila/Thana": "উপজেলা/থানা নির্বাচন করুন",
  "Post Office: ": "ডাকঘর: ",
  "Post Office:": "ডাকঘর:",
  "Postal Code:": "ডাক কোড:",
  "Village: ": "গ্রাম: ",
  "Village:": "গ্রাম:",
  "Same as Present Address": "বর্তমান ঠিকানার মতো একই",
  "Permanent Address": "স্থায়ী ঠিকানা",
  "Admission For": "ভর্তির তথ্য",
  "Class: ": "শ্রেণি: ",
  "Select Class": "শ্রেণি নির্বাচন করুন",
  "Group: ": "বিভাগ: ",
  "Select Group": "বিভাগ নির্বাচন করুন",
  "Year: ": "শিক্ষাবর্ষ: ",
  "Select Year": "শিক্ষাবর্ষ নির্বাচন করুন",
  "Student's Image:": "শিক্ষার্থীর ছবি:",
  "Student Photo": "শিক্ষার্থীর ছবি",
  "ছবি নির্বাচন করুন (Browse...)": "ছবি নির্বাচন করুন",
  "পাসপোর্ট সাইজের রঙিন ছবি আপলোড করুন (সর্বোচ্চ 2MB, JPG/PNG)।": "পাসপোর্ট সাইজের রঙিন ছবি আপলোড করুন (সর্বোচ্চ ২ মেগাবাইট, জেপিজি/পিএনজি)।",
  "Next / আবেদন সম্পন্ন করুন": "আবেদন সম্পন্ন করুন",
  "ভর্তি আবেদন স্লিপ (Application Slip)": "ভর্তি আবেদন স্লিপ"
};
const optionTranslations: Record<string, string> = {
  "Dhaka": "ঢাকা",
  "Chittagong": "চট্টগ্রাম",
  "Rajshahi": "রাজশাহী",
  "Khulna": "খুলনা",
  "Barisal": "বরিশাল",
  "Sylhet": "সিলেট",
  "Rangpur": "রংপুর",
  "Mymensingh": "ময়মনসিংহ",
  "Gazipur": "গাজীপুর",
  "Narayanganj": "নারায়ণগঞ্জ",
  "Narsingdi": "নরসিংদী",
  "Tangail": "টাঙ্গাইল",
  "Manikganj": "মানিকগঞ্জ",
  "Munshiganj": "মুন্সিগঞ্জ",
  "Kishoreganj": "কিশোরগঞ্জ",
  "Faridpur": "ফরিদপুর",
  "Cumilla": "কুমিল্লা",
  "Bogura": "বগুড়া",
  "Tongi": "টঙ্গী",
  "Gazipur Sadar": "গাজীপুর সদর",
  "Kaliakair": "কালিয়াকৈর",
  "Kapasia": "কাপাসিয়া",
  "Kaliganj": "কালীগঞ্জ",
  "Sreepur": "শ্রীপুর",
  "Savar": "সাভার",
  "Uttara": "উত্তরা",
  "Mirpur": "মিরপুর",
  "Dhamrai": "ধামরাই",
  "General (সাধারণ)": "সাধারণ",
  "বিজ্ঞান (Science)": "বিজ্ঞান",
  "মানবিক (Humanities)": "মানবিক"
};
function EditableText(props: React.ComponentProps<typeof CmsText>) { return <CmsText {...props} translations={formTranslations} />; }

const divisions = [
  "Dhaka",
  "Chittagong",
  "Rajshahi",
  "Khulna",
  "Barisal",
  "Sylhet",
  "Rangpur",
  "Mymensingh",
];

const districts = [
  "Gazipur",
  "Dhaka",
  "Narayanganj",
  "Narsingdi",
  "Tangail",
  "Manikganj",
  "Munshiganj",
  "Kishoreganj",
  "Faridpur",
  "Cumilla",
  "Bogura",
  "Sylhet",
];

const upazilas = [
  "Tongi",
  "Gazipur Sadar",
  "Kaliakair",
  "Kapasia",
  "Kaliganj",
  "Sreepur",
  "Savar",
  "Uttara",
  "Mirpur",
  "Dhamrai",
];

const groups = [
  "General (সাধারণ)",
  "কওমী নেসাব",
  "হিফজুল কুরআন বিভাগ",
  "মাদানী নেসাব (কিতাব)",
  "বিজ্ঞান (Science)",
  "মানবিক (Humanities)",
];

const admissionYears = ["2026", "2025", "2024"];

const residentialTypes = ["অনাবাসিক", "আবাসিক", "ডে-কেয়ার"];

export default function ApplyOnlineForm() {
  const availableClasses = useEditableData("copy.data.availableClasses", _fallback_availableClasses);
  const siteSettings = useEditableData("siteSettings", _fallback_siteSettings);

  const [formData, setFormData] = useState({
    // Student's Details (Part 1)
    studentName: "",
    studentUid: "",
    dateOfBirth: "",
    birthCertificateNumber: "",
    gender: "Male",

    // Father's Details (Part 1)
    fatherName: "",
    fatherProfession: "",
    fatherMobile: "",
    fatherNid: "",
    guardianName: "",
    guardianRelation: "",

    // Mother's Details (Part 1)
    motherName: "",
    motherProfession: "",
    motherMobile: "",
    motherNid: "",

    // Present Address (Part 2)
    presentCountry: "Bangladesh",
    presentDivision: "",
    presentDistrict: "",
    presentUpazila: "",
    presentPostOffice: "",
    presentPostalCode: "",
    presentVillage: "",

    // Permanent Address (Part 2)
    sameAsPresent: false,
    permanentCountry: "Bangladesh",
    permanentDivision: "",
    permanentDistrict: "",
    permanentUpazila: "",
    permanentPostOffice: "",
    permanentPostalCode: "",
    permanentVillage: "",

    // Admission For (Part 2)
    admissionClass: "",
    admissionGroup: "",
    admissionYear: "2026",
    residentialStatus: "অনাবাসিক",
  });

  const [studentImage, setStudentImage] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState("");
  const [preparingPhoto, setPreparingPhoto] = useState(false);
  const { submit, isSubmitting, error } = useSubmission("/api/apply");
  const [submittedApplication, setSubmittedApplication] = useState<{
    appId: string;
    date: string;
  } | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setFormData((prev) => {
      if (checked) {
        return {
          ...prev,
          sameAsPresent: true,
          permanentCountry: prev.presentCountry,
          permanentDivision: prev.presentDivision,
          permanentDistrict: prev.presentDistrict,
          permanentUpazila: prev.presentUpazila,
          permanentPostOffice: prev.presentPostOffice,
          permanentPostalCode: prev.presentPostalCode,
          permanentVillage: prev.presentVillage,
        };
      } else {
        return {
          ...prev,
          sameAsPresent: false,
        };
      }
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreparingPhoto(true);
      try { setPhotoError(""); setStudentImage(await preparePrivatePhoto(file)); }
      catch (failure) { setPhotoError(failure instanceof Error ? failure.message : "ছবি প্রস্তুত করা যায়নি।"); }
      finally { setPreparingPhoto(false); }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (photoError || preparingPhoto) return;
    const saved = await submit({ ...formData, studentImage });
    if (saved) {
      setSubmittedApplication({
        appId: saved.reference,
        date: new Date().toLocaleDateString("bn-BD", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
      });
    }
  };

  return (
    <article className="bg-white rounded border border-gray-200 shadow-xs overflow-hidden">
      {/* Top Admission Rules Link Notice */}
      <div className="bg-amber-50 border-b border-amber-200 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs text-amber-900">
        <span className="font-medium"><EditableText document="copy.ui.ApplyOnlineForm" entry="e11j42up" fallback={"ভর্তি সংক্রান্ত বিভাগভিত্তিক নিয়মাবলি, বয়সসীমা, আসন সংখ্যা ও ফি তালিকা দেখতে:"} /></span>
        <Link
          href="/admission"
          className="font-bold text-[#014d26] hover:text-[#8B111A] inline-flex items-center gap-1 underline underline-offset-2"
        >
          <span><EditableText document="copy.ui.ApplyOnlineForm" entry="e159y87w" fallback={"ভর্তি তথ্য ও নির্দেশিকা পাতা দেখুন"} /></span>
          <ArrowRight size={13} />
        </Link>
      </div>

      {/* Header Bar matching deep purple from screenshot */}
      <div className="bg-[#371b61] text-white px-4 py-2.5 flex items-center justify-center font-bold text-sm sm:text-base shadow-xs">
        <div className="flex items-center gap-2">
          <UserCheck size={18} />
          <span><EditableText document="copy.ui.ApplyOnlineForm" entry="epyabya" fallback={"Online Registration"} /></span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-4 sm:p-6 md:p-8 space-y-8">
        {(error || photoError) && <p role="alert" className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error || photoError}</p>}
        {/* =========================================
            SECTION 1: Student's Details (Part 1)
        ========================================= */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 pb-1.5 border-b border-gray-200">
            <User size={16} className="text-[#371b61]" />
            <h3 className="font-bold text-sm sm:text-base text-[#1b3a4b]"><EditableText document="copy.ui.ApplyOnlineForm" entry="e19cij18" fallback={"Student&apos;s Details"} /></h3>
          </div>

          <div className="space-y-4">
            {/* Row 1: Student Name (Full Width) */}
            <div>
              <label
                htmlFor="studentName"
                className="block text-xs sm:text-[13px] font-semibold text-gray-700 mb-1"
              ><EditableText document="copy.ui.ApplyOnlineForm" entry="e53o3qz" fallback={"Student Name: "} /><span className="text-red-500"><EditableText document="copy.ui.ApplyOnlineForm" entry="e1yzxjp9" fallback={"*"} /></span>
              </label>
              <input
                id="studentName"
                name="studentName"
                type="text"
                required
                placeholder="শিক্ষার্থীর নাম লিখুন"
                value={formData.studentName}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs sm:text-sm text-gray-800 bg-white focus:outline-none focus:border-[#371b61] focus:ring-1 focus:ring-[#371b61] transition-all placeholder:text-gray-400"
              />
            </div>

            {/* Row 2: Student UID (Left) & Date of Birth (Right) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="studentUid"
                  className="block text-xs sm:text-[13px] font-semibold text-gray-700 mb-1"
                ><EditableText document="copy.ui.ApplyOnlineForm" entry="ecai6sk" fallback={"Student UID:"} /></label>
                <input
                  id="studentUid"
                  name="studentUid"
                  type="text"
                  placeholder="পরিচিতি নম্বর লিখুন"
                  value={formData.studentUid}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs sm:text-sm text-gray-800 bg-white focus:outline-none focus:border-[#371b61] focus:ring-1 focus:ring-[#371b61] transition-all placeholder:text-gray-400"
                />
              </div>

              <div>
                <label
                  htmlFor="dateOfBirth"
                  className="block text-xs sm:text-[13px] font-semibold text-gray-700 mb-1"
                ><EditableText document="copy.ui.ApplyOnlineForm" entry="e1w99x93" fallback={"Date of Birth: "} /><span className="text-red-500"><EditableText document="copy.ui.ApplyOnlineForm" entry="e1q2uv5m" fallback={"*"} /></span>
                </label>
                <input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  required
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs sm:text-sm text-gray-800 bg-white focus:outline-none focus:border-[#371b61] focus:ring-1 focus:ring-[#371b61] transition-all cursor-pointer"
                />
              </div>
            </div>

            {/* Row 3: Birth Certificate Number (Left) & Gender (Right) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <div>
                <label
                  htmlFor="birthCertificateNumber"
                  className="block text-xs sm:text-[13px] font-semibold text-gray-700 mb-1"
                ><EditableText document="copy.ui.ApplyOnlineForm" entry="e11izja9" fallback={"Birth Certificate Number:"} /></label>
                <input
                  id="birthCertificateNumber"
                  name="birthCertificateNumber"
                  type="text"
                  placeholder="জন্ম নিবন্ধন নম্বর লিখুন"
                  value={formData.birthCertificateNumber}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs sm:text-sm text-gray-800 bg-white focus:outline-none focus:border-[#371b61] focus:ring-1 focus:ring-[#371b61] transition-all placeholder:text-gray-400"
                />
              </div>

              <div>
                <span className="block text-xs sm:text-[13px] font-semibold text-gray-700 mb-2"><EditableText document="copy.ui.ApplyOnlineForm" entry="e1z0t3q3" fallback={"Gender: "} /><span className="text-red-500"><EditableText document="copy.ui.ApplyOnlineForm" entry="e2vyk4g" fallback={"*"} /></span>
                </span>
                <div className="flex items-center gap-6 pt-0.5">
                  <label className="inline-flex items-center gap-2 text-xs sm:text-sm text-gray-700 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value="Male"
                      checked={formData.gender === "Male"}
                      onChange={handleChange}
                      className="text-[#371b61] focus:ring-[#371b61] cursor-pointer"
                    />
                    <span><EditableText document="copy.ui.ApplyOnlineForm" entry="eaathth" fallback={"Male"} /></span>
                  </label>
                  <label className="inline-flex items-center gap-2 text-xs sm:text-sm text-gray-700 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value="Female"
                      checked={formData.gender === "Female"}
                      onChange={handleChange}
                      className="text-[#371b61] focus:ring-[#371b61] cursor-pointer"
                    />
                    <span><EditableText document="copy.ui.ApplyOnlineForm" entry="eiw6sbb" fallback={"Female"} /></span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================
            SECTION 2: Father's Details (Part 1)
        ========================================= */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 pb-1.5 border-b border-gray-200">
            <ShieldCheck size={16} className="text-[#371b61]" />
            <h3 className="font-bold text-sm sm:text-base text-[#1b3a4b]"><EditableText document="copy.ui.ApplyOnlineForm" entry="e741lvo" fallback={"Father&apos;s Details"} /></h3>
          </div>

          <div className="space-y-4">
            {/* Row 1: Father's Name & Father's Profession */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="fatherName"
                  className="block text-xs sm:text-[13px] font-semibold text-gray-700 mb-1"
                ><EditableText document="copy.ui.ApplyOnlineForm" entry="e1rkd4ce" fallback={"Father&apos;s Name: "} /><span className="text-red-500"><EditableText document="copy.ui.ApplyOnlineForm" entry="e1ry3mkp" fallback={"*"} /></span>
                </label>
                <input
                  id="fatherName"
                  name="fatherName"
                  type="text"
                  required
                  placeholder="পিতার নাম লিখুন"
                  value={formData.fatherName}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs sm:text-sm text-gray-800 bg-white focus:outline-none focus:border-[#371b61] focus:ring-1 focus:ring-[#371b61] transition-all placeholder:text-gray-400"
                />
              </div>

              <div>
                <label
                  htmlFor="fatherProfession"
                  className="block text-xs sm:text-[13px] font-semibold text-gray-700 mb-1"
                ><EditableText document="copy.ui.ApplyOnlineForm" entry="e1eidpfv" fallback={"Father&apos;s Profession:"} /></label>
                <input
                  id="fatherProfession"
                  name="fatherProfession"
                  type="text"
                  placeholder="পিতার পেশা লিখুন"
                  value={formData.fatherProfession}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs sm:text-sm text-gray-800 bg-white focus:outline-none focus:border-[#371b61] focus:ring-1 focus:ring-[#371b61] transition-all placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Row 2: Father's Mobile No. & Father's NID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="fatherMobile"
                  className="block text-xs sm:text-[13px] font-semibold text-gray-700 mb-1"
                ><EditableText document="copy.ui.ApplyOnlineForm" entry="ekr40h3" fallback={"Father&apos;s Mobile No.: "} /><span className="text-red-500"><EditableText document="copy.ui.ApplyOnlineForm" entry="e143kgtd" fallback={"*"} /></span>
                </label>
                <input
                  id="fatherMobile"
                  name="fatherMobile"
                  type="tel"
                  required
                  placeholder="পিতার মোবাইল নম্বর লিখুন"
                  value={formData.fatherMobile}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs sm:text-sm text-gray-800 bg-white focus:outline-none focus:border-[#371b61] focus:ring-1 focus:ring-[#371b61] transition-all placeholder:text-gray-400"
                />
              </div>

              <div>
                <label
                  htmlFor="fatherNid"
                  className="block text-xs sm:text-[13px] font-semibold text-gray-700 mb-1"
                ><EditableText document="copy.ui.ApplyOnlineForm" entry="ey92oh9" fallback={"Father&apos;s NID: "} /><span className="text-red-500"><EditableText document="copy.ui.ApplyOnlineForm" entry="e1mtw4rz" fallback={"*"} /></span>
                </label>
                <input
                  id="fatherNid"
                  name="fatherNid"
                  type="text"
                  required
                  placeholder="পিতার জাতীয় পরিচয়পত্র নম্বর লিখুন"
                  value={formData.fatherNid}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs sm:text-sm text-gray-800 bg-white focus:outline-none focus:border-[#371b61] focus:ring-1 focus:ring-[#371b61] transition-all placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Row 3: Guardian Name & Relation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="guardianName"
                  className="block text-xs sm:text-[13px] font-semibold text-gray-700 mb-1"
                ><EditableText document="copy.ui.ApplyOnlineForm" entry="ejr9ia7" fallback={"Guardian Name:"} /></label>
                <input
                  id="guardianName"
                  name="guardianName"
                  type="text"
                  placeholder="অভিভাবকের নাম লিখুন"
                  value={formData.guardianName}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs sm:text-sm text-gray-800 bg-white focus:outline-none focus:border-[#371b61] focus:ring-1 focus:ring-[#371b61] transition-all placeholder:text-gray-400"
                />
              </div>

              <div>
                <label
                  htmlFor="guardianRelation"
                  className="block text-xs sm:text-[13px] font-semibold text-gray-700 mb-1"
                ><EditableText document="copy.ui.ApplyOnlineForm" entry="e1ywsi5z" fallback={"Relation:"} /></label>
                <input
                  id="guardianRelation"
                  name="guardianRelation"
                  type="text"
                  placeholder="সম্পর্ক লিখুন"
                  value={formData.guardianRelation}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs sm:text-sm text-gray-800 bg-white focus:outline-none focus:border-[#371b61] focus:ring-1 focus:ring-[#371b61] transition-all placeholder:text-gray-400"
                />
              </div>
            </div>
          </div>
        </section>

        {/* =========================================
            SECTION 3: Mother's Details (Part 1)
        ========================================= */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 pb-1.5 border-b border-gray-200">
            <Heart size={16} className="text-[#371b61]" />
            <h3 className="font-bold text-sm sm:text-base text-[#1b3a4b]"><EditableText document="copy.ui.ApplyOnlineForm" entry="e1cbl3z0" fallback={"Mother&apos;s Details"} /></h3>
          </div>

          <div className="space-y-4">
            {/* Row 1: Mother's Name & Mother's Profession */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="motherName"
                  className="block text-xs sm:text-[13px] font-semibold text-gray-700 mb-1"
                ><EditableText document="copy.ui.ApplyOnlineForm" entry="e1jt7hx" fallback={"Mother&apos;s Name: "} /><span className="text-red-500"><EditableText document="copy.ui.ApplyOnlineForm" entry="e5a6dng" fallback={"*"} /></span>
                </label>
                <input
                  id="motherName"
                  name="motherName"
                  type="text"
                  required
                  placeholder="মাতার নাম লিখুন"
                  value={formData.motherName}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs sm:text-sm text-gray-800 bg-white focus:outline-none focus:border-[#371b61] focus:ring-1 focus:ring-[#371b61] transition-all placeholder:text-gray-400"
                />
              </div>

              <div>
                <label
                  htmlFor="motherProfession"
                  className="block text-xs sm:text-[13px] font-semibold text-gray-700 mb-1"
                ><EditableText document="copy.ui.ApplyOnlineForm" entry="e1rfgkdp" fallback={"Mother&apos;s Profession:"} /></label>
                <input
                  id="motherProfession"
                  name="motherProfession"
                  type="text"
                  placeholder="মাতার পেশা লিখুন"
                  value={formData.motherProfession}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs sm:text-sm text-gray-800 bg-white focus:outline-none focus:border-[#371b61] focus:ring-1 focus:ring-[#371b61] transition-all placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Row 2: Mother's Mobile No. & Mother's NID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="motherMobile"
                  className="block text-xs sm:text-[13px] font-semibold text-gray-700 mb-1"
                ><EditableText document="copy.ui.ApplyOnlineForm" entry="e1ekzz24" fallback={"Mother&apos;s Mobile No:"} /></label>
                <input
                  id="motherMobile"
                  name="motherMobile"
                  type="tel"
                  placeholder="মাতার মোবাইল নম্বর লিখুন"
                  value={formData.motherMobile}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs sm:text-sm text-gray-800 bg-white focus:outline-none focus:border-[#371b61] focus:ring-1 focus:ring-[#371b61] transition-all placeholder:text-gray-400"
                />
              </div>

              <div>
                <label
                  htmlFor="motherNid"
                  className="block text-xs sm:text-[13px] font-semibold text-gray-700 mb-1"
                ><EditableText document="copy.ui.ApplyOnlineForm" entry="etblhdc" fallback={"Mother&apos;s NID:"} /></label>
                <input
                  id="motherNid"
                  name="motherNid"
                  type="text"
                  placeholder="মাতার জাতীয় পরিচয়পত্র নম্বর লিখুন"
                  value={formData.motherNid}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs sm:text-sm text-gray-800 bg-white focus:outline-none focus:border-[#371b61] focus:ring-1 focus:ring-[#371b61] transition-all placeholder:text-gray-400"
                />
              </div>
            </div>
          </div>
        </section>

        {/* =========================================
            SECTION 4: Present Address (Part 2)
        ========================================= */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 pb-1.5 border-b border-gray-200">
            <MapPin size={16} className="text-[#371b61]" />
            <h3 className="font-bold text-sm sm:text-base text-[#1b3a4b]"><EditableText document="copy.ui.ApplyOnlineForm" entry="eyd9b0w" fallback={"Present Address"} /></h3>
          </div>

          <div className="space-y-4">
            {/* Row 1: Country & Division */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="presentCountry"
                  className="block text-xs sm:text-[13px] font-semibold text-gray-700 mb-1"
                ><EditableText document="copy.ui.ApplyOnlineForm" entry="ev0eudg" fallback={"Country: "} /><span className="text-red-500"><EditableText document="copy.ui.ApplyOnlineForm" entry="endnt3v" fallback={"*"} /></span>
                </label>
                <select
                  id="presentCountry"
                  name="presentCountry"
                  value={formData.presentCountry}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs sm:text-sm text-gray-800 bg-white focus:outline-none focus:border-[#371b61] focus:ring-1 focus:ring-[#371b61] cursor-pointer"
                >
                  <option value="Bangladesh"><EditableText plain document="copy.ui.ApplyOnlineForm" entry="e7n09ji" fallback={"Bangladesh"} /></option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="presentDivision"
                  className="block text-xs sm:text-[13px] font-semibold text-gray-700 mb-1"
                ><EditableText document="copy.ui.ApplyOnlineForm" entry="ekozygi" fallback={"Division: "} /><span className="text-red-500"><EditableText document="copy.ui.ApplyOnlineForm" entry="ejvm9z7" fallback={"*"} /></span>
                </label>
                <select
                  id="presentDivision"
                  name="presentDivision"
                  required
                  value={formData.presentDivision}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs sm:text-sm text-gray-800 bg-white focus:outline-none focus:border-[#371b61] focus:ring-1 focus:ring-[#371b61] cursor-pointer"
                >
                  <option value=""><EditableText plain document="copy.ui.ApplyOnlineForm" entry="e1s90hid" fallback={"Select Division"} /></option>
                  {divisions.map((div) => (
                    <option key={div} value={div}>
                      {optionTranslations[div] ?? div}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 2: District & Upazila/Thana */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="presentDistrict"
                  className="block text-xs sm:text-[13px] font-semibold text-gray-700 mb-1"
                ><EditableText document="copy.ui.ApplyOnlineForm" entry="e1ku5jtc" fallback={"District: "} /><span className="text-red-500"><EditableText document="copy.ui.ApplyOnlineForm" entry="emq3k3d" fallback={"*"} /></span>
                </label>
                <select
                  id="presentDistrict"
                  name="presentDistrict"
                  required
                  value={formData.presentDistrict}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs sm:text-sm text-gray-800 bg-white focus:outline-none focus:border-[#371b61] focus:ring-1 focus:ring-[#371b61] cursor-pointer"
                >
                  <option value=""><EditableText plain document="copy.ui.ApplyOnlineForm" entry="e1lismnc" fallback={"Select District"} /></option>
                  {districts.map((dist) => (
                    <option key={dist} value={dist}>
                      {optionTranslations[dist] ?? dist}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="presentUpazila"
                  className="block text-xs sm:text-[13px] font-semibold text-gray-700 mb-1"
                ><EditableText document="copy.ui.ApplyOnlineForm" entry="e3bu9ue" fallback={"Upazila/Thana: "} /><span className="text-red-500"><EditableText document="copy.ui.ApplyOnlineForm" entry="e15km1xo" fallback={"*"} /></span>
                </label>
                <select
                  id="presentUpazila"
                  name="presentUpazila"
                  required
                  value={formData.presentUpazila}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs sm:text-sm text-gray-800 bg-white focus:outline-none focus:border-[#371b61] focus:ring-1 focus:ring-[#371b61] cursor-pointer"
                >
                  <option value=""><EditableText plain document="copy.ui.ApplyOnlineForm" entry="e1nbkejo" fallback={"Select Upazila/Thana"} /></option>
                  {upazilas.map((upa) => (
                    <option key={upa} value={upa}>
                      {optionTranslations[upa] ?? upa}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 3: Post Office & Postal Code */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="presentPostOffice"
                  className="block text-xs sm:text-[13px] font-semibold text-gray-700 mb-1"
                ><EditableText document="copy.ui.ApplyOnlineForm" entry="e1kybuqz" fallback={"Post Office: "} /><span className="text-red-500"><EditableText document="copy.ui.ApplyOnlineForm" entry="ekfy1bn" fallback={"*"} /></span>
                </label>
                <input
                  id="presentPostOffice"
                  name="presentPostOffice"
                  type="text"
                  required
                  placeholder="ডাকঘরের নাম লিখুন"
                  value={formData.presentPostOffice}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs sm:text-sm text-gray-800 bg-white focus:outline-none focus:border-[#371b61] focus:ring-1 focus:ring-[#371b61] transition-all placeholder:text-gray-400"
                />
              </div>

              <div>
                <label
                  htmlFor="presentPostalCode"
                  className="block text-xs sm:text-[13px] font-semibold text-gray-700 mb-1"
                ><EditableText document="copy.ui.ApplyOnlineForm" entry="eo9504b" fallback={"Postal Code:"} /></label>
                <input
                  id="presentPostalCode"
                  name="presentPostalCode"
                  type="text"
                  placeholder="ডাক কোড লিখুন"
                  value={formData.presentPostalCode}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs sm:text-sm text-gray-800 bg-white focus:outline-none focus:border-[#371b61] focus:ring-1 focus:ring-[#371b61] transition-all placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Row 4: Village / Street Address (Full Width) */}
            <div>
              <label
                htmlFor="presentVillage"
                className="block text-xs sm:text-[13px] font-semibold text-gray-700 mb-1"
              ><EditableText document="copy.ui.ApplyOnlineForm" entry="e1cs057e" fallback={"Village: "} /><span className="text-red-500"><EditableText document="copy.ui.ApplyOnlineForm" entry="e1rqb0qr" fallback={"*"} /></span>
              </label>
              <input
                id="presentVillage"
                name="presentVillage"
                type="text"
                required
                placeholder="গ্রাম বা ঠিকানা লিখুন"
                value={formData.presentVillage}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs sm:text-sm text-gray-800 bg-white focus:outline-none focus:border-[#371b61] focus:ring-1 focus:ring-[#371b61] transition-all placeholder:text-gray-400"
              />
            </div>

            {/* Same as Present Address Checkbox */}
            <div className="pt-2">
              <label className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.sameAsPresent}
                  onChange={handleCheckboxChange}
                  className="rounded text-[#371b61] focus:ring-[#371b61] cursor-pointer w-4 h-4"
                />
                <span><EditableText document="copy.ui.ApplyOnlineForm" entry="e1lx1wft" fallback={"Same as Present Address"} /></span>
              </label>
            </div>
          </div>
        </section>

        {/* =========================================
            SECTION 5: Permanent Address (Part 2)
        ========================================= */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 pb-1.5 border-b border-gray-200">
            <MapPin size={16} className="text-[#371b61]" />
            <h3 className="font-bold text-sm sm:text-base text-[#1b3a4b]"><EditableText document="copy.ui.ApplyOnlineForm" entry="e1hil1qm" fallback={"Permanent Address"} /></h3>
          </div>

          <div className="space-y-4">
            {/* Row 1: Country & Division */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="permanentCountry"
                  className="block text-xs sm:text-[13px] font-semibold text-gray-700 mb-1"
                ><EditableText document="copy.ui.ApplyOnlineForm" entry="e444ugp" fallback={"Country: "} /><span className="text-red-500"><EditableText document="copy.ui.ApplyOnlineForm" entry="e12i6fvn" fallback={"*"} /></span>
                </label>
                <select
                  id="permanentCountry"
                  name="permanentCountry"
                  value={formData.permanentCountry}
                  onChange={handleChange}
                  disabled={formData.sameAsPresent}
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs sm:text-sm text-gray-800 bg-white disabled:bg-gray-100 focus:outline-none focus:border-[#371b61] focus:ring-1 focus:ring-[#371b61] cursor-pointer"
                >
                  <option value="Bangladesh"><EditableText plain document="copy.ui.ApplyOnlineForm" entry="eiiep7r" fallback={"Bangladesh"} /></option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="permanentDivision"
                  className="block text-xs sm:text-[13px] font-semibold text-gray-700 mb-1"
                ><EditableText document="copy.ui.ApplyOnlineForm" entry="evekt51" fallback={"Division: "} /><span className="text-red-500"><EditableText document="copy.ui.ApplyOnlineForm" entry="e53xr2v" fallback={"*"} /></span>
                </label>
                <select
                  id="permanentDivision"
                  name="permanentDivision"
                  required
                  value={formData.permanentDivision}
                  onChange={handleChange}
                  disabled={formData.sameAsPresent}
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs sm:text-sm text-gray-800 bg-white disabled:bg-gray-100 focus:outline-none focus:border-[#371b61] focus:ring-1 focus:ring-[#371b61] cursor-pointer"
                >
                  <option value=""><EditableText plain document="copy.ui.ApplyOnlineForm" entry="e9upicm" fallback={"Select Division"} /></option>
                  {divisions.map((div) => (
                    <option key={div} value={div}>
                      {optionTranslations[div] ?? div}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 2: District & Upazila/Thana */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="permanentDistrict"
                  className="block text-xs sm:text-[13px] font-semibold text-gray-700 mb-1"
                ><EditableText document="copy.ui.ApplyOnlineForm" entry="eyoosec" fallback={"District: "} /><span className="text-red-500"><EditableText document="copy.ui.ApplyOnlineForm" entry="ev28ts3" fallback={"*"} /></span>
                </label>
                <select
                  id="permanentDistrict"
                  name="permanentDistrict"
                  required
                  value={formData.permanentDistrict}
                  onChange={handleChange}
                  disabled={formData.sameAsPresent}
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs sm:text-sm text-gray-800 bg-white disabled:bg-gray-100 focus:outline-none focus:border-[#371b61] focus:ring-1 focus:ring-[#371b61] cursor-pointer"
                >
                  <option value=""><EditableText plain document="copy.ui.ApplyOnlineForm" entry="eud2vzn" fallback={"Select District"} /></option>
                  {districts.map((dist) => (
                    <option key={dist} value={dist}>
                      {optionTranslations[dist] ?? dist}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="permanentUpazila"
                  className="block text-xs sm:text-[13px] font-semibold text-gray-700 mb-1"
                ><EditableText document="copy.ui.ApplyOnlineForm" entry="e9prvi7" fallback={"Upazila/Thana: "} /><span className="text-red-500"><EditableText document="copy.ui.ApplyOnlineForm" entry="e1j242ep" fallback={"*"} /></span>
                </label>
                <select
                  id="permanentUpazila"
                  name="permanentUpazila"
                  required
                  value={formData.permanentUpazila}
                  onChange={handleChange}
                  disabled={formData.sameAsPresent}
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs sm:text-sm text-gray-800 bg-white disabled:bg-gray-100 focus:outline-none focus:border-[#371b61] focus:ring-1 focus:ring-[#371b61] cursor-pointer"
                >
                  <option value=""><EditableText plain document="copy.ui.ApplyOnlineForm" entry="e1m9zpdw" fallback={"Select Upazila/Thana"} /></option>
                  {upazilas.map((upa) => (
                    <option key={upa} value={upa}>
                      {optionTranslations[upa] ?? upa}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 3: Post Office & Postal Code */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="permanentPostOffice"
                  className="block text-xs sm:text-[13px] font-semibold text-gray-700 mb-1"
                ><EditableText document="copy.ui.ApplyOnlineForm" entry="e1mqd552" fallback={"Post Office:"} /></label>
                <input
                  id="permanentPostOffice"
                  name="permanentPostOffice"
                  type="text"
                  placeholder="ডাকঘরের নাম লিখুন"
                  value={formData.permanentPostOffice}
                  onChange={handleChange}
                  disabled={formData.sameAsPresent}
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs sm:text-sm text-gray-800 bg-white disabled:bg-gray-100 focus:outline-none focus:border-[#371b61] focus:ring-1 focus:ring-[#371b61] transition-all placeholder:text-gray-400"
                />
              </div>

              <div>
                <label
                  htmlFor="permanentPostalCode"
                  className="block text-xs sm:text-[13px] font-semibold text-gray-700 mb-1"
                ><EditableText document="copy.ui.ApplyOnlineForm" entry="e176gpum" fallback={"Postal Code:"} /></label>
                <input
                  id="permanentPostalCode"
                  name="permanentPostalCode"
                  type="text"
                  placeholder="ডাক কোড লিখুন"
                  value={formData.permanentPostalCode}
                  onChange={handleChange}
                  disabled={formData.sameAsPresent}
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs sm:text-sm text-gray-800 bg-white disabled:bg-gray-100 focus:outline-none focus:border-[#371b61] focus:ring-1 focus:ring-[#371b61] transition-all placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Row 4: Village (Full Width) */}
            <div>
              <label
                htmlFor="permanentVillage"
                className="block text-xs sm:text-[13px] font-semibold text-gray-700 mb-1"
              ><EditableText document="copy.ui.ApplyOnlineForm" entry="e1yabe52" fallback={"Village:"} /></label>
              <input
                id="permanentVillage"
                name="permanentVillage"
                type="text"
                placeholder="গ্রামের নাম লিখুন"
                value={formData.permanentVillage}
                onChange={handleChange}
                disabled={formData.sameAsPresent}
                className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs sm:text-sm text-gray-800 bg-white disabled:bg-gray-100 focus:outline-none focus:border-[#371b61] focus:ring-1 focus:ring-[#371b61] transition-all placeholder:text-gray-400"
              />
            </div>
          </div>
        </section>

        {/* =========================================
            SECTION 6: Admission For (Part 2)
        ========================================= */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 pb-1.5 border-b border-gray-200">
            <GraduationCap size={16} className="text-[#371b61]" />
            <h3 className="font-bold text-sm sm:text-base text-[#1b3a4b]"><EditableText document="copy.ui.ApplyOnlineForm" entry="e1eoapyj" fallback={"Admission For"} /></h3>
          </div>

          <div className="space-y-4">
            {/* Field: Class */}
            <div>
              <label
                htmlFor="admissionClass"
                className="block text-xs sm:text-[13px] font-semibold text-gray-700 mb-1"
              ><EditableText document="copy.ui.ApplyOnlineForm" entry="e66mpli" fallback={"Class: "} /><span className="text-red-500"><EditableText document="copy.ui.ApplyOnlineForm" entry="e11dx7ud" fallback={"*"} /></span>
              </label>
              <select
                id="admissionClass"
                name="admissionClass"
                required
                value={formData.admissionClass}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs sm:text-sm text-gray-800 bg-white focus:outline-none focus:border-[#371b61] focus:ring-1 focus:ring-[#371b61] cursor-pointer"
              >
                <option value=""><EditableText plain document="copy.ui.ApplyOnlineForm" entry="e1io3gke" fallback={"Select Class"} /></option>
                {availableClasses.map((cls) => (
                  <option key={cls.id} value={cls.name}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Field: Group */}
            <div>
              <label
                htmlFor="admissionGroup"
                className="block text-xs sm:text-[13px] font-semibold text-gray-700 mb-1"
              ><EditableText document="copy.ui.ApplyOnlineForm" entry="ev5zsag" fallback={"Group: "} /><span className="text-red-500"><EditableText document="copy.ui.ApplyOnlineForm" entry="eq449kh" fallback={"*"} /></span>
              </label>
              <select
                id="admissionGroup"
                name="admissionGroup"
                required
                value={formData.admissionGroup}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs sm:text-sm text-gray-800 bg-white focus:outline-none focus:border-[#371b61] focus:ring-1 focus:ring-[#371b61] cursor-pointer"
              >
                <option value=""><EditableText plain document="copy.ui.ApplyOnlineForm" entry="e1vf7f0y" fallback={"Select Group"} /></option>
                {groups.map((grp) => (
                  <option key={grp} value={grp}>
                    {optionTranslations[grp] ?? grp}
                  </option>
                ))}
              </select>
            </div>

            {/* Field: Year */}
            <div>
              <label
                htmlFor="admissionYear"
                className="block text-xs sm:text-[13px] font-semibold text-gray-700 mb-1"
              ><EditableText document="copy.ui.ApplyOnlineForm" entry="e1ebvlcx" fallback={"Year: "} /><span className="text-red-500"><EditableText document="copy.ui.ApplyOnlineForm" entry="el1f79m" fallback={"*"} /></span>
              </label>
              <select
                id="admissionYear"
                name="admissionYear"
                required
                value={formData.admissionYear}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs sm:text-sm text-gray-800 bg-white focus:outline-none focus:border-[#371b61] focus:ring-1 focus:ring-[#371b61] cursor-pointer"
              >
                <option value=""><EditableText plain document="copy.ui.ApplyOnlineForm" entry="e19rcwi" fallback={"Select Year"} /></option>
                {admissionYears.map((yr) => (
                  <option key={yr} value={yr}>
                    {yr}
                  </option>
                ))}
              </select>
            </div>

            {/* Field: আবাসিক / অনাবাসিক */}
            <div>
              <label
                htmlFor="residentialStatus"
                className="block text-xs sm:text-[13px] font-semibold text-gray-700 mb-1"
              ><EditableText document="copy.ui.ApplyOnlineForm" entry="eu7ldze" fallback={"আবাসিক / অনাবাসিক:"} /></label>
              <select
                id="residentialStatus"
                name="residentialStatus"
                value={formData.residentialStatus}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs sm:text-sm text-gray-800 bg-white focus:outline-none focus:border-[#371b61] focus:ring-1 focus:ring-[#371b61] cursor-pointer"
              >
                {residentialTypes.map((res) => (
                  <option key={res} value={res}>
                    {res}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* =========================================
            SECTION 7: Student's Image & Submit (Part 2)
        ========================================= */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 pb-1.5 border-b border-gray-200">
            <Camera size={16} className="text-[#371b61]" />
            <h3 className="font-bold text-sm sm:text-base text-[#1b3a4b]"><EditableText document="copy.ui.ApplyOnlineForm" entry="e9ojclg" fallback={"Student&apos;s Image:"} /></h3>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Image Preview Box matching screenshot */}
            <div className="w-32 h-36 border-2 border-dashed border-gray-300 rounded-md bg-gray-50 flex flex-col items-center justify-center overflow-hidden relative shadow-2xs">
              {studentImage ? (
                <Image
                  src={studentImage}
                  alt="শিক্ষার্থীর ছবির নমুনা"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="text-center p-2 text-gray-400">
                  <User size={40} className="mx-auto mb-1 opacity-60 text-gray-500" />
                  <span className="text-[10px] block leading-tight"><EditableText document="copy.ui.ApplyOnlineForm" entry="ed89olp" fallback={"Student Photo"} /></span>
                </div>
              )}
            </div>

            {/* Upload Button */}
            <div className="space-y-2">
              <label
                htmlFor="student-photo-upload"
                className="bg-[#371b61] hover:bg-[#251044] text-white text-xs font-semibold py-2 px-4 rounded shadow-xs transition-colors inline-flex items-center gap-2 cursor-pointer"
              >
                <Upload size={14} />
                <span><EditableText document="copy.ui.ApplyOnlineForm" entry="e1pldq0k" fallback={"ছবি নির্বাচন করুন (Browse...)"} /></span>
              </label>
              <input
                id="student-photo-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <p className="text-[11px] text-gray-500"><EditableText document="copy.ui.ApplyOnlineForm" entry="e1w92cvz" fallback={"পাসপোর্ট সাইজের রঙিন ছবি আপলোড করুন (সর্বোচ্চ 2MB, JPG/PNG)।"} /></p>
            </div>
          </div>
        </section>

        {/* Form Action / Green Next/Submit Button matching screenshot */}
        <div className="pt-4 border-t border-gray-200 flex items-center justify-end">
          <button
            type="submit"
            disabled={isSubmitting || preparingPhoto}
            className="bg-[#16a34a] hover:bg-[#15803d] text-white text-xs sm:text-sm font-bold py-2.5 px-8 rounded shadow-sm transition-all duration-150 inline-flex items-center gap-2 cursor-pointer transform hover:scale-[1.02]"
          >
            <span><EditableText document="copy.ui.ApplyOnlineForm" entry="e1s6qxm7" fallback={"Next / আবেদন সম্পন্ন করুন"} /></span>
            <ArrowRight size={15} />
          </button>
        </div>
      </form>

      {/* =========================================
          APPLICATION CONFIRMATION SLIP MODAL
      ========================================= */}
      {submittedApplication && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-lg shadow-2xl max-w-xl w-full overflow-hidden border border-gray-200 max-h-[95vh] flex flex-col">
            {/* Modal Header */}
            <div className="bg-[#126b59] text-white px-5 py-3.5 flex items-center justify-between">
              <h3 className="font-bold text-sm sm:text-base flex items-center gap-2">
                <CheckCircle size={18} /><EditableText document="copy.ui.ApplyOnlineForm" entry="ep9h5z9" fallback={"অনলাইন ভর্তি আবেদন সম্পন্ন হয়েছে"} /></h3>
              <button
                onClick={() => setSubmittedApplication(null)}
                className="text-white/80 hover:text-white p-1 rounded hover:bg-white/10"
              ><EditableText document="copy.ui.ApplyOnlineForm" entry="eakk5b5" fallback={"✕"} /></button>
            </div>

            {/* Modal Slip Body */}
            <div className="p-6 overflow-y-auto space-y-4 print:p-0">
              <div className="text-center pb-3 border-b-2 border-teal-800">
                <h2 className="text-lg font-bold text-gray-900">{siteSettings.nameBn}</h2>
                <p className="text-xs text-gray-600">{siteSettings.address}</p>
                <span className="inline-block mt-2 bg-[#371b61] text-white text-xs font-bold px-3 py-1 rounded"><EditableText document="copy.ui.ApplyOnlineForm" entry="esah45g" fallback={"ভর্তি আবেদন স্লিপ (Application Slip)"} /></span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs bg-gray-50 p-4 rounded border border-gray-200">
                <div>
                  <span className="text-gray-500"><EditableText document="copy.ui.ApplyOnlineForm" entry="e1ibsum8" fallback={"আবেদনপত্র নং:"} /></span>
                  <p className="font-mono font-bold text-sm text-[#8B111A]">
                    {submittedApplication.appId}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500"><EditableText document="copy.ui.ApplyOnlineForm" entry="e1kc2fem" fallback={"আবেদনের তারিখ:"} /></span>
                  <p className="font-bold text-gray-800">{submittedApplication.date}</p>
                </div>
                <div>
                  <span className="text-gray-500"><EditableText document="copy.ui.ApplyOnlineForm" entry="e1b240ol" fallback={"শিক্ষার্থীর নাম:"} /></span>
                  <p className="font-bold text-gray-900">{formData.studentName || "—"}</p>
                </div>
                <div>
                  <span className="text-gray-500"><EditableText document="copy.ui.ApplyOnlineForm" entry="e4g6b2y" fallback={"পিতার নাম:"} /></span>
                  <p className="font-bold text-gray-900">{formData.fatherName || "—"}</p>
                </div>
                <div>
                  <span className="text-gray-500"><EditableText document="copy.ui.ApplyOnlineForm" entry="e1ogc6iq" fallback={"পিতার মোবাইল:"} /></span>
                  <p className="font-mono text-gray-800">{formData.fatherMobile || "—"}</p>
                </div>
                <div>
                  <span className="text-gray-500"><EditableText document="copy.ui.ApplyOnlineForm" entry="efmu9d7" fallback={"ভর্তির শ্রেণি:"} /></span>
                  <p className="font-bold text-teal-800">{formData.admissionClass || "—"}</p>
                </div>
                <div>
                  <span className="text-gray-500"><EditableText document="copy.ui.ApplyOnlineForm" entry="e1r0rs3p" fallback={"বিভাগ / গ্রুপ:"} /></span>
                  <p className="font-medium text-gray-800">{formData.admissionGroup || "—"}</p>
                </div>
                <div>
                  <span className="text-gray-500"><EditableText document="copy.ui.ApplyOnlineForm" entry="e15j8ckk" fallback={"আবাসন ধরন:"} /></span>
                  <p className="font-medium text-gray-800">{formData.residentialStatus}</p>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-500"><EditableText document="copy.ui.ApplyOnlineForm" entry="ebbm7d8" fallback={"বর্তমান ঠিকানা:"} /></span>
                  <p className="text-gray-800">
                    {[
                      formData.presentVillage,
                      formData.presentPostOffice,
                      formData.presentUpazila,
                      formData.presentDistrict,
                    ]
                      .filter(Boolean)
                      .map((value) => optionTranslations[value] ?? value)
                      .join(", ") || "—"}
                  </p>
                </div>
              </div>

              <div className="bg-amber-50 p-3 rounded text-[11px] text-amber-900 border border-amber-200">
                <p className="font-bold mb-1"><EditableText document="copy.ui.ApplyOnlineForm" entry="e1kcp9mb" fallback={"গুরুত্বপূর্ণ নির্দেশনা:"} /></p>
                <p><EditableText document="copy.ui.ApplyOnlineForm" entry="ekamwjk" fallback={"এই স্লিপটি প্রিন্ট অথবা স্ক্রিনশট সংরক্ষণ করে রাখুন। ভর্তি পরীক্ষার দিন মূল কপি ও প্রয়োজনীয় কাগজপত্র সহ অফিসে উপস্থিত হতে হবে।"} /></p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex gap-3 print:hidden">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex-1 bg-[#126b59] hover:bg-[#0e5244] text-white py-2 rounded text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Printer size={15} />
                  <span><EditableText document="copy.ui.ApplyOnlineForm" entry="e1c8io94" fallback={"স্লিপ প্রিন্ট করুন"} /></span>
                </button>
                <button
                  type="button"
                  onClick={() => setSubmittedApplication(null)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded text-xs font-bold transition-colors cursor-pointer"
                ><EditableText document="copy.ui.ApplyOnlineForm" entry="einw4ji" fallback={"বন্ধ করুন"} /></button>
              </div>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
