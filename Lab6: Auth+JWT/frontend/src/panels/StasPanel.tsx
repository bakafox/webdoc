import type { PageStas } from "../types/pages"
import type { AxiosError } from "axios"

import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getToken } from "../token"

import MsgBox from "../components/MsgBox"

function StasPanel() {
    const [getStas, setStas] = useState<PageStas[] | null>(null)
    const [getErrText, setErrText] = useState<string | null>(null)

    const navigate = useNavigate()

    async function loadStas() {
        try {
            const data = await axios.get(
                '/pages/statistics',
                {
                    headers: { 'Authorization': `Bearer ${getToken()}` }
                }
            )
            setStas(data.data)
            setErrText(null)
        }
        catch (e) {
            const errData = (e as AxiosError<{ error: string }, string>).response?.data?.error || `${e}`
            setErrText(errData)
        }
    }

    useEffect(() => {
        const i = setInterval(loadStas, 5000)

        loadStas()

        return (() => clearInterval(i))
    }, [])

    return (
        <main>
            <h1>Число и продолжительность посещений страниц:</h1>

            {getStas === null
                ? (
                    <MsgBox msg={{
                        variant: getErrText ? 'error' : 'regular',
                        text: getErrText ? getErrText : 'Получение статистики о страницах…',
                    }} />
                )
                : (
                    <>
                        <p>
                            Нажмите на строчку таблицы, чтобы быстро перейти на выбранную страницу.

                            <br />
                            <br />
                        </p>

                        <table border={1} cellPadding={6}>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Название</th>
                                    <th>Посещений</th>
                                    <th>Общее время</th>
                                    <th>Посл. посещение</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[...getStas]
                                .sort((a, b) => b.last_visit - a.last_visit)
                                .map((ps: PageStas) => (
                                    <tr
                                        key={ps.id}
                                        style={{ cursor: "pointer" }}
                                        onClick={() => navigate(`/${ps.id}`)}
                                    >
                                        <td>{ps.id}</td>
                                        <td>{ps.title}</td>
                                        <td>{ps.views}</td>
                                        <td>{ps.time_spent} сек</td>
                                        <td>{
                                            !ps.last_visit
                                            ? '(нет)'
                                            : new Date(ps.last_visit * 1000).toLocaleString()
                                        }</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                )
            }
        </main>
    )
}

export default StasPanel
