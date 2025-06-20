import { 
  users, candidates, interviews, dashboardStats,
  type User, type InsertUser,
  type Candidate, type InsertCandidate,
  type Interview, type InsertInterview,
  type DashboardStats, type InsertDashboardStats
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Candidate methods
  getAllCandidates(): Promise<Candidate[]>;
  getCandidatesByPhase(phase: number): Promise<Candidate[]>;
  getCandidate(id: number): Promise<Candidate | undefined>;
  createCandidate(candidate: InsertCandidate): Promise<Candidate>;
  updateCandidate(id: number, candidate: Partial<InsertCandidate>): Promise<Candidate | undefined>;
  deleteCandidate(id: number): Promise<boolean>;
  searchCandidates(query: string): Promise<Candidate[]>;

  // Interview methods
  getAllInterviews(): Promise<Interview[]>;
  getInterviewsByCandidate(candidateId: number): Promise<Interview[]>;
  getInterview(id: number): Promise<Interview | undefined>;
  createInterview(interview: InsertInterview): Promise<Interview>;
  updateInterview(id: number, interview: Partial<InsertInterview>): Promise<Interview | undefined>;
  deleteInterview(id: number): Promise<boolean>;
  getInterviewsForDate(date: Date): Promise<Interview[]>;

  // Dashboard stats
  getDashboardStats(): Promise<DashboardStats>;
  updateDashboardStats(stats: Partial<InsertDashboardStats>): Promise<DashboardStats>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private candidates: Map<number, Candidate>;
  private interviews: Map<number, Interview>;
  private stats: DashboardStats;
  private currentUserId: number;
  private currentCandidateId: number;
  private currentInterviewId: number;

  constructor() {
    this.users = new Map();
    this.candidates = new Map();
    this.interviews = new Map();
    this.currentUserId = 1;
    this.currentCandidateId = 1;
    this.currentInterviewId = 1;
    
    // Initialize default stats
    this.stats = {
      id: 1,
      totalCandidates: 0,
      phase1Count: 0,
      phase2Count: 0,
      hiredCount: 0,
      interviewsToday: 0,
      syncStatus: 'synced',
      lastSync: new Date(),
    };

    // Initialize with mock data
    this.initializeMockData();
  }

  private initializeMockData() {
    // Create mock candidates
    const mockCandidates: InsertCandidate[] = [
      {
        firstName: "Sarah",
        lastName: "Johnson",
        email: "sarah.johnson@email.com",
        phone: "+1 (555) 123-4567",
        position: "Frontend Developer",
        phase: 1,
        status: "New",
        source: "LinkedIn",
        skills: "React, TypeScript, CSS",
        experience: 3,
        notes: "Strong React skills, excellent portfolio"
      },
      {
        firstName: "Michael",
        lastName: "Chen",
        email: "michael.chen@email.com",
        phone: "+1 (555) 234-5678",
        position: "Backend Developer",
        phase: 1,
        status: "Screened",
        source: "indeed",
        skills: "Node.js, Python, PostgreSQL",
        experience: 5,
        notes: "Solid backend experience"
      },
      {
        firstName: "Emma",
        lastName: "Wilson",
        email: "emma.wilson@email.com",
        phone: "+1 (555) 345-6789",
        position: "Full Stack Developer",
        phase: 2,
        status: "Technical Interview",
        source: "Referral",
        skills: "React, Node.js, AWS",
        experience: 4,
        notes: "Referred by team member"
      },
      {
        firstName: "David",
        lastName: "Park",
        email: "david.park@email.com",
        phone: "+1 (555) 456-7890",
        position: "DevOps Engineer",
        phase: 2,
        status: "Final Interview",
        source: "Website",
        skills: "Docker, Kubernetes, AWS",
        experience: 6,
        notes: "Strong DevOps background"
      },
      {
        firstName: "Lisa",
        lastName: "Zhang",
        email: "lisa.zhang@email.com",
        phone: "+1 (555) 567-8901",
        position: "UI/UX Designer",
        phase: 1,
        status: "Phone Interview",
        source: "LinkedIn",
        skills: "Figma, Adobe Creative Suite",
        experience: 4,
        notes: "Excellent design portfolio"
      }
    ];

    // Add more candidates to reach 50+
    for (let i = 0; i < 50; i++) {
      mockCandidates.push({
        firstName: `Candidate${i + 6}`,
        lastName: `LastName${i + 6}`,
        email: `candidate${i + 6}@email.com`,
        phone: `+1 (555) ${(600 + i).toString().padStart(3, '0')}-${Math.floor(Math.random() * 9000) + 1000}`,
        position: ["Software Engineer", "Data Scientist", "Product Manager", "QA Engineer"][i % 4],
        phase: i % 2 === 0 ? 1 : 2,
        status: ["New", "Screened", "Phone Interview", "Technical Interview"][i % 4],
        source: ["LinkedIn", "Indeed", "Referral", "Website"][i % 4],
        skills: "Various technical skills",
        experience: Math.floor(Math.random() * 10) + 1,
        notes: `Mock candidate ${i + 6}`
      });
    }

    // Create candidates
    mockCandidates.forEach(candidate => {
      this.createCandidate(candidate);
    });

    // Create mock interviews
    const mockInterviews: InsertInterview[] = [
      {
        candidateId: 1,
        type: "Phone",
        scheduledDate: new Date(),
        duration: 30,
        interviewer: "John Smith",
        status: "Scheduled",
        notes: "Initial phone screening"
      },
      {
        candidateId: 2,
        type: "Technical",
        scheduledDate: new Date(),
        duration: 60,
        interviewer: "Jane Doe",
        status: "Completed",
        rating: 4,
        notes: "Strong technical skills"
      },
      {
        candidateId: 3,
        type: "Video",
        scheduledDate: new Date(Date.now() + 86400000), // Tomorrow
        duration: 45,
        interviewer: "Bob Wilson",
        status: "Scheduled",
        notes: "Final round interview"
      }
    ];

    // Add more interviews to reach 20+
    for (let i = 0; i < 20; i++) {
      mockInterviews.push({
        candidateId: Math.floor(Math.random() * 10) + 1,
        type: ["Phone", "Video", "Technical", "In-Person"][i % 4] as any,
        scheduledDate: new Date(Date.now() + Math.random() * 7 * 86400000), // Next 7 days
        duration: [30, 45, 60, 90][i % 4],
        interviewer: ["John Smith", "Jane Doe", "Bob Wilson", "Alice Brown"][i % 4],
        status: ["Scheduled", "Completed", "Cancelled"][i % 3] as any,
        rating: Math.random() > 0.5 ? Math.floor(Math.random() * 5) + 1 : undefined,
        notes: `Mock interview ${i + 1}`
      });
    }

    mockInterviews.forEach(interview => {
      this.createInterview(interview);
    });

    // Update stats
    this.updateStats();
  }

  private updateStats() {
    const allCandidates = Array.from(this.candidates.values());
    const phase1Count = allCandidates.filter(c => c.phase === 1).length;
    const phase2Count = allCandidates.filter(c => c.phase === 2).length;
    const hiredCount = allCandidates.filter(c => c.status === 'Hired').length;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const interviewsToday = Array.from(this.interviews.values()).filter(i => {
      const interviewDate = new Date(i.scheduledDate);
      return interviewDate >= today && interviewDate < tomorrow;
    }).length;

    this.stats = {
      ...this.stats,
      totalCandidates: allCandidates.length,
      phase1Count,
      phase2Count,
      hiredCount,
      interviewsToday,
    };
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Candidate methods
  async getAllCandidates(): Promise<Candidate[]> {
    return Array.from(this.candidates.values());
  }

  async getCandidatesByPhase(phase: number): Promise<Candidate[]> {
    return Array.from(this.candidates.values()).filter(c => c.phase === phase);
  }

  async getCandidate(id: number): Promise<Candidate | undefined> {
    return this.candidates.get(id);
  }

  async createCandidate(insertCandidate: InsertCandidate): Promise<Candidate> {
    const id = this.currentCandidateId++;
    const candidate: Candidate = {
      id,
      firstName: insertCandidate.firstName,
      lastName: insertCandidate.lastName,
      email: insertCandidate.email,
      phone: insertCandidate.phone || null,
      position: insertCandidate.position,
      phase: insertCandidate.phase || 1,
      status: insertCandidate.status || 'New',
      source: insertCandidate.source || 'LinkedIn',
      appliedDate: new Date(),
      lastUpdated: new Date(),
      resumeUrl: insertCandidate.resumeUrl || null,
      linkedinUrl: insertCandidate.linkedinUrl || null,
      skills: insertCandidate.skills || null,
      experience: insertCandidate.experience || null,
      notes: insertCandidate.notes || null,
    };
    this.candidates.set(id, candidate);
    this.updateStats();
    return candidate;
  }

  async updateCandidate(id: number, updates: Partial<InsertCandidate>): Promise<Candidate | undefined> {
    const candidate = this.candidates.get(id);
    if (!candidate) return undefined;

    const updatedCandidate: Candidate = {
      ...candidate,
      ...updates,
      lastUpdated: new Date(),
    };
    this.candidates.set(id, updatedCandidate);
    this.updateStats();
    return updatedCandidate;
  }

  async deleteCandidate(id: number): Promise<boolean> {
    const deleted = this.candidates.delete(id);
    if (deleted) {
      this.updateStats();
    }
    return deleted;
  }

  async searchCandidates(query: string): Promise<Candidate[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.candidates.values()).filter(candidate =>
      candidate.firstName.toLowerCase().includes(lowerQuery) ||
      candidate.lastName.toLowerCase().includes(lowerQuery) ||
      candidate.email.toLowerCase().includes(lowerQuery) ||
      candidate.position.toLowerCase().includes(lowerQuery)
    );
  }

  // Interview methods
  async getAllInterviews(): Promise<Interview[]> {
    return Array.from(this.interviews.values());
  }

  async getInterviewsByCandidate(candidateId: number): Promise<Interview[]> {
    return Array.from(this.interviews.values()).filter(i => i.candidateId === candidateId);
  }

  async getInterview(id: number): Promise<Interview | undefined> {
    return this.interviews.get(id);
  }

  async createInterview(insertInterview: InsertInterview): Promise<Interview> {
    const id = this.currentInterviewId++;
    const interview: Interview = {
      id,
      candidateId: insertInterview.candidateId,
      type: insertInterview.type || 'Phone',
      scheduledDate: insertInterview.scheduledDate,
      duration: insertInterview.duration || 60,
      interviewer: insertInterview.interviewer,
      status: insertInterview.status || 'Scheduled',
      notes: insertInterview.notes || null,
      rating: insertInterview.rating || null,
    };
    this.interviews.set(id, interview);
    this.updateStats();
    return interview;
  }

  async updateInterview(id: number, updates: Partial<InsertInterview>): Promise<Interview | undefined> {
    const interview = this.interviews.get(id);
    if (!interview) return undefined;

    const updatedInterview: Interview = { ...interview, ...updates };
    this.interviews.set(id, updatedInterview);
    return updatedInterview;
  }

  async deleteInterview(id: number): Promise<boolean> {
    return this.interviews.delete(id);
  }

  async getInterviewsForDate(date: Date): Promise<Interview[]> {
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    const nextDay = new Date(targetDate);
    nextDay.setDate(nextDay.getDate() + 1);

    return Array.from(this.interviews.values()).filter(interview => {
      const interviewDate = new Date(interview.scheduledDate);
      return interviewDate >= targetDate && interviewDate < nextDay;
    });
  }

  // Dashboard stats
  async getDashboardStats(): Promise<DashboardStats> {
    return this.stats;
  }

  async updateDashboardStats(updates: Partial<InsertDashboardStats>): Promise<DashboardStats> {
    this.stats = { ...this.stats, ...updates };
    return this.stats;
  }
}

export const storage = new MemStorage();
