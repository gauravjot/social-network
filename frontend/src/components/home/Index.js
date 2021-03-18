import React from "react";
import SignUp from "./SignUp";
import { Helmet } from "react-helmet";
import logo from '../../assets/images/logo.png'
import connections from '../../assets/images/connections-2.png'

function Index() {
    return (
        <section className="home bg-social-icons">
            <Helmet>
                <title>Welcome to socialnetwork!</title>
            </Helmet>
            <div className="container">
                <div className="row g-3">
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
                        <SignUp />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Index;
