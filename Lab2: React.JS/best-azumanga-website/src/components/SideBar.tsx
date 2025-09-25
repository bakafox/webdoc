import { NavLink } from "react-router-dom"
// import {styles} from './SideBar.module.css'

function SideBar() {
    return (
        <aside>
            <NavLink className="sidelink" to='/abstract'>Добро пожаловать!</NavLink>
            <NavLink className="sidelink bordered" to='/description'>Описание</NavLink>
            <NavLink className="sidelink" to='/conclusion'>Интересные факты</NavLink>
        </aside>
    )
}

export default SideBar
