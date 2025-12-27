"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X, GripVertical } from "lucide-react";
import type { SkillEntry } from "@/lib/resume-types";
import { createSkillEntry } from "@/lib/resume-types";

interface SkillsFormProps {
    entries: SkillEntry[];
    onChange: (entries: SkillEntry[]) => void;
}

export function SkillsForm({ entries, onChange }: SkillsFormProps) {
    const addEntry = () => {
        onChange([...entries, createSkillEntry()]);
    };

    const updateEntry = (id: string, updates: Partial<SkillEntry>) => {
        onChange(
            entries.map((entry) =>
                entry.id === id ? { ...entry, ...updates } : entry
            )
        );
    };

    const removeEntry = (id: string) => {
        onChange(entries.filter((entry) => entry.id !== id));
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Skills</h3>
                <Button type="button" onClick={addEntry}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Skill Category
                </Button>
            </div>

            {entries.length === 0 && (
                <p className="text-muted-foreground text-center py-8">
                    No skills yet. Click &quot;Add Skill Category&quot; to get started.
                </p>
            )}

            {entries.map((entry, index) => (
                <Card key={entry.id}>
                    <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <GripVertical className="h-4 w-4 text-muted-foreground" />
                                <CardTitle className="text-base">Skill {index + 1}</CardTitle>
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
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label>Category *</Label>
                                <Input
                                    value={entry.label}
                                    onChange={(e) =>
                                        updateEntry(entry.id, { label: e.target.value })
                                    }
                                    placeholder="Programming Languages"
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label>Skills *</Label>
                                <Input
                                    value={entry.details}
                                    onChange={(e) =>
                                        updateEntry(entry.id, { details: e.target.value })
                                    }
                                    placeholder="Python, TypeScript, Go, Rust"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
