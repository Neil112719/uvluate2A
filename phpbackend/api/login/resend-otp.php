<?php
require '../../misc/cors.php';
require '../../misc/database.php';
require '../../vendor/autoload.php'; // Autoload PHPMailer
date_default_timezone_set('Asia/Manila'); // Set timezone to Philippine Standard Time
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$data = json_decode(file_get_contents('php://input'), true);

$id = $data['id'] ?? '';

if (!$id) {
    echo json_encode(['success' => false, 'message' => 'User ID is required.']);
    exit;
}

// Fetch OTP details
$query = $conn->prepare("SELECT otp, otp_generation, otp_last_sent, email FROM auth JOIN profiles ON auth.id = profiles.id WHERE auth.id = ?");
$query->bind_param('s', $id);
$query->execute();
$result = $query->get_result();

if ($result->num_rows === 0) {
    echo json_encode(['success' => false, 'message' => 'User not found.']);
    exit;
}

$data = $result->fetch_assoc();
$currentOtp = $data['otp'];
$otpGeneration = strtotime($data['otp_generation']); // Convert to UNIX timestamp
$lastSent = strtotime($data['otp_last_sent']); // Convert to UNIX timestamp
$email = $data['email'];

$currentTimestamp = time();
$otpExpirationTime = $otpGeneration + 300; // OTP valid for 5 minutes
$canResendTime = $lastSent + 60; // OTP resend allowed after 1 minute

if ($currentTimestamp < $canResendTime) {
    $waitTime = $canResendTime - $currentTimestamp;
    echo json_encode(['success' => false, 'message' => "Please wait {$waitTime} seconds before resending the OTP."]);
    exit;
}

// Determine if the current OTP is still valid
if ($currentTimestamp > $otpExpirationTime) {
    // Generate a new OTP if the previous one has expired
    $currentOtp = random_int(100000, 999999);
    $updateOtpQuery = $conn->prepare("UPDATE auth SET otp = ?, otp_generation = NOW(), otp_last_sent = NOW() WHERE id = ?");
    $updateOtpQuery->bind_param('is', $currentOtp, $id);
    $updateOtpQuery->execute();
} else {
    // Update last sent timestamp for valid OTP
    $updateLastSentQuery = $conn->prepare("UPDATE auth SET otp_last_sent = NOW() WHERE id = ?");
    $updateLastSentQuery->bind_param('s', $id);
    $updateLastSentQuery->execute();
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
    $mail->addAddress($email);

    $mail->isHTML(true);
    $mail->Subject = 'Your OTP Code';
    $mail->Body = "Your OTP is <strong>$currentOtp</strong>. It is valid for 5 minutes.";

    $mail->send();
    echo json_encode(['success' => true, 'message' => 'OTP resent successfully.']);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Could not resend OTP.']);
}
?>
