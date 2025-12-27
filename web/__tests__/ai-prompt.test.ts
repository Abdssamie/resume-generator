import { describe, it, expect } from 'vitest'
import { generateAiPrompt } from '../lib/ai-prompt'
import type { ResumeData } from '../lib/resume-types'

describe('ai-prompt', () => {
    describe('generateAiPrompt', () => {
        it('generates a conversational prompt that asks questions', () => {
            const prompt = generateAiPrompt()

            expect(prompt).toContain('resume writing assistant')
            expect(prompt).toContain('Ask me questions')
            expect(prompt).toContain('full name')
        })

        it('includes YAML structure example', () => {
            const prompt = generateAiPrompt()

            expect(prompt).toContain('cv:')
            expect(prompt).toContain('name:')
            expect(prompt).toContain('sections:')
            expect(prompt).toContain('experience:')
            expect(prompt).toContain('education:')
            expect(prompt).toContain('skills:')
        })

        it('includes theme options', () => {
            const prompt = generateAiPrompt()

            expect(prompt).toContain('classic')
            expect(prompt).toContain('moderncv')
            expect(prompt).toContain('sb2nov')
        })

        it('includes important formatting rules', () => {
            const prompt = generateAiPrompt()

            expect(prompt).toContain('YYYY-MM')
            expect(prompt).toContain('present')
            expect(prompt).toContain('Phone')
            expect(prompt).toContain('B.S.')
            expect(prompt).toContain('M.S.')
        })

        it('ends with a call to action', () => {
            const prompt = generateAiPrompt()

            expect(prompt).toContain("Let's start")
        })
    })
})
