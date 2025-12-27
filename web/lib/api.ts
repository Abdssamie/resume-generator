import type { ResumeData } from "./resume-types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const API_SECRET = process.env.NEXT_PUBLIC_API_SECRET || "default-dev-secret";

interface ApiResumeData {
    name: string;
    headline?: string;
    email?: string;
    phone?: string;
    location?: string;
    website?: string;
    social_networks: { network: string; username: string }[];
    summary?: string;
    experience: {
        company: string;
        position: string;
        start_date: string;
        end_date: string;
        location?: string;
        highlights: string[];
    }[];
    education: {
        institution: string;
        area: string;
        degree?: string;
        start_date?: string;
        end_date?: string;
        location?: string;
        highlights: string[];
    }[];
    projects: {
        name: string;
        start_date?: string;
        end_date?: string;
        location?: string;
        summary?: string;
        highlights: string[];
    }[];
    skills: { label: string; details: string }[];
    custom_sections: {
        title: string;
        entries: string[];
    }[];
    theme: string;
}

function toApiFormat(data: ResumeData): ApiResumeData {
    return {
        name: data.name,
        headline: data.headline || undefined,
        email: data.email || undefined,
        phone: data.phone || undefined,
        location: data.location || undefined,
        website: data.website || undefined,
        social_networks: data.social_networks,
        summary: data.summary || undefined,
        experience: data.experience.map((exp) => ({
            company: exp.company,
            position: exp.position,
            start_date: exp.start_date,
            end_date: exp.end_date,
            location: exp.location || undefined,
            highlights: exp.highlights.filter(Boolean),
        })),
        education: data.education.map((edu) => ({
            institution: edu.institution,
            area: edu.area,
            degree: edu.degree || undefined,
            start_date: edu.start_date || undefined,
            end_date: edu.end_date || undefined,
            location: edu.location || undefined,
            highlights: edu.highlights.filter(Boolean),
        })),
        projects: data.projects.map((proj) => ({
            name: proj.name,
            start_date: proj.start_date || undefined,
            end_date: proj.end_date || undefined,
            location: proj.location || undefined,
            summary: proj.summary || undefined,
            highlights: proj.highlights.filter(Boolean),
        })),
        skills: data.skills.map((skill) => ({
            label: skill.label,
            details: skill.details,
        })),
        custom_sections: data.custom_sections.map((section) => ({
            title: section.title,
            entries: section.entries.map((e) => e.content).filter(Boolean),
        })),
        theme: data.theme,
    };
}

export async function generatePdf(data: ResumeData): Promise<Blob> {
    const response = await fetch(`${API_URL}/generate`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-API-Key": API_SECRET
        },
        body: JSON.stringify(toApiFormat(data)),
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to generate PDF: ${error}`);
    }

    return response.blob();
}

export async function generateYaml(data: ResumeData): Promise<string> {
    const response = await fetch(`${API_URL}/yaml`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-API-Key": API_SECRET
        },
        body: JSON.stringify(toApiFormat(data)),
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to generate YAML: ${error}`);
    }

    return response.text();
}

export async function renderYaml(yamlContent: string): Promise<Blob> {
    const response = await fetch(`${API_URL}/yaml/render`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-API-Key": API_SECRET
        },
        body: JSON.stringify({ yaml_content: yamlContent }),
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to render YAML: ${error}`);
    }

    return response.blob();
}
