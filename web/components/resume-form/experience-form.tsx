"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X, GripVertical } from "lucide-react";
import type { ExperienceEntry } from "@/lib/resume-types";
import { createExperienceEntry } from "@/lib/resume-types";

interface ExperienceFormProps {
    entries: ExperienceEntry[];
    onChange: (entries: ExperienceEntry[]) => void;
}

export function ExperienceForm({ entries, onChange }: ExperienceFormProps) {
    const addEntry = () => {
        onChange([...entries, createExperienceEntry()]);
    };

    const updateEntry = (id: string, updates: Partial<ExperienceEntry>) => {
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
                <h3 className="text-lg font-medium">Work Experience</h3>
                <Button type="button" onClick={addEntry}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Experience
                </Button>
            </div>

            {entries.length === 0 && (
                <p className="text-muted-foreground text-center py-8">
                    No experience entries yet. Click &quot;Add Experience&quot; to get started.
                </p>
            )}

            {entries.map((entry, index) => (
                <Card key={entry.id}>
                    <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <GripVertical className="h-4 w-4 text-muted-foreground" />
                                <CardTitle className="text-base">
                                    Experience {index + 1}
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Company *</Label>
                                <Input
                                    value={entry.company}
                                    onChange={(e) =>
                                        updateEntry(entry.id, { company: e.target.value })
                                    }
                                    placeholder="Acme Corp"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Position *</Label>
                                <Input
                                    value={entry.position}
                                    onChange={(e) =>
                                        updateEntry(entry.id, { position: e.target.value })
                                    }
                                    placeholder="Senior Software Engineer"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label>Start Date</Label>
                                <Input
                                    value={entry.start_date}
                                    onChange={(e) =>
                                        updateEntry(entry.id, { start_date: e.target.value })
                                    }
                                    placeholder="2020-01"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>End Date</Label>
                                <Input
                                    value={entry.end_date}
                                    onChange={(e) =>
                                        updateEntry(entry.id, { end_date: e.target.value })
                                    }
                                    placeholder="present"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Location</Label>
                                <Input
                                    value={entry.location || ""}
                                    onChange={(e) =>
                                        updateEntry(entry.id, { location: e.target.value })
                                    }
                                    placeholder="San Francisco, CA"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label>Highlights / Achievements</Label>
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
                                        placeholder="Achieved X by doing Y, resulting in Z"
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
