"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X, GripVertical } from "lucide-react";
import type { EducationEntry } from "@/lib/resume-types";
import { createEducationEntry } from "@/lib/resume-types";

interface EducationFormProps {
    entries: EducationEntry[];
    onChange: (entries: EducationEntry[]) => void;
}

export function EducationForm({ entries, onChange }: EducationFormProps) {
    const addEntry = () => {
        onChange([...entries, createEducationEntry()]);
    };

    const updateEntry = (id: string, updates: Partial<EducationEntry>) => {
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
                <h3 className="text-lg font-medium">Education</h3>
                <Button type="button" onClick={addEntry}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Education
                </Button>
            </div>

            {entries.length === 0 && (
                <p className="text-muted-foreground text-center py-8">
                    No education entries yet. Click &quot;Add Education&quot; to get started.
                </p>
            )}

            {entries.map((entry, index) => (
                <Card key={entry.id}>
                    <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <GripVertical className="h-4 w-4 text-muted-foreground" />
                                <CardTitle className="text-base">
                                    Education {index + 1}
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
                                <Label>Institution *</Label>
                                <Input
                                    value={entry.institution}
                                    onChange={(e) =>
                                        updateEntry(entry.id, { institution: e.target.value })
                                    }
                                    placeholder="MIT"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Field of Study *</Label>
                                <Input
                                    value={entry.area}
                                    onChange={(e) =>
                                        updateEntry(entry.id, { area: e.target.value })
                                    }
                                    placeholder="Computer Science"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="space-y-2">
                                <Label>Degree</Label>
                                <Input
                                    value={entry.degree || ""}
                                    onChange={(e) =>
                                        updateEntry(entry.id, { degree: e.target.value })
                                    }
                                    placeholder="BS, MS, PhD"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Start Date</Label>
                                <Input
                                    value={entry.start_date || ""}
                                    onChange={(e) =>
                                        updateEntry(entry.id, { start_date: e.target.value })
                                    }
                                    placeholder="2015-09"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>End Date</Label>
                                <Input
                                    value={entry.end_date || ""}
                                    onChange={(e) =>
                                        updateEntry(entry.id, { end_date: e.target.value })
                                    }
                                    placeholder="2019-05"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Location</Label>
                                <Input
                                    value={entry.location || ""}
                                    onChange={(e) =>
                                        updateEntry(entry.id, { location: e.target.value })
                                    }
                                    placeholder="Cambridge, MA"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label>Highlights (GPA, Awards, etc.)</Label>
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
                                        placeholder="GPA: 3.9/4.0, Dean's List"
                                        rows={1}
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
