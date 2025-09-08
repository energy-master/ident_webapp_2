

import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { useDispatch } from 'react-redux';
import { Image } from '@react-three/drei';
import { connect } from 'react-redux';
import { useLoader } from '@react-three/fiber';
import { TextureLoader, Triangle } from 'three';
import { Stats, OrbitControls, Line, Text } from '@react-three/drei';
import { MeshLineGeometry, MeshLineMaterial, raycast } from 'meshline'
extend({ MeshLineGeometry, MeshLineMaterial })

function StreamImages(params)  {

    const dispatch = useDispatch();

    // console.log(params.current_filename);
    // console.log(params.selected_stream[0]);
    if (params.selected_stream.length < 1){
        return;
    }
    if (params.stream_data_loaded == false){
        return;
    }

    // console.log("rendering images");
    let stream_src = true;
    let imgPath = '';
    if (params.selected_stream[0] == 'Saved Files') {
        imgPath = 'https://marlin-network.hopto.org/marlin_live';
        stream_src = false;
    }
    else {
        imgPath = 'https://marlin-network.hopto.org/marlin_live/streams/' + params.selected_stream[0];

    }
    
    // Iterate over files and load images into a sequence and build the stream for rendering
    // console.log(params.openGl);
    let stream_render_data = [];
    // let start_gl_x = 0 - (parseFloat(params.openGl.x_width) / 2);
    let start_gl_x = 0;
    let y_base = (parseFloat(params.openGl.y_width)) + 20;
    y_base = 300 + 20;
    // console.log(params.ordered_stream_files);
    let number_loaded = 0;

    let f_draw_data = {}

    if (params.ordered_stream_files.hasOwnProperty(params.selected_stream[0])) {
        //console.log(params.ordered_stream_files[params.selected_stream[0]].length);
        
        for (let i = 0; i < Math.min(params.ordered_stream_files[params.selected_stream[0]].length, 10); i++) {
        //for (let i = params.ordered_stream_files[params.selected_stream[0]].length-1; i > -1; i--) {

            let gl_w = stream_src ? params.openGl.x_width : params.openGl.x_width;
            
            let instance = {
                'imgPath': imgPath + '/' + params.ordered_stream_files[params.selected_stream[0]][i].file_root + "_spec.jpg",
                'xPos': start_gl_x,
                'yPos': y_base,
                'zPos': 20,
                'width': gl_w,
                'height': 500,
                'file_name': params.ordered_stream_files[params.selected_stream[0]][i].filename,
                'timestamp': params.ordered_stream_files[params.selected_stream[0]][i]['datetime']['date'],
                'x_f_pos': start_gl_x - (gl_w / 2),
                'y_f_pos': y_base - (500 / 2),
                'z_f_pos': 21,
                'f_width': gl_w - 50,
                'f_height' : 390
                
            };

            
            f_draw_data[params.ordered_stream_files[params.selected_stream[0]][i].filename] = {
                'xpos': start_gl_x - (gl_w/2),
                'ypos': y_base - (500/2),
                'zpos': 21,
                'width' : gl_w - 50,
                'height' : 390
            }
            // console.log(instance);
            stream_render_data.push(instance);
            
            start_gl_x += (params.openGl.x_width);
            number_loaded += 1;
            // if (number_loaded > 5) {
            //     break;
            // }

        }

        dispatch({ type: "FILES_DRAWN", payload: f_draw_data });
    }

    

    // console.log(stream_render_data);
    return (


        <>
            {
                stream_render_data.map((item, key) => (
                    <>
                    <ImageBox
                        
                        imgPath={item.imgPath}
                        xPos={item.xPos}
                        yPos={item.yPos}
                        zPos={item.zPos}
                        width={item.width}
                        height={item.height}
                        
                        />
                        <ImageFrame
                            frame_x_start = {item.x_f_pos}
                            frame_y_start = {item.y_f_pos}
                            frame_z_start = {item.z_f_pos}
                            frame_width = {item.f_width}
                            frame_height = {item.f_height}
                        />
                     <Text
                                    position={[item.xPos - (item.width/4), item.yPos + (item.height/2)+10, item.zPos]}
                                    scale={[13, 13, 13]}
                                    color="white" // default
                                    anchorX="left" // default
                                    anchorY="middle" // default 
                                >
                                    {item.file_name}
                        </Text>
                        <Text
                            position={[item.xPos+100 , item.yPos + (item.height / 2) + 10, item.zPos]}
                            scale={[13, 13, 13]}
                            color="white" // default
                            anchorX="left" // default
                            anchorY="middle" // default 
                        >
                            {item.timestamp}
                        </Text>
                        
                     </>
                ))
            }
        </>





    );


}



const mapStateToProps = (state) => ({

    selected_stream: state.selected_stream,
    ordered_stream_files: state.ordered_stream_files,
    openGl:state.openGl,
    stream_data_loaded: state.stream_data_loaded,
    current_filename: state.acousticFileData.fileName,
    // file_draw_data: state.file_draw_data
    

})


const ConnectedStreamImages = connect(mapStateToProps)(StreamImages);
export default ConnectedStreamImages;


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
      
        <mesh position={[xPos,yPos,zPos]}>
                <planeGeometry args={[width, height]} /> 
                <meshBasicMaterial map={texture} />
        </mesh>

        

       
    );
}


function ImageFrame({
    frame_x_start,
    frame_y_start,
    frame_z_start,
    frame_width,
    frame_height
}) {


    let points = [];
    points.push(frame_x_start, frame_y_start, frame_z_start, frame_x_start + frame_width, frame_y_start, frame_z_start, frame_x_start + frame_width, frame_y_start + frame_height, frame_z_start, frame_x_start, frame_y_start + frame_height, frame_z_start, frame_x_start, frame_y_start, frame_z_start);

    let color = 'blue';
    const ref = useRef();

    return (

        <mesh ref={ref}>
            <meshLineGeometry points={points} widthCallback={(p) => p > 0.8 ? 1.5 : 0.4} />
            <meshLineMaterial emissive lineWidth={2} color={color} wireframe={true} />
        </mesh>



    );
}

