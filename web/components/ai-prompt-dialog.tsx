"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Copy, Check, Sparkles } from "lucide-react";
import { generateAiPrompt } from "@/lib/ai-prompt";
import type { ResumeData } from "@/lib/resume-types";

interface AiPromptDialogProps {
    data: ResumeData;
}

export function AiPromptDialog({ data }: AiPromptDialogProps) {
    const [copied, setCopied] = useState(false);
    const prompt = generateAiPrompt(data);

    const copyToClipboard = async () => {
        await navigator.clipboard.writeText(prompt);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Get AI Prompt
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
                <DialogHeader>
                    <DialogTitle>AI Resume Generator Prompt</DialogTitle>
                    <DialogDescription>
                        Copy this prompt and paste it into ChatGPT, Claude, or any other AI
                        to generate your resume YAML. Then paste the YAML in the YAML tab.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex-1 overflow-auto">
                    <Textarea
                        value={prompt}
                        readOnly
                        className="min-h-[400px] font-mono text-sm"
                    />
                </div>
                <div className="flex justify-end pt-4">
                    <Button onClick={copyToClipboard}>
                        {copied ? (
                            <>
                                <Check className="h-4 w-4 mr-2" />
                                Copied!
                            </>
                        ) : (
                            <>
                                <Copy className="h-4 w-4 mr-2" />
                                Copy Prompt
                            </>
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
