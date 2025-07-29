<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

if (!$input || !isset($input['formData'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Form data is required']);
    exit;
}

$formData = $input['formData'];
$recipient = $input['recipient'] ?? 'timothy.perry151@gmail.com';

// Format the email body
function formatQuestionnaireData($formData) {
    $sections = [
        [
            'id' => 'facility-info',
            'title' => 'Facility Information',
            'questions' => [
                ['id' => 'facility-name', 'label' => 'Facility Name'],
                ['id' => 'facility-type', 'label' => 'Facility Type'],
                ['id' => 'icao-code', 'label' => 'ICAO Airport Code'],
                ['id' => 'location', 'label' => 'Location (City, State)'],
                ['id' => 'elevation', 'label' => 'Airport Elevation (ft)'],
                ['id' => 'operating-hours', 'label' => 'Operating Hours'],
                ['id' => 'contact-info', 'label' => 'Contact Information'],
                ['id' => 'test', 'label' => 'Test Field']
            ]
        ],
        [
            'id' => 'traffic-volume',
            'title' => 'Traffic Volume',
            'questions' => [
                ['id' => 'daily-operations', 'label' => 'Average Daily Operations'],
                ['id' => 'peak-hour-ops', 'label' => 'Peak Hour Operations'],
                [
                    'id' => 'aircraft-mix',
                    'label' => 'Aircraft Mix (%)',
                    'subfields' => [
                        ['id' => 'commercial', 'label' => 'Commercial'],
                        ['id' => 'general-aviation', 'label' => 'General Aviation'],
                        ['id' => 'military', 'label' => 'Military'],
                        ['id' => 'cargo', 'label' => 'Cargo']
                    ]
                ],
                ['id' => 'seasonal-variation', 'label' => 'Seasonal Traffic Variation (%)'],
                ['id' => 'growth-rate', 'label' => 'Annual Growth Rate (%)']
            ]
        ],
        [
            'id' => 'runway-config',
            'title' => 'Runway Configuration',
            'questions' => [
                ['id' => 'num-runways', 'label' => 'Number of Runways'],
                ['id' => 'runway-details', 'label' => 'Runway Details'],
                ['id' => 'primary-config', 'label' => 'Primary Operating Configuration'],
                ['id' => 'wind-patterns', 'label' => 'Prevailing Wind Patterns'],
                ['id' => 'noise-restrictions', 'label' => 'Noise Abatement Procedures']
            ]
        ],
        [
            'id' => 'airspace-structure',
            'title' => 'Airspace Structure',
            'questions' => [
                ['id' => 'class-airspace', 'label' => 'Airspace Class'],
                ['id' => 'ceiling-height', 'label' => 'Controlled Airspace Ceiling (ft)'],
                ['id' => 'approach-sectors', 'label' => 'Number of Approach Sectors'],
                ['id' => 'departure-sectors', 'label' => 'Number of Departure Sectors'],
                ['id' => 'special-use-airspace', 'label' => 'Special Use Airspace (MOAs, Restricted Areas)'],
                ['id' => 'nearby-airports', 'label' => 'Nearby Airports (within 50nm)']
            ]
        ],
        [
            'id' => 'procedures',
            'title' => 'Operating Procedures',
            'questions' => [
                ['id' => 'arrival-procedures', 'label' => 'Standard Arrival Procedures'],
                ['id' => 'departure-procedures', 'label' => 'Standard Departure Procedures'],
                ['id' => 'separation-standards', 'label' => 'Separation Standards Used'],
                ['id' => 'flow-control', 'label' => 'Ground Stop/Flow Control Procedures'],
                ['id' => 'weather-minimums', 'label' => 'Weather Operating Minimums'],
                ['id' => 'emergency-procedures', 'label' => 'Emergency Response Procedures']
            ]
        ],
        [
            'id' => 'equipment-staffing',
            'title' => 'Equipment & Staffing',
            'questions' => [
                ['id' => 'radar-coverage', 'label' => 'Radar Coverage'],
                ['id' => 'communication-equipment', 'label' => 'Communication Equipment'],
                ['id' => 'navigation-aids', 'label' => 'Navigation Aids'],
                ['id' => 'controller-positions', 'label' => 'Number of Controller Positions'],
                ['id' => 'staffing-levels', 'label' => 'Typical Staffing Levels by Shift'],
                ['id' => 'automation-level', 'label' => 'Automation Systems']
            ]
        ]
    ];

    $emailBody = "AIR TRAFFIC FACILITY QUESTIONNAIRE\n";
    $emailBody .= "=====================================\n\n";

    foreach ($sections as $section) {
        $sectionData = $formData[$section['id']] ?? [];
        $emailBody .= strtoupper($section['title']) . "\n";
        $emailBody .= str_repeat('=', strlen($section['title'])) . "\n";

        foreach ($section['questions'] as $question) {
            if (isset($question['subfields'])) {
                $emailBody .= "\n" . $question['label'] . ":\n";
                foreach ($question['subfields'] as $subfield) {
                    $value = $sectionData[$question['id']][$subfield['id']] ?? 'Not provided';
                    $emailBody .= "  " . $subfield['label'] . ": " . $value . "\n";
                }
            } else {
                $value = $sectionData[$question['id']] ?? 'Not provided';
                $emailBody .= $question['label'] . ": " . $value . "\n";
            }
        }
        $emailBody .= "\n";
    }

    return $emailBody;
}

try {
    $facilityName = $formData['facility-info']['facility-name'] ?? 'Unknown Facility';
    $subject = "Air Traffic Facility Questionnaire - " . $facilityName;
    $emailBody = formatQuestionnaireData($formData);

    // Email headers
    $headers = [
        'From: noreply@yourserver.com',
        'Reply-To: noreply@yourserver.com',
        'Content-Type: text/plain; charset=UTF-8'
    ];

    // Send email
    $success = mail($recipient, $subject, $emailBody, implode("\r\n", $headers));

    if ($success) {
        echo json_encode(['success' => true, 'message' => 'Questionnaire sent successfully!']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to send email']);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Server error: ' . $e->getMessage()]);
}
?>