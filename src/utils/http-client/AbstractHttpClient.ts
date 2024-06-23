import axios, {AxiosInstance, AxiosResponse, AxiosError} from 'axios'
import store from '../../store'
import AppStorage from '../storage/LocalStorage'
import history from '../history'

declare module 'axios' {
    /**
     * @interface AxiosResponse
     */
    interface AxiosResponse<T = any> extends Promise<T> {
    }
}

export default abstract class AbstractHttpClient {
    /**
     * @protected instance
     */
    protected readonly instance: AxiosInstance

    /**
     * @param baseURL
     * @protected constructor
     */
    protected constructor(baseURL: string) {
        this.instance = axios.create({
            baseURL: baseURL
        })

        this._initializeResponseInterceptor()
        this._initializeRequestInterceptor()
    }

    /**
     * Initialize response interceptor.
     * @protected _initializeResponseInterceptor
     */
    protected _initializeResponseInterceptor = () => {
        this.instance.interceptors.response.use(this._handleResponse, this._handleError)
    }

    /**
     * Initialize request interceptor.
     * @protected _initializeRequestInterceptor
     * @param isAuthenticated
     */
    protected _initializeRequestInterceptor = (isAuthenticated: boolean = true) => {
        this.instance.interceptors.request.use(async config => {
            config.headers = config.headers ?? {}

            if (isAuthenticated) {
                const token: string | null = AppStorage.getAccessToken()
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`
                }
            }
            return config
        }, error => Promise.reject(error))
    }

    /**
     * Handle response.
     * @protected _handleResponse
     * @param response
     */
    protected _handleResponse = (response: AxiosResponse) => response

    /**
     * Handle error.
     * @protected _handleError
     * @param error
     */
    protected _handleError = (error: AxiosError) => {
        if (!error.response) {
            console.error('Please check your internet connection.')
        }
        return Promise.reject(error)
    }

    /**
     * Remove tokens from storage.
     * @protected _removeTokensFromStorage
     */
    protected _removeTokensFromStorage = async (): Promise<void> => {
        AppStorage.removeAccessToken()
    }

    /**
     * Initialize request interceptor.
     * @protected _initializeRequestForRefresh
     */
    protected _initializeRequest = (): void => {
        this.instance.interceptors.request.clear()
        this._initializeRequestInterceptor()
    }

    /**
     * Initialize request interceptor for refresh.
     * @protected _initializeRequestForRefresh
     */
    protected _initializeRequestForRefresh = (): void => {
        this.instance.interceptors.request.clear()
        this._initializeRequestInterceptor(true)
    }

    /**
     * Remove user store.
     * @protected
     */
    protected _removeUserStore() {
        store.dispatch({type: 'auth/login/resetLogin', payload: null})
        store.dispatch({type: 'user/me/resetMe', payload: null})
    }

    /**
     * Authenticated handle error.
     * @protected _handleError
     * @param error
     */
    protected _authenticatedHandleError = async (error: AxiosError) => {
        const statusCode: number = Number(error.response?.status)

        if (401 === statusCode) {
            await this._removeTokensFromStorage()
            this._removeUserStore()
            console.error("401 error occurred")
            //history.push('/auth/login')
        } else if (403 === statusCode) {
            //console.error(i18next.t('errors_types.forbidden'))
            console.error("403 error occurred")
            //history.push('/auth/login')
        } else if (500 <= statusCode) {
            console.error("5xx error occurred")
            //console.error(i18next.t('errors_types.unsuccessful'))
            //history.push('/auth/login')
        }

        return Promise.reject(error)
    }
}
