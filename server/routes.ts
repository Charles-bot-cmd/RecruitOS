import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { databaseManager } from "./database";
import { insertCandidateSchema, insertInterviewSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Dashboard routes
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  // Candidate routes
  app.get("/api/candidates", async (req, res) => {
    try {
      const { phase, search } = req.query;
      
      let candidates;
      if (search) {
        candidates = await storage.searchCandidates(search as string);
      } else if (phase) {
        candidates = await storage.getCandidatesByPhase(parseInt(phase as string));
      } else {
        candidates = await storage.getAllCandidates();
      }
      
      res.json(candidates);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch candidates" });
    }
  });

  app.get("/api/candidates/:id", async (req, res) => {
    try {
      const candidate = await storage.getCandidate(parseInt(req.params.id));
      if (!candidate) {
        return res.status(404).json({ message: "Candidate not found" });
      }
      res.json(candidate);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch candidate" });
    }
  });

  app.post("/api/candidates", async (req, res) => {
    try {
      const validatedData = insertCandidateSchema.parse(req.body);
      const candidate = await storage.createCandidate(validatedData);
      res.status(201).json(candidate);
    } catch (error) {
      res.status(400).json({ message: "Invalid candidate data" });
    }
  });

  app.put("/api/candidates/:id", async (req, res) => {
    try {
      const validatedData = insertCandidateSchema.partial().parse(req.body);
      const candidate = await storage.updateCandidate(parseInt(req.params.id), validatedData);
      if (!candidate) {
        return res.status(404).json({ message: "Candidate not found" });
      }
      res.json(candidate);
    } catch (error) {
      res.status(400).json({ message: "Invalid candidate data" });
    }
  });

  app.delete("/api/candidates/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteCandidate(parseInt(req.params.id));
      if (!deleted) {
        return res.status(404).json({ message: "Candidate not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete candidate" });
    }
  });

  // Interview routes
  app.get("/api/interviews", async (req, res) => {
    try {
      const { candidateId, date } = req.query;
      
      let interviews;
      if (candidateId) {
        interviews = await storage.getInterviewsByCandidate(parseInt(candidateId as string));
      } else if (date) {
        interviews = await storage.getInterviewsForDate(new Date(date as string));
      } else {
        interviews = await storage.getAllInterviews();
      }
      
      res.json(interviews);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch interviews" });
    }
  });

  app.get("/api/interviews/:id", async (req, res) => {
    try {
      const interview = await storage.getInterview(parseInt(req.params.id));
      if (!interview) {
        return res.status(404).json({ message: "Interview not found" });
      }
      res.json(interview);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch interview" });
    }
  });

  app.post("/api/interviews", async (req, res) => {
    try {
      const validatedData = insertInterviewSchema.parse(req.body);
      const interview = await storage.createInterview(validatedData);
      res.status(201).json(interview);
    } catch (error) {
      res.status(400).json({ message: "Invalid interview data" });
    }
  });

  app.put("/api/interviews/:id", async (req, res) => {
    try {
      const validatedData = insertInterviewSchema.partial().parse(req.body);
      const interview = await storage.updateInterview(parseInt(req.params.id), validatedData);
      if (!interview) {
        return res.status(404).json({ message: "Interview not found" });
      }
      res.json(interview);
    } catch (error) {
      res.status(400).json({ message: "Invalid interview data" });
    }
  });

  app.delete("/api/interviews/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteInterview(parseInt(req.params.id));
      if (!deleted) {
        return res.status(404).json({ message: "Interview not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete interview" });
    }
  });

  // Activity feed route
  app.get("/api/activity", async (req, res) => {
    try {
      // Get recent candidate updates and interviews
      const candidates = await storage.getAllCandidates();
      const interviews = await storage.getAllInterviews();
      
      const activities = [
        ...candidates.slice(-10).map(candidate => ({
          id: `candidate-${candidate.id}`,
          type: 'candidate',
          candidateName: `${candidate.firstName} ${candidate.lastName}`,
          action: `moved to ${candidate.status}`,
          timestamp: candidate.lastUpdated,
        })),
        ...interviews.slice(-10).map(interview => ({
          id: `interview-${interview.id}`,
          type: 'interview',
          action: `Interview ${interview.status.toLowerCase()}`,
          timestamp: interview.scheduledDate,
          interviewer: interview.interviewer,
        }))
      ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 10);
      
      res.json(activities);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch activity feed" });
    }
  });

  // Database management routes
  app.get("/api/database/status", async (req, res) => {
    try {
      const status = await databaseManager.testConnection();
      res.json(status);
    } catch (error) {
      res.status(500).json({ message: "Failed to check database status" });
    }
  });

  app.post("/api/database/config", async (req, res) => {
    try {
      const { databaseUrl, autoSync, syncFrequency } = req.body;
      await databaseManager.updateConfig({
        databaseUrl,
        autoSync,
        syncFrequency
      });
      res.json({ message: "Database configuration updated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to update database configuration" });
    }
  });

  app.get("/api/database/config", async (req, res) => {
    try {
      const config = databaseManager.getConfig();
      // Don't expose the full database URL for security
      res.json({
        ...config,
        databaseUrl: config.databaseUrl ? '***configured***' : ''
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to get database configuration" });
    }
  });

  app.post("/api/database/test-connection", async (req, res) => {
    try {
      const status = await databaseManager.testConnection();
      res.json(status);
    } catch (error) {
      res.status(500).json({ message: "Failed to test database connection" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
