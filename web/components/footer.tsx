"use client";

export function Footer() {
    return (
        <footer className="border-t bg-muted/20 py-8 mt-12">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center bg-gray-50/50 p-6 rounded-lg">
                    <div className="text-center md:text-left mb-4 md:mb-0">
                        <p className="text-sm text-muted-foreground">
                            &copy; {new Date().getFullYear()} Free Resume Generator. Open Source.
                        </p>
                    </div>

                    <div className="flex items-center gap-6">
                        <a
                            href="https://github.com/sinaatalay/rendercv"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Powered by RenderCV
                        </a>
                        <a
                            href="#"
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Privacy Policy
                        </a>
                        <a
                            href="#"
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Terms of Service
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
