import React from 'react'
import { Helmet } from "react-helmet";
import { useSelector } from "react-redux";
import SuggestFriends from '../rightsidebar/SuggestFriends';
import FriendRequests from '../rightsidebar/FriendRequests';

import LeftSidebar from "../LeftSidebar";
import FriendListItem from "./FriendListItem";

export default function Friends() {
    const friends = useSelector((state) => state.friends);

    return (
        <section className="friends">
            <Helmet>
                <title>Friends on socialnetwork</title>
            </Helmet>
            <div className="row">
                <div className="col-lg-3 col-12">
                    <LeftSidebar />
                </div>
                <div className="col-lg-9 col-12">
                <FriendRequests />
                <SuggestFriends />
                <h4>Friends</h4>
                {(friends !== null) ? 
                    (<div className="friends-list row g-3">
                        {friends.slice().reverse().map((friend, index) => (
                            <div key={index} className="col-lg-3 col-md-6 col-12">
                                <FriendListItem friend={friend} />
                            </div>
                    ))}
                    </div>) : (
                    <div>
                        Sorry, but we do not have any posts to serve yet.
                    </div>
                )}
                </div>
            </div>
        </section>
    );
}