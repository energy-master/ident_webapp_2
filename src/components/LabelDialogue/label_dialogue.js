

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
import { useThree } from '@react-three/fiber';


let columns = [

    {
        field: 'label_type', headerName: 'Label', width: 300,
        editable: false,
        flex: 5,
        headerClassName: 'dataHdr',
        renderCell: (params) => (
            <Typography variant="overline" sx={{ color: 'white' }}>
                {params.value}
            </Typography>
        ),
    },
   
    {
        field: 'label_file', headerName: 'File', width: 300,
        editable: false,
        flex: 1,
        headerClassName: 'dataHdr',
         renderCell: (params) => (
                    <Typography variant="overline" sx={{ color:'white' }}>
                                {params.value}
                    </Typography>
                ),
    },
    {
        field: 'file_time', headerName: 'Time', width: 300,
        editable: false,
        flex: 0,
        headerClassName: 'dataHdr',
        renderCell: (params) => (
            <Typography variant="overline" sx={{ color: 'white' }}>
                {params.value}
            </Typography>
        ),
    },
   
   




];



function LabelsDialogue(props) {
    console.log('labels dialoge build');
    const dispatch = useDispatch();
    let rows =[
            {
            "id": 1,
                "label_type" : 'No Data',
                "label_file": ""
            }
        ];

    // console.log(props.detections);
    // console.log(props.view_models);
    // rows = props.active_models_rows;
    let selected_stream_tag = "";
    


    const GetFileLocation = (label) => {
        //console.log(props.ordered_stream_files);
        //console.log("loop");
        let ordered_idx = -1;
        let diff = 0;
        let sel_diff = 99999;
        for (let i = 0; i < props.ordered_stream_files[props.selected_stream[0]].length; i++) {
            let file_time_zulu = props.ordered_stream_files[props.selected_stream[0]][i]["timeZulu"];

            let label_time = label["timestamp_start"];
            
            let date1 = new Date(file_time_zulu);
            let date2 = new Date(label_time);
            console.log(date1, date2);
            diff = (date1.getTime() - date2.getTime()) / 1000;
            if (diff > 0) {
                // console.log(diff);
                if (diff < 300) {
                    if (diff < sel_diff) {
                        sel_diff = diff;
                        ordered_idx = i;
                        
                    }


                }

            }
        }

        return ordered_idx;

    }


    const buildRows = (data) => {

        rows = [];
        
        for (let i = 0; i < (data.length); i++) {
            console.log(data[i]);
            let idx = GetFileLocation(data[i]);
            // let idx = 2;
            console.log(idx);
            let fn = props.ordered_stream_files[props.selected_stream[0]][idx]["filename"];
            let ts = props.ordered_stream_files[props.selected_stream[0]][idx]["timeZulu"];
            rows.push({
                "id": i,
                "label_type": data[i]['label'],
                "label_file": fn,
                "file_time":ts
                
              
            });


        }
       
       


    }

    const modelRow_clicked = (
        params, // GridRowParams
        event, // MuiEvent<React.MouseEvent<HTMLElement>>
        details, // GridCallbackDetails
    ) => {

        //console.log(params);
        if ((params['row']['label_type'] == "No Data") || (params['row']['detection_model'] == "No Data in Stream")){
            return;
        }
        dispatch({ type: "FILE_SELECTED", payload: { 'name': params['row']['label_file'], 'timestamp': params['row']['file_time'], 'active_stream' : params.selected_stream } });

      

    };

   
    console.log("building label list");
    if (props.selected_stream.length > 0) {
        selected_stream_tag = props.selected_stream[0];
        if (selected_stream_tag in props.labels) {
            
            let valid_labels = [];
            for (let i = 0; i < props.labels[selected_stream_tag].length; i++){
               // console.log(props.detections[selected_stream_tag][i]['model'], props.view_models["interesting"]);
                //if (props.view_models["interesting"].includes(props.detections[selected_stream_tag][i]['model'])) {
                    console.log("hit");
                    valid_labels.push(props.labels[selected_stream_tag][i]);
                //}

            }
            
            buildRows(valid_labels);
        }
    }
    console.log(rows);
    if (rows.length == 0) {
        rows = [
            {
                "id": 1,
                "label_type": 'No Data in Stream',
                "label_file": ""
            }
        ];
    }

    return (

        <div className='model_data'>
           
            <Stack direction="column" gap={0} style={{ width: '100%' }}>
                <Box sx={{ width: '100%', paddingtop: 0 }}>
                    <Typography variant="h6" gutterBottom>
                    
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

        view_labels: state.selected_labels,
        selected_stream: state.selected_stream,
        labels: state.labels,
        ordered_stream_files : state.ordered_stream_files
    }
}


const ConnectedLabelsDialogue = connect(mapStateToProps)(LabelsDialogue);

export default ConnectedLabelsDialogue