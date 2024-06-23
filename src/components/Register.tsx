import React, {useEffect, useState} from 'react'
import App from "./App"
import { useAppDispatch, useAppSelector } from '../store'
import {IState} from "../store/types/global"
import {IRegisterResponse} from "../store/types/auth"
import {fetchRegister} from "../store/features/auth/registerSlice"

function Login(): React.JSX.Element {
    const dispatch = useAppDispatch()
    const registerSlice: IState<IRegisterResponse> = useAppSelector(state => state.register)
    const [email, setEmail] = useState<string>("anil2@senocak.com")
    const [name, setName] = useState<string>("Anıl")
    const [password, setPassword] = useState<string>("louie.Stehr1")

    useEffect((): void => {
        if (!registerSlice.isLoading && registerSlice.response !== null) {
            console.log(registerSlice.response)
        }
    }, [registerSlice, dispatch])
    return <>
        <App/>
        <input type="text" placeholder="isim" required autoFocus disabled={registerSlice.isLoading} value={name}
               onChange={(event: React.ChangeEvent<HTMLInputElement>): void => setName(event.target.value)}/>
        <input type="text" placeholder="Email" required autoFocus disabled={registerSlice.isLoading} value={email}
               onChange={(event: React.ChangeEvent<HTMLInputElement>): void => setEmail(event.target.value)}/>
        <input type="password" placeholder="***" required disabled={registerSlice.isLoading} value={password}
               onChange={(event: React.ChangeEvent<HTMLInputElement>): void => setPassword(event.target.value)}/>
        <button disabled={registerSlice.isLoading} onClick={(): void => {
            dispatch(fetchRegister({name: name, email: email, password: password}))
        }}>Gönder</button>
        {registerSlice.isLoading && <p>Bekleyin...</p>}
        {registerSlice.error !== null &&
            <>
                <div style={{color: "red"}}>Hata:</div>{JSON.stringify(registerSlice.error.response?.data?.exception)}
            </>
        }
        {registerSlice.response !== null &&
            <>
                <div style={{color: "green"}}>Response:</div>{JSON.stringify(registerSlice.response)}
            </>
        }

    </>
}
export default Login