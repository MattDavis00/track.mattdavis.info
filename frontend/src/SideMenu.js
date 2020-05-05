import React from 'react';

class SideMenu extends React.Component
{
    render() {
        return (
            <div className="sideMenu">
                <div className="flex-column">
                    <h3>Devices</h3>
                    <div className="devices">
                        <div className="flex-row new-device">
                            <input placeholder="Friendly Name"></input>
                            <div className="button">Add</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default SideMenu;