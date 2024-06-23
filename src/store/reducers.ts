import {combineReducers} from '@reduxjs/toolkit'
import meSlice from "./features/auth/meSlice"
import loginSlice from "./features/auth/loginSlice"
import registerSlice from "./features/auth/registerSlice"
import moviesSlice from "./features/auth/moviesSlice"

export default combineReducers({
    me: meSlice,
    login: loginSlice,
    register: registerSlice,
    moviesSlice: moviesSlice
})