/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState, useEffect} from 'react';
import { useSelector } from "react-redux";
import { timeSince } from '../../../utils/timesince'
import { BACKEND_SERVER_DOMAIN } from "../../../settings";

const TimelinePost = ({post, friends}) => {
    const user = useSelector((state) => state.user);
    const [author, setAuthor] = useState("");

    useEffect(()=> {
        if (user.id == post.person_id) {
            setAuthor(user);
        } else {
            for (var i=0; i<friends.length; i++) {
                if (friends[i].id == post.person_id) {
                    setAuthor(friends[i])
                    break;
                }
            }
        }
    },[])

    return (
        <div className="post py-4">
            <div className="post-user-window my-3 mb-3 d-flex">
                <div>
                    <img src={BACKEND_SERVER_DOMAIN + author.avatar} className="rounded-circle" width="40rem" height="40rem" />
                </div>
                <div className="post-user-window-user px-3">
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
            <div className="row post-options mx-0">
                <div className="col-lg-3 col-md-3 col-sm-4 col-3 px-0">
                    <a href="#" className="btn-light btn"><i className="fas fa-thumbs-up like-fa"></i> <span>Like</span> {(post.likes) ? post.likes.length : ''}</a>
                </div>
                <div className="col-lg-3 col-md-3 col-sm-4 col-5 px-0">
                    <a href="#" className="btn-light btn"><i className="fas fa-comment-alt"></i> <span>Comments</span></a>
                </div>
                <div className="col-lg-3 col-md-3 col-sm-4 col-4 px-0">
                    <a href="#" className="btn-light btn"><i className="fas fa-share like-fa"></i> <span>Share</span></a>
                </div>
            </div>
        </div>
    );
};

export default TimelinePost;