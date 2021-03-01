import React from 'react';
import {useSelector} from 'react-redux';
import logo from '../../assets/images/logo.png';

function LeftSidebar({logOut}) {
    const user = useSelector(state => state.user)
    return (
        <section>
            <div>
                <img src={logo} className="dashboard-logo" />
            </div>
            <div className="sidebar-user-window px-3 my-3 d-flex">
                <div className="sidebar-user-window-avatar">
                    <img src={user.avatar} className="rounded-circle rounded-box-shadow" width="70rem" height="70rem" />
                </div>
                <div className="sidebar-user-window-user px-3">
                    <div className="fs-5">{user.first_name} {user.last_name}</div>
                    <div className="text-sm">{user.tagline}</div>
                </div>
            </div>
            <div>
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
        </section>
    )
}

export default LeftSidebar;