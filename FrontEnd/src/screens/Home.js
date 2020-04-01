import React from "react";
import Post from "../Post";
import axios from "../axios";
import Upload from "../Upload";
export default class Home extends React.Component {
    
    state = {
        posts: []
    }

    componentDidMount() {

        console.log(typeof localStorage.getItem('Authorization'))

        axios.get('/post')
        .then(res => this.setState({posts: res.data}))
        .catch(err => console.log(err));
    }

    addPost = post => {
        this.setState({posts: [post, ...this.state.posts]});
    }
    
    render() {

        const posts = this.state.posts.map((post, index) => <Post key={post._id} {...post} />)

        return (
            <div>
                {localStorage.getItem('Authorization') && <Upload addPost={this.addPost} />}
                
                {posts}
                {/* <Post /> */}

            </div>
        );
    }

}