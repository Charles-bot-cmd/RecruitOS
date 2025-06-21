# RecruitOS FastAPI Backend Documentation

This document provides comprehensive API documentation for implementing a FastAPI backend for RecruitOS.

## Base URL
```
https://your-api-domain.com/api
```

## Authentication
All endpoints require authentication. Include the API key in the Authorization header:
```
Authorization: Bearer YOUR_API_KEY
```

## Data Models

### Candidate
```python
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class CandidateBase(BaseModel):
    firstName: str
    lastName: str
    email: str
    phone: Optional[str] = None
    position: str
    phase: int = 1  # 1 or 2
    status: str = "New"
    source: str = "LinkedIn"  # LinkedIn, Indeed, Referral, Website
    skills: Optional[str] = None
    experience: Optional[int] = None
    notes: Optional[str] = None
    resumeUrl: Optional[str] = None
    linkedinUrl: Optional[str] = None

class CandidateCreate(CandidateBase):
    pass

class CandidateUpdate(BaseModel):
    firstName: Optional[str] = None
    lastName: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    position: Optional[str] = None
    phase: Optional[int] = None
    status: Optional[str] = None
    source: Optional[str] = None
    skills: Optional[str] = None
    experience: Optional[int] = None
    notes: Optional[str] = None
    resumeUrl: Optional[str] = None
    linkedinUrl: Optional[str] = None

class Candidate(CandidateBase):
    id: int
    appliedDate: datetime
    lastUpdated: datetime
    
    class Config:
        from_attributes = True
```

### Interview
```python
class InterviewBase(BaseModel):
    candidateId: int
    type: str = "Phone"  # Phone, Video, In-Person, Technical
    scheduledDate: datetime
    duration: int = 60  # minutes
    interviewer: str
    status: str = "Scheduled"  # Scheduled, Completed, Cancelled
    notes: Optional[str] = None
    rating: Optional[int] = None  # 1-5

class InterviewCreate(InterviewBase):
    pass

class InterviewUpdate(BaseModel):
    candidateId: Optional[int] = None
    type: Optional[str] = None
    scheduledDate: Optional[datetime] = None
    duration: Optional[int] = None
    interviewer: Optional[str] = None
    status: Optional[str] = None
    notes: Optional[str] = None
    rating: Optional[int] = None

class Interview(InterviewBase):
    id: int
    
    class Config:
        from_attributes = True
```

### Dashboard Stats
```python
class DashboardStats(BaseModel):
    totalCandidates: int
    phase1Count: int
    phase2Count: int
    hiredCount: int
    interviewsToday: int
    syncStatus: str = "synced"  # synced, syncing, error
    lastSync: datetime
```

### Activity Item
```python
class ActivityItem(BaseModel):
    id: str
    type: str  # candidate, interview, sync
    candidateName: Optional[str] = None
    action: str
    timestamp: datetime
    interviewer: Optional[str] = None
    count: Optional[int] = None
```

## API Endpoints

### Dashboard

#### Get Dashboard Stats
```http
GET /api/dashboard/stats
```

**Response:**
```json
{
  "totalCandidates": 55,
  "phase1Count": 32,
  "phase2Count": 23,
  "hiredCount": 12,
  "interviewsToday": 3,
  "syncStatus": "synced",
  "lastSync": "2024-01-20T10:30:00Z"
}
```

#### Get Activity Feed
```http
GET /api/activity
```

**Response:**
```json
[
  {
    "id": "activity-1",
    "type": "candidate",
    "candidateName": "Sarah Johnson",
    "action": "moved to Phone Interview",
    "timestamp": "2024-01-20T10:30:00Z"
  },
  {
    "id": "activity-2",
    "type": "interview",
    "action": "Interview scheduled with Michael Chen",
    "timestamp": "2024-01-20T09:15:00Z",
    "interviewer": "Jane Doe"
  }
]
```

### Candidates

#### Get All Candidates
```http
GET /api/candidates
```

**Query Parameters:**
- `phase` (optional): Filter by phase (1 or 2)
- `search` (optional): Search by name, email, or position
- `status` (optional): Filter by status
- `source` (optional): Filter by source
- `limit` (optional): Number of results (default: 50)
- `offset` (optional): Pagination offset (default: 0)

**Example:**
```http
GET /api/candidates?phase=1&search=john&limit=20&offset=0
```

**Response:**
```json
[
  {
    "id": 1,
    "firstName": "Sarah",
    "lastName": "Johnson",
    "email": "sarah.johnson@email.com",
    "phone": "+1 (555) 123-4567",
    "position": "Frontend Developer",
    "phase": 1,
    "status": "New",
    "source": "LinkedIn",
    "appliedDate": "2024-01-15T09:00:00Z",
    "lastUpdated": "2024-01-20T10:30:00Z",
    "skills": "React, TypeScript, CSS",
    "experience": 3,
    "notes": "Strong React skills, excellent portfolio",
    "resumeUrl": null,
    "linkedinUrl": null
  }
]
```

#### Get Single Candidate
```http
GET /api/candidates/{candidateId}
```

**Response:**
```json
{
  "id": 1,
  "firstName": "Sarah",
  "lastName": "Johnson",
  "email": "sarah.johnson@email.com",
  "phone": "+1 (555) 123-4567",
  "position": "Frontend Developer",
  "phase": 1,
  "status": "New",
  "source": "LinkedIn",
  "appliedDate": "2024-01-15T09:00:00Z",
  "lastUpdated": "2024-01-20T10:30:00Z",
  "skills": "React, TypeScript, CSS",
  "experience": 3,
  "notes": "Strong React skills, excellent portfolio",
  "resumeUrl": null,
  "linkedinUrl": null
}
```

#### Create Candidate
```http
POST /api/candidates
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@email.com",
  "phone": "+1 (555) 987-6543",
  "position": "Backend Developer",
  "phase": 1,
  "status": "New",
  "source": "Indeed",
  "skills": "Python, FastAPI, PostgreSQL",
  "experience": 5,
  "notes": "Strong backend experience"
}
```

**Response:**
```json
{
  "id": 56,
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@email.com",
  "phone": "+1 (555) 987-6543",
  "position": "Backend Developer",
  "phase": 1,
  "status": "New",
  "source": "Indeed",
  "appliedDate": "2024-01-20T11:00:00Z",
  "lastUpdated": "2024-01-20T11:00:00Z",
  "skills": "Python, FastAPI, PostgreSQL",
  "experience": 5,
  "notes": "Strong backend experience",
  "resumeUrl": null,
  "linkedinUrl": null
}
```

#### Update Candidate
```http
PUT /api/candidates/{candidateId}
```

**Request Body:**
```json
{
  "status": "Phone Interview",
  "notes": "Updated notes after phone screening"
}
```

**Response:**
```json
{
  "id": 1,
  "firstName": "Sarah",
  "lastName": "Johnson",
  "email": "sarah.johnson@email.com",
  "phone": "+1 (555) 123-4567",
  "position": "Frontend Developer",
  "phase": 1,
  "status": "Phone Interview",
  "source": "LinkedIn",
  "appliedDate": "2024-01-15T09:00:00Z",
  "lastUpdated": "2024-01-20T11:15:00Z",
  "skills": "React, TypeScript, CSS",
  "experience": 3,
  "notes": "Updated notes after phone screening",
  "resumeUrl": null,
  "linkedinUrl": null
}
```

#### Delete Candidate
```http
DELETE /api/candidates/{candidateId}
```

**Response:**
```http
204 No Content
```

### Interviews

#### Get All Interviews
```http
GET /api/interviews
```

**Query Parameters:**
- `candidateId` (optional): Filter by candidate ID
- `date` (optional): Filter by date (YYYY-MM-DD format)
- `status` (optional): Filter by status
- `interviewer` (optional): Filter by interviewer name
- `limit` (optional): Number of results (default: 50)
- `offset` (optional): Pagination offset (default: 0)

**Example:**
```http
GET /api/interviews?candidateId=1&status=Scheduled
```

**Response:**
```json
[
  {
    "id": 1,
    "candidateId": 1,
    "type": "Phone",
    "scheduledDate": "2024-01-21T14:00:00Z",
    "duration": 30,
    "interviewer": "John Smith",
    "status": "Scheduled",
    "notes": "Initial phone screening",
    "rating": null
  }
]
```

#### Get Single Interview
```http
GET /api/interviews/{interviewId}
```

#### Create Interview
```http
POST /api/interviews
```

**Request Body:**
```json
{
  "candidateId": 1,
  "type": "Technical",
  "scheduledDate": "2024-01-22T15:00:00Z",
  "duration": 90,
  "interviewer": "Jane Doe",
  "status": "Scheduled",
  "notes": "Technical coding interview"
}
```

#### Update Interview
```http
PUT /api/interviews/{interviewId}
```

**Request Body:**
```json
{
  "status": "Completed",
  "rating": 4,
  "notes": "Strong technical skills, good problem-solving approach"
}
```

#### Delete Interview
```http
DELETE /api/interviews/{interviewId}
```

## Error Responses

All endpoints return standard HTTP status codes and error responses:

### 400 Bad Request
```json
{
  "detail": "Validation error",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "detail": "Invalid or missing authentication token"
}
```

### 404 Not Found
```json
{
  "detail": "Candidate not found"
}
```

### 500 Internal Server Error
```json
{
  "detail": "Internal server error"
}
```

## FastAPI Implementation Example

```python
from fastapi import FastAPI, HTTPException, Depends, Query
from fastapi.security import HTTPBearer
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, date

app = FastAPI(title="RecruitOS API", version="1.0.0")
security = HTTPBearer()

# Database dependency
def get_db():
    # Return database session
    pass

# Authentication dependency
def verify_token(token: str = Depends(security)):
    # Verify JWT token
    pass

@app.get("/api/dashboard/stats", response_model=DashboardStats)
async def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user = Depends(verify_token)
):
    # Implementation
    pass

@app.get("/api/candidates", response_model=List[Candidate])
async def get_candidates(
    phase: Optional[int] = Query(None),
    search: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    source: Optional[str] = Query(None),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
    current_user = Depends(verify_token)
):
    # Implementation
    pass

@app.post("/api/candidates", response_model=Candidate, status_code=201)
async def create_candidate(
    candidate: CandidateCreate,
    db: Session = Depends(get_db),
    current_user = Depends(verify_token)
):
    # Implementation
    pass

# Additional endpoints...
```

## Database Schema (SQLAlchemy)

```python
from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime

Base = declarative_base()

class Candidate(Base):
    __tablename__ = "candidates"
    
    id = Column(Integer, primary_key=True, index=True)
    firstName = Column(String(100), nullable=False)
    lastName = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    phone = Column(String(20), nullable=True)
    position = Column(String(200), nullable=False)
    phase = Column(Integer, default=1, nullable=False)
    status = Column(String(50), default="New", nullable=False)
    source = Column(String(50), default="LinkedIn", nullable=False)
    appliedDate = Column(DateTime, default=datetime.utcnow, nullable=False)
    lastUpdated = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    skills = Column(Text, nullable=True)
    experience = Column(Integer, nullable=True)
    notes = Column(Text, nullable=True)
    resumeUrl = Column(String(500), nullable=True)
    linkedinUrl = Column(String(500), nullable=True)
    
    # Relationships
    interviews = relationship("Interview", back_populates="candidate")

class Interview(Base):
    __tablename__ = "interviews"
    
    id = Column(Integer, primary_key=True, index=True)
    candidateId = Column(Integer, ForeignKey("candidates.id"), nullable=False)
    type = Column(String(50), default="Phone", nullable=False)
    scheduledDate = Column(DateTime, nullable=False)
    duration = Column(Integer, default=60, nullable=False)
    interviewer = Column(String(200), nullable=False)
    status = Column(String(50), default="Scheduled", nullable=False)
    notes = Column(Text, nullable=True)
    rating = Column(Integer, nullable=True)
    
    # Relationships
    candidate = relationship("Candidate", back_populates="interviews")
```

## Testing

Use the provided endpoints to test API functionality:

```bash
# Get candidates
curl -X GET "https://your-api-domain.com/api/candidates?phase=1" \
  -H "Authorization: Bearer YOUR_API_KEY"

# Create candidate
curl -X POST "https://your-api-domain.com/api/candidates" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "position": "Developer"
  }'
```

This documentation provides everything needed to implement a FastAPI backend that will seamlessly integrate with the RecruitOS frontend.