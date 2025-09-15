
import React, { Component,useMemo, useRef, useState } from 'react'
import Leaflet from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';
import Button from '@mui/material/Button';
import { connect } from 'react-redux';
import { useDispatch } from 'react-redux';

Leaflet.Icon.Default.imagePath =
    '../node_modules/leaflet'

delete Leaflet.Icon.Default.prototype._getIconUrl;

Leaflet.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});



//export default class ConnectedGISEngine extends Component {




const GISEngine = (props) => {
    const dispatch = useDispatch();
    const position = [38.371466433, -9.118744067]
    return (
        
       
        <MapContainer center={position} zoom={5} style={{ height: '800px' }} attributionControl={false}>
            <TileLayer
                //attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attributionControl={false}
            />
            <Marker
                position={position}
                eventHandlers={{
                    mouseover: (event) => event.target.openPopup(),
                }}
                
            >
                <Popup>
                    <Button variant="outlined" color="success" onClick={() => {
                        dispatch({ type: "STREAM_SELECTED", payload: "marlin_repmus_live" });
                        console.log(props.ordered_files);
                        let f_file = props.ordered_files["marlin_repmus_live"][0].filename;
                        let t_ts = props.ordered_files["marlin_repmus_live"][0]["datetime"]["date"];
                        console.log(f_file);
                        console.log(t_ts);
                        dispatch({ type: "FILE_SELECTED", payload: { 'name': f_file, 'timestamp': t_ts, 'active_stream': props.selected_stream } });
                        console.log("marlin_repmus_live");
                    }}>Connect REPMUS</Button>
                </Popup>
            </Marker>
        </MapContainer>
    )
    
}



const mapStateToProps = (state) => ({

  
    ordered_files: state.ordered_stream_files,

})

const ConnectedGISEngine = connect(mapStateToProps)(GISEngine);
export default ConnectedGISEngine;

