"use client";

import React, { useEffect, useMemo, useState } from "react";

type ContributionDay = {
    date: string;
    count: number;
    color?: string; // optional: some APIs return `color`
    level?: number; // some APIs use `level` 0-4
    intensity?: number; // normalized 0-4
};

type Week = {
    days: ContributionDay[];
};

type ApiResponse = {
    total?: { [year: string]: number };
    // The API shape varies; we keep it permissive
    contributions?: unknown;
    years?: Array<{
        year: string;
        total: number;
        weeks: Array<{
            contributionDays: ContributionDay[];
        }>;
    }>;
};

interface GithubHeatmapProps {
    username?: string;
    year?: "last" | number;
}

// Lightweight GitHub contributions heatmap using a public API. No token required.
// Data source: https://github-contributions-api.jogruber.de
export default function GithubHeatmap({ username, year = "last" }: GithubHeatmapProps) {
    const user = username || process.env.NEXT_PUBLIC_GITHUB_USERNAME || "octocat";
    const [data, setData] = useState<ApiResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();
        const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
        const cacheKey = `github-contrib-${user}-${year}`;

        const loadData = async () => {
            try {
                setLoading(true);

                // 1️⃣ Try to load cached data
                const cached = localStorage.getItem(cacheKey);
                const cachedAt = localStorage.getItem(`${cacheKey}-time`);

                if (cached && cachedAt && Date.now() - Number(cachedAt) < CACHE_DURATION) {
                    // Use cached data
                    if (!isMounted) return;
                    setData(JSON.parse(cached));
                    setError(null);
                    setLoading(false);
                    return;
                }

                // 2️⃣ Otherwise, fetch fresh data
                const res = await fetch(
                    `https://github-contributions-api.jogruber.de/v4/${user}?y=${year}`,
                    {
                        signal: controller.signal,
                        cache: "reload", // bypass browser cache, fetch fresh
                    }
                );

                if (!res.ok) throw new Error(`Failed to load heatmap: ${res.status}`);

                const json = (await res.json()) as ApiResponse;

                // 3️⃣ Cache new data
                localStorage.setItem(cacheKey, JSON.stringify(json));
                localStorage.setItem(`${cacheKey}-time`, Date.now().toString());

                // 4️⃣ Update UI
                if (!isMounted) return;
                setData(json);
                setError(null);
            } catch (e: unknown) {
                if (!isMounted) return;
                setError(e instanceof Error ? e.message : "Unknown error");
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        loadData();

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, [user, year]);

    const normalizeWeeks = (raw: ApiResponse | null): Week[] => {
        if (!raw) return [];

        // Case 1: response.years[0].weeks[].contributionDays
        if (Array.isArray(raw.years) && raw.years.length > 0) {
            // pick last year or matching year
            const target =
                year === "last"
                    ? raw.years[raw.years.length - 1]
                    : raw.years.find((y) => String(y.year) === String(year)) ||
                    raw.years[raw.years.length - 1];
            if (target && Array.isArray(target.weeks)) {
                return target.weeks.map((w) => ({
                    days: (w.contributionDays || []).map((d) => ({
                        ...d,
                        intensity:
                            typeof d.intensity === "number"
                                ? d.intensity
                                : typeof d.level === "number"
                                    ? d.level
                                    : 0,
                    })),
                }));
            }
        }

        // Case 2: response.contributions as array of weeks with `.days`
        if (Array.isArray((raw as any).contributions)) {
            const arr = (raw as any).contributions as Array<any>;
            if (arr.length > 0 && Array.isArray(arr[0]?.days)) {
                return arr.map((w) => ({
                    days: (w.days || []).map((d: any) => ({
                        date: d.date,
                        count: Number(d.count) || 0,
                        color: d.color,
                        intensity:
                            typeof d.intensity === "number"
                                ? d.intensity
                                : typeof d.level === "number"
                                    ? d.level
                                    : 0,
                    })),
                }));
            }

            // Case 2b: response.contributions is flat array of days; group into weeks
            if (arr.length > 0 && arr[0]?.date) {
                // Sort by date ascending
                const days = arr
                    .map((d: any) => ({
                        date: d.date,
                        count: Number(d.count) || 0,
                        color: d.color,
                        intensity:
                            typeof d.intensity === "number"
                                ? d.intensity
                                : typeof d.level === "number"
                                    ? d.level
                                    : 0,
                    }))
                    .sort((a: ContributionDay, b: ContributionDay) =>
                        a.date.localeCompare(b.date)
                    );

                // Group by ISO weeks (simple 7-day chunking fallback)
                const weeks: Week[] = [];
                for (let i = 0; i < days.length; i += 7) {
                    weeks.push({ days: days.slice(i, i + 7) });
                }
                return weeks;
            }
        }

        return [];
    };

    const weeks = useMemo(() => normalizeWeeks(data), [data, year]);

    const total = useMemo(() => {
        // Prefer provided totals
        if (data?.total) {
            if (year === "last") {
                const years = Object.keys(data.total).sort();
                const last = years[years.length - 1];
                return data.total[last] ?? 0;
            }
            return data.total[String(year)] ?? 0;
        }
        // Fallback: sum over normalized weeks
        return weeks.reduce(
            (acc, w) => acc + w.days.reduce((s, d) => s + (d.count || 0), 0),
            0
        );
    }, [data, weeks, year]);

    const colorForIntensity = (i: number) => {
        // Tailwind-friendly classes for 0-4 intensity
        switch (i) {
            case 0:
                return "bg-neutral-800";
            case 1:
                return "bg-emerald-900";
            case 2:
                return "bg-emerald-700";
            case 3:
                return "bg-emerald-600";
            case 4:
            default:
                return "bg-emerald-500";
        }
    };

    return (
        <div className="w-full flex flex-col gap-3">
            <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-600 dark:text-neutral-400">GitHub commits</span>
                {!loading && (
                    <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                        Total: {total}
                    </span>
                )}
            </div>
            <div className="relative rounded-md border border-neutral-200/70 dark:border-neutral-800/70 p-3">
                {loading && (
                    <div className="text-xs text-neutral-500 dark:text-neutral-400">Loading heatmap…</div>
                )}
                {error && (
                    <div className="text-xs text-rose-600 dark:text-rose-400">{error}</div>
                )}
                {!!weeks.length && (
                    <div className="w-full overflow-x-auto">
                        <div
                            className="grid w-full"
                            style={{
                                gridTemplateColumns: `repeat(${weeks.length}, minmax(0, 1fr))`,
                                gap: "2px",
                            }}
                        >
                            {weeks.map((w, wi) => (
                                <div key={wi} className="grid grid-rows-7 gap-2">
                                    {(w?.days || []).map((d, di) => (
                                        <div
                                            key={`${wi}-${di}`}
                                            title={`${d.count} on ${d.date}`}
                                            className={`w-full aspect-square rounded-sm ${colorForIntensity(
                                                d.intensity ?? 0
                                            )}`}
                                        />
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>

                )}
            </div>
            <div className="flex items-center gap-2 justify-end">
                <span className="text-[10px] text-neutral-500 dark:text-neutral-400">Less</span>
                <div className="w-3 h-3 rounded-sm bg-neutral-800" />
                <div className="w-3 h-3 rounded-sm bg-emerald-900" />
                <div className="w-3 h-3 rounded-sm bg-emerald-700" />
                <div className="w-3 h-3 rounded-sm bg-emerald-600" />
                <div className="w-3 h-3 rounded-sm bg-emerald-500" />
                <span className="text-[10px] text-neutral-500 dark:text-neutral-400">More</span>
            </div>
        </div>
    );
}
