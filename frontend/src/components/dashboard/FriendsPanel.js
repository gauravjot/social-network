import React from 'react';
import logo from '../../assets/images/logo.png';

function FriendsPanel() {
    return(
        <section>
            <div>
                <img src={logo} />
            </div>
            <div className="text-uppercase text-muted fw-bold">
                Friends
            </div>
        </section>
        );
}

export default FriendsPanel;