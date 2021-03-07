import React from "react";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet";

import LeftSidebar from "./LeftSidebar";
import RightSidebar from "./rightsidebar/RightSidebar";
import CreatePost from "./CreatePost";
import Posts from "./Posts";
import {useHistory} from 'react-router-dom';

function Dashboard() {
    const user = useSelector((state) => state.user);

    const token = user.token;

    return (
        <section className="dashboard">
            <Helmet>
                <title>Dashboard</title>
            </Helmet>
            <div className="row">
                <div className="col-lg-3">
                    <LeftSidebar />
                </div>
                <div className="col-lg-6">
                    <h4>Your Feed</h4>
                    <CreatePost token={token} />
                    <Posts token={token} />
                </div>
                <div className="col-lg-3 d-none d-lg-block">
                    <RightSidebar />
                </div>
            </div>
        </section>
    );
}

export default Dashboard;
