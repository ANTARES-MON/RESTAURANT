<?php
$servername = "127.0.0.1";
$username = "root";
$password = "root";
$port = 8889;
$dbname = "res";

$conn = new mysqli($servername, $username, $password, $dbname, $port);

if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT count(*) as count FROM users";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
  $row = $result->fetch_assoc();
  echo "Users count: " . $row["count"];
} else {
  echo "0 results";
}
$conn->close();
?>
