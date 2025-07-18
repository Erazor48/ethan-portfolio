"use client"

import { dataService } from "@/lib/services/data-service";
import { useEffect, useState } from "react";

export default function Experience() {
  const [experience, setExperience] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const exp = await dataService.getExperience();
        setExperience(exp);
      } catch (error) {
        console.error('Error loading experience:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <h1 className="text-3xl font-bold text-cyan-400 mb-6">Experience</h1>
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
      <h1 className="text-3xl font-bold text-cyan-400 mb-6">Experience</h1>
      
      {/* Current Experience */}
      {experience?.current && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-cyan-400 mb-4">Current Experience</h2>
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-white mb-2">
              {experience.current.position} at {experience.current.company}
            </h3>
            <p className="text-gray-400 mb-2">{`${experience.current.start.month}/${experience.current.start.year} – ${experience.current.ongoing ? 'Present' : (experience.current.end ? experience.current.end.month + '/' + experience.current.end.year : 'N/A')}`}</p>
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
                <p className="text-gray-400 mb-2">{`${exp.start.month}/${exp.start.year} – ${exp.ongoing ? 'Present' : (exp.end ? exp.end.month + '/' + exp.end.year : 'N/A')}`}</p>
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

      {/* Back to About */}
      <div className="mt-8">
        <a href="/about" className="text-cyan-400 underline">← Back to About</a>
      </div>
    </div>
  );
} 