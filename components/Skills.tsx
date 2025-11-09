"use client";

import React, { useMemo, useState, useCallback, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

interface Skill {
    _id: string;
    name: string;
    category: string;
    iconUrl: string;
}

type Section = { title: string; items: Skill[] };

const MAX_SHOW = 5;

const SkillsFeature = () => {
    const [skills, setSkills] = useState<Skill[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchSkills() {
            try {
                const res = await fetch("/api/skill");
                const response = await res.json();
                if (response.success && response.data) {
                    setSkills(response.data);
                }
            } catch (error) {
                console.error("Error fetching skills:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchSkills();
    }, []);

    const sections: Section[] = useMemo(() => {
        if (skills.length === 0) return [];

        // Group skills by category
        const grouped = skills.reduce((acc, skill) => {
            if (!acc[skill.category]) {
                acc[skill.category] = [];
            }
            acc[skill.category].push(skill);
            return acc;
        }, {} as Record<string, Skill[]>);

        // Convert to sections array
        return Object.entries(grouped).map(([category, items]) => ({
            title: category,
            items,
        }));
    }, [skills]);

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

    if (loading) {
        return (
            <div className="mt-3 flex items-center justify-center p-8">
                <div className="text-xs text-neutral-400">Loading skills...</div>
            </div>
        );
    }

    if (sections.length === 0) {
        return (
            <div className="mt-3 flex items-center justify-center p-8">
                <div className="text-xs text-neutral-400">No skills available</div>
            </div>
        );
    }

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
                            {show.map((skill) => {
                                return (
                                    <div key={skill._id} className="flex items-center gap-1">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={skill.iconUrl}
                                            alt={skill.name}
                                            title={skill.name}
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
                                            {sec.items.map((skill) => (
                                                <div key={`modal-${skill._id}`} className="flex items-center gap-2 rounded-md border border-neutral-800/60 bg-neutral-800/50 p-2">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img
                                                        src={skill.iconUrl}
                                                        alt={skill.name}
                                                        className="w-6 h-6 rounded-sm"
                                                        loading="lazy"
                                                    />
                                                    <span className="text-xs text-neutral-300">{skill.name}</span>
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