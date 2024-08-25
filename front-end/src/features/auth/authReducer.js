import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
    name: 'auth',
    initialState: { token: null, persist: localStorage.getItem("persist") !== "undefined" ? JSON.parse(localStorage.getItem("persist")) : false },
    reducers: {
        setAuth: (state, action) => {
            const { token } = action.payload;
            state.token = token;
        },
        setPersist: (state, action) => {
            const { persist } = action.payload;
            state.persist = persist;
            localStorage.setItem("persist", JSON.stringify(persist));
        },
        logOut: (state, action) => {
            state.token = null;
            state.persist = false;
            localStorage.removeItem("persist");
        },
    }
})

export const { setAuth, setPersist, logOut } = authSlice.actions

export default authSlice.reducer

export const selectCurrentToken = (state) => state.auth.token

export const isPersist = (state) => state.auth.persist