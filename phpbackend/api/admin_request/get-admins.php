<?php
// Include CORS headers and database connection
require '../../misc/cors.php';
require '../../misc/database.php';

// Prepare the response array
$response = [
    'success' => false,
    'admins' => [],
    'message' => '',
];

try {
    // Create a database connection
    $conn = new mysqli($db_host, $db_user, $db_password, $db_name);

    // Check connection
    if ($conn->connect_error) {
        throw new Exception("Connection failed: " . $conn->connect_error);
    }

    // Prepare the SQL query to fetch admins (user_type 1 and -1)
    $sql = "SELECT id, fname, mname, lname, suffix, usertype 
            FROM users 
            WHERE usertype IN (1, -1)";

    $result = $conn->query($sql);

    if ($result && $result->num_rows > 0) {
        // Fetch all rows
        while ($row = $result->fetch_assoc()) {
            $response['admins'][] = [
                'id' => $row['id'],
                'fname' => $row['fname'],
                'mname' => $row['mname'],
                'lname' => $row['lname'],
                'suffix' => $row['suffix'],
                'usertype' => $row['usertype'],
            ];
        }
        $response['success'] = true;
    } else {
        $response['message'] = "No admins found.";
    }

    // Close the connection
    $conn->close();

} catch (Exception $e) {
    $response['message'] = "Error: " . $e->getMessage();
}

// Return the response as JSON
header('Content-Type: application/json');
echo json_encode($response);
