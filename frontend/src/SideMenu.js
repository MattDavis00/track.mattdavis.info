import React from 'react';

class SideMenu extends React.Component
{

    constructor(props) {
        super(props);

        this.state = {
            newDeviceName: ""
        }

        this.handleInputChange = this.handleInputChange.bind(this);
        this.addDevice = this.addDevice.bind(this);
    }

    render() {
        return (
            <div className="sideMenu">
                <div className="flex-column">
                    <h3>Devices</h3>
                    <div className="devices">
                        <div className="flex-row new-device">
                            <input name="newDeviceName" value={this.state.newDeviceName} onChange={this.handleInputChange} placeholder="Friendly Name"></input>
                            <div onClick={this.addDevice} className="button">Add</div>
                        </div>
                    </div>
                </div>
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