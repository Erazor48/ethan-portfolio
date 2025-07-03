// app/about/page.tsx
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SkillsGrid from "@/components/SkillsGrid";

export default function About() {
    return (
      <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      <Navbar />
        <div className="min-h-screen bg-gray-900 text-white p-8">
          <h1 className="text-3xl font-bold text-cyan-400 mb-6">About me</h1>
          <p className="max-w-3xl text-gray-300 text-lg leading-relaxed">
          I'm an Artificial Intelligence student at <strong>Aivancity</strong>,
          passionate about natural language processing, neural networks and intelligent agent design.
            <br /><br />
            My goal: to create useful, elegant and powerful systems that can understand, learn and interact. 
            You can code tools for yourself, friends, automate your work. 
            Intelligence in all these formats is limited only by our imagination.
            <br /><br />
            <em>“If it thinks, I want to code it.”</em>
          </p>
          <div className="mt-12">
            <SkillsGrid />
          </div>
        </div>
        <Footer />
      </div>
    );
  }