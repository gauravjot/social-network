import React from "react";
import { Helmet } from "react-helmet";
import { useSelector } from "react-redux";
import SuggestFriends from "../rightsidebar/SuggestFriends";
import FriendRequests from "../rightsidebar/FriendRequests";

import LeftSidebar from "../LeftSidebar";
import FriendListItem from "./FriendListItem";
import Navbar from "../Navbar";

export default function Friends() {
    const friends = useSelector((state) => state.friends);

    return (
        <section className="friends">
            <Helmet>
                <title>Friends on socialnetwork</title>
            </Helmet>
            <Navbar />
            <div className="navbar-spacer"></div>
            <div className="container">
                <div className="row">
                    <div className="col-lg-3 col-12">
                        <LeftSidebar active={2}/>
                    </div>
                    <div className="col-lg-9 col-12 timeline rightsidebar">
                        <FriendRequests />
                        <SuggestFriends />
                        <div class="card">
                        <h6>Friends</h6>
                            {(friends) ? (
                                <div className="friends-list row g-3">
                                    {friends
                                        .slice()
                                        .reverse()
                                        .map((friend, index) => (
                                            <div
                                                key={index}
                                                className="col-lg-3 col-md-6 col-12"
                                            >
                                                <FriendListItem friend={friend} />
                                            </div>
                                        ))}
                                </div>
                            ) : (
                                <div class="sorry">
                                    Add some friends and they will show up here!
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
