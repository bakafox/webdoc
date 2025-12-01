import type { Msg } from "../types"
import type { AuthMode } from "../token"
import type { AuthData } from "../types/users"

import { useEffect, useState } from "react"
import { getToken, newToken } from "../token"
import { useNavigate } from "react-router-dom"

import MsgBox from "../components/MsgBox"

function AuthPanel() {
    const navigate = useNavigate()

    const [getAuthView, setAuthView] = useState<AuthMode>('login')
    const [getMsg, setMsg] = useState<Msg | null>(null)

    const [getEmail, setEmail] = useState<string>('')
    const [getPass, setPass] = useState<string>('')
    const [getPass2, setPass2] = useState<string>('')

    function switchView(view: AuthMode) {
        if (getAuthView === view) {
            return
        }
        setEmail('')
        setPass('')
        setPass2('')
        setMsg(null)

        setAuthView(view)
    }

    async function auth(mode: AuthMode, auth: AuthData) {
        try {
            await newToken(mode, auth)

            setMsg({ variant: 'success', text: 'Вход выполнен! Сейчас вы попадёте на сайт…' })

            setTimeout(() => navigate('/'), 500) // Чтобы юзер успел прочитать текст в боксе
        }
        catch (e) {
            const errText = (e as Error).message

            setMsg({ variant: 'error', text: errText })
        }
    }

    useEffect(() => {
        if (!!getToken()) {
            navigate('/')
        }
    }, [])

    return (
        <div className="auth">
            <h2>~ Пожалуйста, войдите ~</h2>

            <div className="auth-form">
                {(getMsg !== null && <MsgBox msg={getMsg} />)}

                {(getAuthView === 'login')
                ? (
                    <>
                        <label>
                            <span>E-mail:</span>
                            <input type="email"
                                value={getEmail} onChange={(e) => setEmail(e.target.value)}
                                
                            />
                        </label>
                        <label>
                            <span>Пароль:</span>
                            <input type="password"
                                value={getPass} onChange={(e) => setPass(e.target.value)}
                            />
                        </label>

                        <button
                            disabled={!getEmail.trim() || !getPass.trim()}
                            onClick={() => auth('login', { email: getEmail.trim(), password: getPass.trim() })}
                        >
                            Войти на сайт
                        </button>

                        <a onClick={() => switchView('register')}>
                            Я впервые на этом прекрасном сайте
                        </a>
                    </>
                )
                : (
                    <>
                        <label>
                            <span>E-mail:</span>
                            <input type="email"
                                value={getEmail} onChange={(e) => setEmail(e.target.value)}
                            />
                        </label>
                        <label>
                            <span>Пароль:</span>
                            <input type="password"
                                value={getPass} onChange={(e) => setPass(e.target.value)}
                            />
                        </label>
                        <label>
                            <span>Пароль ещё раз:</span>
                            <input type="password"
                                value={getPass2} onChange={(e) => setPass2(e.target.value)}
                            />
                        </label>

                        <span style={{
                            color: 'red',
                            display: (getPass.trim() && getPass2.trim() && getPass !== getPass2 ? 'unset' : 'none')
                        }}>
                            Пароль и его подтверждение не совпадают, бака!
                        </span>

                        <button
                            disabled={!getEmail.trim() || !getPass.trim() || (getPass !== getPass2)}
                            onClick={() => auth('register', { email: getEmail.trim(), password: getPass.trim() })}
                        >
                            Создать учётную запись
                        </button>

                        <a onClick={() => switchView('login')}>
                            У меня уже есть учётная запись
                        </a>
                    </>
                )}
            </div>
        </div>
    )
}

export default AuthPanel
