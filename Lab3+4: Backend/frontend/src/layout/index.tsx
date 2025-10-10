import { Outlet, NavLink } from "react-router-dom"

import SideBar from "../components/SideBar"

function Layout() {
    return (
        <>
            <SideBar>
                <NavLink className="sidelink" to='/abstract'>Вступление</NavLink>
                <NavLink className="sidelink bordered" to='/description'>Описание</NavLink>
                <NavLink className="sidelink" to='/conclusion'>Заключение</NavLink>
                <NavLink className="sidelink bordered" to='/posts'>Посты</NavLink>
                <NavLink className="sidelink bordered" to='/invert'>Инвертор</NavLink>
                <NavLink className="sidelink" to='/api'>API</NavLink>
            </SideBar>

            <Outlet />
        </>
    )
}

export default Layout
