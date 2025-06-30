// app/about/page.tsx
import SkillsGrid from "@/components/SkillsGrid";

export default function About() {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <h1 className="text-3xl font-bold text-cyan-400 mb-6">À propos de moi</h1>
        <p className="max-w-3xl text-gray-300 text-lg leading-relaxed">
          Je suis étudiant en Intelligence Artificielle à <strong>Aivancity</strong>,
          passionné par le traitement du langage naturel, les réseaux de neurones et la conception d'agents intelligents.
          <br /><br />
          Mon objectif : créer des systèmes utiles, élégants et puissants, capables de comprendre, apprendre et interagir.
          On peut se coder des outils, amis, automatiser son travail. L'intelligence dans tout ces formats se limite qu'as notre imagination.
          <br /><br />
          <em>“Si ça pense, je veux le coder.”</em>
        </p>
        <div className="mt-12">
          <SkillsGrid />
        </div>
      </div>
    );
  }