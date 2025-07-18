"use client"

// app/about/page.tsx
import SkillsGrid from "@/components/SkillsGrid";
import GitHubStats from "@/components/GitHubStats";
import { dataService } from "@/lib/services/data-service";
import { useEffect, useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

export default function About() {
  const [personalInfo, setPersonalInfo] = useState<any>(null);
  const [experience, setExperience] = useState<any>(null);
  const [education, setEducation] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [skills, setSkills] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

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
        // Skills
        setSkills(await dataService.getSkills?.());
        // Projects (pour le projet vedette)
        const allProjects = await dataService.getProjects?.();
        setProjects(allProjects || []);
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
      </div>
    );
  }

  // Highlights
  const lastEducation = Array.isArray(education) ? education[0] : null;
  const mainSkills = skills?.programming?.slice(0, 3) || [];
  const featuredProject = projects.find((p: any) => p.featured) || projects[0];

  // Accordéons helpers
  const toggleAccordion = (key: string) => {
    setOpenAccordion(openAccordion === key ? null : key);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      {/* Hero */}
      <section className="text-center py-10 px-4">
        <h1 className="text-4xl font-bold mb-2">{personalInfo?.name || "Ethan Orain"}</h1>
        <p className="text-cyan-400 text-lg mb-2">{personalInfo?.bio || "AI Engineer · NLP · Neural Networks · LLMs Enthusiast"}</p>
        <div className="flex justify-center gap-6 mb-4 text-gray-300">
          <a href={personalInfo?.github || "https://github.com/Erazor48"} target="_blank" rel="noreferrer">GitHub</a>
          <a href={personalInfo?.linkedin || "https://www.linkedin.com/in/ethan-orain"} target="_blank" rel="noreferrer">LinkedIn</a>
          <a href="/CV 3-4 months EV.pdf" target="_blank" rel="noreferrer">CV</a>
        </div>
      </section>

      {/* Highlights */}
      <section className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Expérience actuelle */}
        {experience?.current && (
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-bold text-cyan-400 mb-2">Current Experience</h2>
            <div className="text-white font-semibold mb-1">{experience.current.position} at {experience.current.company}</div>
            <div className="text-gray-400 mb-2">{`${experience.current.start.month}/${experience.current.start.year} – ${experience.current.ongoing ? 'Present' : (experience.current.end ? experience.current.end.month + '/' + experience.current.end.year : 'N/A')}`}</div>
            <div className="text-gray-300 mb-2">{experience.current.description}</div>
            <div className="flex flex-wrap gap-2">
              {experience.current.technologies?.map((tech: string) => (
                <span key={tech} className="bg-cyan-700 text-white px-3 py-1 rounded-full text-sm">{tech}</span>
              ))}
            </div>
          </div>
        )}
        {/* Dernier diplôme */}
        {lastEducation && (
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-bold text-cyan-400 mb-2">Last Education</h2>
            <div className="text-white font-semibold mb-1">{lastEducation.degree} ({lastEducation.program})</div>
            <div className="text-gray-400 mb-2">{lastEducation.institution} • {`${lastEducation.start.month}/${lastEducation.start.year} – ${lastEducation.end ? lastEducation.end.month + '/' + lastEducation.end.year : 'Present'}`}</div>
            <div className="text-gray-300 mb-2">{lastEducation.description}</div>
            <div className="flex flex-wrap gap-2">
              {lastEducation.technologies?.map((tech: string) => (
                <span key={tech} className="bg-cyan-700 text-white px-3 py-1 rounded-full text-sm">{tech}</span>
              ))}
            </div>
            {typeof lastEducation.grade === 'number' && (
              <div className="text-gray-400 text-sm mt-2">Grade: {lastEducation.grade}</div>
            )}
          </div>
        )}
        {/* Skills principaux */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-bold text-cyan-400 mb-2">Main Skills</h2>
          <div className="flex flex-wrap gap-2">
            {mainSkills.map((skill: string) => (
              <span key={skill} className="bg-cyan-700 text-white px-3 py-1 rounded-full text-sm">{skill}</span>
            ))}
          </div>
        </div>
        {/* Projet vedette */}
        {featuredProject && (
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-bold text-cyan-400 mb-2">Featured Project</h2>
            <div className="text-white font-semibold mb-1">{featuredProject.name}</div>
            <div className="text-gray-300 mb-2">{featuredProject.description}</div>
            <div className="flex flex-wrap gap-2 mb-2">
              {featuredProject.technologies?.map((tech: string) => (
                <span key={tech} className="bg-cyan-700 text-white px-3 py-1 rounded-full text-sm">{tech}</span>
              ))}
            </div>
            {featuredProject.githubUrl && (
              <a href={featuredProject.githubUrl} target="_blank" rel="noreferrer" className="text-cyan-400 underline">GitHub</a>
            )}
            {featuredProject.liveUrl && (
              <span> | <a href={featuredProject.liveUrl} target="_blank" rel="noreferrer" className="text-cyan-400 underline">Live</a></span>
            )}
          </div>
        )}
      </section>

      {/* Accordéons */}
      <section className="mb-8">
        {/* Expériences précédentes */}
        {experience?.previous && experience.previous.length > 0 && (
          <div className="mb-4">
            <button onClick={() => toggleAccordion('previousExp')} className="flex items-center text-cyan-400 font-bold mb-2">
              Previous Experiences {openAccordion === 'previousExp' ? <FaChevronUp className="ml-2" /> : <FaChevronDown className="ml-2" />}
            </button>
            {openAccordion === 'previousExp' && (
              <div className="space-y-4">
                {experience.previous.map((exp: any, index: number) => (
                  <div key={index} className="bg-gray-800 p-6 rounded-lg">
                    <div className="text-white font-semibold mb-1">{exp.position} at {exp.company}</div>
                    <div className="text-gray-400 mb-2">{`${exp.start.month}/${exp.start.year} – ${exp.ongoing ? 'Present' : (exp.end ? exp.end.month + '/' + exp.end.year : 'N/A')}`}</div>
                    <div className="text-gray-300 mb-2">{exp.description}</div>
                    <div className="flex flex-wrap gap-2">
                      {exp.technologies?.map((tech: string) => (
                        <span key={tech} className="bg-cyan-700 text-white px-3 py-1 rounded-full text-sm">{tech}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {/* Toutes les formations */}
        {education && Array.isArray(education) && education.length > 1 && (
          <div className="mb-4">
            <button onClick={() => toggleAccordion('allEdu')} className="flex items-center text-cyan-400 font-bold mb-2">
              All Education {openAccordion === 'allEdu' ? <FaChevronUp className="ml-2" /> : <FaChevronDown className="ml-2" />}
            </button>
            {openAccordion === 'allEdu' && (
              <div className="space-y-4">
                {education.slice(1).map((edu: any, idx: number) => (
                  <div key={idx} className="bg-gray-800 p-6 rounded-lg">
                    <div className="text-white font-semibold mb-1">{edu.degree} ({edu.program})</div>
                    <div className="text-gray-400 mb-2">{edu.institution} • {`${edu.start.month}/${edu.start.year} – ${edu.end ? edu.end.month + '/' + edu.end.year : 'Present'}`}</div>
                    <div className="text-gray-300 mb-2">{edu.description}</div>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {edu.technologies?.map((tech: string) => (
                        <span key={tech} className="bg-cyan-700 text-white px-3 py-1 rounded-full text-sm">{tech}</span>
                      ))}
                    </div>
                    {typeof edu.grade === 'number' && (
                      <div className="text-gray-400 text-sm mt-2">Grade: {edu.grade}</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {/* Toutes les compétences */}
        {skills && (
          <div className="mb-4">
            <button onClick={() => toggleAccordion('allSkills')} className="flex items-center text-cyan-400 font-bold mb-2">
              All Skills {openAccordion === 'allSkills' ? <FaChevronUp className="ml-2" /> : <FaChevronDown className="ml-2" />}
            </button>
            {openAccordion === 'allSkills' && (
              <div className="space-y-2">
                <SkillsGrid />
              </div>
            )}
          </div>
        )}
        {/* Stats GitHub */}
        <div className="mb-4">
          <button onClick={() => toggleAccordion('githubStats')} className="flex items-center text-cyan-400 font-bold mb-2">
            GitHub Statistics {openAccordion === 'githubStats' ? <FaChevronUp className="ml-2" /> : <FaChevronDown className="ml-2" />}
          </button>
          {openAccordion === 'githubStats' && (
            <div className="bg-gray-800 p-6 rounded-lg">
              <GitHubStats />
            </div>
          )}
        </div>
      </section>

      {/* Liens vers pages secondaires */}
      <section className="flex flex-wrap gap-4 mt-8">
        <a href="/experience" className="text-cyan-400 underline">View all my experience</a>
        <a href="/projects" className="text-cyan-400 underline">View all my projects</a>
        <a href="/skills" className="text-cyan-400 underline">View all my skills</a>
      </section>
    </div>
  );
}