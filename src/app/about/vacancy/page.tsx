import InstitutionalIdentity from "@/components/InstitutionalIdentity";
import PageSeo from "@/components/PageSeo";
import { editableRoute, editableMetadata } from "@/content/server";
import HeaderBanner from "@/components/HeaderBanner";
import NavigationBar from "@/components/NavigationBar";
import BreakingNewsBar from "@/components/BreakingNewsBar";
import Footer from "@/components/Footer";
import VacancyNoticeTable from "@/components/VacancyNoticeTable";
import { getVacancies } from "@/sanity/lib/queries";

export const generateMetadata = editableMetadata("/about/vacancy", {
  title: "Vacancy (Notice) | জামিয়া নেছারিয়া ইসলামিয়া টঙ্গী",
  description: "জামিয়া নেছারিয়া ইসলামিয়া টঙ্গীর সকল সাম্প্রতিক নিয়োগ বিজ্ঞপ্তি ও চাকরির সুযোগ।",
});

async function VacancyPage() {
  const records = (await getVacancies()).map((record) => ({ ...record, _type: "vacancy", id: record._id, postName: record.title, postingDate: record.postedAt || "", dateline: record.deadline, requirements: record.qualification, salary: record.salary, pdfUrl: record.pdfUrl }));
  return (
    <div className="min-h-screen bg-[#F0F2F5] flex flex-col">
      {/* 1. Top Identity Banner */}
      <HeaderBanner />

      {/* 2. Main Navigation Bar */}
      <NavigationBar />

      {/* 3. Breaking News / Notice Ticker Bar */}
      <BreakingNewsBar />

      {/* 4. Main Vacancy Notice Content Area */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-6 w-full flex-1">
        <PageSeo route="/about/vacancy" />
        <VacancyNoticeTable records={records} identity={<InstitutionalIdentity route="/about/vacancy" />} />
      </main>

      {/* 5. Footer */}
      <Footer />
    </div>
  );
}
export default editableRoute("/about/vacancy", VacancyPage);

