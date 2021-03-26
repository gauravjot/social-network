import React, {useState, useRef} from 'react';
import axios from 'axios';
import { BACKEND_SERVER_DOMAIN } from "../../../settings";

function CreatePost({user, newPost}) {
    const [postText, setPostText] = useState("");
    const [postImage, setPostImage] = useState(null);
    const [apiResponse, setAPIResponse] = useState();

    let btnRef = useRef();
    let postPictureBtnRef = useRef();
    let showBtn = useRef();
    let textAreaRef = useRef();
    const handlePostText = ({ target }) => {
        setPostText(target.value)
        textAreaRef.current.style.height = 'auto'
        textAreaRef.current.style.height = (textAreaRef.current.scrollHeight+2)+'px'
        if (target.value) {
            btnRef.current.removeAttribute("disabled");
            showBtn.current.classList.add("show-btn");
        } else {
            btnRef.current.setAttribute("disabled", "disabled");
            if (!postImage) {
                showBtn.current.classList.remove("show-btn");
            }
        }
    };
    const handlePostPicture = ({target}) => {
        if (target.value) {
            setPostImage(target.files[0]);
            setAPIResponse(<span>+&nbsp; {target.value.match(/[\/\\]([\w\d\s\.\-\(\)]+)$/)[1]}</span>);
            showBtn.current.classList.add("show-btn");
        }
    }
    const clickPostPicture = () => {
        postPictureBtnRef.current.click();
    }
    const clickMakePost = () => {
        if(btnRef.current){
            btnRef.current.setAttribute("disabled", "disabled");
        }
        let formData = new FormData();
        formData.append("post_text", postText);
        formData.append("post_image", postImage);
        let config = { headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: user.token,   
        }}
        axios.post('http://localhost:8000/api/post/new',formData, config)
            .then(function (response) {
                // Post has been made successfully
                setPostText("");
                textAreaRef.current.style.height = 'auto'
                setPostImage(null);
                newPost({...response.data,"person":user});
                setAPIResponse("");
                showBtn.current.classList.remove("show-btn");
                })
            .catch(function (error) {
                setAPIResponse(<span className="fw-bold text-uppercase text-danger text-sm">{error}</span>);
                if(btnRef.current){
                    btnRef.current.removeAttribute("disabled");
                }
            });
    }
    return(
        <section className="create-post">
            <h6>Post Something</h6>
            <div className="d-flex">
                <img className="rounded-circle" src={BACKEND_SERVER_DOMAIN+user.avatar} alt="profile-picture"/>
                <textarea ref={textAreaRef} placeholder="What's on your mind?" rows="1" onChange={handlePostText} name="post_text" value={postText}></textarea>
                <button onClick={clickPostPicture}><i class="far fa-file-image"></i></button>
            </div>
            <div className="submit-btn" ref={showBtn}>
                <button className="btn btn-primary btn-sm" type="submit" ref={btnRef} onClick={clickMakePost}>Create Post</button> {apiResponse}
            </div>
            <input type="file" accept="image/*" name="post_image" onChange={handlePostPicture} ref={postPictureBtnRef} className="d-none" />
        </section>
        );
}

export default CreatePost;