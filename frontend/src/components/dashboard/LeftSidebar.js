/* eslint-disable jsx-a11y/alt-text */
import React from "react";
import { useSelector } from "react-redux";
import logo from "../../assets/images/logo.png";
import { BACKEND_SERVER_DOMAIN } from "../../settings";

function LeftSidebar({ logOut }) {
    const user = useSelector((state) => state.user);
    return (
        <section className="leftsidebar">
            <nav className="navbar navbar-light">
                <div className="container-fluid">
                    <img src={logo} className="logo" />
                    <div className="d-block d-lg-none">
                        <button
                            className="navbar-toggler"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#navbarToggleExternalContent"
                            aria-controls="navbarToggleExternalContent"
                            aria-expanded="false"
                            aria-label="Toggle navigation"
                        >
                            <span className="navbar-toggler-icon"></span>
                        </button>
                    </div>
                </div>
            </nav>
            <h4>Welcome,</h4>
            <div className="d-flex">
                <img
                    src={BACKEND_SERVER_DOMAIN + user.avatar}
                    className="rounded-circle rounded-box-shadow"
                    width="70rem"
                    height="70rem"
                />
                <div>
                    <h5>
                        {user.first_name} {user.last_name}
                    </h5>
                    <div className="text-sm">{user.tagline}</div>
                </div>
            </div>
            <div
                className=" menu collapse d-none d-lg-block"
                id="navbarToggleExternalContent"
            >
                <div className="list-group">
                    <button className="rounded-pill">
                        <i className="fas fa-home"></i> Home
                    </button>
                    <button className="rounded-pill">
                        <i className="far fa-user"></i> Profile
                    </button>
                    <button className="rounded-pill">
                        <i className="far fa-bell"></i> Notifications
                    </button>
                    <button className="rounded-pill">
                        <i className="far fa-thumbs-up"></i> Liked Posts
                    </button>
                    <button className="rounded-pill">
                        <i className="fas fa-cog"></i> Settings
                    </button>
                    <button className="rounded-pill" onClick={logOut}>
                        <i className="fas fa-sign-out-alt"></i> Logout
                    </button>
                </div>
            </div>
        </section>
    );
}

export default LeftSidebar;
