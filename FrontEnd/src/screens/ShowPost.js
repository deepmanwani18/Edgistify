import React from "react";
import Post from "../Post";
import axios from "../axios";
export default class ShowPost extends React.Component {
    
    state = {
        post: {}
    }

    componentDidMount() {
        axios.get(`/post/${this.props.location.search.split('?')[1].split('=')[1]}`)
        .then(res => this.setState({post: res.data}))
        .catch(err => console.log(err));
    }
    
    render() {

        return (
            <div>

            {/* {localStorage.getItem('Authorization') && <Upload />} */}
                
                {this.state.post && <Post {...this.state.post} />}
            </div>
                // <Post {...this.state.post} />
        );
    }

}