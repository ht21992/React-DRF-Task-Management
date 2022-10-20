import { configureStore } from '@reduxjs/toolkit';
import authSlice from '../slices/authSlice';
import taskSlice from '../slices/taskSlice';
import logSlice from '../slices/logSlice';
// import commnetSlice from '../slices/commentSlice';
import commentSlice from '../slices/commentSlice';
export const store = configureStore({
  reducer: {
    task: taskSlice,
    auth: authSlice,
    log: logSlice,
    comment:commentSlice


  },
});

export default store