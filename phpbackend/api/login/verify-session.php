<?php
require '../../misc/cors.php';
require '../../misc/database.php';

// Get headers
$headers = getallheaders();
$authorization = $headers['Authorization'] ?? '';

// Extract the token from the Authorization header
if (strpos($authorization, 'Bearer ') === 0) {
    $sessionToken = substr($authorization, 7); // Extract token after 'Bearer '
} else {
    $sessionToken = '';
}

// Decode JSON payload
$data = json_decode(file_get_contents('php://input'), true);
$requiredUserType = $data['required_usertype'] ?? '';

// Log for debugging
error_log("Incoming Headers: " . print_r($headers, true));
error_log("Session Token: $sessionToken");
error_log("Required User Type: $requiredUserType");

if (!$sessionToken || !$requiredUserType) {
    error_log("Invalid session data: Token - $sessionToken, UserType - $requiredUserType");
    echo json_encode(['success' => false, 'message' => 'Invalid session data.']);
    exit;
}

// Verify session token and user type
$query = $conn->prepare("
    SELECT usertype 
    FROM auth 
    JOIN users ON auth.id = users.id 
    WHERE session_token = ?
");
$query->bind_param('s', $sessionToken);
$query->execute();
$result = $query->get_result();

if ($result->num_rows === 0) {
    error_log("Session not found for token: $sessionToken");
    echo json_encode(['success' => false, 'message' => 'Session not found.']);
    exit;
}

$row = $result->fetch_assoc();
$usertype = (int) $row['usertype'];

if ($usertype === (int) $requiredUserType) {
    echo json_encode([
        'success' => true,
        'message' => 'Session verified.',
    ]);
} else {
    error_log("Unauthorized user type: Expected $requiredUserType, Got $usertype");
    echo json_encode(['success' => false, 'message' => 'Unauthorized user type.']);
}
?>
