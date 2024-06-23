import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import AuthApiClient from '../../../utils/http-client/AuthApiClient'
import {IRegisterParams, IRegisterResponse} from "../../types/auth"
import { IState } from '../../types/global'

const authApiClient: AuthApiClient = AuthApiClient.getInstance()

export const fetchRegister = createAsyncThunk('auth/fetchRegister',
                                        async (params: IRegisterParams, { rejectWithValue }) => {
    try {
        const { data } = await authApiClient.register(params)
        return data
    } catch (error: any) {
        if (!error.response) {
            throw error
        }

        return rejectWithValue(error)
    }
})

const initialState: IState<IRegisterResponse> = {
    isLoading: false,
    response: null,
    error: null
}

const authRegisterSlice = createSlice({
    name: 'auth/register',
    initialState,
    reducers: {
        reset: () => initialState
    },
    extraReducers: builder => {
        builder.addCase(fetchRegister.pending, state => {
            state.isLoading = true
            state.response = null
            state.error = null
        })

        builder.addCase(fetchRegister.fulfilled, (state, action: PayloadAction<IRegisterResponse>) => {
            state.isLoading = false
            state.response = action.payload
            state.error = null
        })

        builder.addCase(fetchRegister.rejected, (state, action) => {
            state.isLoading = false
            state.response = null
            state.error = action.payload
        })
    }
})

export default authRegisterSlice.reducer
export const {
    reset
} = authRegisterSlice.actions