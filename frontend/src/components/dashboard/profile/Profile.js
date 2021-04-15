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
import InputField from '../../../utils/InputField'
import { useDispatch } from "react-redux";
import { setUser } from "../../../redux/actions";
import { useHistory } from "react-router-dom";

export default function Profile() {
    const dispatch = useDispatch();
    const history = useHistory();
    const {slug} = useParams();
    const user = useSelector((state) => state.user);
    const [profileData, setProfileData] = React.useState();
    const [avatar, setAvatar] = React.useState();
    const [cover, setCover] = React.useState();
    const [tagline, setTagline] = React.useState("");
    const [home, setHome] = React.useState("");
    const [work, setWork] = React.useState("")

    let fakeCoverPictureBtnRef = React.useRef();
    let realCoverPictureBtnRef = React.useRef();
    let fakeProfilePictureBtnRef = React.useRef();
    let realProfilePictureBtnRef = React.useRef();

    const getData = () => {
        let config = { headers: {
            'Content-Type': 'application/json',
            Authorization: user.token,   
        }};
        axios.get(BACKEND_SERVER_DOMAIN + '/api/person/' + slug, config)
            .then(function (response) {
                setProfileData(response.data);
                setAvatar(response.data.user.avatar)
                setCover(response.data.user.cover_image)
                setTagline(response.data.user.tagline)
                setHome(response.data.user.hometown)
                setWork(response.data.user.work)
            })
            .catch(function (err) {
                console.log(err);
            });
    }

    React.useEffect(() => {
        window.scrollTo(0, 0);
        getData();
    },[slug])

    function birthday(date) {
        let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        let d = new Date(date),
            month = '' + months[d.getUTCMonth()],
            day = '' + d.getUTCDate() + ",",
            year = d.getUTCFullYear();
    
        return [month, day, year].join(' ');
    }

    function memberSince(epoch) {
        let date = parseInt(String(epoch).split('.')[0]) * 1000;
        let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        let ndate = new Date(date);
        return months[ndate.getMonth()] + " " + ndate.getFullYear();
    }

    const handleAvatar = ({ target }) => {
        if (target.value) {
            fakeProfilePictureBtnRef.current.textContent = target.value.match(/[\/\\]([\w\d\s\.\-\(\)]+)$/)[1];
            setAvatar(target.files[0]);
        }
    };

    const handleCoverPicture = ({ target }) => {
        if (target.value) {
            fakeCoverPictureBtnRef.current.textContent = target.value.match(/[\/\\]([\w\d\s\.\-\(\)]+)$/)[1];
            setCover(target.files[0]);
        }
    };
    
    const handleTagline = ({ target }) => {
        setTagline(target.value);
    };
    
    const handleWork = ({ target }) => {
        setWork(target.value);
    };
    
    const handleHome = ({ target }) => {
        setHome(target.value);
    };

    const clickChooseCoverPicture = () => {
        realCoverPictureBtnRef.current.click()
    }

    const clickChoosePicture = () => {
        realProfilePictureBtnRef.current.click()
    }

    let editProfileBtnRef = React.useRef()
    const editProfile = () => {

        editProfileBtnRef.current.textContent = "Saving..."
        editProfileBtnRef.current.setAttribute("disabled", "disabled");

        var formData = new FormData();
        formData.append("avatar", avatar);
        formData.append("work", work);
        formData.append("hometown", home);
        formData.append("tagline", tagline);
        formData.append("cover", cover);
        
        let config = {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: user.token
            },
        };
        axios
            .put(
                BACKEND_SERVER_DOMAIN + "/api/person/edit",
                formData,
                config
            )
            .then(function (response) {
                console.log(response.data)
                dispatch(setUser(response.data));
                editProfileBtnRef.current.textContent = "Done!"
                editProfileBtnRef.current.removeAttribute("class","btn-primary")
                editProfileBtnRef.current.setAttribute("class","btn btn-success")
                history.go(0)
            })
            .catch(function (error) {
                console.log(error)
                editProfileBtnRef.current.textContent = "Try Again"
                editProfileBtnRef.current.setAttribute("class","btn btn-danger")
                editProfileBtnRef.current.removeAttribute("disabled");
            });
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
                                        <img className="cover-image" src={BACKEND_SERVER_DOMAIN + profileData.user.cover_image}/>
                                        {(profileData.user.id == user.id) ? <button className="edit"  data-toggle="modal" data-target="#exampleModal"><i className="fas fa-pen"></i></button> : ""}
                                        <div className="d-flex">
                                            <img className="rounded-circle avatar" src={BACKEND_SERVER_DOMAIN + profileData.user.avatar} alt={profileData.user.first_name+"'s avatar"} />
                                            <div className="user-details">
                                                <h6>{profileData.user.first_name} {profileData.user.last_name}</h6>
                                                <p>{profileData.user.tagline}</p>
                                                {(profileData.user.hometown)? <p><i className="fas fa-map-marker-alt"></i> {profileData.user.hometown}</p> :""}
                                            </div> 
                                        </div>
                                        <ul>
                                            {(profileData.user.work)? <li><i className="fas fa-briefcase"></i> {profileData.user.work}</li> :""}
                                            <li><i className="fas fa-birthday-cake"></i> Born on {birthday(profileData.user.birthday)}</li>
                                            <li><i className="far fa-calendar-alt"></i> Member since {memberSince(profileData.user.created)}</li>
                                            </ul>   
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-8 col-md-12">
                                            <h6 className="ml-3 mt-1">Posts</h6>
                                            <Posts key={1} token={user.token} userposts={profileData.posts.slice().reverse()} />
                                        </div>
                                        <div className="col-lg-4 col-md-12 rightsidebar">
                                            <h6 className="ml-3 mt-1">Friends <span>{(profileData.friends.length) ? "("+profileData.friends.length+")": ""}</span></h6>
                                            <div className="card">
                                                {(profileData.friends.length) ? 
                                                    <div>
                                                        {profileData.friends.slice(0,5).map((friend) => (
                                                        <div className="d-flex user" key={friend.id}>
                                                            <img src={BACKEND_SERVER_DOMAIN + friend.avatar} className="rounded-circle"  alt={friend.first_name + "'s avatar"}/>
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
                                                    profileData.comments.map((comment) => (
                                                        <div className="recent-activity" key={comment.id}>
                                                            <div className="what">posted comment on a <Link to={"/post/"+comment.post_id}>post</Link></div>
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

                                    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                    <div class="modal-dialog">
                                        <div class="modal-content">
                                        <div class="modal-body">
                                            <h5 className="mt-2 mb-2">Edit Profile</h5>
                                            <label className="form-label">Profile Picture&nbsp; <i className="far fa-file-image "></i></label>
                                            <button className="choose-avatar form-control" ref={fakeProfilePictureBtnRef} onClick={clickChoosePicture}>
                                                choose profile picture
                                            </button>
                                            <input
                                                className="d-none"
                                                type="file"
                                                name="avatar"
                                                accept="image/*"
                                                ref={realProfilePictureBtnRef}
                                                onChange={handleAvatar}
                                            />
                                            <label className="form-label">Cover Image&nbsp; <i className="far fa-file-image "></i></label>
                                            <button className="choose-avatar form-control" ref={fakeCoverPictureBtnRef} onClick={clickChooseCoverPicture}>
                                                choose cover image
                                            </button>
                                            <input
                                                className="d-none"
                                                type="file"
                                                name="cover"
                                                accept="image/*"
                                                ref={realCoverPictureBtnRef}
                                                onChange={handleCoverPicture}
                                            />
                                            <InputField
                                                type="text"
                                                name="tagline"
                                                label="Tagline"
                                                onChange={handleTagline}
                                                value={tagline}
                                                />
                                            <InputField
                                                type="text"
                                                name="work"
                                                label="Work"
                                                onChange={handleWork}
                                                value={work}
                                                />
                                            <InputField
                                                type="text"
                                                name="hometown"
                                                label="Hometown"
                                                onChange={handleHome}
                                                value={home}
                                                />
                                        </div>
                                        <div class="modal-footer">
                                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                                            <button type="button" class="btn btn-primary" ref={editProfileBtnRef} onClick={editProfile}>Save changes</button>
                                        </div>
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