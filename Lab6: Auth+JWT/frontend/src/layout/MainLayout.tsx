import type { PageOverview } from "../types/pages"
import type { UserData } from "../types/users"

import { useEffect, useState } from "react"
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom"
import axios from "axios"
import { getToken, revokeToken } from "../token"

import SideBar from "../components/SideBar"
import NewPageBtn from "../components/NewPageBtn"

function MainLayout() {
    const jwt = getToken()

    const navigate = useNavigate()
    const location = useLocation()

    const [getPageOVs, setPagesOVs] = useState<PageOverview[]>([])
    const [getText, setText] = useState<string | null>('Загрузка… UwU')
    const [getUserData, setUserData] = useState<UserData>({
        email: 'Загрузка…',
        role: 'none'
    })

    async function checkForLogin() {
        // Сперва проверяем, есть ли токен вообще...
        if (!jwt) {
            navigate('/auth')
        }
        // Теперь проверяем, являетсял и он валидным...
        try {
            const data = await axios.get(
                '/auth/status',
                {
                    headers: { 'Authorization': `Bearer ${jwt}` }
                }
            )
            setUserData(data.data)
            
            console.log(`jwt ok`)
        }
        catch {
            revokeToken()
            navigate('/auth')
        }
    }

    async function loadPages() {
        try {
            const data = await axios.get(
                '/pages',
                {
                    headers: { 'Authorization': `Bearer ${jwt}` }
                }
            )
            setPagesOVs(data.data)
            setText(null)
        }
        catch {
            setText('Не удалось загрузить страницы! TwT')
        }
    }

    useEffect(() => {
        // В идеале делать эту проверку более часто?
        checkForLogin().then(() => loadPages())
    }, [location])

    return (
        <>
            <SideBar>
                <NavLink className="sidelink" to='/'>Глагная страница</NavLink>
                <NavLink className="sidelink" to='/posts'>Умные мысли</NavLink>
                <NavLink className="sidelink" to='/invert'>Инвертор картинок</NavLink>
                {
                    getUserData.role === 'admin' && (
                        <NavLink className="sidelink bordered" to='/stas'>Стастистика посещений</NavLink>
                    )
                }

                <hr className="sidehr" />

                {
                    getPageOVs.map((p: PageOverview) => (
                        <NavLink className="sidelink" key={p.id}
                            to={p.id}>{p.title || '(страница без имени)'}
                        </NavLink>
                    ))
                }

                <span style={{ display: !!getText ? 'unset' : 'none' }}>{ getText }</span>

                {
                    getUserData.role === 'admin' && (
                        <NewPageBtn onPageCreated={() => loadPages()} />
                    )
                }
            </SideBar>

            <Outlet context={{ userData: getUserData }} />
        </>
    )
}

export default MainLayout
