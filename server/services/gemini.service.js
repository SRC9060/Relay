import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load root .env (d:\Relay\.env) and server .env (d:\Relay\server\.env)
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

/**
 * GeminiService
 * Official Google Gemini API client with graceful deterministic demonstration fallback.
 * Operates server-side only; API credentials are never exposed to the client.
 */
class GeminiService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY || process.env.LLM_API_KEY || '';
    this.model = process.env.GEMINI_MODEL || process.env.LLM_MODEL || 'gemini-3.5-flash-lite';
    this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models';
    this.mockMode = false;
    this.mockResponse = null;
  }

  getApiKey() {
    let key = process.env.GEMINI_API_KEY || process.env.LLM_API_KEY || this.apiKey;
    if (!key || !key.trim()) {
      try {
        // Check root .env (d:\Relay\.env)
        const rootParsed = dotenv.config({ path: path.resolve(__dirname, '../../.env'), override: true })?.parsed;
        if (rootParsed?.GEMINI_API_KEY && rootParsed.GEMINI_API_KEY.trim()) {
          process.env.GEMINI_API_KEY = rootParsed.GEMINI_API_KEY.trim();
          return rootParsed.GEMINI_API_KEY.trim();
        }
        // Check server .env (d:\Relay\server\.env)
        const serverParsed = dotenv.config({ path: path.resolve(__dirname, '../.env'), override: true })?.parsed;
        if (serverParsed?.GEMINI_API_KEY && serverParsed.GEMINI_API_KEY.trim()) {
          process.env.GEMINI_API_KEY = serverParsed.GEMINI_API_KEY.trim();
          return serverParsed.GEMINI_API_KEY.trim();
        }
        key = process.env.GEMINI_API_KEY || process.env.LLM_API_KEY || '';
      } catch {
        // ignore
      }
    }
    return key ? key.trim() : '';
  }

  getModel() {
    return process.env.GEMINI_MODEL || process.env.LLM_MODEL || this.model || 'gemini-3.5-flash-lite';
  }

  isConfigured() {
    const key = this.getApiKey();
    return Boolean(key && key.trim().length > 0);
  }

  setMockResponse(mock) {
    this.mockMode = true;
    this.mockResponse = mock;
  }

  clearMockResponse() {
    this.mockMode = false;
    this.mockResponse = null;
  }

  /**
   * Health and live API verification ping (never exposes secret key)
   */
  async verifyLiveConnection() {
    if (!this.isConfigured()) {
      return { success: false, reason: 'GEMINI_API_KEY not configured' };
    }
    try {
      const apiKey = this.getApiKey();
      const model = this.getModel();
      const url = `${this.baseUrl}/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 25000);

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: 'Return JSON: {"status": "ok"}' }] }],
          generationConfig: { responseMimeType: 'application/json', maxOutputTokens: 50 }
        }),
        signal: controller.signal
      });
      clearTimeout(timeout);

      if (res.ok) {
        this.lastLiveSuccess = true;
        this.lastLiveAt = new Date().toISOString();
        return { success: true, model, timestamp: this.lastLiveAt };
      }

      // If high demand 503 or 404, try 3.5-flash-lite
      if (res.status === 503 || res.status === 404 || res.status === 429) {
        const altUrl = `${this.baseUrl}/gemini-3.5-flash-lite:generateContent?key=${encodeURIComponent(apiKey)}`;
        const altRes = await fetch(altUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: 'Return JSON: {"status": "ok"}' }] }],
            generationConfig: { responseMimeType: 'application/json', maxOutputTokens: 50 }
          })
        });
        if (altRes.ok) {
          this.lastLiveSuccess = true;
          this.lastLiveAt = new Date().toISOString();
          return { success: true, model: 'gemini-3.5-flash-lite', timestamp: this.lastLiveAt, note: `${model} busy, flash-lite verified` };
        }
      }

      return { success: false, status: res.status, model };
    } catch (err) {
      // If primary model timed out or failed, attempt fast verification with gemini-3.5-flash-lite
      try {
        const apiKey = this.getApiKey();
        const altRes = await fetch(`${this.baseUrl}/gemini-3.5-flash-lite:generateContent?key=${encodeURIComponent(apiKey)}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: 'Return JSON: {"status": "ok"}' }] }],
            generationConfig: { responseMimeType: 'application/json', maxOutputTokens: 50 }
          })
        });
        if (altRes.ok) {
          this.lastLiveSuccess = true;
          this.lastLiveAt = new Date().toISOString();
          return { success: true, model: 'gemini-3.5-flash-lite', timestamp: this.lastLiveAt };
        }
      } catch {}
      return { success: false, error: err.message };
    }
  }

  /**
   * Calls Google Gemini REST API or uses deterministic fallback
   */
  async generateJson({ systemInstruction = '', prompt, fallbackFn }) {
    // 1. Mock override for deterministic test verification
    if (this.mockMode && this.mockResponse) {
      return {
        success: true,
        data: typeof this.mockResponse === 'function' ? this.mockResponse(prompt) : this.mockResponse,
        aiSource: 'gemini-mock',
        modelUsed: this.getModel(),
        isConfigured: true
      };
    }

    // 2. Real Gemini API Call if configured
    if (this.isConfigured()) {
      try {
        const apiKey = this.getApiKey();
        const model = this.getModel();
        let actualModelUsed = model;
        const url = `${this.baseUrl}/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 15000);

        const payload = {
          contents: [
            {
              role: 'user',
              parts: [{ text: prompt }]
            }
          ],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.1,
            maxOutputTokens: 2048
          }
        };

        if (systemInstruction) {
          payload.systemInstruction = {
            parts: [{ text: systemInstruction }]
          };
        }

        let res = null;
        try {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 6500);
          res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            signal: controller.signal
          });
          clearTimeout(timeout);
        } catch (primaryErr) {
          console.warn(`[Relay Gemini] Primary model ${model} fetch did not complete (${primaryErr.message}). Switching to alternative flash model...`);
        }

        // If primary model has transient 503/404/429 or timed out, try alternative flash model before dropping to deterministic
        if (!res || !res.ok) {
          const altModel = model === 'gemini-3.8-flash' ? 'gemini-3.5-flash-lite' : 'gemini-3.8-flash';
          console.warn(`[Relay Gemini] Attempting live call with ${altModel}...`);
          try {
            const altController = new AbortController();
            const altTimeout = setTimeout(() => altController.abort(), 12000);
            const altRes = await fetch(`${this.baseUrl}/${altModel}:generateContent?key=${encodeURIComponent(apiKey)}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload),
              signal: altController.signal
            });
            clearTimeout(altTimeout);
            if (altRes.ok) {
              res = altRes;
              actualModelUsed = altModel;
            }
          } catch (altErr) {
            console.warn(`[Relay Gemini] Secondary attempt failed: ${altErr.message}`);
          }
        }

        if (!res.ok) {
          const errText = await res.text();
          console.warn(`[Relay Gemini] API returned ${res.status}. Falling back to deterministic engine. Reason: ${errText.slice(0, 200)}`);
          if (fallbackFn) {
            return {
              success: true,
              data: fallbackFn(),
              aiSource: 'deterministic-fallback',
              modelUsed: 'deterministic-engine',
              isConfigured: true,
              warning: `Live Gemini API returned HTTP ${res.status}. Fallback activated.`
            };
          }
          throw new Error(`Gemini API error: HTTP ${res.status}`);
        }

        const json = await res.json();
        const textContent = json?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!textContent) {
          throw new Error('Gemini API returned empty candidate content');
        }

        const parsed = JSON.parse(textContent);
        this.lastLiveSuccess = true;
        this.lastLiveAt = new Date().toISOString();

        return {
          success: true,
          data: parsed,
          aiSource: 'gemini',
          modelUsed: actualModelUsed,
          isConfigured: true
        };
      } catch (err) {
        console.warn(`[Relay Gemini] Request failed: ${err.message}. Activating deterministic fallback.`);
        if (fallbackFn) {
          return {
            success: true,
            data: fallbackFn(),
            aiSource: 'deterministic-fallback',
            modelUsed: 'deterministic-engine',
            isConfigured: this.isConfigured(),
            warning: `Gemini API request failed (${err.message}). Deterministic fallback returned.`
          };
        }
        throw err;
      }
    }

    // 3. Fallback when GEMINI_API_KEY is not configured
    if (fallbackFn) {
      return {
        success: true,
        data: fallbackFn(),
        aiSource: 'deterministic-fallback',
        modelUsed: 'deterministic-engine',
        isConfigured: false,
        notice: 'GEMINI_API_KEY environment variable is not configured. High-fidelity deterministic demonstration engine used.'
      };
    }

    throw new Error('No GEMINI_API_KEY configured and no fallback provider supplied.');
  }
}

export const geminiService = new GeminiService();
