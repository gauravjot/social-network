import React from "react";
import SignUp from "./SignUp";
import FinishSignUp from "./FinishSignUp";
import { Helmet } from "react-helmet";
import logo from "../../assets/images/logo.png";
import ThemeToggle from "../global/ThemeToggle";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { themeApply } from "../global/ThemeApply";

function Index() {
    const user = useSelector((state) => state.user);
    const [isSecondStageSignUp, setIsSecondStageSignUp] = React.useState(
        user.token !== undefined && user.avatar == null
    );
    const history = useHistory();

    themeApply();

    if (user.token !== undefined && user.avatar != null) {
        history.push("/dashboard");
    }

    function secondStep() {
        setIsSecondStageSignUp(true);
    }

    return (
        <section className="home bg-social-icons">
            <Helmet>
                <title>Welcome to socialnetwork!</title>
            </Helmet>
            <div className="container">
                {isSecondStageSignUp ? (
                    <div className="col-lg-5 col-md-12 col-sm-12 center">
                        <img src={logo} className="logo" />
                        <FinishSignUp />
                    </div>
                ) : (
                    <div className="row g-3">
                        <div className="col-xl-7 col-lg-6 col-md-12">
                            <div className="intro-panel">
                                <div className="d-flex">
                                    <img src={logo} className="logo" />
                                    <div className="th-toggle">
                                        <ThemeToggle />
                                    </div>
                                </div>
                                <h2>
                                    Connect with your Peers, Friends and other
                                    People with ease!
                                </h2>
                                <p>
                                    <b>socialnetwork</b> helps you to connect
                                    and exchange thoughts, ideas, and content
                                    with your friends, colleagues and loved
                                    ones. It's as easy as using the form on the
                                    right and begin sharing what's on your mind!
                                </p>
                            </div>
                        </div>
                        <div className="col-xl-5 col-lg-6 col-md-12">
                            <SignUp secondStep={secondStep} />
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}

export default Index;
