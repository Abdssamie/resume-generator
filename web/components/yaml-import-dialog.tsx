"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileUp, AlertCircle } from "lucide-react";
import { parse as parseYaml } from "yaml";
import type { ResumeData, ExperienceEntry, EducationEntry, ProjectEntry, SkillEntry, SocialNetwork, CustomSection } from "@/lib/resume-types";

interface YamlImportDialogProps {
    onImport: (data: Partial<ResumeData>) => void;
}

interface ParsedCv {
    name?: string;
    headline?: string;
    email?: string;
    phone?: string;
    location?: string;
    website?: string;
    social_networks?: Array<{ network: string; username: string }>;
    sections?: Record<string, unknown>;
}

interface ParsedYamlDocument {
    cv?: ParsedCv;
    design?: {
        theme?: string;
    };
}

// Known section names that have special handling
const KNOWN_SECTIONS = ["summary", "experience", "education", "projects", "skills"];

export function parseYamlToResumeData(yamlText: string): Partial<ResumeData> {
    const parsed = parseYaml(yamlText) as ParsedYamlDocument;
    const result: Partial<ResumeData> = {};

    if (!parsed || !parsed.cv) {
        throw new Error("Invalid YAML format: missing 'cv' section");
    }

    const cv = parsed.cv;

    // Parse personal info
    if (cv.name) result.name = cv.name;
    if (cv.headline) result.headline = cv.headline;
    if (cv.email) result.email = cv.email;
    if (cv.phone) result.phone = cv.phone;
    if (cv.location) result.location = cv.location;
    if (cv.website) result.website = cv.website;

    // Parse social networks
    if (cv.social_networks && Array.isArray(cv.social_networks)) {
        result.social_networks = cv.social_networks.map((sn) => ({
            network: sn.network || "",
            username: sn.username || "",
        }));
    }

    // Parse sections
    if (cv.sections) {
        const sections = cv.sections as Record<string, unknown>;

        // Summary
        if (sections.summary && Array.isArray(sections.summary)) {
            result.summary = (sections.summary as string[]).join("\n");
        }

        // Experience
        if (sections.experience && Array.isArray(sections.experience)) {
            result.experience = (sections.experience as Array<{
                company?: string;
                position?: string;
                start_date?: string;
                end_date?: string;
                location?: string;
                highlights?: string[];
            }>).map((exp): ExperienceEntry => ({
                id: crypto.randomUUID(),
                company: exp.company || "",
                position: exp.position || "",
                start_date: exp.start_date || "",
                end_date: exp.end_date || "present",
                location: exp.location || "",
                highlights: exp.highlights || [],
            }));
        }

        // Education
        if (sections.education && Array.isArray(sections.education)) {
            result.education = (sections.education as Array<{
                institution?: string;
                area?: string;
                degree?: string;
                start_date?: string;
                end_date?: string;
                location?: string;
                highlights?: string[];
            }>).map((edu): EducationEntry => ({
                id: crypto.randomUUID(),
                institution: edu.institution || "",
                area: edu.area || "",
                degree: edu.degree || "",
                start_date: edu.start_date || "",
                end_date: edu.end_date || "",
                location: edu.location || "",
                highlights: edu.highlights || [],
            }));
        }

        // Projects
        if (sections.projects && Array.isArray(sections.projects)) {
            result.projects = (sections.projects as Array<{
                name?: string;
                start_date?: string;
                end_date?: string;
                location?: string;
                summary?: string;
                highlights?: string[];
            }>).map((proj): ProjectEntry => ({
                id: crypto.randomUUID(),
                name: proj.name || "",
                start_date: proj.start_date || "",
                end_date: proj.end_date || "",
                location: proj.location || "",
                summary: proj.summary || "",
                highlights: proj.highlights || [],
            }));
        }

        // Skills
        if (sections.skills && Array.isArray(sections.skills)) {
            result.skills = (sections.skills as Array<{
                label?: string;
                details?: string;
            }>).map((skill): SkillEntry => ({
                id: crypto.randomUUID(),
                label: skill.label || "",
                details: skill.details || "",
            }));
        }

        // Custom sections (any section not in KNOWN_SECTIONS)
        const customSections: CustomSection[] = [];
        for (const [title, entries] of Object.entries(sections)) {
            if (!KNOWN_SECTIONS.includes(title) && Array.isArray(entries)) {
                customSections.push({
                    id: crypto.randomUUID(),
                    title,
                    entries: entries.map((e) => ({
                        id: crypto.randomUUID(),
                        content: typeof e === "string" ? e : String(e),
                    })),
                });
            }
        }
        if (customSections.length > 0) {
            result.custom_sections = customSections;
        }
    }

    // Parse theme
    if (parsed.design?.theme) {
        result.theme = parsed.design.theme;
    }

    return result;
}

export function YamlImportDialog({ onImport }: YamlImportDialogProps) {
    const [open, setOpen] = useState(false);
    const [yamlContent, setYamlContent] = useState("");
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImport = () => {
        setError(null);
        try {
            const data = parseYamlToResumeData(yamlContent);
            if (!data.name) {
                setError("Could not find 'name' field in YAML. Please check the format.");
                return;
            }
            onImport(data);
            setOpen(false);
            setYamlContent("");
        } catch (err) {
            const message = err instanceof Error ? err.message : "Failed to parse YAML";
            setError(message);
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target?.result as string;
            setYamlContent(content);
        };
        reader.readAsText(file);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Import YAML
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Import YAML Resume</DialogTitle>
                    <DialogDescription>
                        Paste your RenderCV YAML or upload a .yaml file to populate the form.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="flex gap-2">
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".yaml,.yml"
                            onChange={handleFileUpload}
                            className="hidden"
                        />
                        <Button
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <FileUp className="h-4 w-4 mr-2" />
                            Upload File
                        </Button>
                    </div>

                    <Textarea
                        placeholder="Paste your YAML content here..."
                        value={yamlContent}
                        onChange={(e) => setYamlContent(e.target.value)}
                        className="min-h-[300px] font-mono text-sm"
                    />

                    {error && (
                        <div className="flex items-center gap-2 text-destructive text-sm">
                            <AlertCircle className="h-4 w-4" />
                            {error}
                        </div>
                    )}

                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleImport} disabled={!yamlContent.trim()}>
                            Import & Populate Form
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
