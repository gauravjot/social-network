import React, { useState, useRef, useEffect } from "react";
import { BACKEND_SERVER_DOMAIN } from "../../../settings";
import { timeSince } from "../../../utils/timesince";
import axios from "axios";

export default function CommentComponent({ user, allComments, liked, token, post_id, comment}) {
    const [isLiked, setIsLiked] = useState(liked);
    const [likesCount, setLikesCount] = useState((comment.comment_likes.persons != null) ? comment.comment_likes.persons.length : 0);
    const btnRef = useRef();
    const [comments, setComments] = useState();
    const commentField = useRef();
    const commentBoxDiv = useRef();

    useEffect(() => {
        setIsLiked(liked);
        setLikesCount((comment.comment_likes.persons != null) ? comment.comment_likes.persons.length : 0);
        let subCmts = new Array();
        let possibleParents = new Array();
        possibleParents.push(comment.id);
        allComments.map((cmt,index) => {
            // check if subcomments' parent comment is not same as upper level comment's parent comment
            // check if subcomment's id is higher than upper level comments id
            // check if subcomment's parent comment is higher or equal to upper level comments id
            if (cmt.comment_parent != comment.comment_parent 
                && cmt.id > comment.id 
                && cmt.comment_parent >= comment.id 
                && possibleParents.includes(cmt.comment_parent)) {
                subCmts.push(cmt);
                possibleParents.push(cmt.id);
            }
        })
        setComments(subCmts);
    }, []);


    const likeComment = () => {
        // if (btnRef.current) {
        //     btnRef.current.setAttribute("disabled", "disabled");
        // }
        // let config = {
        //     headers: {
        //         "Content-Type": "application/json",
        //         Authorization: token,
        //     },
        // };
        // axios
        //     .put(BACKEND_SERVER_DOMAIN + "/api/post/" + post.id, {}, config)
        //     .then(function (response) {
        //         let like = isLiked ? false : true;
        //         setIsLiked(like);
        //         if (like) {
        //             setLikesCount(likesCount+1);
        //         } else {
        //             setLikesCount(likesCount-1);
        //         }
        //         console.log(like);
        //         if (btnRef.current) {
        //             btnRef.current.removeAttribute("disabled");
        //         }
        //     })
        //     .catch(function (err) {
        //         console.log(err);
        //     });
    };

    const showFieldToPostComment = () => {
        commentBoxDiv.current.classList.toggle("show");
        commentField.current.focus();
    }

    function splicedArray(array,index) {
        let nArr = [...array];
        nArr.splice(0,index+1);
        return nArr;
    }
    
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
            axios.post('http://localhost:8000/api/'+post_id+'/comments/new/',formData, config)
                .then(function (response) {
                    // Post has been made successfully
                    if (comments) 
                    {
                        // If we already have comments
                        comments.unshift(response.data);
                        // React only rerenders if pointer to field is changed so 
                        // we have to make a new array
                        let newArr = [...comments];
                        setComments(newArr);
                        commentBoxDiv.current.classList.toggle("show");
                    }
                    else {
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
    }

    return (
        <div className="d-flex comment">
            <img
                className="avatar rounded-circle"
                src={BACKEND_SERVER_DOMAIN + comment.person.avatar}
            />
            <div>
                <div className="content">
                    <h6>
                    {comment.person.first_name} {comment.person.last_name}
                    </h6>
                    <p>{comment.comment_text}</p>
                </div>
                <div className="comment-options">
                    <button
                    ref={btnRef}
                    onClick={likeComment}
                    className={
                        isLiked
                            ? "btn btn-light btn-light-accent"
                            : "btn btn-light"
                    }>
                        <i className="far fa-thumbs-up"></i> Like
                    </button>
                    <button onClick={showFieldToPostComment}>
                        <i className="fas fa-reply"></i> Reply
                    </button>
                    <span className="timesince">
                        {timeSince(comment.created)}
                    </span>
                    {Number(user.id) === Number(comment.person_id) ? <button className="comment-actions"><i class="fas fa-ellipsis-h"></i></button> : ''}
                </div>
                <div className="post-comment" ref={commentBoxDiv}>
                    <div className="d-flex">
                        <input type="text" ref={commentField} placeholder="Write your comment..." />
                        <button onClick={() => postComment(comment.id)}>
                            <i className="far fa-paper-plane"></i>
                        </button>
                    </div>
                </div>
                {
                    typeof comments == "object" ?
                        <div className="each-comment">
                            {comments.slice().map((cmt, index) => (
                                (cmt.comment_parent == comment.id) ?
                                <CommentComponent comment={cmt} key={index}
                                    user={user}
                                    token={token}
                                    allComments={splicedArray(comments,index)}
                                    post_id={post_id}
                                    liked={cmt.comment_likes.persons && cmt.comment_likes.persons.includes(user.id)}/>
                                    : ''
                            ))}
                        </div>
                    : <div></div>
                }
            </div>
        </div>
    );
}
