// components/Hero.tsx
import { TbFileCv } from "react-icons/tb";
import { SiGithub, SiLinkedin } from "react-icons/si";

export default function Hero() {
  return (
    <section className="text-center py-20 px-4">
      <h1 className="text-4xl font-bold mb-4">Ethan Orain</h1>
      <p className="text-cyan-400 text-lg mb-6">
        AI Engineer · NLP · Neural Networks · LLMs Enthusiast
      </p>
      <div className="flex justify-center gap-6 mb-6 text-gray-300">
        <a href="https://github.com/Erazor48" target="_blank" rel="noreferrer">
          <SiGithub size={25} style={{marginTop: "2px"}}/>
        </a>
        <a href="https://www.linkedin.com/in/ethan-orain" target="_blank" rel="noreferrer">
          <SiLinkedin size={24} style={{marginTop: "3px", marginLeft: "3px"}}/>
        </a>
        <a href="/CV 3-4 months EV.pdf" target="_blank" rel="noreferrer">
          <TbFileCv size={30} style={{}}/>
        </a>
      </div>
      <p className="max-w-xl mx-auto text-gray-400">
        I'm a student at Aivancity passionate about building smart systems with code.
        I work on NLP, agents, neural nets and always looking to solve cool problems.
      </p>
    </section>
  );
}
