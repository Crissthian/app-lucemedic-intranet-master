import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type CurrentUser = {
  firstName: string
  lastName: string
  dni: string
  email: string
  profile: number
  ruc: number
  empresa: string
  photoUrl?: string
}

type InitialState = {
  currentUser: CurrentUser
}

const initialState = {
  currentUser: {
    firstName: '',
    lastName: '',
    dni: '',
    email: '',
    profile: 0,
    ruc: 0,
    empresa: '',
    photoUrl: ''
  } as CurrentUser
} as InitialState

export const auth = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: () => {
      return initialState
    },
    login: (state, action: PayloadAction<CurrentUser>) => {
      return {
        ...state,
        currentUser: action.payload
      }
    }
  }
})

export const { login, logout } = auth.actions
export default auth.reducer