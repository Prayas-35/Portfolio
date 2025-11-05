"use client";

import React, { useMemo, useState, useCallback, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

type Section = { title: string; items: string[] };

const ICONS: Record<string, string> = {
    "Next.js": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
    React: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
    TailwindCSS: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg",
    TypeScript: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
    Redux: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg",
    "Node.js": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
    Express: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg",
    PostgreSQL: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
    NestJS: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nestjs/nestjs-original.svg",
    MongoDB: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
    Redis: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg",
    Prisma: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/prisma/prisma-original.svg",
    GraphQL: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg",
    Solidity: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/solidity/solidity-original.svg",
    "Ethers.js": "https://raw.githubusercontent.com/ethereum-boilerplate/ethereum-boilerplate/master/public/images/ethers.png",
    Hardhat: "https://raw.githubusercontent.com/NomicFoundation/hardhat/master/.github/logo.svg",
    Truffle: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/truffle/truffle-original.svg",
    Ethereum: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ethereum/ethereum-original.svg",
    Docker: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
    AWS: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg",
    Vercel: "https://assets.vercel.com/image/upload/front/favicon/vercel/favicon.ico",
    "GitHub Actions": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/githubactions/githubactions-original.svg",
    Kubernetes: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg",
    Terraform: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/terraform/terraform-original.svg",
    Nginx: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nginx/nginx-original.svg",
};

const MAX_SHOW = 5;

const SkillsFeature = () => {
        const sections: Section[] = useMemo(
            () => [
                {
                    title: "Frontend",
                    items: ["Next.js", "React", "TailwindCSS", "TypeScript", "Redux"],
                },
                {
                    title: "Backend",
                    items: [
                        "Node.js",
                        "Express",
                        "PostgreSQL",
                        "NestJS",
                        "MongoDB",
                        "Redis",
                        "Prisma",
                        "GraphQL",
                    ],
                },
                {
                    title: "Web3",
                    items: ["Solidity", "Ethers.js", "Hardhat", "Truffle", "Ethereum"],
                },
                {
                    title: "DevOps",
                    items: [
                        "Docker",
                        "AWS",
                        "Vercel",
                        "GitHub Actions",
                        "Kubernetes",
                        "Terraform",
                        "Nginx",
                    ],
                },
            ],
            []
        );

    const [openIdx, setOpenIdx] = useState<number | null>(null);

    const close = useCallback(() => setOpenIdx(null), []);
    const onKey = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === "Escape") close();
        },
        [close]
    );

    useEffect(() => {
        if (openIdx !== null) {
            document.addEventListener("keydown", onKey);
            return () => document.removeEventListener("keydown", onKey);
        }
    }, [openIdx, onKey]);

    return (
        <div className="mt-3 grid grid-cols-2 gap-3">
            {sections.map((sec, idx) => {
                const show = sec.items.slice(0, MAX_SHOW);
                const rest = sec.items.slice(MAX_SHOW);
                const extra = rest.length;

                return (
                    <div
                        key={sec.title}
                        className="rounded-xl border border-neutral-200/60 dark:border-neutral-800/60 p-3"
                    >
                        <div className="text-xs font-medium text-neutral-300 mb-2">
                            {sec.title}
                        </div>
                                    <div className="flex items-center gap-2 flex-wrap">
                            {show.map((name) => {
                                const src = ICONS[name];
                                return (
                                    <div key={`${sec.title}-${name}`} className="flex items-center gap-1">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={src}
                                            alt={name}
                                            title={name}
                                            className="w-6 h-6 rounded-sm bg-neutral-100 dark:bg-neutral-800 p-0.5 border border-neutral-200/60 dark:border-neutral-700/60"
                                            loading="lazy"
                                        />
                                    </div>
                                );
                            })}

                                            {extra > 0 && (
                                                <Dialog open={openIdx === idx} onOpenChange={(v) => setOpenIdx(v ? idx : null)}>
                                                    <DialogTrigger asChild>
                                                        <button
                                                            type="button"
                                                            className="px-2 h-6 rounded-md text-xs bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-300 border border-neutral-200/60 dark:border-neutral-700/60 hover:bg-neutral-200/70 dark:hover:bg-neutral-700/70 transition-colors"
                                                            aria-haspopup="dialog"
                                                            aria-expanded={openIdx === idx}
                                                        >
                                                            +{extra}
                                                        </button>
                                                    </DialogTrigger>
                                                    <DialogContent className="bg-neutral-900 text-neutral-200 border-neutral-800">
                                                        <DialogHeader>
                                                            <DialogTitle>{sec.title} • All skills</DialogTitle>
                                                        </DialogHeader>
                                                        <div className="grid grid-cols-2 gap-2 pt-2">
                                                            {sec.items.map((name) => (
                                                                <div key={`modal-${sec.title}-${name}`} className="flex items-center gap-2 rounded-md border border-neutral-800/60 bg-neutral-800/50 p-2">
                                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                                    <img
                                                                        src={ICONS[name]}
                                                                        alt={name}
                                                                        className="w-6 h-6 rounded-sm"
                                                                        loading="lazy"
                                                                    />
                                                                    <span className="text-xs text-neutral-300">{name}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>
                                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default SkillsFeature;