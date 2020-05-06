import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'

class Device extends React.Component
{

    constructor(props) {
        super(props);

        this.state = {
            device: props.device,
            show: false
        };

        this.toggleID = this.toggleID.bind(this);
    }

    render() {

        let idBox;
        let showHide;

        if (this.state.show === true) {
            idBox = <div className="id-box small-text">{this.state.device.id}</div>;
            showHide = <div className="white-button no-break" onClick={this.toggleID}>Hide <FontAwesomeIcon icon={faEyeSlash} /></div>;
        } else {
            idBox = <div className="id-box">••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••</div>;
            showHide = <div className="white-button no-break" onClick={this.toggleID}>Show <FontAwesomeIcon icon={faEye} /></div>;
        }

        return (
            <div key={this.state.device.id} className="flex-column device">
                <div className="flex-row">
                    <div>{this.state.device.name}</div>
                </div>
                <div className="flex-row">
                    {idBox}
                    {showHide}
                </div>
            </div>
        );
    }

    toggleID() {
        this.setState({
            show: !this.state.show
        });
    }

}


export default Device;