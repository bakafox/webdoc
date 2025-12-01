import { useState } from "react"

import axios from "axios"
import { getToken } from "../token"

import MsgBox from "../components/MsgBox"

function InvertPanel() {
    const [getFile, setFile] = useState<File | null>(null)
    const [getErrText, setErrText] = useState<string | null>(null)
    const [getImgSrc, setImgSrc] = useState<string | null>(null)

    async function fetchInvertedImg() {
        if (getFile === null) {
            return setErrText('Чтобы отправить файл надо его сперва загрузить… ну ты и бака~~')
        }
        setImgSrc(null)

        try {
            const fd = new FormData()
            fd.append('file', getFile)

            const data = await axios.post(
                '/invert',
                fd,
                {
                    responseType: 'blob',
                    headers: { 'Authorization': `Bearer ${getToken()}` }
                },
            )
            const blob: Blob = data.data
            const addr = URL.createObjectURL(blob)

            setImgSrc(addr)
            setErrText(null)
        }
        catch (e) {
            setErrText(`${e}`)
        }
    }
    
    return (
        <main>
            <h1>
                Инвертировать картинку онлайн в высоком качестве 
                без вирусов без смс и регистрации!!!
            </h1>

            <label>
                <label className='file-upload'>
                    { getFile ? `${getFile.name} (${getFile.size} байт)` : 'Нажмите чтобы выбрать файл…' }
                    <input type="file" onChange={(e) => setFile(e.target.files![0])} />
                </label>

                <button onClick={() => fetchInvertedImg()}>Поехали!</button>
            </label>

            <br /><br />

            <MsgBox msg={{ variant: 'error', text: getErrText }} />

            {!!getImgSrc && (
                <img src={getImgSrc} />
            )}
        </main>
    )
}

export default InvertPanel
