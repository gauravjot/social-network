/* eslint-disable jsx-a11y/alt-text */
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { BACKEND_SERVER_DOMAIN } from "../../../settings";
import axios from "axios";

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
        <div>
            <h4>Friend Suggestions</h4>
            <section className="suggest-friends">
                {suggestions.map((person, index) => (
                    <div className="d-flex" key={index}>
                        <img
                            src={BACKEND_SERVER_DOMAIN + person.avatar}
                            className="rounded"
                            width="50rem"
                            height="50rem"
                        />

                        <div>
                            <h6>
                                {person.first_name} {person.last_name}
                            </h6>
                            <div className="text-sm">{person.tagline}</div>
                            <button
                                onClick={() => sendFriendRequest(person.id)}
                                className="btn btn-sm btn-outline-primary"
                                disabled={
                                    Object.values(clickedButtons).indexOf(
                                        person.id
                                    ) !== -1
                                }
                            >
                                {Object.values(sentRequests).indexOf(
                                    person.id
                                ) !== -1
                                    ? "Request Sent"
                                    : "Add as Friend"}
                            </button>
                        </div>
                    </div>
                ))}
            </section>
        </div>
    ) : (
        <div></div>
    );
}
