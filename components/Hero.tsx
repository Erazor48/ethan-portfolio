// components/Hero.tsx
import { GithubIcon, Linkedin, FileText } from "lucide-react";

export default function Hero() {
  return (
    <section className="text-center py-20 px-4">
      <h1 className="text-4xl font-bold mb-4">Ethan Orain</h1>
      <p className="text-cyan-400 text-lg mb-6">
        AI Engineer · NLP · Neural Networks · LLMs Enthusiast
      </p>
      <div className="flex justify-center gap-6 mb-6 text-gray-300">
        <a href="https://github.com/Erazor48" target="_blank" rel="noreferrer">
          <GithubIcon size={24} />
        </a>
        <a href="https://www.linkedin.com/in/ethan-orain" target="_blank" rel="noreferrer">
          <Linkedin size={24} />
        </a>
        <a href="/CV 3-4 months EV.pdf" target="_blank" rel="noreferrer">
          <FileText size={24} />
        </a>
      </div>
      <p className="max-w-xl mx-auto text-gray-400">
        I'm a student at Aivancity passionate about building smart systems with code.
        I work on NLP, agents, neural nets and always looking to solve cool problems.
      </p>
    </section>
  );
}
