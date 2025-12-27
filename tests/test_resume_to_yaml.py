"""Unit tests for resume_to_yaml helper function."""

import pytest
from api.main import resume_to_yaml, ResumeData, ExperienceEntry, EducationEntry, SkillEntry, SocialNetwork


class TestResumeToYaml:
    """Tests for the resume_to_yaml conversion function."""

    def test_minimal_resume(self):
        """Test conversion with only required fields."""
        data = ResumeData(name="John Doe")
        result = resume_to_yaml(data)

        assert result["cv"]["name"] == "John Doe"
        assert result["design"]["theme"] == "classic"
        assert "sections" not in result["cv"]

    def test_full_personal_info(self):
        """Test conversion with all personal info fields."""
        data = ResumeData(
            name="Jane Smith",
            headline="Senior Software Engineer",
            email="jane@example.com",
            phone="+1234567890",
            location="San Francisco, CA",
            website="https://janesmith.dev",
        )
        result = resume_to_yaml(data)

        assert result["cv"]["name"] == "Jane Smith"
        assert result["cv"]["headline"] == "Senior Software Engineer"
        assert result["cv"]["email"] == "jane@example.com"
        assert result["cv"]["phone"] == "+1234567890"
        assert result["cv"]["location"] == "San Francisco, CA"
        assert result["cv"]["website"] == "https://janesmith.dev/"

    def test_social_networks(self):
        """Test conversion with social networks."""
        data = ResumeData(
            name="John Doe",
            social_networks=[
                SocialNetwork(network="LinkedIn", username="johndoe"),
                SocialNetwork(network="GitHub", username="jdoe"),
            ],
        )
        result = resume_to_yaml(data)

        assert len(result["cv"]["social_networks"]) == 2
        assert result["cv"]["social_networks"][0] == {"network": "LinkedIn", "username": "johndoe"}
        assert result["cv"]["social_networks"][1] == {"network": "GitHub", "username": "jdoe"}

    def test_summary_section(self):
        """Test conversion with summary."""
        data = ResumeData(
            name="John Doe",
            summary="Experienced engineer with 10 years in software development.",
        )
        result = resume_to_yaml(data)

        assert "sections" in result["cv"]
        assert "summary" in result["cv"]["sections"]
        assert result["cv"]["sections"]["summary"] == [
            "Experienced engineer with 10 years in software development."
        ]

    def test_experience_section(self):
        """Test conversion with experience entries."""
        data = ResumeData(
            name="John Doe",
            experience=[
                ExperienceEntry(
                    company="Acme Corp",
                    position="Senior Engineer",
                    start_date="2020-01",
                    end_date="present",
                    location="NYC",
                    highlights=["Led team of 5", "Increased revenue by 20%"],
                ),
            ],
        )
        result = resume_to_yaml(data)

        assert "experience" in result["cv"]["sections"]
        exp = result["cv"]["sections"]["experience"][0]
        assert exp["company"] == "Acme Corp"
        assert exp["position"] == "Senior Engineer"
        assert exp["start_date"] == "2020-01"
        assert exp["end_date"] == "present"
        assert exp["location"] == "NYC"
        assert exp["highlights"] == ["Led team of 5", "Increased revenue by 20%"]

    def test_experience_without_optional_fields(self):
        """Test experience entry without location or highlights."""
        data = ResumeData(
            name="John Doe",
            experience=[
                ExperienceEntry(
                    company="Startup Inc",
                    position="Developer",
                    start_date="2019-06",
                    end_date="2020-01",
                ),
            ],
        )
        result = resume_to_yaml(data)

        exp = result["cv"]["sections"]["experience"][0]
        assert "location" not in exp
        assert "highlights" not in exp

    def test_education_section(self):
        """Test conversion with education entries."""
        data = ResumeData(
            name="John Doe",
            education=[
                EducationEntry(
                    institution="MIT",
                    area="Computer Science",
                    degree="BS",
                    start_date="2015-09",
                    end_date="2019-05",
                    location="Cambridge, MA",
                    highlights=["GPA: 3.9/4.0"],
                ),
            ],
        )
        result = resume_to_yaml(data)

        assert "education" in result["cv"]["sections"]
        edu = result["cv"]["sections"]["education"][0]
        assert edu["institution"] == "MIT"
        assert edu["area"] == "Computer Science"
        assert edu["degree"] == "BS"
        assert edu["start_date"] == "2015-09"
        assert edu["end_date"] == "2019-05"
        assert edu["location"] == "Cambridge, MA"
        assert edu["highlights"] == ["GPA: 3.9/4.0"]

    def test_skills_section(self):
        """Test conversion with skills entries."""
        data = ResumeData(
            name="John Doe",
            skills=[
                SkillEntry(label="Languages", details="Python, Go, Rust"),
                SkillEntry(label="Tools", details="Docker, Kubernetes"),
            ],
        )
        result = resume_to_yaml(data)

        assert "skills" in result["cv"]["sections"]
        skills = result["cv"]["sections"]["skills"]
        assert len(skills) == 2
        assert skills[0] == {"label": "Languages", "details": "Python, Go, Rust"}
        assert skills[1] == {"label": "Tools", "details": "Docker, Kubernetes"}

    def test_theme_selection(self):
        """Test that theme is correctly set."""
        for theme in ["classic", "moderncv", "sb2nov", "engineeringclassic"]:
            data = ResumeData(name="John Doe", theme=theme)
            result = resume_to_yaml(data)
            assert result["design"]["theme"] == theme

    def test_full_resume(self):
        """Test conversion with all sections populated."""
        data = ResumeData(
            name="Jane Doe",
            headline="Full Stack Developer",
            email="jane@example.com",
            phone="+1555555555",
            location="Austin, TX",
            website="https://janedoe.io",
            social_networks=[
                SocialNetwork(network="GitHub", username="janedoe"),
            ],
            summary="Full stack developer with 5 years of experience.",
            experience=[
                ExperienceEntry(
                    company="Tech Co",
                    position="Developer",
                    start_date="2019-01",
                    end_date="present",
                    highlights=["Built microservices"],
                ),
            ],
            education=[
                EducationEntry(
                    institution="Stanford",
                    area="Engineering",
                    degree="MS",
                ),
            ],
            skills=[
                SkillEntry(label="Backend", details="Python, Node.js"),
            ],
            theme="moderncv",
        )
        result = resume_to_yaml(data)

        # Verify structure
        assert "cv" in result
        assert "design" in result
        assert result["cv"]["name"] == "Jane Doe"
        assert "sections" in result["cv"]
        assert "summary" in result["cv"]["sections"]
        assert "experience" in result["cv"]["sections"]
        assert "education" in result["cv"]["sections"]
        assert "skills" in result["cv"]["sections"]
        assert result["design"]["theme"] == "moderncv"
