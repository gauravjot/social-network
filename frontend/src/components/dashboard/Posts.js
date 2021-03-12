import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TimelinePost from './post/TimelinePost';
import { useDispatch, useSelector } from 'react-redux';
import { setPosts } from "../../redux/actions"
import { BACKEND_SERVER_DOMAIN } from '../../settings'

function Posts({token}) {

    const user = useSelector((state) => state.user);
    const posts = useSelector(state => state.posts.posts);
    const friends = useSelector(state => state.friends);
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
                console.log(err);
                dispatch(setPosts([]));
            });
    }

    useEffect(() => {
        getPosts();
        // if (posts === undefined) {
        //     // posts does not exist in app state
        //     getPosts();
        // } else if (typeof(posts) == "object") {
        //     // posts exist in app state
        //     if (Object.values(posts).length <= 0) {
        //         // if posts is empty
        //         getPosts();
        //     }
        // }
        // // if post exists in state and not empty then we just use
        // // state data rather than making network request
    },[])

    return (posts && posts.length > 0) ? 
            (<section className="timeline-posts">
                {posts.slice().reverse().map((post, index) => (
                    <div key={post.id}>
                        <TimelinePost user={user} post={post} friends={friends} token={token} liked={post.likes.persons && post.likes.persons.includes(user.id)}/>
                    </div>
            ))}
            </section>) : (
            <div className="sorry">
                Sorry, but we could not have any posts for you yet. Add friends or post something to get started!
            </div>
        );
}

export default Posts;