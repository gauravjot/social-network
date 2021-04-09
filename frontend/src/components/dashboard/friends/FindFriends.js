import React from 'react'
import axios from "axios";
import { BACKEND_SERVER_DOMAIN } from "../../../settings";
import { Link } from 'react-router-dom';
import { Helmet } from "react-helmet";
import { useSelector } from "react-redux";

import LeftSidebar from "../LeftSidebar";
import Navbar from "../Navbar";

import {SuggestedFriendItem} from '../rightsidebar/SuggestFriends'

export default function FindFriends() {
    const [suggestions, setSuggestions] = React.useState();
    const [isLoading, setIsLoading] = React.useState(true);
    const user = useSelector((state) => state.user);

    React.useEffect(() => {
        window.scrollTo(0, 0);
        let config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: user.token,
            },
        };
        axios
            .get(BACKEND_SERVER_DOMAIN + "/api/friends/suggestions", config)
            .then(function (response) {
                setSuggestions(response.data["friend_suggestions"]);
                setIsLoading(false)
            })
            .catch(function (err) {
                console.log(err.response.data);
                setIsLoading(false)
            });
    }, [])

    return (
        <section>
            <Helmet>
                <title>Find Friends</title>
            </Helmet>
            <Navbar />
            <div className="navbar-spacer"></div>
            <div className="container">
                <div className="row">
                    <div className="col-lg-3 col-12">
                        <LeftSidebar />
                    </div>
                    <div className="col-lg-6 col-12 timeline find-friends">
                        <h6 className="mt-3">Suggestions</h6>
                        <div className="card">
                            {
                                (isLoading) ?
                                    <div className="slim-loading-bar"></div>
                                : 
                                suggestions.map((person, index) => (
                                        <SuggestedFriendItem key={index} token={user.token} person={person}/>
                                    ))
                            }
                        </div>
                    </div>
                    <div className="col-lg-3 col-12 rightsidebar">
                    </div>
                </div>
            </div>
        </section>
    )
}
