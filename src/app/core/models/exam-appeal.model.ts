export interface ExamAppeal {
  id: string;
  userId: string;
  examImageUrl: string;
  extractedText: string;
  aiResponse: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: Date;
  updatedAt: Date;
  metadata?: {
    examType?: string;
    courseCode?: string;
    semester?: string;
    year?: number;
  };
}

export interface ExamAppealFormData {
  title: string;
  description: string;
  examImageUrl?: string;
  subject?: string;
  course?: string;
  institution?: string;
  originalScore?: number;
} 