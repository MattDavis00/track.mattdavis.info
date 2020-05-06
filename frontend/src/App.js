import React from 'react';

import './App.css';
import MapContainer from './MapContainer';
import NavBar from './NavBar';

class App extends React.Component {

    constructor(props) {
        super(props);

        this.setAppState = this.setAppState.bind(this);

        this.state = {
            loggedIn: false,
            userID: null,
            devices: [],
            setState: this.setAppState
        };
    }

    render() {
        return (
            <div className="app">
                <NavBar appState={this.state}></NavBar>
                <MapContainer appState={this.state}></MapContainer>
            </div>
        );
    }

    setAppState(props) {
        this.setState(props);
    }

}

export default App;
