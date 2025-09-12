


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
import Particles from './particles';
import ConnectedStreamImages from './spec_img';
import ConnectedDrawStreamDetection from './draw_stream_detections';
import ConnectedDrawLabels from './draw_labels';
import Button from '@mui/material/Button';
import ConnectedCameraOrders from '../camera/camera_order';
import { Vector3 } from 'three';

import { useLoader } from '@react-three/fiber';


import { TextureLoader, Triangle } from 'three';
extend({ MeshLineGeometry, MeshLineMaterial })

const SpecGL = (params) => {
    const dispatch = useDispatch();
    const homeClick = () => {
        console.log('Home view button clicked!');
        // Add other logic here
        let order_id = Math.random() * 999999;
        dispatch({
            type: 'CAMERA_ORDER', payload: {
                'order_type': 'fixed',
                'order_id': order_id,
                'xpos': -1000, 'ypos': 400, 'zpos': 4000,
                'xLookAt': 500, 'yLookAt': 400, 'zLookAt': 0
            }
        })


    };

    const handleZoomIn = () => {
        // Logic to zoom in the camera
        console.log('Home view button clicked!');
        // Add other logic here
        let order_id = Math.random() * 999999;
        dispatch({
            type: 'CAMERA_ORDER', payload: {
                'order_type' : 'zoom_in',
                'order_id': order_id,
                'xpos': 0, 'ypos': 400, 'zpos': 1000,
                'xLookAt': 0, 'yLookAt': 400, 'zLookAt': 0
            }
        })
    };

    const liveClick = () => {
        console.log('Home view button clicked!');
        // Add other logic here
        let order_id = Math.random() * 999999;

        dispatch({
            type: 'GO_LIVE'
        })


    };

    // const { autoRotate, mipmapBlur, luminanceThreshold, luminanceSmoothing, intensity } = useControls({
    //     autoRotate: !0,
    //     mipmapBlur: !0,
    //     luminanceThreshold: { value: 0.0, min: 0, max: 2, step: 0.01 },
    //     luminanceSmoothing: { value: 0.025, min: 0, max: 1, step: 0.001 },
    //     intensity: { value: 0.6, min: 0, max: 10, step: 0.01 }
    // })
    
    return (
        <>
        <Canvas
            dpr={Math.min(window.devicePixelRatio, 2)}
            camera={{
                fov: 40,
                position: [-1300, 300, 1500],
                near: 0.1,
                far: 10000
            }}
            

            >
                {/* <ambientLight intensity={5.5} color="white" /> */}
                {/* <spotLight position={[0, 0, -1000]} angle={Math.PI / 4} penumbra={1.5} intensity={10} color="white" castShadow /> */}
                <directionalLight position={[0, 10, 5000]} intensity={10} color="green" castShadow />
                {/* <Particles 
                    xsize={1000}
                    ysize={1000}
                    zsize={2}

                /> */}
        <color attach="background" args={['black']}/>
        {/* <FirstPersonControls movementSpeed={3}/> */}
            
        <OrbitControls
                // position={[params.orders['xpos'], params.orders['ypos'], params.orders['zpos']]}
                target={[-1300, 300, 0]}
                dampingFactor={0.55}
                makeDefault            
        />
        {/* <EffectComposer>
            <Bloom
                mipmapBlur={mipmapBlur}
                luminanceThreshold={luminanceThreshold}
                luminanceSmoothing={luminanceSmoothing}
                intensity={intensity}
            />
        </EffectComposer> */}
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
        <ConnectedDrawLabels />
        <ConnectedDrawEnergies />
        {/* <ConnectedLogger /> */}
        <Text
                            position={[-1300, 300, 0]}
                            scale={[40, 40, 10]}
                            color="red" // default
                            anchorX="left" // default
                            anchorY="middle" // default
                        >
                            M A R L I N  AI
                </Text>
                {/* <ImageBox

                    imgPath={"https://marlin-network.hopto.org/marlin_live/rsa_green_logo.png"}
                    xPos={-600}
                    yPos={-40}
                    zPos={10}
                    width={200}
                    height={100}

                /> */}
        <Suspense fallback={null}>
            <ConnectedStreamImages />
        </Suspense>
                
        {/* <ConnectedGLHud />  */}
            
            </Canvas>
            <div style={{ position: 'absolute', bottom: 10, left: 10 }}>
                {/* <button onClick={handleZoomIn}>Zoom In</button>
                <button>Reset Camera</button> */}
                <Button variant="outlined"  color="success" onClick={homeClick}>Reset Camera</Button>
                <Button variant="outlined" color="success" onClick={liveClick}>Live</Button>
            </div>
            <div style={{ position: 'absolute', bottom: 10, left: '20%' }}>
                {/* <button onClick={handleZoomIn}>Zoom In</button>
                <button>Reset Camera</button> */}
                {/* <Button variant="outlined" style={{ width: '100px' }} onClick={handleZoomIn}>In +</Button>
                <Button variant="outlined" style={{ width: '100px' }} onClick={handleZoomIn}>Out -</Button> */}
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




// export default SpecGL;

const mapStateToProps = (state) => ({

   // orders : state.camera_orders

})


const ConnectedSpecGL = connect(mapStateToProps)(SpecGL);
export default ConnectedSpecGL;


function ImageBox({
    imgPath,
    xPos,
    yPos,
    zPos,
    width,
    height
}) {


    const texture = useLoader(TextureLoader, imgPath);


    return (

        <mesh position={[xPos, yPos, zPos]}>
            <planeGeometry args={[width, height]} />
            <meshBasicMaterial map={texture} />
        </mesh>




    );
}



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

