import React from 'react';

const TimelinePost = ({post}) => {
    console.log(post);
    return (
        <div>{post.person}</div>
    );
};

export default TimelinePost;