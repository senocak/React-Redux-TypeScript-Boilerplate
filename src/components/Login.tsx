import React, {useEffect, useState} from 'react'
import App from "./App"
import {useAppDispatch, useAppSelector} from '../store'
import {IState} from "../store/types/global"
import {ILoginResponse} from "../store/types/auth"
import {fetchLogin} from '../store/features/auth/loginSlice'
import {NavigateFunction, useNavigate} from 'react-router-dom'
import {fetchMe} from '../store/features/auth/meSlice'

function Login(): React.JSX.Element {
    const dispatch = useAppDispatch()
    const navigate: NavigateFunction = useNavigate()
    const loginSlice: IState<ILoginResponse> = useAppSelector(state => state.login)
    const [email, setEmail] = useState<string>("bruno@email.com")
    const [password, setPassword] = useState<string>("bruno@email.com")
    const [error, setError] = useState<string>("")

    useEffect((): void => {
        if (!loginSlice.isLoading && loginSlice.response !== null) {
            dispatch(fetchMe())
            navigate('/')
            setError("")
            return
        }
        if (loginSlice.error !== null) {
            setError(loginSlice.error.response?.data?.exception)
        }

    }, [loginSlice, dispatch, navigate])

    return <>
        <App/>
        <input type="email" placeholder="Email" required autoFocus disabled={loginSlice.isLoading} value={email}
               onChange={(event: React.ChangeEvent<HTMLInputElement>): void => setEmail(event.target.value)}/>
        <input type="password" placeholder="***" required disabled={loginSlice.isLoading} value={password}
               onChange={(event: React.ChangeEvent<HTMLInputElement>): void => setPassword(event.target.value)}/>
        <button disabled={loginSlice.isLoading} onClick={(): void => {
            dispatch(fetchLogin({email: email, password: password}))
        }}>Gönder
        </button>
        {(error !== null && error !== "") && <div>{JSON.stringify(error)}</div>}
    </>
}

export default Login