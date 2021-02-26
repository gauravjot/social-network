import React from 'react'
import {useSelector, useDispatch} from 'react-redux';
import {Helmet} from 'react-helmet';
import { useHistory } from 'react-router-dom';
import { removeToken } from '../../actions';

function Dashboard() {
    const dispatch = useDispatch();
    const history = useHistory();
    const token = useSelector(state => state.token);

    if (token === null){
        history.push("/login");
    }

    const logout = () => {
        dispatch(removeToken());
    }

    return (
        <section>
        <Helmet>
            <title>Dashboard</title>
        </Helmet>
        </section>
        );
}

export default Dashboard;