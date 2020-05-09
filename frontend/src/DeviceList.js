import React from 'react';
import Device from './Device';

class DeviceList extends React.Component
{

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