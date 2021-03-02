import React from 'react';
import {useSelector} from 'react-redux';
import logo from '../../assets/images/logo.png';

function LeftSidebar({logOut}) {
    const user = useSelector(state => state.user)
    return (
        <section>
            <div>
                <nav className="navbar navbar-light py-3">
                    <div className="container-fluid p-0">
                        <img src={logo} className="dashboard-logo" />
                        <div className="d-block d-lg-none">
                            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarToggleExternalContent" aria-controls="navbarToggleExternalContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                            </button>
                        </div>
                    </div>
                </nav>
            </div>
            <div className="mt-3">
                <span className="fs-4 fw-light">Welcome,</span>
            </div>
            <div className="sidebar-user-window my-3 mb-3 d-flex">
                <div className="sidebar-user-window-avatar">
                    <img src={user.avatar} className="rounded-circle rounded-box-shadow" width="70rem" height="70rem" />
                </div>
                <div className="sidebar-user-window-user px-3">
                    <div className="fs-5">{user.first_name} {user.last_name}</div>
                    <div className="text-sm">{user.tagline}</div>
                </div>
            </div>
            <div>
                <div className="pt-3 collapse d-none d-lg-block" id="navbarToggleExternalContent">
                    <div className="list-group">
                        <button className="sidebar-window-items rounded-pill">
                            <i className="fas fa-home fs-5"></i> Home
                        </button>
                        <button className="sidebar-window-items rounded-pill">
                            <i className="far fa-user fs-5"></i> Profile
                        </button>
                        <button className="sidebar-window-items rounded-pill">
                            <i className="far fa-bell fs-5"></i> Notifications
                        </button>
                        <button className="sidebar-window-items rounded-pill">
                            <i className="far fa-thumbs-up fs-5"></i> Liked Posts
                        </button>
                        <button className="sidebar-window-items rounded-pill">
                            <i className="fas fa-cog fs-5"></i> Settings
                        </button>
                        <button className="sidebar-window-items rounded-pill" onClick={logOut}>
                            <i className="fas fa-sign-out-alt fs-5"></i> Logout
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default LeftSidebar;