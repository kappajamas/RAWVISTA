import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiRegister, apiLogin, apiMe, apiLogout } from "../libs/api";

export const STATUS = Object.freeze({
  idle: "Inactiv",
  loading: "Se incarca...",
  success: "Succes!",
  error: "Eroare",
});

const initialState = { user: null, status: STATUS.idle, error: null };

export const RegisterUser = createAsyncThunk("auth/register", async (data) => {
  await apiRegister(data);
  await apiLogin(data.email, data.password);
  return await apiMe();
});

export const LoginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password }) => {
    await apiLogin(email, password);
    return await apiMe();
  }
);

export const getMe = createAsyncThunk("auth/me", async () => {
  return await apiMe();
});

export const LogOut = createAsyncThunk("auth/logout", async () => {
  await apiLogout();
  return null;
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(RegisterUser.pending, (state) => {
        state.status = STATUS.loading;
        state.error = null;
      })
      .addCase(RegisterUser.fulfilled, (state, action) => {
        state.status = STATUS.success;
        state.user = action.payload;
      })
      .addCase(RegisterUser.rejected, (state, action) => {
        state.status = STATUS.error;
        state.error = action.error?.message;
      })
      .addCase(LoginUser.pending, (state) => {
        state.status = STATUS.loading;
        state.error = null;
      })
      .addCase(LoginUser.fulfilled, (state, action) => {
        state.status = STATUS.success;
        state.user = action.payload;
      })
      .addCase(LoginUser.rejected, (state, action) => {
        state.status = STATUS.error;
        state.error = action.error?.message;
      })
      .addCase(getMe.pending, (state) => {
        state.status = STATUS.loading;
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.status = STATUS.success;
        state.user = action.payload;
      })
      .addCase(getMe.rejected, (state) => {
        state.status = STATUS.error;
        state.user = null;
      })
      .addCase(LogOut.fulfilled, (state) => {
        state.user = null;
        state.status = STATUS.idle;
      });
  },
});

export default authSlice.reducer;
