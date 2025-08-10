import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface QuestionOption {
  id: number;
  text: string;
}

interface Question {
  id: string;
  competencyCode: string;
  competencyName: string;
  level: string;
  stem: string;
  options: QuestionOption[];
}

interface Answer {
  questionId: string;
  optionId: number | null;
}

interface ExamState {
  examId: string | null;
  step: number;
  timer: number;
  answers: Answer[];
  questions: Question[];
}

const loadState = (): ExamState => {
  try {
    const saved = localStorage.getItem('examState');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (err) {
    console.error('Failed to load exam state', err);
  }
  return {
    examId: null,
    step: 1,
    timer: 0,
    answers: [],
    questions: [],
  };
};

const saveState = (state: ExamState) => {
  try {
    localStorage.setItem('examState', JSON.stringify(state));
  } catch (err) {
    console.error('Failed to save exam state', err);
  }
};

const initialState: ExamState = loadState();

const examSlice = createSlice({
  name: 'exam',
  initialState,
  reducers: {
    setExam(
      state,
      action: PayloadAction<{
        examId: string;
        step: number;
        timer: number;
        answers: Answer[];
        questions: Question[];
      }>
    ) {
      state.examId = action.payload.examId;
      state.step = action.payload.step;
      state.timer = action.payload.timer;
      state.answers = action.payload.answers;
      state.questions = action.payload.questions;
      saveState(state);
    },
    setTimer(state, action: PayloadAction<number>) {
      state.timer = action.payload;
      saveState(state);
    },
    setAnswer(state, action: PayloadAction<Answer>) {
      const index = state.answers.findIndex(
        (a) => a.questionId === action.payload.questionId
      );
      if (index !== -1) {
        state.answers[index] = action.payload;
      } else {
        state.answers.push(action.payload);
      }
      saveState(state);
    },
    clearExam(state) {
      state.examId = null;
      state.timer = 0;
      state.answers = [];
      state.questions = [];
      state.step = 1;
      localStorage.removeItem('examState');
    },
    setStep(state, action: PayloadAction<number>) {
      state.step = action.payload;
      saveState(state);
    },
  },
});

export const { setExam, setTimer, setAnswer, clearExam, setStep } = examSlice.actions;
export default examSlice.reducer;
