import React from 'react'
import { BACKEND_SERVER_DOMAIN } from "../../../settings";
import { Link } from "react-router-dom";

export default function FriendListItem({friend}) {

    return (
        <div className="friendlistitem d-flex">
            <div className="avatar">
                <img src={BACKEND_SERVER_DOMAIN + friend.avatar} className="rounded" />
            </div>
            <div>
                <h6><Link to={"/u/"+friend.slug}>{friend.first_name} {friend.last_name}</Link></h6>
                <span>{friend.tagline}<br/>Born on {friend.birthday}</span>
            </div>
        </div>
    );
}