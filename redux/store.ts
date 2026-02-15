import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useSelector } from 'react-redux'
import globalReducer from './features/global.slice'
import authReducer from './features/auth.slice'
import medicalExamsReducer from './features/medical-exams.slice'

export const store = configureStore({
  reducer: {
    globalReducer,
    authReducer,
    medicalExamsReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
