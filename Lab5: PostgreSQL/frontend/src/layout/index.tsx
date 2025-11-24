import type { PageOverview } from "../types/pages"

import { useEffect, useState } from "react"
import { Outlet, NavLink } from "react-router-dom"
import axios from "axios"

import SideBar from "../components/SideBar"
import NewPageBtn from "../components/NewPageBtn"

function Layout() {
    const [getPageOVs, setPagesOVs] = useState<PageOverview[]>([])
    const [getText, setText] = useState<string | null>('Загрузка… UwU')

    async function loadPages() {
        try {
            const data = await axios.get('/pages')
            setPagesOVs(data.data)
            setText(null)
        }
        catch {
            setText('Не удалось загрузить страницы! TwT')
        }
    }

    useEffect(() => {
        loadPages()
    }, [])

    return (
        <>
            <SideBar>
                <NavLink className="sidelink" to='/'>Глагная страница</NavLink>
                <NavLink className="sidelink" to='/posts'>Умные мысли</NavLink>
                <NavLink className="sidelink" to='/invert'>Инвертор картинок</NavLink>
                <NavLink className="sidelink" to='/stas'>Стастистика посещений</NavLink>

                <hr className="sidehr" />

                {
                    getPageOVs.map((p: PageOverview) => (
                        <NavLink className="sidelink" key={p.pid}
                            to={p.pid}>{p.title || '(страница без имени)'}
                        </NavLink>
                    ))
                }

                { !!getText
                    ? (
                        <span>{ getText }</span>
                    )
                    : (
                        <NewPageBtn onPageCreated={() => loadPages()} />
                    )
                }
            </SideBar>

            <Outlet />
        </>
    )
}

export default Layout
