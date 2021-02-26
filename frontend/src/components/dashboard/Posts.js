import React, { Component } from 'react';
import {connect} from 'react-redux';
import axios from 'axios';
import TimelinePost from './post/TimelinePost';

const mapStateToProps = state => ({
            token: state.token
});

class Posts extends Component {

    constructor(props) {
        super(props);
        this.state = {posts: [], apiResponse: ""};
        console.log("constructor");
    }

    async getPosts() {
        let posts =[];
        let apiResponse;
        const token = this.props.token;
        let config = { headers: {
            'Content-Type': 'application/json',
            Authorization: token,   
        }};
        await axios.get('http://localhost:8000/api/person/posts', config)
            .then(function (response) {
                // Posts
                try {
                    posts = response.data;
                    console.log(posts);
                    apiResponse = "";
                }
                catch(err){
                    console.log(err);
                    apiResponse = <span className="fw-bold px-4 text-uppercase text-danger text-sm pb-2">Unexpected error.</span>;
                }
            })
            .catch(function (error) {
                let error_data = error.response.data;
                let error_type, error_msg;
                for (var k in error_data) {
                    error_type = k;
                    error_msg = error_data[k];
                    break;
                }
                let output_error = error_type.replace("_"," ") + ": " + error_msg;
                apiResponse = <span className="fw-bold px-4 text-uppercase text-danger text-sm pb-2">{output_error}</span>;
            });
        this.setState({posts: posts, apiResponse: apiResponse})
    }

    componentDidMount() {
        if (this.state.posts.length == 0) {
            (async () => {
                await this.getPosts();    
            })();        
        }
        console.log("cdm");
    }

    render() {
        console.log("render");
        return(<section>
            {this.state.apiResponse}
            {this.state.posts.map((post, index) => (
                <div key={index}>
                    <TimelinePost post={post}/>
                </div>
            ))}
        </section>
        )};
}

export default connect(mapStateToProps)(Posts);