import React from "react";
import {
    Link,
    Redirect
} from "react-router-dom";
import Joi from '@hapi/joi';
import axios from "../axios";

export default class App extends React.Component {

    state = {
        email: '',
        password: '',
        loggedIn: false,
    }

    componentDidMount() {
        localStorage.clear();
        
    }

    handleEmailChange = email => this.setState({email: email.target.value}); 
    handlePasswordChange = password => this.setState({password: password.target.value});

    handleLogin = () => {
        const schema = Joi.object().keys({
            email: Joi.string().trim().email({minDomainSegments: 2, tlds: { allow: ['com', 'net', 'org'] }}),
            password: Joi.string().min(6).required(),
            loggedIn: Joi.boolean(),
        });

        let result = schema.validate(this.state);

        if(result.error) {

        } else {
            let axiosConfig = {
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                    "Access-Control-Allow-Origin": "*",
                }
              };
            axios.post('/login', this.state, axiosConfig)
            .then(res => {
                console.log(res.data.token);
                if(res.status === 200) {
                    localStorage.setItem('Authorization', res.data.token)
                    this.setState({loggedIn : true})
                } else {
                }
            })
            .catch(err => alert('Either email/password combination is incorrect or account is not verified. Check your email to verify the account. '));
        }

    }

    render() {
        return (
            <center>
                <div style={{
                    position: 'relative',
                    marginTop: '10vh'
                }}>
                    <p style={{ fontSize: '3.5em' }}>Login</p>
                    <p style={{ opacity: '0.76' }}>New to this site? <Link style={{ color: '#f5ba13' }} to="/register">Register</Link></p>
                        <br />
                        <input type="text" required placeholder="Email" value={this.state.email} onChange={this.handleEmailChange} />
                        <br />
                        <input type="password" required placeholder="Password" value={this.state.password} onChange={this.handlePasswordChange}/>
                        <br />
                        <Link style={{ color: '#f5ba13' }} to="/forgot">Forgot Password?</Link>
                        <br />
                        <br />
                        <input type="submit" value="Login" onClick={this.handleLogin} />
                </div>
                {this.state.loggedIn && <Redirect to="/" />}
            </center>
        );
    }
}
