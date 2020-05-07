import React from 'react';

import './App.css';
import MapContainer from './MapContainer';
import NavBar from './NavBar';

import Utility from './Utility';

class App extends React.Component {

    constructor(props) {
        super(props);

        this.setAppState = this.setAppState.bind(this);

        this.state = {
            loggedIn: false,
            userID: null,
            devices: [],
            nodes: [],
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

    componentDidMount() {
        Utility.getUserMeta((meta) => { // Update loggedIn values
            this.setState(meta);
            Utility.getJSONData('/api/get-device-nodes', data => {
                this.setState({nodes: data});
            });
        });
    }

    setAppState(props) {
        this.setState(props);
    }

}

export default App;
