<?php
require '../../misc/cors.php';
require '../../misc/database.php';
date_default_timezone_set('Asia/Manila'); // Set timezone to Philippine Standard Time

$data = json_decode(file_get_contents('php://input'), true);

$id = $data['id'] ?? '';
$otp = $data['otp'] ?? '';

if (!$id || !$otp) {
    echo json_encode(['success' => false, 'message' => 'User ID and OTP are required.']);
    exit;
}

try {
    // Check OTP validity
    $query = $conn->prepare(
        "SELECT auth.otp, users.usertype 
         FROM auth 
         JOIN users ON auth.id = users.id 
         WHERE auth.id = ?"
    );
    $query->bind_param('s', $id);
    $query->execute();
    $result = $query->get_result();

    if ($result->num_rows === 0) {
        echo json_encode(['success' => false, 'message' => 'OTP not found.']);
        exit;
    }

    $data = $result->fetch_assoc();
    $storedOtp = $data['otp'];
    $userType = $data['usertype'];

    if ($storedOtp != $otp) {
        echo json_encode(['success' => false, 'message' => 'Invalid OTP.']);
        exit;
    }

    // Generate a session token
    $sessionToken = bin2hex(random_bytes(32));

    // Save the session token in the database
    $updateSessionQuery = $conn->prepare(
        "UPDATE auth 
         SET session_token = ?, otp = NULL 
         WHERE id = ?"
    );

    if (!$updateSessionQuery) {
        throw new Exception('Prepare failed: ' . $conn->error);
    }

    $updateSessionQuery->bind_param('ss', $sessionToken, $id);

    if (!$updateSessionQuery->execute()) {
        throw new Exception('Failed to save session token: ' . $updateSessionQuery->error);
    }

    // Return the session token and user type
    echo json_encode([
        'success' => true,
        'message' => 'OTP verified successfully.',
        'session_token' => $sessionToken,
        'usertype' => $userType,
    ]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}
?>
