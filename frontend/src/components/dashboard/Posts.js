import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TimelinePost from './post/TimelinePost';
import { useDispatch, useSelector } from 'react-redux';
import { setPosts } from "../../redux/actions"
import { BACKEND_SERVER_DOMAIN } from '../../settings'

function Posts({token}) {

    let posts = useSelector(state => state.posts.posts);
    let friends = useSelector(state => state.friends);
    const dispatch = useDispatch();

    const getPosts = () => {
        let config = { headers: {
            'Content-Type': 'application/json',
            Authorization: token,   
        }};
        axios.get(BACKEND_SERVER_DOMAIN + '/api/posts', config)
            .then(function (response) {
                dispatch(setPosts(response.data));
            })
            .catch(function (err) {
                console.log(err.response.data);
                posts = [];
            });
    }

    useEffect(() => {
        if (posts === undefined) {
            // posts does not exist in app state
            getPosts();
        } else if (typeof(posts) == "object") {
            // posts exist in app state
            if (Object.values(posts).length <= 0) {
                // if posts is empty
                getPosts();
            }
        }
        // if post exists in state and not empty then we just use
        // state data rather than making network request
    },[])

    return (posts !== undefined) ? 
            (<section className="timeline-posts">
                {posts.slice().reverse().map((post, index) => (
                    <div key={index}>
                        <TimelinePost post={post} friends={friends} token={token}/>
                    </div>
            ))}
            </section>) : (
            <div>
                Sorry, but we do not have any posts to serve yet.
            </div>
        );
}

export default Posts;