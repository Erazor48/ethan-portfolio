// app/projects/page.tsx
import ProjectCard from "@/components/ProjectCard";

export default function Projects() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold text-cyan-400 mb-6">Mes Projets</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <ProjectCard
          title="Eviverse"
          tech="FastAPI · SQLAlchemy · React · Tailwind CSS · Batch Files"
          description="🛠️ 3D Object Generator – SaaS Project (in progress)
Personal project to build a 3D object generator, aiming to become a SaaS platform with project thread management.
Currently in early development — learning React for frontend work after gaining backend & API experience."
          github="https://github.com/Erazor48/Eviverse"
        />
        <ProjectCard
          title="YouTube Video Clip Extractor"
          tech="Gradio · MoviePy · yt-dlp"
          description="🎞️ YouTube Clip Extractor is a bilingual web application that lets you extract high-quality clips from any YouTube video in just a few clicks. Simple interface, instant download, no technical skills required. Perfect for content creators, teachers, and anyone who wants to save or share the best moments from YouTube."
          github="https://github.com/Erazor48/youtube-clip-extractor"
        />
        <ProjectCard
          title="Path Finding"
          tech="Open Street Map · NetworkX · Folium"
          description="📍 Pathfinding Algorithm – Social Density Optimizer
Search for an optimal path maximizing the number of people encountered between two geographic locations.
Exploration of spatial algorithms with a real-world focus on social interaction and human flow."
        />
        <ProjectCard
          title="🔐 Securing LLMs from Prompt Injections with Giskard 🐢"
          tech="Prompt Injection · LLM Security · Giskard · AI Safety"
          description="🎓 As part of a course project with a classmate, we explored prompt injection attacks by directly interacting with large language models (LLMs) to understand their vulnerabilities. We also presented how the open-source tool Giskard can help secure these models through automated testing and vulnerability detection."
        />
        <ProjectCard
          title="⚡ Energy Sobriety Data Analysis"
          tech="Data Analysis · Pandas · Matplotlib · Seaborn · Python · Power BI"
          description="📊 Analyzed French energy consumption data to reveal key trends and propose smart, sustainable solutions.
🧠 Used Python & Power BI to visualize, simulate, and support energy-saving strategies."
        />
      </div>
    </div>
  );
}
