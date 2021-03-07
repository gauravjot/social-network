import React from 'react'
import { BACKEND_SERVER_DOMAIN } from "../../../settings";

export default function FriendListItem({friend}) {

    return (
        <div className="friendlistitem">
            <div className="avatar">
                <img src={BACKEND_SERVER_DOMAIN + friend.avatar} className="rounded" />
            </div>
            <div>
                <h6>{friend.first_name} {friend.last_name}</h6>
                <div className="text-sm">{friend.tagline}<br/>Born on {friend.birthday}</div>
            </div>
        </div>
    );
}