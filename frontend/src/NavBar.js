import React from 'react';
import SideMenu from './SideMenu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretSquareRight, faCaretSquareLeft } from '@fortawesome/free-solid-svg-icons'

class NavBar extends React.Component {

    constructor(props) {
        super(props);
        this.toggleMenu = this.toggleMenu.bind(this);
        this.state = {menuVisible: false};
    }

    toggleMenu() {
        this.setState({menuVisible: !this.state.menuVisible});
    }

    render() {

        let menuIcon;
        let menu;

        if (this.state.menuVisible) {
            menuIcon = <FontAwesomeIcon onClick={this.toggleMenu} icon={faCaretSquareRight} />;
            menu = <SideMenu />;
        } else {
            menuIcon = <FontAwesomeIcon onClick={this.toggleMenu} icon={faCaretSquareLeft} />;
            menu = null;
        }

        return (
            <div>
                <div className="navbar">
                    <h3>track.mattdavis.info</h3>
                    <h3 className="white-button">{menuIcon}</h3>
                </div>
                {menu}
            </div>
        );

    }

}

export default NavBar;