

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
import { propsStateInitializer } from '@mui/x-data-grid/internals';
import { gsap } from "gsap";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { useThree } from '@react-three/fiber';
import Button from '@mui/material/Button';

let columns = [

    {
        field: 'detection_model', headerName: 'Model', width: 300,
        editable: false,
        flex: 1,
        headerClassName: 'dataHdr',
        renderCell: (params) => (
            <Typography variant="overline" sx={{ color: 'white' }}>
                {params.value}
            </Typography>
        ),
    },
   
    {
        field: 'detection_file', headerName: 'Det File', width: 300,
        editable: false,
        flex: 0,
        headerClassName: 'dataHdr',
         renderCell: (params) => (
                    <Typography variant="overline" sx={{ color:'white' }}>
                                {params.value}
                    </Typography>
                ),
    },
        {
            field: 'download',
            headerName: 'Download',
            width: 200,
            flex: 1,
            disableClickEventBubbling: true,
            headerClassName: 'dataHdr',
            renderCell: (params) => (

                <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    style={{ marginLeft: 16 }}
                    onClick={() => {

                        let dl_path = params.value;
                        const link = document.createElement("a");
                        link.download = dl_path;
                        link.href = dl_path;
                        link.click();

                    }}
                    startIcon={<FileDownloadIcon />}
                >
                    
                </Button>
            ),

        },
    {
        field: 'file_full', headerName: 'File', width: 300,
        editable: false,
        flex: 1,
        headerClassName: 'dataHdr',
        renderCell: (params) => (
            <Typography variant="overline" sx={{ color: 'white' }}>
                {params.value}
            </Typography>
        ),
    },




];



function DetectionsDialogue(props) {
    console.log('detections dialoge build');
    const dispatch = useDispatch();
    let rows =[
            {
            "id": 1,
                "detection_model" : 'No Data',
                "detection_time": ""
            }
        ];

    console.log(props.detections);
    console.log(props.view_models);
    // rows = props.active_models_rows;
    let selected_stream_tag = props.selected_stream;
    

    let file_http = "https://marlin-network.hopto.org/marlin_live/streams/" + selected_stream_tag;
      

    const buildRows = (data) => {

        rows = [];
        console.log(data);
        let row_number = 0;
        if (data.length > 0)
        {
            console.log('fd');
            //for (let i = data.length-1; i == 0; i--) {
            //for (let i = 0; i < data.length; i++) {
            for (let i = data.length - 1; i >= 0; i--) {
                console.log(data[i]);
                if (data[i]['detections'].length == 0) {
                    continue;
                }
                console.log(data.length - row_number);
                rows.push({

                    "id": row_number,
                    "detection_model": data[i]['model'],
                    "detection_file": data[i]['file_root'],
                    "download": file_http + "/" + data[i]['detections'][0]["body"]["filename"],
                    "file_full": data[i]['detections'][0]["body"]["filename"]

                });
                row_number += 1;


            }

        }
      
       


    }

    const modelRow_clicked = (
        params, // GridRowParams
        event, // MuiEvent<React.MouseEvent<HTMLElement>>
        details, // GridCallbackDetails
    ) => {

        //console.log(params);
        if ((params['row']['detection_model'] == "No Data") || (params['row']['detection_model'] == "No Data in Stream")){
            return;
        }
        dispatch({ type: "FILE_SELECTED", payload: { 'name': params['row']['file_full'], 'timestamp': params['row']['timestamp'], 'active_stream' : params.selected_stream } });

        //dispatch({ type: "FILE_SELECTED", payload: { 'name': params['row']['name'], 'timestamp': params['row']['time'] } });

        // gsap.to(camera.position, { x: 10, y: 5, z: 0, duration: 1 });
        // gsap.to(camera.rotation, { x: Math.PI / 4, duration: 1 });


    };

    
    console.log("building detection list");
    if (props.selected_stream.length > 0) {
        selected_stream_tag = props.selected_stream[0];
        if (selected_stream_tag in props.detections) {
            //console.log("looking now");
            let valid_decisions = [];
            for (let i = 0; i < props.detections[selected_stream_tag].length; i++){
               // console.log(props.detections[selected_stream_tag][i]['model'], props.view_models["interesting"]);
                if (props.view_models["interesting"].includes(props.detections[selected_stream_tag][i]['model'])) {
                    console.log("hit");
                    valid_decisions.push(props.detections[selected_stream_tag][i]);
                }

            }
           // console.log(valid_decisions);
            buildRows(valid_decisions);
        }
    }
   // console.log(rows);
    if (rows.length == 0) {
        rows = [
            {
                "id": 1,
                "detection_model": 'No Data in Stream',
                "detection_time": ""
            }
        ];
    }

    return (

        <div className='model_data'>
            {/* <Card variant="outlined">
                <CardHeader
                    title='Audio file data'>
                </CardHeader>
                <CardContent> */}
            <Stack direction="column" gap={0} style={{ width: '100%' }}>
                <Box sx={{ width: '100%', paddingtop: 0 }}>
                    <Typography variant="h6" gutterBottom>
                        {/* <span className='panel-header'>Connect to Stream</span> */}
                    </Typography></Box>


                <DataGrid
                    sx={{
                        m: 0, fontSize: 11, bgcolor: '#292D39', color: '#818698', bg: '#292D39', color: '#8C92A4', fontWeight: 'bold', '& .dataHdr': {
                            backgroundColor: '#292D39', color: '#8C92A4', fontWeight: 'bold'
                        }, '& .MuiTablePagination-root': {
                            // Styles for the root of the pagination component
                            color: 'primary.main',
                        },
                        '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                            // Styles for the "Rows per page" label and displayed rows count
                            fontSize: '1.0rem',
                            color: 'primary.main'
                        }, "& .MuiDataGrid-row:hover": {
                            backgroundColor: "green"
                            // color: "red"
                        }, "&.Mui-selected": {
                            backgroundColor: "green",
                            color: "white",
                            // Add more specific selectors for other elements within pagination

                        }, "& .MuiDataGrid-row.Mui-selected": {
                            backgroundColor: "green",
                        },
                    }}
                    rows={rows}
                    columns={columns}

                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 5,
                            },
                        },
                        pinnedColumns: {
                            left: ['id'],
                        },
                    }}
                    pinnedRows={{
                        bottom: [rows[0]],
                    }}
                    
                    onRowClick={modelRow_clicked} // here
                />
                {/* </ThemeProvider> */}
            </Stack>
            {/* </CardContent>
            </Card> */}
        </div>
    );
}


const mapStateToProps = (state) => {
    return {

        view_models: state.selected_view_models,
        selected_stream: state.selected_stream,
        detections: state.detections
    }
}


const ConnectedDetectionsDialogue = connect(mapStateToProps)(DetectionsDialogue);

export default ConnectedDetectionsDialogue