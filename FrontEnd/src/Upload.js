import React from "react";
import axios from "./axios";

class Upload extends React.Component {

    state = {
        selectedFile: null,
        loaded: false,
        caption: '',
        submit: false,
    };

    triggerInputFile = () => {
        this.fileUpload.click()
    }

    handleCaptionChange = caption => {
        this.setState({caption: caption.target.value});
    }

    fileUploadhandler = file => {
        this.setState({
            selectedFile: file.target.files[0],
            loaded: true,
        })
    }

    _createPost = () => {
        if(this.state.caption.trim() === '') {
            return alert('Enter caption');
        }
        let axiosConfig = {
            headers: {
                'Content-Type': 'multipart/form-data',
                "Access-Control-Allow-Origin": "*",
                'Authorization': localStorage.getItem('Authorization'),
            }
          };

        const data = new FormData() 
        data.append('image', this.state.selectedFile)
        data.append('caption', this.state.caption)
        console.log(data);
        axios.post('/post', data, axiosConfig)
        .then(res => {
            if(res.status === 200) {
                this.setState({submit: true, caption: '', selectedFile: ''});
                this.props.addPost(res.data);
            }
        })
        .catch()
    }

    render() {
        return (<center>
            <textarea value={this.state.caption} onChange={this.handleCaptionChange} className="uploadtext" placeholder="What's on your mind?"></textarea>
            <div style={{ textAlign: '10rem' }}>
                <button className="learn-more" onClick={this.triggerInputFile}>
                    <input type="file" accept="image/*" onChange={this.fileUploadhandler} hidden ref={component => this.fileUpload = component} />
                    <span className="circle" aria-hidden="true">
                        <span className="icon arrow" />
                    </span>
                    <span className="button-text">Add Image</span>
                </button>
                <div >
                <button className="learn-more" onClick={this._createPost}>
                    <span className="circle" aria-hidden="true">
                        <span className="icon arrow"></span>
                    </span>
                    <span className="button-text">Post</span>
                </button>
            </div>
            </div>
        </center>)
    }
}
export default Upload;