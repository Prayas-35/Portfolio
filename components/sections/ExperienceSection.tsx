import React, { useEffect, useState } from "react";
import { Timeline } from "@/components/ui/timeline";

interface Experience {
  _id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  responsibilities: string[];
  createdAt: string;
  updatedAt: string;
}

const ExperienceSection: React.FC = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/experience");
        if (!res.ok) throw new Error("Failed to fetch experience data");
        const response = await res.json();
        setExperiences(response.data); // assuming { data: [...] }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Convert API data into format expected by Timeline
  const timelineData =
    experiences?.map((exp) => ({
      title: `${exp.position} (${new Date(exp.startDate).toLocaleString("default", {
        month: "short",
        year: "numeric",
      })} – Present)`,
      content: (
        <div>
          <p className="mb-4 text-xs md:text-sm text-neutral-600 dark:text-neutral-300">
            {exp.company} — {exp.location}
          </p>
          <ul className="space-y-2 text-xs md:text-sm text-neutral-700 dark:text-neutral-200 list-disc pl-5">
            {exp.responsibilities.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
      ),
    })) || [];

  return (
    <section id="experience" className="w-full py-24" aria-label="Experience">
      <div className="mx-auto max-w-7xl md:max-w-9/12 px-6">
        <h2 className="mb-8 text-3xl font-semibold md:text-4xl">Experience</h2>
        <div className="dark">
          {loading ? (
            <p className="text-neutral-500">Loading...</p>
          ) : (
            <Timeline data={timelineData} />
          )}
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
