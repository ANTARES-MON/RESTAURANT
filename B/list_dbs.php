<?php
$servername = "127.0.0.1";
$username = "root";
$password = "root";
$port = 8889;

$conn = new mysqli($servername, $username, $password, "", $port);

if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

$result = $conn->query("SHOW DATABASES");

if ($result->num_rows > 0) {
  while($row = $result->fetch_assoc()) {
    echo $row["Database"] . "\n";
  }
} else {
  echo "0 results";
}
$conn->close();
?>
