import React, { useState, useRef } from "react";
import logo from "../../assets/images/logo.png";
import InputField from "../../utils/InputField";
import { Helmet } from "react-helmet";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser, setFriends } from "../../redux/actions";
import { useHistory } from "react-router-dom";
import { BACKEND_SERVER_DOMAIN } from "../../settings";
import { Link } from "react-router-dom";

function LogIn() {
    const dispatch = useDispatch();
    const history = useHistory();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [apiResponse, setAPIResponse] = useState();

    const handleEmail = ({ target }) => {
        setEmail(target.value);
    };
    const handlePassword = ({ target }) => {
        setPassword(target.value);
    };
    let btnRef = useRef();

    const handleLogIn = () => {
        if (btnRef.current) {
            btnRef.current.setAttribute("disabled", "disabled");
        }
        let config = {
            headers: {
                "Content-Type": "application/json",
            },
        };
        axios
            .post(
                BACKEND_SERVER_DOMAIN + "/api/person/login",
                JSON.stringify({ email: email, password: password }),
                config
            )
            .then(function (response) {
                dispatch(setUser(response.data));
                let config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: response.data.token,
                    },
                };
                axios
                    .get(BACKEND_SERVER_DOMAIN + "/api/friends", config)
                    .then((res) => {
                        dispatch(setFriends(res.data));
                        history.push("/dashboard");
                    })
                    .catch(function(error) {
                        history.push("/dashboard");
                    });
            })
            .catch(function (error) {
                setAPIResponse(
                    <div className="fw-bold text-uppercase text-danger text-sm pb-2">
                        {error.response.data.error}
                    </div>
                );
                if (btnRef.current) {
                    btnRef.current.removeAttribute("disabled");
                }
            });
    };

    return (
        <section className="login">
            <Helmet>
                <title>Log In to socialnetwork!</title>
            </Helmet>
            <div className="container">
                <div className="col-lg-5 col-md-12 col-sm-12">
                    <img src={logo} className="logo" />
                    <div className="card">
                        <h3>Log in</h3>
                        {apiResponse}
                        <InputField
                            label="Email:"
                            onChange={handleEmail}
                            name="email"
                            type="email"
                            placeholder="you@company.com"
                        />
                        <InputField
                            label="Password:"
                            onChange={handlePassword}
                            name="password"
                            type="password"
                        />
                        <button
                            type="submit"
                            ref={btnRef}
                            onClick={handleLogIn}
                            className="btn btn-primary"
                        >
                            Log in!
                        </button>
                        <span>
                            or would you like to <Link to="#">Reset Password</Link>{" "}
                            or <Link to="/">Sign Up</Link>
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default LogIn;
