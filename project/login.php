<?php
$conn = new mysqli("localhost", "root", "", "animal_game"); // 修改為你的資料庫名稱
if ($conn->connect_error) {
  die("連線失敗: " . $conn->connect_error);
}

$username = $_POST['username'];
$password = $_POST['password'];

$sql = "SELECT * FROM users WHERE username='$username' AND password='$password'";
$result = $conn->query($sql);

if ($result->num_rows === 1) {
  echo "success";
} else {
  echo "fail";
}

$conn->close();
?>
