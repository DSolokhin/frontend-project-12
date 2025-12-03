import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  type: null,
  id: null,
}

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: (state, { payload }) => ({
      type: payload.type,
      id: payload.id ?? null,
    }),

    closeModal: () => ({
      type: null,
      id: null,
    }),
  },
})

export const { openModal, closeModal } = modalSlice.actions

export default modalSlice.reducer
