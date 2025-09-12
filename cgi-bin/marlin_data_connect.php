<?php


if ( !empty($_SERVER['CONTENT_LENGTH']) && empty($_FILES) && empty($_POST) )
  echo 'The uploaded zip was too large. You must upload a file smaller than ' . ini_get("upload_max_filesize");

$result = array();
$result['api-service'] = 'Upload acoustic file.';
$result['api-version'] = '1.1';
$result['error'] = False;
$result['file-data'] = $_FILES;

// return json_encode($result);

// $base_id = $_POST['base_id'];

$file_size = $_FILES["upload_file"]["size"];
//if ($file_size > 8428800){
if ($file_size > 209715200){
  
  $result['error'] = True;
  $result['error-message'] = "File too large! max [200MB]";
  echo json_encode($result);
  return;
}

// echo $message;
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
if( $message ) {
    $result['error'] = True;
    $result['error-message'] = $message;
   echo json_encode($result);
}
if( !$message ) {
    if( !is_uploaded_file($_FILES['upload_file']['tmp_name']) ) {
        $message = 'Error uploading file - unknown error.';
         $result['error'] = True;
         $result['error-message'] = $message;
    } else {
        // Let's see if we can move the file...
        $dest .= '/'.$this_file;
        if( !move_uploaded_file($_FILES['upload_file']['tmp_name'], $dest) ) { // No error supporession so we can see the underlying error.
            $message = 'Error uploading file - could not save upload (this will probably be a permissions problem in '.$dest.')';
            $result['error'] = True;
            $result['error-message'] = $message;
        } else {
            $message = 'File uploaded okay.';
            $result['error'] = False;
            $result['log'] = $result['log'] . '\n' . $message;
        }
    }
}



$target_dir = "/media/marlin/Elements41/marlin_connect_upload/";

// $web_target_dir = "/home/vixen/html/rs/ident_app/ident/brahma/out/";
// var_dump($_FILES);
//$target_file = $target_dir . basename($_FILES["upload_file"]["name"]) . "." . $imageFileType;

// $target_file = $target_dir . "tesdt";


// echo "----";
$uploadOk = 1;
$imageFileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));
$target_file = $target_dir . basename($_FILES["upload_file"]["name"]); //. "." . $imageFileType;
$fn = basename($_FILES["upload_file"]["name"]);
// $ident_id = $_POST['ident_id'];
$user_uid = $_POST['user_uid'];
$location_id = $_POST['upload_location_string'];
$run_id = $user_uid . "_" . $location_id . rand(0,1000);
// $feature_version_selector = $_POST['feature_version_selector'];
// $activation_energy = $_POST['activation-level'];
// $activation_energy_80 = $_POST['80-activation-level'];
// $number_features = $_POST['number_features'];
// $structure_similarity = $_POST['structure_similarity'];
// $version_time_from = $_POST['version_time_from'];
// $version_time_to = $_POST['version_time_to'];

// echo $ident_id;

// if ($_FILES["upload_file"]["name"] == "Test_File_1_Sonar.wav"){
//   $ident_id = 213;
// }

// $target_file = $target_dir . $base_id . "." . $imageFileType;

// if (isset($_POST['data'])){
//   if ($_POST['data'] == "label")
//   {
//     $target_file = $web_target_dir . $base_id . "." . $imageFileType;
//   }
// }

//echo $target_file;
// Check if image file is a actual image or fake image
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
// var_dump($_FILES);
// // Check if file already exists
// if (file_exists($target_file)) {
//   //echo "Sorry, file already exists.";
//   $uploadOk = 0;
// }


// Check file size
// if ($_FILES["fileToUpload"]["size"] > 500000) {
//   echo "Sorry, your file is too large.";
//   $uploadOk = 0;
// }

// Allow certain file formats
// if($imageFileType != "wav" && $imageFileType != "png" && $imageFileType != "txt" && $imageFileType != "jpeg"
// && $imageFileType != "gif" ) {
//   echo "Sorry, only JPG, JPEG, PNG & GIF files are allowed. ". $imageFileType;
//   $uploadOk = 0;
// }

// Check if $uploadOk is set to 0 by an error
if ($uploadOk == 0) {
  //echo "Sorry, your file was not uploaded.";
// if everything is ok, try to upload file



} else {
  if (move_uploaded_file($_FILES["upload_file"]["tmp_name"], $target_file)) {


      // run marlin R&D data upload
      $path_to_exe = "/home/marlin/dev/marlinlabel/marlin.py filename " . $fn ." frame_size 5 frequency_frame_size 100 frequency_target_min 0 frequency_target_max 0 min_memory 100 max_memory 0 run_id " . $run_id . " location " . $location_id . " user_uid " . $user_uid . "  &";
      $cmd = " nohup python3 ";

      $cmd = $cmd . " " . $path_to_exe;
     
      $result = "none";
      //$result = exec($cmd);
      $result['error'] = False;
      $result['log'] = $result['log'] . '\n' . "Upload complete. ";
      echo json_encode($result);
      return;
  
  } else {
      $result['error'] = True;
      $result['log'] = $result['log'] . '\n' . "Sorry, there was an error uploading your file.";
      echo json_encode($result);
      return;
  }
}







?>