import { Outlet, NavLink } from "react-router-dom"

function AuthLayout() {
    return (
        <section className="auth__wrap">
            <Outlet />
        </section>
    )
}

export default AuthLayout
