// components/ProjectCard.tsx
interface ProjectProps {
    title: string;
    tech: string;
    description: string;
    github?: string;
}

export default function ProjectCard({ title, tech, description, github }: ProjectProps) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 shadow hover:shadow-lg transition">
        <h2 className="text-xl font-semibold text-white">{title}</h2>
        <div className="flex flex-wrap gap-2 mb-2">
          {tech.split('·').map((t) => t.trim()).filter(Boolean).map((t) => (
            <span key={t} className="bg-cyan-900 text-cyan-200 px-2 py-1 rounded-full text-xs font-semibold">{t}</span>
          ))}
        </div>
        <p className="text-gray-300 text-sm mb-4 whitespace-pre-wrap">{description}</p>
        {github && (
          <a
            href={github}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-cyan-400 underline hover:text-cyan-300"
          >
            View on GitHub
          </a>
        )}
      </div>
    );
}
  