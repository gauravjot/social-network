import React from 'react';

const TimelinePost = ({post}) => {
    console.log(post);
    return (
        <div>{post.post_text}</div>
    );
};

export default TimelinePost;