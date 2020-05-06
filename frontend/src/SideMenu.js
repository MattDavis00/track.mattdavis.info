import React from 'react';
import DeviceList from './DeviceList';
import Utility from './Utility';

class SideMenu extends React.Component
{

    constructor(props) {
        super(props);

        this.state = {
            newDeviceName: "",
            devices: [
                {
                    id: "m7iU5udHvFiDvkWj7sno7yZxCZhGFQeJRpjfWtpVUAbm7dwoy8ugmOePqLiZ2Knh",
                    name: "A Cool Device"
                },
                {
                    id: "aaiU5udHvFiDvkWj7sno7yZxCZhGFQeJRpjfWtpVUAbm7dwoy8ugmOePqLiZ2Kaa",
                    name: "Another Device"
                }
            ],
            loggedIn: false
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.addDevice = this.addDevice.bind(this);
    }

    render() {

        let sideMenuContents;

        if(this.state.loggedIn === true) {
            sideMenuContents =
            <div className="devices flex-column">
                <h3>Devices</h3>
                <div className="horizontal-divider"></div>
                <DeviceList devices={this.state.devices} />
                <div className="horizontal-divider"></div>
                <div className="flex-row new-device">
                    <input name="newDeviceName" value={this.state.newDeviceName} onChange={this.handleInputChange} placeholder="Friendly Name"></input>
                    <div onClick={this.addDevice} className="button">Add</div>
                </div>
            </div>;
        } else {
            sideMenuContents =
            <div className="flex-column text-center">
                <h4>You are not logged in. To use the dashboard please log in through the Single Sign-On service.</h4>
                <div className="button" onClick={Utility.ssoRedirect}>Login</div>
            </div>
        }

        return (
            <div className="sideMenu flex-column">
                {sideMenuContents}
            </div>
        );
    }

    handleInputChange(event) {
        const target = event.target;
        let value;
        const name = target.name;

        if (target.type === "checkbox")
            value = target.checked;
        else
            value = target.value;

        this.setState({
            [name]: value
        });

    }

    addDevice() {

        const data = {
            deviceName: this.state.newDeviceName
        };

        const jsonResponse = fetch("/api/add-device",{
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {'Content-Type': 'application/json'},
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
            body: JSON.stringify(data)
        });

        console.log(jsonResponse);

        const res = JSON.parse(jsonResponse);

        console.log(res);

    }
}

export default SideMenu;