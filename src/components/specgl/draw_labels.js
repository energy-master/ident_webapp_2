import { createRoot } from 'react-dom/client'
import React, { useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, extend } from '@react-three/fiber'
import { GridMoreVertIcon, renderActionsCell } from '@mui/x-data-grid'
import * as THREE from 'three';
import { DoubleSide } from 'three'

import { Stats, OrbitControls, Line, Points } from '@react-three/drei';
import { useControls } from 'leva';
import { columnResizeStateInitializer, escapeRegExp, useGridParamsApi } from '@mui/x-data-grid/internals';
import { getListItemSecondaryActionClassesUtilityClass } from '@mui/material/ListItemSecondaryAction';
import { connect } from 'react-redux';
import { useDispatch } from 'react-redux';
import { FirstPersonControls } from '@react-three/drei';
import { MeshLineGeometry, MeshLineMaterial, raycast } from 'meshline'
extend({ MeshLineGeometry, MeshLineMaterial })


const DrawLabels = (props) => {

    const dispatch = useDispatch();

    const GetFileLocation = (label) => {
        console.log(props.ordered_stream_files);
        console.log("loop");
        let ordered_idx = -1;
        let diff = 0;
        let sel_diff = 99999;
        for (let i = 0; i < props.ordered_stream_files[props.selected_stream[0]].length; i++){
            let file_time_zulu = props.ordered_stream_files[props.selected_stream[0]][i].timeZulu;
            
            let label_time = label.timestamp_start;
            
            let date1 = new Date(file_time_zulu);
            let date2 = new Date(label_time);
            // console.log(date1, date2);
            diff = (date1.getTime() - date2.getTime())/1000;
            if (diff >= 0){
                // console.log(diff);
                if (diff < 300) {
                    if (diff < sel_diff) {
                        sel_diff = diff;
                        ordered_idx = i;
                    }
                    
                    
                }
                
            }
        }

        return [ordered_idx,sel_diff];

    }


    const get_delta_x_from_t = (time_s, filename) => {

        console.log(time_s, filename);
        let gl_delta_x = 0;
        // console.log(filename);
        try {
            gl_delta_x = ((time_s / props.file_data[props.selected_stream][filename].elapsed_time)) * props.gl_data.x_width;
        }
        catch (error) {
            gl_delta_x = 0;
            // console.log(error);
        }
        //console.log(time_s, props.file_data[props.selected_stream][filename].elapsed_time,gl_delta_x)
        return (gl_delta_x);

    }
    let dataSetArray = [];
    const buildGeometry = (label) => {
        let ordered_idx = -1;
        let res = GetFileLocation(label);
        ordered_idx = res[0];
        let t_diff = res[1];
        if (ordered_idx != -1) {
            // we now have the file index 
            let ordered_file_str = props.ordered_stream_files[props.selected_stream[0]][ordered_idx];
            let active_fn = ordered_file_str['filename'];

            //get gl delta x value
            let delta_x = get_delta_x_from_t(t_diff, active_fn);
            // get absolute glx value
            let x_offset = ordered_idx * props.gl_data.x_width;
            let xgl_start = x_offset + delta_x;

            let s_int = 0;
            let date1 = new Date(label['timestamp_start']);
            let date2 = new Date(label['timestamp_end']);
            s_int = (date2.getTime() - date1.getTime()) / 1000;
            
            let delta_x_int = get_delta_x_from_t(s_int, active_fn);
            console.log(s_int, delta_x_int);
            let xgl_end = x_offset + delta_x_int;
            let ygl_max = 300;
            let ygl_min = 60;
            console.log(x_offset, delta_x);
            console.log(active_fn);
            // points
            let points = [];
            points.push(xgl_start, ygl_min, 40, xgl_start, ygl_max, 40, xgl_end, ygl_max, 40, xgl_end, ygl_min, 40, xgl_start, ygl_min, 40);
            dataSetArray.push({
                'points': points,
                'label': 'interesting'
            });

        }
        else{
            return -1;
        }

    }

    if (props.selected_stream.length < 1) {
        return;
    }

    let active_labels = [];

    // get active labels
    if (props.labels.hasOwnProperty(props.selected_stream[0])) {
        console.log(props.labels);
        for (let i = 0; i < props.labels[props.selected_stream[0]].length; i++) {
           // if (props.selected_view_models["interesting"].includes(props.detections[props.selected_stream[0]][i].model)) {
                active_labels.push(props.labels[props.selected_stream[0]][i]);
           // }

        }
    }

    
    // Build geometry
    console.log(props.ordered_stream_files);
    for (let i = 0; i < active_labels.length; i++) {
        buildGeometry(active_labels[i]);
    }

    // return
    let dataPresent = false;
    if (dataSetArray.length > 0) {
        dataPresent = true;
    }



    if (dataPresent) {
        return (


            <>
                {
                    dataSetArray.map((item, key) => (
                        <PlotGeo points={item.points} color='blue' label={item.label} width={5.0} />
                    ))
                }
            </>





        );
    }
    else {

        return (
            // <>
            //     <PlotLine points={points} color='green' label='waiting' width={2.0} />
            // </>
            <></>
        );

    }
   



}



const mapStateToProps = (state) => ({

    gl_data: state.openGl,
    labels: state.labels,
    selected_stream: state.selected_stream,
    ordered_stream_files: state.ordered_stream_files,
    file_data: state.file_data
   
    
    
})

const ConnectedDrawLabels = connect(mapStateToProps)(DrawLabels);
export default ConnectedDrawLabels;



const PlotGeo = ({
    color,
    zdim,
    points,
    width,
    label
}) => {
    let s = 2;
    const ref = useRef()
 

    return (
        <mesh ref={ref}>
            <meshLineGeometry points={points} widthCallback={(p) => p > 0.8 ? 1.5 : 0.4} />
            <meshLineMaterial emissive lineWidth={width} color={color} wireframe={false} />
        </mesh>
    )
}
