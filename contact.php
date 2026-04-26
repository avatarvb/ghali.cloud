<?php
header('Content-Type: application/json');

require 'vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$envFile = __DIR__ . '/.env';
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

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = isset($_POST['name']) ? trim(htmlspecialchars($_POST['name'])) : '';
    $email = isset($_POST['email']) ? trim(filter_var($_POST['email'], FILTER_SANITIZE_EMAIL)) : '';
    $company = isset($_POST['company']) ? trim(htmlspecialchars($_POST['company'])) : '';
    $phone = isset($_POST['phone']) ? trim(htmlspecialchars($_POST['phone'])) : '';
    $service = isset($_POST['service']) ? $_POST['service'] : [];
    $budget = isset($_POST['budget']) ? trim(htmlspecialchars($_POST['budget'])) : '';
    $message = isset($_POST['message']) ? trim(htmlspecialchars($_POST['message'])) : '';

    $errors = [];

    if (empty($name)) {
        $errors[] = 'Le nom est requis';
    }

    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = 'Un email valide est requis';
    }

    if (empty($message)) {
        $errors[] = 'Le message est requis';
    }

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
    $budget_text = isset($budget_labels[$budget]) ? $budget_labels[$budget] : $budget;

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
