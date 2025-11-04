import React from "react";

const ContactSection: React.FC = () => {
  return (
    <section id="contact" className="w-full py-24" aria-label="Contact">
      <div className="mx-auto max-w-5xl px-6">
        <h2 className="mb-4 text-3xl font-semibold md:text-4xl">Contact</h2>
        <p className="max-w-3xl text-muted-foreground">
          Placeholder contact section. Add your email, social links, or a
          contact form here.
        </p>
      </div>
    </section>
  );
};

export default ContactSection;
