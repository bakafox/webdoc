import type { AxiosError } from 'axios'

import axios from "axios"
import { Page } from "../types/pages"

async function showCreateNewPageDialog(callback: () => void) {
    const newTitle = prompt('Введи название страницы дружище…')
    if (!newTitle) return

    const newPid = prompt('Хорошее название брат, теперь введи id страницы, он будет использоваться в качестве пути:')
    if (!newPid) return

    const newBody = prompt('А теперь напиши в это маленькое текстовое поле ВЕСЬ HTML для тела:')
    if (!newBody) return

    try {
        const data = await axios.post(
            '/pages/create',
            {
                pid: newPid,
                title: newTitle,
                body: newBody,
            } as Page,
        )
    
        alert('Новая страничка готова!!!')

        callback()
    }
    catch (e) {
        const errText = (e as AxiosError<{ error: string }, string>).response?.data?.error || `${e}`
        alert(`Прости дружище что-то пошло не так… \n\n${errText}`)
    }
}

function NewPageBtn({ onPageCreated }: { onPageCreated: () => void }) {
    return (
        <button className="new-page-button" onClick={() => showCreateNewPageDialog(onPageCreated)}>
            Создать новую страничку!
        </button>
    )
}

export default NewPageBtn
