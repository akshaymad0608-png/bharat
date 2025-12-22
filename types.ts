
import React from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isPremium: boolean;
}

export interface FileItem {
  id: string;
  file: File;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  progress: number;
  aiData?: { summary?: string; smartName?: string };
  error?: string;
}

export interface ConversionType {
  id: string;
  name: string;
  icon: React.ReactNode;
  category: 'Document' | 'Image' | 'Media' | 'Archive';
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface PricePlan {
  name: string;
  price: string;
  period: string;
  features: string[];
  recommended?: boolean;
  cta: string;
}

export interface FileState {
  items: FileItem[];
  status: 'idle' | 'processing' | 'completed' | 'error';
}
