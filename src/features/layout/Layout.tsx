import { Outlet, useNavigate } from "react-router-dom"
import "./Layout.css";
import { useAuth0 } from "@auth0/auth0-react"
import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMortarPestle } from "@fortawesome/free-solid-svg-icons";

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
        <header className="header">
            <div className="header-content">
                <div className="home-btn-container">
                        <button className="base-btn home-btn" onClick={returnHome}>
                            <FontAwesomeIcon icon={faMortarPestle} size="2x" className="home-icon" />
                            <h1 className="title">Recipease</h1>
                        </button>
                    </div>
                <div className="user-container">
                    <div className="user">Hi { user?.name }</div>
                    <div>
                        <button id="logout-btn" className="base-btn" onClick={() => logout({ logoutParams: { returnTo: 'http://localhost:3001/login' } })}>
                            Log Out
                        </button>
                    </div>
                </div>
            </div>
        </header>
        
        {/* Body */}
        <div className="body">
            <Outlet />
        </div>
        
        {/* Footer */}
        <footer className="footer">
            <div className="divider"></div>
            {/* <div>© Evan Fisher 2023</div> */}
        </footer>
        </>
    )
}