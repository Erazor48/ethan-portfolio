"use client"

// app/contact/page.tsx
import AnimatedSection from "@/components/AnimatedSection";
import { dataService } from "@/lib/services/data-service";
import { useEffect, useState } from "react";

export default function Contact() {
  const [personalInfo, setPersonalInfo] = useState<any>(null);
  const [socialLinks, setSocialLinks] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [personal, social] = await Promise.all([
          dataService.getPersonalInfo(),
          dataService.getSocialLinks()
        ]);
        setPersonalInfo(personal);
        setSocialLinks(social);
      } catch (error) {
        console.error('Error loading contact data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="bg-background p-8">
          <h1 className="text-3xl font-bold text-secondary-fg mb-12">Contact me</h1>
          <div className="animate-pulse">
            <div className="h-4 bg-muted-primary rounded mb-5 w-48"></div>
            <div className="h-4 bg-muted-primary rounded mb-5 w-48"></div>
            <div className="h-4 bg-muted-primary rounded mb-5 w-48"></div>
          </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-primary-fg p-8">
      <AnimatedSection delay={0.1}>
        <h1 className="text-3xl font-bold text-secondary-fg mb-6">Contact me</h1>
      </AnimatedSection>
      <AnimatedSection delay={0.2}>
        <p className="text-lg text-foreground mb-4">
          Don't hesitate to contact me for an internship or an AI project.
        </p>
      </AnimatedSection>
      <AnimatedSection delay={0.3}>
        <ul className="text-muted-primary-fg space-y-2">
          <li><strong>Email:</strong> {personalInfo?.email || "ethan.orain@aivancity.education"} </li>
          <li><strong>GitHub:</strong> <a href={socialLinks?.github || "https://github.com/Erazor48"} className="underline">github.com/Erazor48</a></li>
          <li><strong>LinkedIn:</strong> <a href={socialLinks?.linkedin || "https://www.linkedin.com/in/ethan-orain"} className="underline">linkedin.com/in/ethan-orain</a></li>
        </ul>
      </AnimatedSection>
    </div>
  );
}
  