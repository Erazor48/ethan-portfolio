"use client"

import SkillsGrid from "@/components/SkillsGrid";
import { dataService } from "@/lib/services/data-service";
import { useEffect, useState } from "react";
import AnimatedSection from "@/components/AnimatedSection";

export default function Skills() {
  const [skills, setSkills] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const skillsData = await dataService.getSkills?.();
        setSkills(skillsData);
      } catch (error) {
        console.error('Error loading skills:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-primary-fg p-8">
        <h1 className="text-3xl font-bold text-secondary-fg mb-6">Skills</h1>
        <div className="animate-pulse">
          <div className="h-4 bg-muted-primary rounded mb-4"></div>
          <div className="h-4 bg-muted-primary rounded mb-4"></div>
          <div className="h-4 bg-muted-primary rounded mb-4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-primary-fg p-8">
      <AnimatedSection delay={0.1}>
        <h1 className="text-3xl font-bold text-secondary-fg mb-6">Skills</h1>
      </AnimatedSection>
      <AnimatedSection delay={0.2}>
        {/* Skills Overview */}
        <div className="mb-8">
          <p className="text-foreground text-lg leading-relaxed mb-6">
            Here's a comprehensive overview of my technical skills and competencies. 
            I focus on modern web development, AI/ML technologies, and creating scalable solutions.
          </p>
        </div>
      </AnimatedSection>
      <AnimatedSection delay={0.3}>
        {/* Skills Grid */}
        <div className="mb-8">
          <SkillsGrid />
        </div>
      </AnimatedSection>
      <AnimatedSection delay={0.4}>
        {/* Skills by Category */}
        {skills && (
          <div className="space-y-6">
            {Object.entries(skills).map(([category, skillList]: [string, string[]]) => (
              <div key={category} className="bg-card p-6 rounded-lg">
                <h2 className="text-xl font-bold text-secondary-fg mb-4 capitalize">
                  {category.replace(/([A-Z])/g, ' $1').trim()}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {skillList.map((skill: string) => (
                    <span key={skill} className="bg-skills text-primary-fg px-3 py-1 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </AnimatedSection>
      <AnimatedSection delay={0.5}>
        {/* Back to About */}
        <div className="mt-8">
          <a href="/about" className="text-secondary-fg underline">← Back to About</a>
        </div>
      </AnimatedSection>
    </div>
  );
} 