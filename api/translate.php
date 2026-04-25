<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require __DIR__ . '/../vendor/autoload.php';

$envFile = __DIR__ . '/../.env';
if (file_exists($envFile)) {
    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue;
        if (strpos($line, '=') !== false) {
            list($key, $value) = explode('=', $line, 2);
            $key = trim($key);
            $value = trim($value);
            if (!empty($key) && !empty($value)) {
                $_ENV[$key] = $value;
            }
        }
    }
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

if (json_last_error() !== JSON_ERROR_NONE) {
    $input = $_POST;
}

$text = $input['text'] ?? '';
$targetLang = $input['target'] ?? 'fr';
$sourceLang = $input['source'] ?? 'fr';

if (empty($text)) {
    http_response_code(400);
    echo json_encode(['error' => 'Text is required']);
    exit;
}

$apiKey = $_ENV['GOOGLE_TRANSLATE_API_KEY'] ?? '';

if (empty($apiKey)) {
    http_response_code(500);
    echo json_encode(['error' => 'Translation API key not configured']);
    exit;
}

$url = 'https://translation.googleapis.com/language/translate/v2';
$url .= '?key=' . urlencode($apiKey);
$url .= '&q=' . urlencode($text);
$url .= '&target=' . urlencode($targetLang);
if (!empty($sourceLang) && $sourceLang !== 'auto') {
    $url .= '&source=' . urlencode($sourceLang);
}
$url .= '&format=text';

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_TIMEOUT, 30);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

if ($curlError) {
    http_response_code(500);
    echo json_encode(['error' => 'CURL error: ' . $curlError]);
    exit;
}

if ($httpCode !== 200) {
    http_response_code($httpCode);
    echo json_encode(['error' => 'API error: ' . $response]);
    exit;
}

$result = json_decode($response, true);

if (isset($result['error'])) {
    http_response_code(500);
    echo json_encode(['error' => $result['error']['message']]);
    exit;
}

if (isset($result['data']['translations'][0]['translatedText'])) {
    echo json_encode([
        'success' => true,
        'translatedText' => $result['data']['translations'][0]['translatedText'],
        'detectedSourceLang' => $result['data']['translations'][0]['detectedSourceLanguage'] ?? $sourceLang
    ]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Translation failed']);
}
