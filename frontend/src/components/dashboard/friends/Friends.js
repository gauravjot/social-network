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

    React.useEffect(() => {
        window.scrollTo(0, 0);
    },[])

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
                    <div className="col-lg-6 col-12 timeline">
                        <div class="card">
                        <h6>Friends</h6>
                            {(friends) ? (
                                <div className="friends-list">
                                    {friends
                                        .slice()
                                        .reverse()
                                        .map((friend, index) => (
                                            <div
                                                key={index}
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
                    <div className="col-lg-3 col-12 rightsidebar">
                        <FriendRequests />
                        <SuggestFriends />
                    </div>
                </div>
            </div>
        </section>
    );
}
