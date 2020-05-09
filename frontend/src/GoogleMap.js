

import React, {Component, createRef} from 'react';

import './App.css';

import mapMarker from './redCircle.png';
import currentMapMarker from './greenCircle.png';
import Utility from './Utility';

import mapStyle from './mapStyle';

class GoogleMap extends Component {

    constructor(props) {
        super(props);

        this.mapRef = createRef();
        this.map = null;

        this.state = {
            directions: null,
            markers: null
        }

        this.loadAPI = this.loadAPI.bind(this);
        this.createMap = this.createMap.bind(this);
        this.loadNodes = this.loadNodes.bind(this);
        this.loadDirections = this.loadDirections.bind(this);

    }

    loadAPI(API_KEY, callback) {

        if (document.getElementById("google-maps-api-script") === null) {
            console.log("Adding google maps script");
            const mapsAPIScript = document.createElement('script');

            mapsAPIScript.id = "google-maps-api-script";
            mapsAPIScript.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;
            // mapsAPIScript.src = `https://maps.googleapis.com/maps/api/js`;

            window.document.head.appendChild(mapsAPIScript);

            mapsAPIScript.addEventListener('load', () => {
                callback();
            });
        } else {
            console.log("Additional GoogleMap API load suppressed as the script is already present.");
        }

    }

    createMap() {
        this.map = new window.google.maps.Map(this.mapRef.current, {
            zoom: 6,
            center: {
              lat: 54.541,
              lng: -4.083,
            },
            styles: mapStyle,
            disableDefaultUI: true,
        });
    }

    loadNodes() {
        this.props.appState.nodes.map((node, index) => {
            return new window.google.maps.Marker({
                position: { lat: node.latitude, lng: node.longitude },
                map: this.map,
                icon: {
                    url: (index === this.props.appState.nodes.length - 1 ? currentMapMarker : mapMarker),
                    anchor: new window.google.maps.Point(8, 8),
                    scaledSize: new window.google.maps.Size(16, 16)
                }
            });
        });
    }

    loadDirections() {
        const directionsService = new window.google.maps.DirectionsService();
        const directionsRenderer = new window.google.maps.DirectionsRenderer();

        if (this.props.appState.nodes.length >= 2) {
            console.log(this.props.appState.nodes);

            const origin = this.props.appState.nodes[0];
            const dest = this.props.appState.nodes[this.props.appState.nodes.length - 1];
            
            const intermediateWaypoints = this.props.appState.nodes.filter((node, index) => {
                return (index !== 0 & index !== this.props.appState.nodes.length - 1);
            });

            const waypoints = intermediateWaypoints.map((node, index) => {
                const waypoint = {
                    location: {
                        lat: node.latitude,
                        lng: node.longitude
                    },
                    stopover: true
                }
                return waypoint;
            });

            console.log(waypoints);

            directionsService.route({
                origin: new window.google.maps.LatLng(origin.latitude, origin.longitude),
                destination: new window.google.maps.LatLng(dest.latitude, dest.longitude),
                waypoints: waypoints,
                travelMode: window.google.maps.TravelMode.DRIVING,
            }, (result, status) => {
                if (status === window.google.maps.DirectionsStatus.OK) {
                    console.log(result);
                    directionsRenderer.setDirections(result);
                    directionsRenderer.setMap(this.map);
                } else {
                    console.error(`error fetching directions ${result}`);
                }
            });
        }
    }

    componentDidMount() {
        this.loadAPI("AIzaSyBK0SNa9cPIfx600KxgNviICCCBGDdHW10", () => {
            this.createMap();
            Utility.getJSONData('/api/get-device-nodes', data => {
                this.props.appState.setState({nodes: data});
                this.loadNodes();
                this.loadDirections();
            });
        });
    }

    // MapComponent = (props) =>
    //     <GoogleMap
    //         defaultZoom={6}
    //         defaultCenter={{ lat: 54.541, lng: -4.083}}
    //         defaultOptions = {{
    //             styles: mapStyle,
    //             disableDefaultUI: true
    //         }}
    //     >
    //         {this.props.appState.nodes.map((node, index) =>
    //         <Marker
    //             key={index}
    //             id={index}
    //             position={{lat: node.latitude, lng: node.longitude}}
    //             icon={{
    //                 url: (index === this.props.appState.nodes.length - 1 ? currentMapMarker : mapMarker),
    //                 anchor: new window.google.maps.Point(8, 8),
    //                 scaledSize: new window.google.maps.Size(16, 16)
    //             }}
    //             onClick={() => console.log("You clicked me!")}
    //         />
    //         )}
    //         {this.state.directions && <DirectionsRenderer directions={this.state.directions}/>}
    //     </GoogleMap>;
    

    render() {
        return (
            <div
                ref={this.mapRef}
                className="map-container"
            />
        );
    }

}

export default GoogleMap;