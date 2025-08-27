

import * as React from 'react';
import { useDispatch } from 'react-redux';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import Stack from '@mui/material/Stack';
import { connect } from 'react-redux';
// import './stream_data.css';
import '@fontsource/roboto/300.css';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { gridGetRowsParamsSelector, propsStateInitializer } from '@mui/x-data-grid/internals';
import { gsap } from "gsap";
import { useThree } from '@react-three/fiber';
import { Vector3 } from 'three';
import { Stats, OrbitControls, Line, Text, useProgress, Loader, Html } from '@react-three/drei';

const CameraOrders = (params) => {
    const { camera } = useThree();
    const { controls } = useThree();
   
    // caluclate x,y,z and move camera
    if (params.orders.order_id == "") {
        return;
    }

    const targetPoint = new Vector3(params.orders['xLookAt'], params.orders['yLookAt'], 0); // Example target
    
    controls.enabled = false;
    gsap.to(camera.position, { x: params.orders['xpos'], y: params.orders['ypos'], z: params.orders['zpos'], duration: 1 });
    gsap.to(camera.lookAt, { x: params.orders['xLookAt'], y: params.orders['yLookAt'], z:0, duration: 0.5 });
    controls.enabled = true;
    controls.update();

    console.log(targetPoint);
   

    return (
        <>
             <OrbitControls target={targetPoint} position={[params.orders['xpos'], params.orders['ypos'], params.orders['zpos']]} dampingFactor={0.05} /> 
        </>
    )

}


const mapStateToProps = (state) => ({

    // currentFileName: state.acousticFileData.fileName,
    //ordered_file_list: state.ordered_stream_files,
    // stream_tag : state.selected_stream,
    // openGl: state.openGl,
    // app_init : state.app_init
    orders : state.camera_orders

})


const ConnectedCameraOrders = connect(mapStateToProps)(CameraOrders);
export default ConnectedCameraOrders;

