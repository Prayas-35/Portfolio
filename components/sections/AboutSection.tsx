import React from "react";

const AboutSection: React.FC = () => {
  return (
    <section id="about" className="w-full py-24" aria-label="About">
      <div className="mx-auto max-w-5xl px-6">
        <h2 className="mb-4 text-3xl font-semibold md:text-4xl">About</h2>
        <p className="max-w-3xl text-muted-foreground">
          Placeholder content for the About section. Share your story,
          background, interests, and what drives you.
        </p>
      </div>
    </section>
  );
};

export default AboutSection;
