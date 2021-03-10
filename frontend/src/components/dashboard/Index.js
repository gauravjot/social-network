import React from "react";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet";

import LeftSidebar from "./LeftSidebar";
import RightSidebar from "./rightsidebar/RightSidebar";
import Navbar from "./Navbar";
import CreatePost from "./CreatePost";
import Posts from "./Posts";
import { useHistory } from "react-router-dom";

function Dashboard() {
    const user = useSelector((state) => state.user);

    const token = user.token;

    return (
        <section className="dashboard">
            <Helmet>
                <title>Dashboard</title>
            </Helmet>
            <Navbar/>
            <div className="navbar-spacer"></div>
            <div className="container">
                <div className="row">
                    <div className="col-lg-3 col-12">
                        <LeftSidebar active={1}/>
                    </div>
                    <div className="col-lg-6 col-12 timeline">
                        <CreatePost token={token} avatar={user.avatar} />
                        <Posts token={token} />
                    </div>
                    <div className="col-lg-3 col-12">
                        <RightSidebar />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Dashboard;
