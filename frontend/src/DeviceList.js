import React from 'react';
import Device from './Device';

class DeviceList extends React.Component
{

    constructor(props) {
        super(props);

        this.state = {
            devices: props.devices
        };
    }

    render() {

        const listItems = this.state.devices.map((device) =>
            <Device device={device} />
        );

        return (
            <div>{listItems}</div>
        );
    }

}


export default DeviceList;