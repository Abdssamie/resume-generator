"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
    Download,
    FileText,
    Loader2,
    User,
    Briefcase,
    GraduationCap,
    Wrench,
    Eye,
    Sparkles,
    FolderKanban,
    LayoutList,
    ChevronLeft,
    ChevronRight
} from "lucide-react";
import { PersonalInfoForm } from "@/components/resume-form/personal-info-form";
import { ExperienceForm } from "@/components/resume-form/experience-form";
import { EducationForm } from "@/components/resume-form/education-form";
import { SkillsForm } from "@/components/resume-form/skills-form";
import { ProjectsForm } from "@/components/resume-form/projects-form";
import { CustomSectionsForm } from "@/components/resume-form/custom-sections-form";
import { AiPromptDialog } from "@/components/ai-prompt-dialog";
import { YamlImportDialog } from "@/components/yaml-import-dialog";
import { generatePdf, generateYaml } from "@/lib/api";
import {
    type ResumeData,
    createEmptyResume,
    AVAILABLE_THEMES,
} from "@/lib/resume-types";
import { Hero } from "@/components/hero";
import { Footer } from "@/components/footer";
import { useEffect, useRef } from "react";

const NAV_ITEMS = [
    { id: "personal", label: "Personal", icon: User },
    { id: "experience", label: "Work", icon: Briefcase },
    { id: "education", label: "Education", icon: GraduationCap },
    { id: "projects", label: "Projects", icon: FolderKanban },
    { id: "skills", label: "Skills", icon: Wrench },
    { id: "custom", label: "Custom", icon: LayoutList },
] as const;

type SectionId = typeof NAV_ITEMS[number]["id"];

export default function Home() {
    const [resume, setResume] = useState<ResumeData>(createEmptyResume());
    const [activeSection, setActiveSection] = useState<SectionId>("personal");
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<string[]>([]);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [previewBlob, setPreviewBlob] = useState<Blob | null>(null);

    const updateResume = (updates: Partial<ResumeData>) => {
        setResume((prev) => ({ ...prev, ...updates }));
    };

    const handleYamlImport = (data: Partial<ResumeData>) => {
        setResume((prev) => ({ ...prev, ...data }));
        setErrors([]);
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
            setPreviewBlob(null);
        }
    };

    const parseApiError = (errorText: string): string[] => {
        try {
            const parsed = JSON.parse(errorText);
            if (parsed.errors && Array.isArray(parsed.errors)) {
                return parsed.errors;
            }
            if (typeof parsed.detail === "string") {
                return [parsed.detail];
            }
            if (Array.isArray(parsed.detail)) {
                return parsed.detail.map((e: { msg?: string }) => e.msg || "Invalid input");
            }
            return ["An unexpected error occurred"];
        } catch {
            return [errorText || "An unexpected error occurred"];
        }
    };

    // Safeguard: Warn before leaving if data exists
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (resume.name.trim()) {
                e.preventDefault();
                e.returnValue = "";
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [resume.name]);

    const handlePreview = async () => {
        if (!resume.name.trim()) {
            setErrors(["Please enter your name before previewing"]);
            return;
        }

        // Session limit check
        const storedCount = sessionStorage.getItem("preview_count");
        const count = storedCount ? parseInt(storedCount, 10) : 0;

        if (count >= 10) {
            setErrors(["Session preview limit reached (10). Please download your data to continue."]);
            return;
        }

        sessionStorage.setItem("preview_count", (count + 1).toString());

        setErrors([]);
        setIsLoading(true);
        try {
            const blob = await generatePdf(resume);
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
            const url = URL.createObjectURL(blob);
            setPreviewUrl(url);
            setPreviewBlob(blob);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Failed to generate PDF";
            setErrors(parseApiError(errorMessage));
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownloadPdf = () => {
        if (!previewBlob) {
            handlePreview().then(() => { // Note: this might trigger limit again if we are not careful, but usually download is checking blob
                if (previewBlob) {
                    downloadPdf();
                }
            });
            return;
        }
        downloadPdf();
    };

    const downloadPdf = () => {
        if (!previewBlob || !previewUrl) return;
        const a = document.createElement("a");
        a.href = previewUrl;
        a.download = `${resume.name.replace(/\s+/g, "_")}_CV.pdf`;
        a.click();
    };

    const handleDownloadYaml = async () => {
        if (!resume.name.trim()) {
            setErrors(["Please enter your name before generating YAML"]);
            return;
        }
        setErrors([]);
        try {
            const yaml = await generateYaml(resume);
            const blob = new Blob([yaml], { type: "application/x-yaml" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${resume.name.replace(/\s+/g, "_")}_CV.yaml`;
            a.click();
            URL.revokeObjectURL(url);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Failed to generate YAML";
            setErrors(parseApiError(errorMessage));
        }
    };

    const renderSection = () => {
        switch (activeSection) {
            case "personal":
                return <PersonalInfoForm data={resume} onChange={updateResume} />;
            case "experience":
                return (
                    <ExperienceForm
                        entries={resume.experience}
                        onChange={(experience) => updateResume({ experience })}
                    />
                );
            case "education":
                return (
                    <EducationForm
                        entries={resume.education}
                        onChange={(education) => updateResume({ education })}
                    />
                );
            case "projects":
                return (
                    <ProjectsForm
                        entries={resume.projects}
                        onChange={(projects) => updateResume({ projects })}
                    />
                );
            case "skills":
                return (
                    <SkillsForm
                        entries={resume.skills}
                        onChange={(skills) => updateResume({ skills })}
                    />
                );
            case "custom":
                return (
                    <CustomSectionsForm
                        sections={resume.custom_sections}
                        onChange={(custom_sections) => updateResume({ custom_sections })}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <main className="min-h-screen bg-gradient-to-b from-background to-muted/30">
            <Hero />

            <div id="resume-builder" className="container mx-auto py-8 px-4 scroll-mt-8">
                {/* AI Prompt - Prominent at top */}
                <div className="max-w-6xl mx-auto mb-6">
                    <Card className="bg-gradient-to-r from-violet-500/10 via-purple-500/10 to-fuchsia-500/10 border-violet-500/20">
                        <CardContent className="py-4">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-violet-500/20 rounded-lg">
                                        <Sparkles className="h-6 w-6 text-violet-600 dark:text-violet-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">Generate with AI</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Get a guided prompt to create your resume with any AI assistant
                                        </p>
                                    </div>
                                </div>
                                <AiPromptDialog data={resume} />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content - Two Column Layout */}
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                    {/* Left Column - Form */}
                    <Card>
                        <CardHeader className="pb-4">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <CardTitle>Resume Builder</CardTitle>
                                    <YamlImportDialog onImport={handleYamlImport} />
                                </div>
                                <div className="flex items-center gap-2">
                                    <Label htmlFor="theme" className="whitespace-nowrap">
                                        Theme:
                                    </Label>
                                    <Select
                                        value={resume.theme}
                                        onValueChange={(value) => updateResume({ theme: value })}
                                    >
                                        <SelectTrigger id="theme" className="w-[160px]">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {AVAILABLE_THEMES.map((theme) => (
                                                <SelectItem key={theme.value} value={theme.value}>
                                                    {theme.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-4">
                                {/* Vertical Nav Sidebar */}
                                <nav className={cn(
                                    "flex flex-col gap-1 border-r pr-4 transition-all duration-300",
                                    isSidebarCollapsed ? "w-[60px]" : "w-[140px] lg:w-[160px]"
                                )}>
                                    {NAV_ITEMS.map((item) => {
                                        const Icon = item.icon;
                                        return (
                                            <button
                                                key={item.id}
                                                onClick={() => setActiveSection(item.id)}
                                                className={cn(
                                                    "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-muted whitespace-nowrap overflow-hidden",
                                                    activeSection === item.id
                                                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                                        : "text-muted-foreground hover:text-foreground",
                                                    isSidebarCollapsed && "justify-center px-0 py-3"
                                                )}
                                                title={isSidebarCollapsed ? item.label : undefined}
                                            >
                                                <Icon className="h-4 w-4 shrink-0" />
                                                <span className={cn(
                                                    "transition-all duration-200",
                                                    isSidebarCollapsed ? "w-0 opacity-0 hidden" : "w-auto opacity-100"
                                                )}>
                                                    {item.label}
                                                </span>
                                            </button>
                                        );
                                    })}

                                    <div className="border-t my-2" />

                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="w-full justify-center"
                                        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                                    >
                                        {isSidebarCollapsed ? (
                                            <ChevronRight className="h-4 w-4" />
                                        ) : (
                                            <ChevronLeft className="h-4 w-4" />
                                        )}
                                        <span className="sr-only">Toggle Sidebar</span>
                                    </Button>
                                </nav>

                                {/* Content Area */}
                                <div className="flex-1 min-h-[400px] overflow-hidden">
                                    {renderSection()}
                                </div>
                            </div>

                            {/* Error Messages */}
                            {errors.length > 0 && (
                                <div className="mt-4 p-4 bg-destructive/10 text-destructive rounded-md">
                                    <p className="font-medium mb-2">Please fix the following issues:</p>
                                    <ul className="list-disc list-inside space-y-1 text-sm">
                                        {errors.map((error, index) => (
                                            <li key={index}>{error}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Right Column - Preview */}
                    <Card className="flex flex-col sticky top-6 h-[calc(100vh-3rem)]">
                        <CardHeader className="pb-4">
                            <div className="flex items-center justify-between">
                                <CardTitle>Preview</CardTitle>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleDownloadYaml}
                                    >
                                        <FileText className="h-4 w-4 mr-2" />
                                        YAML
                                    </Button>
                                    <Button
                                        size="sm"
                                        onClick={handlePreview}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                Generating...
                                            </>
                                        ) : (
                                            <>
                                                <Eye className="h-4 w-4 mr-2" />
                                                Preview
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1 flex flex-col overflow-hidden">
                            {previewUrl ? (
                                <div className="flex-1 flex flex-col h-full">
                                    <iframe
                                        src={previewUrl}
                                        className="flex-1 w-full border rounded-lg bg-white"
                                        title="Resume Preview"
                                    />
                                    <div className="mt-4 flex justify-end">
                                        <Button onClick={handleDownloadPdf}>
                                            <Download className="h-4 w-4 mr-2" />
                                            Download PDF
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center h-full border-2 border-dashed rounded-lg bg-muted/30">
                                    <Eye className="h-12 w-12 text-muted-foreground/50 mb-4" />
                                    <p className="text-muted-foreground text-center">
                                        Click <strong>Preview</strong> to generate<br />
                                        and view your resume
                                    </p>
                                    <Button
                                        className="mt-4"
                                        onClick={handlePreview}
                                        disabled={isLoading || !resume.name.trim()}
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                Generating...
                                            </>
                                        ) : (
                                            <>
                                                <Eye className="h-4 w-4 mr-2" />
                                                Generate Preview
                                            </>
                                        )}
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Footer */}
                <Footer />
            </div>
        </main>
    );
}