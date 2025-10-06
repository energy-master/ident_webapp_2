
import { createRoot } from 'react-dom/client'
import React, { useMemo, useRef, useState, Suspense } from 'react'
import { Canvas, useFrame,extend } from '@react-three/fiber'
import { DEFAULT_GRID_AUTOSIZE_OPTIONS, GridMoreVertIcon } from '@mui/x-data-grid'
import * as THREE from 'three';
import { DoubleSide } from 'three'
// import './styles.css'
import { Stats, OrbitControls, Line, Text } from '@react-three/drei';
import { useControls } from 'leva';
import { columnResizeStateInitializer, escapeRegExp, propsStateInitializer, useGridParamsApi } from '@mui/x-data-grid/internals';
import { getListItemSecondaryActionClassesUtilityClass } from '@mui/material/ListItemSecondaryAction';
import { connect } from 'react-redux';
import { useDispatch } from 'react-redux';
import { FirstPersonControls } from '@react-three/drei';
import ConnectedSpectrogramMesh from './spec_mesh';
import { MeshLineGeometry, MeshLineMaterial, raycast } from 'meshline';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import ConnectedPlotLines from './plot_lines';
import ConnectedPlotActiveGeometry from './plot_geometry';
extend({ MeshLineGeometry, MeshLineMaterial })


// const PlotLabels = ({
//     frequencyVector,
//     timeVector,
//     gl_y,
//     gl_x,
//     max_iter,
//     offset
    
// }) => {

//     // console.log(frequencyVector);
//     // console.log(timeVector);
//     // console.log(gl_y);
//     let f_max = frequencyVector[frequencyVector.length - 1];
//     let total_time_s = Math.floor(timeVector[timeVector.length - 1]);
//     let total_time_str = total_time_s.toString() + '.0';
//     console.log(total_time_s);
//     let f_min = 0;
    
//     let f_max_x = (0 - gl_x / 2) - 20;
//     let f_max_y = (0 + gl_y / 2);
//     let f_max_z = 20;
//     f_max_x = f_max_x + offset;
//     let f_min_x = (0 - gl_x / 2) - 20;
//     let f_min_y = (0 - gl_y / 2);
//     let f_min_z = 20;
//     f_min_x = f_min_x + offset;
   
//     let mid_time_s = Math.floor(total_time_s / 2);

   
//     let mid_x = 0;
//     let end_x = 0 + Math.floor((gl_x / 2));
//     let start_x = 0 - Math.floor((gl_x / 2));
//     end_x = end_x + offset;
//     start_x = start_x + offset;
//     let hud_x = gl_x + 30;
//     let hud_y = gl_y / 2;
//     let hud_z = -50;


//     return (
//         <>
//             <Text
//                 position={[f_max_x, f_max_y, f_max_z]}
//                 scale={[10, 10,10]}
//                 color="green" // default
//                 anchorX="center" // default
//                 anchorY="middle" // default 
//             >
//                 {f_max}
//             </Text>
//             <Text
//                 position={[f_min_x, f_min_y, f_min_z]}
//                 scale={[10, 10, 10]}
//                 color="green" // default
//                 anchorX="center" // default
//                 anchorY="middle" // default 
//             >
//                 {f_min}
//             </Text>
//             <Text
//                 position={[f_min_x, 0.0, f_min_z]}
//                 scale={[10, 10, 10]}
//                 color="green" // default
//                 anchorX="center" // default
//                 anchorY="middle" // default 
//             >
//                 f(Hz)
//             </Text>

//             <Text
//                 position={[start_x, f_min_y-10, f_min_z]}
//                 scale={[10, 10, 10]}
//                 color="green" // default
//                 anchorX="center" // default
//                 anchorY="middle" // default 
//             >
//                 0.0
//             </Text>

//             <Text
//                 position={[end_x, f_min_y - 10, f_min_z]}
//                 scale={[10, 10, 10]}
//                 color="green" // default
//                 anchorX="center" // default
//                 anchorY="middle" // default 
//             >
//                 {total_time_str}
//             </Text>

//             <Text
//                 position={[start_x+20, f_min_y - 10, f_min_z]}
//                 scale={[10, 10, 10]}
//                 color="green" // default
//                 anchorX="center" // default
//                 anchorY="middle" // default 
//             >
//                 time (s)
//             </Text>
            
         
//         </>
//     );
// }

// const mapStateToProps = (state) => ({

//     spectrogram: state.spectrogram,
//     gl_data: state.openGl,
//     model_parameters: state.model_parameters
    

// })

// const ConnectedPlotLabels = connect(mapStateToProps)(PlotLabels);
// export default ConnectedPlotLabels;




const PlotLabels = (props) => {


    console.log(props.f_draw_data);

    if (props.selected_streams.length < 1) {
        return;
    }

    let min_x = 9999999;
    let height = 0;
    let width = 0;
    let freq_labels = [];
    for (const [key, value] of Object.entries(props.f_draw_data)) {
        
        console.log(value);
        console.log(key);
        console.log(props.file_data);

        if (props.file_data.hasOwnProperty(props.selected_streams[0])) {
            
        
            let f_data = props.file_data[props.selected_streams[0]][key];

            // exit if not f_data


            console.log(f_data);
            let points = [];
            points.push(value['xpos'], value['ypos'] - 10, value['zpos'] + 10, value['xpos'], value['ypos'] + value['height'], value['zpos'] + 10);
            let max_freq = 0;
            let max_time = 0;
            try {
                if (f_data.hasOwnProperty("f_max")) {
                    max_freq = f_data["f_max"];
                    max_time = f_data["elapsed_time"];
                }
            }
            catch {
                
            }
           
            freq_labels.push({

                "x_pos": value['xpos'] - 20,
                "y_base": value['ypos'],
                "z_pos": value['zpos'],
                "height": value['height'],
                "width": value['width'],
           
                "max_freq": max_freq,
                "max_time": max_time,
                "points": points

            });
        }

    }

    console.log(freq_labels);

    // // console.log(frequencyVector);
    // // console.log(timeVector);
    // // console.log(gl_y);
    // let f_max = frequencyVector[frequencyVector.length - 1];
    // let total_time_s = Math.floor(timeVector[timeVector.length - 1]);
    // let total_time_str = total_time_s.toString() + '.0';
    // console.log(total_time_s);
    // let f_min = 0;
    
    // let f_max_x = (0 - gl_x / 2) - 20;
    // let f_max_y = (0 + gl_y / 2);
    // let f_max_z = 20;
    // f_max_x = f_max_x + offset;
    // let f_min_x = (0 - gl_x / 2) - 20;
    // let f_min_y = (0 - gl_y / 2);
    // let f_min_z = 20;
    // f_min_x = f_min_x + offset;
   
    // let mid_time_s = Math.floor(total_time_s / 2);

   
    // let mid_x = 0;
    // let end_x = 0 + Math.floor((gl_x / 2));
    // let start_x = 0 - Math.floor((gl_x / 2));
    // end_x = end_x + offset;
    // start_x = start_x + offset;
    // let hud_x = gl_x + 30;
    // let hud_y = gl_y / 2;
    // let hud_z = -50;


    return (

        <>
            {
                freq_labels.map((item, key) => (
                    <Axis points={item.points} color='white' width={item.width}  lwidth={5.0} xpos={item.x_pos} y_base={item.y_base} zpos={item.z_pos} height={item.height} max_freq={item.max_freq} max_time={item.max_time}/>
                ))
            }
        </>


    
    );
}

const mapStateToProps = (state) => ({


    // gl_data: state.openGl,
    // model_parameters: state.model_parameters,
    f_draw_data: state.file_draw_data,
    file_data: state.file_data,
    selected_streams: state.selected_stream

})

const ConnectedPlotLabels = connect(mapStateToProps)(PlotLabels);
export default ConnectedPlotLabels;



const Axis = ({
    color,
    points,
    lwidth,
    width,
    xpos,
    y_base,
    zpos,
    height,
    max_freq,
    max_time
}) => {
    let s = 2;
    const ref = useRef()
 
    let x_points = [];
    x_points.push(xpos - 10, y_base, zpos + 10, xpos + width, y_base, zpos + 10);
    return (
        <>
        <mesh ref={ref}>
            <meshLineGeometry points={points} widthCallback={(p) => p > 0.8 ? 1.5 : 0.4} />
            <meshLineMaterial emissive lineWidth={lwidth} color={color} wireframe={false} />
        </mesh>
            
        
            
        <mesh ref={ref}>
            <meshLineGeometry points={x_points} widthCallback={(p) => p > 0.8 ? 1.5 : 0.4} />
            <meshLineMaterial emissive lineWidth={lwidth} color={color} wireframe={false} />
        </mesh>   

        <Text
                position={[xpos, y_base+height, zpos+10]}
                scale={[11, 11,11]}
                color="white" // default
                anchorX="center" // default
                anchorY="middle" // default 
            >
                {max_freq} Hz
            </Text>
            <Text
                position={[xpos, y_base+10, zpos + 10]}
                scale={[11, 11, 11]}
                color="white" // default
                anchorX="center" // default
                anchorY="middle" // default 
            >
                0
            </Text>
            <Text
                position={[xpos, y_base + (height)/2, zpos + 10]}
                scale={[11, 11, 11]}
                color="white" // default
                anchorX="center" // default
                anchorY="middle" // default 
            >
                {max_freq/2} Hz
            </Text>

            <Text
                position={[xpos+width, y_base -10, zpos + 10]}
                scale={[11, 11, 11]}
                color="white" // default
                anchorX="center" // default
                anchorY="middle" // default 
            >
                { max_time } s
            </Text>

            <Text
                position={[xpos + (width/2), y_base - 10, zpos + 10]}
                scale={[11, 11, 11]}
                color="white" // default
                anchorX="center" // default
                anchorY="middle" // default 
            >
                {max_time/2} s
            </Text>

        </>
    )
}


