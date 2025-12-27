# Use official RenderCV image which has LaTeX/TinyTeX pre-installed
FROM ghcr.io/rendercv/rendercv:latest

WORKDIR /app

# Install uv for fast dependency management
RUN pip install uv

# Copy dependency files
COPY pyproject.toml uv.lock ./

# Install dependencies (including backend libs). 
# Note: RenderCV image has system LaTeX which our venv-installed rendercv will use.
RUN uv sync --frozen

# Copy application code
COPY api/ ./api/

# Expose port (internal)
EXPOSE 8000

# Run the application
CMD ["uv", "run", "uvicorn", "api.main:app", "--host", "0.0.0.0", "--port", "8000"]
