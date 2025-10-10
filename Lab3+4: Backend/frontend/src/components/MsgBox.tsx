import type { Msg } from "../types"

function MsgBox({ variant = 'regular', text = null }: Msg) {
    return (
        <div
            className={`msgbox ${variant}`}
            style={{ display: !!text ? 'block' : 'none' }}
        >
            { text }
        </div>
    )
}

export default MsgBox
