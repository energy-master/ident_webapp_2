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
extend({ MeshLineGeometry, MeshLineMaterial })


const DrawEnergies = (props) => {

  //  console.log("energy drawing");
    //console.log(props.model_parameters.fileName);

    if (props.current_fileName == "No Active File"){
        return;
    }


    if (props.interesting_data.length < 1) {
        return;
    }

    let points = [];
    let color = 'red';
    //console.log(props.activityPlotData);
    //let xAxis = props.activityPlotData['labels'];
    //let dataSetArray = Array.from((props.activityPlotData['datasets']));

    let dataSetArray = Array();

   
    
    

   
    console.log(props.file_draw_data);
    console.log(props.model_parameters);
    console.log(props.current_fileName);
    console.log(props.file_draw_data);
    if (!props.file_draw_data.hasOwnProperty(props.current_fileName))
    {
        return;
    }
    console.log(props.file_draw_data);
    let gl_xdraw_start = props.file_draw_data[props.current_fileName]['xpos'];
    let gl_ydraw_start = props.file_draw_data[props.current_fileName]['ypos'];
    let gl_zdraw_start = props.file_draw_data[props.current_fileName]['zpos'];
    let gl_draw_width = props.file_draw_data[props.current_fileName]['width'];
    let gl_draw_height = props.file_draw_data[props.current_fileName]['height'];
    

    let total_time_s = props.elapsed_time;
    console.log(total_time_s);
    if (total_time_s == 0) {
        return;
    }

    console.log(props.interesting_data);
    let dataPresent = false;
    for (let i = 0; i < props.interesting_data.length; i++) {
        //console.log(props.sim_models_selected["interesting"]);
        //console.log(props.interesting_data[i]['environment']);
        if (props.sim_models_selected["interesting"].includes(props.interesting_data[i]['environment'])) {
            
        
            dataPresent = true;
            let delta_glx = parseFloat(parseFloat(props.interesting_data[i]['active_time_s']) / parseFloat(total_time_s)) * gl_draw_width;
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
        }
    }



   

    console.log(dataPresent);
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
    current_fileName : state.acousticFileData.fileName,
    interesting_data: state.sim_activity,
    interesting_models: state.sim_models,
    elapsed_time: state.sim_elapsed_time,
    sim_models_selected: state.sim_models_selected



})

const ConnectedDrawEnergies = connect(mapStateToProps)(DrawEnergies);
export default ConnectedDrawEnergies;

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

