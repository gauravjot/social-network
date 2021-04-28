import React from 'react'
import { Helmet } from "react-helmet";
import TimelinePost from './TimelinePost'
import { useParams, Link } from 'react-router-dom';
import Navbar from "../Navbar";
import LeftSidebar from "../LeftSidebar";
import axios from 'axios';
import { BACKEND_SERVER_DOMAIN } from '../../../settings'
import { useSelector } from 'react-redux';

export default function PostPage() {
    const {post_id} = useParams();
    const user = useSelector((state) => state.user);
    const [post,setPost] = React.useState();

    React.useEffect(() => {
        window.scrollTo(0, 0);
        let config = { headers: {
            'Content-Type': 'application/json',
            Authorization: user.token,   
        }};
        axios.get(BACKEND_SERVER_DOMAIN + '/api/post/'+post_id+"/", config)
            .then(function (response) {
                setPost(response.data);
            })
            .catch(function (err) {
                console.log(err);
            });
    },[])

    return (
        <section className="profile-page">
            <Helmet>
                <title>{(post) ? post.person.first_name + " " +post.person.last_name : "User"}'s Post</title>
            </Helmet>
            <Navbar />
            <div className="navbar-spacer"></div>
            <div className="container">
                <div className="row">
                    <div className="col-lg-3 col-12">
                        <LeftSidebar active="0"/>
                    </div>
                    <div className="col-lg-6 col-12 timeline">
                        {(post) ? <TimelinePost user={user} post={post} expanded={true}/>:""}
                    </div>
                </div>
            </div>
        </section>
    )
}
