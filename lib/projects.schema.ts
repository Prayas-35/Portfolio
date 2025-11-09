export type ProjectLink = {
  live?: string;
  repo?: string;
};

export type ProjectDetails = {
  description: string;
  highlights?: string[];
  period?: string;
  role?: string;
  links?: ProjectLink;
  readme?: string; // Markdown content (to be rendered later)
  snapshots?: string[]; // image URLs
};

export type Project = {
  id: string;
  name: string;
  slug: string;
  thumbnail: string; // URL (can be external or public path)
  shortDescription: string;
  technologies: string[];
  details: ProjectDetails;
};

export const projects: Project[] = [
  {
    id: "p1",
    name: "NovaMail",
    slug: "novamail",
    thumbnail:
      "https://dummyimage.com/640x360/0b0b0b/ffffff&text=NovaMail",
    shortDescription: "Email marketing platform with AI-assisted content.",
    technologies: ["Next.js", "TypeScript", "Tailwind", "Postgres", "AI"],
    details: {
      description:
        "End-to-end email marketing tool: campaign builder, segmentation, and AI copy suggestions.",
      highlights: [
        "WYSIWYG editor with block templates",
        "Predictive send-time optimization",
        "Deliverability analytics dashboard",
      ],
      period: "2024 – 2025",
      role: "Full‑stack developer",
      links: { live: "#", repo: "#" },
      readme:
        "# NovaMail\n\nAI-assisted email marketing platform with segmentation, deliverability insights, and a WYSIWYG editor.\n\n## Key Features\n- Templates and blocks\n- Predictive send time\n- Deliverability analytics\n\n## Tech\nNext.js, TypeScript, Tailwind, Postgres, AI services.",
      snapshots: [
        "https://dummyimage.com/1200x675/0b0b0b/ffffff&text=NovaMail+Dashboard",
        "https://dummyimage.com/1200x675/0b0b0b/ffffff&text=NovaMail+Editor",
      ],
    },
  },
  {
    id: "p2",
    name: "ChainTrack",
    slug: "chaintrack",
    thumbnail:
      "https://dummyimage.com/640x360/0b0b0b/ffffff&text=ChainTrack",
    shortDescription: "On‑chain portfolio and alerts with multi‑chain support.",
    technologies: ["Next.js", "Ethers.js", "Wagmi", "Tailwind"],
    details: {
      description:
        "Portfolio tracker with automated alerts, PnL, and gas-optimized watchers.",
      highlights: [
        "Multi‑chain token balances",
        "Custom price and wallet alerts",
        "CSV export and webhooks",
      ],
      period: "2024",
      role: "Frontend + integrations",
      links: { live: "#", repo: "#" },
      readme:
        "# ChainTrack\n\nOn-chain portfolio tracker with alerts and multi-chain support.\n\n## Highlights\n- Wallet and token balances\n- Custom alerts\n- Webhooks\n\n## Tech\nNext.js, Wagmi, Ethers.js.",
      snapshots: [
        "https://dummyimage.com/1200x675/0b0b0b/ffffff&text=ChainTrack+Portfolio",
      ],
    },
  },
  {
    id: "p3",
    name: "DevBoard",
    slug: "devboard",
    thumbnail:
      "https://dummyimage.com/640x360/0b0b0b/ffffff&text=DevBoard",
    shortDescription: "Developer metrics dashboard and GitHub analytics.",
    technologies: ["Next.js", "React", "Server Actions", "Tailwind"],
    details: {
      description:
        "Unified view of activity across repos with contribution insights.",
      highlights: [
        "PR/commit timeline",
        "Leaderboard and streaks",
        "Team insights and badges",
      ],
      period: "2025",
      role: "Frontend + product",
      links: { live: "#", repo: "#" },
      readme:
        "# DevBoard\n\nDeveloper analytics and activity dashboard.\n\n## Features\n- PR/Commit timeline\n- Streaks and badges\n- Team insights\n\n## Tech\nNext.js, Server Actions, Tailwind.",
      snapshots: [
        "https://dummyimage.com/1200x675/0b0b0b/ffffff&text=DevBoard+Timeline",
        "https://dummyimage.com/1200x675/0b0b0b/ffffff&text=DevBoard+Insights",
      ],
    },
  },
  {
    id: "p4",
    name: "LensCast",
    slug: "lenscast",
    thumbnail:
      "https://dummyimage.com/640x360/0b0b0b/ffffff&text=LensCast",
    shortDescription: "AI video summaries and highlights extraction.",
    technologies: ["Next.js", "Node", "FFmpeg", "OpenAI"],
    details: {
      description:
        "Summarize long videos, extract highlights, and auto-generate chapters.",
      highlights: [
        "Fast transcript and chaptering",
        "Speaker diarization",
        "Shareable highlight reels",
      ],
      period: "2025",
      role: "Full‑stack",
      links: { live: "#", repo: "#" },
      readme:
        "# LensCast\n\nAI-powered video summarization and highlights extraction.\n\n## Features\n- Transcript + chapters\n- Speaker diarization\n- Highlight reels\n\n## Tech\nNext.js, Node, FFmpeg, OpenAI.",
      snapshots: [
        "https://dummyimage.com/1200x675/0b0b0b/ffffff&text=LensCast+Summary",
      ],
    },
  },
  {
    id: "p5",
    name: "TaskForge",
    slug: "taskforge",
    thumbnail:
      "https://dummyimage.com/640x360/0b0b0b/ffffff&text=TaskForge",
    shortDescription: "Kanban tasks with real‑time collaboration.",
    technologies: ["Next.js", "TRPC", "Prisma", "Tailwind", "WebSockets"],
    details: {
      description:
        "Team boards, assignments, and comments with live presence.",
      highlights: [
        "Drag & drop boards",
        "Role-based access",
        "Mentions and notifications",
      ],
      period: "2023 – 2024",
      role: "Full‑stack",
      links: { live: "#", repo: "#" },
      readme:
        "# TaskForge\n\nKanban boards with real-time collaboration and presence.\n\n## Features\n- Drag and drop\n- Mentions and notifications\n- Role-based access\n\n## Tech\nNext.js, tRPC, Prisma, WebSockets.",
      snapshots: [
        "https://dummyimage.com/1200x675/0b0b0b/ffffff&text=TaskForge+Board",
        "https://dummyimage.com/1200x675/0b0b0b/ffffff&text=TaskForge+Tasks",
      ],
    },
  },
];
