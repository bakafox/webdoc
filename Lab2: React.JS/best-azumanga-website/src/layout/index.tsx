import { Outlet } from "react-router-dom"

import SideBar from "../components/SideBar"

function Layout() {
    return (
        <>
            <SideBar />
            <Outlet />
        </>
    )
}

export default Layout
