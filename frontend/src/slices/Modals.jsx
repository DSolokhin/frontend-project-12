import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

const channelsAdapter = createEntityAdapter();
const initialState = { show: false, type: 'closed', id: null };

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: (state, { payload }) => ({
      ...state,
      ...payload,
    }),
    closeModal: () => initialState,
  },
});

const { actions } = modalSlice;
const selectors = channelsAdapter.getSelectors((state) => state.modal);
export { actions, selectors };
export default modalSlice.reducer;
