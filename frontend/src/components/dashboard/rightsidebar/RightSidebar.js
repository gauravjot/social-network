import React from 'react';
import SuggestFriends from './SuggestFriends';
import FriendRequests from './FriendRequests';

export default function RightSidebar() {
    return (
        <section className="rightsidebar">
            <FriendRequests />
            <SuggestFriends />
        </section>
    )
}