import { Outlet, useNavigate } from "react-router-dom"
import "./Layout.css";
import { useAuth0 } from "@auth0/auth0-react"
import { useEffect, useMemo } from "react";

export default function Layout() {
    const navigate = useNavigate();
    const { logout, isAuthenticated, user } = useAuth0();

    useEffect(() => {
        const checkAuth = async () => {
            if (!isAuthenticated) {
                navigate('/login')
            }
        }
        //checkAuth();
    }, [])

    const returnHome = () => {
        const route = '/';
        navigate(route);
    }

    return (
        <>
        {/* Header */}
        <header>
            <div className="header-content">
                <div className="user-container">
                    <h4 className="user">Hi { user?.name }</h4>
                    <div className="logout-btn-wrapper">
                        <button className="logout-btn" onClick={() => logout({ logoutParams: { returnTo: 'http://localhost:3001/login' } })}>
                            Log Out
                        </button>
                    </div>
                </div>
                <div className="home-btn-container">
                    <button className="home-btn" onClick={returnHome}>
                        <h1 className="title">Recipease</h1>
                    </button>
                </div>
            </div>
        </header>
        
        {/* Body */}
        <div className="body">
            <Outlet />
        </div>
        
        {/* Footer */}
        <footer>
            <div className="divider"></div>
            {/* <div>© Evan Fisher 2023</div> */}
        </footer>
        </>
    )
}