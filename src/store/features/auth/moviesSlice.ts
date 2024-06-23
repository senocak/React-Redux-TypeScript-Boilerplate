import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit'
import UserApiClient from '../../../utils/http-client/UserApiClient'
import {Movie} from '../../types/gain'
import {IState} from '../../types/global'

const userApiClient: UserApiClient = UserApiClient.getInstance()

export const fetchMovies = createAsyncThunk('gain/fetchMovies',
    async (body: { _page: number, _limit: number }, {rejectWithValue}) => {
        try {
            const {data} = await userApiClient.movies(body._page, body._limit)
            return data
        } catch (error: any) {
            if (!error.response) {
                console.error("Error occurred while fetching all movies", error)
                throw error
            }
            return rejectWithValue(error)
        }
    })

const initialState: IState<Movie[]> = {
    isLoading: false,
    response: null,
    error: null
}

const gainMoviesSlice = createSlice({
    name: 'gain/movies',
    initialState,
    reducers: {
        resetMovies: () => initialState
    },
    extraReducers: builder => {
        builder.addCase(fetchMovies.pending, state => {
            state.isLoading = true
            state.response = null
            state.error = null
        })

        builder.addCase(fetchMovies.fulfilled, (state, action: PayloadAction<Movie[]>) => {
            state.isLoading = false
            state.response = action.payload
            state.error = null
        })

        builder.addCase(fetchMovies.rejected, (state, action) => {
            state.isLoading = false
            state.response = null
            state.error = action.payload
        })
    }
})

export default gainMoviesSlice.reducer
export const {
    resetMovies
} = gainMoviesSlice.actions