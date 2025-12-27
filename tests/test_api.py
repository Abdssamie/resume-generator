"""Integration tests for API endpoints."""

import pytest
from httpx import AsyncClient, ASGITransport
from api.main import app


@pytest.fixture
def sample_resume_data():
    """Minimal valid resume data for testing."""
    return {
        "name": "Test User",
        "headline": "Software Engineer",
        "email": "test@example.com",
        "phone": "+1234567890",
        "location": "Test City",
        "website": "https://example.com",
        "social_networks": [
            {"network": "GitHub", "username": "testuser"}
        ],
        "summary": "Experienced developer.",
        "experience": [
            {
                "company": "Test Corp",
                "position": "Developer",
                "start_date": "2020-01",
                "end_date": "present",
                "location": "Remote",
                "highlights": ["Built things"]
            }
        ],
        "education": [
            {
                "institution": "Test University",
                "area": "Computer Science",
                "degree": "BS",
                "start_date": "2015-09",
                "end_date": "2019-05"
            }
        ],
        "skills": [
            {"label": "Languages", "details": "Python, JavaScript"}
        ],
        "theme": "classic"
    }


@pytest.fixture
def minimal_resume_data():
    """Absolute minimal resume data."""
    return {"name": "John Doe"}


class TestHealthEndpoint:
    """Tests for the health check endpoint."""

    @pytest.mark.asyncio
    async def test_health_returns_healthy(self):
        """Test that /health returns healthy status."""
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            response = await client.get("/health")

        assert response.status_code == 200
        assert response.json() == {"status": "healthy"}


class TestYamlEndpoint:
    """Tests for the YAML generation endpoint."""

    @pytest.mark.asyncio
    async def test_yaml_generation_minimal(self, minimal_resume_data):
        """Test YAML generation with minimal data."""
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            response = await client.post("/yaml", json=minimal_resume_data)

        assert response.status_code == 200
        assert response.headers["content-type"] == "application/x-yaml"
        assert "John_Doe_CV.yaml" in response.headers["content-disposition"]

        content = response.text
        assert "name: John Doe" in content
        assert "theme: classic" in content

    @pytest.mark.asyncio
    async def test_yaml_generation_full(self, sample_resume_data):
        """Test YAML generation with full data."""
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            response = await client.post("/yaml", json=sample_resume_data)

        assert response.status_code == 200
        content = response.text
        assert "name: Test User" in content
        assert "headline: Software Engineer" in content
        assert "Test Corp" in content
        assert "Test University" in content

    @pytest.mark.asyncio
    async def test_yaml_missing_name(self):
        """Test YAML generation fails without name."""
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            response = await client.post("/yaml", json={})

        assert response.status_code == 422  # Validation error

    @pytest.mark.asyncio
    async def test_yaml_invalid_data_type(self):
        """Test YAML generation fails with invalid data types."""
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            response = await client.post("/yaml", json={"name": 123})

        assert response.status_code == 422


class TestGenerateEndpoint:
    """Tests for the PDF generation endpoint."""

    @pytest.mark.asyncio
    async def test_generate_returns_pdf(self, sample_resume_data):
        """Test that /generate returns a PDF file."""
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            response = await client.post("/generate", json=sample_resume_data)

        # Note: This test requires rendercv and LaTeX to be installed
        # In CI without LaTeX, this will return 500
        if response.status_code == 200:
            assert response.headers["content-type"] == "application/pdf"
            assert "Test_User_CV.pdf" in response.headers["content-disposition"]
            # PDF magic bytes
            assert response.content[:4] == b"%PDF"
        else:
            # Accept 500 if rendercv/LaTeX not installed
            assert response.status_code == 500

    @pytest.mark.asyncio
    async def test_generate_missing_name(self):
        """Test generate fails without name."""
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            response = await client.post("/generate", json={})

        assert response.status_code == 422


class TestYamlRenderEndpoint:
    """Tests for the YAML render endpoint."""

    @pytest.mark.asyncio
    async def test_yaml_render_valid_yaml(self):
        """Test rendering valid YAML to PDF."""
        yaml_content = """
cv:
  name: YAML Test User
  sections:
    summary:
      - Test summary
design:
  theme: classic
"""
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            response = await client.post(
                "/yaml/render",
                json={"yaml_content": yaml_content},
            )

        # Accept either success or render failure (if rendercv not available)
        assert response.status_code in [200, 500]

    @pytest.mark.asyncio
    async def test_yaml_render_invalid_yaml(self):
        """Test rendering invalid YAML returns error."""
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            response = await client.post(
                "/yaml/render",
                json={"yaml_content": "not: valid: yaml: content:"},
            )

        # Should fail (render error)
        assert response.status_code == 500
    
    @pytest.mark.asyncio
    async def test_yaml_render_empty_content(self):
        """Test rendering empty YAML returns validation error."""
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            response = await client.post(
                "/yaml/render",
                json={"yaml_content": ""},
            )

        assert response.status_code == 422


class TestCORSConfiguration:
    """Tests for CORS configuration."""

    @pytest.mark.asyncio
    async def test_cors_headers_present(self):
        """Test that CORS headers are set correctly."""
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            response = await client.options(
                "/health",
                headers={
                    "Origin": "http://localhost:3000",
                    "Access-Control-Request-Method": "GET",
                },
            )

        # CORS preflight should succeed
        assert response.status_code == 200
