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
        <p className="text-cyan-400 text-sm mb-2">{tech}</p>
        <p className="text-gray-300 text-sm mb-4">{description}</p>
        {github && (
          <a
            href={github}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-cyan-400 underline hover:text-cyan-300"
          >
            Voir sur GitHub
          </a>
        )}
      </div>
    );
  }
  