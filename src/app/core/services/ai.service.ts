import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import OpenAI from 'openai';

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: environment.openai.apiKey
    });
  }

  async generateAppeal(extractedText: string): Promise<string> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an expert in academic appeals. Your task is to analyze exam feedback and generate a well-structured, professional appeal letter. Focus on identifying legitimate grounds for appeal and presenting them in a clear, respectful manner."
          },
          {
            role: "user",
            content: `Please analyze this exam feedback and generate an appeal letter: ${extractedText}`
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      });

      return completion.choices[0].message.content || 'Failed to generate appeal';
    } catch (error) {
      console.error('AI Service Error:', error);
      throw new Error('Failed to generate appeal response');
    }
  }
} 