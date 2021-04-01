import React, { useState, useRef, useEffect } from "react";
import { timeSince } from "../../../utils/timesince";
import { BACKEND_SERVER_DOMAIN } from "../../../settings";
import CommentComponent from "./Comment";
import axios from "axios";
import { Link } from 'react-router-dom';
import {getMetadata} from 'page-metadata-parser';

const TimelinePost = ({ user, post, expanded}) => {
    const [isLiked, setIsLiked] = useState();
    const [likesCount, setLikesCount] = useState();
    const [comments, setComments] = useState();
    const [showComments, setShowComments] = useState(false);
    const [isLoadingComments,setIsLoadingComments] = useState(false);
    const [embedUrls,setEmbedUrls] = useState();
    let btnRef = useRef();

    useEffect(() => {
        setIsLiked(post.likes.persons && post.likes.persons.includes(user.id));
        setLikesCount((post.likes.persons != null) ? post.likes.persons.length : 0);
        let urlRegEx = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
        const urls = [...post.post_text.matchAll(urlRegEx)]
        let links = []
        if (urls) {
            urls.map(async (url, index) => {
                const domino = require('domino');
                const response = await fetch(url[0]);
                const html = await response.text();
                const doc = domino.createWindow(html).document;
                const metadata = getMetadata(doc, url);
                links.push({"title":metadata.title,
                    "description":metadata.description,
                    "url":url[0]})
                if (urls.length == index+1) setEmbedUrls(links);
            })
        }
        if (expanded) {
            commentsToggle()
        }
    }, []);

    const likePost = () => {
        if (btnRef.current) {
            btnRef.current.setAttribute("disabled", "disabled");
        }
        let config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: user.token,
            },
        };
        axios
            .put(BACKEND_SERVER_DOMAIN + "/api/post/" + post.id, {}, config)
            .then(function (response) {
                let like = isLiked ? false : true;
                setIsLiked(like);
                if (like) {
                    setLikesCount(likesCount+1);
                } else {
                    setLikesCount(likesCount-1);
                }
                if (btnRef.current) {
                    btnRef.current.removeAttribute("disabled");
                }
            })
            .catch(function (err) {
                console.log(err);
            });
    };

    const commentsToggle = () => {
        if (comments) {
            setShowComments(!showComments);
        } else {
            if (!isLoadingComments) {setIsLoadingComments(true)}
            axios.get(BACKEND_SERVER_DOMAIN + "/api/" + post.id + "/comments/", {headers:{Authorization: user.token}})
                .then(function (response) {
                    setComments(response.data.comments)
                    if (response.data.comments.length == 0) {
                        setIsLoadingComments(false);
                    } else {
                        setShowComments(true)
                    }
                })
                .catch((err) => {
                    console.log(err.response)
                    setIsLoadingComments(false);
                })
        }
    }

    const commentField = useRef();
    const postComment = (parent) => {
        let commentText = commentField.current.value;
        if (commentText) {
            let formData = new FormData();
            formData.append("comment_text", commentText);
            formData.append("comment_parent", parent);
            let config = { headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: user.token,   
            }}
            axios.post('http://localhost:8000/api/'+post.id+'/comments/new/',formData, config)
                .then(function (response) {
                    // Post has been made successfully
                    if (comments) 
                    {
                        // If we already have comments
                        comments.push(response.data);
                        // React only rerenders if pointer to field is changed so 
                        // we have to make a new array
                        let newArr = [...comments];
                        setComments(newArr);
                    }
                    else {
                        setComments(Array.of(response.data));
                    }
                    commentField.current.value = "";
                    setShowComments(true)
                })
                .catch(function (error) {
                    console.log(error);
                });
        } else {
            console.log("empty field");
        }
    }

    const deletePost = () => {
        return
    }

    function splicedArray(array,index) {
        let nArr = [...array];
        nArr.splice(0,index+1);
        return nArr;
    }

    return (
        <article className="post card">
            <div className="d-flex user">
                <img
                    className="rounded-circle"
                    src={BACKEND_SERVER_DOMAIN + post.person.avatar}
                    alt="profile picture"
                />
                <div>
                    <h6>
                        <Link to={"/u/"+post.person.slug}>{post.person.first_name} {post.person.last_name}</Link>
                    </h6>
                    <span>{timeSince(post.created)}</span>
                </div>
                <div className="more-options">
                    <div className="dropleft">
                        <button
                            className="post-actions"
                            type="button"
                            id={"options"+post.id}
                            data-toggle="dropdown"
                            aria-haspopup="true"
                            aria-expanded="false"
                        >
                            <i className="fas fa-ellipsis-h"></i>
                        </button>
                        <div
                            className="dropdown-menu"
                            aria-labelledby={"options"+post.id}
                        >
                            <Link className="dropdown-item" to={"/post/"+post.id}>
                                View Post
                            </Link>
                            {(user.id == post.person_id) ? <button className="dropdown-item"
                            onClick={deletePost}>
                                Delete
                            </button> : ""}
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <p className="post-content">{post.post_text}</p>
                {(embedUrls) ? (embedUrls.map((url, index) => (
                    <a className="url" href={url.url} key={index} target="_blank">
                        <div>
                            <div className="utitle"><i className="fas fa-external-link-alt"></i> {url.title}</div>
                            {(url.description) ? <div className="udescription">{url.description}</div> : ""}
                            <div className="uurl">{url.url}</div>
                        </div>
                    </a>
                ))) : ""}
            </div>
            {post.post_image ? (
                <img src={BACKEND_SERVER_DOMAIN +post.post_image} className="rounded post-picture" />
            ) : (
                ""
            )}
            <div className="d-flex post-actions">
                <button
                    onClick={commentsToggle}>
                    <i className="far fa-comment-alt"></i>{(comments) ? (comments.length == 0) ? "No " : comments.length +" " : ""}Comments
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
                    {likesCount > 0 ? likesCount+' ' : ''}Like
                    {likesCount > 1 ? "s" : ""}
                </button>
                <button>
                    <i className="far fa-share-square"></i>Share
                </button>
            </div>
            <div className={(isLoadingComments) ? "slim-loading-bar":""}></div>
            
            {
                showComments && typeof comments == "object" ?
                    <div className="each-comment parent-comment">
                        {comments.slice().map((comment, index) => (
                            <div key={comment.id}>{(comment.comment_parent == 0) ?
                                    <CommentComponent 
                                        comment={comment}
                                        user={user}
                                        allComments={splicedArray(comments,index)}/>
                            : ''}
                            {(Number(index+1) == Number(comments.length) && isLoadingComments) ? setIsLoadingComments(false) : ''}
                            </div>                       
                        ))}
                    </div>
                : <div></div>
            }
            <div className="post-comment">
                <div className="d-flex user">
                    <input type="text" ref={commentField} placeholder="Write your comment..." />
                    <button onClick={() => postComment(0)}>
                        <i className="far fa-paper-plane"></i>
                    </button>
                </div>
            </div>
        </article>
    );
};

export default TimelinePost;
