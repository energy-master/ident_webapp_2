

import React from 'react';
import ReactDOM from 'react-dom';
import Draggable from 'react-draggable';
import { useDispatch } from 'react-redux';

import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';

import Typography from '@mui/material/Typography';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import { connect } from 'react-redux';
import ConnectedFileDataGrid from '../../components/ident_data_grid';

import ConnectedStreamData from '../../components/stream_data/stream_data';
import ConnectedModelData from '../model_data/model_data';
import ConnectedStreamFiles from '../../components/stream_files/stream_files'
import ConnectedActiveModelDialogue from '../../components/ActiveModelDialogue/active_model_dialogue';
import ConnectedDetectionsDialogue from '../../components/DetectionsDialogue/detections_dialogue';
import ConnectedLayersDialogue from '../../components/layers_dialogue/layers_dialogue';
import ConnectedModelParams from '../../components/model_params/model_params';
import ConnectedAppProgressBar from '../../components/appProgressBar/app_progress_bar';
import ConnectedSimModelsDialogue from '../../components/sim_model_dialogue/sim_model_dialogue';
import ConnectedLabelsDialogue from '../../components/LabelDialogue/label_dialogue';
import { GridNoColumnsOverlay } from '@mui/x-data-grid';

const eventLogger = (e, data) => {
    console.log('Event: ', e);
    console.log('Data: ', data);
};

// "windows_show" : {
//         "simulation":false,
//         "connect":true,
//         "results":false,
//         "log" : false
//     }

const Windows = ({ }) => {


    return (
        <>
            <WindowGUI />
        </>
    );

}



// export default Windows;

const WindowGUI = (props) => {
    const dispatch = useDispatch();
    const nodeRef = React.useRef(null); // Create a ref
    console.log("Building Window GUI");
    console.log(props);
    console.log(props.windows_show['id']);
    return (
        <>
            
        // Connect to data    
        { props.windows_show[0]['Connect'] ?
            <Draggable
                nodeRef={nodeRef}
                handle=".window-header" // Only drag by the header

            >


                <div ref={nodeRef} style={{ width: '50%', left: '2%', top: '10%', position: 'absolute' }}>
                    <div >
                        <div className="window-header" style={{
                            width: '50px', height: '25px', background: '#292D39', backgroundColor: '#292D39', bgcolor: '#292D39', color: 'white', left: '91%', position: 'absolute', zIndex: 100, cursor: 'pointer', textAlign: 'center'
                        }}>...</div>

                        <Accordion sx={{ bgcolor: '#292D39', color: '#efeff1ff', fontSize: '14px', fontWeight: 'bold', width: '90%' }}>
                            <AccordionSummary
                                expandIcon={<ArrowDropDownIcon sx={{ color: '#818698' }} />}
                                aria-controls="panel1-content"
                                id="panel1-header"
                            >
                                <Typography component="span">Connect Data</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                {/* <ConnectedFileDataGrid /> */}
                                <ConnectedStreamData />
                            </AccordionDetails>
                        </Accordion>

                        <Accordion sx={{ bgcolor: '#292D39', color: '#efeff1ff', fontWeight: 'bold', width: '90%' }}>
                            <AccordionSummary
                                expandIcon={<ArrowDropDownIcon sx={{ color: '#818698' }} />}
                                aria-controls="panel4-content"
                                id="panel4-header"
                            >
                                <Typography component="span">Streamed Files</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <ConnectedStreamFiles />
                            </AccordionDetails>
                        </Accordion>


                        {/* <Accordion sx={{ bgcolor: '#292D39', color: '#818698' }}>
            <AccordionSummary
                expandIcon={<ArrowDropDownIcon sx={{ color: '#818698' }} />}
                aria-controls="panel2-content"
                id="panel2-header"
            >
            <Typography component="span">Model Selection</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Typography>

                </Typography>
            </AccordionDetails>
        </Accordion> */}

                        {/* <Accordion sx={{ bgcolor: '#292D39', color: '#818698' }}>
            <AccordionSummary
                expandIcon={<ArrowDropDownIcon sx={{ color: '#818698' }} />}
                aria-controls="panel3-content"
                id="panel3-header"
            >
                <Typography component="span">Model Parameters</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Typography>

                </Typography>
            </AccordionDetails>
        </Accordion> */}



                    </div>

                </div>

            </Draggable >
                : null}

            
            {props.windows_show[0]['Detections'] ?
                <>
                <Draggable
                    nodeRef={nodeRef}
                    handle=".window-header" // Only drag by the header
                >
        
                    <div ref={nodeRef} style={{ width: '20%', left: '70%', top: '10%', position: 'absolute' }}>
                        {/* <div className="window-header" > */}
                        <div>
                            <div className="window-header" style={{
                                width: '50px', height: '25px', background: '#292D39', backgroundColor: '#292D39', bgcolor: '#292D39', color: 'white', left: '91%', position: 'absolute', zIndex: 100, cursor: 'pointer', textAlign: 'center'
                            }}>...</div>

                            <Accordion sx={{ bgcolor: '#292D39', color: '#efeff1ff', width: '90%' }}>
                                <AccordionSummary
                                    expandIcon={<ArrowDropDownIcon sx={{ color: '#818698' }} />}
                                    aria-controls="panel3-content"
                                    id="panel3-header"
                                >
                                    <Typography component="span">Detections</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <ConnectedDetectionsDialogue />
                                </AccordionDetails>
                            </Accordion>
                            {/* </div> */}
                       
                        </div>
                    </div>
                    </Draggable>
                    
                    <Draggable
                        nodeRef={nodeRef}
                        handle=".window-header" // Only drag by the header
                    >
                        <div ref={nodeRef} style={{ width: '20%', left: '55%', top: '60%', position: 'absolute' }}>
                            {/* <div className="window-header" > */}
                            <div>
                                <div className="window-header" style={{
                                    width: '50px', height: '25px', background: '#292D39', backgroundColor: '#292D39', bgcolor: '#292D39', color: 'white', left: '91%', position: 'absolute', zIndex: 100, cursor: 'pointer', textAlign: 'center'
                                }}>...</div>

                                <Accordion sx={{ bgcolor: '#292D39', color: '#efeff1ff', width: '90%' }}>
                                    <AccordionSummary
                                        expandIcon={<ArrowDropDownIcon sx={{ color: '#818698' }} />}
                                        aria-controls="panel3-content"
                                        id="panel3-header"
                                    >
                                        <Typography component="span">Simulation Models</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <ConnectedSimModelsDialogue />
                                    </AccordionDetails>
                                </Accordion>
                                {/* </div> */}
                            </div>
                        </div>
                    </Draggable>

                    <Draggable
                        nodeRef={nodeRef}
                        handle=".window-header" // Only drag by the header
                    >

                        <div ref={nodeRef} style={{ width: '20%', left: '20%', top: '30%', position: 'absolute' }}>
                            {/* <div className="window-header" > */}
                            <div>
                                <div className="window-header" style={{
                                    width: '50px', height: '25px', background: '#292D39', backgroundColor: '#292D39', bgcolor: '#292D39', color: 'white', left: '91%', position: 'absolute', zIndex: 100, cursor: 'pointer', textAlign: 'center'
                                }}>...</div>

                                <Accordion sx={{ bgcolor: '#292D39', color: '#efeff1ff', width: '90%' }}>
                                    <AccordionSummary
                                        expandIcon={<ArrowDropDownIcon sx={{ color: '#818698' }} />}
                                        aria-controls="panel3-content"
                                        id="panel3-header"
                                    >
                                        <Typography component="span">Label Types</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                       
                                    </AccordionDetails>
                                </Accordion>
                                {/* </div> */}

                            </div>
                        </div>
                    </Draggable>

                    <Draggable
                        nodeRef={nodeRef}
                        handle=".window-header" // Only drag by the header
                    >

                        <div ref={nodeRef} style={{ width: '50%', left: '10%', top: '50%', position: 'absolute' }}>
                            {/* <div className="window-header" > */}
                            <div>
                                <div className="window-header" style={{
                                    width: '50px', height: '25px', background: '#292D39', backgroundColor: '#292D39', bgcolor: '#292D39', color: 'white', left: '91%', position: 'absolute', zIndex: 100, cursor: 'pointer', textAlign: 'center'
                                }}>...</div>

                                <Accordion sx={{ bgcolor: '#292D39', color: '#efeff1ff', width: '90%' }}>
                                    <AccordionSummary
                                        expandIcon={<ArrowDropDownIcon sx={{ color: '#818698' }} />}
                                        aria-controls="panel3-content"
                                        id="panel3-header"
                                    >
                                        <Typography component="span">Label List</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <ConnectedLabelsDialogue />
                                    </AccordionDetails>
                                </Accordion>
                                {/* </div> */}

                            </div>
                        </div>
                    </Draggable>




        <Draggable
            nodeRef={nodeRef}
            handle=".window-header" // Only drag by the header

        >
            <div ref={nodeRef} style={{ width:'15%', left: '52%', top: '10%', position:'absolute'}}>
            <div>
                <div className="window-header" style={{
                        width: '50px', height: '25px', background: '#292D39', backgroundColor: '#292D39', bgcolor: '#292D39', color: 'white', left: '91%', position: 'absolute', zIndex: 100, cursor: 'pointer', textAlign: 'center'
                }}>...</div>

                    <Accordion sx={{ bgcolor: '#292D39', color: '#efeff1ff', width:'90%' }}>
                    <AccordionSummary
                        expandIcon={<ArrowDropDownIcon sx={{ color: '#818698' }} />}
                        aria-controls="panel3-content"
                        id="panel3-header"
                    >
                        <Typography component="span">Detection Models</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                            <ConnectedActiveModelDialogue />
                    </AccordionDetails>
                </Accordion>

                </div>

            

        </div>

        </Draggable >

                    <Draggable
                        
            nodeRef={nodeRef}
            handle=".window-header" // Only drag by the header
        >
            <div ref={nodeRef} style={{ width: '15%', left: '35%', top: '10%', position: 'absolute' }}>
                {/* <div className="window-header" > */}
                <div>
                <div className="window-header" style={{
                    width: '50px', height: '25px', background: '#292D39', backgroundColor: '#292D39', bgcolor: '#292D39', color: 'white', left: '91%', position: 'absolute', zIndex: 100, cursor: 'pointer', textAlign: 'center'
                }}>...</div>

                    <Accordion sx={{ bgcolor: '#292D39', color: '#efeff1ff', width:'90%'}}>
                        <AccordionSummary
                            expandIcon={<ArrowDropDownIcon sx={{ color: '#818698' }} />}
                            aria-controls="panel3-content"
                            id="panel3-header"
                        >
                            <Typography component="span">Layers</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <ConnectedLayersDialogue />
                        </AccordionDetails>
                    </Accordion>
                {/* </div> */}
                </div>
            </div>
        </Draggable>
                </>
                : null}

            {props.windows_show[0]['Search'] ?
                <>
        <Draggable
            nodeRef={nodeRef}
            handle=".window-header" // Only drag by the header
        >
            <div ref={nodeRef} style={{ width: '45%', left: '55%', top: '55%', position: 'absolute' }}>
                {/* <div className="window-header" > */}
                <div>
                    <div className="window-header" style={{
                        width: '50px', height: '25px', background: '#292D39', backgroundColor: '#292D39', bgcolor: '#292D39', color: 'white', left: '91%', position: 'absolute', zIndex: 100, cursor: 'pointer', textAlign: 'center'
                    }}>...</div>

                    <Accordion sx={{ bgcolor: '#292D39', color: '#efeff1ff', width: '90%' }}>
                        <AccordionSummary
                            expandIcon={<ArrowDropDownIcon sx={{ color: '#818698' }} />}
                            aria-controls="panel3-content"
                            id="panel3-header"
                        >
                            <Typography component="span">Simulation Run</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <ConnectedModelParams />
                            <ConnectedAppProgressBar />
                        </AccordionDetails>
                    </Accordion>
                    {/* </div> */}
                </div>
            </div>
        </Draggable>

        <Draggable
            nodeRef={nodeRef}
            handle=".window-header" // Only drag by the header
        >
            <div ref={nodeRef} style={{ width: '30%', left: '55%', top: '50%', position: 'absolute' }}>
                {/* <div className="window-header" > */}
                <div>
                    <div className="window-header" style={{
                        width: '50px', height: '25px', background: '#292D39', backgroundColor: '#292D39', bgcolor: '#292D39', color: 'white', left: '91%', position: 'absolute', zIndex: 100, cursor: 'pointer', textAlign: 'center'
                    }}>...</div>

                    <Accordion sx={{ bgcolor: '#292D39', color: '#efeff1ff', width: '90%' }}>
                        <AccordionSummary
                            expandIcon={<ArrowDropDownIcon sx={{ color: '#818698' }} />}
                            aria-controls="panel3-content"
                            id="panel3-header"
                        >
                            <Typography component="span">Simulation Model DB</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <ConnectedModelData />
                        </AccordionDetails>
                    </Accordion>
                    {/* </div> */}
                </div>
            </div>
        </Draggable>
                </>
                : null}
                </>
    );

}


const mapStateToProps = (state) => ({
    windows_show : state.windows_show
})

const ConnectedWindowGUI = connect(mapStateToProps)(WindowGUI);

export default ConnectedWindowGUI;

const WindowHandle = ({
    left,
    top
}) => {
    return (
        <div class="window-handle" style={{ left: {left}, top: {top}, position: 'absolute' }}>

        </div>
    )
}

