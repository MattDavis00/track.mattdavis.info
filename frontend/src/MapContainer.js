import React from 'react';

import './App.css';

import { Map, GoogleApiWrapper, Marker, Icon } from 'google-maps-react';

import mapMarker from './redCircle.png';
import currentMapMarker from './greenCircle.png';

const mapStyle = [
    {
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#212121"
        }
      ]
    },
    {
      "elementType": "labels.icon",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#212121"
        }
      ]
    },
    {
      "featureType": "administrative",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "featureType": "administrative.country",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#9e9e9e"
        }
      ]
    },
    {
      "featureType": "administrative.land_parcel",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "administrative.locality",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#bdbdbd"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#181818"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#616161"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#1b1b1b"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#2c2c2c"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#8a8a8a"
        }
      ]
    },
    {
      "featureType": "road.arterial",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#373737"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#3c3c3c"
        }
      ]
    },
    {
      "featureType": "road.highway.controlled_access",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#4e4e4e"
        }
      ]
    },
    {
      "featureType": "road.local",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#616161"
        }
      ]
    },
    {
      "featureType": "transit",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#000000"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#3d3d3d"
        }
      ]
    }
];

const containerStyle = {position: 'relative'};

class MapContainer extends React.Component {

    constructor(props) {
        super(props);
    }

    displayMarkers = () => {
      console.log(this.props.appState);
        return this.props.appState.nodes.map((node, index) => {
          return <Marker
            key={index}
            id={index}
            position={{lat: node.latitude, lng: node.longitude}}
            icon={{
              url: (index === this.props.appState.nodes.length - 1 ? currentMapMarker : mapMarker),
              anchor: new window.google.maps.Point(8, 8),
              scaledSize: new window.google.maps.Size(16, 16)
            }}
            onClick={() => console.log("You clicked me!")} />
        })
    }

    _mapLoaded(mapProps, map) {
        map.setOptions({
           styles: mapStyle
        })
    }

    render() {
        return (
            <div className="map-container">
                <Map
                google={this.props.google}
                zoom={6} initialCenter={{ lat: 54.541, lng: -4.083}}
                onReady={(mapProps, map) => this._mapLoaded(mapProps, map)}
                containerStyle = {containerStyle}
                disableDefaultUI = {true}
                >
                    {this.displayMarkers()}
                </Map>
            </div>
        );

    }

}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyBK0SNa9cPIfx600KxgNviICCCBGDdHW10'
})(MapContainer);
