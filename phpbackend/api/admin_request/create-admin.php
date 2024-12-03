<?php
// Include CORS headers and database connection
require '../../misc/cors.php';
require '../../misc/database.php';

// Prepare the response array
$response = [
    'success' => false,
    'message' => '',
];

try {
    // Create a database connection
    $conn = new mysqli($db_host, $db_user, $db_password, $db_name);

    // Check connection
    if ($conn->connect_error) {
        throw new Exception("Connection failed: " . $conn->connect_error);
    }

    // Check if the necessary POST data is available
    if (isset($_POST['fname'], $_POST['lname'], $_POST['email'], $_POST['password'])) {
        $fname = mysqli_real_escape_string($conn, $_POST['fname']);
        $mname = isset($_POST['mname']) ? mysqli_real_escape_string($conn, $_POST['mname']) : '';
        $lname = mysqli_real_escape_string($conn, $_POST['lname']);
        $suffix = isset($_POST['suffix']) ? mysqli_real_escape_string($conn, $_POST['suffix']) : '';
        $email = mysqli_real_escape_string($conn, $_POST['email']);
        $password = mysqli_real_escape_string($conn, $_POST['password']);

        // Default usertype to 1 (Admin)
        $usertype = 1;

        // Validate email format
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new Exception("Invalid email format.");
        }

        // Hash the password before storing it
        $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

        // Prepare SQL to insert a new admin
        $sql = "INSERT INTO users (fname, mname, lname, suffix, email, password, usertype)
                VALUES ('$fname', '$mname', '$lname', '$suffix', '$email', '$hashedPassword', $usertype)";

        if ($conn->query($sql) === TRUE) {
            $response['success'] = true;
            $response['message'] = "New admin created successfully.";
        } else {
            throw new Exception("Error: " . $conn->error);
        }

    } else {
        throw new Exception("Missing required fields.");
    }

    // Close the database connection
    $conn->close();

} catch (Exception $e) {
    $response['message'] = "Error: " . $e->getMessage();
}

// Return the response as JSON
header('Content-Type: application/json');
echo json_encode($response);
