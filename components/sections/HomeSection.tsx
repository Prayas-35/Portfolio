import React, { useEffect, useState } from "react";
import { gsap } from "gsap";
import PixelBlast from "@/components/PixelBlast";
import { PixelatedCanvas } from "@/components/ui/pixelated-canvas";
import { FileText } from "lucide-react";

const HomeSection: React.FC = () => {
    const headingRef = React.useRef<HTMLHeadingElement | null>(null);
    const paraRef = React.useRef<HTMLParagraphElement | null>(null);
    const resumeBtnRef = React.useRef<HTMLAnchorElement | null>(null);
    const fullSubheading = "Web3 smart contract and full stack developer";
    const [typed, setTyped] = React.useState<string>("");
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        // typewriter for subheading
        let i = 0;
        const id = window.setInterval(() => {
            if (i >= fullSubheading.length) {
                window.clearInterval(id);
                return;
            }
            i += 1;
            setTyped(fullSubheading.slice(0, i));
        }, 35);
        return () => window.clearInterval(id);
    }, []);

    useEffect(() => {
        // entrance animations
        if (headingRef.current) {
            gsap.fromTo(
                headingRef.current,
                { opacity: 0, y: 14 },
                { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", delay: 0.1 }
            );
        }
        if (paraRef.current) {
            gsap.fromTo(
                paraRef.current,
                { opacity: 0, y: 12 },
                { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", delay: 0.4 }
            );
        }
        if (resumeBtnRef.current) {
            gsap.fromTo(
                resumeBtnRef.current,
                { opacity: 0, y: 12, scale: 0.9 },
                { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power3.out", delay: 0.6 }
            );
        }
    }, []);
    return (
        <section
            id="home"
            className="relative min-h-screen w-full overflow-hidden"
            aria-label="Home"
        >
            {/* Background PixelBlast */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <PixelBlast
                    variant="circle"
                    pixelSize={6}
                    color="#B19EEF"
                    patternScale={3}
                    patternDensity={1.2}
                    pixelSizeJitter={0.5}
                    enableRipples={false}
                    rippleSpeed={0.4}
                    rippleThickness={0.12}
                    rippleIntensityScale={1.5}
                    liquid={false}
                    liquidStrength={0.12}
                    liquidRadius={1.2}
                    liquidWobbleSpeed={5}
                    speed={0.6}
                    edgeFade={0.25}
                    transparent
                    className="w-full h-full"
                />
            </div>

            {/* Foreground content */}
            <div className="relative mx-auto grid min-h-screen w-full max-w-7xl md:max-w-9/12 grid-cols-1 items-center gap-10 px-6 py-20 md:grid-cols-2">
                {/* Left: Intro copy */}
                <div className="space-y-6">
                    <h1 ref={headingRef} className="text-4xl font-semibold leading-tight md:text-6xl opacity-0">
                        Hi, I&apos;m<br /> Prayas Pal
                    </h1>
                    <h2 className="text-xl md:text-2xl font-medium font-mono text-accent-foreground">
                        {typed}
                    </h2>
                    <p ref={paraRef} className="text-base text-neutral-300 md:text-lg opacity-0">
                        A backend-focused full-stack developer with experience in AI integration and Web3 architecture.
                        I build the infrastructure for intelligent, decentralized systems.
                    </p>
                    <a
                        ref={resumeBtnRef}
                        href="https://prayas35.tiiny.site"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative inline-flex items-center gap-2 px-8 py-3.5 rounded-full 
                                    text-white font-medium text-base md:text-lg
                                    border border-white/30 
                                    backdrop-blur-2xl backdrop-saturate-150 
                                     
                                    transition-all duration-300 
                                    hover:bg-white/20 hover:border-white/50 active:scale-95 opacity-0 shadow-[0_0_25px_rgba(255,255,255,0.08)]"
                    >
                        {/* Glass shine highlight */}
                        <span className="absolute inset-0 rounded-full
                        bg-linear-to-b from-white/20 to-transparent opacity-20
                        pointer-events-none" />

                        <span className="relative flex items-center gap-2 z-2">
                            <FileText className="h-5 w-5 md:h-6 md:w-6 transition-transform duration-300 group-hover:rotate-6" />
                            View Resume
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                                />
                            </svg>
                        </span>

                        {/* Subtle glow on hover */}
                        <span className="absolute inset-0 rounded-full bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    </a>


                </div>

                {/* Right: Pixelated portrait */}
                <div className="flex w-full items-center justify-center">
                    <div className="rounded-xl shadow-lg backdrop-blur-sm px-4 md:px-0">
                        <PixelatedCanvas
                            src="profile.png"
                            width={isMobile ? 300 : 400}
                            height={isMobile ? 400 : 500}
                            cellSize={3}
                            dotScale={0.9}
                            shape="square"
                            backgroundColor="transparent"
                            dropoutStrength={0.1}
                            interactive
                            distortionStrength={3}
                            distortionRadius={80}
                            distortionMode="swirl"
                            followSpeed={0.2}
                            jitterStrength={4}
                            jitterSpeed={4}
                            sampleAverage
                            tintColor="#FFFFFF"
                            objectFit="cover"
                            tintStrength={0.2}
                            className="rounded-xl shadow-lg"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HomeSection;
