import type { Page } from "../types/pages"

import axios, { AxiosError } from "axios"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

function CustomPagePanel() {
    const params = useParams()

    const [getPageBody, setPageBody] = useState<Page['body']>()
    const [getErrText, setErrText] = useState<string>('')
    const [getLastPid, setLastPid] = useState<string>('')
    const [getPageOpenTime, setPageOpenTime] = useState<Date>(new Date)

    async function fetchPageData() {
        try {
            const data = await axios.get(`/pages/${params.pid}`)
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
        const timeDiff = Math.ceil((+Date.now() - +getPageOpenTime) / 1000)
        try {
            await axios.post(
                `/pages/${params.pid}/time`,
                { 'time_spent': timeDiff },
            )
        }
        catch (e) {
            console.warn('Не удалось отправить время:', e)
        }
    }

    useEffect(() => {
        console.log(params.pid, getLastPid, +getPageOpenTime)

        if (params.pid !== getLastPid) {
            fetchPageData()

            // Отсеиваем момент первого открытия страницы
            if (getLastPid) {
                sendTime()
                setPageOpenTime(new Date)
                setLastPid(params.pid!)
            }
        }

        return(() => { sendTime() })
    }, [params.pid])

    return (
        <>
            {getErrText && (
                <main>
                <h2>О нет, ошибка!!</h2>
                <p>{getErrText}</p>
                </main>
            )}
            <main dangerouslySetInnerHTML={{ __html: getPageBody || '' }} />
        </>
    )
}

export default CustomPagePanel
