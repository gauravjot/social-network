import React, {useState, useRef} from 'react';
import logo from '../../assets/images/logo.png';
import InputField from '../../utils/InputField';
import {Helmet} from 'react-helmet';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { updateToken } from '../../actions';
import { useHistory } from 'react-router-dom';

function LogIn() {
    const dispatch = useDispatch();
    const history = useHistory();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [apiResponse, setAPIResponse] = useState();

    const handleEmail = ({ target }) => {setEmail(target.value)};
    const handlePassword = ({ target }) => {setPassword(target.value)};
    let btnRef = useRef();
    const handleLogIn = () => {
        if(btnRef.current){
            btnRef.current.setAttribute("disabled", "disabled");
        }
        let data = {};
        data['email'] = email;
        data['password'] = password;
        let config = { headers: {
            'Content-Type': 'application/json',}
        }
        axios.post('http://localhost:8000/api/person/login',JSON.stringify(data), config)
            .then(function (response) {
                let token = response.data.token;
                // We got the token, yay!
                dispatch(updateToken(token));
                history.push("/dashboard")
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
                setAPIResponse(<div className="fw-bold text-uppercase text-danger text-sm pb-2">{output_error}</div>);
                if(btnRef.current){
                    btnRef.current.removeAttribute("disabled");
                }
            });
    };

    return (
        <section>
        <Helmet>
            <title>Log In to socialnetwork!</title>
        </Helmet>
        <div id="home" className="my-5 pt-3">
            <div className="col-lg-5 col-md-12 col-sm-12 mt-3 m-auto">
                <img src={logo} className="home-logo mx-2"/>
                <div className="card card-effect mx-3 mt-5">
                    <div className="row px-5 py-3">
                        <div className="col-12">
                            <div className="fs-3 pt-4 pb-3 mb-3">
                                <span>Log in</span>
                            </div>
                            {apiResponse}
                        </div>
                        <div className="col-12 mb-2">
                            <InputField
                                label="Email:"
                                onChange={handleEmail}
                                name="email"
                                type="email"
                                placeholder="you@company.com" />
                        </div>
                        <div className="col-12 mb-2">
                            <InputField
                                label="Password:"
                                onChange={handlePassword}
                                name="password"
                                type="password" />
                        </div>
                        <div className="col-12">
                            <div className="p-2"></div>
                            <div className="d-grid gap-2">
                                <button type="submit" ref={btnRef} onClick={handleLogIn} className="btn btn-primary text-sm fw-bold py-3">Log in!</button>
                            </div>
                        </div>
                        <div className="col-12">
                            <div className="pt-3 pb-3 mt-5">
                                <span>or would you like to <a href="#" className="text-decoration-none">Reset Password</a> or <a href="/" className="text-decoration-none">Sign Up</a></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </section>
    );
}

export default LogIn;