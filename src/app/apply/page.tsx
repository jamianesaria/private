import PageSeo from "@/components/PageSeo";
import { editableRoute, editableMetadata } from "@/content/server";
import HeaderBanner from "@/components/HeaderBanner";
import NavigationBar from "@/components/NavigationBar";
import BreakingNewsBar from "@/components/BreakingNewsBar";
import Footer from "@/components/Footer";
import ApplyOnlineForm from "@/components/ApplyOnlineForm";

// This route loads the CMS editing context before rendering in the local Next.js app.
// The Cloudflare site serves its published snapshot as static content.
export const instant = false;

export const generateMetadata = editableMetadata("/apply", {
  title: "অনলাইন ভর্তি আবেদন ফরম | জামিয়া নেছারিয়া ইসলামিয়া টঙ্গী",
  description:
    "জামিয়া নেছারিয়া ইসলামিয়া মাদরাসা ও এতিমখানায় অনলাইনে ভর্তির আবেদন ফরম (Online Admission Registration)।",
});

function ApplyPage() {
  return (
    <div className="min-h-screen bg-[#F0F2F5] flex flex-col">
      {/* 1. Top Identity Banner */}
      <HeaderBanner />

      {/* 2. Main Navigation Bar */}
      <NavigationBar />

      {/* 3. Breaking News / Notice Ticker Bar */}
      <BreakingNewsBar />

      {/* 4. Main Online Registration Form Content Area */}
      <main className="max-w-5xl mx-auto px-3 sm:px-4 py-6 w-full flex-1">
        <PageSeo route="/apply" />
        <ApplyOnlineForm />
      </main>

      {/* 5. Footer */}
      <Footer />
    </div>
  );
}
export default editableRoute("/apply", ApplyPage);
