import React from "react";
import Joi from "@hapi/joi";
import axios from "../axios";
import { Redirect } from "react-router-dom";
export default class Reset extends React.Component {
    state = {
        password: '',
        password2: '',
        submit: false,
    }

    handlePasswordChange = password => this.setState({password: password.target.value}); 
    handlePassword2Change = password2 => this.setState({password2: password2.target.value}); 
    handleSubmit = () => {
        const schema = Joi.object().keys({
            password: Joi.string().min(6).required(),
            password2: Joi.ref('password'),
            submit: Joi.boolean(),
        });
        const result = schema.validate(this.state);
        if(result.error) {
            // Message needs to be printed that details are incorrect
            alert('Password rules not met');
        } else {
            let axiosConfig = {
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Access-Control-Allow-Origin': "*",
                }
              };
              
            axios.post(`/auth/reset?${this.props.location.search.split('?')[1]}`, this.state, axiosConfig)
            .then(res => {
                if(res.status === 200) {
                    this.setState({submit: true});
                }
            })
            .catch(err => console.log(err));
        }
    }

    render() {
        return (
            <center>
                <div style={{
                    position: 'relative',
                    marginTop: '10vh'
                }}>
                    <p style={{ fontSize: '2.1em' }}>Set New Password</p>
                    <input type="password" id="password" placeholder="New Password" value={this.state.password} onChange={this.handlePasswordChange} />
                    <br />
                    <input type="password" id="rePassword" placeholder="New Password Again" value={this.state.password2} onChange={this.handlePassword2Change} />
                    <br />
                    <input type="submit" id="submit" value="Set Password" onClick={this.handleSubmit} />
                </div>
                {this.state.submit && <Redirect to="/login" /> }
            </center>
        );
    }
}