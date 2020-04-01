import React from "react";
import { Link } from "react-router-dom";
import Joi from "@hapi/joi";
import axios from "../axios";

export default class App extends React.Component {

    state = {
        email: '',
        submit: false,
    }

    handleEmailChange = email => this.setState({ email: email.target.value });

    handleSubmit = () => {
        const schema = Joi.object().keys({
            email: Joi.string().trim().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'org'] } }),
            submit: Joi.boolean(),
        });
        const result = schema.validate(this.state);
        if (result.error) {
            // Message needs to be printed that details are incorrect
            console.log(result);
        } else {
            let axiosConfig = {
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                    "Access-Control-Allow-Origin": "*",
                }
            };

            axios.post('/auth/forgot', this.state, axiosConfig)
                .then(res => {
                    if (res.status === 200) {
                        alert('Check your email for the link');
                        this.setState({ submit: true });
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
                    <p style={{ fontSize: '2.1em' }}>Trouble Logging in?</p>
                    <p style={{ overflowWrap: 'revert' }}>Enter your username or email and we'll send <br />you a link to get back into your account.</p>
                    <br />
                    <input type="text" placeholder="Email" value={this.state.email} onChange={this.handleEmailChange} />
                    <br />

                    <input type="submit" value="Send Login Link" onClick={this.handleSubmit} />
                    <br />
                    <Link to="/login">
                        <input type="submit" value="Back To Login" />
                    </Link>
                </div>
                {/* {this.state.submit && <Redirect to="" />} */}
            </center>);

    }
}