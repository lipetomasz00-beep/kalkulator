import { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Sparkles, Loader2, Send } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface GeminiInsightProps {
  context: string;
  data: any;
}

export default function GeminiInsight({ context, data }: GeminiInsightProps) {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generateInsight = async () => {
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `As a professional financial advisor, analyze these ${context} numbers and provide 3-4 concise, actionable insights or warnings. 
        Data: ${JSON.stringify(data)}
        Keep the tone professional, encouraging, and clear. Use markdown for formatting.`,
      });
      setInsight(response.text || "Could not generate insight at this time.");
    } catch (error) {
      console.error("Gemini Error:", error);
      setInsight("Error connecting to AI advisor. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-violet-50 p-6 rounded-2xl border border-indigo-100 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-600" />
          <h3 className="font-semibold text-indigo-900">AI Financial Advisor</h3>
        </div>
        {!insight && !loading && (
          <button 
            onClick={generateInsight}
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            Analyze My Numbers
          </button>
        )}
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-8 space-y-3">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          <p className="text-sm text-indigo-600 font-medium">Analyzing your financial data...</p>
        </div>
      )}

      {insight && (
        <div className="prose prose-indigo prose-sm max-w-none">
          <ReactMarkdown>{insight}</ReactMarkdown>
          <button 
            onClick={() => setInsight(null)}
            className="mt-4 text-xs text-indigo-600 font-semibold hover:underline"
          >
            Clear Analysis
          </button>
        </div>
      )}
    </div>
  );
}
