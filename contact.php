<?php
header('Content-Type: application/json');

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

    $to = 'contact@ghali.cloud';
    $subject = 'Nouvelle demande de projet - ' . $name;

    $services_text = is_array($service) ? implode(', ', $service) : $service;

    $budget_labels = [
        'small' => 'Moins de 10 000 MAD',
        'medium' => '10 000 MAD - 50 000 MAD',
        'large' => '50 000 MAD - 100 000 MAD',
        'enterprise' => 'Plus de 100 000 MAD'
    ];
    $budget_text = isset($budget_labels[$budget]) ? $budget_labels[$budget] : $budget;

    $email_content = "
===========================================
NOUVELLE DEMANDE DE PROJET - ghali.cloud
===========================================

INFORMATIONS DU CONTACT
----------------------
Nom: {$name}
Email: {$email}
Entreprise: " . ($company ?: 'Non renseigné') . "
Téléphone: " . ($phone ?: 'Non renseigné') . "

DÉTAILS DU PROJET
-----------------
Services souhaités: {$services_text}
Budget maximum: {$budget_text}

MESSAGE:
--------
{$message}

===========================================
Envoyé depuis le formulaire ghali.cloud
Date: " . date('d/m/Y H:i:s') . "
===========================================
";

    $headers = [
        'From' => 'noreply@ghali.cloud',
        'Reply-To' => $email,
        'X-Mailer' => 'PHP/' . phpversion(),
        'Content-Type' => 'text/plain; charset=UTF-8'
    ];

    $headers_string = implode("\r\n", $headers);

    $mail_sent = mail($to, $subject, $email_content, $headers_string);

    if ($mail_sent) {
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Votre demande a été envoyée avec succès. Nous vous contacterons dans les 24 heures.'
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Une erreur est survenue lors de l\'envoi. Veuillez réessayer.'
        ]);
    }
} else {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Méthode non autorisée'
    ]);
}
