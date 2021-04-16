/* eslint-disable jsx-a11y/alt-text */
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { BACKEND_SERVER_DOMAIN } from "../../../settings";
import axios from "axios";
import { Link } from 'react-router-dom';

export default function FriendRequests() {
    const user = useSelector((state) => state.user);
    const token = user.token;
    const [friendRequests, setFriendRequests] = useState();
    const [isLoading, setIsLoading] = useState(true)

    const getFriendRequests = () => {
        let config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
        };
        axios
            .get(BACKEND_SERVER_DOMAIN + "/api/friends/requests/", config)
            .then(function (response) {
                setFriendRequests(response.data["requests"]);
                setIsLoading(false)
            })
            .catch(function (err) {
                console.log(err.response.data);
                setIsLoading(false)
            });
    };

    useEffect(() => {
        getFriendRequests();
    }, []);


    return !isLoading ? (friendRequests ? (
        <div>
            <h6 className="mt-3">Friend Requests</h6>
            <div className="friend-req card">
                {friendRequests.map((person) => (
                    <FriendReq person={person} user={user} index ={person.id}/>
                ))}
            </div>
        </div>
    ) : ("")) : (
        <div className="slim-loading-bar"></div>
    );
}

export function FriendReq({person, user}) {
    const [isDeleted,setIsDeleted] = useState(false);
    const [isAccepted,setIsAccepted] = useState(false);

    let acceptBtn = React.useRef();
    let declineBtn = React.useRef();

    const acceptFriendRequest = () => {
        acceptBtn.current.setAttribute("disabled", "disabled");
        let config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: user.token,
            },
        };
        axios
            .put(
                BACKEND_SERVER_DOMAIN+"/api/friends/request/accept/",
                JSON.stringify({ id: person.request_id }),
                config
            )
            .then(function (response) {
                setIsAccepted(true)
            })
            .catch(function (error) {
                console.log(error.response.data);
                acceptBtn.current.removeAttribute("disabled", "disabled");
            });
    };

    const declineFriendRequest = () => {
        declineBtn.current.setAttribute("disabled", "disabled");
        let config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: user.token,
            },
        };
        axios
            .delete(
                BACKEND_SERVER_DOMAIN+"/api/friends/request/delete/"+person.request_id,
                config,
                {}
            )
            .then(function (response) {
                setIsDeleted(true)
            })
            .catch(function (error) {
                console.log(error.response.data);
                declineBtn.current.removeAttribute("disabled", "disabled");
            });
    };

    return (
        <div className="d-flex user">
            <img
                className="rounded-circle"
                src={BACKEND_SERVER_DOMAIN + person.avatar}
                alt="profile picture"
            />
            <div>
                <h6>
                    <Link to={"/u/"+person.slug}>
                        {person.first_name} {person.last_name}
                    </Link>
                </h6>
                <span>{person.tagline}</span>
                <div className="d-flex">
                    {!isDeleted ? 
                        <button
                            onClick={acceptFriendRequest}
                            ref={acceptBtn}
                            className="btn btn-sm btn-outline-primary"
                        >
                            {isAccepted
                                ? "Accepted"
                                : "Accept"}
                        </button> 
                        : ""
                    }
                    <button
                        onClick={declineFriendRequest}
                        ref={declineBtn}
                        className="btn btn-sm btn-outline-danger"
                    >
                        {isDeleted
                                ? "Request Declined"
                                : "Decline"}
                    </button>
                </div>
            </div>
        </div>
    )
}
