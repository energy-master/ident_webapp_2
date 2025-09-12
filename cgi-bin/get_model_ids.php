<?php

// Written by Rahul Tandon, RS Aqua 2025
// PHP script to query and return model database data



// CONFIG
$MODEL_ROOT_PATH = '/media/marlin/Elements2/html/ident/bots_repo';

// Define model data return array.
$model_data = Array();
// Get all folders of bots (models):
$model_ids = array_diff(scandir($MODEL_ROOT_PATH), array('..', '.'));
$model_data['model_ids'] = Array();

// var_dump($model_ids);

for ($i = 2; $i<count($model_ids)+2; $i++){
    array_push($model_data['model_ids'], $model_ids[$i]);
}


// *** now get data about the models ***
$model_data['model_paths'] = Array();
$model_data['models'] = Array();
$model_data['model_data'] = Array();

//get list of bots for each model
for ($i = 0; $i<count($model_data['model_ids']); $i++){
    $BOT_PATH = $MODEL_ROOT_PATH . "/" . $model_data['model_ids'][$i] . "/";
    
    array_push($model_data['model_paths'], $BOT_PATH);
    // get list of bots

    $bots = Array();
    if (is_dir($BOT_PATH)){
       
        if ($dh = opendir($BOT_PATH)){
           
            while (($file = readdir($dh)) !== false){

                if (($file != ".") && ($file != "..")){
                    array_push($bots, $file);
                }

            }
            closedir($dh);
          }
    }
   
    // save bots to model
    $model_name = $model_data['model_ids'][$i];
    $model_bot_data = [$model_name=>$bots];
    array_push($model_data['models'], $model_bot_data);

}

// var_dump($model_data['model_ids']);

echo json_encode($model_data['model_ids']);