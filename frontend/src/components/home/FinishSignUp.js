import React, { useState, useRef } from 'react'
import axios from "axios";
import { BACKEND_SERVER_DOMAIN } from "../../settings";
import InputField from "../../utils/InputField";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser, logoutUser } from "../../redux/actions";
import { useSelector } from "react-redux";

export default function FinishSignUp() {
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const history = useHistory();

    const [avatar, setAvatar] = useState();
    const [tagline, setTagline] = useState("");
    const [home, setHome] = useState("");
    const [work, setWork] = useState("")
    const [apiResponse, setAPIResponse] = useState();

    let realProfilePictureBtnRef = useRef();
    let fakeProfilePictureBtnRef = useRef();
    let btnRef = useRef();

    const handleAvatar = ({ target }) => {
        if (target.value) {
            fakeProfilePictureBtnRef.current.textContent = target.value.match(/[\/\\]([\w\d\s\.\-\(\)]+)$/)[1];
            setAvatar(target.files[0]);
        }
    };
    
    const handleTagline = ({ target }) => {
        setTagline(target.value);
    };
    
    const handleWork = ({ target }) => {
        setWork(target.value);
    };
    
    const handleHome = ({ target }) => {
        setHome(target.value);
    };

    const clickChoosePicture = () => {
        realProfilePictureBtnRef.current.click();
    }

    const handleSignUp = ()=> {

        if (!avatar) {
            setAPIResponse(
                <div class="fw-bold text-uppercase text-danger text-sm">
                    Profile Picture is required!
                </div>
            );
            return;
        }

        if (btnRef.current) {
            btnRef.current.setAttribute("disabled", "disabled");
        }

        var formData = new FormData();
        formData.append("avatar", avatar);
        formData.append("work", work);
        formData.append("hometown", home);
        formData.append("tagline", tagline);
        
        let config = {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: user.token
            },
        };
        axios
            .put(
                BACKEND_SERVER_DOMAIN + "/api/person/signup",
                formData,
                config
            )
            .then(function (response) {
                dispatch(setUser(response.data));
                history.push("/dashboard");
            })
            .catch(function (error) {
                let output_error;
                try {
                    let error_data = error.response.data;
                    let error_type, error_msg;
                    for (var k in error_data) {
                        error_type = k;
                        error_msg = error_data[k];
                        break;
                    }
                    output_error =
                        error_type.replace("_", " ") + ": " + error_msg + ". Error processing the request.";
                } catch (error) {
                    output_error =
                        "error: sorry ,we are unable to serve your request.";
                }
                if (btnRef.current) {
                    btnRef.current.removeAttribute("disabled");
                }
                setAPIResponse(
                    <div class="fw-bold text-uppercase text-danger text-sm">
                        {output_error}
                    </div>
                );
            });
    }

    const leaveProcess = ()=> {
        dispatch(logoutUser());
        history.push("/home");        
    }

    return (
        <section className="signup">
            <div className="card">
                <h3>We are almost there.</h3>
                <div className="text-muted">
                    Tell us more about you so it will be easier for others to find you!
                </div>
                <div className="row g-3">
                    <div className="col-12">
                        <label className="form-label">Profile Picture&nbsp; <i className="far fa-file-image "></i></label>
                        <button className="choose-avatar form-control" ref={fakeProfilePictureBtnRef} onClick={clickChoosePicture}>
                            choose an image here
                        </button>
                        <input
                            className="d-none"
                            type="file"
                            name="avatar"
                            accept="image/*"
                            ref={realProfilePictureBtnRef}
                            onChange={handleAvatar}
                        />
                    </div>
                    <div className="col-12">
                        <InputField
                            label="Occupation"
                            onChange={handleWork}
                            name="work"
                            type="text"
                            placeholder="Accountant at ABC"
                        />
                    </div>
                    <div className="col-12">
                        <InputField
                            label="Where are you from?"
                            onChange={handleHome}
                            name="home"
                            type="text"
                            placeholder="Vancouver, BC"
                        />
                    </div>
                    <div className="col-12">
                        <InputField
                            label="Tagline"
                            onChange={handleTagline}
                            name="tagline"
                            type="text"
                            placeholder="I do cool stuff!"
                        />
                    </div>
                    <div className="col-12">
                        <button
                            type="submit"
                            ref={btnRef}
                            onClick={handleSignUp}
                            className="btn btn-primary btn-signup"
                        >
                            Let's Go!
                        </button>
                    </div>
                    <div className="col-12">
                        <div className="or">or</div>
                        <button
                            onClick={leaveProcess}
                            className="btn btn-outline-danger btn-signup">
                            Discontinue SignUp
                        </button>                        
                        {apiResponse}
                    </div>
                </div>
            </div>
        </section>
    )
}
