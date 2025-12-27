"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Download, FileText, AlertCircle } from "lucide-react";
import { renderYaml } from "@/lib/api";

interface YamlEditorProps {
    onRenderPdf: (yaml: string) => void;
    isLoading?: boolean;
}

export function YamlEditor({ onRenderPdf, isLoading }: YamlEditorProps) {
    const [yaml, setYaml] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [rendering, setRendering] = useState(false);

    const handleRender = async () => {
        if (!yaml.trim()) {
            setError("Please paste your YAML content first");
            return;
        }
        setError(null);
        setRendering(true);
        try {
            const blob = await renderYaml(yaml);
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "resume.pdf";
            a.click();
            URL.revokeObjectURL(url);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to render PDF");
        } finally {
            setRendering(false);
        }
    };

    const handleDownloadYaml = () => {
        if (!yaml.trim()) return;
        const blob = new Blob([yaml], { type: "application/x-yaml" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "resume.yaml";
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label>Paste RenderCV YAML</Label>
                <Textarea
                    value={yaml}
                    onChange={(e) => setYaml(e.target.value)}
                    placeholder={`cv:
  name: John Doe
  headline: Software Engineer
  email: john@example.com
  sections:
    experience:
      - company: Acme Corp
        position: Senior Engineer
        start_date: 2020-01
        end_date: present
        highlights:
          - Led team of 5 engineers
...`}
                    className="min-h-[400px] font-mono text-sm"
                />
            </div>

            {error && (
                <div className="flex items-center gap-2 text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm">{error}</span>
                </div>
            )}

            <div className="flex gap-2">
                <Button onClick={handleRender} disabled={rendering || isLoading}>
                    <Download className="h-4 w-4 mr-2" />
                    {rendering ? "Rendering..." : "Download PDF"}
                </Button>
                <Button variant="outline" onClick={handleDownloadYaml}>
                    <FileText className="h-4 w-4 mr-2" />
                    Download YAML
                </Button>
            </div>

            <div className="text-sm text-muted-foreground">
                <p>
                    <strong>Tip:</strong> Use the &quot;Get AI Prompt&quot; button to get a prompt you
                    can paste into ChatGPT or Claude to generate this YAML for you.
                </p>
            </div>
        </div>
    );
}
