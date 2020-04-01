import React from "react";
import Home from "./screens/Home"
import Heading from "./Heading";
import Footer from "./Footer";
import Login from "./screens/Login";
import Forgot from "./screens/Forgot";
import Register from "./screens/Register";
import ShowPost from "./screens/ShowPost";
import {
    BrowserRouter as Router,
    Route,
} from "react-router-dom";
import Reset from "./screens/Reset";

export default class App extends React.Component {

    state = {
        status: false,
    }


    componentDidMount() {
        setInterval(() => {
            if (!localStorage.getItem('Authorization')) {
                this.updateState(false)
            }
            else if (!this.state.status) {
                this.updateState(true)
            }
        }, 500);
    }

    updateState = (value) => {
        this.setState({ status: value })
    }

    render() {
        return (
            <Router>
                <div>
                    <Heading loggedIn={this.state.status} />
                    <Route path="/login" component={Login} />
                    <Route path="/register" component={Register} />
                    <Route path="/forgot" component={Forgot} />
                    <Route path="/reset" component={Reset} />
                    <Route path="/post" component={ShowPost} />
                    <Route exact path="/" component={Home} />
                    <Footer />
                </div>
            </Router>
        );
    }
}
