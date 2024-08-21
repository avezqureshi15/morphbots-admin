import { configureStore } from '@reduxjs/toolkit';
import authSlice from '../slices/authSlice';
import adminSlice from '../slices/adminSlice';
import curriculumSlice from '../slices/curriculumSlice';
import deviceSlice from '../slices/deviceSlice';
import configurationSlice from '../slices/configurationSlice';
import slotsSlice from '../slices/slotsSlice';

const store = configureStore({
    reducer: {
        auth: authSlice,
        admin: adminSlice,
        curriculum: curriculumSlice,
        device: deviceSlice,
        configuration: configurationSlice,
        slot: slotsSlice
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
