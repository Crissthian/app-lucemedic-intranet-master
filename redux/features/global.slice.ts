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
      state.isLoading = !state.isLoading
    },
    toggleWelcome: (state) => {
      state.showWelcome = !state.showWelcome
    }
  }
})

export const { toggleLoading, toggleWelcome } = global.actions
export default global.reducer
