export interface Token {
    access_token: string,
    token_type: 'bearer',
    expires_in: number,
}

export interface AuthData {
    email: string,
    password: string,
}

export interface UserData {
    email: string,
    role: string,
}
