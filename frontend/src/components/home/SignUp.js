import React, { useState, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/actions";

import InputField from "../../utils/InputField";
import { isValidDate } from "../../utils/CheckValidDate";
import { BACKEND_SERVER_DOMAIN } from "../../settings";

function SignUp({secondStep}) {
    const dispatch = useDispatch();

    const [first_name, setFirstName] = useState("");
    const [last_name, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [birthday, setBirthday] = useState("");
    const [password, setPassword] = useState("");

    const [confirmPassword, setConfirmPassword] = useState(undefined);
    const [apiResponse, setAPIResponse] = useState();

    const handleFirstName = ({ target }) => {
        setFirstName(target.value);
    };
    const handleLastName = ({ target }) => {
        setLastName(target.value);
    };
    const handleEmail = ({ target }) => {
        setEmail(target.value);
    };
    const handlePassword = ({ target }) => {
        setPassword(target.value);
    };
    const handleBirthday = ({ target }) => {
        setBirthday(target.value);
    };
    const handleConfirmPassword = ({ target }) => {
        if (password === target.value) {
            setConfirmPassword(true);
        } else {
            setConfirmPassword(false);
        }
    };


    let btnRef = useRef();
    const handleSignUp = () => {

        if (!first_name || !last_name || !email || !password || !birthday) {
            setAPIResponse(
                <div class="fw-bold text-uppercase text-danger text-sm">
                    Oops! Fields may not be blank.
                </div>
            );
            return;
        }

        if (!confirmPassword) {
            if (btnRef.current) {
                btnRef.current.removeAttribute("disabled");
            }
            setAPIResponse(
                <div class="fw-bold text-uppercase text-danger text-sm">
                    Oops! Passwords do not match.
                </div>
            );
            return;
        }

        if (btnRef.current) {
            btnRef.current.setAttribute("disabled", "disabled");
        }

        setAPIResponse("");

        let formData = {
            "first_name":first_name,
            "last_name":last_name,
            "email":email,
            "password":password,
            "birthday":birthday}
        
        let config = {
            headers: {
                "Content-Type": "application/json",
            },
        };
        if (isValidDate(birthday)) {
            axios
                .post(
                    BACKEND_SERVER_DOMAIN + "/api/person/signup/",
                    formData,
                    config
                )
                .then(function (response) {
                    // First Step of Sign up is success!!!
                    dispatch(setUser(response.data));
                    secondStep()
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
                            error_type.replace("_", " ") + ": " + error_msg;
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
        } else {
            setAPIResponse(
                <div class="fw-bold text-uppercase text-danger text-sm">
                    Sorry, You have to be of age 13 or over.
                </div>
            );
            if (btnRef.current) {
                btnRef.current.removeAttribute("disabled");
            }
        }
    };

    return (
        <section className="signup">
            <div className="card">
                <h3>Join Us Now!</h3>
                <div>
                    Already a member? <Link to={"/login"}>Sign in</Link>
                </div>
                <div className="text-sm text-muted">
                    All fields are mandatory.
                </div>
                <div className="row g-3">
                    <div className="col-md-6">
                        <InputField
                            label="First Name"
                            onChange={handleFirstName}
                            name="first_name"
                            type="text"
                            placeholder="John/Ashley"
                        />
                    </div>
                    <div className="col-md-6">
                        <InputField
                            label="Last Name"
                            onChange={handleLastName}
                            name="last_name"
                            type="text"
                            placeholder="Doe"
                        />
                    </div>
                    <div className="col-md-12">
                        <InputField
                            label="Email"
                            onChange={handleEmail}
                            name="email"
                            type="email"
                            placeholder="you@company.com"
                        />
                    </div>
                    <div className="col-md-12">
                        <InputField
                            label="Birthday"
                            onChange={handleBirthday}
                            name="birthday"
                            type="date"
                            placeholder="YYYY-MM-DD"
                        />
                    </div>
                    <div className="col-md-6">
                        <InputField
                            label="Password"
                            onChange={handlePassword}
                            name="password"
                            type="password"
                            placeholder="a strong password"
                        />
                    </div>
                    <div className="col-md-6">
                        <div className={confirmPassword == false ? "error-bg" : ""}>
                            <InputField
                                label="Retype Password"
                                onChange={handleConfirmPassword}
                                name="confirm_password"
                                type="password"
                            />
                        </div>
                    </div>
                    <div className="col-12">
                        <button
                            type="submit"
                            ref={btnRef}
                            onClick={handleSignUp}
                            className="btn btn-primary btn-signup"
                        >
                            Next
                        </button>
                        {apiResponse}
                    </div>
                </div>
                <div className="tos-text-signup">
                    By clicking the button above, you agree to our{" "}
                    <a href="#">terms of use</a> and{" "}
                    <a href="#">privacy policies</a>
                </div>
            </div>
        </section>
    );
}

export default SignUp;
