import { describe, it, expect } from 'vitest'
import {
    createEmptyResume,
    createExperienceEntry,
    createEducationEntry,
    createSkillEntry,
    AVAILABLE_THEMES,
    SOCIAL_NETWORKS,
} from '../lib/resume-types'

describe('resume-types', () => {
    describe('createEmptyResume', () => {
        it('creates a resume with empty fields', () => {
            const resume = createEmptyResume()

            expect(resume.name).toBe('')
            expect(resume.headline).toBe('')
            expect(resume.email).toBe('')
            expect(resume.phone).toBe('')
            expect(resume.location).toBe('')
            expect(resume.website).toBe('')
            expect(resume.summary).toBe('')
            expect(resume.theme).toBe('classic')
        })

        it('creates a resume with empty arrays', () => {
            const resume = createEmptyResume()

            expect(resume.social_networks).toEqual([])
            expect(resume.experience).toEqual([])
            expect(resume.education).toEqual([])
            expect(resume.projects).toEqual([])
            expect(resume.skills).toEqual([])
            expect(resume.custom_sections).toEqual([])
        })
    })

    describe('createExperienceEntry', () => {
        it('creates an experience entry with default values', () => {
            const entry = createExperienceEntry()

            expect(entry.id).toBeDefined()
            expect(entry.company).toBe('')
            expect(entry.position).toBe('')
            expect(entry.start_date).toBe('')
            expect(entry.end_date).toBe('present')
            expect(entry.location).toBe('')
            expect(entry.highlights).toEqual([])
        })

        it('creates unique IDs for each entry', () => {
            const entry1 = createExperienceEntry()
            const entry2 = createExperienceEntry()

            expect(entry1.id).not.toBe(entry2.id)
        })
    })

    describe('createEducationEntry', () => {
        it('creates an education entry with default values', () => {
            const entry = createEducationEntry()

            expect(entry.id).toBeDefined()
            expect(entry.institution).toBe('')
            expect(entry.area).toBe('')
            expect(entry.degree).toBe('')
            expect(entry.start_date).toBe('')
            expect(entry.end_date).toBe('')
            expect(entry.location).toBe('')
            expect(entry.highlights).toEqual([])
        })
    })

    describe('createSkillEntry', () => {
        it('creates a skill entry with default values', () => {
            const entry = createSkillEntry()

            expect(entry.id).toBeDefined()
            expect(entry.label).toBe('')
            expect(entry.details).toBe('')
        })
    })

    describe('AVAILABLE_THEMES', () => {
        it('contains expected themes', () => {
            const themeValues = AVAILABLE_THEMES.map((t) => t.value)

            expect(themeValues).toContain('classic')
            expect(themeValues).toContain('moderncv')
            expect(themeValues).toContain('sb2nov')
            expect(themeValues).toContain('engineeringclassic')
            expect(themeValues).toContain('engineeringresumes')
        })

        it('has labels for all themes', () => {
            AVAILABLE_THEMES.forEach((theme) => {
                expect(theme.label).toBeDefined()
                expect(theme.label.length).toBeGreaterThan(0)
            })
        })
    })

    describe('SOCIAL_NETWORKS', () => {
        it('contains common social networks', () => {
            expect(SOCIAL_NETWORKS).toContain('LinkedIn')
            expect(SOCIAL_NETWORKS).toContain('GitHub')
            expect(SOCIAL_NETWORKS).toContain('X')
        })
    })
})
