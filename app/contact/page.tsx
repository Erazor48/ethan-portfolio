// app/contact/page.tsx
import AnimatedSection from "@/components/AnimatedSection";

export default function Contact() {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <AnimatedSection delay={0.1}>
          <h1 className="text-3xl font-bold text-cyan-400 mb-6">Contact me</h1>
        </AnimatedSection>
        <AnimatedSection delay={0.2}>
          <p className="text-lg text-gray-300 mb-4">
            Don't hesitate to contact me for an internship or an AI project.
          </p>
        </AnimatedSection>
        <AnimatedSection delay={0.3}>
          <ul className="text-gray-400 space-y-2">
            <li><strong>Email:</strong> ethan.orain@aivancity.education</li>
            <li><strong>GitHub:</strong> <a href="https://github.com/Erazor48" className="underline">github.com/Erazor48</a></li>
            <li><strong>LinkedIn:</strong> <a href="https://www.linkedin.com/in/ethan-orain" className="underline">linkedin.com/in/ethan-orain</a></li>
          </ul>
        </AnimatedSection>
      </div>
    );
  }
  