"use client";

import React from "react";
import { usePathname } from "next/navigation";
import ClickSpark from "@/components/ClickSpark";
import PillNav from "@/components/PillNav";
import logo from "@/public/logo.png";

export default function Wrapper({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const pathname = usePathname();
    const isAdminRoute = pathname?.startsWith("/admin");
    const [active, setActive] = React.useState<string>("#home");
    const activeRef = React.useRef<string>("#home");
    const items = React.useMemo(
        () => [
            { label: 'Home', href: '#home' },
            { label: 'About', href: '#about' },
            { label: 'Experience', href: '#experience' },
            { label: 'Projects', href: '#projects' },
            { label: 'Achievements', href: '#achievements' },
            { label: 'Contact', href: '#contact' }
        ],
        []
    );

    React.useEffect(() => {
        if (typeof window === "undefined" || isAdminRoute) return;
        const ids = ["home", "about", "experience", "projects", "achievements", "contact"];
        const getActiveByCenter = () => {
            let bestId = ids[0];
            let bestDist = Number.POSITIVE_INFINITY;
            const mid = window.innerHeight / 2;
            for (const id of ids) {
                const el = document.getElementById(id);
                if (!el) continue;
                const rect = el.getBoundingClientRect();
                const center = rect.top + rect.height / 2;
                const dist = Math.abs(center - mid);
                if (dist < bestDist) {
                    bestDist = dist;
                    bestId = id;
                }
            }
            return `#${bestId}`;
        };

        // Initialize from URL hash if present
        if (window.location.hash && ids.includes(window.location.hash.slice(1))) {
            activeRef.current = window.location.hash;
            setActive(window.location.hash);
        } else {
            const initial = getActiveByCenter();
            activeRef.current = initial;
            setActive(initial);
        }

        let ticking = false;
        const update = () => {
            ticking = false;
            const next = getActiveByCenter();
            if (next !== activeRef.current) {
                activeRef.current = next;
                setActive(next);
            }
        };
        const onScroll = () => {
            if (!ticking) {
                ticking = true;
                requestAnimationFrame(update);
            }
        };
        const onResize = onScroll;
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onResize);

        const onHashChange = () => {
            if (window.location.hash) {
                activeRef.current = window.location.hash;
                setActive(window.location.hash);
            }
        };
        window.addEventListener("hashchange", onHashChange);

        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onResize);
            window.removeEventListener("hashchange", onHashChange);
        };
    }, [isAdminRoute]);

    return (
        <>
            {!isAdminRoute && (
                <PillNav
                    logo={logo}
                    logoAlt="Portfolio Logo"
                    items={items}
                    activeHref={active}
                    className=""
                    ease="power3.easeOut"
                    containerBg="rgba(16,18,27,0.55)"
                    accentColor="#B19EEF"
                    pillColor="rgba(255,255,255,0.08)"
                    hoveredPillTextColor="#0B0B0F"
                    pillTextColor="#E5E7EB"
                />
            )}
            <ClickSpark
                sparkColor="#fff"
                sparkSize={10}
                sparkRadius={40}
                sparkCount={10}
                duration={400}
            >
                {children}
            </ClickSpark>
        </>
    );
}
