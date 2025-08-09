import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../../app/store';

interface QuestionOption {
  id: number;
  text: string;
}

interface Question {
  id: string;
  competencyCode: string;
  level: string;
  stem: string;
  options: QuestionOption[];
}

interface StartExamResponse {
  examId: string;
  questions: Question[];
  durationSeconds: number;
}

interface SubmitAnswer {
  questionId: string;
  optionId: number;
}

interface SubmitExamResponse {
  score: number;
  total: number;
  percentage: number;
  result: string;
  certifiedLevel: string;
}

export const examsApi = createApi({
  reducerPath: 'examsApi',
  baseQuery: fetchBaseQuery({
    baseUrl:import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) headers.set('authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    startExam: builder.mutation<StartExamResponse, { step: number }>({
      query: (body) => ({
        url: 'exams/start',
        method: 'POST',
        body,
      }),
    }),
    submitExam: builder.mutation<SubmitExamResponse, { examId: string; answers: SubmitAnswer[] }>({
      query: ({ examId, answers }) => ({
        url: `exams/${examId}/submit`,
        method: 'POST',
        body: { answers },
      }),
    }),
  }),
});

export const { useStartExamMutation, useSubmitExamMutation } = examsApi;
