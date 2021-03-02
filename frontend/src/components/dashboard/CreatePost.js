import React, {useState, useRef} from 'react';
import TextArea from '../../utils/TextArea';
import axios from 'axios';

function CreatePost({token}) {
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
                setAPIResponse(<span className="fw-bold text-uppercase px-4 text-success text-sm pb-2">Post has been made successfully</span>);
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
                setAPIResponse(<span className="fw-bold px-4 text-uppercase text-danger text-sm pb-2">{output_error}</span>);
                if(btnRef.current){
                    btnRef.current.removeAttribute("disabled");
                }
            });
    }
    return(
        <section>
            <div>
                <TextArea
                    placeholder="What's on your mind?"
                    onChange={handlePostText}
                    name="post_text"
                    value={postText}
                    />
            </div>
            <div className="mt-3">
                <button type="submit" ref={btnRef} onClick={handleMakePost} className="btn btn-primary fw-bold">Create Post</button>
                {apiResponse}
            </div>
            
        </section>
        );
}

export default CreatePost;