import React from "react";
import {Link, Redirect} from 'react-router-dom';
import * as Joi from "@hapi/joi";
import axios from "../axios";

export default class Register extends React.Component {

    state = {
        fname: '',
        lname: '',
        email: '',
        password: '',
        password2: '',
        loggedIn: false,
    }

    handleFnameChange = fname => this.setState({fname: fname.target.value}); 
    handleLnameChange = lname => this.setState({lname: lname.target.value}); 
    handleEmailChange = email => this.setState({email: email.target.value}); 
    handlePasswordChange = password => this.setState({password: password.target.value}); 
    handlePassword2Change = password2 => this.setState({password2: password2.target.value}); 
    handleRegister = () => {
        const schema = Joi.object().keys({
            fname: Joi.string().trim().min(3).max(20).required(),
            lname: Joi.string().trim().min(3).max(20).required(),
            email: Joi.string().trim().email({minDomainSegments: 2, tlds: { allow: ['com', 'net', 'org'] }}),
            password: Joi.string().min(6).required(),
            password2: Joi.ref('password'),
            loggedIn: Joi.boolean(),
        });
        const result = schema.validate(this.state);
        if(result.error) {
            // Message needs to be printed that details are incorrect
            console.log(result);
        } else {
            let axiosConfig = {
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                    "Access-Control-Allow-Origin": "*",
                }
              };
              
            axios.post('/auth/register', this.state, axiosConfig)
            .then(res => {
                if(res.status === 200) {
                    this.setState({loggedIn: true});
                }
            })
            .catch(err => alert('Already registered'));
        }
    }

    render() {
        return (
            <center>
                <div style={{
                    position: 'relative',
                    marginTop: '3vh'
                }}>
                    <p style={{ fontSize: '3.5em' }}>Register</p>
                    <p style={{ opacity: '0.76' }}>Already a User? <Link style={{ color: '#f5ba13' }} to="/login">Login</Link></p>
                        <input type="text" placeholder="First Name" value={this.state.fname} onChange={this.handleFnameChange} />
                        <br />
                        <input type="text" placeholder="Last Name" value={this.state.lname} onChange={this.handleLnameChange} />
                        <br />
                        <input type="email" placeholder="Email" value={this.state.email} onChange={this.handleEmailChange} />
                        <br />
                        <input type="password" placeholder="Password" value={this.state.password} onChange={this.handlePasswordChange} />
                        <br />
                        <input type="password" placeholder="Password Again" value={this.state.password2} onChange={this.handlePassword2Change}/>
                        <br />
                        <input type="submit" value="Sign Up" onClick={this.handleRegister} />
                </div>
                {this.state.loggedIn && <Redirect to="/login" />}
            </center>
        );
    }
}
