
export enum AccessMode {
  EMERGENCY = 'EMERGENCY',
  STANDARD = 'STANDARD',
  INCOGNITO = 'INCOGNITO'
}

export interface MedicalRecord {
  id: string;
  date: string;
  type: 'Blood Test' | 'X-Ray' | 'Prescription' | 'Consultation' | 'MRI' | 'Vaccination';
  facility: string;
  doctor: string;
  summary?: string;
  insights?: string[];
  fileUrl?: string;
  isDuplicate?: boolean;
}

export interface ConsentGrant {
  id: string;
  doctorName: string;
  specialization: string;
  facility: string;
  expiryDate: string;
  mode: AccessMode;
  status: 'Active' | 'Revoked' | 'Expired';
}

export interface AccessLog {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  purpose: string;
}

export interface PatientProfile {
  id: string;
  name: string;
  age: number;
  bloodGroup: string;
  allergies: string[];
  chronicConditions: string[];
}
