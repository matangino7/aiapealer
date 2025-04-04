import { Injectable } from '@angular/core';
import { createWorker } from 'tesseract.js';

@Injectable({
  providedIn: 'root'
})
export class OcrService {
  private worker: Tesseract.Worker | null = null;

  constructor() {
    this.initializeWorker();
  }

  private async initializeWorker(): Promise<void> {
    this.worker = await createWorker('eng');
  }

  async extractText(imageUrl: string): Promise<string> {
    if (!this.worker) {
      await this.initializeWorker();
    }

    try {
      const { data: { text } } = await this.worker!.recognize(imageUrl);
      return text;
    } catch (error) {
      console.error('OCR Error:', error);
      throw new Error('Failed to extract text from image');
    }
  }

  async cleanup(): Promise<void> {
    if (this.worker) {
      await this.worker.terminate();
      this.worker = null;
    }
  }
} 