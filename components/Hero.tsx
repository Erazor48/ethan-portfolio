"use client"

// components/Hero.tsx
import { TbFileCv } from "react-icons/tb";
import { SiGithub, SiLinkedin } from "react-icons/si";
import { dataService } from "@/lib/services/data-service";
import { useEffect, useState } from "react";
import FlipImage from "@/components/FlipImage";

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
          <div className="h-8 bg-muted-primary rounded mb-4 mx-auto w-48"></div>
          <div className="h-6 bg-muted-primary rounded mb-6 mx-auto w-64"></div>
          <div className="flex justify-center gap-6 mb-6">
            <div className="w-6 h-6 bg-muted-primary rounded"></div>
            <div className="w-6 h-6 bg-muted-primary rounded"></div>
            <div className="w-6 h-6 bg-muted-primary rounded"></div>
          </div>
          <div className="h-4 bg-muted-primary rounded mx-auto w-96"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full overflow-hidden bg-gradient-bottom pb-16">
      {/* Poster */}
      <div className="w-full h-[320px] relative">
        <img
          src="/Poster_AI_Blue_Light_Weight.png"
          alt="Blue AI Poster"
          className="inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-top" />
      </div>
      {/* Main content with animated appearance */}
      <div className="relative flex flex-col items-center -mt-20 z-10">
        <div className="relative animate-fadeInUp" style={{ animationDelay: "0.1s" }}>
          <FlipImage
          frontImage="/Profile_Pickture_Men_blue.png"
          backImage="/Profile_Pickture_Robot.png"
          size={144} // Optionnel
          />
        </div>
        <h1 className="text-4xl font-bold text-primary-fg mt-6 mb-2 drop-shadow-lg animate-fadeInUp" style={{ animationDelay: "0.3s" }}>
          Building intelligent systems for tomorrow
        </h1>
        <p className="text-bio text-lg font-medium mb-2 drop-shadow animate-fadeInUp" style={{ animationDelay: "0.5s" }}>
          {personalInfo.bio}
        </p>
        <p className="text-foreground-secondary text-center max-w-xl mb-3 drop-shadow animate-fadeInUp" style={{ animationDelay: "0.7s" }}>
          Passionate about creating robust, scalable, and innovative AI solutions. Always exploring new technologies and pushing boundaries in machine learning and software engineering.
        </p>
        <div className="flex justify-center gap-6 mb-6 text-foreground animate-fadeInUp" style={{ animationDelay: "0.9s" }}>
          <a href={socialLinks?.github || "https://github.com/Erazor48"} target="_blank" rel="noreferrer" className="hover:scale-105">
            <SiGithub size={25} style={{marginTop: "2px"}}/>
          </a>
          <a href={socialLinks?.linkedin || "https://www.linkedin.com/in/ethan-orain"} target="_blank" rel="noreferrer" className="hover:scale-105">
            <SiLinkedin size={24} style={{marginTop: "3px", marginLeft: "3px"}}/>
          </a>
          <a href="/CV 3-4 months EV.pdf" target="_blank" rel="noreferrer" className="hover:scale-105">
            <TbFileCv size={30} style={{}}/>
          </a>
        </div>
        <div className="mt-8 animate-fadeInUp" style={{ animationDelay: "1.1s" }}>
          <a href="projects" className="inline-block px-6 py-3 bg-hero-button text-primary-fg rounded-full font-semibold shadow-lg hover:bg-hero-button-hover transition hover:scale-105">
            View my projects
          </a>
        </div>
      </div>
    </section>
  );
}
