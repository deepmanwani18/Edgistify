import React from 'react';

export default class Comment extends React.Component {
    render() {
        return (
            <div className = "container">
                <div className="dialogbox">
                    <div className="body">
                        <div className="message">
                            <p style={{fontWeight: 'bold'}}>{this.props.authorName}</p>
                            <span>{this.props.caption}</span>
                            <p style={{color: 'blue'}} onClick={() => this.props.replyHandle(this.props.authorName)}>Reply</p>
                        </div>
                    </div>
                </div>
                </div>
        )
    }
}