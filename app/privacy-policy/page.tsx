import AnimatedSection from "@/components/AnimatedSection";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <AnimatedSection delay={0.1}>
        <h1 className="text-3xl font-bold text-cyan-400 mb-6">Privacy Policy</h1>
      </AnimatedSection>
      <AnimatedSection delay={0.2}>
        <div className="max-w-3xl text-gray-300 text-lg leading-relaxed mb-8">
          <p>
            This website does not collect any personal data from visitors. The information displayed (projects, experience, education) comes solely from my own GitHub account, and is used exclusively for presentation purposes on this portfolio.
          </p>
          <br />
          <p>
            No data is shared with third parties. API access is strictly limited to retrieving my own professional information for display on this site.
          </p>
          <br />
          <p>
            For any questions regarding privacy or data management, you can contact me at: <a href="mailto:ethan.orain@aivancity.education" className="text-cyan-400 underline">ethan.orain@aivancity.education</a>
          </p>
          <br />
          <p className="text-sm text-gray-500 mt-8">
            Last updated: July 2025
          </p>
        </div>
      </AnimatedSection>
    </div>
  );
} 