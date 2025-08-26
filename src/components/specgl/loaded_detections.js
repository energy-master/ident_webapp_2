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


const DrawActiveGeomtry = (props) => {

    const dispatch = useDispatch();

    
   

    if (props.acousticFileData.fileName == "No Active File") {
        return;
    }

    if (props.selected_stream.length < 1){
        return;
    }

  

    dispatch({ type: 'LOG_UPDATE', payload: 'IDent Message : Annotating bot active geometry. ' })


    let dataSetArray = [];
    let dataPresent = false;

    if (!props.file_draw_data.hasOwnProperty(props.acousticFileData["fileName"])) {
        return;
    }

    let gl_xdraw_start = props.file_draw_data[props.acousticFileData["fileName"]]['xpos'];
    let gl_ydraw_start = props.file_draw_data[props.acousticFileData["fileName"]]['ypos'];
    let gl_zdraw_start = props.file_draw_data[props.acousticFileData["fileName"]]['zpos'];
    let gl_draw_width = props.file_draw_data[props.acousticFileData["fileName"]]['width'];
    let gl_draw_height = props.file_draw_data[props.acousticFileData["fileName"]]['height'];


    const get_y_from_f = (frequency) => {
        // console.log(props.spectrogram.frequency_vector[props.spectrogram.frequency_vector.length - 1]);
        console.log(props.sim_frequency_data);
        let fmax = props.sim_frequency_data[0]["fmax"];
        console.log(fmax);
        if (fmax == 0) {
            if (props.spectrogram.frequency_vector.length > 1) {
                fmax = props.spectrogram.frequency_vector[props.spectrogram.frequency_vector.length - 1];
            }
            else {
                return 0;
            }
        }
        let f_y_ratio = props.gl_data.y_width / fmax;
       
        let y_zero = 0 - (props.gl_data.y_width / 2);
        y_zero = gl_ydraw_start;
        // console.log(f_y_ratio);
        let gly = y_zero + (frequency * f_y_ratio);
        // console.log(gly, frequency);
        return gly;
    }

    const get_x_from_iter = (number_iter) => {
        // console.log(props.model_parameters);
        console.log(props.model_parameters.max_iter);
        let start_x = 0 - (props.gl_data.x_width / 2);
        start_x = gl_xdraw_start;
        let delta_x = props.gl_data.x_width / props.model_parameters.max_iter;
        // console.log(delta_x);
        let glx = start_x + (number_iter * delta_x);

        return glx;
    }

    const get_delta_x_from_delta_t = (time_s) => {

        // iter delta x
        // console.log(props.model_parameters.max_iter);
        let delta_x = props.gl_data.x_width / props.model_parameters.max_iter;
        console.log(delta_x);
        // console.log(time_s, props.model_parameters.delta_t);
        let number_iters = (time_s / props.model_parameters.delta_t);
        // console.log(number_iters);
        number_iters = 1;
        let gl_delta_x = delta_x * number_iters;
        // console.log(gl_delta_x);

        return (gl_delta_x);

    }


    const buildGeometry = (geo, iter) => {
        console.log(geo);
        let points = [];

        let geom_points = [];

        // let xgl_iter = get_x_from_iter(iter);
        console.log(geo.active_time_s, total_time_s, gl_draw_width)
        let start_gl_x = gl_xdraw_start + (parseFloat(parseFloat(geo.active_time_s) / parseFloat(total_time_s)) * gl_draw_width);
        let end_gl_x = gl_xdraw_start + (parseFloat(parseFloat(geo.active_time_s - (geo.max_memory / 1000)) / parseFloat(total_time_s)) * gl_draw_width);

        let ygl_max = get_y_from_f(geo.f_max);
        let ygl_min = get_y_from_f(geo.f_min);



        // memory x
        // let delta_xgl_memory = get_delta_x_from_delta_t(geo.max_memory / 1000);
        // console.log(xgl_iter, ygl_max, ygl_min, delta_xgl_memory)

        // points
        points.push(start_gl_x, ygl_max, gl_zdraw_start, start_gl_x, ygl_min, gl_zdraw_start, end_gl_x, ygl_min, gl_zdraw_start, end_gl_x, ygl_max, gl_zdraw_start);
        // console.log(points);
        // console.log(geo.max_memory/1000);
        // console.log(geo.f_max,geo.f_min);
        // console.log(props.gl_data.x_width,props.model_parameters.max_iter);

        dataSetArray.push({
            'points': points,
            'label': 'interesting'
        });









    }
    let total_time_s = props.elapsed_time;
    let fmax = props.sim_frequency_data.fmax;
    if (fmax == 0) {
        if (props.spectrogram.frequency_vector.length > 1) {
            //fmax = props.spectrogram.frequency_vector[props.spectrogram.frequency_vector.length - 1];
        }
        else {
            return;
        }
    }
    console.log(props.active_geometry);
    for (const [key, value] of Object.entries(props.active_geometry)) {
        //console.log(`${key}: ${value}`);
        for (const [iter, structure] of Object.entries(value)) {
            //console.log(`${iter}: ${structure}`);
            buildGeometry(structure, iter);
        }

    }

    console.log(dataSetArray);
    if (dataSetArray.length > 0) {
        dataPresent = true;
    }

    

    if (dataPresent) {
        return (


            <>
                {
                    dataSetArray.map((item, key) => (
                        <PlotGeo points={item.points} color='white' label={item.label} width={4.0} />
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

    active_geometry: state.ft_geometry,
    gl_data: state.openGl,
    model_parameters: state.model_parameters[0],
    selected_stream: state.selected_stream,
    acousticFileData: state.acousticFileData,
    sim_frequency_data: state.sim_frequency_data,
    sim_elapsed_time: state.sim_elapsed_time,
    file_draw_data: state.file_draw_data,
    spectrogram: state.spectrogram,
    elapsed_time: state.sim_elapsed_time

})

const ConnectedDrawActiveGeomtry = connect(mapStateToProps)(DrawActiveGeomtry);
export default ConnectedDrawActiveGeomtry;

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

