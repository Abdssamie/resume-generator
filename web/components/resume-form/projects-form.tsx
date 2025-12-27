"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X, GripVertical } from "lucide-react";
import type { ProjectEntry } from "@/lib/resume-types";
import { createProjectEntry } from "@/lib/resume-types";

interface ProjectsFormProps {
    entries: ProjectEntry[];
    onChange: (entries: ProjectEntry[]) => void;
}

export function ProjectsForm({ entries, onChange }: ProjectsFormProps) {
    const addEntry = () => {
        onChange([...entries, createProjectEntry()]);
    };

    const updateEntry = (id: string, updates: Partial<ProjectEntry>) => {
        onChange(
            entries.map((entry) =>
                entry.id === id ? { ...entry, ...updates } : entry
            )
        );
    };

    const removeEntry = (id: string) => {
        onChange(entries.filter((entry) => entry.id !== id));
    };

    const addHighlight = (id: string) => {
        const entry = entries.find((e) => e.id === id);
        if (entry) {
            updateEntry(id, { highlights: [...entry.highlights, ""] });
        }
    };

    const updateHighlight = (id: string, index: number, value: string) => {
        const entry = entries.find((e) => e.id === id);
        if (entry) {
            const highlights = [...entry.highlights];
            highlights[index] = value;
            updateEntry(id, { highlights });
        }
    };

    const removeHighlight = (id: string, index: number) => {
        const entry = entries.find((e) => e.id === id);
        if (entry) {
            updateEntry(id, {
                highlights: entry.highlights.filter((_, i) => i !== index),
            });
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Projects</h3>
                <Button type="button" onClick={addEntry}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Project
                </Button>
            </div>

            {entries.length === 0 && (
                <p className="text-muted-foreground text-center py-8">
                    No projects yet. Click &quot;Add Project&quot; to showcase your work.
                </p>
            )}

            {entries.map((entry, index) => (
                <Card key={entry.id}>
                    <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <GripVertical className="h-4 w-4 text-muted-foreground" />
                                <CardTitle className="text-base">
                                    Project {index + 1}
                                </CardTitle>
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeEntry(entry.id)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Project Name *</Label>
                            <Input
                                value={entry.name}
                                onChange={(e) =>
                                    updateEntry(entry.id, { name: e.target.value })
                                }
                                placeholder="Open Source Project Name"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label>Start Date</Label>
                                <Input
                                    value={entry.start_date || ""}
                                    onChange={(e) =>
                                        updateEntry(entry.id, { start_date: e.target.value })
                                    }
                                    placeholder="2021-06"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>End Date</Label>
                                <Input
                                    value={entry.end_date || ""}
                                    onChange={(e) =>
                                        updateEntry(entry.id, { end_date: e.target.value })
                                    }
                                    placeholder="present"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Location / URL</Label>
                                <Input
                                    value={entry.location || ""}
                                    onChange={(e) =>
                                        updateEntry(entry.id, { location: e.target.value })
                                    }
                                    placeholder="GitHub / Open Source"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Summary</Label>
                            <Input
                                value={entry.summary || ""}
                                onChange={(e) =>
                                    updateEntry(entry.id, { summary: e.target.value })
                                }
                                placeholder="Brief description of the project"
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label>Highlights / Features</Label>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => addHighlight(entry.id)}
                                >
                                    <Plus className="h-3 w-3 mr-1" />
                                    Add
                                </Button>
                            </div>
                            {entry.highlights.map((highlight, hIndex) => (
                                <div key={hIndex} className="flex items-center gap-2">
                                    <Textarea
                                        value={highlight}
                                        onChange={(e) =>
                                            updateHighlight(entry.id, hIndex, e.target.value)
                                        }
                                        placeholder="Key feature or achievement"
                                        rows={2}
                                        className="flex-1"
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeHighlight(entry.id, hIndex)}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
