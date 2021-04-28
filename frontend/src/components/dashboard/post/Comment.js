import React, { useState, useRef, useEffect } from "react";
import { BACKEND_SERVER_DOMAIN } from "../../../settings";
import { timeSince } from "../../../utils/timesince";
import axios from "axios";
import { Link } from "react-router-dom";

export default function CommentComponent({
    user,
    allComments,
    comment
}) {
    const [isLiked, setIsLiked] = useState();
    const [likesCount, setLikesCount] = useState();
    const [comments, setComments] = useState();
    const [isDeleted, setIsDeleted] = useState(false);

    const btnRef = useRef();
    const commentField = useRef();
    const commentBoxDiv = useRef();

    useEffect(() => {
        setIsLiked(comment.comment_likes.persons && comment.comment_likes.persons.includes(user.id))
        setLikesCount(
            comment.comment_likes.persons != null
                ? comment.comment_likes.persons.length
                : 0
        );
        let subCmts = new Array();
        let possibleParents = new Array();
        possibleParents.push(comment.id);
        allComments.map((cmt) => {
            // check if subcomments' parent comment is not same as upper level comment's parent comment
            // check if subcomment's id is higher than upper level comments id
            // check if subcomment's parent comment is higher or equal to upper level comments id
            if (
                cmt.comment_parent != comment.comment_parent &&
                cmt.id > comment.id &&
                cmt.comment_parent >= comment.id &&
                possibleParents.includes(cmt.comment_parent)
            ) {
                subCmts.push(cmt);
                possibleParents.push(cmt.id);
            }
        });
        setComments(subCmts);
    }, []);

    const likeComment = () => {
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
            .put(
                BACKEND_SERVER_DOMAIN +
                    "/api/" +
                    comment.post_id +
                    "/comments/" +
                    comment.id +"/",
                {},
                config
            )
            .then(function (response) {
                let like = isLiked ? false : true;
                setIsLiked(like);
                if (like) {
                    setLikesCount(likesCount + 1);
                } else {
                    setLikesCount(likesCount - 1);
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

    const deleteComment = () => {
        let config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: user.token,
            },
        };
        axios
            .delete(
                BACKEND_SERVER_DOMAIN +
                    "/api/" +
                    comment.post_id +
                    "/comments/" +
                    comment.id + "/",
                config
            )
            .then(function (response) {
                if (response.data.action) {
                    setIsDeleted(true);
                }
            })
            .catch(function (err) {
                console.log(err);
            });
    }

    const showFieldToPostComment = () => {
        commentBoxDiv.current.classList.toggle("show");
        commentField.current.focus();
    };

    function splicedArray(array, index) {
        let nArr = [...array];
        nArr.splice(0, index + 1);
        return nArr;
    }

    const postComment = (parent) => {
        let commentText = commentField.current.value;
        if (commentText) {
            let formData = new FormData();
            formData.append("comment_text", commentText);
            formData.append("comment_parent", parent);
            let config = {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: user.token,
                },
            };
            axios
                .post(
                    BACKEND_SERVER_DOMAIN + "/api/" + comment.post_id + "/comments/new/",
                    formData,
                    config
                )
                .then(function (response) {
                    // Post has been made successfully
                    if (comments) {
                        // If we already have comments
                        comments.unshift(response.data);
                        // React only rerenders if pointer to field is changed so
                        // we have to make a new array
                        let newArr = [...comments];
                        setComments(newArr);
                        commentBoxDiv.current.classList.toggle("show");
                    } else {
                        setComments(Array.of(response.data));
                    }
                    commentField.current.value = "";
                })
                .catch(function (error) {
                    console.log(error);
                });
        } else {
            console.log("empty field");
        }
    };

    return (
        <div className="d-flex comment">
            <img
                className="avatar rounded-circle"
                src={(!isDeleted) ? (BACKEND_SERVER_DOMAIN + comment.person.avatar) : ""}
            />
            <div>
                <div className="content">
                    <Link to={"/u/"+comment.person.slug}><h6> 
                        {(!isDeleted) ? (comment.person.first_name + " " +comment.person.last_name) : "deleted"}
                    </h6></Link>
                    <p>{(!isDeleted) ? comment.comment_text : "deleted"}</p>
                </div>
                {(!isDeleted) ? (<div><div className="comment-options">
                    <button
                        ref={btnRef}
                        onClick={likeComment}
                        className={
                            isLiked
                                ? "btn btn-light btn-light-accent"
                                : "btn btn-light"
                        }
                    >
                        <i className="far fa-thumbs-up"></i>
                        {likesCount > 0 ? likesCount + " " : ""}Like
                        {likesCount > 1 ? "s" : ""}
                    </button>
                    <button onClick={showFieldToPostComment}>
                        <i className="fas fa-reply"></i> Reply
                    </button>
                    <span className="timesince">
                        {timeSince(comment.created)}
                    </span>
                    {Number(user.id) === Number(comment.person_id) ? (
                        <div className="dropright">
                            <button
                                className="comment-actions"
                                type="button"
                                id={"options"+comment.id}
                                data-toggle="dropdown"
                                aria-haspopup="true"
                                aria-expanded="false"
                            >
                                <i className="fas fa-ellipsis-h"></i>
                            </button>
                            <div
                                className="dropdown-menu"
                                aria-labelledby={"options"+comment.id}
                            >
                                <button className="dropdown-item"
                                onClick={deleteComment}>
                                    Delete
                                </button>
                            </div>
                        </div>
                    ) : (
                        ""
                    )}
                </div>
                <div className="post-comment" ref={commentBoxDiv}>
                    <div className="d-flex">
                        <input
                            type="text"
                            ref={commentField}
                            placeholder="Write your comment..."
                        />
                        <button onClick={() => postComment(comment.id)}>
                            <i className="far fa-paper-plane"></i>
                        </button>
                    </div>
                </div>
                </div>) : ''}
                {typeof comments == "object" ? (
                    <div className="each-comment">
                        {comments
                            .map((cmt, index) =>
                                cmt.comment_parent == comment.id ? (
                                    <CommentComponent
                                        comment={cmt}
                                        key={cmt.id}
                                        user={user}
                                        allComments={splicedArray(
                                            comments,
                                            index
                                        )}
                                    />
                                ) : (
                                    ""
                                )
                            )}
                    </div>
                ) : (
                    <div></div>
                )}
            </div>
        </div>
    );
}
