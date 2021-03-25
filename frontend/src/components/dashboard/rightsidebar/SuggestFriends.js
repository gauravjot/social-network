/* eslint-disable jsx-a11y/alt-text */
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { BACKEND_SERVER_DOMAIN } from "../../../settings";
import axios from "axios";
import { Link } from 'react-router-dom';

export default function SuggestFriends() {
    const user = useSelector((state) => state.user);
    const token = user.token;
    const [suggestions, setSuggestions] = useState([]);
    const [sentRequests, setSentRequests] = useState([-1, 0]);
    const [clickedButtons, setClickedButtons] = useState([-1, 0]);

    const getSuggestions = () => {
        let config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
        };
        axios
            .get(BACKEND_SERVER_DOMAIN + "/api/friends/suggestions", config)
            .then(function (response) {
                setSuggestions(response.data["friend_suggestions"]);
            })
            .catch(function (err) {
                console.log(err.response.data);
            });
    };

    useEffect(() => {
        getSuggestions();
    }, []);

    const sendFriendRequest = (id) => {
        setClickedButtons([...clickedButtons, id]);
        let config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
        };
        axios
            .post(
                "http://localhost:8000/api/friends/request/send/",
                JSON.stringify({ to_user: id }),
                config
            )
            .then(function (response) {
                setSentRequests([...sentRequests, id]);
            })
            .catch(function (error) {
                console.log(error.response.data);
            });
    };

    return suggestions ? (
        <div className="card">
            <h6>Friend Suggestions</h6>
            {suggestions.map((person, index) => (
                <div className="d-flex user" key={index}>
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
                        <button
                            onClick={() => sendFriendRequest(person.id)}
                            className="btn btn-sm btn-outline-primary"
                            disabled={
                                Object.values(clickedButtons).indexOf(
                                    person.id
                                ) !== -1
                            }
                        >
                            {Object.values(sentRequests).indexOf(person.id) !==
                            -1
                                ? "Request Sent"
                                : "Add as Friend"}
                        </button>
                    </div>
                </div>
            ))}
            <button className="card-btn">Find more Friends</button>
        </div>
    ) : (
        <div></div>
    );
}
