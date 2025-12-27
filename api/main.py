from fastapi import FastAPI, HTTPException, Request, Depends, Security
from fastapi.security.api_key import APIKeyHeader
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, Response, JSONResponse
from fastapi.exceptions import RequestValidationError
from pydantic import BaseModel, EmailStr, HttpUrl, field_validator
import tempfile
import os
import yaml
import subprocess
from pathlib import Path
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware


import logging

from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# Parse ALLOWED_ORIGINS
ALLOWED_ORIGINS_ENV = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000")
allowed_origins = [origin.strip() for origin in ALLOWED_ORIGINS_ENV.split(",")]
logger.info(f"DEBUG: Parsed Allowed Origins: {allowed_origins}")

# Parse ALLOWED_HOSTS
ALLOWED_HOSTS_ENV = os.getenv("ALLOWED_HOSTS", "localhost,127.0.0.1,0.0.0.0")
allowed_hosts = [host.strip() for host in ALLOWED_HOSTS_ENV.split(",")]
logger.info(f"DEBUG: Parsed Allowed Hosts: {allowed_hosts}")

# API Security
API_SECRET = os.getenv("API_SECRET", "default-dev-secret")
api_key_header = APIKeyHeader(name="X-API-Key", auto_error=False)

async def verify_api_key(api_key: str = Security(api_key_header)):
    if API_SECRET == "default-dev-secret":
        logger.warning("Using default API secret! Please set API_SECRET env var.")
    
    if api_key != API_SECRET:
        raise HTTPException(
            status_code=403,
            detail="Could not validate credentials"
        )
    return api_key

# Initialize app
limiter = Limiter(key_func=get_remote_address)
app = FastAPI(title="Resume Generator API", version="1.0.0")
app.state.limiter = limiter

# Security Middlewares

# 1. Trusted Host Middleware (prevent Host Header attacks)
# Allow localhost and the Vercel domain (and its subdomains)
app.add_middleware(
    TrustedHostMiddleware, 
    allowed_hosts=allowed_hosts
)

# 2. Payload size limit middleware (Prevent DoS)
@app.middleware("http")
async def limit_upload_size(request: Request, call_next):
    # Limit to 2MB
    MAX_UPLOAD_SIZE = 2 * 1024 * 1024
    
    content_length = request.headers.get("content-length")
    if content_length:
        if int(content_length) > MAX_UPLOAD_SIZE:
            return JSONResponse(
                status_code=413,
                content={"detail": "Payload too large. Maximum size is 2MB."}
            )
            
    return await call_next(request)

app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

# Debug: Log allowed origins
logger.info(f"DEBUG: ALLOWED_ORIGINS env var: '{ALLOWED_ORIGINS_ENV}'")
logger.info(f"DEBUG: Parsed Allowed Origins: {allowed_origins}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Debug middleware to log request origin (Added LAST so it runs FIRST)
@app.middleware("http")
async def log_request_origin(request: Request, call_next):
    origin = request.headers.get("origin")
    logger.info(f"DEBUG: Incoming {request.method} Request to {request.url.path}")
    logger.info(f"DEBUG: Headers: {request.headers}")
    response = await call_next(request)
    return response

# Explicit OPTIONS handler to debug/bypass CORS middleware issues
@app.options("/generate")
async def generate_options(request: Request):
    logger.info("DEBUG: Explicit OPTIONS /generate called")
    return Response(status_code=200)

# Debug: Log 404s to see what path is actually being requested
@app.exception_handler(404)
async def custom_404_handler(request: Request, exc):
    logger.error(f"DEBUG: 404 Not Found for path: {request.url.path}")
    return JSONResponse(status_code=404, content={"detail": f"Path {request.url.path} not found"})

# --- Custom Exception Handler for Friendly Validation Errors ---

FIELD_NAMES = {
    "name": "Name",
    "email": "Email",
    "phone": "Phone",
    "website": "Website",
    "location": "Location",
    "headline": "Headline",
    "summary": "Summary",
    "theme": "Theme",
    "company": "Company",
    "position": "Position",
    "institution": "Institution",
    "area": "Field of Study",
    "degree": "Degree",
}

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = []
    for error in exc.errors():
        # Get field name from location (e.g., ['body', 'email'] -> 'email')
        loc = error.get("loc", [])
        field = loc[-1] if loc else "field"
        friendly_field = FIELD_NAMES.get(field, field.replace("_", " ").title())
        
        # Create friendly message based on error type
        error_type = error.get("type", "")
        
        if "email" in error_type or field == "email":
            message = f"{friendly_field}: Please enter a valid email address (e.g., name@example.com)"
        elif "url" in error_type or field == "website":
            message = f"{friendly_field}: Please enter a valid URL (e.g., https://example.com)"
        elif "missing" in error_type:
            message = f"{friendly_field}: This field is required"
        elif "string_too_short" in error_type or "empty" in str(error.get("msg", "")):
            message = f"{friendly_field}: This field cannot be empty"
        else:
            # Fall back to the reason if available, otherwise the message
            ctx = error.get("ctx", {})
            reason = ctx.get("reason") or error.get("msg", "Invalid value")
            message = f"{friendly_field}: {reason}"
        
        errors.append(message)
    
    return JSONResponse(
        status_code=422,
        content={"detail": "Please fix the following issues:", "errors": errors}
    )



# --- Constants for Validation ---

VALID_NETWORKS = [
    "LinkedIn", "GitHub", "GitLab", "IMDB", "Instagram", "ORCID", 
    "Mastodon", "StackOverflow", "ResearchGate", "YouTube", 
    "Google Scholar", "Telegram", "WhatsApp", "Leetcode", "X", "Bluesky"
]

VALID_THEMES = ["classic", "engineeringclassic", "engineeringresumes", "moderncv", "sb2nov"]


# --- Pydantic Models ---

class SocialNetwork(BaseModel):
    network: str
    username: str
    
    @field_validator("network")
    @classmethod
    def valid_network(cls, v: str) -> str:
        if v not in VALID_NETWORKS:
            raise ValueError(
                f"'{v}' is not a valid social network. "
                f"Use one of: {', '.join(VALID_NETWORKS)}"
            )
        return v
    
    @field_validator("username")
    @classmethod
    def valid_username(cls, v: str, info) -> str:
        if not v or not v.strip():
            raise ValueError("Username cannot be empty")
        return v.strip()
    
    @classmethod
    def model_validator_stackoverflow(cls, values):
        # Note: This is handled in ResumeData validator since we need both fields
        return values


class ExperienceEntry(BaseModel):
    company: str
    position: str
    start_date: str
    end_date: str = "present"
    location: str | None = None
    highlights: list[str] = []
    
    @field_validator("company", "position")
    @classmethod
    def not_empty(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("This field cannot be empty")
        return v.strip()
    
    @field_validator("start_date", "end_date")
    @classmethod
    def valid_date_format(cls, v: str) -> str:
        import re
        if v.lower() == "present":
            return "present"
        # Accept YYYY-MM, YYYY-MM-DD, or YYYY formats
        if not re.match(r'^\d{4}(-\d{2})?(-\d{2})?$', v):
            raise ValueError(
                f"Date '{v}' should be in YYYY-MM format (e.g., 2020-01) or 'present'"
            )
        return v


class EducationEntry(BaseModel):
    institution: str
    area: str
    degree: str | None = None
    start_date: str | None = None
    end_date: str | None = None
    location: str | None = None
    highlights: list[str] = []
    
    @field_validator("institution", "area")
    @classmethod
    def not_empty(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("This field cannot be empty")
        return v.strip()
    
    @field_validator("start_date", "end_date")
    @classmethod
    def valid_date_format(cls, v: str | None) -> str | None:
        import re
        if v is None or v == "":
            return None
        if v.lower() == "present":
            return "present"
        if not re.match(r'^\d{4}(-\d{2})?(-\d{2})?$', v):
            raise ValueError(
                f"Date '{v}' should be in YYYY-MM format (e.g., 2020-01)"
            )
        return v


class ProjectEntry(BaseModel):
    name: str
    start_date: str | None = None
    end_date: str | None = None
    location: str | None = None
    summary: str | None = None
    highlights: list[str] = []
    
    @field_validator("name")
    @classmethod
    def not_empty(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("Project name cannot be empty")
        return v.strip()
    
    @field_validator("start_date", "end_date")
    @classmethod
    def valid_date_format(cls, v: str | None) -> str | None:
        import re
        if v is None or v == "":
            return None
        if v.lower() == "present":
            return "present"
        if not re.match(r'^\d{4}(-\d{2})?(-\d{2})?$', v):
            raise ValueError(
                f"Date '{v}' should be in YYYY-MM format (e.g., 2020-01)"
            )
        return v


class SkillEntry(BaseModel):
    label: str
    details: str
    
    @field_validator("label", "details")
    @classmethod
    def not_empty(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("This field cannot be empty")
        return v.strip()


class CustomSectionItem(BaseModel):
    title: str
    entries: list[str] = []
    
    @field_validator("title")
    @classmethod
    def not_empty(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("Section title cannot be empty")
        return v.strip()


class ResumeData(BaseModel):
    name: str
    headline: str | None = None
    email: EmailStr | None = None
    phone: str | None = None
    location: str | None = None
    website: HttpUrl | None = None
    social_networks: list[SocialNetwork] = []
    summary: str | None = None
    experience: list[ExperienceEntry] = []
    education: list[EducationEntry] = []
    projects: list[ProjectEntry] = []
    skills: list[SkillEntry] = []
    custom_sections: list[CustomSectionItem] = []
    theme: str = "classic"
    
    @field_validator("name")
    @classmethod
    def name_not_empty(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("Name cannot be empty")
        return v.strip()
    
    @field_validator("phone")
    @classmethod
    def valid_phone(cls, v: str | None) -> str | None:
        import re
        if v is None or v == "":
            return None
        # Must start with + and contain only digits after
        cleaned = v.replace(" ", "").replace("-", "").replace("(", "").replace(")", "")
        if not re.match(r'^\+\d{10,15}$', cleaned):
            raise ValueError(
                "Phone number should be in international format starting with + "
                "(e.g., +14155551234). Remove spaces, dashes, and parentheses."
            )
        return cleaned
    
    @field_validator("theme")
    @classmethod
    def valid_theme(cls, v: str) -> str:
        if v not in VALID_THEMES:
            raise ValueError(f"Theme must be one of: {', '.join(VALID_THEMES)}")
        return v
    
    @field_validator("social_networks")
    @classmethod
    def validate_social_networks(cls, v: list[SocialNetwork]) -> list[SocialNetwork]:
        import re
        for sn in v:
            # StackOverflow requires user_id/username format
            if sn.network == "StackOverflow":
                if not re.match(r'^\d+/[\w-]+$', sn.username):
                    raise ValueError(
                        f"StackOverflow username should be in format 'user_id/username' "
                        f"(e.g., '12345678/john-doe'), got '{sn.username}'"
                    )
        return v


# --- Helper Functions ---

def global_limit_key(request: Request):
    """Key function for global rate limiting."""
    return "global"

def resume_to_yaml(data: ResumeData) -> dict:
    """Convert ResumeData to rendercv YAML structure."""
    cv: dict = {"name": data.name}
    
    if data.headline:
        cv["headline"] = data.headline
    if data.email:
        cv["email"] = data.email
    if data.phone:
        cv["phone"] = data.phone
    if data.location:
        cv["location"] = data.location
    if data.website:
        cv["website"] = str(data.website)
    if data.social_networks:
        cv["social_networks"] = [
            {"network": sn.network, "username": sn.username}
            for sn in data.social_networks
        ]
    
    # Build sections in desired order: summary first, then everything else
    sections: dict = {}
    
    # 1. Summary (always first)
    if data.summary:
        sections["summary"] = [data.summary]
    
    # 2. Experience
    if data.experience:
        sections["experience"] = [
            {
                "company": exp.company,
                "position": exp.position,
                "start_date": exp.start_date,
                "end_date": exp.end_date,
                **({"location": exp.location} if exp.location else {}),
                **({"highlights": exp.highlights} if exp.highlights else {}),
            }
            for exp in data.experience
        ]
    
    # 3. Education
    if data.education:
        sections["education"] = [
            {
                "institution": edu.institution,
                "area": edu.area,
                **({"degree": edu.degree} if edu.degree else {}),
                **({"start_date": edu.start_date} if edu.start_date else {}),
                **({"end_date": edu.end_date} if edu.end_date else {}),
                **({"location": edu.location} if edu.location else {}),
                **({"highlights": edu.highlights} if edu.highlights else {}),
            }
            for edu in data.education
        ]
    
    # 4. Projects
    if data.projects:
        sections["projects"] = [
            {
                "name": proj.name,
                **({"start_date": proj.start_date} if proj.start_date else {}),
                **({"end_date": proj.end_date} if proj.end_date else {}),
                **({"location": proj.location} if proj.location else {}),
                **({"summary": proj.summary} if proj.summary else {}),
                **({"highlights": proj.highlights} if proj.highlights else {}),
            }
            for proj in data.projects
        ]
    
    # 5. Skills
    if data.skills:
        sections["skills"] = [
            {"label": skill.label, "details": skill.details}
            for skill in data.skills
        ]
    
    # 6. Custom sections (appended at the end)
    for custom in data.custom_sections:
        if custom.entries:
            sections[custom.title] = custom.entries
    
    if sections:
        cv["sections"] = sections
    
    return {
        "cv": cv,
        "design": {"theme": data.theme},
    }


def generate_pdf_with_rendercv(yaml_content: str) -> bytes:
    """Generate PDF using rendercv CLI."""
    import sys
    
    with tempfile.TemporaryDirectory() as tmpdir:
        yaml_path = Path(tmpdir) / "resume.yaml"
        yaml_path.write_text(yaml_content)
        
        # Run rendercv using the same Python interpreter
        result = subprocess.run(
            [sys.executable, "-m", "rendercv", "render", str(yaml_path)],
            cwd=tmpdir,
            capture_output=True,
            text=True,
        )
        
        if result.returncode != 0:
            error_msg = result.stderr or result.stdout or "Unknown error"
            raise HTTPException(
                status_code=500,
                detail=f"rendercv failed: {error_msg}"
            )
        
        # Find the generated PDF
        output_dir = Path(tmpdir) / "rendercv_output"
        
        if not output_dir.exists():
            raise HTTPException(
                status_code=500,
                detail=f"Output directory not created. stdout: {result.stdout}, stderr: {result.stderr}"
            )
        
        pdf_files = list(output_dir.glob("*.pdf"))
        
        if not pdf_files:
            raise HTTPException(
                status_code=500,
                detail=f"No PDF was generated. Files in output: {list(output_dir.iterdir())}"
            )
        
        return pdf_files[0].read_bytes()


# --- API Endpoints ---

@app.get("/health")
async def health_check():
    return {"status": "healthy"}


@app.post("/generate", dependencies=[Depends(verify_api_key)])
@limiter.limit("5/minute")
async def generate_pdf(request: Request, data: ResumeData):
    """Generate PDF from resume data."""
    yaml_dict = resume_to_yaml(data)
    yaml_content = yaml.dump(yaml_dict, default_flow_style=False, allow_unicode=True, sort_keys=False)
    
    pdf_bytes = generate_pdf_with_rendercv(yaml_content)
    
    filename = data.name.replace(" ", "_") + "_CV.pdf"
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'}
    )


@app.post("/yaml", dependencies=[Depends(verify_api_key)])
@limiter.limit("500/hour", key_func=global_limit_key)
@limiter.limit("15/minute")
async def generate_yaml(request: Request, data: ResumeData):
    """Generate YAML from resume data."""
    yaml_dict = resume_to_yaml(data)
    yaml_content = yaml.dump(yaml_dict, default_flow_style=False, allow_unicode=True, sort_keys=False)
    
    filename = data.name.replace(" ", "_") + "_CV.yaml"
    return Response(
        content=yaml_content,
        media_type="application/x-yaml",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'}
    )


class YamlRenderRequest(BaseModel):
    yaml_content: str
    
    @field_validator("yaml_content")
    @classmethod
    def not_empty(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("YAML content cannot be empty")
        return v


@app.post("/yaml/render", dependencies=[Depends(verify_api_key)])
@limiter.limit("5/minute")
async def render_yaml(request: Request, request_data: YamlRenderRequest):
    """Render PDF from raw YAML content."""
    pdf_bytes = generate_pdf_with_rendercv(request_data.yaml_content)
    
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": 'attachment; filename="resume.pdf"'}
    )
