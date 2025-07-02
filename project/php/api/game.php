<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET");
header("Access-Control-Allow-Headers: Content-Type");

include_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'POST':
        if(isset($_GET['action']) && $_GET['action'] == 'start') {
            startGame();
        } else {
            endGame();
        }
        break;
    case 'GET':
        getGameRecords();
        break;
}

function startGame() {
    global $db;
    $data = json_decode(file_get_contents("php://input"));
    
    $query = "INSERT INTO play_records (user_id, game_type) VALUES (:user_id, :game_type)";
    $stmt = $db->prepare($query);
    
    $stmt->bindParam(":user_id", $data->user_id);
    $stmt->bindParam(":game_type", $data->game_type);
    
    if($stmt->execute()) {
        echo json_encode(array("message" => "遊戲開始", "record_id" => $db->lastInsertId()));
    }
}

function endGame() {
    global $db;
    $data = json_decode(file_get_contents("php://input"));
    
    // 更新遊玩紀錄
    $query = "UPDATE play_records SET end_time = NOW(), duration = :duration, completed = :completed WHERE id = :record_id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":duration", $data->duration);
    $stmt->bindParam(":completed", $data->completed);
    $stmt->bindParam(":record_id", $data->record_id);
    $stmt->execute();
    
    // 記錄分數
    $query = "INSERT INTO game_scores (user_id, game_type, score, points_earned) VALUES (:user_id, :game_type, :score, :points)";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":user_id", $data->user_id);
    $stmt->bindParam(":game_type", $data->game_type);
    $stmt->bindParam(":score", $data->score);
    $stmt->bindParam(":points", $data->points);
    $stmt->execute();
    
    // 更新用戶總積分
    $query = "UPDATE users SET total_points = total_points + :points WHERE id = :user_id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":points", $data->points);
    $stmt->bindParam(":user_id", $data->user_id);
    $stmt->execute();
    
    echo json_encode(array("message" => "遊戲結束，分數已記錄"));
}

function getGameRecords() {
    global $db;
    $user_id = $_GET['user_id'] ?? null;
    
    if($user_id) {
        $query = "SELECT pr.*, gs.score, gs.points_earned FROM play_records pr 
                  LEFT JOIN game_scores gs ON pr.user_id = gs.user_id AND pr.game_type = gs.game_type 
                  WHERE pr.user_id = :user_id ORDER BY pr.start_time DESC";
        $stmt = $db->prepare($query);
        $stmt->bindParam(":user_id", $user_id);
    } else {
        $query = "SELECT * FROM play_records ORDER BY start_time DESC LIMIT 20";
        $stmt = $db->prepare($query);
    }
    
    $stmt->execute();
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($result);
}
?>