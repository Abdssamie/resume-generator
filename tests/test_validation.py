"""Tests for input validation."""

import pytest
from httpx import AsyncClient, ASGITransport
from api.main import app


class TestValidation:
    """Tests for input validation with friendly error messages."""

    @pytest.mark.asyncio
    async def test_invalid_email(self):
        """Test that invalid email returns friendly error."""
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            response = await client.post("/yaml", json={
                "name": "Test User",
                "email": "not-an-email"
            })

        assert response.status_code == 422
        data = response.json()
        assert "errors" in data
        assert any("email" in e.lower() for e in data["errors"])

    @pytest.mark.asyncio
    async def test_invalid_website(self):
        """Test that invalid website returns friendly error."""
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            response = await client.post("/yaml", json={
                "name": "Test User",
                "website": "not-a-url"
            })

        assert response.status_code == 422
        data = response.json()
        assert "errors" in data
        assert any("url" in e.lower() or "website" in e.lower() for e in data["errors"])

    @pytest.mark.asyncio
    async def test_invalid_phone(self):
        """Test that invalid phone returns friendly error."""
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            response = await client.post("/yaml", json={
                "name": "Test User",
                "phone": "123-456-7890"  # Missing + prefix
            })

        assert response.status_code == 422
        data = response.json()
        assert "errors" in data
        assert any("phone" in e.lower() for e in data["errors"])

    @pytest.mark.asyncio
    async def test_valid_phone(self):
        """Test that valid phone passes."""
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            response = await client.post("/yaml", json={
                "name": "Test User",
                "phone": "+14155551234"
            })

        assert response.status_code == 200

    @pytest.mark.asyncio
    async def test_invalid_theme(self):
        """Test that invalid theme returns friendly error."""
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            response = await client.post("/yaml", json={
                "name": "Test User",
                "theme": "invalid-theme"
            })

        assert response.status_code == 422
        data = response.json()
        assert "errors" in data
        assert any("theme" in e.lower() for e in data["errors"])

    @pytest.mark.asyncio
    async def test_invalid_social_network(self):
        """Test that invalid social network returns friendly error."""
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            response = await client.post("/yaml", json={
                "name": "Test User",
                "social_networks": [
                    {"network": "Twitter", "username": "testuser"}  # Should be 'X'
                ]
            })

        assert response.status_code == 422
        data = response.json()
        assert "errors" in data

    @pytest.mark.asyncio
    async def test_stackoverflow_username_format(self):
        """Test that StackOverflow username requires user_id/username format."""
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            response = await client.post("/yaml", json={
                "name": "Test User",
                "social_networks": [
                    {"network": "StackOverflow", "username": "just-username"}  # Missing user_id
                ]
            })

        assert response.status_code == 422
        data = response.json()
        assert "errors" in data
        assert any("stackoverflow" in e.lower() or "user_id" in e.lower() for e in data["errors"])

    @pytest.mark.asyncio
    async def test_valid_stackoverflow_username(self):
        """Test that valid StackOverflow username passes."""
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            response = await client.post("/yaml", json={
                "name": "Test User",
                "social_networks": [
                    {"network": "StackOverflow", "username": "12345678/john-doe"}
                ]
            })

        assert response.status_code == 200

    @pytest.mark.asyncio
    async def test_invalid_date_format(self):
        """Test that invalid date format returns friendly error."""
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            response = await client.post("/yaml", json={
                "name": "Test User",
                "experience": [{
                    "company": "Test Corp",
                    "position": "Developer",
                    "start_date": "January 2020"  # Wrong format
                }]
            })

        assert response.status_code == 422
        data = response.json()
        assert "errors" in data
        assert any("date" in e.lower() or "yyyy" in e.lower() for e in data["errors"])

    @pytest.mark.asyncio
    async def test_empty_name(self):
        """Test that empty name returns friendly error."""
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            response = await client.post("/yaml", json={
                "name": "   "  # Whitespace only
            })

        assert response.status_code == 422
        data = response.json()
        assert "errors" in data

    @pytest.mark.asyncio
    async def test_multiple_validation_errors(self):
        """Test that multiple errors are all returned."""
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            response = await client.post("/yaml", json={
                "name": "Test User",
                "email": "invalid",
                "website": "invalid",
                "phone": "invalid"
            })

        assert response.status_code == 422
        data = response.json()
        assert "errors" in data
        # Should have multiple errors
        assert len(data["errors"]) >= 2
