"use client"

// app/about/page.tsx
import SkillsGrid from "@/components/SkillsGrid";
import GitHubStats from "@/components/GitHubStats";
import { linkedinSyncService } from "@/lib/services/linkedin-sync";
import { useEffect, useState } from "react";

export default function About() {
  const [linkedinProfile, setLinkedinProfile] = useState<any>(null);
  const [experience, setExperience] = useState<any[]>([]);
  const [education, setEducation] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [profile, exp, edu] = await Promise.all([
          linkedinSyncService.fetchLinkedInProfile(),
          linkedinSyncService.getExperience(),
          linkedinSyncService.getEducation()
        ]);
        setLinkedinProfile(profile);
        setExperience(exp);
        setEducation(edu);
      } catch (error) {
        console.error('Error loading LinkedIn data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <h1 className="text-3xl font-bold text-cyan-400 mb-6">About me</h1>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-700 rounded mb-4"></div>
          <div className="h-4 bg-gray-700 rounded mb-4"></div>
          <div className="h-4 bg-gray-700 rounded mb-4"></div>
          <div className="h-4 bg-gray-700 rounded mb-4"></div>
        </div>
        <div className="mt-12">
          <SkillsGrid />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold text-cyan-400 mb-6">About me</h1>
      
      {/* Personal Info */}
      <div className="max-w-3xl text-gray-300 text-lg leading-relaxed mb-8">
        <p>
          {linkedinProfile?.summary || "I'm an Artificial Intelligence student at Aivancity, passionate about natural language processing, neural networks and intelligent agent design."}
        </p>
        <br />
        <p>
          My goal: to create useful, elegant and powerful systems that can understand, learn and interact. 
          You can code tools for yourself, friends, automate your work. 
          Intelligence in all these formats is limited only by our imagination.
        </p>
        <br />
        <p><em>"If it thinks, I want to code it."</em></p>
      </div>

      {/* Experience */}
      {experience && experience.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-cyan-400 mb-4">Experience</h2>
          <div className="space-y-4">
            {experience.map((exp, index) => (
              <div key={index} className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-white mb-2">
                  {exp.title} at {exp.company}
                </h3>
                <p className="text-gray-400 mb-2">{exp.duration}</p>
                <p className="text-gray-300">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-cyan-400 mb-4">Education</h2>
          <div className="space-y-4">
            {education.map((edu, index) => (
              <div key={index} className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-white mb-2">
                  {edu.degree}
                </h3>
                <p className="text-gray-400 mb-2">{edu.institution} • {edu.duration}</p>
                {edu.description && (
                  <p className="text-gray-300">{edu.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* GitHub Statistics */}
      <div className="mt-8">
        <GitHubStats />
      </div>

      {/* Skills */}
      <div className="mt-12">
        <SkillsGrid />
      </div>
    </div>
  );
}