import React from 'react'
import logo from '../../assets/images/logo.png'
import connections from '../../assets/images/connections.png'

function IntroPanel() {
    return (
        <div className="intro-panel">
            <img src={logo} className="logo"/>
            <h2>Connect with your Peers, Friends and other People with ease!</h2>
            <div className="img d-none d-sm-block">
                <img src={connections} className="img-preview"/>
            </div>
        </div>
        );
}

export default IntroPanel;