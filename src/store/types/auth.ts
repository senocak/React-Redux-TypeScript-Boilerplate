import {User} from "./user"

export interface IRegisterParams {
    name: string
    email: string
    password: string
}

export interface ILoginParams {
    email: string
    password: string
}

export interface ILoginResponse {
    access_token: string
    user: User
}

export interface IRegisterResponse {
    message: string
}