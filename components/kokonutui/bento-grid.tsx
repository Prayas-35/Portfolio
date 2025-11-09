"use client";

/**
 * @author: @dorian_baffier
 * @description: Bento Grid
 * @version: 1.0.0
 * @date: 2025-06-26
 * @license: MIT
 * @website: https://kokonutui.com
 * @github: https://github.com/kokonut-labs/kokonutui
 */

import Anthropic from "@/components/kokonutui/anthropic";
import AnthropicDark from "@/components/kokonutui/anthropic-dark";
import Google from "@/components/kokonutui/gemini";
import OpenAI from "@/components/kokonutui/open-ai";
import OpenAIDark from "@/components/kokonutui/open-ai-dark";
import MistralAI from "@/components/kokonutui/mistral";
import DeepSeek from "@/components/kokonutui/deepseek";
import GithubHeatmap from "@/components/github-heatmap";
import { cn } from "@/lib/utils";
import {
    Mic,
    Plus,
    ArrowUpRight,
    CheckCircle2,
    Clock,
    Sparkles,
    Zap,
    Import,
} from "lucide-react";
import {
    motion,
    useMotionValue,
    useTransform,
    type Variants,
} from "motion/react";
import Link from "next/link";
import SkillsFeature from "../Skills";
import { useState, useEffect, useRef } from "react";

interface BentoItem {
    id: string;
    title: string;
    description: string;
    icons?: boolean;
    href?: string;
    feature?:
    | "chart"
    | "counter"
    | "code"
    | "timeline"
    | "spotlight"
    | "icons"
    | "typing"
    | "metrics"
    | "heatmap"
    | "skills"
    | "event";
    spotlightItems?: string[];
    timeline?: Array<{ year: string; event: string }>;
    code?: string;
    codeLang?: string;
    typingText?: string;
    metrics?: Array<{
        label: string;
        value: number;
        suffix?: string;
        color?: string;
    }>;
    statistic?: {
        value: string;
        label: string;
        start?: number;
        end?: number;
        suffix?: string;
    };
    size?: "sm" | "md" | "lg";
    className?: string;
    // event-specific
    imageSrc?: string;
    imageAlt?: string;
    subtitle?: string;
}
const bentoItems: BentoItem[] = [
    {
        id: "current-project",
        title: "Current project: WeAreSMS",
        description:
            "Multi-tenant SMS marketing platform with ClickSend, HLR, segments, and analytics.",
        href: "#projects",
        feature: "spotlight",
        spotlightItems: [
            "Campaigns, segments, seed lists",
            "HLR lookup + delivery webhooks",
            "ClickSend integration",
            "Role-based access controls",
            "Real-time queue + retries",
        ],
        size: "lg",
        className: "col-span-1 row-span-1",
    },
    {
        id: "github-activity",
        title: "GitHub activity",
        description: "My recent commit history heatmap (last 12 months)",
        href: "https://github.com/Prayas-35",
        feature: "heatmap",
        size: "md",
        className: "col-span-2 row-span-1 col-start-2",
    },
    {
        id: "skills",
        title: "Skills & Stack",
        description: "Tech I work with across the stack",
        feature: "skills",
        size: "md",
        className: "col-span-1 row-span-1",
    },
    {
        id: "next-at",
        title: "Find me next at",
        description: "Upcoming conferences and hackathons",
        feature: "event",
        imageSrc: "/event-placeholder.svg",
        imageAlt: "Event poster",
        subtitle: "TBD • 2025",
        size: "sm",
        className: "col-span-1 row-span-1",
    },
];

const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: "easeOut",
        },
    },
};

const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.3,
        },
    },
};

const SpotlightFeature = ({ items }: { items: string[] }) => {
    return (
        <ul className="mt-2 space-y-1.5">
            {items.map((item, index) => (
                <motion.li
                    key={`spotlight-${item.toLowerCase().replace(/\s+/g, "-")}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-center gap-2"
                >
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
                    <span className="text-sm text-neutral-300">
                        {item}
                    </span>
                </motion.li>
            ))}
        </ul>
    );
};

const CounterAnimation = ({
    start,
    end,
    suffix = "",
}: {
    start: number;
    end: number;
    suffix?: string;
}) => {
    const [count, setCount] = useState(start);

    useEffect(() => {
        const duration = 2000;
        const frameRate = 1000 / 60;
        const totalFrames = Math.round(duration / frameRate);

        let currentFrame = 0;
        const counter = setInterval(() => {
            currentFrame++;
            const progress = currentFrame / totalFrames;
            const easedProgress = 1 - (1 - progress) ** 3;
            const current = start + (end - start) * easedProgress;

            setCount(Math.min(current, end));

            if (currentFrame === totalFrames) {
                clearInterval(counter);
            }
        }, frameRate);

        return () => clearInterval(counter);
    }, [start, end]);

    return (
        <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                {count.toFixed(1).replace(/\.0$/, "")}
            </span>
            <span className="text-xl font-medium text-neutral-900 dark:text-neutral-100">
                {suffix}
            </span>
        </div>
    );
};

const ChartAnimation = ({ value }: { value: number }) => {
    return (
        <div className="mt-2 w-full h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
            <motion.div
                className="h-full bg-emerald-500 dark:bg-emerald-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${value}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
            />
        </div>
    );
};

const IconsFeature = () => {
    return (
        <div className="grid grid-cols-3 gap-4 mt-4">
            <motion.div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-linear-to-b from-neutral-100/80 to-neutral-100 dark:from-neutral-800/80 dark:to-neutral-800 border border-neutral-200/50 dark:border-neutral-700/50 group transition-all duration-300 hover:border-neutral-300 dark:hover:border-neutral-600">
                <div className="relative w-8 h-8 flex items-center justify-center">
                    <OpenAI className="w-7 h-7 dark:hidden transition-transform " />
                    <OpenAIDark className="w-7 h-7 hidden dark:block transition-transform " />
                </div>
                <span className="text-xs font-medium text-center text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-neutral-200">
                    OpenAI
                </span>
            </motion.div>
            <motion.div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-linear-to-b from-neutral-100/80 to-neutral-100 dark:from-neutral-800/80 dark:to-neutral-800 border border-neutral-200/50 dark:border-neutral-700/50 group transition-all duration-300 hover:border-neutral-300 dark:hover:border-neutral-600">
                <div className="relative w-8 h-8 flex items-center justify-center">
                    <Anthropic className="w-7 h-7 dark:hidden transition-transform " />
                    <AnthropicDark className="w-7 h-7 hidden dark:block transition-transform " />
                </div>
                <span className="text-xs font-medium text-center text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-neutral-200">
                    Anthropic
                </span>
            </motion.div>
            <motion.div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-linear-to-b from-neutral-100/80 to-neutral-100 dark:from-neutral-800/80 dark:to-neutral-800 border border-neutral-200/50 dark:border-neutral-700/50 group transition-all duration-300 hover:border-neutral-300 dark:hover:border-neutral-600">
                <div className="relative w-8 h-8 flex items-center justify-center">
                    <Google className="w-7 h-7 transition-transform " />
                </div>
                <span className="text-xs font-medium text-center text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-neutral-200">
                    Google
                </span>
            </motion.div>
            <motion.div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-linear-to-b from-neutral-100/80 to-neutral-100 dark:from-neutral-800/80 dark:to-neutral-800 border border-neutral-200/50 dark:border-neutral-700/50 group transition-all duration-300 hover:border-neutral-300 dark:hover:border-neutral-600">
                <div className="relative w-8 h-8 flex items-center justify-center">
                    <MistralAI className="w-7 h-7 transition-transform " />
                </div>
                <span className="text-xs font-medium text-center text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-neutral-200">
                    Mistral
                </span>
            </motion.div>
            <motion.div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-linear-to-b from-neutral-100/80 to-neutral-100 dark:from-neutral-800/80 dark:to-neutral-800 border border-neutral-200/50 dark:border-neutral-700/50 group transition-all duration-300 hover:border-neutral-300 dark:hover:border-neutral-600">
                <div className="relative w-8 h-8 flex items-center justify-center">
                    <DeepSeek className="w-7 h-7 transition-transform " />
                </div>
                <span className="text-xs font-medium text-center text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-neutral-200">
                    DeepSeek
                </span>
            </motion.div>
            <motion.div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-linear-to-b from-neutral-100/80 to-neutral-100 dark:from-neutral-800/80 dark:to-neutral-800 border border-neutral-200/50 dark:border-neutral-700/50 group transition-all duration-300 hover:border-neutral-300 dark:hover:border-neutral-600">
                <div className="relative w-8 h-8 flex items-center justify-center">
                    <Plus className="w-6 h-6 text-neutral-600 dark:text-neutral-400 transition-transform " />
                </div>
                <span className="text-xs font-medium text-center text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-neutral-200">
                    More
                </span>
            </motion.div>
        </div>
    );
};

const TimelineFeature = ({
    timeline,
}: {
    timeline: Array<{ year: string; event: string }>;
}) => {
    return (
        <div className="mt-3 relative">
            <div className="absolute top-0 bottom-0 left-[9px] w-0.5 bg-neutral-200 dark:bg-neutral-700" />
            {timeline.map((item) => (
                <motion.div
                    key={`timeline-${item.year}-${item.event
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                    className="flex gap-3 mb-3 relative"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                        delay: (0.15 * Number.parseInt(item.year)) % 10,
                    }}
                >
                    <div className="w-5 h-5 rounded-full bg-neutral-100 dark:bg-neutral-800 border-2 border-neutral-300 dark:border-neutral-600 shrink-0 z-10 mt-0.5" />
                    <div>
                        <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                            {item.year}
                        </div>
                        <div className="text-xs text-neutral-600 dark:text-neutral-400">
                            {item.event}
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

const TypingCodeFeature = ({ text }: { text: string }) => {
    const [displayedText, setDisplayedText] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);
    const terminalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (currentIndex < text.length) {
            const timeout = setTimeout(() => {
                setDisplayedText((prev) => prev + text[currentIndex]);
                setCurrentIndex((prev) => prev + 1);

                if (terminalRef.current) {
                    terminalRef.current.scrollTop =
                        terminalRef.current.scrollHeight;
                }
            }, Math.random() * 30 + 10); // Random typing speed for realistic effect

            return () => clearTimeout(timeout);
        }
    }, [currentIndex, text]);

    // Reset animation when component unmounts and remounts
    useEffect(() => {
        setDisplayedText("");
        setCurrentIndex(0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="mt-3 relative">
            <div className="flex items-center gap-2 mb-2">
                <div className="text-xs text-neutral-500 dark:text-neutral-400">
                    server.ts
                </div>
            </div>
            <div
                ref={terminalRef}
                className="bg-neutral-900 dark:bg-black text-neutral-100 p-3 rounded-md text-xs font-mono h-[150px] overflow-y-auto"
            >
                <pre className="whitespace-pre-wrap">
                    {displayedText}
                    <span className="animate-pulse">|</span>
                </pre>
            </div>
        </div>
    );
};

const MetricsFeature = ({
    metrics,
}: {
    metrics: Array<{
        label: string;
        value: number;
        suffix?: string;
        color?: string;
    }>;
}) => {
    const getColorClass = (color = "emerald") => {
        const colors = {
            emerald: "bg-emerald-500 dark:bg-emerald-400",
            blue: "bg-blue-500 dark:bg-blue-400",
            violet: "bg-violet-500 dark:bg-violet-400",
            amber: "bg-amber-500 dark:bg-amber-400",
            rose: "bg-rose-500 dark:bg-rose-400",
        };
        return colors[color as keyof typeof colors] || colors.emerald;
    };

    return (
        <div className="mt-3 space-y-3">
            {metrics.map((metric, index) => (
                <motion.div
                    key={`metric-${metric.label
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                    className="space-y-1"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 * index }}
                >
                    <div className="flex justify-between items-center text-sm">
                        <div className="text-neutral-300 font-medium flex items-center gap-1.5">
                            {metric.label === "Uptime" && (
                                <Clock className="w-3.5 h-3.5" />
                            )}
                            {metric.label === "Response time" && (
                                <Zap className="w-3.5 h-3.5" />
                            )}
                            {metric.label === "Cost reduction" && (
                                <Sparkles className="w-3.5 h-3.5" />
                            )}
                            {metric.label}
                        </div>
                        <div className="text-neutral-300 font-semibold">
                            {metric.value}
                            {metric.suffix}
                        </div>
                    </div>
                    <div className="h-1.5 w-full bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                        <motion.div
                            className={`h-full rounded-full ${getColorClass(
                                metric.color
                            )}`}
                            initial={{ width: 0 }}
                            animate={{
                                width: `${Math.min(100, metric.value)}%`,
                            }}
                            transition={{
                                duration: 1.2,
                                ease: "easeOut",
                                delay: 0.15 * index,
                            }}
                        />
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

function AIInput_Voice() {
    const [submitted, setSubmitted] = useState(false);
    const [time, setTime] = useState(0);
    const [isClient, setIsClient] = useState(false);
    const [isDemo, setIsDemo] = useState(true);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        let intervalId: NodeJS.Timeout;

        if (submitted) {
            intervalId = setInterval(() => {
                setTime((t) => t + 1);
            }, 1000);
        } else {
            setTime(0);
        }

        return () => clearInterval(intervalId);
    }, [submitted]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs
            .toString()
            .padStart(2, "0")}`;
    };

    useEffect(() => {
        if (!isDemo) return;

        let timeoutId: NodeJS.Timeout;
        const runAnimation = () => {
            setSubmitted(true);
            timeoutId = setTimeout(() => {
                setSubmitted(false);
                timeoutId = setTimeout(runAnimation, 1000);
            }, 3000);
        };

        const initialTimeout = setTimeout(runAnimation, 100);
        return () => {
            clearTimeout(timeoutId);
            clearTimeout(initialTimeout);
        };
    }, [isDemo]);

    const handleClick = () => {
        if (isDemo) {
            setIsDemo(false);
            setSubmitted(false);
        } else {
            setSubmitted((prev) => !prev);
        }
    };

    return (
        <div className="w-full py-4">
            <div className="relative max-w-xl w-full mx-auto flex items-center flex-col gap-2">
                <button
                    className={cn(
                        "group w-16 h-16 rounded-xl flex items-center justify-center transition-colors",
                        submitted
                            ? "bg-none"
                            : "bg-none hover:bg-black/10 dark:hover:bg-white/10"
                    )}
                    type="button"
                    onClick={handleClick}
                >
                    {submitted ? (
                        <div
                            className="w-6 h-6 rounded-sm animate-spin bg-black  dark:bg-white cursor-pointer pointer-events-auto"
                            style={{ animationDuration: "3s" }}
                        />
                    ) : (
                        <Mic className="w-6 h-6 text-black/70 dark:text-white/70" />
                    )}
                </button>

                <span
                    className={cn(
                        "font-mono text-sm transition-opacity duration-300",
                        submitted
                            ? "text-black/70 dark:text-white/70"
                            : "text-black/30 dark:text-white/30"
                    )}
                >
                    {formatTime(time)}
                </span>

                <div className="h-4 w-64 flex items-center justify-center gap-0.5">
                    {[...Array(48)].map((_, i) => (
                        <div
                            key={`voice-bar-${i}`}
                            className={cn(
                                "w-0.5 rounded-full transition-all duration-300",
                                submitted
                                    ? "bg-black/50 dark:bg-white/50 animate-pulse"
                                    : "bg-black/10 dark:bg-white/10 h-1"
                            )}
                            style={
                                submitted && isClient
                                    ? {
                                        height: `${20 + Math.random() * 80}%`,
                                        animationDelay: `${i * 0.05}s`,
                                    }
                                    : undefined
                            }
                        />
                    ))}
                </div>

                <p className="h-4 text-xs text-black/70 dark:text-white/70">
                    {submitted ? "Listening..." : "Click to speak"}
                </p>
            </div>
        </div>
    );
}

const BentoCard = ({ item }: { item: BentoItem }) => {
    const [isHovered, setIsHovered] = useState(false);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useTransform(y, [-100, 100], [2, -2]);
    const rotateY = useTransform(x, [-100, 100], [-2, 2]);

    function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
        const rect = event.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct * 100);
        y.set(yPct * 100);
    }

    function handleMouseLeave() {
        x.set(0);
        y.set(0);
        setIsHovered(false);
    }

    return (
        <motion.div
            variants={fadeInUp}
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="h-full"
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={handleMouseLeave}
            onMouseMove={handleMouseMove}
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
            }}
        >
            <Link
                href={item.href || "#"}
                className={`
                    group relative flex flex-col gap-4 h-full rounded-xl p-5
                    bg-linear-to-b from-neutral-50/60 via-neutral-50/40 to-neutral-50/30 
                    dark:from-neutral-900/60 dark:via-neutral-900/40 dark:to-neutral-900/30
                    border border-neutral-200/60 dark:border-neutral-800/60
                    before:absolute before:inset-0 before:rounded-xl
                    before:bg-linear-to-b before:from-white/10 before:via-white/20 before:to-transparent 
                    dark:before:from-black/10 dark:before:via-black/20 dark:before:to-transparent
                    before:opacity-100 before:transition-opacity before:duration-500
                    after:absolute after:inset-0 after:rounded-xl after:bg-neutral-50/70 dark:after:bg-neutral-900/70 after:z-[-1]
                    backdrop-blur-xs
                    shadow-[0_4px_20px_rgb(0,0,0,0.04)] dark:shadow-[0_4px_20px_rgb(0,0,0,0.2)]
                    hover:border-neutral-300/50 dark:hover:border-neutral-700/50
                    hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.3)]
                    hover:backdrop-blur-sm
                    hover:bg-linear-to-b hover:from-neutral-50/60 hover:via-neutral-50/30 hover:to-neutral-50/20
                    dark:hover:from-neutral-800/60 dark:hover:via-neutral-800/30 dark:hover:to-neutral-800/20
                    transition-all duration-500 ease-out ${item.className}
                `}
                tabIndex={0}
                aria-label={`${item.title} - ${item.description}`}
            >
                <div
                    className="relative z-10 flex flex-col gap-3 h-full"
                    style={{ transform: "translateZ(20px)" }}
                >
                    <div className="space-y-2 flex-1 flex flex-col">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 group-hover:text-neutral-300 transition-colors duration-300">
                                {item.title}
                            </h3>
                            <div className="text-neutral-400 dark:text-neutral-500 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                                <ArrowUpRight className="h-5 w-5" />
                            </div>
                        </div>

                        <p className="text-sm text-neutral-400 tracking-tight">
                            {item.description}
                        </p>

                        {/* Feature specific content */}
                        {item.feature === "spotlight" &&
                            item.spotlightItems && (
                                <SpotlightFeature items={item.spotlightItems} />
                            )}

                        {item.feature === "counter" && item.statistic && (
                            <div className="mt-auto pt-3">
                                <CounterAnimation
                                    start={item.statistic.start || 0}
                                    end={item.statistic.end || 100}
                                    suffix={item.statistic.suffix}
                                />
                            </div>
                        )}

                        {item.feature === "chart" && item.statistic && (
                            <div className="mt-auto pt-3">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm font-medium text-neutral-300">
                                        {item.statistic.label}
                                    </span>
                                    <span className="text-sm font-medium text-neutral-300">
                                        {item.statistic.end}
                                        {item.statistic.suffix}
                                    </span>
                                </div>
                                <ChartAnimation
                                    value={item.statistic.end || 0}
                                />
                            </div>
                        )}

                        {item.feature === "timeline" && item.timeline && (
                            <TimelineFeature timeline={item.timeline} />
                        )}

                        {item.feature === "icons" && <IconsFeature />}

                        {item.feature === "typing" && item.typingText && (
                            <TypingCodeFeature text={item.typingText} />
                        )}

                        {item.feature === "metrics" && item.metrics && (
                            <MetricsFeature metrics={item.metrics} />
                        )}

                        {item.icons && !item.feature && (
                            <div className="mt-auto pt-4 flex items-center flex-wrap gap-4 border-t border-neutral-800/70">
                                <OpenAI className="w-5 h-5 dark:hidden opacity-70 hover:opacity-100 transition-opacity" />
                                <OpenAIDark className="w-5 h-5 hidden dark:block opacity-70 hover:opacity-100 transition-opacity" />
                                <AnthropicDark className="w-5 h-5 dark:block hidden opacity-70 hover:opacity-100 transition-opacity" />
                                <Anthropic className="w-5 h-5 dark:hidden opacity-70 hover:opacity-100 transition-opacity" />
                                <Google className="w-5 h-5 opacity-70 hover:opacity-100 transition-opacity" />
                                <MistralAI className="w-5 h-5 opacity-70 hover:opacity-100 transition-opacity" />
                                <DeepSeek className="w-5 h-5 opacity-70 hover:opacity-100 transition-opacity" />
                            </div>
                        )}

                        {item.feature === "heatmap" && (
                            <div className="mt-3">
                                <GithubHeatmap />
                            </div>
                        )}

                        {item.feature === "skills" && <SkillsFeature />}

                        {item.feature === "event" && (
                            <div className="mt-3 relative overflow-hidden rounded-lg border border-neutral-200/60 dark:border-neutral-800/60">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={item.imageSrc || "/event-placeholder.svg"}
                                    alt={item.imageAlt || "Event"}
                                    className="w-full h-36 object-cover opacity-90"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                                <div className="absolute bottom-2 left-3 right-3">
                                    <div className="text-sm font-medium text-white">
                                        {item.subtitle || "Soon"}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

export default function BentoGrid() {
    const [data, setData] = useState<BentoItem[]>(bentoItems);

    async function fetchCurrentProject() {
        try {
            const res = await fetch("/api/currentProject");
            const response = await res.json();

            if (response.success && response.data) {
                const project = response.data;
                const updatedItems = bentoItems.map((item) => {
                    if (item.id === "current-project") {
                        return {
                            ...item,
                            title: `Current project: ${project.title}`,
                            description: project.description,
                            spotlightItems: project.points,
                        };
                    }
                    return item;
                });
                setData(updatedItems);
            }
        } catch (error) {
            console.error("Error fetching current project:", error);
            setData(bentoItems);
        }
    }

    async function fetchFindMe() {
        const res = await fetch("/api/findMe");
        const response = await res.json();



        if (response.success && response.data) {
            const event = response.data[0];
            console.log("Fetched event data:", event);
            const eventDate = new Date(event.date);
            const formattedDate = eventDate.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
            });
            const updatedItems = bentoItems.map((item) => {
                if (item.id === "next-at") {
                    return {
                        ...item,
                        title: `${event.type === 'past' ? 'I was last at:' : 'Find me next at:'} ${event.event}`,
                        description: event.description,
                        imageSrc: event.imageUrl,
                        subtitle: `${formattedDate} • ${event.location}`,
                        href: event.eventUrl,
                    };
                }
                return item;
            });
            setData(updatedItems);
        }
    }

    useEffect(() => {
        fetchCurrentProject();
        fetchFindMe();
    }, [data, setData, fetchCurrentProject, fetchFindMe]);

    return (
        <div className="dark">
            <section className="relative py-24 sm:py-32 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Bento Grid */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        className="grid gap-6"
                    >
                        <div className="grid md:grid-cols-3 gap-6">
                            <motion.div
                                variants={fadeInUp}
                                className="md:col-span-1"
                            >
                                <BentoCard item={data[0]} />
                            </motion.div>
                            <motion.div
                                variants={fadeInUp}
                                className="md:col-span-2"
                            >
                                <BentoCard item={data[1]} />
                            </motion.div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                            <motion.div
                                variants={fadeInUp}
                                className="md:col-span-1"
                            >
                                <BentoCard item={data[2]} />
                            </motion.div>
                            <motion.div
                                variants={fadeInUp}
                                className="md:col-span-1"
                            >
                                <BentoCard item={data[3]} />
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
