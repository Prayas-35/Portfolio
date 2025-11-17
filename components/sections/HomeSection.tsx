import React, {useEffect, useState} from "react";
import { gsap } from "gsap";
import PixelBlast from "@/components/PixelBlast";
import { PixelatedCanvas } from "@/components/ui/pixelated-canvas";

const HomeSection: React.FC = () => {
    const headingRef = React.useRef<HTMLHeadingElement | null>(null);
    const paraRef = React.useRef<HTMLParagraphElement | null>(null);
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
