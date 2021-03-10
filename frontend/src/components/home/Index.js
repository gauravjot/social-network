import React from "react";
import IntroPanel from "./IntroPanel";
import SignUp from "./SignUp";
import { Helmet } from "react-helmet";

function Index() {
    return (
        <section className="home">
            <Helmet>
                <title>Welcome to socialnetwork!</title>
            </Helmet>
            <div className="container">
                <div className="row g-3">
                    <div className="col-lg-7 col-md-5 col-sm-12">
                        <IntroPanel />
                    </div>
                    <div className="col-lg-5 col-md-7 col-sm-12">
                        <SignUp />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Index;
