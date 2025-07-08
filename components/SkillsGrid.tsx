"use client"

// components/SkillsGrid.tsx
import { linkedinSyncService, LinkedInSkill } from "@/lib/services/linkedin-sync";
import { useEffect, useState } from "react";

interface SkillCategory {
  name: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

const skillCategories: Record<string, SkillCategory> = {
  technical: {
    name: "Technical Skills",
    color: "text-blue-400",
    bgColor: "bg-blue-900/20",
    borderColor: "border-blue-500/30"
  },
  tools: {
    name: "Tools & Platforms",
    color: "text-green-400",
    bgColor: "bg-green-900/20",
    borderColor: "border-green-500/30"
  },
  soft: {
    name: "Soft Skills",
    color: "text-purple-400",
    bgColor: "bg-purple-900/20",
    borderColor: "border-purple-500/30"
  },
  languages: {
    name: "Languages",
    color: "text-orange-400",
    bgColor: "bg-orange-900/20",
    borderColor: "border-orange-500/30"
  }
};

export default function SkillsGrid() {
  const [skillsByCategory, setSkillsByCategory] = useState<Record<string, LinkedInSkill[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSkills = async () => {
      try {
        const skills = await linkedinSyncService.getSkillsByCategory();
        setSkillsByCategory(skills);
      } catch (error) {
        console.error('Error loading LinkedIn skills:', error);
        // Fallback to default skills
        setSkillsByCategory({
          technical: [
            { name: "Python", endorsements: 15, category: "technical" },
            { name: "PyTorch", endorsements: 12, category: "technical" },
            { name: "LangChain", endorsements: 10, category: "technical" },
            { name: "React", endorsements: 6, category: "technical" }
          ],
          tools: [
            { name: "Git", endorsements: 12, category: "tool" },
            { name: "VS Code", endorsements: 10, category: "tool" },
            { name: "Cursor", endorsements: 8, category: "tool" }
          ],
          soft: [
            { name: "Problem Solving", endorsements: 15, category: "soft" },
            { name: "Communication", endorsements: 12, category: "soft" }
          ],
          languages: [
            { name: "French", endorsements: 20, category: "language" },
            { name: "English", endorsements: 15, category: "language" }
          ]
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-6 bg-gray-700 rounded mb-4"></div>
              <div className="flex flex-wrap gap-2">
                {[...Array(4)].map((_, j) => (
                  <div key={j} className="h-8 w-20 bg-gray-700 rounded"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="px-8 py-12 bg-gray-800">
      <h2 className="text-2xl font-bold text-cyan-400 mb-6">My Skills</h2>
      
      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {Object.entries(skillsByCategory).map(([category, skills]) => {
          const categoryInfo = skillCategories[category];
          if (!categoryInfo || skills.length === 0) return null;

          return (
            <div key={category} className="space-y-3">
              <h3 className={`text-lg font-semibold ${categoryInfo.color}`}>
                {categoryInfo.name}
              </h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <div
                    key={skill.name}
                    className={`px-3 py-2 rounded-lg border ${categoryInfo.bgColor} ${categoryInfo.borderColor} ${categoryInfo.color} text-sm font-medium hover:scale-105 transition-transform cursor-default`}
                    title={`${skill.endorsements} endorsements`}
                  >
                    {skill.name}
                    <span className="ml-2 text-xs opacity-70">
                      {skill.endorsements}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-8 p-4 bg-gray-700 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-300 mb-3">Legend</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(skillCategories).map(([key, category]) => (
            <div key={key} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${category.bgColor} ${category.borderColor} border`}></div>
              <span className="text-xs text-gray-400">{category.name}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-3">
          Numbers indicate LinkedIn endorsements. Hover over skills for details.
        </p>
      </div>
    </section>
  );
}
  