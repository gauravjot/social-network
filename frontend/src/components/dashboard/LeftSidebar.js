import React from 'react';
import logo from '../../assets/images/logo.png';
import FriendsPanel from './FriendsPanel';

function LeftSidebar() {
    return (
        <section>
            <div>
                <img src={logo} />
            </div>
            <FriendsPanel />
        </section>
    )
}

export default LeftSidebar;