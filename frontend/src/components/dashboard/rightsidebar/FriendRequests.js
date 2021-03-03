/* eslint-disable jsx-a11y/alt-text */
import React, { useState, useEffect } from "react";
import {useSelector} from 'react-redux';
import { BACKEND_SERVER_DOMAIN } from '../../../settings';
import axios from 'axios';

export default function FriendRequests() {
    const user = useSelector(state => state.user);
    const token = user.token;
    const [friendRequests, setFriendRequests] = useState();
    const [acceptedRequests, setAcceptedRequests] = useState([-1,0]);
    const [clickedButtons, setClickedButtons] = useState([-1,0]);

    const getFriendRequests = () => {
        let config = { headers: {
            'Content-Type': 'application/json',
            Authorization: token,   
        }};
        axios.get(BACKEND_SERVER_DOMAIN + '/api/friends/requests/', config)
            .then(function (response) {
                setFriendRequests(response.data['requests']);
            })
            .catch(function (err) {
                console.log(err.response.data);
            });
    }

    useEffect(() => {
        getFriendRequests();
    }, [])

    const acceptFriendRequest = (id) => {
        setClickedButtons([...clickedButtons, id]);
        let config = { headers: {
            'Content-Type': 'application/json',
            Authorization: token,   
        }}
        axios.put('http://localhost:8000/api/friends/request/accept/',JSON.stringify({'id':id}), config)
            .then(function (response) {
                setAcceptedRequests([...acceptedRequests, id])
            })
            .catch(function (error) {
                console.log(error.response.data);
            });
    }

    const declineFriendRequest = (id) => {

    }

    return (friendRequests) ? (
        <section className="py-2">
            <div className="rightsidebar-title fs-4">Friend Requests</div>
            {friendRequests.map((person, index) => (
                    <div key={index}>
                        <div className="sidebar-user-window py-3 d-flex">
                            <div className="sidebar-user-window-avatar">
                                <img src={person.avatar} className="" width="50rem" height="50rem" />
                            </div>
                            <div className="sidebar-user-window-user px-3 fw-med">
                                <div>{person.first_name} {person.last_name}</div>
                                <div className="text-sm">{user.tagline}</div>
                                <div className="mt-3">
                                    <button onClick={() => acceptFriendRequest(person.request_id)}
                                        className="btn btn-sm btn-outline-primary"
                                        disabled={(Object.values(clickedButtons).indexOf(person.request_id) !== -1)}>
                                        {(Object.values(acceptedRequests).indexOf(person.request_id) !== -1) ? 
                                            'Accepted' : 'Accept'}
                                    </button>
                                    {(Object.values(acceptedRequests).indexOf(person.request_id) !== -1) ? 
                                            '' : <button onClick={() => declineFriendRequest(person.request_id)}
                                            className="btn btn-sm btn-outline-danger mx-3">
                                            Decline
                                        </button>}
                                </div>
                            </div>
                        </div>
                    </div>
            ))}
        </section>
    ) : (
        <section>
        </section>
    )
}