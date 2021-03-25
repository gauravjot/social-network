import React from 'react'
import { Helmet } from "react-helmet";
import { useParams, Link } from 'react-router-dom';
import Navbar from "../Navbar";
import LeftSidebar from "../LeftSidebar";
import axios from 'axios';
import { BACKEND_SERVER_DOMAIN } from '../../../settings'
import { useSelector } from 'react-redux';
import Posts from "../post/Posts";
import { timeSince } from "../../../utils/timesince";

export default function Profile() {
    const {slug} = useParams();
    const user = useSelector((state) => state.user);
    const [profileData, setProfileData] = React.useState();

    const getData = () => {
        let config = { headers: {
            'Content-Type': 'application/json',
            Authorization: user.token,   
        }};
        axios.get(BACKEND_SERVER_DOMAIN + '/api/person/' + slug, config)
            .then(function (response) {
                setProfileData(response.data);
            })
            .catch(function (err) {
                console.log(err);
            });
    }

    React.useEffect(() => {
        window.scrollTo(0, 0);
        getData();
    },[])

    function birthday(date) {
        let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        let d = new Date(date),
            month = '' + months[d.getMonth()],
            day = '' + d.getDate() + ",",
            year = d.getFullYear();
    
        return [month, day, year].join(' ');
    }

    function memberSince(epoch) {
        let date = parseInt(String(epoch).split('.')[0]) * 1000;
        let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        let ndate = new Date(date);
        return months[ndate.getMonth()] + " " + ndate.getFullYear();
    }

    return (
        <section className="profile-page">
            <Helmet>
                <title>{(profileData) ? profileData.user.first_name + " " +profileData.user.last_name : "User"} on socialnetwork</title>
            </Helmet>
            <Navbar />
            <div className="navbar-spacer"></div>
            <div className="container">
                <div className="row">
                    <div className="col-lg-3 col-12">
                        <LeftSidebar active={(profileData) ? (profileData.user.id == user.id) ? 3 : "" : ""}/>
                    </div>
                    <div className="col-lg-9 col-12 timeline">
                        {
                            (profileData) ? 
                                (<div>
                                    <div className="card profile-user">
                                        <img className="cover-image"/>
                                        <div className="d-flex">
                                            <img className="rounded-circle avatar" src={BACKEND_SERVER_DOMAIN + profileData.user.avatar} />
                                            <div className="user-details">
                                                <h6>{profileData.user.first_name} {profileData.user.last_name}</h6>
                                                <p>{profileData.user.tagline}</p>
                                                </div> 
                                        </div>
                                        <ul>
                                            <li><i class="fas fa-birthday-cake"></i> Born on {birthday(profileData.user.birthday)}</li>
                                            <li><i class="far fa-calendar-alt"></i> Member since {memberSince(profileData.user.created)}</li>
                                        </ul>   
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-8 col-md-12">
                                            <h6 className="ml-3 mt-1">Posts</h6>
                                            <Posts token={user.token} userposts={profileData.posts.reverse()} />
                                        </div>
                                        <div className="col-lg-4 col-md-12 rightsidebar">
                                            <h6 className="ml-3 mt-1">Friends <span>{(profileData.friends.length) ? "("+profileData.friends.length+")": ""}</span></h6>
                                            <div className="card">
                                                {(profileData.friends.length) ? 
                                                    <div>
                                                        {profileData.friends.slice(0,5).map((friend, index) => (
                                                        <div className="d-flex user">
                                                            <img src={BACKEND_SERVER_DOMAIN + friend.avatar} className="rounded-circle"/>
                                                            <div>
                                                                <h6><Link to={"/u/"+friend.slug}>{friend.first_name} {friend.last_name}</Link></h6>
                                                                <span>{friend.tagline}</span>
                                                            </div>
                                                        </div>
                                                        ))}
                                                        {(profileData.friends.length > 5) ?<a href="#"><div className="card-btn">View All Friends</div></a> : ""}
                                                    </div> : 
                                                    <div className="sorry-sm">{profileData.user.first_name} is not friends with anyone.</div>}
                                            </div>
                                            <h6 className="ml-3">Recent Activity</h6>
                                            <div className="card">
                                                {(profileData.comments.length) ? 
                                                    profileData.comments.map((comment, index) => (
                                                        <div className="recent-activity">
                                                            <div className="what">posted a comment</div>
                                                            <div>
                                                                <span className="content">{comment.comment_text}</span>
                                                                <span className="when">- {timeSince(comment.created)}</span>
                                                            </div>
                                                        </div>
                                                    )) : 
                                                    <div className="sorry-sm">{profileData.user.first_name} has not commented on any posts.</div>}
                                            </div>
                                        </div>
                                    </div>
                                </div>) :
                                <div className="slim-loading-bar"></div>
                        }
                        
                    </div>
                </div>
            </div>
        </section>
    )
}