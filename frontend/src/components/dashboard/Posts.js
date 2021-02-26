import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import axios from 'axios';

function Posts() {
    const token = useSelector(state => state.token);
    const [apiResponse, setAPIResponse] = useState();
    const [posts, setPosts] = useState("");

    useEffect(() => {
        let config = { headers: {
            'Content-Type': 'application/json',
            Authorization: token,   
        }}
        axios.get('http://localhost:8000/api/person/posts',{}, config)
            .then(function (response) {
                // Posts
            })
            .catch(function (error) {
                let error_data = error.response.data;
                let error_type, error_msg;
                for (var k in error_data) {
                    error_type = k;
                    error_msg = error_data[k];
                    break;
                }
                let output_error = error_type.replace("_"," ") + ": " + error_msg;
                setAPIResponse(<span className="fw-bold px-4 text-uppercase text-danger text-sm pb-2">{output_error}</span>);
            });
    },[posts])

    return(
        <section>
            {apiResponse}
        </section>
        );
}

export default Posts;