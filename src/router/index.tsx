import React, {useState, useLayoutEffect, useEffect} from 'react'
import {Router, Route, Routes, Navigate} from 'react-router-dom'
import {useAppDispatch, useAppSelector} from '../store'
import {history} from '../utils/history'
import {fetchMe} from "../store/features/auth/meSlice"
import {Role, User} from '../store/types/user'
import {IState} from "../store/types/global"
import Login from "../components/Login"
import Forbidden from "../components/Forbidden"
import NotFound from "../components/NotFound"
import Register from "../components/Register"
import AdminIndex from '../components/AdminIndex'

export type RouteItemType = {
    path: string
    component?: React.ComponentType<any>
    authRequired?: boolean
    routes?: Array<RouteItemType>
    role?: Role[]
}

export const routes: Array<RouteItemType> = [
    {
        path: '/',
        component: AdminIndex,
        authRequired: false,
    },
    {
        path: '/auth',
        authRequired: false,
        component: Login,
        routes: [
            {
                path: '/login',
                component: Login
            },
            {
                path: '/register',
                component: Register
            }
        ]
    },
    {
        path: '/admin',
        authRequired: true,
        component: AdminIndex,
        role: [
            {name: 'ADMIN'}
        ],
        routes: [
            {
                path: '/',
                component: AdminIndex,
                authRequired: false, // FIXME: this should work
            }
        ]
    },
    {
        path: '/forbidden',
        component: Forbidden
    },
    {
        path: '*',
        component: NotFound
    }
]

/**
 * Converts the router tree to a flat list.
 * @param routes
 */
export const getFlatRoutes = (routes: Array<RouteItemType>) => {
    let _routes: Array<RouteItemType> = []
    const worker = (items: Array<RouteItemType>, path?: string, authRequired?: boolean, role?: Role[]): void => {
        if (items.length > 0) {
            items.forEach((item: RouteItemType): void => {
                const nestedPath: string = ((path ? path : '') + item.path).replace(/\/\/+/g, '/')

                if (item.component !== undefined) {
                    _routes.push({
                        path: nestedPath,
                        component: item.component,
                        authRequired: item.authRequired ? item.authRequired : authRequired,
                        role: item.role ? item.role : role
                    })
                }
                if (item.routes !== undefined && item.routes.length > 0) {
                    worker(
                        item.routes,
                        nestedPath,
                        item.authRequired,
                        item.role ? item.role : role
                    )
                }
            })
        }
    }
    worker(routes)
    return _routes
}

/**
 * AppRouter component.
 * @constructor
 */
export const AppRouter = () => {
    const dispatch = useAppDispatch()
    const [state, setState] = useState({action: history.action, location: history.location})
    const [routeItems, setRouteItems] = useState<Array<RouteItemType>>([])
    const me: IState<User> = useAppSelector(state => state.me)

    useLayoutEffect(() => history.listen(setState), [])
    useEffect((): void => {
        if (me.response === null) {
            dispatch(fetchMe())
        }
    }, [me.response, dispatch])
    useEffect((): void => {
        setRouteItems(getFlatRoutes(routes))
    }, [me.response])
    useLayoutEffect(() => history.listen(setState), [])
    return (
        <>
            {
                (routeItems.length > 0 && !me.isLoading) &&
                <Router navigator={history} location={state.location} navigationType={state.action}>
                    <Routes>
                        {
                            routeItems.map((route: RouteItemType, key: number): null | React.JSX.Element => {
                                if (route.component === undefined)
                                    return null
                                if (route.authRequired !== undefined) {
                                    const isAuthenticated: boolean = me.response !== null
                                    const isAuthorized: boolean = isAuthenticated &&
                                        route.role !== undefined &&
                                        route.role.some((allowedRole: Role) => me.response!!.roles.some((role: Role): boolean => role.name === allowedRole.name))
                                    if (route.authRequired) {
                                        if (isAuthenticated && isAuthorized) {
                                            console.log("It means route has specific role")
                                            return <Route path={route.path} element={<route.component/>} key={key}/>
                                        }
                                        if (isAuthenticated && route.role === undefined) {
                                            console.log("It means route does not have specific role")
                                            return <Route path={route.path} element={<route.component/>} key={key}/>
                                        }
                                        if (isAuthenticated && !isAuthorized) {
                                            console.log("It means route should be authorized")
                                            return <Route path={route.path}
                                                          element={<Navigate to={{pathname: '/forbidden'}}/>}
                                                          key={key}/>
                                        }
                                        console.log("It means route should be authenticated")
                                        return <Route path={route.path}
                                                      element={<Navigate to={{pathname: '/auth/login'}}/>}
                                                      key={key}/>
                                    }

                                    if (!isAuthenticated)
                                        return <Route path={route.path} element={<route.component/>} key={key}/>
                                    //if (route.path == "/auth/change-password/:token")
                                    //    console.log(route)
                                    //return <Route path={route.path} element={ <Navigate to={{pathname: '/'}}/> } key={ key }/>
                                }
                                return <Route path={route.path} element={<route.component/>} key={key}/>
                            })
                        }
                    </Routes>
                </Router>
            }
        </>
    )
}
export default AppRouter