import React from 'react'
import logo from '../../assets/images/logo.png'
import connections from '../../assets/images/connections.png'

function IntroPanel() {
    return (
        <div>
            <img src={logo} className="home-logo"/>
            <div className="mt-5">
                <h2 className="home-headline">Connect with your Peers, Friends and other People with ease!</h2>
            </div>
            <div className="mt-5 home-image d-none d-sm-block">
                <img src={connections} className="home-image-preview"/>
            </div>
        </div>
        );
}

export default IntroPanel;