<?php
header('Content-Type: application/json');



$recaptchaSecret = '6LdP5S0rAAAAAKfoApcLBEDV5NG4v5IYzfnHsmMb';
$recaptchaResponse = $_POST['g-recaptcha-response'] ?? '';

$verify = file_get_contents("https://www.google.com/recaptcha/api/siteverify?secret={$recaptchaSecret}&response={$recaptchaResponse}");
$responseData = json_decode($verify);

if (!$responseData->success) {
    echo json_encode(['success' => false, 'message' => 'Captcha verification failed']);
    exit;
}


if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

if (!isset($_POST['url'])) {
    echo json_encode(['success' => false, 'message' => 'No URL provided']);
    exit;
}

$inputUrl = trim($_POST['url']);
$parsedUrl = parse_url($inputUrl, PHP_URL_HOST) ?: $inputUrl;
$fullUrl = 'http://' . $parsedUrl;
$hostIP = gethostbyname($parsedUrl);

// WHOIS
$whois = shell_exec("whois $parsedUrl");

// IP Info
$ipJson = file_get_contents("https://ipinfo.io/{$hostIP}/json");
$ipData = json_decode($ipJson, true);

// Get Name Servers
$nsRecords = dns_get_record($parsedUrl, DNS_NS);
$nameServers = [];

if ($nsRecords) {
    foreach ($nsRecords as $record) {
        $nameServers[] = $record['target'];
    }
}

echo json_encode([
    'success' => true,
    'ip' => $hostIP,
    'host' => $ipData['org'] ?? 'Unknown',
    'city' => $ipData['city'] ?? '',
    'region' => $ipData['region'] ?? '',
    'country' => $ipData['country'] ?? '',
    'whois' => $whois ?? '',
    'nameservers' => $nameServers
]);
