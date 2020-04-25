import React from 'react';

import './App.css';
import MapContainer from './MapContainer';
import NavBar from './NavBar';

function App() {
    return (
        <div className="app">
            <NavBar></NavBar>
            <MapContainer></MapContainer>
        </div>
    );
}

export default App;
