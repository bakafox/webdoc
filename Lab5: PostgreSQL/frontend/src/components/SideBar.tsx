// import {styles} from './SideBar.module.css'

import { PropsWithChildren } from "react"

function SideBar({ children }: PropsWithChildren) {
    return (
        <aside>
            { children }
        </aside>
    )
}

export default SideBar
