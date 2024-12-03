<?php
require '../../misc/cors.php';
require '../../misc/database.php';
require '../../vendor/autoload.php'; // Autoload PHPMailer
date_default_timezone_set('Asia/Manila'); // Set timezone to Philippine Standard Time
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

$data = json_decode(file_get_contents('php://input'), true);

$id = $data['id'] ?? '';
$password = $data['password'] ?? '';

if (!$id || !$password) {
    echo json_encode(['success' => false, 'message' => 'User ID and password are required.']);
    exit;
}

try {
    // Fetch user details
    $query = $conn->prepare("SELECT users.password, users.usertype, profiles.email 
                             FROM users 
                             JOIN profiles ON users.id = profiles.id 
                             WHERE users.id = ?");
    if (!$query) {
        throw new Exception('Prepare failed: ' . $conn->error);
    }

    $query->bind_param('s', $id);
    $query->execute();
    $result = $query->get_result();

    if ($result->num_rows === 0) {
        echo json_encode(['success' => false, 'message' => 'User not found.']);
        exit;
    }

    $user = $result->fetch_assoc();

    if (!password_verify($password, $user['password'])) {
        echo json_encode(['success' => false, 'message' => 'Incorrect password.']);
        exit;
    }

    if ($user['usertype'] == -1) {
        echo json_encode(['success' => false, 'message' => 'Account is deactivated.']);
        exit;
    }

    // Generate OTP
    $otp = random_int(100000, 999999);

    // Insert or update auth table
    $updateQuery = $conn->prepare(
        "INSERT INTO auth (id, otp, otp_generation, otp_last_sent) 
        VALUES (?, ?, NOW(), NOW()) 
        ON DUPLICATE KEY UPDATE 
        otp = VALUES(otp), 
        otp_generation = NOW(), 
        otp_last_sent = NOW()"
    );

    if (!$updateQuery) {
        throw new Exception('Prepare failed: ' . $conn->error);
    }

    $updateQuery->bind_param('si', $id, $otp);

    if (!$updateQuery->execute()) {
        throw new Exception('Failed to save OTP: ' . $updateQuery->error);
    }

    // Send OTP via email
    $mail = new PHPMailer(true);

    try {
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'phantomantonneil@gmail.com';
        $mail->Password = 'kqcm juio hkke txye'; // Use an app-specific password
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        $mail->Port = 465;

        $mail->setFrom('phantomantonneil@gmail.com', 'UVluate');
        $mail->addAddress($user['email']);

        $mail->isHTML(true);
        $mail->Subject = 'Your OTP Code';
        $mail->Body = "Your OTP is <strong>$otp</strong>. It is valid for 5 minutes.";

        $mail->send();
        echo json_encode(['success' => true, 'message' => 'OTP sent to your email.']);
    } catch (Exception $e) {
        throw new Exception('Failed to send OTP: ' . $e->getMessage());
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}
?>
