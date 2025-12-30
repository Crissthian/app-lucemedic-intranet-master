import { createSlice } from '@reduxjs/toolkit'

type InitialState = {
  isLoading: boolean
  showWelcome: boolean
}

const initialState = {
  isLoading: false,
  showWelcome: true
} as InitialState

export const global = createSlice({
  name: 'globalSlice',
  initialState,
  reducers: {
    toggleLoading: (state) => {
      return {
        ...state,
        isLoading: !state.isLoading
      }
    },
    toggleWelcome: (state) => {
      return {
        ...state,
        showWelcome: !state.showWelcome
      }
    }
  }
})

export const { toggleLoading, toggleWelcome } = global.actions
export default global.reducer