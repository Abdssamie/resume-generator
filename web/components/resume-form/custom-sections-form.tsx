"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X, GripVertical } from "lucide-react";
import type { CustomSection, CustomSectionEntry } from "@/lib/resume-types";
import { createCustomSection, createCustomSectionEntry } from "@/lib/resume-types";

interface CustomSectionsFormProps {
    sections: CustomSection[];
    onChange: (sections: CustomSection[]) => void;
}

export function CustomSectionsForm({ sections, onChange }: CustomSectionsFormProps) {
    const addSection = () => {
        onChange([...sections, createCustomSection()]);
    };

    const updateSection = (id: string, updates: Partial<CustomSection>) => {
        onChange(
            sections.map((section) =>
                section.id === id ? { ...section, ...updates } : section
            )
        );
    };

    const removeSection = (id: string) => {
        onChange(sections.filter((section) => section.id !== id));
    };

    const addEntry = (sectionId: string) => {
        const section = sections.find((s) => s.id === sectionId);
        if (section) {
            updateSection(sectionId, {
                entries: [...section.entries, createCustomSectionEntry()]
            });
        }
    };

    const updateEntry = (sectionId: string, entryId: string, content: string) => {
        const section = sections.find((s) => s.id === sectionId);
        if (section) {
            updateSection(sectionId, {
                entries: section.entries.map((e) =>
                    e.id === entryId ? { ...e, content } : e
                ),
            });
        }
    };

    const removeEntry = (sectionId: string, entryId: string) => {
        const section = sections.find((s) => s.id === sectionId);
        if (section) {
            updateSection(sectionId, {
                entries: section.entries.filter((e) => e.id !== entryId),
            });
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-medium">Custom Sections</h3>
                    <p className="text-sm text-muted-foreground">
                        Add sections like Certifications, Publications, Awards, etc.
                    </p>
                </div>
                <Button type="button" onClick={addSection}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Section
                </Button>
            </div>

            {sections.length === 0 && (
                <p className="text-muted-foreground text-center py-8">
                    No custom sections yet. Add sections for certifications, publications, awards, languages, etc.
                </p>
            )}

            {sections.map((section, index) => (
                <Card key={section.id}>
                    <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <GripVertical className="h-4 w-4 text-muted-foreground" />
                                <CardTitle className="text-base">
                                    Custom Section {index + 1}
                                </CardTitle>
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeSection(section.id)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Section Title *</Label>
                            <Input
                                value={section.title}
                                onChange={(e) =>
                                    updateSection(section.id, { title: e.target.value })
                                }
                                placeholder="Certifications, Publications, Awards, Languages..."
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label>Entries</Label>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => addEntry(section.id)}
                                >
                                    <Plus className="h-3 w-3 mr-1" />
                                    Add Entry
                                </Button>
                            </div>
                            {section.entries.length === 0 && (
                                <p className="text-sm text-muted-foreground py-2">
                                    No entries yet. Each entry will be a bullet point.
                                </p>
                            )}
                            {section.entries.map((entry) => (
                                <div key={entry.id} className="flex items-center gap-2">
                                    <Textarea
                                        value={entry.content}
                                        onChange={(e) =>
                                            updateEntry(section.id, entry.id, e.target.value)
                                        }
                                        placeholder="AWS Certified Solutions Architect, 2023"
                                        rows={2}
                                        className="flex-1"
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeEntry(section.id, entry.id)}
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
