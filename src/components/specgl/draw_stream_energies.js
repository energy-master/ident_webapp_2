import { createRoot } from 'react-dom/client'
import React, { useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, extend } from '@react-three/fiber'
import { GridMoreVertIcon, renderActionsCell } from '@mui/x-data-grid'
import * as THREE from 'three';
import { DoubleSide } from 'three'

import { Stats, OrbitControls, Line } from '@react-three/drei';
import { useControls } from 'leva';
import { columnResizeStateInitializer, escapeRegExp, useGridParamsApi } from '@mui/x-data-grid/internals';
import { getListItemSecondaryActionClassesUtilityClass } from '@mui/material/ListItemSecondaryAction';
import { connect } from 'react-redux';
import { useDispatch } from 'react-redux';
import { FirstPersonControls } from '@react-three/drei';
import { MeshLineGeometry, MeshLineMaterial, raycast } from 'meshline'
import ConnectedSimModelsDialogue from '../sim_model_dialogue/sim_model_dialogue';
extend({ MeshLineGeometry, MeshLineMaterial })


const DrawStreamEnergies = (props) => {

    console.log("draw all energies")
    console.log(props.stream_sim);
    console.log(props.file_draw_data);
    console.log(props.file_data);
    

    // if (props.current_fileName == "No Active File"){
    //     return;
    // }

    // if (props.interesting_data.length < 1) {
    //     return;
    // }
    console.log(props.stream_name);
    if (props.stream_name.length < 1) {
        return;
    }

    let stream_name = props.stream_name[0];
    console.log(stream_name);
    
    let points = [];
    let color = 'red';
    // init dataSetArray
    let dataSetArray = Array();

    let dataPresent = false;
  
    for (let fk = 0; fk < props.stream_sim[stream_name].length; fk++){
        


            let current_fileName = props.stream_sim[stream_name][fk]['filename'];
            let current_activity = props.stream_sim[stream_name][fk]['activity'];
            console.log(current_activity);
            if (!props.file_draw_data.hasOwnProperty(current_fileName))
            {
                continue;
            }
            
            // let current_fileName = props.file_draw_data
            let gl_xdraw_start = props.file_draw_data[current_fileName]['xpos'];
            let gl_ydraw_start = props.file_draw_data[current_fileName]['ypos']-50;
            let gl_zdraw_start = props.file_draw_data[current_fileName]['zpos'];
            let gl_draw_width = props.file_draw_data[current_fileName]['width'];
            let gl_draw_height = props.file_draw_data[current_fileName]['height'];


            // let total_time_s = props.elapsed_time;
            // console.log(total_time_s);
            // if (total_time_s == 0) {
            //     return;
            // }
        
            let total_time_s = props.file_data[stream_name][current_fileName]['elapsed_time'];
            console.log(total_time_s);
            console.log(current_activity);
            let dataPresent = false;
            for (let i = 0; i < current_activity.length; i++) {
                //console.log(props.sim_models_selected["interesting"]);
                //console.log(props.interesting_data[i]['environment']);
                // if (props.sim_models_selected["interesting"].includes(props.interesting_data[i]['environment'])) {
                    
                
                    dataPresent = true;
                    let delta_glx = parseFloat(parseFloat(current_activity[i]['active_time_s']) / parseFloat(total_time_s)) * gl_draw_width;
                    let pts = [
                        gl_xdraw_start + delta_glx - 30, gl_ydraw_start, gl_zdraw_start,
                        gl_xdraw_start + delta_glx, gl_ydraw_start, gl_zdraw_start,
                        gl_xdraw_start + delta_glx, gl_ydraw_start + 100, gl_zdraw_start,
                        gl_xdraw_start + delta_glx, gl_ydraw_start, gl_zdraw_start,
                        gl_xdraw_start + delta_glx + 30, gl_ydraw_start, gl_zdraw_start,
                    
                    ];
                
                    let activity_inst = {
                        'points': pts
                    }

                    dataSetArray.push(activity_inst);
                //}
            }

    }




   

   
    console.log(dataSetArray);
    if (dataPresent) {
        console.log("*** DRAWING ENERGIES ***")
        
        return (


            <>
                {
                    dataSetArray.map((item, key) => (
                        <PlotLine points={item.points} color={color} width={3.0} />
                    ))
                }
            </>





        );
    }
    else {

        return (
            <>
                <PlotLine points={points} color='green' label='waiting' width={2.0} />
            </>
        );

    }

}


const mapStateToProps = (state) => ({

    //activityPlotData: state.plot_activity_data,
    gl_data: state.openGl,
    file_order_data: state.file_data,
    file_draw_data: state.file_draw_data,
    file_data : state.file_data,
    model_parameters: state.model_parameters[0],
    // current_fileName : state.acousticFileData.fileName,
    interesting_data: state.sim_activity,
    interesting_models: state.sim_models,
    elapsed_time: state.sim_elapsed_time,
    sim_models_selected: state.sim_models_selected,
    stream_name: state.selected_stream,
    stream_sim : state.stream_sim



})

const ConnectedDrawStreamEnergies = connect(mapStateToProps)(DrawStreamEnergies);
export default ConnectedDrawStreamEnergies;

const PlotLine = ({
    color,
    zdim,
    points,
    width,
    label
}) => {
    let s = 2;
    const ref = useRef()
    useFrame((state) => {

        for (let i = 0; i < points.length; i++) {
            // ref.current.position.x = x + Math.sin((state.clock.getElapsedTime() * s) / 2)
            let idx = (i + 2) * i;
            // ref.current.position.y = points[idx + 1] + Math.sin((state.clock.getElapsedTime() * s) / 2);
            points[idx + 1] = points[idx + 1] + Math.sin((state.clock.getElapsedTime() * s) / 2)
            i = idx;
            // ref.current.position.z = z + Math.sin((state.clock.getElapsedTime() * s) / 2)
        }



    })


    return (
        <mesh ref={ref}>
            <meshLineGeometry points={points} widthCallback={(p) => p > 0.8 ? 1.5 : 0.4} />
            <meshLineMaterial emissive lineWidth={width} color={color} />
        </mesh>
    )
}

