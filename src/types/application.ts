export type ApplicationStage = 
  | 'submitted'
  | 'documents_received'
  | 'department_review'
  | 'decision'
  | 'completed';

export interface TimelineEvent {
  stage: ApplicationStage;
  stageName: string;
  stageName_te: string;
  stageName_hi: string;
  status: 'completed' | 'current' | 'pending';
  timestamp: string;
  description: string;
  description_te: string;
  description_hi: string;
  notes?: string;
}

export interface UploadedDoc {
  docId: string;
  docName: string;
  fileName: string;
  uploadedAt: string;
}

export interface Application {
  id: string; // SV-2026-XXXXXX
  userId?: string; // Linked citizen account ID (e.g. 'citizen-anitha')
  serviceId: string;
  serviceName: string;
  serviceName_te: string;
  serviceName_hi: string;
  department: string;
  category: string;
  citizenName: string;
  age: number;
  gender: string;
  phone: string;
  email?: string;
  state: string;
  district?: string;
  occupation: string;
  annualIncome: number;
  educationLevel?: string;
  status: ApplicationStage;
  submittedAt: string;
  currentStage: string;
  uploadedDocuments: UploadedDoc[];
  timeline: TimelineEvent[];
  adminNotes?: string[];
  citizenNotification?: string;
  citizenNotification_te?: string;
  citizenNotification_hi?: string;
  department_te?: string;
  department_hi?: string;
}
