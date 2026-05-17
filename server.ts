import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // AI-Powered Debugging Assistant API
  app.post("/api/debug", async (req, res) => {
    try {
      const { logs, context } = req.body;
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analyze these logs and context to find the root cause of the bug. 
        Context: ${context}
        Logs: ${logs}
        
        Provide:
        1. Probable bug origin
        2. Suggested fixes
        3. Simple explanation for a beginner.`,
      });
      res.json({ analysis: response.text });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Netflix Recap for Legacy Code API
  app.post("/api/recap", async (req, res) => {
    try {
      const { code } = req.body;
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Act as a cinematic master storyteller. Convert this legacy code snippet or architecture description into a short, engaging human-readable story.
        
        Style: Netflix "Previously On..." recap.
        Structure:
        1. THE PREMISE (The situation/setting)
        2. THE CAST (The functions/modules as characters)
        3. THE PLOT (The flow of logic as a narrative)
        4. THE CLIFFHANGER (Technical debt or risks found)
        
        Keep it short, dramatic, and creative. Do not use too much technical jargon, personify the code.
        
        Code: ${code}`,
      });
      res.json({ recap: response.text });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Code Understanding API
  app.post("/api/explain", async (req, res) => {
    try {
      const { code, file } = req.body;
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Explain this file/code for developer onboarding.
        File: ${file}
        Code: ${code}`,
      });
      res.json({ explanation: response.text });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Developer Matching API (Simulated)
  app.post("/api/match", async (req, res) => {
    try {
      const { stack, interests } = req.body;
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Given this tech stack: ${stack} and interests: ${interests}, suggest 3 hypothetical developers (names, roles, common interests) from a developer network that would be great matches for collaboration. Return as JSON array of objects.`,
        config: {
          responseMimeType: "application/json",
        }
      });
      res.json({ matches: JSON.parse(response.text || "[]") });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
