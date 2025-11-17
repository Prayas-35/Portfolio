import React from "react";
import BentoGrid from "../kokonutui/bento-grid";

const AboutSection: React.FC = () => {
  return (
    <section id="about" className="w-full" aria-label="About">
      <div className="mx-auto max-w-7xl md:max-w-9/12 px-6">
        <h2 className="mb-2 text-3xl font-semibold md:text-4xl">About Me</h2>
        <BentoGrid />
      </div>
    </section>
  );
};

export default AboutSection;
