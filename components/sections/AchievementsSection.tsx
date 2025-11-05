import React from "react";
import { Award, BadgeCheck, Medal, Star, Trophy } from "lucide-react";

const ACHIEVEMENTS: string[] = [
  "EthGlobal New Delhi finalist.",
  "AI Track Winner at EDU Chain Semester 3 Hackathon (10000+ participants) hosted by Open Campus.",
  "Smart India Hackathon 2024 Finalist.",
  "Runner up at Edu Chain regional hack Kolkata.",
  "AI/ML track winner at Binary ’25.",
  "Runner up at Hult Prize 2024 on-campus round.",
  "Selected as one of the top 500 participants out of 6,000+ applicants at Unfold ’24.",
  "Earned OnChain credential for contributing as a builder at Based India 2024.",
];

function pickIcon(label: string) {
  const l = label.toLowerCase();
  if (l.includes("winner")) return Trophy;
  if (l.includes("runner")) return Medal;
  if (l.includes("finalist")) return Award;
  if (l.includes("selected")) return Star;
  if (l.includes("onchain") || l.includes("credential")) return BadgeCheck;
  return Award;
}

const AchievementsSection: React.FC = () => {
  return (
    <div className="dark">
      <section id="achievements" className="w-full py-24" aria-label="Achievements">
        <div className="mx-auto max-w-9/12 px-6">
          <h2 className="mb-3 text-3xl font-semibold md:text-4xl">Achievements</h2>
          <p className="mb-10 max-w-3xl text-sm text-muted-foreground md:text-base">
            A snapshot of awards, hackathon results, and recognitions. I’ll wire this to an API later.
          </p>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {ACHIEVEMENTS.map((text, idx) => {
              const Icon = Trophy;
              return (
                <article
                  key={idx}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-linear-to-b from-white/5 to-white/4 p-5 transition-colors hover:border-white/20"
                >
                  <div className="mb-3 flex items-start gap-3">
                    <div className="rounded-lg bg-white/10 p-2 text-white">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <h3 className="text-base font-medium leading-snug md:text-lg">
                      {text}
                    </h3>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AchievementsSection;
