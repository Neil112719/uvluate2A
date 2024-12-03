<?php
require 'cors.php';
require 'database.php';

$headers = getallheaders();
$authorization = $headers['Authorization'] ?? '';

if (strpos($authorization, 'Bearer ') === 0) {
    $sessionToken = substr($authorization, 7); // Extract token after 'Bearer '
} else {
    echo json_encode(['success' => false, 'message' => 'Session token missing.']);
    exit;
}

$query = $conn->prepare("
    SELECT profiles.id, profiles.fname, profiles.mname, profiles.lastname, profiles.suffix, users.usertype 
    FROM auth
    JOIN profiles ON auth.id = profiles.id
    JOIN users ON auth.id = users.id
    WHERE auth.session_token = ?
");
$query->bind_param('s', $sessionToken);
$query->execute();
$result = $query->get_result();

if ($result->num_rows === 0) {
    echo json_encode(['success' => false, 'message' => 'User not found or session invalid.']);
    exit;
}

$user = $result->fetch_assoc();
echo json_encode(['success' => true, 'user' => $user]);
?>
