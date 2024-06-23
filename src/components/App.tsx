import React, {useEffect, useState} from 'react'
import {Link, NavigateFunction, useNavigate} from "react-router-dom"
import {useAppDispatch, useAppSelector} from "../store"
import {IState} from '../store/types/global'
import {Role, User} from '../store/types/user'
import {resetMe} from "../store/features/auth/meSlice"
import {logout} from "../store/features/auth/loginSlice"

function App(): React.JSX.Element {
    const dispatch = useAppDispatch()
    const navigate: NavigateFunction = useNavigate()
    const me: IState<User> = useAppSelector(state => state.me)
    const [isAuthorized, setIsAuthorized] = useState<boolean>(false)
    const [error, setError] = useState<string>("")

    useEffect((): void => {
        setError("")
        if (me.response) {
            setIsAuthorized(me.response.roles.some((e: Role): boolean => e.name === 'ADMIN'))
            return
        }
        if (me.error !== null) {
            setError(me.error.response?.data?.exception)
        }
    }, [me, dispatch])

    return <>
        {me.response === null
            ?
            <>
                <Link to='/auth/login'>
                    <button>Giriş Yap</button>
                </Link>
                <Link to='/auth/register'>
                    <button>Kayıt Ol</button>
                </Link>
                <hr/>
            </>
            :
            <>
                {
                    isAuthorized && <>
                        <Link to={`/admin/`}>
                            <button>Admin</button>
                        </Link>
                        Hoşgeldin, {me.response.email}
                    </>
                }
                <button onClick={(): void => {
                    dispatch(logout())
                    dispatch(resetMe())
                }}>Çıkış
                </button>
                {(error !== null && error !== "") && <p>{JSON.stringify(error)}</p>}
                <hr/>
            </>
        }
    </>
}

export default App