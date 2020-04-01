import React from "react";
import axios from "./axios";
import Comment from "./Comment";

const axiosConfig = {
    headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        "Access-Control-Allow-Origin": "*",
        'Authorization': localStorage.getItem('Authorization'),
    }
};

export default class Post extends React.Component {

    state = { ...this.props, showCommentBox: false, newComment: '', comments: [] };

    showCommmentBoxhandler = () => {
        axios.get('/post/comments/'+this.state._id)
        .then(res => this.setState({comments: res.data}))
        .catch(err => console.log(err));

        this.setState({ showCommentBox: true });
    }

    handleNewComment = newComment => {
        this.setState({ newComment: newComment.target.value });
    }

    handleLike = id => {
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
                'Authorization': localStorage.getItem('Authorization'),
            }
        };
        axios.post('/post/like', { post: id }, axiosConfig)
            .then(res => this.setState({ likes: this.state.likes + 1 }))
            .catch(err => alert('Looks like you already liked that post'));
    }

    _createComment = () => {
        if (this.state.newComment.trim() === '') {
            return alert('Enter text');
        }

        axios.post('/post/comment', {
            caption: this.state.newComment,
            post: this.state._id
        }, axiosConfig)
            .then(res => {
                if (res.status === 200) {
                    this.setState({ newComment: '', comments: [res.data, ...this.state.comments]});
                }
            })
            .catch(err => console.log(err));
    }

    replyHandle = authorName => {
        this.setState({newComment: `@${authorName} `});
    }

    shareButtonhandler = id => {
        var dummy = document.createElement("input");
        document.body.appendChild(dummy);
        dummy.setAttribute('value', `http://localhost:3000/post?id=${id}`);
        dummy.select();
        document.execCommand("copy");
        document.body.removeChild(dummy);
        alert('Link copied to clipboard');
    }

    render() {
        const comments = this.state.comments ? (
            this.state.comments.map(comment => <Comment replyHandle={this.replyHandle} {...comment} key={comment._id} />)
        ) : (
                <></>
            );
        return (
            <div className="post">
                <br />
                <h4>{this.props.authorName}</h4>
                <p className="caption" style={{ fontFamily: 'Sans-serif' }}>{this.props.caption}</p>
                {
                    this.props.img && <a href={`http://localhost:4000/uploads/${this.props.img}`} target="_blank" rel="noopener noreferrer"> <img style={{ width: '24rem' }} src={`http://localhost:4000/uploads/${this.props.img}`} alt="" /></a>
                }
                <br />
                {localStorage.getItem('Authorization') && (<><div id="container">
                    <button className="learn-more" onClick={() => this.handleLike(this.props._id)}>
                        <span className="circle" aria-hidden="true">
                            <span className="icon arrow"></span>
                        </span>
                        <span className="button-text">Like({this.state.likes})</span>
                    </button>
                </div>
                    <div id="container" onClick={() => this.showCommmentBoxhandler()}>
                        <button className="learn-more">
                            <span className="circle" aria-hidden="true">
                                <span className="icon arrow"></span>
                            </span>
                            <span className="button-text">Comment</span>
                        </button>
                    </div>
                    <div id="container" onClick={() => this.shareButtonhandler(this.props._id)}>
                        <button className="learn-more">
                            <span className="circle" aria-hidden="true">
                                <span className="icon arrow"></span>
                            </span>
                            <span className="button-text">Share</span>
                        </button>
                    </div></>)}
                <br />
                <br />
                {comments}
                {this.state.showCommentBox && localStorage.getItem('Authorization') && (
                    <div>
                        <textarea style={{ overflow: 'hidden' }} className="comments" placeholder="Write a Comment..." value={this.state.newComment} onChange={this.handleNewComment} ></textarea>
                        <center><div><button className="learn-more" onClick={this._createComment}>
                            <span className="circle" aria-hidden="true">
                                <span className="icon arrow"></span>
                            </span>
                            <span className="button-text">Go</span>
                        </button></div></center>
                    </div>)
                }
    <br />
    <hr />
            </div>);
    }
}