import React from 'react';
import {useSelector} from 'react-redux';
import SuggestFriends from './SuggestFriends';
import FriendRequests from './FriendRequests';

export default function RightSidebar() {
    const user = useSelector(state => state.user)
    return (
        <section className="rightSidebar">
            <FriendRequests />
            <SuggestFriends />
        </section>
    )
}