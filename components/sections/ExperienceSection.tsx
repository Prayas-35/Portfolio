import React from "react";
import { Timeline } from "@/components/ui/timeline";

const ExperienceSection: React.FC = () => {
  const data = [
    {
      title: "Full Stack Developer (May 2025 – Present)",
      content: (
        <div>
          <p className="mb-4 text-xs md:text-sm text-neutral-600 dark:text-neutral-300">
            RudraX Limited — United Kingdom, London (Remote)
          </p>
          <ul className="space-y-2 text-xs md:text-sm text-neutral-700 dark:text-neutral-200 list-disc pl-5">
            <li>
              Built backend architecture with Node.js, Express.js, and MongoDB Atlas, including single-session handling to prevent concurrent logins.
            </li>
            <li>
              Implemented secure auth with Firebase Auth (OAuth2 + JWT), supporting smooth login and guest checkout flows.
            </li>
            <li>
              Engineered AI chat session tracking and point-mining with DeepSeek and ChatGPT, adding real-time caps and robust fallbacks.
            </li>
            <li>
              Designed synchronization between AmazeChain and MongoDB to ensure consistent point storage during partial sessions and chain downtime.
            </li>
            <li>
              Developed rewards-based e-commerce backend (hotels, courses, paintings, jewellery) with Stripe, point‑to‑GBP conversion, and full order lifecycle.
            </li>
          </ul>
        </div>
      ),
    },
  ];

  return (
    <section id="experience" className="w-full py-24" aria-label="Experience">
      <div className="mx-auto max-w-9/12 px-6">
        <h2 className="mb-8 text-3xl font-semibold md:text-4xl">Experience</h2>
        <div className="dark">
          <Timeline data={data} />
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
