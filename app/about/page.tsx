"use client"

// app/about/page.tsx
import SkillsGrid from "@/components/SkillsGrid";
import GitHubStats from "@/components/GitHubStats";
import { dataService } from "@/lib/services/data-service";
import { useEffect, useState } from "react";

export default function About() {
  const [personalInfo, setPersonalInfo] = useState<any>(null);
  const [experience, setExperience] = useState<any>(null);
  const [education, setEducation] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [personal, exp, edu] = await Promise.all([
          dataService.getPersonalInfo(),
          dataService.getExperience(),
          dataService.getEducation()
        ]);
        setPersonalInfo(personal);
        setExperience(exp);
        setEducation(edu);
      } catch (error) {
        console.error('Error loading data:', error);
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
          {personalInfo?.bio || "I'm an Artificial Intelligence student at Aivancity, passionate about natural language processing, neural networks and intelligent agent design."}
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

      {/* Current Experience */}
      {experience?.current && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-cyan-400 mb-4">Current Experience</h2>
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-white mb-2">
              {experience.current.position} at {experience.current.company}
            </h3>
            <p className="text-gray-400 mb-2">{experience.current.duration}</p>
            <p className="text-gray-300 mb-4">{experience.current.description}</p>
            <div className="flex flex-wrap gap-2">
              {experience.current.technologies?.map((tech: string) => (
                <span key={tech} className="bg-cyan-700 text-white px-3 py-1 rounded-full text-sm">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Previous Experience */}
      {experience?.previous && experience.previous.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-cyan-400 mb-4">Previous Experience</h2>
          <div className="space-y-4">
            {experience.previous.map((exp: any, index: number) => (
              <div key={index} className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-white mb-2">
                  {exp.position} at {exp.company}
                </h3>
                <p className="text-gray-400 mb-2">{exp.duration}</p>
                <p className="text-gray-300 mb-4">{exp.description}</p>
                <div className="flex flex-wrap gap-2">
                  {exp.technologies?.map((tech: string) => (
                    <span key={tech} className="bg-cyan-700 text-white px-3 py-1 rounded-full text-sm">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-cyan-400 mb-4">Education</h2>
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-white mb-2">
              {education.degree}
            </h3>
            <p className="text-gray-400 mb-2">{education.institution} • {education.year}</p>
            <p className="text-gray-300">{education.description}</p>
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