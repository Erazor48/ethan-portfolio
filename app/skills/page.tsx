"use client"

import SkillsGrid from "@/components/SkillsGrid";
import { dataService } from "@/lib/services/data-service";
import { useEffect, useState } from "react";

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
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <h1 className="text-3xl font-bold text-cyan-400 mb-6">Skills</h1>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-700 rounded mb-4"></div>
          <div className="h-4 bg-gray-700 rounded mb-4"></div>
          <div className="h-4 bg-gray-700 rounded mb-4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold text-cyan-400 mb-6">Skills</h1>
      
      {/* Skills Overview */}
      <div className="mb-8">
        <p className="text-gray-300 text-lg leading-relaxed mb-6">
          Here's a comprehensive overview of my technical skills and competencies. 
          I focus on modern web development, AI/ML technologies, and creating scalable solutions.
        </p>
      </div>

      {/* Skills Grid */}
      <div className="mb-8">
        <SkillsGrid />
      </div>

      {/* Skills by Category */}
      {skills && (
        <div className="space-y-6">
          {Object.entries(skills).map(([category, skillList]: [string, string[]]) => (
            <div key={category} className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-xl font-bold text-cyan-400 mb-4 capitalize">
                {category.replace(/([A-Z])/g, ' $1').trim()}
              </h2>
              <div className="flex flex-wrap gap-2">
                {skillList.map((skill: string) => (
                  <span key={skill} className="bg-cyan-700 text-white px-3 py-1 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Back to About */}
      <div className="mt-8">
        <a href="/about" className="text-cyan-400 underline">← Back to About</a>
      </div>
    </div>
  );
} 