import React from "react";
import SignupFormDemo from "@/components/signup-form-demo";
import { IconBrandGithub, IconBrandX, IconBrandLinkedin } from "@tabler/icons-react";

const ContactSection: React.FC = () => {
  const GITHUB_URL = process.env.NEXT_PUBLIC_GITHUB_URL || "https://github.com/Prayas-35";
  const X_URL = process.env.NEXT_PUBLIC_X_URL || "https://x.com/Prayas35";
  const LINKEDIN_URL = process.env.NEXT_PUBLIC_LINKEDIN_URL || "https://www.linkedin.com/in/prayaspal/";

  return (
    <section id="contact" className="w-full py-24" aria-label="Contact">
      <div className="mx-auto max-w-9/12 px-6">
        <div className="grid gap-10 md:grid-cols-2">
          {/* Left: intro + socials */}
          <div>
            <h2 className="mb-3 text-3xl font-semibold md:text-4xl">Let&apos;s connect</h2>
            <p className="mb-6 text-neutral-300 max-w-prose">
              I&apos;m always open to new opportunities, collaborations, or just exchanging ideas about backend development and Web3. Whether you&apos;re working on something innovative or want to discuss emerging technologies, feel free to reach out.
            </p>
            <div className="flex items-center gap-4">
              <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-neutral-500 hover:text-neutral-600 dark:text-neutral-300 dark:hover:text-white transition-colors">
                <IconBrandGithub className="h-6 w-6" />
              </a>
              <a href={X_URL} target="_blank" rel="noopener noreferrer" aria-label="X" className="text-neutral-500 hover:text-neutral-600 dark:text-neutral-300 dark:hover:text-white transition-colors">
                <IconBrandX className="h-6 w-6" />
              </a>
              <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-neutral-500 hover:text-neutral-600 dark:text-neutral-300 dark:hover:text-white transition-colors">
                <IconBrandLinkedin className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Right: contact form (reusing signup form styles) */}
          <div>
            <SignupFormDemo variant="contact" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
