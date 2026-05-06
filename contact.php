<?php
header('Content-Type: application/json');

require 'vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

function loadEnv($envFile) {
    if (!file_exists($envFile)) {
        return;
    }
    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        $line = trim($line);
        if ($line === '' || strpos($line, '#') === 0) {
            continue;
        }
        $pos = strpos($line, '=');
        if ($pos === false) {
            continue;
        }
        $key = trim(substr($line, 0, $pos));
        $value = trim(substr($line, $pos + 1));
        if (strlen($value) >= 2 && $value[0] === '"' && $value[strlen($value) - 1] === '"') {
            $value = substr($value, 1, -1);
        }
        if (strlen($value) >= 2 && $value[0] === "'" && $value[strlen($value) - 1] === "'") {
            $value = substr($value, 1, -1);
        }
        $value = str_replace(['\\n', '\\r', '\\t', '\\"', "\\'"], ["\n", "\r", "\t", '"', "'"], $value);
        if (!empty($key) && !empty($value)) {
            $_ENV[$key] = $value;
        }
    }
}

loadEnv(__DIR__ . '/.env');

function rateLimitCheck($identifier, $maxRequests = 5, $windowSeconds = 3600) {
    $dir = sys_get_temp_dir() . '/ghali_rate_limit';
    if (!is_dir($dir)) {
        @mkdir($dir, 0755, true);
    }
    $file = $dir . '/' . md5($identifier) . '.json';
    $now = time();
    $timestamps = [];
    if (file_exists($file)) {
        $data = json_decode(file_get_contents($file), true);
        if (is_array($data)) {
            $timestamps = array_filter($data, function($ts) use ($now, $windowSeconds) {
                return ($now - $ts) < $windowSeconds;
            });
        }
    }
    if (count($timestamps) >= $maxRequests) {
        $oldest = min($timestamps);
        $retryAfter = $windowSeconds - ($now - $oldest);
        return [
            'limited' => true,
            'retryAfter' => $retryAfter
        ];
    }
    $timestamps[] = $now;
    file_put_contents($file, json_encode($timestamps), LOCK_EX);
    return ['limited' => false];
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $rateCheck = rateLimitCheck($_SERVER['REMOTE_ADDR'] ?? 'unknown');
    if ($rateCheck['limited']) {
        http_response_code(429);
        echo json_encode([
            'success' => false,
            'message' => 'Too many requests. Please try again in ' . ceil($rateCheck['retryAfter'] / 60) . ' minutes.'
        ]);
        exit;
    }

    $name = isset($_POST['name']) ? trim($_POST['name']) : '';
    $email = isset($_POST['email']) ? trim($_POST['email']) : '';
    $company = isset($_POST['company']) ? trim($_POST['company']) : '';
    $phone = isset($_POST['phone']) ? trim($_POST['phone']) : '';
    $service = isset($_POST['service']) ? $_POST['service'] : [];
    $budget = isset($_POST['budget']) ? $_POST['budget'] : [];
    $message = isset($_POST['message']) ? trim($_POST['message']) : '';

    $errors = [];

    if (empty($name) || strlen($name) < 2) {
        $errors[] = 'Le nom est requis';
    } elseif (strlen($name) > 100) {
        $errors[] = 'Le nom est trop long';
    }

    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = 'Un email valide est requis';
    } elseif (strlen($email) > 254) {
        $errors[] = "L'email est trop long";
    }

    if (empty($message) || strlen($message) < 10) {
        $errors[] = 'Le message est requis (minimum 10 caracteres)';
    } elseif (strlen($message) > 5000) {
        $errors[] = 'Le message est trop long (maximum 5000 caracteres)';
    }

    if (!empty($company) && strlen($company) > 150) {
        $errors[] = "Le nom de l'entreprise est trop long";
    }

    if (!empty($phone) && !preg_match('/^[\+]?[\d\s\-\(\)]{7,20}$/', $phone)) {
        $errors[] = 'Numero de telephone invalide';
    }

    $name = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
    $email = htmlspecialchars($email, ENT_QUOTES, 'UTF-8');
    $company = htmlspecialchars($company, ENT_QUOTES, 'UTF-8');
    $phone = htmlspecialchars($phone, ENT_QUOTES, 'UTF-8');
    $message = htmlspecialchars($message, ENT_QUOTES, 'UTF-8');

    if (!empty($errors)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => implode(', ', $errors)
        ]);
        exit;
    }

    $services_text = is_array($service) ? implode(', ', $service) : $service;

    $budget_labels = [
        'small' => 'Moins de 10 000 MAD',
        'medium' => '10 000 MAD - 50 000 MAD',
        'large' => '50 000 MAD - 100 000 MAD',
        'enterprise' => 'Plus de 100 000 MAD'
    ];
    $budget_text = '';
    if (is_array($budget)) {
        $budget_labels_arr = [];
        foreach ($budget as $b) {
            $b = trim(htmlspecialchars($b));
            if (isset($budget_labels[$b])) {
                $budget_labels_arr[] = $budget_labels[$b];
            }
        }
        $budget_text = implode(', ', $budget_labels_arr);
    }

    $email_content = "
INFORMATIONS DU CONTACT
----------------------
Nom: {$name}
Email: {$email}
Entreprise: " . ($company ?: 'Non renseigne') . "
Telephone: " . ($phone ?: 'Non renseigne') . "

DETAILS DU PROJET
-----------------
Services souhaites: {$services_text}
Budget maximum: {$budget_text}

MESSAGE:
--------
{$message}
";

    $mail = new PHPMailer(true);

    try {
        $mail->isSMTP();
        $mail->Host = $_ENV['SMTP_HOST'] ?? 'smtp.hostinger.com';
        $mail->SMTPAuth = true;
        $mail->Username = $_ENV['SMTP_USERNAME'] ?? '';
        $mail->Password = $_ENV['SMTP_PASSWORD'] ?? '';
        
        $secure = strtolower($_ENV['SMTP_SECURE'] ?? 'ssl');
        if ($secure === 'ssl') {
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        } else {
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        }
        
        $mail->Port = (int)($_ENV['SMTP_PORT'] ?? 465);
        $mail->CharSet = 'UTF-8';
        $mail->SMTPDebug = 0;

        $mail->setFrom(
            $_ENV['SMTP_FROM_EMAIL'] ?? 'contact@ghali.cloud',
            $_ENV['SMTP_FROM_NAME'] ?? 'ghali.cloud'
        );
        $mail->addAddress($_ENV['MAIL_TO'] ?? 'contact@ghali.cloud');
        $mail->addReplyTo($email, $name);

        $mail->Subject = 'Nouvelle demande de projet - ' . $name;
        $mail->Body = $email_content;
        $mail->isHTML(false);

        $mail->send();
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Votre demande a ete envoyee avec succes. Nous vous contacterons dans les 24 heures.'
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => "Erreur: {$mail->ErrorInfo}"
        ]);
    }
} else {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Methode non autorisee'
    ]);
}
