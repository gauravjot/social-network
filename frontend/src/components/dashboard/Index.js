import React from 'react'
import {useSelector, useDispatch} from 'react-redux';
import {Helmet} from 'react-helmet';
import { useHistory } from 'react-router-dom';
import { logoutUser } from '../../redux/actions';

import LeftSidebar from './LeftSidebar'
import CreatePost from './CreatePost';
import Posts from './Posts';

function Dashboard() {
    const dispatch = useDispatch();
    const history = useHistory();
    const token = useSelector(state => state.user.token);

    // if (token === null){
    //     history.push("/login");
    // }

    const logout = () => {
        dispatch(logoutUser());
    }

    return (
        <section>
        <Helmet>
            <title>Dashboard</title>
        </Helmet>
        <div className="row">
            <div className="col-lg-4">
                <LeftSidebar token={token}/>
            </div>
            <div className="col-lg-8">
                <CreatePost token={token}/>
                <Posts token={token}/>
            </div>
        </div>
        </section>
        );
}

export default Dashboard;