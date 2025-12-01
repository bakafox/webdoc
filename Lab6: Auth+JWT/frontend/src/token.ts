import type { AuthData, Token } from "./types/users"
import type { AxiosError } from 'axios'

import axios from "axios"

export type AuthMode = 'login' | 'register'

export async function newToken(
    mode: AuthMode, auth: AuthData
): Promise<void> {
    try {
        const data = await axios.post(
            `/auth/${mode}`,
            {
                'email': auth.email,
                'password': auth.password
            } as AuthData
        )
        const token: Token = data.data

        // max-age (время жизни куки) измеряется В СЕКУНДАХ, а не в мс
        document.cookie = `AT=${token.access_token}; max-age=${token.expires_in}`
    }
    catch (e) {
        const errText = (e as AxiosError<{ error: string }, string>).response?.data?.error || `${e}`
        
        throw new Error(errText)
    }
}

export function getToken(): string {
    const kukis = document.cookie

    const atIdx = kukis.indexOf('AT=')
    if (atIdx === -1) {
        return ''
    }

    return kukis.slice(atIdx + 3).split(';')[0]
}

export function revokeToken(): void {
    document.cookie = 'AT=; max-age=0; path=/'
}
