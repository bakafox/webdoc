import type { Page } from "../types/pages"
import type { AxiosError } from 'axios'

import axios from "axios"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { getToken } from "../token"

function CustomPagePanel() {
    const jwt = getToken()

    const params = useParams()

    const [getPageBody, setPageBody] = useState<Page['body']>()
    const [getErrText, setErrText] = useState<string>('')
    const [getLastPid, setLastPid] = useState<string>('')
    let lastSentTime = Date.now()

    async function fetchPageData() {
        try {
            const data = await axios.get(
                `/pages/${params.pid}`,
                {
                    headers: { 'Authorization': `Bearer ${jwt}` }
                }
            )
            const page: Page = data.data

            document.title = page.title
            setPageBody(page.body)
        }
        catch (e) {
            const errData = (e as AxiosError<{ error: string }, string>).response?.data?.error || `${e}`
            setErrText(errData)
        }
    }

    async function sendTime() {
        const currTime = Date.now()
        const timeDiff = Math.ceil((+currTime - +lastSentTime) / 1000)

        try {
            await axios.post(
                `/pages/${params.pid}/time`,
                { 'time_spent': timeDiff },
                {
                    headers: { 'Authorization': `Bearer ${jwt}` }
                }
            )
            lastSentTime = currTime
        }
        catch (e) {
            console.warn('Не удалось отправить время:', e)
        }
    }

    useEffect(() => {
        console.log(params.pid, getLastPid, +lastSentTime)

        if (params.pid && params.pid !== getLastPid) {
            setLastPid(params.pid)
            fetchPageData()
        }

        // В случае закрытия вкладки теряем всего до 5 сек
        const i = setInterval(sendTime, 4200) // 4200 чтобы избежать 6 сек вместо 5

        return(() => {
            clearInterval(i)
            sendTime()
            document.title = 'Azumanga Daioh!'
        })
    }, [params.pid])

    return (
        <>
            {getErrText && (
                <main>
                    <h2>О нет, ошибка!!</h2>
                    <p>{getErrText}</p>
                </main>
            )}

            <section className="custom-page__wrap">
            <section className="custom-page"
                dangerouslySetInnerHTML={{ __html: getPageBody || '' }}
            />
            </section>
        </>
    )
}

export default CustomPagePanel
