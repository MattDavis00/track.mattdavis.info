import React from 'react';
import './App.css';

class NavBar extends React.Component {

    render() {
        return (
            <div className="navbar">
                <h3>track.mattdavis.info</h3>
                <h3 href="">Logout</h3>
                {/* <a href="">Logout</a> */}
            </div>
        );

    }

}

export default NavBar;