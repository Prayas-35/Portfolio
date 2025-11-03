"use client";

import React from "react";
import ClickSpark from "@/components/ClickSpark";
import PillNav from "@/components/PillNav";
import logo from "@/public/next.svg";

export default function Wrapper({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <PillNav
                logo={logo}
                logoAlt="Company Logo"
                items={[
                    { label: 'Home', href: '/' },
                    { label: 'About', href: '/about' },
                    { label: 'Services', href: '/services' },
                    { label: 'Contact', href: '/contact' }
                ]}
                activeHref="/"
                className="custom-nav"
                ease="power2.easeOut"
                baseColor="#000000"
                pillColor="#ffffff"
                hoveredPillTextColor="#ffffff"
                pillTextColor="#000000"
            />
            <ClickSpark
                sparkColor='#fff'
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
