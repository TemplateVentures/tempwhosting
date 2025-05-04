<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

if (!isset($_POST['url'])) {
    echo json_encode(['success' => false, 'message' => 'No URL provided']);
    exit;
}

$inputUrl = trim($_POST['url']);
$parsedUrl = parse_url($inputUrl, PHP_URL_HOST);
if (!$parsedUrl) {
    $parsedUrl = preg_replace('#^https?://#', '', $inputUrl); // Strip http/https
}

$hostIP = gethostbyname($parsedUrl);

if (!$hostIP) {
    echo json_encode(['success' => false, 'message' => 'Invalid domain']);
    exit;
}

// WHOIS (optional basic call - may be limited on shared hosting)
$whois = shell_exec("whois $parsedUrl");


// Get Name Servers
$nsLookupOutput = shell_exec("nslookup -type=ns $parsedUrl");
$nameServers = [];
if ($nsLookupOutput && preg_match_all('/nameserver = ([^\s]+)/', $nsLookupOutput, $matches)) {
    $nameServers = $matches[1];
}
$nameServers = [];


// Get Name Servers
$nsRecords = dns_get_record($parsedUrl, DNS_NS);
$nameServers = [];

if ($nsRecords) {
    foreach ($nsRecords as $record) {
        $nameServers[] = $record['target'];
    }
}


// IP Info
$ipJson = file_get_contents("https://ipinfo.io/{$hostIP}/json");
$ipData = json_decode($ipJson, true);

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