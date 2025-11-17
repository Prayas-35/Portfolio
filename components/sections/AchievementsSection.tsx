import React, { useEffect, useState } from "react";
import { Award, BadgeCheck, Medal, Star, Trophy } from "lucide-react";

interface Achievement {
  _id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

const AchievementsSection: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  async function fetchAchievements() {
    const res = await fetch("/api/achievements");
    if (!res.ok) {
      throw new Error("Failed to fetch achievements");
    }
    const data = await res.json();
    return data;
  }

  useEffect(() => {
    fetchAchievements().then(data => {
      setAchievements(data.data);
    }).catch(error => {
      console.error(error);
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  return (
    <div className="dark">
      <section id="achievements" className="w-full py-24" aria-label="Achievements">
        <div className="mx-auto max-w-7xl md:max-w-9/12 px-6">
          <h2 className="mb-3 text-3xl font-semibold md:text-4xl">Achievements</h2>
          <p className="mb-10 max-w-3xl text-sm text-muted-foreground md:text-base">
            A snapshot of awards, hackathon results, and recognitions.
          </p>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              <p>Loading...</p>
            ) : (
              achievements.map((achievement, idx) => {
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
                        {achievement.title}
                      </h3>
                    </div>
                  </article>
                );
              }))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AchievementsSection;
