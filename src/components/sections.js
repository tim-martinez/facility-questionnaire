export const SECTIONS = [
  {
    id: 'facility-info',
    title: 'Facility Information',
    questions: [
      {
        id: 'facility-name',
        label: 'Facility Name',
        type: 'text',
        required: false,
      },
      {
        id: 'facility-type',
        label: 'Facility Type',
        type: 'select',
        options: ['Tower', 'TRACON', 'ARTCC', 'FSS'],
        required: false,
      },
      {
        id: 'icao-code',
        label: 'ICAO Airport Code',
        type: 'text',
        required: false,
      },
      {
        id: 'location',
        label: 'Location (City, State)',
        type: 'text',
        required: false,
      },
      {
        id: 'elevation',
        label: 'Airport Elevation (ft)',
        type: 'number',
        required: false,
      },
      {
        id: 'operating-hours',
        label: 'Operating Hours',
        type: 'text',
        required: false,
      },
      {
        id: 'contact-info',
        label: 'Contact Information',
        type: 'textarea',
        placeholder: 'Include phone, email, and website',
        required: false,
      },
      {
        id: 'test',
        label: 'Test Field',
        type: 'text',
        placeholder: 'This is a test field',
      },
    ],
  },
  {
    id: 'traffic-volume',
    title: 'Traffic Volume',
    questions: [
      {
        id: 'daily-operations',
        label: 'Average Daily Operations',
        type: 'number',
        required: false,
      },
      {
        id: 'peak-hour-ops',
        label: 'Peak Hour Operations',
        type: 'number',
        required: false,
      },
      {
        id: 'aircraft-mix',
        label: 'Aircraft Mix (%)',
        type: 'group',
        subfields: [
          {
            id: 'commercial',
            label: 'Commercial',
            type: 'number',
            placeholder: '0-100',
          },
          {
            id: 'general-aviation',
            label: 'General Aviation',
            type: 'number',
            placeholder: '0-100',
          },
          {
            id: 'military',
            label: 'Military',
            type: 'number',
            placeholder: '0-100',
          },
          { id: 'cargo', label: 'Cargo', type: 'number', placeholder: '0-100' },
        ],
      },
      {
        id: 'seasonal-variation',
        label: 'Seasonal Traffic Variation (%)',
        type: 'number',
      },
      { id: 'growth-rate', label: 'Annual Growth Rate (%)', type: 'number' },
    ],
  },
  {
    id: 'runway-config',
    title: 'Runway Configuration',
    questions: [
      {
        id: 'num-runways',
        label: 'Number of Runways',
        type: 'number',
        required: false,
      },
      {
        id: 'runway-details',
        label: 'Runway Details',
        type: 'textarea',
        placeholder:
          'List each runway with length, width, and orientation (e.g., 09L/27R: 10,000ft x 150ft)',
        required: false,
      },
      {
        id: 'primary-config',
        label: 'Primary Operating Configuration',
        type: 'select',
        options: [
          'Single Runway',
          'Parallel Runways',
          'Intersecting Runways',
          'Mixed Configuration',
        ],
        required: false,
      },
      {
        id: 'wind-patterns',
        label: 'Prevailing Wind Patterns',
        type: 'textarea',
      },
      {
        id: 'noise-restrictions',
        label: 'Noise Abatement Procedures',
        type: 'textarea',
      },
    ],
  },
  {
    id: 'airspace-structure',
    title: 'Airspace Structure',
    questions: [
      {
        id: 'class-airspace',
        label: 'Airspace Class',
        type: 'select',
        options: ['Class B', 'Class C', 'Class D', 'Class E'],
        required: false,
      },
      {
        id: 'ceiling-height',
        label: 'Controlled Airspace Ceiling (ft)',
        type: 'number',
        required: false,
      },
      {
        id: 'approach-sectors',
        label: 'Number of Approach Sectors',
        type: 'number',
      },
      {
        id: 'departure-sectors',
        label: 'Number of Departure Sectors',
        type: 'number',
      },
      {
        id: 'special-use-airspace',
        label: 'Special Use Airspace (MOAs, Restricted Areas)',
        type: 'textarea',
      },
      {
        id: 'nearby-airports',
        label: 'Nearby Airports (within 50nm)',
        type: 'textarea',
      },
    ],
  },
  {
    id: 'procedures',
    title: 'Operating Procedures',
    questions: [
      {
        id: 'arrival-procedures',
        label: 'Standard Arrival Procedures',
        type: 'textarea',
        required: false,
      },
      {
        id: 'departure-procedures',
        label: 'Standard Departure Procedures',
        type: 'textarea',
        required: false,
      },
      {
        id: 'separation-standards',
        label: 'Separation Standards Used',
        type: 'select',
        options: ['3nm/1000ft', '5nm/1000ft', 'Visual', 'Mixed'],
        required: false,
      },
      {
        id: 'flow-control',
        label: 'Ground Stop/Flow Control Procedures',
        type: 'textarea',
      },
      {
        id: 'weather-minimums',
        label: 'Weather Operating Minimums',
        type: 'textarea',
      },
      {
        id: 'emergency-procedures',
        label: 'Emergency Response Procedures',
        type: 'textarea',
      },
    ],
  },
  {
    id: 'equipment-staffing',
    title: 'Equipment & Staffing',
    questions: [
      {
        id: 'radar-coverage',
        label: 'Radar Coverage',
        type: 'select',
        options: [
          'Primary Only',
          'Secondary Only',
          'Primary + Secondary',
          'ASDE-X',
        ],
        required: false,
      },
      {
        id: 'communication-equipment',
        label: 'Communication Equipment',
        type: 'textarea',
        required: false,
      },
      { id: 'navigation-aids', label: 'Navigation Aids', type: 'textarea' },
      {
        id: 'controller-positions',
        label: 'Number of Controller Positions',
        type: 'number',
        required: false,
      },
      {
        id: 'staffing-levels',
        label: 'Typical Staffing Levels by Shift',
        type: 'textarea',
        required: false,
      },
      { id: 'automation-level', label: 'Automation Systems', type: 'textarea' },
    ],
  },
];
