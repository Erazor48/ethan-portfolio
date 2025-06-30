// components/SkillsGrid.tsx
export default function SkillsGrid() {
    const skills = [
      "Résolution de problèmes", "PyTorch", "LangChain", "Transformers",
      "Python", "C", "HTML/CSS",
      "Cursor", "VS Code", "GitHub"
    ];
  
    return (
      <section className="px-8 py-12 bg-gray-800">
        <h2 className="text-2xl font-bold text-cyan-400 mb-6">Mes Compétences</h2>
        <div className="flex flex-wrap gap-4">
          {skills.map((skill) => (
            <span
              key={skill}
              className="bg-cyan-700 text-white px-4 py-2 rounded-full text-sm shadow-sm"
            >
              {skill}
            </span>
          ))}
        </div>
      </section>
    );
  }
  