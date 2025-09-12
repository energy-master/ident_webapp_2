<?php


// if ( !empty($_SERVER['CONTENT_LENGTH']) && empty($_FILES) && empty($_POST) )
//   echo 'The uploaded zip was too large. You must upload a file smaller than ' . ini_get("upload_max_filesize");

$filename = $_POST['fileName'];
$sample_rate = $_POST['sampling'];
$run_id = $_POST['run_id'];


// run marlin R&D data upload
$path_to_exe = "/media/marlin/Elements2/html/cgi-bin/run_fft.py " . $filename . " " . $run_id . " " . $sample_rate;
echo $path_to_exe;
$cmd = "nohup python3 ";
$cmd = $cmd . " " . $path_to_exe;
$result = exec($cmd);

echo $result;

?>