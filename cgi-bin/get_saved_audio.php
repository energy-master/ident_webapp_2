<?php

// Written by Rahul Tandon, RS Aqua 2025
// PHP script to query and return model database data



// CONFIG
$STREAM_ROOT_PATH = '/media/marlin/Elements2/html/marlin_live';



// Define model data return array.
$stream_data = Array();
// Get all folders of bots (models):
// $stream_ids = array_diff(scandir($STREAM_ROOT_PATH), array('..', '.'));
$stream_data['stream_ids'] = Array();



// var_dump($model_ids);

// for ($i = 2; $i<count($stream_ids)+2; $i++){
//     array_push($stream_data['stream_ids'], $stream_ids[$i]);
// }


// *** now get data about the models ***
$stream_data['stream_paths'] = Array();
$stream_data['streams'] = Array();
$stream_data['stream_data'] = Array();

//get list of bots for each model
$STREAM_PATH = $STREAM_ROOT_PATH . "/";

// for ($i = 0; $i<count($stream_data['stream_ids']); $i++){
    
    // echo ($STREAM_PATH);
    
    array_push($stream_data['stream_paths'], $STREAM_PATH);
    // get list of bots

    $stream_files = Array();
    if (is_dir($STREAM_PATH)){
        
        if ($dh = opendir($STREAM_PATH)){
           
            while (($file = readdir($dh)) !== false){
                
                if (($file != ".") && ($file != "..")){
                    $extension = pathinfo($file, PATHINFO_EXTENSION);
                    if (($extension == 'wav') || ($extension=='flac')){
                        array_push($stream_files, $file);
                    }
                    // array_push($stream_files, $file);

                }

            }
            closedir($dh);
          }
    }
   
   
    

    // save bots to model
    $stream_name = "saved_files";
    
    $stream_file_data = [$stream_name=>$stream_files];
    
    array_push($stream_data['streams'], $stream_file_data);
    
// }


// var_dump($model_data['model_ids']);

echo json_encode($stream_data);