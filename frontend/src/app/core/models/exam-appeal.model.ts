export interface ExamAppeal {
  id: string;
  userId: string;
  title: string;
  status: 'processing' | 'completed' | 'failed';
  createdAt: Date;
  updatedAt: Date;
  feedback?: string;
  subject?: string;
  course?: string;
  examName: string;
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