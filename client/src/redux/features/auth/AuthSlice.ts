import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { User } from '@/types/user';



export interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    error: string | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    accessToken: string | null;
  }

  const apiUrl = (import.meta as unknown as ImportMeta).env
  .VITE_API_URL as string;


  export const refreshAuthToken=createAsyncThunk('auth/refresh-token',async(_, { rejectWithValue })=>{
    try {
        const response=await axios.post(`$${apiUrl}/api/auth/refresh-token`,null,{ withCredentials: true })
        return response.data
    } catch {
        return rejectWithValue('Failed to refresh token');
    }
  })



  export const logoutUser=createAsyncThunk('auth/logoutUser',async(_,{ rejectWithValue })=>{
    try {
        await axios.post(`${apiUrl}/api/auth/logout`,null,{ withCredentials: true})
    } catch (error) {
        console.error('Failed to log out:', error);
        return rejectWithValue('Failed to log out');
    }
  })   



  const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    accessToken: null,
    error: null,
    status: 'idle',
  };

  



  const authSlice=createSlice({
    name:'auth',
    initialState,
    reducers:{
        setCredentials:(state,action)=>{
            state.status='succeeded';
            state.user=action.payload.user
            state.accessToken=action.payload.accessToken
            state.isAuthenticated=true
            localStorage.setItem('sessionActive','true')
            console.log('locaal storagil vechitundd')
        },
        updateUser: (state, action:PayloadAction<{user:any}>) =>{
            state.user = action.payload.user
          },
        clearUser: state => {
            console.log('clearing user');
            localStorage.removeItem('sessionActive');
            localStorage.removeItem('isAuthenticated')
            state.isAuthenticated = false;
            state.user = null;
            state.accessToken = null;
          }
    }    
  })



  export const { setCredentials, clearUser,updateUser } = authSlice.actions;
export default authSlice.reducer;