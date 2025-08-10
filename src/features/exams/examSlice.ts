import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface Answer {
  questionId: string;
  optionId: number | null;
}

interface ExamState {
  examId: string | null;
  step: number;
  timer: number;
  answers: Answer[];
}

const initialState: ExamState = {
  examId: null,
  step: 1,
  timer: 0,
  answers: [],
};

const examSlice = createSlice({
  name: 'exam',
  initialState,
  reducers: {
    setExam(state, action: PayloadAction<{ examId: string; step: number; timer: number; answers: Answer[] }>) {
      state.examId = action.payload.examId;
      state.step = action.payload.step;
      state.timer = action.payload.timer;
      state.answers = action.payload.answers;
    },
    setTimer(state, action: PayloadAction<number>) {
      state.timer = action.payload;
    },
    setAnswer(state, action: PayloadAction<Answer>) {
      const index = state.answers.findIndex(a => a.questionId === action.payload.questionId);
      if (index !== -1) {
        state.answers[index] = action.payload;
      } else {
        state.answers.push(action.payload);
      }
    },
    clearExam(state) {
      state.examId = null;
      state.timer = 0;
      state.answers = [];
      state.step = 1;
    },
    setStep(state, action: PayloadAction<number>) {
      state.step = action.payload;
    }
  }
});

export const { setExam, setTimer, setAnswer, clearExam, setStep } = examSlice.actions;
export default examSlice.reducer;
