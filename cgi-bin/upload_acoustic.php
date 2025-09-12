<?php


// if ( !empty($_SERVER['CONTENT_LENGTH']) && empty($_FILES) && empty($_POST) )
//   echo 'The uploaded zip was too large. You must upload a file smaller than ' . ini_get("upload_max_filesize");

$result = array();
$result['api-service'] = 'Upload acoustic file.';
$result['api-version'] = '1.1';
$result['error'] = False;
$result['file-data'] = $_FILES;
$result['post-data'] = $_POST;
$result['log'] = 'API call received.';

$file_size = $_FILES["upload_file"]["size"];
$result['log'] = $result['log'] . "\n" . 'File size OK.';
switch( $_FILES['upload_file']['error'] ) {
    case UPLOAD_ERR_OK:
        $message = false;;
        break;
    case UPLOAD_ERR_INI_SIZE:
    case UPLOAD_ERR_FORM_SIZE:
        $message .= ' - file too large (limit of '.get_max_upload().' bytes).';
        break;
    case UPLOAD_ERR_PARTIAL:
        $message .= ' - file upload was not completed.';
        break;
    case UPLOAD_ERR_NO_FILE:
        $message .= ' - zero-length file uploaded.';
        break;
    default:
        $message .= ' - internal error #'.$_FILES['newfile']['error'];
        break;
}


$result['error-message'] = "No errors recorded.";
if( $message ) {
    $result['error'] = True;
    $result['error-message'] = $message;
    
}

$result['log'] = $result['log'] . "\n" . 'Copying data.';
$target_dir = "/media/marlin/Elements41/marlin_connect_upload/";

$uploadOk = 1;
$imageFileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));
$target_file = $target_dir . basename($_FILES["upload_file"]["name"]); //. "." . $imageFileType;
$fn = basename($_FILES["upload_file"]["name"]);
$user_uid = $_POST['user_uid'];
$location_id = $_POST['location'];
$unique_key = $_POST['unique_flag'];
// $run_id = $user_uid . "_" . $location_id . rand(0,1000);
$run_id = $unique_key;
$result['run_id'] = $run_id;

if(isset($_POST["submit"])) {
  $check = getimagesize($_FILES["upload_file"]["tmp_name"]);
  if($check !== false) {
    //echo "File is an image - " . $check["mime"] . ".";
    $uploadOk = 1;
  } else {
    //echo "File is not an image.";
    $uploadOk = 0;
    return;   
  }
}

// Check if $uploadOk is set to 0 by an error
if ($uploadOk == 0) {


} else {

  if (move_uploaded_file($_FILES["upload_file"]["tmp_name"], $target_file)) {

  
        // run marlin R&D data upload
        $path_to_exe = "/home/marlin/dev/marlinlabel/marlin.py filename " . $fn ." frame_size 60 frequency_frame_size 100 frequency_target_min 0 frequency_target_max 0 min_memory 100 max_memory 0 run_id " . $run_id . " location " . $location_id . " user_uid " . $user_uid . "  &";
        $cmd = " nohup python3 ";
        
        $cmd = $cmd . " " . $path_to_exe;
        $exec_result = "none";
        
        $exec_result = exec($cmd);
        $result['error'] = False;
        $result['log'] = $result['log'] . "\n" . "Upload & indexing complete. ";
        $result['cmd-respons'] = $exec_result;
        echo json_encode($result);
        return;
  
  } else {
        $result['error'] = True;
        $result['log'] = $result['log'] . "\n". "Sorry, there was an error uploading your file. Please try again.";
        echo json_encode($result);
        return;
  }
}







?>