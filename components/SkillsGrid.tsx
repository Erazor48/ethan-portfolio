"use client"

// components/SkillsGrid.tsx
import { dataService } from "@/lib/services/data-service";
import { useEffect, useState } from "react";

export default function SkillsGrid() {
  const [skills, setSkills] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSkills = async () => {
      try {
        const skillsData = await dataService.getSkills();
        setSkills(skillsData);
      } catch (error) {
        console.error('Error loading skills:', error);
        // Fallback to default skills
        setSkills({
          programming: ["Python", "C", "JavaScript"],
          frameworks: ["PyTorch", "LangChain", "Transformers"],
          tools: ["Cursor", "VS Code", "GitHub"],
          softSkills: ["Problem solving"]
        });
      } finally {
        setLoading(false);
      }
    };

    loadSkills();
  }, []);

  if (loading) {
    return (
      <section className="px-8 py-12 bg-gray-800">
        <h2 className="text-2xl font-bold text-cyan-400 mb-6">My Skills</h2>
        <div className="flex flex-wrap gap-4">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="bg-gray-700 h-8 w-20 rounded-full animate-pulse"
            />
          ))}
        </div>
      </section>
    );
  }

  // Combine all skills from different categories
  const allSkills = [
    ...(skills?.programming || []),
    ...(skills?.frameworks || []),
    ...(skills?.databases || []),
    ...(skills?.tools || []),
    ...(skills?.softSkills || [])
  ];

  return (
    <section className="px-8 py-12 bg-gray-800">
      <h2 className="text-2xl font-bold text-cyan-400 mb-6">My Skills</h2>
      <div className="flex flex-wrap gap-4">
        {allSkills.map((skill: string) => (
          <span
            key={skill}
            className="bg-cyan-700 text-white px-4 py-2 rounded-full text-sm shadow-sm hover:bg-cyan-600 transition-colors"
          >
            {skill}
          </span>
        ))}
      </div>
    </section>
  );
}
  