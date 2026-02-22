"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";

export function Hero() {
    const scrollToBuilder = () => {
        const builder = document.getElementById("resume-builder");
        builder?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <section className="w-full px-4 py-12 md:py-20 mb-8">
            <div className="max-w-[1600px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Left Column - Lottie Animation */}
                <div className="order-first flex justify-center lg:justify-end">
                    <div className="w-full max-w-[500px] h-[300px] md:h-[400px]">
                        <DotLottieReact
                            src="/Resume.lottie"
                            loop
                            autoplay
                        />
                    </div>
                </div>

                {/* Right Column - Text Content */}
                <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                        Free Resume Generator
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-[600px]">
                        Create a professional, ATS-friendly resume in minutes.
                        Powered by the robust <a href="https://github.com/sinaatalay/rendercv" className="underline hover:text-primary transition-colors">RenderCV</a> engine.
                    </p>
                    <div className="flex gap-4 pt-4">
                        <Button size="lg" onClick={scrollToBuilder} className="group">
                            Start Building
                            <ArrowDown className="ml-2 h-4 w-4 group-hover:animate-bounce" />
                        </Button>
                        <Button size="lg" variant="outline" asChild>
                            <a href="https://github.com/sinaatalay/rendercv" target="_blank" rel="noopener noreferrer">
                                GitHub
                            </a>
                        </Button>
                    </div>
                </div>
            </div>
            </div>
        </section>
    );
}
