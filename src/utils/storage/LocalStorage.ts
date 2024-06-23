export class LocalStorage {
    private ACCESS_TOKEN_KEY: string = 'token'

    private static classInstance?: LocalStorage

    public static getInstance(): LocalStorage {
        if (!this.classInstance) {
            this.classInstance = new this()
        }
        return this.classInstance
    }

    private _getItem = (key: string): string | null => localStorage.getItem(key)
    private _setItem = (key: string, value: any): void => localStorage.setItem(key, value)
    private _removeItem = (key: string): void => localStorage.removeItem(key)

    public getAccessToken = (): string | null => this._getItem(this.ACCESS_TOKEN_KEY)
    public setAccessToken = (value: string): void => this._setItem(this.ACCESS_TOKEN_KEY, value)
    public removeAccessToken = (): void => this._removeItem(this.ACCESS_TOKEN_KEY)
}

const AppStorage = LocalStorage.getInstance()

export default AppStorage