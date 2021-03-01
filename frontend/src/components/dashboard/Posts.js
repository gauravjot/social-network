import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TimelinePost from './post/TimelinePost';
import { useDispatch, useSelector } from 'react-redux';
import { setPosts } from "../../redux/actions"

function Posts({token}) {

    let posts = useSelector(state => state.posts.posts);
    const dispatch = useDispatch();

    const getPosts = () => {
        let _posts = [];
        let config = { headers: {
            'Content-Type': 'application/json',
            Authorization: token,   
        }};
        axios.get('http://localhost:8000/api/person/posts', config)
            .then(function (response) {
                try {
                    _posts = response.data;
                    dispatch(setPosts(_posts));
                }
                catch(err){
                    console.log(err);
                }
            })
            .catch(function (err) {
                console.log(err);
            });
        return _posts;
    }

    useEffect(() => {
        if (posts === undefined) {
            posts = getPosts();
        }
    },[posts])

    return (posts != undefined) ? 
            (<section>
                {posts.map((post, index) => (
                    <div key={index}>
                        <TimelinePost post={post}/>
                    </div>
            ))}
            </section>) : (
            <div>
                Sorry, but we do not have any posts to serve yet.
            </div>
        );
}

export default Posts;