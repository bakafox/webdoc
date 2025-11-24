import type { Page, PageStas } from "../types/pages"

import axios from "axios"
import { useEffect, useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import MsgBox from "../components/MsgBox"

function StasPanel() {
    const [getStas, setStas] = useState<PageStas[]>([])
    const [getErrText, setErrText] = useState<string | null>(null)

    const navigate = useNavigate()

    async function loadStas() {
        try {
            const data = await axios.get('/pages/statistics')
            setStas(data.data)
            setErrText(null)
        }
        catch {
            setErrText('Не удалось получить статистику о страницах.')
        }
    }

    useEffect(() => {
        loadStas()
    }, [])

    return (
        <main>
            <h1>Число и продолжительность посещений страниц:</h1>

            {!getStas.length
                ? (
                    getErrText
                        ? (
                            <MsgBox variant='error' text={getErrText} />
                        )
                        : (
                            <MsgBox variant='regular' text='Получение статистики о страницах…' />
                        )
                )
                : (
                    <>
                        <p>
                            Нажмите на строчку таблицы, чтобы быстро перейти на выбранную страницу.

                            <br /><br />
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
                            {getStas.map((ps: PageStas) => (
                            <tr
                                key={ps.pid}
                                style={{ cursor: "pointer" }}
                                onClick={() => navigate(`/${ps.pid}`)}
                            >
                                <td>{ps.pid}</td>
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
