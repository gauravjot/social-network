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
    const [acceptedRequests, setAcceptedRequests] = useState([-1, 0]);
    const [clickedButtons, setClickedButtons] = useState([-1, 0]);

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
            })
            .catch(function (err) {
                console.log(err.response.data);
            });
    };

    useEffect(() => {
        getFriendRequests();
    }, []);

    const acceptFriendRequest = (id) => {
        setClickedButtons([...clickedButtons, id]);
        let config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
        };
        axios
            .put(
                "http://localhost:8000/api/friends/request/accept/",
                JSON.stringify({ id: id }),
                config
            )
            .then(function (response) {
                setAcceptedRequests([...acceptedRequests, id]);
            })
            .catch(function (error) {
                console.log(error.response.data);
            });
    };

    const declineFriendRequest = (id) => {};

    return friendRequests ? (
        <div className="card">
            <h6>Friend Requests</h6>
            {friendRequests.map((person, index) => (
                <div key={index} className="d-flex user">
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
                            <button
                                onClick={() =>
                                    acceptFriendRequest(person.request_id)
                                }
                                disabled={
                                    Object.values(clickedButtons).indexOf(
                                        person.request_id
                                    ) !== -1
                                }
                                className="btn btn-sm btn-outline-primary"
                            >
                                {Object.values(acceptedRequests).indexOf(
                                    person.request_id
                                ) !== -1
                                    ? "Accepted"
                                    : "Accept"}
                            </button>
                            <button
                                onClick={() =>
                                    declineFriendRequest(person.request_id)
                                }
                                className="btn btn-sm btn-outline-danger"
                            >
                                Decline
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    ) : (
        <div></div>
    );
}
