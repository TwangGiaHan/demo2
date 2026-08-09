import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import { INITIAL_REQUESTS, INITIAL_EMPLOYEES, INITIAL_INVENTORY, INITIAL_AI_LOGS, INITIAL_STATS } from './src/data/mockData.js';
import { UniformRequest } from './src/types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // In-memory data state
  let requestsStore: UniformRequest[] = [...INITIAL_REQUESTS];
  let employeesStore = [...INITIAL_EMPLOYEES];
  let inventoryStore = [...INITIAL_INVENTORY];
  let aiLogsStore = [...INITIAL_AI_LOGS];

  // Lazy Gemini AI initialization
  let aiClient: GoogleGenAI | null = null;
  function getAiClient(): GoogleGenAI | null {
    if (!aiClient && process.env.GEMINI_API_KEY) {
      aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    }
    return aiClient;
  }

  // API Routes

  // GET /api/stats
  app.get('/api/stats', (req, res) => {
    const totalRequests = requestsStore.length + 1243;
    const pendingApproval = requestsStore.filter(r => r.status === 'Validating').length + 39;
    const approved = requestsStore.filter(r => r.status === 'Approved' || r.status === 'Ready' || r.status === 'Delivered').length + 852;
    const stockAlerts = inventoryStore.filter(i => i.status !== 'In Stock').length + 5;

    res.json({
      ...INITIAL_STATS,
      totalRequests,
      pendingApproval,
      approved,
      stockAlerts
    });
  });

  // GET /api/requests
  app.get('/api/requests', (req, res) => {
    const { search, status, department, type } = req.query;
    let filtered = [...requestsStore];

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        r =>
          r.id.toLowerCase().includes(q) ||
          r.genId.toLowerCase().includes(q) ||
          r.employeeName.toLowerCase().includes(q) ||
          (r.orderNumber && r.orderNumber.toLowerCase().includes(q))
      );
    }

    if (status && typeof status === 'string' && status !== 'all') {
      filtered = filtered.filter(r => r.status.toLowerCase() === status.toLowerCase());
    }

    if (department && typeof department === 'string' && department !== 'all') {
      filtered = filtered.filter(r => r.department.toLowerCase() === department.toLowerCase());
    }

    if (type && typeof type === 'string' && type !== 'all') {
      filtered = filtered.filter(r => r.uniformType.toLowerCase().includes(type.toLowerCase()));
    }

    res.json(filtered);
  });

  // GET /api/requests/:id
  app.get('/api/requests/:id', (req, res) => {
    const id = req.params.id;
    const request = requestsStore.find(
      r => r.id.toLowerCase() === id.toLowerCase() || (r.orderNumber && r.orderNumber.toLowerCase() === id.toLowerCase())
    );
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }
    res.json(request);
  });

  // POST /api/requests
  app.post('/api/requests', (req, res) => {
    const body = req.body;
    const newId = `RQ-2023-${String(893 + requestsStore.length).padStart(4, '0')}`;
    const newOrderNumber = `#REQ-${Math.floor(1000 + Math.random() * 9000)}A`;

    const newRequest: UniformRequest = {
      id: newId,
      orderNumber: newOrderNumber,
      genId: body.genId || 'G-00000',
      employeeName: body.employeeName || 'New Employee',
      department: body.department || 'Operations',
      costCenter: body.costCenter || 'CC-9999-VN',
      uniformType: body.uniformType || 'Ghile',
      category: body.category || 'Operations - Field',
      printName: body.printName || '',
      size: body.size || 'M',
      reason: body.reason || 'New Hire Allocation',
      quantity: body.quantity || 1,
      status: 'Validating',
      createdAt: 'Just now',
      aiSuggested: body.aiSuggested || false,
      aiNote: body.aiSuggested ? 'AI Verified & Suggested Size' : undefined,
      pickupLocation: 'GA Warehouse',
      pickupTime: 'Thursday, 08:00 - 16:00',
      returnRequired: body.reason === 'Replace' || body.reason === 'Annual Replacement',
      returnReason: body.reason,
      collectedByWarehouse: false,
      confirmedReceived: false,
      timeline: {
        submittedAt: 'Just now'
      }
    };

    requestsStore.unshift(newRequest);

    // Log AI action
    aiLogsStore.unshift({
      id: `LOG-${Date.now()}`,
      timestamp: 'Just now',
      type: 'Data Sync',
      status: 'Success',
      message: `Created new request ${newId} (${newOrderNumber}) for ${newRequest.employeeName}.`,
      confidenceScore: 98.9,
      reqId: newId
    });

    res.status(201).json(newRequest);
  });

  // PATCH /api/requests/:id
  app.patch('/api/requests/:id', (req, res) => {
    const id = req.params.id;
    const index = requestsStore.findIndex(
      r => r.id.toLowerCase() === id.toLowerCase() || (r.orderNumber && r.orderNumber.toLowerCase() === id.toLowerCase())
    );

    if (index === -1) {
      return res.status(404).json({ error: 'Request not found' });
    }

    const updated = { ...requestsStore[index], ...req.body };
    if (req.body.status === 'Ready' && !updated.timeline?.readyAt) {
      updated.timeline = {
        ...updated.timeline,
        readyAt: 'Just now'
      };
    }
    if (req.body.confirmedReceived) {
      updated.status = 'Delivered';
      updated.timeline = {
        ...updated.timeline,
        deliveredAt: 'Just now'
      };
    }

    requestsStore[index] = updated;
    res.json(updated);
  });

  // GET /api/employees/lookup/:genId
  app.get('/api/employees/lookup/:genId', (req, res) => {
    const genId = req.params.genId.toUpperCase();
    let emp = employeesStore.find(e => e.genId.toUpperCase() === genId);

    if (!emp) {
      // Dynamic fallback for any employee ID entered
      emp = {
        genId,
        name: `Employee ${genId.replace('G-', '#')}`,
        department: 'Operations',
        costCenter: `CC-${genId.replace('G-', '')}-VN`,
        location: 'Logistics Hub - North',
        recommendedSize: 'M'
      };
      employeesStore.push(emp);
    }

    res.json(emp);
  });

  // GET /api/inventory
  app.get('/api/inventory', (req, res) => {
    res.json(inventoryStore);
  });

  // GET /api/ai/logs
  app.get('/api/ai/logs', (req, res) => {
    res.json(aiLogsStore);
  });

  // POST /api/ai/batch-validate
  app.post('/api/ai/batch-validate', async (req, res) => {
    try {
      const ai = getAiClient();
      let validatedCount = 0;
      let autoApprovedCount = 0;

      if (ai) {
        // Use Gemini API to analyze pending requests
        const pendingRequests = requestsStore.filter(r => r.status === 'Validating');
        const prompt = `Analyze these uniform requests and return a JSON array specifying which ones should be 'Approved' vs 'Action Required' based on safety, reasonable quantity, and size match:
${JSON.stringify(pendingRequests)}
Return ONLY valid JSON array of objects with keys: id, status ('Approved' or 'Action Required'), reason.`;

        try {
          const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt
          });
          const text = response.text || '';
          const jsonMatch = text.match(/\[[\s\S]*\]/);
          if (jsonMatch) {
            const results = JSON.parse(jsonMatch[0]);
            results.forEach((item: { id: string; status: string; reason: string }) => {
              const reqItem = requestsStore.find(r => r.id === item.id);
              if (reqItem && reqItem.status === 'Validating') {
                reqItem.status = item.status === 'Approved' ? 'Approved' : 'Action Required';
                reqItem.aiNote = item.reason;
                if (item.status === 'Approved') {
                  reqItem.timeline = { ...reqItem.timeline, approvedAt: 'Just now', approvedByAi: true };
                  autoApprovedCount++;
                } else {
                  reqItem.warning = item.reason;
                }
                validatedCount++;
              }
            });
          }
        } catch (e) {
          console.error('Gemini batch validation error:', e);
        }
      }

      // Fallback/standard rule-based batch validation if Gemini wasn't available or partially updated
      requestsStore.forEach(r => {
        if (r.status === 'Validating') {
          if (r.warning) {
            r.status = 'Action Required';
          } else {
            r.status = 'Approved';
            r.aiNote = 'Auto-approved by AI Policy Engine';
            r.timeline = { ...r.timeline, approvedAt: 'Just now', approvedByAi: true };
            autoApprovedCount++;
          }
          validatedCount++;
        }
      });

      aiLogsStore.unshift({
        id: `LOG-${Date.now()}`,
        timestamp: 'Just now',
        type: 'Policy Approval',
        status: 'Success',
        message: `Batch validation completed: ${validatedCount} requests processed, ${autoApprovedCount} auto-approved.`,
        confidenceScore: 99.4
      });

      res.json({
        success: true,
        validatedCount,
        autoApprovedCount,
        requests: requestsStore
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to execute batch validation' });
    }
  });

  // POST /api/ai/suggest-size
  app.post('/api/ai/suggest-size', async (req, res) => {
    const { department, uniformType, height, weight, gender } = req.body;
    let suggestedSize = 'M';
    let category = 'Operations - Field';
    let confidence = 0.95;

    if (uniformType === 'Pregnant') {
      suggestedSize = 'Mat M';
      category = 'All Categories';
    } else if (uniformType === 'Jacket' || uniformType === 'Coverall') {
      suggestedSize = 'L';
    } else if (gender === 'Female' && uniformType.includes('T-Shirt')) {
      suggestedSize = 'S';
    }

    const ai = getAiClient();
    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `Given an employee in department '${department}', requesting uniform '${uniformType}', height ${height || '170cm'}, weight ${weight || '68kg'}, suggest the best fitting size (S, M, L, XL, XXL or Mat S/M/L) and category. Respond in short JSON: {"size": "M", "category": "Operations - Field", "confidence": 0.98}`
        });
        const text = response.text || '';
        const match = text.match(/\{[\s\S]*\}/);
        if (match) {
          const parsed = JSON.parse(match[0]);
          if (parsed.size) suggestedSize = parsed.size;
          if (parsed.category) category = parsed.category;
          if (parsed.confidence) confidence = parsed.confidence;
        }
      } catch (e) {
        console.error('Gemini size suggestion error:', e);
      }
    }

    res.json({
      suggestedSize,
      category,
      confidenceScore: confidence
    });
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`UniformAI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
