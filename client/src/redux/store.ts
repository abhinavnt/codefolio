import { configureStore } from "@reduxjs/toolkit"
import courseReducer from "./features/CourseSlice"
import filterReducer from "./features/FilterSlice"
import authReducer from "./features/auth/AuthSlice"
import notificationsReduce from "./features/NotificationSlice"
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import mentorReducer from './features/MentorSlice'
import mentorVerifyReducer from './features/auth/MentorVerify'

export const store = configureStore({
  reducer: {
    courses: courseReducer,
    filters: filterReducer,
    auth:authReducer,
    notifications: notificationsReduce,
    mentors:mentorReducer,
    mentor:mentorVerifyReducer
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
