import React from 'react';

import './App.css';
import MapContainer from './MapContainer';
import NavBar from './NavBar';

class App extends React.Component {

    render() {
        return (
            <div className="app">
                <NavBar></NavBar>
                <MapContainer></MapContainer>
            </div>
        );
    }

}

export default App;
