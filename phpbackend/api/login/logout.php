<?php
require_once '../../misc/cors.php';
require_once '../../database.php';

$data = json_decode(file_get_contents('php://input'), true);
$sessionToken = $data['session_token'] ?? '';

if (!$sessionToken) {
    echo json_encode(['success' => false, 'message' => 'Session token is required.']);
    exit;
}

$query = $conn->prepare("UPDATE auth SET session_token = NULL WHERE session_token = ?");
$query->bind_param('s', $sessionToken);
$query->execute();

if ($query->affected_rows > 0) {
    echo json_encode(['success' => true, 'message' => 'Logout successful.']);
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid session token.']);
}
?>
