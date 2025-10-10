import { useState } from "react"

import MsgBox from "../components/MsgBox"
import axios from "axios"

function InvertPanel() {
    const [getFile, setFile] = useState<File | null>(null)
    const [getErrText, setErrText] = useState<string | null>(null)
    const [getImgSrc, setImgSrc] = useState<string | null>(null)

    async function fetchInvertedImg() {
        if (getFile === null) { return setErrText('Загрузите файл чтобы его отправить…') }

        try {
            const fd = new FormData()
            fd.append('file', getFile)

            const data = await axios.post(
                '/image',
                fd,
                { responseType: 'blob' }
            )

            const blob: Blob = data.data
            const addr = URL.createObjectURL(blob)
            setImgSrc(addr)
        }
        catch (e) {
            setErrText(`${e}`)
        }
    }
    
    return (
        <main>
            <h1 id='welcome'>
                Инвертировать картинку онлайн в высоком качестве 
                без вирусов без смс и регистрации!!!
            </h1>

            <label>
                <label className='file-upload'>
                    { getFile ? `${getFile.name} (${getFile.size} байт)` : 'Нжамите чтобы выбрать файл…' }
                    <input type="file" onChange={(e) => setFile(e.target.files![0])} />
                </label>

                <button onClick={() => fetchInvertedImg()}>Поехали!</button>
            </label>

            <br /><br />

            <MsgBox variant="error" text={getErrText} />

            {!!getImgSrc && (
                <img src={getImgSrc} style={{ width: 'auto', maxHeight: '480px' }} />
            )}
        </main>
    )
}

export default InvertPanel
