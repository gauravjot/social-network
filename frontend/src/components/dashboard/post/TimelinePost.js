/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useRef, useEffect } from "react";
import { timeSince } from "../../../utils/timesince";
import { BACKEND_SERVER_DOMAIN } from "../../../settings";
import axios from "axios";

const TimelinePost = ({ user, post, friends, token, liked }) => {
    const [author, setAuthor] = useState("");
    const [isLiked, setIsLiked] = useState(liked);
    let btnRef = useRef();

    useEffect(() => {
        if (Number(user.id) === Number(post.person_id)) {
            setAuthor(user);
        } else {
            if (friends !== null) {
                for (var i = 0; i < friends.length; i++) {
                    if (Number(friends[i].id) === Number(post.person_id)) {
                        setAuthor(friends[i]);
                        break;
                    }
                }
            }
        }
        setIsLiked(liked);
    }, [post.person_id,liked]);

    const likePost = () => {
        if (btnRef.current) {
            btnRef.current.setAttribute("disabled", "disabled");
        }
        let config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
        };
        axios
            .put(BACKEND_SERVER_DOMAIN + "/api/post/" + post.id, {}, config)
            .then(function (response) {
                setIsLiked(!isLiked);
                if (btnRef.current) {
                    btnRef.current.removeAttribute("disabled");
                }
            })
            .catch(function (err) {
                console.log(err.response.data);
            });
    };

    return (
        <div className="post card">
            <div className="d-flex user">
                <img
                    className="rounded-circle"
                    src={BACKEND_SERVER_DOMAIN + author.avatar}
                    alt="profile picture"
                />
                <div>
                    <h6>
                        {author.first_name} {author.last_name}
                    </h6>
                    <span>{timeSince(post.created)}</span>
                </div>
                <a href="#">
                    <i className="fas fa-ellipsis-h"></i>
                </a>
            </div>
            <p>{post.post_text}</p>
            {post.post_image ? (
                <img src={BACKEND_SERVER_DOMAIN +post.post_image} className="rounded post-picture" />
            ) : (
                ""
            )}
            <div className="d-flex post-actions">
                <button>
                    <i className="far fa-comment-alt"></i>Comments
                </button>
                <button
                    ref={btnRef}
                    onClick={likePost}
                    className={
                        isLiked
                            ? "btn btn-light btn-light-accent"
                            : "btn btn-light"
                    }
                >
                    <i className="far fa-thumbs-up"></i>
                    {post.likes.persons != null ? (
                        <tag>
                            {post.likes.persons.length > 0 ? post.likes.persons.length+" " : ''}Like
                            {post.likes.persons.length > 1 ? "s" : ""}
                        </tag>
                    ) : (
                        "Like"
                    )}
                </button>
                <button>
                    <i className="far fa-share-square"></i>Share
                </button>
            </div>
            <div className="post-comment">
                <div className="d-flex user">
                    <img
                        className="rounded-circle"
                        src={BACKEND_SERVER_DOMAIN+user.avatar}
                        alt="profile picture"
                    />
                    <input type="text" placeholder="Write your comment..." />
                    <button>
                        <i className="far fa-paper-plane"></i>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TimelinePost;
