import React, { useMemo, useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ExternalLink } from "lucide-react";
import Carousel from "@/components/ui/carousel";
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// API Project type
interface ApiProject {
  _id: string;
  name: string;
  overview: string;
  readme: string;
  highlights: string[];
  technologies: string[];
  projectLiveUrl: string;
  projectRepoUrl: string;
  thumbnailImageUrl: string;
  snapshotImageUrls: string[];
  createdAt: string;
  updatedAt: string;
}

// Transformed Project type for display
interface Project {
  id: string;
  name: string;
  thumbnail: string;
  shortDescription: string;
  technologies: string[];
  details: {
    description: string;
    readme: string;
    highlights: string[];
    snapshots: string[];
    links: {
      live: string;
      repo: string;
    };
  };
}

const ProjectsSection: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        const data = await response.json();
        
        if (data.success) {
          // Transform API data to component format
          const transformedProjects: Project[] = data.data.map((p: ApiProject) => ({
            id: p._id,
            name: p.name,
            thumbnail: p.thumbnailImageUrl,
            shortDescription: p.overview,
            technologies: p.technologies,
            details: {
              description: p.overview,
              readme: p.readme,
              highlights: p.highlights,
              snapshots: p.snapshotImageUrls,
              links: {
                live: p.projectLiveUrl,
                repo: p.projectRepoUrl,
              },
            },
          }));
          
          setProjects(transformedProjects);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (isLoading) {
    return (
      <section id="projects" className="w-full py-24" aria-label="Projects">
        <div className="mx-auto max-w-9/12 px-6">
          <h2 className="mb-3 text-3xl font-semibold md:text-4xl">Projects</h2>
          <p className="mb-10 max-w-3xl text-muted-foreground">
            Loading projects...
          </p>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 animate-pulse rounded-xl bg-white/5" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="w-full py-24" aria-label="Projects">
      <div className="mx-auto max-w-9/12 px-6">
        <h2 className="mb-3 text-3xl font-semibold md:text-4xl">Projects</h2>
        <p className="mb-10 max-w-3xl text-muted-foreground">
          A selection of recent work. Click a card to see more details.
        </p>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;

function TechTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-white/10 bg-linear-to-b from-white/5 to-white/5 px-2.5 py-1 text-xs text-muted-foreground">
      {children}
    </span>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className="text-left h-full w-full"
          style={{ animationDelay: `${index * 80}ms` }}
        >
          <Card className="group relative h-full overflow-hidden border border-white/8 bg-linear-to-b from-black/45 to-black/50 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:border-white/20 hover:shadow-2xl hover:shadow-purple-500/10">
            <CardHeader className="px-0 pt-0">
              <div className="relative overflow-hidden">
                <img
                  src={project.thumbnail}
                  alt={`${project.name} thumbnail`}
                  className="aspect-video w-full origin-center object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="text-lg font-semibold transition-colors duration-300 group-hover:text-purple-300">{project.name}</CardTitle>
              <CardDescription className="mt-1.5 line-clamp-2 text-sm">
                {project.shortDescription}
              </CardDescription>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.technologies.slice(0, 5).map((t) => (
                  <TechTag key={t}>{t}</TechTag>
                ))}
                {project.technologies.length > 5 && (
                  <TechTag>+{project.technologies.length - 5}</TechTag>
                )}
              </div>
            </CardContent>
            <div className="pointer-events-none absolute inset-0 rounded-xl bg-linear-to-br from-purple-500/0 via-transparent to-blue-500/0 opacity-0 transition-all duration-500 group-hover:from-purple-500/10 group-hover:to-blue-500/10 group-hover:opacity-100" />
            <div className="pointer-events-none absolute -inset-px rounded-xl bg-linear-to-br from-purple-500/20 via-transparent to-blue-500/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          </Card>
        </button>
      </DialogTrigger>
  <DialogContent className="sm:max-w-3xl md:max-w-5xl lg:max-w-6xl max-h-[85vh] overflow-y-auto [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.3)_transparent] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/20 hover:[&::-webkit-scrollbar-thumb]:bg-white/30 [&::-webkit-scrollbar-track]:bg-transparent">
        <DialogHeader>
          <DialogTitle className="text-xl">{project.name}</DialogTitle>
          {/* <DialogDescription className="mt-1">
            {project.details.description}
          </DialogDescription> */}
        </DialogHeader>

        <ProjectDialogContent project={project} />
      </DialogContent>
    </Dialog>
  );
}

function ProjectDialogContent({ project }: { project: Project }) {
  const readme = useMemo(() => project.details.readme ?? "No README yet.", [project.details.readme]);
  const snaps = useMemo(() => project.details.snapshots ?? [], [project.details.snapshots]);

  const slides = snaps.map((src, i) => ({ title: `${project.name} ${i + 1}`, button: "", src }));

  return (
    <div className="mt-3 space-y-6">
      {/* Carousel at top */}
      <div className="-mx-6">
        {slides.length > 0 ? (
          <Carousel slides={slides} fullWidth heightClass="h-56 md:h-72 lg:h-80" />
        ) : (
          <div className="aspect-video w-full rounded-md border border-white/10 bg-white/5" />
        )}
      </div>

      {/* Two-column layout below */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Left: README + description */}
        <div className="md:col-span-2 space-y-4">
          <section>
            <h4 className="mb-2 text-base font-semibold">Overview</h4>
            <p className="text-sm text-muted-foreground">{project.details.description}</p>
          </section>
          <section>
            <h4 className="mb-2 text-base font-semibold">README</h4>
            <div className="prose prose-invert max-w-none">
              <Markdown remarkPlugins={[remarkGfm]}>
                {readme}
              </Markdown>
            </div>
          </section>
        </div>

        {/* Right: Tech + links */}
        <aside className="space-y-4">
          <section>
            <h4 className="mb-2 text-base font-semibold">Tech</h4>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((t) => (
                <TechTag key={t}>{t}</TechTag>
              ))}
            </div>
          </section>
          {project.details.highlights && project.details.highlights.length > 0 && (
            <section>
              <h4 className="mb-2 text-base font-semibold">Highlights</h4>
              <ul className="list-disc pl-5 text-sm text-muted-foreground">
                {project.details.highlights.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            </section>
          )}
          {(project.details.links?.live || project.details.links?.repo) && (
            <section>
              <h4 className="mb-2 text-base font-semibold">Links</h4>
              <div className="flex gap-3">
                {project.details.links?.live && (
                  <a
                    href={project.details.links.live}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 rounded-sm border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white transition-colors hover:border-white/20 hover:bg-white/10"
                  >
                    Live <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
                {project.details.links?.repo && (
                  <a
                    href={project.details.links.repo}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 rounded-sm border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white transition-colors hover:border-white/20 hover:bg-white/10"
                  >
                    Repo <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            </section>
          )}
        </aside>
      </div>
    </div>
  );
}
