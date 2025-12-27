// Resume data types matching the FastAPI backend

export interface SocialNetwork {
    network: string;
    username: string;
}

export interface ExperienceEntry {
    id: string;
    company: string;
    position: string;
    start_date: string;
    end_date: string;
    location?: string;
    highlights: string[];
}

export interface EducationEntry {
    id: string;
    institution: string;
    area: string;
    degree?: string;
    start_date?: string;
    end_date?: string;
    location?: string;
    highlights: string[];
}

export interface ProjectEntry {
    id: string;
    name: string;
    start_date?: string;
    end_date?: string;
    location?: string;
    summary?: string;
    highlights: string[];
}

export interface SkillEntry {
    id: string;
    label: string;
    details: string;
}

export interface CustomSection {
    id: string;
    title: string;
    entries: CustomSectionEntry[];
}

export interface CustomSectionEntry {
    id: string;
    content: string; // Can be bullet point or text
}

export interface ResumeData {
    name: string;
    headline?: string;
    email?: string;
    phone?: string;
    location?: string;
    website?: string;
    social_networks: SocialNetwork[];
    summary?: string;
    experience: ExperienceEntry[];
    education: EducationEntry[];
    projects: ProjectEntry[];
    skills: SkillEntry[];
    custom_sections: CustomSection[];
    theme: string;
}

export const AVAILABLE_THEMES = [
    { value: "classic", label: "Classic" },
    { value: "engineeringclassic", label: "Engineering Classic" },
    { value: "engineeringresumes", label: "Engineering Resumes" },
    { value: "moderncv", label: "Modern CV" },
    { value: "sb2nov", label: "SB2Nov" },
];

export const SOCIAL_NETWORKS = [
    "LinkedIn",
    "GitHub",
    "GitLab",
    "StackOverflow",
    "X",
    "Mastodon",
    "ORCID",
    "ResearchGate",
    "Bluesky",
];

export function createEmptyResume(): ResumeData {
    return {
        name: "",
        headline: "",
        email: "",
        phone: "",
        location: "",
        website: "",
        social_networks: [],
        summary: "",
        experience: [],
        education: [],
        projects: [],
        skills: [],
        custom_sections: [],
        theme: "classic",
    };
}

export function createExperienceEntry(): ExperienceEntry {
    return {
        id: crypto.randomUUID(),
        company: "",
        position: "",
        start_date: "",
        end_date: "present",
        location: "",
        highlights: [],
    };
}

export function createEducationEntry(): EducationEntry {
    return {
        id: crypto.randomUUID(),
        institution: "",
        area: "",
        degree: "",
        start_date: "",
        end_date: "",
        location: "",
        highlights: [],
    };
}

export function createProjectEntry(): ProjectEntry {
    return {
        id: crypto.randomUUID(),
        name: "",
        start_date: "",
        end_date: "",
        location: "",
        summary: "",
        highlights: [],
    };
}

export function createSkillEntry(): SkillEntry {
    return {
        id: crypto.randomUUID(),
        label: "",
        details: "",
    };
}

export function createCustomSection(): CustomSection {
    return {
        id: crypto.randomUUID(),
        title: "",
        entries: [],
    };
}

export function createCustomSectionEntry(): CustomSectionEntry {
    return {
        id: crypto.randomUUID(),
        content: "",
    };
}
