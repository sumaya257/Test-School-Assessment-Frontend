import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import examReducer from '../features/exams/examSlice';
import { authApi } from '../features/auth/authApi';
import { examsApi } from '../features/exams/examApi';

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';

import storage from 'redux-persist/lib/storage'; // localStorage

// persist config for auth slice
const persistConfig = {
  key: 'auth',
  version: 1,
  storage,
  whitelist: ['token', 'user'], // auth slice এর token আর user persist হবে
};

// exam persist config
const persistExamConfig = {
  key: 'exam',
  version: 1,
  storage,
  whitelist: ['examId', 'step', 'timer', 'answers'], 
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);
const persistedExamReducer = persistReducer(persistExamConfig, examReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    exam: persistedExamReducer,  
    [authApi.reducerPath]: authApi.reducer,
    [examsApi.reducerPath]: examsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(authApi.middleware, examsApi.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
