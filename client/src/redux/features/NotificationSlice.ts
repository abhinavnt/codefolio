import axiosInstance from "@/utils/axiosInstance";
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

export type Notification = {
  id: string;
  message: string;
  timestamp: string;
  read: boolean;
};

interface NotificationsState {
  items: Notification[];
  loading: boolean;
  error: string | null;
}

const initialState: NotificationsState = {
  items: [],
  loading: false,
  error: null,
};

// Thunks for async operations
export const fetchNotifications = createAsyncThunk(
  "notifications/fetch",
  async () => {
    console.log('hello from fetchNotifications');
    
    const response = await axiosInstance.get("/api/user/notifications");
    console.log(response,"response from notification fetching");
    
    return response.data.notifications.map((n: any) => ({
      id: n._id,
      message: n.message,
      timestamp: n.createdAt,
      read: false, 
    }));
  }
);



const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    markAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.items.find((item) => item.id === action.payload);
      if (notification) notification.read = true;
    },
    markAllAsRead: (state) => {
      state.items.forEach((notification) => {
        notification.read = true;
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch notifications";
      })
     
  },
});

export const { markAsRead, markAllAsRead } = notificationsSlice.actions;
export default notificationsSlice.reducer;