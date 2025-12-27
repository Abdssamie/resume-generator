"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Plus, X } from "lucide-react";
import type { ResumeData, SocialNetwork } from "@/lib/resume-types";
import { SOCIAL_NETWORKS } from "@/lib/resume-types";

interface PersonalInfoFormProps {
    data: ResumeData;
    onChange: (data: Partial<ResumeData>) => void;
}

export function PersonalInfoForm({ data, onChange }: PersonalInfoFormProps) {
    const addSocialNetwork = () => {
        onChange({
            social_networks: [
                ...data.social_networks,
                { network: "LinkedIn", username: "" },
            ],
        });
    };

    const updateSocialNetwork = (
        index: number,
        updates: Partial<SocialNetwork>
    ) => {
        const updated = [...data.social_networks];
        updated[index] = { ...updated[index], ...updates };
        onChange({ social_networks: updated });
    };

    const removeSocialNetwork = (index: number) => {
        onChange({
            social_networks: data.social_networks.filter((_, i) => i !== index),
        });
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                        id="name"
                        value={data.name}
                        onChange={(e) => onChange({ name: e.target.value })}
                        placeholder="John Doe"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="headline">Headline / Title</Label>
                    <Input
                        id="headline"
                        value={data.headline || ""}
                        onChange={(e) => onChange({ headline: e.target.value })}
                        placeholder="Senior Software Engineer"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        value={data.email || ""}
                        onChange={(e) => onChange({ email: e.target.value })}
                        placeholder="john@example.com"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                        id="phone"
                        value={data.phone || ""}
                        onChange={(e) => onChange({ phone: e.target.value })}
                        placeholder="+1 555 123 4567"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                        id="location"
                        value={data.location || ""}
                        onChange={(e) => onChange({ location: e.target.value })}
                        placeholder="San Francisco, CA"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                        id="website"
                        value={data.website || ""}
                        onChange={(e) => onChange({ website: e.target.value })}
                        placeholder="https://johndoe.dev"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="summary">Professional Summary</Label>
                <Textarea
                    id="summary"
                    value={data.summary || ""}
                    onChange={(e) => onChange({ summary: e.target.value })}
                    placeholder="Experienced software engineer with 10+ years in distributed systems..."
                    rows={4}
                />
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <Label>Social Networks</Label>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addSocialNetwork}
                    >
                        <Plus className="h-4 w-4 mr-1" />
                        Add
                    </Button>
                </div>
                {data.social_networks.map((sn, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <Select
                            value={sn.network}
                            onValueChange={(value) =>
                                updateSocialNetwork(index, { network: value })
                            }
                        >
                            <SelectTrigger className="w-[140px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {SOCIAL_NETWORKS.map((network) => (
                                    <SelectItem key={network} value={network}>
                                        {network}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Input
                            value={sn.username}
                            onChange={(e) =>
                                updateSocialNetwork(index, { username: e.target.value })
                            }
                            placeholder="username"
                            className="flex-1"
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeSocialNetwork(index)}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
}
