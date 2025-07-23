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
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-[#0a223a] to-[#061c33] pb-16">
      {/* Poster */}
      <div className="w-full h-[320px] relative">
        <img
          src="/Poster_AI_Blue_Light_Weight.png"
          alt="Blue AI Poster"
          className="absolute inset-0 w-full h-full object-cover object-center z-0"
          style={{ pointerEvents: 'none' }}
        />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0a223a] to-transparent" />
      </div>
      {/* Main content with animated appearance */}
      <div className="relative flex flex-col items-center -mt-20 z-10">
        <div className="relative animate-fadeInUp" style={{ animationDelay: "0.1s" }}>
          <span className="absolute inset-0 rounded-full animate-pulse-glow bg-cyan-400/30 blur-2xl" />
          <img
            src="/Profile_Pickture_Men_blue.png"
            alt="Profile picture"
            className="w-36 h-36 rounded-full border-4 border-cyan-400 shadow-2xl bg-white object-cover relative z-10"
          />
        </div>
        <h1 className="text-4xl font-bold text-white mt-6 mb-2 drop-shadow-lg animate-fadeInUp" style={{ animationDelay: "0.3s" }}>
          Building intelligent systems for tomorrow
        </h1>
        <p className="text-cyan-200 text-lg font-medium mb-2 drop-shadow animate-fadeInUp" style={{ animationDelay: "0.5s" }}>
          AI Engineer · NLP · Neural Networks · LLMs Enthusiast
        </p>
        <p className="text-gray-200 text-center max-w-xl mb-3 drop-shadow animate-fadeInUp" style={{ animationDelay: "0.7s" }}>
          Passionate about creating robust, scalable, and innovative AI solutions. Always exploring new technologies and pushing boundaries in machine learning and software engineering.
        </p>
        <div className="flex justify-center gap-6 mb-6 text-gray-300 animate-fadeInUp" style={{ animationDelay: "0.9s" }}>
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
        <div className="mt-8 animate-fadeInUp" style={{ animationDelay: "1.1s" }}>
          <a href="projects" className="px-6 py-3 bg-cyan-500 text-white rounded-full font-semibold shadow-lg hover:bg-cyan-600 transition">
            View my projects
          </a>
        </div>
      </div>
      {/* Optional: SVG wave for section transition */}
      <div className="w-full overflow-hidden -mb-1">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill="#061c33" d="M0,32 C480,80 960,0 1440,48 L1440,80 L0,80 Z"/>
        </svg>
      </div>
    </section>
  );
}
