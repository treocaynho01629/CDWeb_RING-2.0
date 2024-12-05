import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
    name: 'auth',
    initialState: { 
        token: null, 
        error: null,
        persist: localStorage.getItem("persist") !== "undefined" 
            ? JSON.parse(localStorage.getItem("persist")) 
            : false 
    },
    reducers: {
        setAuth: (state, action) => {
            const { token } = action.payload;
            state.token = token;
            state.error = null;
        },
        setPersist: (state, action) => {
            const { persist } = action.payload;
            state.persist = persist;
            state.error = null;
            localStorage.setItem("persist", JSON.stringify(persist));
        },
        clearAuth: (state, action) => {
            state.token = null;
            state.persist = false;
            localStorage.removeItem("persist");
        },
        clearError: (state, action) => {
            state.error = null;
        }
    }
})

export const { setAuth, setPersist, clearAuth, clearError } = authSlice.actions

export default authSlice.reducer

export const selectCurrentToken = (state) => state.auth.token

export const selectError = (state) => state.auth.error

export const isPersist = (state) => state.auth.persist