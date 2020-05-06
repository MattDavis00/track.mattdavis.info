import React from 'react';
import Device from './Device';

class DeviceList extends React.Component
{

    constructor(props) {
        super(props);
    }

    render() {

        const listItems = this.props.appState.devices.map((device) =>
            <Device device={device} />
        );

        return (
            <div>{listItems}</div>
        );
    }

}


export default DeviceList;