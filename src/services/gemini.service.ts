
import { Injectable } from '@angular/core';
import { GoogleGenAI, Type } from '@google/genai';

export interface LoanOffer {
  bankName: string;
  offerName: string;
  apr: number;
  commission: number;
  monthlyPayment: number;
}

@Injectable({
  providedIn: 'root',
})
export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    // IMPORTANT: The API key is sourced from environment variables for security.
    // Do not hardcode API keys in production applications.
    if (!process.env.API_KEY) {
      throw new Error("API_KEY environment variable not set.");
    }
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async generateLoanOffers(amount: number, termInMonths: number): Promise<LoanOffer[]> {
    const prompt = `Proszę wygeneruj 3 fikcyjne, unikalne oferty kredytu gotówkowego w Polsce na kwotę ${amount} PLN na okres ${termInMonths} miesięcy. Zwróć uwagę na realistyczne dane. Uwzględnij różne banki, nazwy ofert, RRSO (Rzeczywista Roczna Stopa Oprocentowania), prowizję i wyliczoną miesięczną ratę. Format odpowiedzi musi być JSON.`;

    const responseSchema = {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          bankName: { type: Type.STRING, description: 'Nazwa banku (np. "Bank Innowacji", "Cyber Bank")' },
          offerName: { type: Type.STRING, description: 'Chwytliwa nazwa oferty (np. "Kredyt na start", "Zielona Pożyczka")' },
          apr: { type: Type.NUMBER, description: 'Rzeczywista Roczna Stopa Oprocentowania (RRSO), np. 10.5' },
          commission: { type: Type.NUMBER, description: 'Prowizja za udzielenie kredytu w procentach, np. 2.0' },
          monthlyPayment: { type: Type.NUMBER, description: 'Obliczona dokładna miesięczna rata kredytu' },
        },
        required: ["bankName", "offerName", "apr", "commission", "monthlyPayment"]
      }
    };

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: responseSchema,
          temperature: 0.8, // for creative but plausible offers
        }
      });
      
      const responseText = response.text.trim();
      
      // Basic validation if the response is a parsable JSON array
      if (!responseText.startsWith('[') || !responseText.endsWith(']')) {
          throw new Error('Invalid JSON array format received from API.');
      }

      const offers = JSON.parse(responseText);
      
      if (!Array.isArray(offers)) {
        throw new Error('API did not return an array of offers.');
      }

      return offers as LoanOffer[];
    } catch (error) {
      console.error('Error fetching or parsing loan offers from Gemini API:', error);
      throw new Error('Failed to generate loan offers.');
    }
  }
}
