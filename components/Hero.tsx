"use client"

// components/Hero.tsx
import { TbFileCv } from "react-icons/tb";
import { SiGithub, SiLinkedin } from "react-icons/si";
import { dataService } from "@/lib/services/data-service";
import { useEffect, useState } from "react";

export default function Hero() {
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
        console.error('Error loading hero data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <section className="text-center py-20 px-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded mb-4 mx-auto w-48"></div>
          <div className="h-6 bg-gray-700 rounded mb-6 mx-auto w-64"></div>
          <div className="flex justify-center gap-6 mb-6">
            <div className="w-6 h-6 bg-gray-700 rounded"></div>
            <div className="w-6 h-6 bg-gray-700 rounded"></div>
            <div className="w-6 h-6 bg-gray-700 rounded"></div>
          </div>
          <div className="h-4 bg-gray-700 rounded mx-auto w-96"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="text-center py-20 px-4">
      <h1 className="text-4xl font-bold mb-4">{personalInfo?.name || "Ethan Orain"}</h1>
      <p className="text-cyan-400 text-lg mb-6">
        {personalInfo?.bio || "AI Engineer · NLP · Neural Networks · LLMs Enthusiast"}
      </p>
      <div className="flex justify-center gap-6 mb-6 text-gray-300">
        <a href={socialLinks?.github || "https://github.com/Erazor48"} target="_blank" rel="noreferrer">
          <SiGithub size={25} style={{marginTop: "2px"}}/>
        </a>
        <a href={socialLinks?.linkedin || "https://www.linkedin.com/in/ethan-orain"} target="_blank" rel="noreferrer">
          <SiLinkedin size={24} style={{marginTop: "3px", marginLeft: "3px"}}/>
        </a>
        <a href="/CV 3-4 months EV.pdf" target="_blank" rel="noreferrer">
          <TbFileCv size={30} style={{}}/>
        </a>
      </div>
      <p className="max-w-xl mx-auto text-gray-400">
        {personalInfo?.bio || "I'm a student at Aivancity passionate about building smart systems with code. I work on NLP, agents, neural nets and always looking to solve cool problems."}
      </p>
    </section>
  );
}
