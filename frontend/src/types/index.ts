// User types
export interface User {
  id: string;
  email: string;
  name?: string;
  created_at: string;
}

// Lesson types
export interface Lesson {
  id: string;
  title: string;
  content: string;
}

// DNA data types
export interface DNAData {
  encoded?: string;
  decoded?: string;
}

// Neuro metrics types
export interface NeuroMetrics {
  attention: number;
  focus: number;
  engagement: number;
}

// BCI data types
export interface BCIData {
  status: string;
  data: any;
}

// API error types
export interface ApiError {
  message: string;
  code?: string;
}

// Auth response types
export interface AuthResponse {
  user: User;
  message: string;
}

// Form validation types
export interface ValidationError {
  field: string;
  message: string;
}
