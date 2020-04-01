import React from "react";
import { Link } from "react-router-dom";

class Heading extends React.Component {
    render() {
        return (
            <header>
                <center>
                    <h1 style={{ fontFamily: "Pacifico", color: "black" }}>Edgistify</h1>
                    <span><Link style={{ color: '#f5ba13' }} to="/">Home</Link></span>
                    <span style={{ marginLeft: '2rem' }}>
                        {this.props.loggedIn ? (<Link style={{ color: '#f5ba13' }} to="/login">Logout</Link>) : (<Link style={{ color: '#f5ba13' }} to="/login">Login</Link>)}
                    </span>
                </center>
            </header>
        );
    }
}
export default Heading;
