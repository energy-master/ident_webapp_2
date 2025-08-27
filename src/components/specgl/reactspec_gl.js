


import { createRoot } from 'react-dom/client'
import React, { useMemo, useRef, useState, Suspense } from 'react'
import { Canvas, useFrame,extend } from '@react-three/fiber'
import { GridMoreVertIcon } from '@mui/x-data-grid'
import * as THREE from 'three';
import { DoubleSide } from 'three'
// import './styles.css'
import { Stats, OrbitControls, Line, Text, useProgress, Loader, Html, calcPosFromAngles } from '@react-three/drei';
// import {  } from '@react-three/drei/web';
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
import ConnectedDrawActiveGeometry from './loaded_detections';
import ConnectedDrawEnergies from './draw_energies';
import ConnectedLogger from './logging';
import ConnectedGLHud from './hud';
import ConnectedCameraAction from '../camera/camera';

import ConnectedStreamImages from './spec_img';
import ConnectedDrawStreamDetection from './draw_stream_detections';
import Button from '@mui/material/Button';
import ConnectedCameraOrders from '../camera/camera_order';

extend({ MeshLineGeometry, MeshLineMaterial })

const SpecGL = ({ }) => {
    const dispatch = useDispatch();
    const homeClick = () => {
        console.log('Home view button clicked!');
        // Add other logic here
        let order_id = Math.random() * 999999;
        dispatch({
            type: 'CAMERA_ORDER', payload: {
                'order_id': order_id,
                'xpos': 0, 'ypos': 400, 'zpos': 1000,
                'xLookAt': 0, 'yLookAt': 400, 'zLookAt': 0
            }
        })


    };

    const handleClick = () => {
        
    };

    const { autoRotate, mipmapBlur, luminanceThreshold, luminanceSmoothing, intensity } = useControls({
        autoRotate: !0,
        mipmapBlur: !0,
        luminanceThreshold: { value: 0.0, min: 0, max: 2, step: 0.01 },
        luminanceSmoothing: { value: 0.025, min: 0, max: 1, step: 0.001 },
        intensity: { value: 0.6, min: 0, max: 10, step: 0.01 }
    })
    const handleZoomIn = () => {
        // Logic to zoom in the camera
    };
    return (
        <>
        <Canvas
            dpr={Math.min(window.devicePixelRatio, 2)}
            camera={{
                fov: 40,
                position: [0, 50, 1000],
                near: 0.1,
                far: 10000
            }}

        >
            
        <color attach="background" args={['black']}/>
        {/* <FirstPersonControls movementSpeed={3}/> */}
        
                <OrbitControls
                    dampingFactor={0.05}
                    makeDefault
                     />
        <EffectComposer>
            <Bloom
                mipmapBlur={mipmapBlur}
                luminanceThreshold={luminanceThreshold}
                luminanceSmoothing={luminanceSmoothing}
                intensity={intensity}
            />
        </EffectComposer>
                <ConnectedCameraAction />
                <ConnectedCameraOrders />
                
            /* Scene */
        
                {/* <ConnectedPlotLines /> */}
                {/* <Suspense fallback={null}>
                    <ConnectedSpectrogramMesh />
                    </Suspense> */}
        <ConnectedPlotActiveGeometry />
        <ConnectedDrawActiveGeometry />
        <ConnectedDrawStreamDetection />
        <ConnectedDrawEnergies />
        <ConnectedLogger />
        <Text
                            position={[-600, 0, -10]}
                            scale={[40, 40, 10]}
                            color="red" // default
                            anchorX="left" // default
                            anchorY="middle" // default
                        >
                            M A R L I N  AI
        </Text>
                <Suspense fallback={null}>
                    <ConnectedStreamImages />
                </Suspense>
                
        {/* <ConnectedGLHud />  */}
            
            </Canvas>
            <div style={{ position: 'absolute', bottom: 10, left: 10 }}>
                {/* <button onClick={handleZoomIn}>Zoom In</button>
                <button>Reset Camera</button> */}
                <Button variant="outlined" onClick={homeClick}>Reset Camera</Button>
                <Button variant="outlined">Live</Button>
            </div>
            <div style={{ position: 'absolute', bottom: 10, left: '20%' }}>
                {/* <button onClick={handleZoomIn}>Zoom In</button>
                <button>Reset Camera</button> */}
                <Button variant="outlined" style={{ width: '100px' }} onClick={handleZoomIn}>In +</Button>
                <Button variant="outlined" style={{ width: '100px' }}>Out -</Button>
            </div>
            <Loader />
        {/* <Loader
            containerStyles={...container} // Flex layout styles
            innerStyles = { ...inner } // Inner container styles
            barStyles = { ...bar } // Loading-bar styles
            dataStyles = { ...data } // Text styles
            dataInterpolation = {(p) => `Loading ${p.toFixed(2)}%`} // Text
            initialState = {(active) => active} // Initial black out state
        >
         */}
        </> 


    )
}

export default SpecGL;



function Box(props) {
    // This reference will give us direct access to the mesh
    const meshRef = useRef()
    // Set up state for the hovered and active state
    const [hovered, setHover] = useState(false)
    const [active, setActive] = useState(false)
    // Subscribe this component to the render-loop, rotate the mesh every frame
    useFrame((state, delta) => (meshRef.current.rotation.x += delta))
    // Return view, these are regular three.js elements expressed in JSX
    return (
        <mesh
            {...props}
            ref={meshRef}
            scale={active ? 1.5 : 1}
            onClick={(event) => setActive(!active)}
            onPointerOver={(event) => setHover(true)}
            onPointerOut={(event) => setHover(false)}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
        </mesh>
    )
}

