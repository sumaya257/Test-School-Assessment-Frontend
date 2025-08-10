import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
}

const initialState: AuthState = {
  token: null,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
    },
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
    clearToken(state) {
      state.token = null;
      state.user = null;
    },
  },
});

export const { setToken, setUser, clearToken } = authSlice.actions;
export default authSlice.reducer;
