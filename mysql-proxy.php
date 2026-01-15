<?php
/**
 * Proxy MySQL pour Project Handi
 * Permet au backend Render d'exécuter des requêtes SQL via HTTP
 * À déployer sur handiman.univ-paris8.fr/~imed/api/mysql-proxy.php
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Vérification d'un token secret pour sécuriser l'accès
$headers = getallheaders();
$authToken = $headers['Authorization'] ?? '';

if ($authToken !== 'Bearer ProjectHandi2026SecureSecret!Paris8') {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

// Récupérer la requête SQL
$input = json_decode(file_get_contents('php://input'), true);
$query = $input['query'] ?? '';

if (empty($query)) {
    http_response_code(400);
    echo json_encode(['error' => 'Query required']);
    exit;
}

// Connexion MySQL
$host = 'localhost';
$dbname = 'p27_imed';
$username = 'imed';
$password = 'kotukvodrovbew2';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Exécuter la requête
    $stmt = $pdo->prepare($query);
    $params = $input['params'] ?? [];
    $stmt->execute($params);
    
    // Déterminer le type de requête
    $queryType = strtoupper(substr(trim($query), 0, 6));
    
    if (in_array($queryType, ['SELECT', 'SHOW', 'DESCRI'])) {
        // Requête SELECT
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode([
            'success' => true,
            'data' => $results,
            'rowCount' => count($results)
        ]);
    } else {
        // INSERT, UPDATE, DELETE
        echo json_encode([
            'success' => true,
            'affectedRows' => $stmt->rowCount(),
            'lastInsertId' => $pdo->lastInsertId()
        ]);
    }
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Database error',
        'message' => $e->getMessage()
    ]);
}
?>
