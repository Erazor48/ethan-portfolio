"use client"

import AnimatedSection from "@/components/AnimatedSection";
import { dataService } from "@/lib/services/data-service";
import { useEffect, useState } from "react";

export default function PrivacyPolicy() {
  const [personalInfo, setPersonalInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [personal] = await Promise.all([
          dataService.getPersonalInfo(),
        ]);
        setPersonalInfo(personal);
      } catch (error) {
        console.error('Error loading privacy-policy data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="bg-background p-8">
        <h1 className="text-3xl font-bold text-secondary-fg mb-10">Privacy Policy</h1>
        <div className="animate-pulse">
          <div className="w-64 h-8 bg-muted-primary rounded mb-6"></div>
          <div className="w-64 h-8 bg-muted-primary rounded mb-6"></div>
          <div className="w-64 h-8 bg-muted-primary rounded mb-6"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-primary-fg p-8">
      <AnimatedSection delay={0.1}>
        <h1 className="text-3xl font-bold text-secondary-fg mb-6">Privacy Policy</h1>
      </AnimatedSection>
      <div className="max-w-3xl text-foreground text-lg leading-relaxed mb-8">
        <AnimatedSection delay={0.2}>
        <p>
          This website does not collect any personal data from visitors. The information displayed (projects, experience, education) comes solely from my own GitHub account, and is used exclusively for presentation purposes on this portfolio.
        </p>
        <br />
        </AnimatedSection>
        <AnimatedSection delay={0.3}>
        <p>
          No data is shared with third parties. API access is strictly limited to retrieving my own professional information for display on this site.
        </p>
        <br />
        </AnimatedSection>
        <AnimatedSection delay={0.4}>
        <p>
          For any questions regarding privacy or data management, you can contact me at: <a href={`mailto:${personalInfo.email || "ethan.orain@aivancity.education"}`} className="text-secondary-fg underline">{personalInfo.email || "ethan.orain@aivancity.education"}</a>
        </p>
        <br />
        </AnimatedSection>
        <AnimatedSection delay={0.5}>
        <p className="text-sm text-muted-secondary-fg mt-8">
          Last updated: July 2025
        </p>
        </AnimatedSection>
      </div>
    </div>
  );
} 