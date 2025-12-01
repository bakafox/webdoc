import type { Msg } from "../types"

function MsgBox(
    { msg }: { msg: Msg }
) {
    return (
        <div
            className={`msgbox ${msg.variant}`}
            style={{ display: msg.text !== null ? 'block' : 'none' }}
        >
            { msg.text }
        </div>
    )
}

export default MsgBox
