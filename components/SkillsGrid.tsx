"use client"

// components/SkillsGrid.tsx
import { githubSyncService, GitHubSkill } from "@/lib/services/github-sync";
import { useEffect, useState } from "react";

interface SkillCategory {
  name: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

const skillCategories: Record<string, SkillCategory> = {
  programming: {
    name: "Programming Languages",
    color: `text-skills-primary-fg`,
    bgColor: `bg-skills-primary`,
    borderColor: `border-skills-primary-border`
  },
  framework: {
    name: "Frameworks & Libraries",
    color: `text-skills-secondary-fg`,
    bgColor: `bg-skills-secondary`,
    borderColor: `border-skills-secondary-border`
  },
  tool: {
    name: "Tools & Platforms",
    color: `text-skills-tertiary-fg`,
    bgColor: `bg-skills-tertiary`,
    borderColor: `border-skills-tertiary-border`
  },
  database: {
    name: "Databases",
    color: `text-skills-quaternary-fg`,
    bgColor: `bg-skills-quaternary`,
    borderColor: `border-skills-quaternary-border`
  },
  platform: {
    name: "Cloud & Platforms",
    color: `text-skills-quinary-fg`,
    bgColor: `bg-skills-quinary`,
    borderColor: `border-skills-quinary-border`
  },
  other: {
    name: "Other / Uncategorized",
    color: `text-skills-senary-fg`,
    bgColor: `bg-skills-senary`,
    borderColor: `border-skills-senary-border`
  }
};

export default function SkillsGrid() {
  const [skillsByCategory, setSkillsByCategory] = useState<Record<string, GitHubSkill[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSkills = async () => {
      try {
        const skills = await githubSyncService.getSkillsByCategory();
        setSkillsByCategory(skills);
      } catch (error) {
        console.error('Error loading GitHub skills:', error);
        // Fallback to empty state
        setSkillsByCategory({});
      } finally {
        setLoading(false);
      }
    };

    loadSkills();
  }, []);

  if (loading) {
    return (
      <section className="px-8 py-12 bg-card">
        <h2 className="text-2xl font-bold text-secondary-fg mb-6">My Skills</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-6 bg-muted-primary rounded mb-4"></div>
              <div className="flex flex-wrap gap-2">
                {[...Array(4)].map((_, j) => (
                  <div key={j} className="h-8 w-20 bg-muted-primary rounded"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // Check if we have any skills
  const hasSkills = Object.values(skillsByCategory).some(skills => skills.length > 0);

  if (!hasSkills) {
    return (
      <section className="px-8 py-12 bg-card rounded-lg">
        <h2 className="text-2xl font-bold text-secondary-fg mb-6">My Skills</h2>
        <div className="text-center text-muted-primary-fg">
          <p>Skills will be automatically extracted from my GitHub projects.</p>
          <p className="text-sm mt-2">Check back soon for updated skills!</p>
        </div>
      </section>
    );
  }

  return (
    <section className="px-8 py-12 bg-card rounded-lg">
      <h2 className="text-2xl font-bold text-secondary-fg mb-6">My Skills</h2>
      
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
                    title={`Used in ${skill.frequency} project(s) • ${skill.stars} total stars`}
                  >
                    {skill.name}
                    <span className="ml-2 text-xs opacity-70">
                      {skill.frequency}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-8 p-4 bg-skills-legende rounded-lg">
        <h4 className="text-sm font-semibold text-skills-legende-fg mb-3">Legend</h4>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {Object.entries(skillCategories).map(([key, category]) => (
            <div key={key} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${category.bgColor} ${category.borderColor} border`}></div>
              <span className="text-xs text-muted-primary-fg">{category.name}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-secondary-fg mt-3">
          Numbers indicate how many projects use each skill. Hover for details.
        </p>
      </div>
    </section>
  );
}
  