import React from "react";
import SignUp from "./SignUp";
import { Helmet } from "react-helmet";
import logo from '../../assets/images/logo.png'
import ThemeToggle from '../global/ThemeToggle'
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";

function Index() {
    const user = useSelector((state) => state.user);
    const history = useHistory();
    
    if (user.token !== undefined) {
        history.push("/dashboard");
    }
    return (
        <section className="home bg-social-icons">
            <Helmet>
                <title>Welcome to socialnetwork!</title>
            </Helmet>
            <div className="container">
                <div className="row">
                    <div className="col-xl-7 col-lg-6 col-md-12">
                        <div className="intro-panel">
                            <span className="d-none d-lg-block">
                            <br/>
                            <br/>
                            <br/>
                            </span>
                            <img src={logo} className="logo"/>
                            <h2>Connect with your Peers, Friends and other People with ease!</h2>
                            <p><b>socialnetwork</b> helps you to connect and exchange thoughts, ideas, and content with your friends, colleagues and loved ones. It's as easy as using the form on the right and begin sharing what's on your mind!</p>
                        </div>
                    </div>
                    <div className="col-xl-5 col-lg-6 col-md-12">
                        <div className="text-right px-3"><ThemeToggle /></div>
                        <SignUp />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Index;
