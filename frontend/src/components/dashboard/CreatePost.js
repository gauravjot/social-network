import React, {useState, useRef} from 'react';
import axios from 'axios';
import { BACKEND_SERVER_DOMAIN } from "../../settings";

function CreatePost({avatar, token}) {
    const [postText, setPostText] = useState("");
    const [apiResponse, setAPIResponse] = useState();

    let btnRef = useRef();
    const handlePostText = ({ target }) => {setPostText(target.value)};
    const handleMakePost = () => {
        if(btnRef.current){
            btnRef.current.setAttribute("disabled", "disabled");
        }
        let data = {};
        data['post_text'] = postText;
        let config = { headers: {
            'Content-Type': 'application/json',
            Authorization: token,   
        }}
        axios.post('http://localhost:8000/api/post/new',JSON.stringify(data), config)
            .then(function (response) {
                // Post has been made successfully
                setPostText("");
                setAPIResponse(<span className="fw-bold text-uppercase text-success text-sm">Post has been made successfully</span>);
                btnRef.current.removeAttribute("disabled");
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
                setAPIResponse(<span className="fw-bold text-uppercase text-danger text-sm">{output_error}</span>);
                if(btnRef.current){
                    btnRef.current.removeAttribute("disabled");
                }
            });
    }
    return(
        <section className="create-post">
            <h6>Post Something</h6>
            <div className="d-flex">
                <img className="rounded-circle" src={BACKEND_SERVER_DOMAIN+avatar} alt="profile-picture"/>
                <textarea placeholder="What's on your mind?" rows="1" onChange={handlePostText} name="post_text" value={postText}></textarea>
                <button><i className="far fa-image"></i></button>
            </div>
            <div className="submit-btn">
                <button className="btn btn-primary btn-sm" type="submit" ref={btnRef} onClick={handleMakePost}>Create Post</button> {apiResponse}
            </div>
        </section>
        );
}

export default CreatePost;