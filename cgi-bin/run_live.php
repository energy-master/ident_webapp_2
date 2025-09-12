<?php

$fileName = $_POST['fileName'];
$ident_id = $_POST['model_id'];
$user_uid = $_POST['user_uid'];
$ratio_active = $_POST['ratio_active'];
$number_bots = $_POST['number_bots'];
$activation_energy = $_POST['activation-level'];
$search_id = $_POST['target'];
$similarity_threshold = $_POST['similarity_threshold'];
$streaming_window = $_POST['streaming_window'];
$delta_t = $_POST['delta_t'];
$nfft = $_POST['nfft'];

$models = $_POST['selected_models'];
$models_string = str_replace(',', ' ', $models);

// for ($i=0;$i<count($models);$i++){
//     $models_string += " " . $models[$i];
// }

$version = "1_0_0/2_0_0/3_0_0/noise/1_0_1";
$fixed_flags = "2024-06-03 12:10:00 2026-11-22 10:17:00 -1 1 -1 -1 nobm 10000";
//python3 tk_ident_live.py 20010606_000000_000.wav harbour_porpoise hp_one 0001vixen 0.85 0.2 5 0.8 1_0_0/2_0_0/3_0_0/noise/1_0_1 2024-06-03 12:10:00 2026-11-22 10:17:00 -1 1 -1 -1 nobm 10000 remote_test_01 60 0.01 1024

// $pathToFile = "/home/ident/html/marlin_live/" . $fileName;
$pathToFile =  $fileName;

$path_to_exe = "/home/ident/live/ident_live_app.py " . $pathToFile. " ". $search_id . " live_app " . $user_uid. " " .$activation_energy. " " . $ratio_active . " " .$number_bots . " " . $similarity_threshold . " " . $version . " " . $fixed_flags . " " . $ident_id . " " . $streaming_window . " " . $delta_t . " " . $nfft . " " . $models_string;
$cmd = "nohup python3 ";
$cmd = $cmd . " " . $path_to_exe . " &";

$result = exec($cmd);

echo $path_to_exe;



?>