/* eslint-disable jsx-a11y/alt-text */
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { BACKEND_SERVER_DOMAIN } from "../../../settings";
import axios from "axios";
import { Link } from 'react-router-dom';

export default function SuggestFriends() {
    const user = useSelector((state) => state.user);
    const token = user.token;
    const [suggestions, setSuggestions] = useState();
    const [isLoading, setIsLoading] = useState(true)

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
                setSuggestions(response.data["friend_suggestions"].slice(0,3));
                setIsLoading(false)
            })
            .catch(function (err) {
                console.log(err);
                setIsLoading(false)
            });
    };

    useEffect(() => {
        getSuggestions();
    }, []);

    return !isLoading ? suggestions ? (
        <div>
            <h6 className="mt-3">Friend Suggestions</h6>
            <div className="card friend-suggestions">
                {suggestions.map((person, index) => (
                    <SuggestedFriendItem key={index} token={token} person={person}/>
                ))}
                <Link to={"/findfriends"} className="card-btn">Find more Friends</Link>
            </div>
        </div>
    ) : ("") : (
        <div className="slim-loading-bar"></div>
    );
}

export function SuggestedFriendItem({token, person}) {
    const [isReqSent, setIsReqSent] = React.useState(false)
    let btnRef = React.useRef()

    const sendFriendRequest = (id) => {
        btnRef.current.setAttribute("disabled", "disabled");
        let config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
        };
        axios
            .post(
                BACKEND_SERVER_DOMAIN + "/api/friends/request/send/",
                JSON.stringify({ to_user: id }),
                config
            )
            .then(function (response) {
                setIsReqSent(true)
            })
            .catch(function (error) {
                console.log(error);
                btnRef.current.removeAttribute("disabled", "disabled");
            });
    };

    return (
        <div className="d-flex user">
            <img
                className="rounded-circle"
                src={BACKEND_SERVER_DOMAIN + person.avatar}
                alt={person.first_name +"'s avatar"}
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
                    ref={btnRef}
                >
                    {isReqSent
                        ? "Request Sent"
                        : "Add as Friend"}
                </button>
            </div>
        </div>
    )
}