import { describe, it, expect } from 'vitest';
import { parseYamlToResumeData } from '../components/yaml-import-dialog';

describe('parseYamlToResumeData', () => {
    const sampleYaml = `
cv:
  name: "John Doe"
  headline: "Software Engineer"
  email: "john@example.com"
  phone: "+14155551234"
  location: "San Francisco, CA"
  website: "https://johndoe.dev"
  social_networks:
    - network: LinkedIn
      username: johndoe
    - network: GitHub
      username: johndoe-dev

  sections:
    summary:
      - "Experienced software engineer with 5+ years of experience."

    experience:
      - company: "TechCorp"
        position: "Senior Developer"
        start_date: "2020-01"
        end_date: "present"
        location: "Remote"
        highlights:
          - "Built scalable microservices"
          - "Led team of 5 engineers"

      - company: "StartupXYZ"
        position: "Developer"
        start_date: "2018-06"
        end_date: "2019-12"
        location: "New York, NY"
        highlights:
          - "Developed REST APIs"

    education:
      - institution: "MIT"
        area: "Computer Science"
        degree: "B.S."
        start_date: "2014-09"
        end_date: "2018-05"
        location: "Cambridge, MA"

    skills:
      - label: "Languages"
        details: "Python, JavaScript, TypeScript"
      - label: "Frameworks"
        details: "React, Node.js, FastAPI"

design:
  theme: engineeringresumes
`;

    it('parses personal information correctly', () => {
        const result = parseYamlToResumeData(sampleYaml);

        expect(result.name).toBe('John Doe');
        expect(result.headline).toBe('Software Engineer');
        expect(result.email).toBe('john@example.com');
        expect(result.phone).toBe('+14155551234');
        expect(result.location).toBe('San Francisco, CA');
        expect(result.website).toBe('https://johndoe.dev');
    });

    it('parses social networks correctly', () => {
        const result = parseYamlToResumeData(sampleYaml);

        expect(result.social_networks).toHaveLength(2);
        expect(result.social_networks?.[0].network).toBe('LinkedIn');
        expect(result.social_networks?.[0].username).toBe('johndoe');
        expect(result.social_networks?.[1].network).toBe('GitHub');
        expect(result.social_networks?.[1].username).toBe('johndoe-dev');
    });

    it('parses summary correctly', () => {
        const result = parseYamlToResumeData(sampleYaml);

        expect(result.summary).toBe('Experienced software engineer with 5+ years of experience.');
    });

    it('parses experience entries correctly', () => {
        const result = parseYamlToResumeData(sampleYaml);

        expect(result.experience).toHaveLength(2);

        const exp1 = result.experience?.[0];
        expect(exp1?.company).toBe('TechCorp');
        expect(exp1?.position).toBe('Senior Developer');
        expect(exp1?.start_date).toBe('2020-01');
        expect(exp1?.end_date).toBe('present');
        expect(exp1?.location).toBe('Remote');
        expect(exp1?.highlights).toHaveLength(2);
        expect(exp1?.highlights[0]).toBe('Built scalable microservices');
        expect(exp1?.id).toBeDefined(); // Should have generated ID

        const exp2 = result.experience?.[1];
        expect(exp2?.company).toBe('StartupXYZ');
        expect(exp2?.position).toBe('Developer');
    });

    it('parses education entries correctly', () => {
        const result = parseYamlToResumeData(sampleYaml);

        expect(result.education).toHaveLength(1);

        const edu = result.education?.[0];
        expect(edu?.institution).toBe('MIT');
        expect(edu?.area).toBe('Computer Science');
        expect(edu?.degree).toBe('B.S.');
        expect(edu?.start_date).toBe('2014-09');
        expect(edu?.end_date).toBe('2018-05');
        expect(edu?.location).toBe('Cambridge, MA');
        expect(edu?.id).toBeDefined();
    });

    it('parses skills correctly', () => {
        const result = parseYamlToResumeData(sampleYaml);

        expect(result.skills).toHaveLength(2);

        expect(result.skills?.[0].label).toBe('Languages');
        expect(result.skills?.[0].details).toBe('Python, JavaScript, TypeScript');
        expect(result.skills?.[0].id).toBeDefined();

        expect(result.skills?.[1].label).toBe('Frameworks');
        expect(result.skills?.[1].details).toBe('React, Node.js, FastAPI');
    });

    it('parses theme correctly', () => {
        const result = parseYamlToResumeData(sampleYaml);

        expect(result.theme).toBe('engineeringresumes');
    });

    it('throws error for invalid YAML structure', () => {
        const invalidYaml = `
name: "John Doe"
`;
        expect(() => parseYamlToResumeData(invalidYaml)).toThrow("missing 'cv' section");
    });

    it('handles minimal YAML with only name', () => {
        const minimalYaml = `
cv:
  name: "Jane Doe"
`;
        const result = parseYamlToResumeData(minimalYaml);

        expect(result.name).toBe('Jane Doe');
        expect(result.experience).toBeUndefined();
        expect(result.education).toBeUndefined();
        expect(result.skills).toBeUndefined();
    });

    it('handles experience without optional fields', () => {
        const yaml = `
cv:
  name: "Test User"
  sections:
    experience:
      - company: "TestCo"
        position: "Dev"
        start_date: "2020-01"
`;
        const result = parseYamlToResumeData(yaml);

        expect(result.experience).toHaveLength(1);
        expect(result.experience?.[0].company).toBe('TestCo');
        expect(result.experience?.[0].end_date).toBe('present');
        expect(result.experience?.[0].highlights).toEqual([]);
    });

    it('handles multiple summary paragraphs', () => {
        const yaml = `
cv:
  name: "Test User"
  sections:
    summary:
      - "First paragraph."
      - "Second paragraph."
`;
        const result = parseYamlToResumeData(yaml);

        expect(result.summary).toBe("First paragraph.\nSecond paragraph.");
    });

    it('parses custom sections with string and object entries', () => {
        const yaml = `
cv:
  name: "Custom User"
  sections:
    certifications:
      - "AWS Certified"
      - name: "Azure Certified"
        year: 2023
    languages:
      - language: "English"
        level: "Native"
`;
        const result = parseYamlToResumeData(yaml);

        expect(result.custom_sections).toHaveLength(2);

        // Find Certifications
        const certs = result.custom_sections?.find(s => s.title === 'certifications');
        expect(certs).toBeDefined();
        expect(certs?.entries).toHaveLength(2);
        expect(certs?.entries[0].content).toBe("AWS Certified");
        // Verify object entry is stringified
        const objEntry = JSON.parse(certs!.entries[1].content);
        expect(objEntry.name).toBe("Azure Certified");
        expect(objEntry.year).toBe(2023);

        // Find Languages
        const langs = result.custom_sections?.find(s => s.title === 'languages');
        expect(langs).toBeDefined();
        expect(langs?.entries[0].content).toContain('"language":"English"');
    });
});
