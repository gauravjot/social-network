import React from "react";
import { logoutUser, removeAllPosts, emptyFriends } from "../../redux/actions";
import logo from "../../assets/images/logo.png";
import { useSelector, useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";

export default function Navbar() {
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const history = useHistory();

    if (Object.keys(user).length === 0) {
        history.push("/login");
    }

    const logOut = () => {
        dispatch(logoutUser());
        dispatch(removeAllPosts());
        dispatch(emptyFriends());
        history.push("/login");
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light">
            <div className="container">
                <div className="container-fluid row">
                    <div className="col-lg-3 col-12 nav-brand">
                        <h6>
                            <img src={logo} />
                        </h6>
                        <button
                            className="navbar-toggler"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#navbarToggler"
                            aria-controls="navbarToggler"
                            aria-expanded="false"
                            aria-label="Toggle navigation"
                        >
                            <i className="fas fa-bars"></i>
                        </button>
                    </div>
                    <div className="col-lg-9 col-12">
                        <div
                            className="collapse navbar-collapse"
                            id="navbarToggler"
                        >
                            <div className="row w-100">
                                <div className="col-lg-8 col-12">
                                    <form className="d-flex">
                                        <input
                                            type="search"
                                            placeholder="Search"
                                            aria-label="Search"
                                        />
                                        <button type="submit">
                                            <i className="fas fa-search"></i>
                                        </button>
                                    </form>
                                </div>
                                <div className="col-lg-4 col-12">
                                    <ul className="navbar-nav">
                                        <li>
                                            <button onClick={logOut}>
                                                Logout
                                                <i className="fas fa-sign-out-alt"></i>
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
