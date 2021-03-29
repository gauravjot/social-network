/* eslint-disable jsx-a11y/alt-text */
import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { BACKEND_SERVER_DOMAIN } from "../../settings";

function LeftSidebar({active=1}) {
    const user = useSelector((state) => state.user);

    return (
        <section className="leftsidebar">
            <div className="d-flex user">
                <img
                    className="rounded-circle"
                    src={BACKEND_SERVER_DOMAIN + user.avatar}
                    alt="profile picture"
                />
                <div>
                    <h6>
                        <Link to={"/u/"+user.slug}>{user.first_name} {user.last_name}</Link>
                    </h6>
                    <span>{user.tagline}</span>
                </div>
            </div>
            <div className="navigation">
                <Link to="/dashboard" className={(active == 1) ? "active" : ""}>
                    <i className="far fa-newspaper"></i>Feed
                </Link>
                <Link to="/friends" className={(active == 2) ? "active" : ""}>
                    <i className="fas fa-user-friends"></i>Friends
                </Link>
                <Link to={"/u/"+user.slug} className={(active == 3) ? "active" : ""}>
                    <i className="far fa-user"></i>Profile
                </Link>
                <Link to="#" className={(active == 4) ? "active" : ""}>
                    <i className="far fa-bookmark"></i>Saved
                </Link>
            </div>
            <div className="about">
                <h6>About socialnetwork</h6>
                <p>
                    socialnetwork is built with Django back-end serving API
                    responses to React.js. Know more:
                </p>
                <div className="techs">
                    <a href="https://github.com/gauravjot/social-network">
                        <i className="fab fa-github"></i>Project Github
                    </a>
                    <a href="https://www.djangoproject.com/">
                        <i className="fab fa-python python"></i>Django
                    </a>
                    <a href="https://reactjs.org/">
                        <i className="fab fa-react reactjs"></i>React.js
                    </a>
                    <a href="https://www.postgresql.org/">
                        <i className="fas fa-database sql"></i>PostgreSQL
                    </a>
                </div>
                <p>Themeing with:</p>
                <div className="techs">
                    <a href="https://fontawesome.com/">
                        <i className="fab fa-font-awesome faw"></i>Font Awesome
                    </a>
                    <a href="https://getbootstrap.com/">
                        <i className="fab fa-bootstrap bts"></i>Bootstrap
                    </a>
                </div>
            </div>
            <div className="navbar-spacer"></div>
        </section>
    );
}

export default LeftSidebar;
