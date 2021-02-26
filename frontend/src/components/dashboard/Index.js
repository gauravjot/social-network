import React from 'react'
import {useSelector, useDispatch} from 'react-redux';
import {Helmet} from 'react-helmet';
import { useHistory } from 'react-router-dom';
import { removeToken } from '../../actions';

import FriendsPanel from './FriendsPanel'
import CreatePost from './CreatePost';
import Posts from './Posts';

function Dashboard() {
    const dispatch = useDispatch();
    const history = useHistory();
    const token = useSelector(state => state.token);

    // if (token === null){
    //     history.push("/login");
    // }

    const logout = () => {
        dispatch(removeToken());
    }

    return (
        <section>
        <Helmet>
            <title>Dashboard</title>
        </Helmet>
        <div className="row">
            <div className="col-lg-4">
                <FriendsPanel />
            </div>
            <div className="col-lg-8">
                <CreatePost />
                <Posts />
            </div>
        </div>
        </section>
        );
}

export default Dashboard;