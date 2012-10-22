<?php

header('Content-type: application/json');
 
$cachefile = "feed.json";

// 15 minutes
$cachetime = 15 * 60; 

// Serve from the cache if it is younger than $cachetime
if (file_exists($cachefile) && 
   (time() - $cachetime < filemtime($cachefile))) 
{

  // echo "// From cache generated ".date('H:i', filemtime($cachefile))."\n";

  include($cachefile);

  exit;

}

// Set your CSV feed
$feed = 'https://docs.google.com/spreadsheet/pub?key=0Aj3aReTsghGzdHJ4WHhETFkwd1BLVHAtWEtzN1NLbkE&single=true&gid=3&output=csv';
 
// Arrays we'll use later
$keys = array();
$newArray = array();
 
// Function to convert CSV into associative array
function csvToArray($file, $delimiter) { 
  if (($handle = fopen($file, 'r')) !== FALSE) { 
    $i = 0; 
    while (($lineArray = fgetcsv($handle, 4000, $delimiter, '"')) !== FALSE) { 
      for ($j = 0; $j < count($lineArray); $j++) { 
        $arr[$i][$j] = $lineArray[$j]; 
      } 
      $i++; 
    } 
    fclose($handle); 
  } 
  return $arr; 
} 
 
// Do it
$data = csvToArray($feed, ',');
 
// Set number of elements (minus 1 because we shift off the first row)
$count = count($data) - 1;
 
//Use first row for names  
$labels = array_shift($data);  
 
foreach ($labels as $label) {
  $keys[] = $label;
}
 
// Add Ids, just in case we want them later
$keys[] = 'id';
 
for ($i = 0; $i < $count; $i++) {
  $data[$i][] = $i;
}
 
// Bring it all together
for ($j = 0; $j < $count; $j++) {
  $d = array_combine($keys, $data[$j]);
  $newArray[$j] = $d;
}
 
// Print it out as JSON
// echo json_encode($newArray);

$fp = fopen($cachefile, 'w'); 
// save the contents of output buffer to the file
fwrite($fp, json_encode($newArray));
// close the file
fclose($fp); 

?>
