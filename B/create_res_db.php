<?php
$servername = "127.0.0.1";
$username = "root";
$password = "root";
$port = 8889;

$conn = new mysqli($servername, $username, $password, "", $port);

if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

// Create database
$sql = "CREATE DATABASE IF NOT EXISTS res";
if ($conn->query($sql) === TRUE) {
  echo "Database 'res' created successfully\n";
} else {
  echo "Error creating database: " . $conn->error . "\n";
}

$conn->close();
?>
