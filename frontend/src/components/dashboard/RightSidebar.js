import React from 'react';
import SuggestFriends from './friends/SuggestFriends';
import FriendRequests from './friends/FriendRequests';

export default function RightSidebar() {
    return (
        <section className="rightsidebar">
            <FriendRequests />
            <SuggestFriends />
        </section>
    )
}