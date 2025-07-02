<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, PUT");
header("Access-Control-Allow-Headers: Content-Type");

include_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'POST':
        createUser();
        break;
    case 'GET':
        getUser();
        break;
    case 'PUT':
        updatePoints();
        break;
}

function createUser() {
    global $db;
    $data = json_decode(file_get_contents("php://input"));
    
    $query = "INSERT INTO users (username, email) VALUES (:username, :email)";
    $stmt = $db->prepare($query);
    
    $stmt->bindParam(":username", $data->username);
    $stmt->bindParam(":email", $data->email);
    
    if($stmt->execute()) {
        echo json_encode(array("message" => "用戶創建成功", "user_id" => $db->lastInsertId()));
    } else {
        echo json_encode(array("message" => "用戶創建失敗"));
    }
}

function getUser() {
    global $db;
    $user_id = $_GET['id'] ?? null;
    
    if($user_id) {
        $query = "SELECT * FROM users WHERE id = :id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(":id", $user_id);
    } else {
        $query = "SELECT * FROM users ORDER BY total_points DESC LIMIT 10";
        $stmt = $db->prepare($query);
    }
    
    $stmt->execute();
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($result);
}

function updatePoints() {
    global $db;
    $data = json_decode(file_get_contents("php://input"));
    
    $query = "UPDATE users SET total_points = total_points + :points WHERE id = :user_id";
    $stmt = $db->prepare($query);
    
    $stmt->bindParam(":points", $data->points);
    $stmt->bindParam(":user_id", $data->user_id);
    
    if($stmt->execute()) {
        echo json_encode(array("message" => "積分更新成功"));
    } else {
        echo json_encode(array("message" => "積分更新失敗"));
    }
}
?>