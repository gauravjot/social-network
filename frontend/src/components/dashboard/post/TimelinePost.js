/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useRef, useEffect } from "react";
import { timeSince } from "../../../utils/timesince";
import { BACKEND_SERVER_DOMAIN } from "../../../settings";
import CommentComponent from "./Comment";
import axios from "axios";

const TimelinePost = ({ user, post, friends, token, liked }) => {
    const [author, setAuthor] = useState("");
    const [isLiked, setIsLiked] = useState(liked);
    const [comments, setComments] = useState();
    const [showComments, setShowComments] = useState(false);
    const [likesCount, setLikesCount] = useState((post.likes.persons != null) ? post.likes.persons.length : 0);
    const [isLoadingComments,setIsLoadingComments] = useState(false); 
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
        setLikesCount((post.likes.persons != null) ? post.likes.persons.length : 0);
    }, [post.person_id,liked,post.likes.persons]);

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
                let like = isLiked ? false : true;
                setIsLiked(like);
                if (like) {
                    setLikesCount(likesCount+1);
                } else {
                    setLikesCount(likesCount-1);
                }
                console.log(like);
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
            axios.get(BACKEND_SERVER_DOMAIN + "/api/" + post.id + "/comments/", {headers:{Authorization: token}})
                .then(function (response) {
                    setShowComments(true)
                    setComments(response.data.comments)
                    if (response.data.comments) {
                        setIsLoadingComments(false);
                    }
                })
                .catch((err) => {
                    console.log(err.response)
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
                Authorization: token,   
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

    function splicedArray(array,index) {
        let nArr = [...array];
        nArr.splice(0,index+1);
        return nArr;
    }

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
                <button
                    onClick={commentsToggle}>
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
                            <div>{(comment.comment_parent == 0) ?
                                    <CommentComponent comment={comment} key={index}
                                        user={user}
                                        token={token}
                                        allComments={splicedArray(comments,index)}
                                        post_id={post.id}
                                        liked={comment.comment_likes.persons && comment.comment_likes.persons.includes(user.id)}/>
                            : ''}
                            {(Number(index+1) == Number(comments.length) && isLoadingComments) ? setIsLoadingComments(false) : ''}</div>                       
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
        </div>
    );
};

export default TimelinePost;
