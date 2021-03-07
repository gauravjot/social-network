/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState, useRef, useEffect} from 'react';
import { useSelector } from "react-redux";
import { timeSince } from '../../../utils/timesince'
import { BACKEND_SERVER_DOMAIN } from "../../../settings";
import axios from 'axios';

const TimelinePost = ({post, friends, token}) => {
    const user = useSelector((state) => state.user);
    const [author, setAuthor] = useState("");
    const [isLiked, setIsLiked] = useState(false);
    let btnRef = useRef();

    useEffect(()=> {
        if (user.id == post.person_id) {
            setAuthor(user);
        } else {
            if (friends !== null) {
                for (var i=0; i<friends.length; i++) {
                    if (friends[i].id == post.person_id) {
                        setAuthor(friends[i])
                        break;
                    }
                }
            }
        }
        if (post.likes.persons != undefined) {
            setIsLiked(post.likes.persons.includes(user.id));
        }
    },[])

    const likePost = () => {
        if (btnRef.current) {
            btnRef.current.setAttribute("disabled", "disabled");
        }
        let config = { headers: {
            'Content-Type': 'application/json',
            Authorization: token,   
        }};
        axios.put(BACKEND_SERVER_DOMAIN + '/api/post/' + post.id,{}, config)
            .then(function (response) {
                setIsLiked(!isLiked);
                if (btnRef.current) {
                    btnRef.current.removeAttribute("disabled");
                }
            })
            .catch(function (err) {
                console.log(err.response.data);
            });
    }

    return (
        <div className="post">
            <div className="d-flex">
                    <img src={BACKEND_SERVER_DOMAIN + author.avatar} className="rounded-circle" width="50rem" height="50rem" />
                <div>
                    <h6>{author.first_name} {author.last_name}</h6>
                    <div className="text-sm">{timeSince(post.created)}</div>
                </div>
                <div>
                    <i className="btn btn-light fas fa-ellipsis-v" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false"></i>
                    <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                        <li><a className="dropdown-item py-2" href="#">Edit</a></li>
                        <li><a className="dropdown-item py-2" href="#">Delete</a></li>
                        <li><a className="dropdown-item py-2" href="#">Share</a></li>
                    </ul>
                </div>
            </div>
            <p>
                {post.post_text}
            </p>
            {(post.post_image) ? <div><img src={post.post_image} className="post-image" /></div>: ''}
            {(post.likes.persons != null) ? <div className="text-sm">{post.likes.persons.length} people have liked this</div> : ''}
            <div className="row g-0">
                <div className="col-lg-3 col-md-3 col-sm-4 col-3">
                    <button ref={btnRef} onClick={likePost} className={(isLiked) ? "btn btn-light btn-light-accent" : "btn btn-light"}><i className="fas fa-thumbs-up like-fa"></i> Like</button>
                </div>
                <div className="col-lg-4 col-md-3 col-sm-4 col-5">
                    <button className="btn btn-light"><i className="fas fa-comment-alt"></i> Comments</button>
                </div>
                <div className="col-lg-3 col-md-3 col-sm-4 col-4">
                    <button className="btn btn-light"><i className="fas fa-share like-fa"></i> Share</button>
                </div>
            </div>
        </div>
    );
};

export default TimelinePost;