export interface ExamAppeal {
  id: string;
  userId: string;
  title: string;
  description: string;
  examImageUrl?: string;
  appealText: string;
  status: 'processing' | 'completed' | 'failed';
  createdAt: Date;
  updatedAt: Date;
  feedback?: string;
  score?: number;
  originalScore?: number;
  subject?: string;
  course?: string;
  institution?: string;
  examName: string;
  courseCode: string;
  currentGrade: number;
  targetGrade: number;
}

export interface ExamAppealFormData {
  title: string;
  description: string;
  examImageUrl?: string;
  subject?: string;
  course?: string;
  institution?: string;
  originalScore?: number;
  examName?: string;
  courseCode?: string;
  currentGrade?: number;
  targetGrade?: number;
} 