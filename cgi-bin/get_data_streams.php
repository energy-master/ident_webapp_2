<?php


function GetSecondsFromStart($start_time, $target_time){
    
    str_replace($start_time,'T', " ");
    str_replace($end_time,'T', " ");
   
    
    $timeFirst  = strtotime($start_time);
    $timeSecond = strtotime($target_time);
    
    $differenceInSeconds = $timeSecond - $timeFirst;
    
    return ($differenceInSeconds);
}

// Written by Rahul Tandon, RS Aqua 2025
// PHP script to query and return model database data



// CONFIG
$STREAM_ROOT_PATH = '/media/marlin/Elements2/html/marlin_live/streams';



// Define model data return array.
$stream_data = Array();
// Get all folders of bots (models):
$stream_ids = array_diff(scandir($STREAM_ROOT_PATH), array('..', '.'));
$stream_data['stream_ids'] = Array();



// var_dump($model_ids);

for ($i = 2; $i<count($stream_ids)+2; $i++){
    array_push($stream_data['stream_ids'], $stream_ids[$i]);
}


// *** now get data about the models ***
$stream_data['stream_paths'] = Array();
$stream_data['streams'] = Array();
$stream_data['stream_data'] = Array();
$stream_data['detections'] = Array();
$stream_data['models'] = Array();
$stream_data['file_data'] = Array();
//get list of bots for each model
for ($i = 0; $i<count($stream_data['stream_ids']); $i++){
    $STREAM_PATH = $STREAM_ROOT_PATH . "/" . $stream_data['stream_ids'][$i] . "/";
    
    array_push($stream_data['stream_paths'], $STREAM_PATH);
    // get list of bots

    $stream_files = Array();
    $stream_decisions = Array();
    $stream_models = Array();
    if (is_dir($STREAM_PATH)){
        
        if ($dh = opendir($STREAM_PATH)){
           
            while (($file = readdir($dh)) !== false){
                
                if (($file != ".") && ($file != "..")){
                    $extension = pathinfo($file, PATHINFO_EXTENSION);
                    if (($extension == 'wav') || ($extension=='flac')){
                        array_push($stream_files, $file);
                    }
                    if (($extension == 'det')){

                        //get dectecton data
                      
                        $jsonString = file_get_contents($STREAM_PATH . '/' . $file);
                       
                        
                        $detection_data = json_decode($jsonString, true); 
                        if ($detection_data == null){
                            //echo "what?!";
                            $detection_data = Array();

                        }
                        
                        
                        

                        $file_exp = explode('.',$file);
                        $model_name = explode('%',$file_exp[0])[1];
                        
                        if ($model_name == "")
                        {
                            
                            
                            $model_name = "EW_RPS";
                            //var_dump($detection_data);
                            
 
                        }
                        $file_root = explode('%',$file_exp[0])[0];
                        
                        if (sizeof($detection_data)>0){

                            # --- Edited for RPS data ---
                            if ($model_name == "EW_RPS"){
                                $file_root_tmp = "";
                                $f_e = explode('_',$file_root);
                                array_pop($f_e);
                               
                                $file_root = implode('_',$f_e);
                                
                                $operations = $detection_data["body"]["operations"];
                                $
                                $edited_detection_data = Array();

                                $tmp_detections = Array();
                                
                                for ($ij=0;$ij<sizeof($operations); $ij++){
                                    
                                    $active_filename = $operations[$ij]["filename"];
                                    //var_dump($operations[$ij]["extra"]["anomaly_time_swindow_ewindow_target_confidence"]);
                                    $tmp_detect = Array();
                                    $tmp_detect["header"] = [];
                                    $tmp_body = $operations[$ij]["extra"]["anomaly_time_swindow_ewindow_target_confidence"];
                                    $dt = GetSecondsFromStart($tmp_body[0]["window_start"],$tmp_body[0]["onset_time"]);
                                    
                                    $model_name = $model_name . "_" . $tmp_body[0]["target"];
                                    $tmp_body[0]["timestamp"] = $tmp_body[0]["onset_time"];
                                    $tmp_body[0]["start_time"] = $tmp_body[0]["window_start"];
                                    $tmp_body[0]["end_time"] = $tmp_body[0]["window_end"];
                                    $tmp_body[0]["chunk_start"] = $dt;
                                    $tmp_body[0]["chunk_end"] = $dt+5;
                                    $tmp_body[0]["model_name"] = $model_name;
                                    $tmp_body[0]["filename"] = $active_filename;
                                    $tmp_body[0]["target"] = $tmp_body[0]["target"];


                                    $tmp_detect["body"] = $tmp_body[0];
                                    array_push($tmp_detections,$tmp_detect);

                                    
                                    
                                    
                                   
                                }
                                
                               $detection_data = $tmp_detections;
                               
                            }

                            # ---

                            $data = ['file_root'=>$file_root,'model'=>$model_name,'file_name'=>$file, 'detections'=>$detection_data];
                            
                            if (in_array($model_name, $stream_models)==false){
                                $stream_models[] = $model_name;
                            }
                            array_push($stream_decisions,$data);
                        }

                    }

                }

            }
            closedir($dh);
          }
    }
   
    // get file_data
    try{
    $filejsonString = file_get_contents($STREAM_PATH . '/file_data.json');
    $file_data = json_decode($filejsonString, true); 
    }
    catch  (Exception $e){

    }
    $stream_data['file_data'][$stream_data['stream_ids'][$i]] = $file_data;

    // save bots to model
    $stream_name = $stream_data['stream_ids'][$i];
    
    $stream_file_data = [$stream_name=>$stream_files];
    
    $stream_data['detections'][ $stream_data['stream_ids'][$i]] = $stream_decisions;
    $stream_data['models'][$stream_data['stream_ids'][$i]] = $stream_models;
    array_push($stream_data['streams'], $stream_file_data);
    
}

$ordered_stream_files=array();

// order files by time and index
foreach ($stream_data['streams'] as $stream_files){
    
    foreach ($stream_files as $tag=>$file_vector){
        
        $ordered_files = array();
        foreach ($file_vector as $file_name){
            // work on file
            // _20250813_133134_054_m_001_p_001.flac
            $file_bits = explode('_',$file_name);
            // var_dump($file_bits);
            
            $yrStr = $file_bits[1];
            $timeStr = $file_bits[2];
            $msStr = $file_bits[3];
            $formattedDate = DateTime::createFromFormat('Ymd_His_v', $yrStr . "_" . $timeStr . "_" . $msStr);
            // var_dump($formattedDate);
            // array_push({$file_name=>$formattedDate}, $ordered_files);
            $file_root = explode('.',$file_name)[0];
            // $ordered_files[$file_name] = $formattedDate; 
            $data = ['filename'=>$file_name, 'datetime'=>$formattedDate, 'file_root'=>$file_root];
            array_push($ordered_files, $data);

            
        }

        usort($ordered_files, function($a, $b) {
        //compare times
        $timestampA = $a['datetime'];
        $timestampB = $b['datetime'];

        if ($timestampA == $timestampB) {
            return 0;
        }
            return ($timestampA > $timestampB) ? -1 : 1;
        });

        $ordered_stream_files[$tag] = $ordered_files;
        
        
    }
}

$stream_data['ordered'] = $ordered_stream_files;
$stream_data['debug'] = $tmp_detections;

// return data structure
echo json_encode($stream_data);