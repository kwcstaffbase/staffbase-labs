export type Category = 'Widget' | 'Plugin' | 'Integration';
export type Tier = 'Supported' | 'Experimental';

export interface ConfigOption {
  label: string;
  description: string;
  type: 'text' | 'toggle' | 'select' | 'upload';
  required?: boolean;
  example?: string;
}

export interface UseCase {
  title: string;
  description: string;
  icon: string;
}

export interface Prerequisite {
  title: string;
  description: string;
}

export interface Screenshot {
  label: string;
  alt: string;
}

export interface Solution {
  id: string;
  title: string;
  short_description: string;
  category: Category;
  tier: Tier;
  overview: string[];
  use_cases: UseCase[];
  prerequisites: Prerequisite[];
  config_options: ConfigOption[];
  screenshots: Screenshot[];
  has_live_demo: boolean;
  live_demo_url?: string;
  github_url?: string;
  owner: 'CC' | 'SE';
  support_contact: string;
  icon: string;
}

export const SOLUTIONS: Solution[] = [
  {
    id: 'celebration-widget',
    title: 'Celebration Widget',
    short_description: 'Display and celebrate users based on birthdays or work anniversaries from profile fields.',
    category: 'Widget',
    tier: 'Supported',
    icon: 'party-popper',
    owner: 'CC',
    support_contact: 'custombuilds@staffbase.com',
    has_live_demo: true,
    live_demo_url: 'https://cckelvin.staffbase.com/',
    overview: [
      'The Celebration Widget provides a dynamic, automated way to foster inclusion and recognition within your organization. By leveraging existing user profile data, the widget calculates upcoming milestones and presents them in a visually engaging format on any Staffbase page.',
      'Whether it\'s a first day at the company or a 20-year milestone, ensure no achievement goes unnoticed. The widget supports birthdays, work anniversaries, and custom date-based celebrations, with full control over which users appear and how far into the past or future the widget looks.',
      'Administrators can configure the widget to split celebrations by year, highlight special milestone years (like 5, 10, or 15 years of service), and even allow users to opt out of being displayed if they prefer privacy.',
    ],
    use_cases: [
      { title: 'Birthday Recognition', description: 'Boost morale by highlighting employee birthdays across the team. Integrates with profile data for automatic, privacy-compliant displays.', icon: 'cake' },
      { title: 'Work Anniversary Milestones', description: 'Celebrate loyalty by surfacing years of service on the exact day. Perfect for fostering long-term employee engagement and retention.', icon: 'award' },
      { title: 'Special Year Celebrations', description: 'Highlight milestone years like 5, 10, or 15 years of service with special formatting and emphasis to make those moments stand out.', icon: 'star' },
    ],
    prerequisites: [
      { title: 'PSP or PSP+ Instance', description: 'Ensure your Staffbase environment is running on a compatible Platform Standard Plus or Platform Standard Plus+ subscription.' },
      { title: 'Date Attribute Mapping', description: 'Birthdays and join dates must be mapped to user profile attributes in your user synchronization source (e.g. Azure AD, SCIM).' },
      { title: 'Widget Access Tokens', description: 'Generate a secure API token from your admin settings to allow the widget to read non-PII employee data.' },
      { title: 'Staffbase CC Coordination', description: 'Contact your Customer Care representative to enable the backend feature toggle for your tenant.' },
    ],
    screenshots: [
      { label: 'Birthday View', alt: 'Celebration widget showing birthday view with employee profiles' },
      { label: 'Anniversary View', alt: 'Celebration widget showing work anniversary milestones' },
      { label: 'Mobile View', alt: 'Celebration widget displayed on a mobile device' },
    ],
    config_options: [
      { label: 'Title', description: 'The heading text displayed above the celebration list on the widget.', type: 'text', example: 'Celebrations' },
      { label: 'Date Format', description: 'Choose between DD.MM (European) or MM.DD (US) date display format.', type: 'select', example: 'DD.MM' },
      { label: 'Celebration Profile Field ID', description: 'The unique identifier of the user profile field that stores the celebration date (e.g. birthday or hire date).', type: 'text', required: true, example: 'birthday_date' },
      { label: 'Split by Year', description: 'When enabled, groups celebrations by year so milestones are visually separated.', type: 'toggle' },
      { label: 'Special Years', description: 'Comma-separated list of milestone years that receive special highlighting (e.g. 5, 10, 15, 20, 25).', type: 'text', example: '5, 10, 15, 20, 25' },
      { label: 'Number of Past Days', description: 'How many days in the past to look for recent celebrations to still display.', type: 'text', example: '7' },
      { label: 'Number of Future Days', description: 'How many days in the future to look ahead for upcoming celebrations.', type: 'text', example: '30' },
      { label: 'Header Color', description: 'Hex color code for the section headers within the widget.', type: 'text', example: '#009FE3' },
      { label: 'Hide Year Header', description: 'When enabled, hides the year grouping headers for a flatter display.', type: 'toggle' },
      { label: 'Profile Field ID for Opt-Out', description: 'The profile field that determines whether a user has opted out of appearing in celebrations.', type: 'text', example: 'celebration_opt_out' },
      { label: 'Include Pending Users', description: 'When enabled, users with a "pending" account status will also appear in celebrations.', type: 'toggle' },
      { label: 'Network Plugin ID', description: 'The plugin ID used to scope the widget to a specific Staffbase network or community.', type: 'text', example: 'plugin-12345' },
    ],
  },
  {
    id: 'clocks-widget',
    title: 'Clocks Widget',
    short_description: 'Display analog and digital clocks for configurable timezones across your global offices.',
    category: 'Widget',
    tier: 'Supported',
    icon: 'clock',
    owner: 'CC',
    support_contact: 'custombuilds@staffbase.com',
    has_live_demo: true,
    live_demo_url: 'https://cckelvin.staffbase.com/',
    overview: [
      'The Clocks Widget provides a clean, configurable way to display the current time across multiple timezones on any Staffbase page. Supporting both analog and digital clock styles, it helps globally distributed teams stay aligned.',
      'Each clock instance can be individually titled, formatted, and styled to match your intranet\'s design language. Whether mounted in a reception lobby display or embedded on a team hub page, the widget adapts to your needs with minimal configuration.',
    ],
    use_cases: [
      { title: 'Global Teams', description: 'Show multiple office timezones on a single hub page so distributed teams always know the local time at every office.', icon: 'globe' },
      { title: 'Reception Displays', description: 'Mount a full-screen browser tab showing office clocks in your lobby or reception area for visiting clients.', icon: 'monitor' },
      { title: 'Office Hub Pages', description: 'Embed timezone clocks on department or location-specific pages so employees can coordinate across regions.', icon: 'building' },
    ],
    prerequisites: [
      { title: 'PSP or PSP+ Instance', description: 'Ensure your Staffbase environment is running on a compatible Platform Standard Plus or Platform Standard Plus+ subscription.' },
      { title: 'Timezone Data Available', description: 'Ensure IANA timezone identifiers are available and correctly configured for each office location you wish to display.' },
      { title: 'Widget Access Tokens', description: 'Generate a secure API token from your admin settings to allow the widget to read non-PII employee data.' },
      { title: 'Staffbase CC Coordination', description: 'Contact your Customer Care representative to enable the backend feature toggle for your tenant.' },
    ],
    screenshots: [
      { label: 'Analog View', alt: 'Clocks widget showing analog clock face display' },
      { label: 'Digital View', alt: 'Clocks widget showing digital time display' },
      { label: 'Multi-Timezone', alt: 'Clocks widget showing multiple timezones side by side' },
    ],
    config_options: [
      { label: 'Timezone', description: 'The IANA timezone identifier (e.g. America/New_York, Europe/Berlin) that determines what time the clock displays.', type: 'text', required: true, example: 'America/New_York' },
      { label: 'Use Analog Clock Style', description: 'When enabled, renders a traditional round clock face with hour, minute, and second hands.', type: 'toggle' },
      { label: 'Use Digital Clock Style', description: 'When enabled, renders a numeric time display. Can be used alongside or instead of the analog style.', type: 'toggle' },
      { label: 'Show Heading', description: 'Controls whether a text label appears above the clock.', type: 'toggle' },
      { label: 'Heading Text', description: 'The label displayed above the clock when Show Heading is enabled.', type: 'text', example: 'New York Office' },
      { label: 'Digital Clock Format', description: 'A format string that controls how the digital time is displayed (e.g. HH:mm:ss for 24-hour, hh:mm A for 12-hour).', type: 'text', example: 'HH:mm:ss' },
    ],
  },
  {
    id: 'countdown-widget',
    title: 'Countdown Widget',
    short_description: 'Countdown timer to a configurable date and time with customizable labels.',
    category: 'Widget',
    tier: 'Supported',
    icon: 'timer',
    owner: 'CC',
    support_contact: 'custombuilds@staffbase.com',
    has_live_demo: true,
    live_demo_url: 'https://cckelvin.staffbase.com/',
    overview: [
      'The Countdown Widget builds anticipation for important company events by displaying a live ticking countdown on any Staffbase page. Configure it with any future date and time, customize the label text for each unit, and set colors to match your brand.',
      'When the countdown expires, a configurable message replaces the timer. Individual time units (days, hours, minutes, seconds) can be hidden to simplify the display for longer countdowns.',
    ],
    use_cases: [
      { title: 'Company Events', description: 'Build excitement for annual company meetings, holiday parties, or town halls by counting down the days on your homepage.', icon: 'calendar' },
      { title: 'Open Enrollment Deadlines', description: 'Remind employees of important HR deadlines like benefits enrollment with a visible, ticking countdown.', icon: 'file-clock' },
      { title: 'Product Launch Countdowns', description: 'Generate buzz for internal product launches or feature releases by adding countdown timers to relevant team pages.', icon: 'rocket' },
    ],
    prerequisites: [
      { title: 'PSP or PSP+ Instance', description: 'Ensure your Staffbase environment is running on a compatible Platform Standard Plus or Platform Standard Plus+ subscription.' },
      { title: 'Target Date Defined', description: 'Identify the event date and time you want to count down to, formatted as YYYY-MM-DD HH:mm.' },
      { title: 'Widget Access Tokens', description: 'Generate a secure API token from your admin settings to allow the widget to read non-PII employee data.' },
      { title: 'Staffbase CC Coordination', description: 'Contact your Customer Care representative to enable the backend feature toggle for your tenant.' },
    ],
    screenshots: [
      { label: 'Full View', alt: 'Countdown widget showing full countdown with days, hours, minutes, and seconds' },
      { label: 'Expired State', alt: 'Countdown widget showing expired state with custom message' },
      { label: 'Custom Colors', alt: 'Countdown widget with custom brand colors applied' },
    ],
    config_options: [
      { label: 'Countdown Date + Time', description: 'The target date and time the widget counts down to, in YYYY-MM-DD HH:mm format.', type: 'text', required: true, example: '2026-12-31 23:59' },
      { label: 'Days Word (singular / plural)', description: 'Customizable labels for the days unit, with separate singular and plural forms for proper grammar.', type: 'text', example: 'Day / Days' },
      { label: 'Hours Word (singular / plural)', description: 'Customizable labels for the hours unit.', type: 'text', example: 'Hour / Hours' },
      { label: 'Minutes Word (singular / plural)', description: 'Customizable labels for the minutes unit.', type: 'text', example: 'Minute / Minutes' },
      { label: 'Seconds Word (singular / plural)', description: 'Customizable labels for the seconds unit.', type: 'text', example: 'Second / Seconds' },
      { label: 'Expired Message', description: 'The text displayed once the countdown reaches zero, replacing the timer.', type: 'text', example: 'The event has started!' },
      { label: 'Text Color', description: 'Hex color code for the countdown numbers and labels.', type: 'text', example: '#FFFFFF' },
      { label: 'Background Color', description: 'Hex color code for the widget background.', type: 'text', example: '#0D1C3D' },
      { label: 'Hide Days / Hours / Minutes / Seconds', description: 'Individual toggles to hide specific time units from the display.', type: 'toggle' },
    ],
  },
  {
    id: 'digital-business-card',
    title: 'Digital Business Card',
    short_description: 'Generate a digital business card with QR code linking to a vCard download.',
    category: 'Plugin',
    tier: 'Supported',
    icon: 'contact',
    owner: 'CC',
    support_contact: 'custombuilds@staffbase.com',
    has_live_demo: true,
    live_demo_url: 'https://cckelvin.staffbase.com/',
    overview: [
      'The Digital Business Card widget creates personalized, shareable digital business cards for employees directly from their Staffbase profile data. Each card can display the user\'s name, title, company, department, location, email, phone, and even social media links.',
      'A QR code is generated that links to a downloadable vCard file, making it easy to share contact information at conferences, meetings, or on frontline worker ID displays.',
      'Administrators have granular control over which fields appear and can toggle visibility for each section.',
    ],
    use_cases: [
      { title: 'Employee Directory Enhancement', description: 'Add digital business cards to employee profile pages so colleagues can quickly save each other\'s contact details.', icon: 'users' },
      { title: 'Conference Networking', description: 'Give employees a shareable QR code for events and conferences that links directly to their professional contact card.', icon: 'handshake' },
      { title: 'Frontline Worker ID Cards', description: 'Display a simplified digital ID card on frontline workers\' mobile devices with essential contact and role information.', icon: 'badge-check' },
    ],
    prerequisites: [
      { title: 'PSP or PSP+ Instance', description: 'Ensure your Staffbase environment is running on a compatible Platform Standard Plus or Platform Standard Plus+ subscription.' },
      { title: 'Profile Field Mapping', description: 'Contact fields (email, phone, title, department) must be mapped to user profile attributes in your sync source.' },
      { title: 'Widget Access Tokens', description: 'Generate a secure API token from your admin settings to allow the widget to read non-PII employee data.' },
      { title: 'Staffbase CC Coordination', description: 'Contact your Customer Care representative to enable the backend feature toggle for your tenant.' },
    ],
    screenshots: [
      { label: 'Desktop View', alt: 'Digital business card displayed on desktop with full contact details' },
      { label: 'QR Code View', alt: 'Digital business card showing QR code for vCard download' },
      { label: 'Mobile View', alt: 'Digital business card displayed on a mobile device' },
    ],
    config_options: [
      { label: 'Staffbase User ID', description: 'The unique identifier of the user whose business card is displayed. Leave empty to show the currently logged-in user.', type: 'text', example: 'user-abc-123' },
      { label: 'Use Default First / Last Name', description: 'When enabled, pulls the name from the user\'s default Staffbase profile rather than a custom field.', type: 'toggle' },
      { label: 'First / Last Name Profile Field ID', description: 'Custom profile field IDs to use for the name when the default toggle is off.', type: 'text', example: 'first_name / last_name' },
      { label: 'Hide Name / Title / Company / Position / Department / Location / Email / Phone', description: 'Individual toggles to hide specific information fields from the card.', type: 'toggle' },
      { label: 'Enable Address Fields', description: 'When enabled, displays the user\'s physical address on the business card.', type: 'toggle' },
      { label: 'Enable Social Field', description: 'When enabled, adds a social media link to the card.', type: 'toggle' },
      { label: 'Social Media URL Profile Field ID', description: 'The profile field that stores the user\'s social media URL.', type: 'text', example: 'linkedin_url' },
      { label: 'Social Media Type', description: 'The type of social media platform (e.g. LinkedIn, Twitter) used for the icon and label.', type: 'select', example: 'LinkedIn' },
      { label: 'Show Avatar / Header', description: 'Toggles for the profile picture and card header banner.', type: 'toggle' },
      { label: 'Show QR Code Behind Button', description: 'When enabled, hides the QR code behind a button click rather than displaying it directly.', type: 'toggle' },
    ],
  },
  {
    id: 'print-button-widget',
    title: 'Print Button Widget',
    short_description: 'Triggers the browser\'s native print dialog for easy document printing.',
    category: 'Widget',
    tier: 'Supported',
    icon: 'printer',
    owner: 'CC',
    support_contact: 'custombuilds@staffbase.com',
    has_live_demo: true,
    live_demo_url: 'https://cckelvin.staffbase.com/',
    overview: [
      'The Print Button Widget adds a simple, configurable print button to any Staffbase page. When clicked, it triggers the browser\'s native print dialog, allowing employees to easily print news articles, policy documents, schedules, or any other page content.',
      'The widget supports customizable button text, optional printer icon display, and the ability to hide the button itself when the page is being printed so it doesn\'t appear on the printed output.',
    ],
    use_cases: [
      { title: 'Printing News Articles', description: 'Allow employees to print important company news and announcements for offline reading or bulletin board posting.', icon: 'newspaper' },
      { title: 'Policy Documents', description: 'Give HR and compliance teams a one-click way to print policy pages for physical distribution or archival.', icon: 'file-text' },
      { title: 'Printable Schedules', description: 'Enable shift workers to print their schedules directly from the intranet for personal reference.', icon: 'calendar-days' },
    ],
    prerequisites: [
      { title: 'PSP or PSP+ Instance', description: 'Ensure your Staffbase environment is running on a compatible Platform Standard Plus or Platform Standard Plus+ subscription.' },
      { title: 'Widget Access Tokens', description: 'Generate a secure API token from your admin settings to allow the widget to read non-PII employee data.' },
      { title: 'Staffbase CC Coordination', description: 'Contact your Customer Care representative to enable the backend feature toggle for your tenant.' },
    ],
    screenshots: [
      { label: 'Default View', alt: 'Print button widget with default styling on a Staffbase page' },
      { label: 'Print Dialog', alt: 'Browser print dialog triggered by the print button widget' },
      { label: 'Custom Styling', alt: 'Print button widget with custom text and icon configuration' },
    ],
    config_options: [
      { label: 'Button Text', description: 'The label displayed on the print button.', type: 'text', example: 'Print this page' },
      { label: 'Hide Button Text', description: 'When enabled, shows only the printer icon without any text label.', type: 'toggle' },
      { label: 'Hide Printer Icon', description: 'When enabled, shows only the text label without the printer icon.', type: 'toggle' },
      { label: 'Hide Button on Print', description: 'When enabled, the print button is hidden from the printed output via CSS print media query.', type: 'toggle' },
    ],
  },
  {
    id: 'scrolling-banner',
    title: 'Scrolling Banner',
    short_description: 'A horizontally scrolling announcement ticker for urgent company-wide messages.',
    category: 'Widget',
    tier: 'Supported',
    icon: 'megaphone',
    owner: 'CC',
    support_contact: 'custombuilds@staffbase.com',
    has_live_demo: true,
    live_demo_url: 'https://cckelvin.staffbase.com/',
    overview: [
      'The Scrolling Banner widget creates a horizontally scrolling marquee-style announcement bar on any Staffbase page. It\'s ideal for urgent messages that need high visibility, like company-wide alerts, breaking news, or IT maintenance windows.',
      'Administrators can configure the announcement title, message text, link URL, and visual styling including colors, animation speed, and border options. The ticker can be paused on hover to give users time to read the full message.',
    ],
    use_cases: [
      { title: 'Urgent Company Announcements', description: 'Push critical alerts like office closures, emergency contacts, or CEO messages across every page with maximum visibility.', icon: 'alert-triangle' },
      { title: 'Breaking News Banners', description: 'Highlight time-sensitive internal news like acquisition announcements, quarterly results, or product milestones.', icon: 'zap' },
      { title: 'IT Maintenance Alerts', description: 'Warn employees about upcoming system maintenance windows, outages, or required software updates.', icon: 'wrench' },
    ],
    prerequisites: [
      { title: 'PSP or PSP+ Instance', description: 'Ensure your Staffbase environment is running on a compatible Platform Standard Plus or Platform Standard Plus+ subscription.' },
      { title: 'Widget Access Tokens', description: 'Generate a secure API token from your admin settings to allow the widget to read non-PII employee data.' },
      { title: 'Staffbase CC Coordination', description: 'Contact your Customer Care representative to enable the backend feature toggle for your tenant.' },
    ],
    screenshots: [
      { label: 'Default View', alt: 'Scrolling Banner default view with standard styling' },
      { label: 'Custom Colors', alt: 'Scrolling Banner with custom color configuration' },
      { label: 'With Link', alt: 'Scrolling Banner with clickable link' },
    ],
    config_options: [
      { label: 'Title', description: 'An optional static label displayed before the scrolling content.', type: 'text', example: 'Important Notice' },
      { label: 'Show Title', description: 'Controls whether the static title label is visible.', type: 'toggle' },
      { label: 'Title Color', description: 'Hex color for the static title text.', type: 'text', example: '#FFFFFF' },
      { label: 'Announcement Title', description: 'Bold text that appears at the start of each scrolling announcement.', type: 'text', required: true, example: 'System Update' },
      { label: 'Announcement Message', description: 'The main body text of the scrolling announcement.', type: 'text', required: true, example: 'Scheduled maintenance this Saturday 10pm-2am' },
      { label: 'Announcement Link URL', description: 'An optional URL that makes the announcement clickable.', type: 'text', example: 'https://example.com/details' },
      { label: 'Announcement Link Title', description: 'The label for the clickable link within the announcement.', type: 'text', example: 'Learn More' },
      { label: 'Announcement Link Color', description: 'Hex color for the link text.', type: 'text', example: '#009FE3' },
      { label: 'Pause Slider on Hover', description: 'When enabled, the scrolling animation pauses when a user hovers over the banner.', type: 'toggle' },
      { label: 'Animation Speed (seconds)', description: 'How many seconds it takes for the announcement to scroll across the full width of the banner.', type: 'text', example: '15' },
      { label: 'Background Color', description: 'Hex color for the banner background.', type: 'text', example: '#0D1C3D' },
      { label: 'Border Color', description: 'Hex color for the optional top and bottom border.', type: 'text', example: '#009FE3' },
      { label: 'Show Border', description: 'Controls whether the banner has visible top and bottom borders.', type: 'toggle' },
      { label: 'Text Color', description: 'Hex color for the announcement body text.', type: 'text', example: '#FFFFFF' },
    ],
  },
  {
    id: 'text-on-image',
    title: 'Text on Image Widget',
    short_description: 'Overlay headline and description text on top of an uploaded image with color overlay.',
    category: 'Widget',
    tier: 'Supported',
    icon: 'image',
    owner: 'CC',
    support_contact: 'custombuilds@staffbase.com',
    has_live_demo: true,
    live_demo_url: 'https://cckelvin.staffbase.com/',
    overview: [
      'The Text on Image Widget allows communicators to create visually striking hero banners by overlaying text content on top of uploaded images. With support for custom headline and description text, adjustable alignment, color overlay with opacity control, and optional icon placement, this widget is perfect for campaign landing pages, department start pages, and any page that needs a bold visual statement.',
      'The overlay ensures text remains readable regardless of the underlying image.',
    ],
    use_cases: [
      { title: 'Hero Banners', description: 'Create eye-catching hero sections at the top of your intranet homepage or campaign pages with branded imagery and messaging.', icon: 'layout-template' },
      { title: 'Campaign Landing Pages', description: 'Build visually compelling landing pages for internal campaigns like wellness programs, charity drives, or cultural initiatives.', icon: 'flag' },
      { title: 'Department Start Pages', description: 'Design distinctive header images for department or location-specific pages that set the tone and identity.', icon: 'building-2' },
    ],
    prerequisites: [
      { title: 'PSP or PSP+ Instance', description: 'Ensure your Staffbase environment is running on a compatible Platform Standard Plus or Platform Standard Plus+ subscription.' },
      { title: 'Widget Access Tokens', description: 'Generate a secure API token from your admin settings to allow the widget to read non-PII employee data.' },
      { title: 'Staffbase CC Coordination', description: 'Contact your Customer Care representative to enable the backend feature toggle for your tenant.' },
    ],
    screenshots: [
      { label: 'Hero View', alt: 'Text on Image widget showing a hero banner with headline overlay' },
      { label: 'With Overlay', alt: 'Text on Image widget with color overlay for readability' },
      { label: 'Mobile View', alt: 'Text on Image widget displayed on a mobile device' },
    ],
    config_options: [
      { label: 'Upload Image', description: 'The background image file that appears behind the text overlay.', type: 'upload', required: true },
      { label: 'Headline', description: 'The main heading text displayed on top of the image.', type: 'text', required: true, example: 'Welcome to Our Team' },
      { label: 'Headline Color', description: 'Hex color for the headline text.', type: 'text', example: '#FFFFFF' },
      { label: 'Description', description: 'Supporting body text displayed below the headline.', type: 'text', example: 'Join us on our journey' },
      { label: 'Description Color', description: 'Hex color for the description text.', type: 'text', example: '#E8EAED' },
      { label: 'Headline / Description Alignment', description: 'Horizontal alignment of headline and description text (Left, Center, Right).', type: 'select', example: 'Center' },
      { label: 'Apply Color Overlay', description: 'When enabled, adds a semi-transparent color layer between the image and text for improved readability.', type: 'toggle' },
      { label: 'Overlay Color', description: 'Hex color for the overlay layer.', type: 'text', example: '#0D1C3D' },
      { label: 'Overlay Opacity', description: 'A value from 0 to 1 controlling the transparency of the color overlay.', type: 'text', example: '0.5' },
      { label: 'Add Icon', description: 'When enabled, displays an icon alongside the text content.', type: 'toggle' },
      { label: 'Upload Icon', description: 'The icon image file to display when Add Icon is enabled.', type: 'upload' },
      { label: 'Icon Size', description: 'The size of the icon in pixels.', type: 'text', example: '48' },
      { label: 'Icon Alignment', description: 'Horizontal alignment of the icon (Left, Center, Right).', type: 'select', example: 'Center' },
    ],
  },
  {
    id: 'qualtrics-insights',
    title: 'Qualtrics Insights Widget',
    short_description: 'Embed a Qualtrics feedback form directly within the Staffbase intranet.',
    category: 'Integration',
    tier: 'Supported',
    icon: 'bar-chart-3',
    owner: 'CC',
    support_contact: 'custombuilds@staffbase.com',
    has_live_demo: true,
    live_demo_url: 'https://cckelvin.staffbase.com/',
    overview: [
      'The Qualtrics Insights Widget provides a seamless bridge between your Staffbase intranet and Qualtrics survey platform. By simply entering your Qualtrics Organization ID, the widget embeds a fully functional feedback form directly into any Staffbase page.',
      'This eliminates the need for employees to navigate away from the intranet to complete surveys, resulting in higher completion rates and better feedback quality. The widget handles authentication, rendering, and submission entirely within the Staffbase experience.',
    ],
    use_cases: [
      { title: 'In-App Employee Surveys', description: 'Embed pulse surveys and engagement questionnaires directly in the employee feed for maximum participation and convenience.', icon: 'clipboard-list' },
      { title: 'Pulse Checks', description: 'Run quick sentiment checks on specific topics by embedding short Qualtrics forms on relevant department or project pages.', icon: 'heart-pulse' },
      { title: 'Feedback Loops', description: 'Create always-available feedback channels on leadership pages or town hall recap pages where employees can share thoughts.', icon: 'message-circle' },
    ],
    prerequisites: [
      { title: 'PSP or PSP+ Instance', description: 'Ensure your Staffbase environment is running on a compatible Platform Standard Plus or Platform Standard Plus+ subscription.' },
      { title: 'Qualtrics Account', description: 'You must have an active Qualtrics organization account with API access enabled and at least one published survey.' },
      { title: 'Widget Access Tokens', description: 'Generate a secure API token from your admin settings to allow the widget to read non-PII employee data.' },
      { title: 'Staffbase CC Coordination', description: 'Contact your Customer Care representative to enable the backend feature toggle for your tenant.' },
    ],
    screenshots: [
      { label: 'Survey View', alt: 'Qualtrics Insights widget showing survey view with embedded form' },
      { label: 'Embedded Form', alt: 'Qualtrics Insights widget showing embedded feedback form' },
      { label: 'Mobile View', alt: 'Qualtrics Insights widget displayed on a mobile device' },
    ],
    config_options: [
      { label: 'Qualtrics Organization ID', description: 'The unique identifier for your Qualtrics organization account, used to authenticate and load the correct survey forms within the widget.', type: 'text', required: true, example: 'org_abc123xyz' },
    ],
  },
  {
    id: 'weather-widget',
    title: 'Weather Widget',
    short_description: 'Display current weather and 7-day forecast for a configured location.',
    category: 'Widget',
    tier: 'Supported',
    icon: 'cloud-sun',
    owner: 'CC',
    support_contact: 'custombuilds@staffbase.com',
    has_live_demo: true,
    live_demo_url: 'https://cckelvin.staffbase.com/',
    overview: [
      'The Weather Widget brings real-time weather data to any Staffbase page, showing current conditions and an optional 7-day forecast for a configured location. Powered by the OpenWeatherMap API, it supports both Celsius and Fahrenheit display, customizable colors, and location-specific configuration.',
      'It\'s particularly valuable for organizations with frontline workers who need to check conditions before shifts, facilities teams managing outdoor spaces, and multi-site organizations wanting to show weather for each office location.',
    ],
    use_cases: [
      { title: 'Frontline Worker Safety', description: 'Help frontline workers check weather conditions before outdoor shifts so they can prepare appropriate gear and safety measures.', icon: 'hard-hat' },
      { title: 'Facilities Management', description: 'Give facilities teams real-time weather data to plan outdoor maintenance, events, and space management decisions.', icon: 'building' },
      { title: 'Multi-Site Organizations', description: 'Show location-specific weather on each office or site page so traveling employees know what to expect at their destination.', icon: 'map-pin' },
    ],
    prerequisites: [
      { title: 'PSP or PSP+ Instance', description: 'Ensure your Staffbase environment is running on a compatible Platform Standard Plus or Platform Standard Plus+ subscription.' },
      { title: 'OpenWeatherMap API Key', description: 'Register for a free or paid OpenWeatherMap API key at openweathermap.org to enable weather data retrieval.' },
      { title: 'Widget Access Tokens', description: 'Generate a secure API token from your admin settings to allow the widget to read non-PII employee data.' },
      { title: 'Staffbase CC Coordination', description: 'Contact your Customer Care representative to enable the backend feature toggle for your tenant.' },
    ],
    screenshots: [
      { label: 'Current View', alt: 'Weather widget showing current conditions with temperature and icon' },
      { label: 'Forecast View', alt: 'Weather widget showing 7-day forecast with daily temperatures' },
      { label: 'Mobile View', alt: 'Weather widget displayed on a mobile device' },
    ],
    config_options: [
      { label: 'OpenWeatherMap API Key', description: 'Your personal API key from OpenWeatherMap, required to fetch weather data. Sign up at openweathermap.org.', type: 'text', required: true, example: 'sk-abc123...' },
      { label: 'Location', description: 'The city, state, and country for weather data retrieval (e.g. "New York, NY, US" or "Berlin, Germany").', type: 'text', required: true, example: 'New York, NY, US' },
      { label: 'Prefer Fahrenheit', description: 'When enabled, temperatures display in Fahrenheit. When disabled, temperatures display in Celsius.', type: 'toggle' },
      { label: 'Show Forecast', description: 'When enabled, displays a 7-day weather forecast below the current conditions.', type: 'toggle' },
      { label: 'Widget Background Color', description: 'Hex color for the widget background.', type: 'text', example: '#FFFFFF' },
      { label: 'Widget Text Color', description: 'Hex color for all text within the widget.', type: 'text', example: '#0D1C3D' },
    ],
  },
  {
    id: 'image-comparison-slider',
    title: 'Image Comparison Slider',
    short_description: 'Side-by-side image comparison with a draggable divider for before/after views.',
    category: 'Widget',
    tier: 'Supported',
    icon: 'columns-2',
    owner: 'CC',
    support_contact: 'custombuilds@staffbase.com',
    has_live_demo: true,
    live_demo_url: 'https://cckelvin.staffbase.com/',
    overview: [
      'The Image Comparison Slider widget displays two images side by side with a draggable divider that lets users reveal one image over the other. It supports both horizontal and vertical slider directions, customizable divider positioning, and optional automatic sliding on mouse hover.',
      'This widget is ideal for showcasing before/after transformations, product design comparisons, or campaign visual reveals. The divider and handle colors are fully customizable to match your brand.',
    ],
    use_cases: [
      { title: 'Before/After Renovations', description: 'Showcase office renovations, facility upgrades, or workspace transformations with compelling visual comparisons.', icon: 'construction' },
      { title: 'Product Design Comparisons', description: 'Compare design iterations, packaging updates, or brand refresh visuals side by side for internal review and feedback.', icon: 'palette' },
      { title: 'Campaign Visual Reveals', description: 'Create engaging reveal moments for marketing campaigns by letting employees slide to discover new brand assets or campaign visuals.', icon: 'sparkles' },
    ],
    prerequisites: [
      { title: 'PSP or PSP+ Instance', description: 'Ensure your Staffbase environment is running on a compatible Platform Standard Plus or Platform Standard Plus+ subscription.' },
      { title: 'Widget Access Tokens', description: 'Generate a secure API token from your admin settings to allow the widget to read non-PII employee data.' },
      { title: 'Staffbase CC Coordination', description: 'Contact your Customer Care representative to enable the backend feature toggle for your tenant.' },
    ],
    screenshots: [
      { label: 'Horizontal View', alt: 'Image Comparison Slider showing horizontal sliding mode' },
      { label: 'Vertical View', alt: 'Image Comparison Slider showing vertical sliding mode' },
      { label: 'Mobile View', alt: 'Image Comparison Slider displayed on a mobile device' },
    ],
    config_options: [
      { label: 'Upload Image 1', description: 'The first image (typically the "before" state) displayed on the left or top side of the slider.', type: 'upload', required: true },
      { label: 'Upload Image 2', description: 'The second image (typically the "after" state) displayed on the right or bottom side of the slider.', type: 'upload', required: true },
      { label: 'Slider Direction', description: 'Controls whether the divider slides horizontally (left/right) or vertically (top/bottom).', type: 'select', example: 'Horizontal' },
      { label: 'Divider Position (0–100)', description: 'The initial position of the divider as a percentage from 0 to 100, where 50 is the center.', type: 'text', example: '50' },
      { label: 'Automatic Slide on Mouse Hover', description: 'When enabled, the divider follows the mouse cursor position without requiring a click and drag.', type: 'toggle' },
      { label: 'Divider Color', description: 'Hex color for the divider line between the two images.', type: 'text', example: '#FFFFFF' },
      { label: 'Handle Color', description: 'Hex color for the draggable handle on the divider.', type: 'text', example: '#009FE3' },
    ],
  },
  {
    id: 'new-starter-widget',
    title: 'New Starter Widget',
    short_description: 'Display recent new hires within a configurable date window on your homepage.',
    category: 'Widget',
    tier: 'Supported',
    icon: 'user-plus',
    owner: 'CC',
    support_contact: 'custombuilds@staffbase.com',
    has_live_demo: true,
    live_demo_url: 'https://cckelvin.staffbase.com/',
    overview: [
      'The New Starter Widget automatically surfaces recently joined employees on any Staffbase page, making it easy for teams to welcome and connect with new colleagues. It reads from user profile start date fields and displays new hires within a configurable time window.',
      'Like the Celebration Widget, it supports year-based grouping, special year highlighting, opt-out functionality, and customizable messaging for loading and empty states. It\'s the perfect addition to home pages, team pages, and HR dashboard pages.',
    ],
    use_cases: [
      { title: 'Homepage Welcome', description: 'Feature new joiners prominently on the company homepage so everyone across the organization can say hello and welcome them.', icon: 'home' },
      { title: 'Team Onboarding Visibility', description: 'Add the widget to team or department pages so managers and colleagues can see who has recently joined their group.', icon: 'users' },
      { title: 'HR Dashboard Pages', description: 'Give HR teams a quick overview of recent hires across the organization, filterable by date range and department.', icon: 'layout-dashboard' },
    ],
    prerequisites: [
      { title: 'PSP or PSP+ Instance', description: 'Ensure your Staffbase environment is running on a compatible Platform Standard Plus or Platform Standard Plus+ subscription.' },
      { title: 'Date Attribute Mapping', description: 'Birthdays and join dates must be mapped to user profile attributes in your user synchronization source (e.g. Azure AD, SCIM).' },
      { title: 'Widget Access Tokens', description: 'Generate a secure API token from your admin settings to allow the widget to read non-PII employee data.' },
      { title: 'Staffbase CC Coordination', description: 'Contact your Customer Care representative to enable the backend feature toggle for your tenant.' },
    ],
    screenshots: [
      { label: 'List View', alt: 'New Starter Widget showing list view of recent hires' },
      { label: 'Card View', alt: 'New Starter Widget showing card view of recent hires' },
      { label: 'Mobile View', alt: 'New Starter Widget displayed on a mobile device' },
    ],
    config_options: [
      { label: 'Title', description: 'The heading text displayed above the new starter list.', type: 'text', example: 'Welcome New Starters' },
      { label: 'Start Date Profile Field ID', description: 'The user profile field that stores the employee\'s start date.', type: 'text', required: true, example: 'start_date' },
      { label: 'Date Format', description: 'Choose between DD.MM (European) or MM.DD (US) date display format.', type: 'select', example: 'DD.MM' },
      { label: 'Show Anniversary Date', description: 'When enabled, shows the actual start date next to each new starter\'s name.', type: 'toggle' },
      { label: 'Loading Message', description: 'Text displayed while the widget fetches user data.', type: 'text', example: 'Loading new starters...' },
      { label: 'No Users Message', description: 'Text displayed when no new starters fall within the configured date range.', type: 'text', example: 'No new starters in this period' },
      { label: 'Number of Visible Past Days', description: 'How many days in the past to look for recently started employees.', type: 'text', example: '7' },
      { label: 'Number of Visible Future Days', description: 'How many days in the future to show upcoming starters.', type: 'text', example: '30' },
      { label: 'Header Color', description: 'Hex color for the section headers within the widget.', type: 'text', example: '#009FE3' },
      { label: 'Special Years', description: 'Comma-separated list of milestone years that receive special formatting.', type: 'text', example: '1, 5, 10' },
      { label: 'Split by Year', description: 'When enabled, groups new starters by their start year.', type: 'toggle' },
      { label: 'Profile Field ID for Opt-Out', description: 'The profile field that determines whether a user has opted out of being shown.', type: 'text', example: 'new_starter_opt_out' },
      { label: 'Include Pending Users', description: 'When enabled, users with pending status will also appear.', type: 'toggle' },
      { label: 'Network Plugin ID', description: 'Scopes the widget to a specific Staffbase network.', type: 'text', example: 'plugin-12345' },
    ],
  },
  {
    id: 'analytics-email-open-viewer',
    title: 'Analytics Email Open Viewer',
    short_description: 'Display recently sent Staffbase emails as a widget for tracking engagement.',
    category: 'Integration',
    tier: 'Supported',
    icon: 'mail-open',
    owner: 'CC',
    support_contact: 'custombuilds@staffbase.com',
    has_live_demo: true,
    live_demo_url: 'https://cckelvin.staffbase.com/',
    overview: [
      'The Analytics Email Open Viewer widget surfaces Staffbase email campaign data directly on any intranet page. By connecting to your Staffbase domain, it displays recently sent emails along with key engagement metrics. Internal communications teams can use it to create editorial dashboards, track email performance at a glance, and share communication metrics on leadership pages.',
      'The widget provides a real-time view of email engagement without requiring users to navigate to the Staffbase analytics backend.',
    ],
    use_cases: [
      { title: 'Internal Comms Tracking', description: 'Give communications teams a quick dashboard view of recent email campaign performance and open rates directly on their team page.', icon: 'bar-chart-2' },
      { title: 'Editorial Dashboards', description: 'Build dedicated editorial pages that show all recent internal newsletter sends and their engagement metrics in one place.', icon: 'layout-dashboard' },
      { title: 'Leadership Metrics', description: 'Surface communication engagement data on executive and leadership pages to demonstrate the reach and impact of internal messaging.', icon: 'presentation' },
    ],
    prerequisites: [
      { title: 'PSP or PSP+ Instance', description: 'Ensure your Staffbase environment is running on a compatible Platform Standard Plus or Platform Standard Plus+ subscription.' },
      { title: 'Staffbase Email Module', description: 'Your Staffbase instance must have the Email module enabled with at least one sent email campaign for the widget to display data.' },
      { title: 'Widget Access Tokens', description: 'Generate a secure API token from your admin settings to allow the widget to read non-PII employee data.' },
      { title: 'Staffbase CC Coordination', description: 'Contact your Customer Care representative to enable the backend feature toggle for your tenant.' },
    ],
    screenshots: [
      { label: 'Email Viewer Dashboard', alt: 'Analytics Email Open Viewer showing email campaign dashboard' },
      { label: 'Email Viewer Metrics', alt: 'Analytics Email Open Viewer showing engagement metrics' },
      { label: 'Mobile View', alt: 'Analytics Email Open Viewer displayed on a mobile device' },
    ],
    config_options: [
      { label: 'Staffbase Domain', description: 'Your organization\'s Staffbase domain (e.g. yourcompany.staffbase.com) used to connect to the email analytics API and retrieve send data.', type: 'text', required: true, example: 'yourcompany.staffbase.com' },
    ],
  },
  {
    id: 'company-stock-widget',
    title: 'Company Stock Widget',
    short_description: 'Display your organization\'s live stock price with a sparkline chart.',
    category: 'Widget',
    tier: 'Supported',
    icon: 'trending-up',
    owner: 'CC',
    support_contact: 'custombuilds@staffbase.com',
    has_live_demo: true,
    live_demo_url: 'https://cckelvin.staffbase.com/',
    overview: [
      'The Company Stock Widget displays your organization\'s current stock price along with a sparkline chart showing recent price movement. Powered by the Twelve Data API, it refreshes at a configurable interval to keep the display current throughout the trading day.',
      'The widget supports customizable background and text colors to match your intranet design, and works with any publicly traded stock ticker symbol. It\'s ideal for investor relations pages, company performance dashboards, and executive intranet sections.',
    ],
    use_cases: [
      { title: 'Investor Relations Pages', description: 'Display the company\'s current stock price and trend on investor-focused intranet pages to keep employees informed about market performance.', icon: 'landmark' },
      { title: 'Company Performance Dashboards', description: 'Add live stock data to performance dashboards alongside other business metrics for a comprehensive view of company health.', icon: 'gauge' },
      { title: 'Executive Intranets', description: 'Surface real-time stock information on leadership and executive pages as part of a broader business intelligence display.', icon: 'briefcase' },
    ],
    prerequisites: [
      { title: 'PSP or PSP+ Instance', description: 'Ensure your Staffbase environment is running on a compatible Platform Standard Plus or Platform Standard Plus+ subscription.' },
      { title: 'Twelve Data API Key', description: 'Register for a Twelve Data API account at twelvedata.com and generate an API key to enable stock price data retrieval.' },
      { title: 'Widget Access Tokens', description: 'Generate a secure API token from your admin settings to allow the widget to read non-PII employee data.' },
      { title: 'Staffbase CC Coordination', description: 'Contact your Customer Care representative to enable the backend feature toggle for your tenant.' },
    ],
    screenshots: [
      { label: 'Stock Widget View', alt: 'Company Stock Widget showing live stock price' },
      { label: 'Sparkline Chart', alt: 'Company Stock Widget showing sparkline price chart' },
      { label: 'Mobile View', alt: 'Company Stock Widget displayed on a mobile device' },
    ],
    config_options: [
      { label: 'Stock Ticker Symbol', description: 'The stock exchange ticker symbol for your company (e.g. AAPL, MSFT, GOOG).', type: 'text', required: true, example: 'AAPL' },
      { label: 'API Key (Twelve Data)', description: 'Your API key from Twelve Data (twelvedata.com), required to fetch real-time stock price data.', type: 'text', required: true, example: 'td-abc123...' },
      { label: 'Widget Background Color', description: 'Hex color for the widget background.', type: 'text', example: '#FFFFFF' },
      { label: 'Widget Text Color', description: 'Hex color for all text and the sparkline chart within the widget.', type: 'text', example: '#0D1C3D' },
      { label: 'Refresh Interval', description: 'How often (in seconds) the widget fetches updated stock price data.', type: 'text', example: '60' },
    ],
  },

  // ─── Experimental ────────────────────────────────────────────────────────────

  {
    id: 'dom-embedder',
    title: 'DOM Embedder',
    short_description: 'Dynamically embed external DOM elements or iFrames into Staffbase pages using CSS selector targeting.',
    category: 'Plugin',
    tier: 'Experimental',
    icon: 'code',
    owner: 'SE',
    support_contact: 'custombuilds@staffbase.com',
    has_live_demo: true,
    live_demo_url: 'https://cckelvin.staffbase.com/',
    github_url: '#',
    overview: [
      'DOM Embedder is a community-built utility that lets you inject content from external websites directly into your Staffbase pages. Using configurable CSS selectors, it targets specific elements on third-party sites and re-renders them within your intranet layout.',
      'This is particularly useful for embedding self-service panels from tools like Workday or ServiceNow, injecting external HTML widgets into specific page zones, or rapid prototyping of integrations before committing to a full custom plugin build.',
      'The tool handles cross-origin considerations and provides fallback options for when target elements are unavailable.',
    ],
    use_cases: [
      { title: 'Embedding Third-Party Tools', description: 'Embed Workday self-service panels, ServiceNow forms, or other enterprise tool interfaces directly into Staffbase pages without a full integration.', icon: 'puzzle' },
      { title: 'Injecting External Widgets', description: 'Place external HTML widgets into specific zones on your Staffbase pages using CSS selector targeting for precise placement.', icon: 'layout' },
      { title: 'Rapid Integration Prototyping', description: 'Quickly test how external content looks and behaves within Staffbase before investing in a full custom plugin build.', icon: 'flask-conical' },
    ],
    prerequisites: [
      { title: 'Fork the Repository', description: 'Fork the DOM Embedder repository on GitHub to your own account so you can customize and deploy it independently.' },
      { title: 'Review the README', description: 'Read through the repository README for detailed setup instructions, configuration options, and known limitations.' },
      { title: 'Configure for Your Environment', description: 'Update the configuration files with your Staffbase instance details, target selectors, and any custom styling overrides.' },
      { title: 'Deploy', description: 'Build and deploy the bundle to your hosting environment following the deployment guide in the repository.' },
      { title: 'Reference Bundle URL in Staffbase Studio', description: 'Add the deployed bundle URL as a custom widget reference in Staffbase Studio to start using it on your pages.' },
    ],
    screenshots: [
      { label: 'Dashboard', alt: 'DOM Embedder Dashboard view' },
      { label: 'Configuration', alt: 'DOM Embedder Configuration view' },
      { label: 'Result', alt: 'DOM Embedder Result view' },
    ],
    config_options: [],
  },
  {
    id: 'config-lang-js',
    title: 'Config Lang JS',
    short_description: 'A lightweight declarative configuration language layer for Staffbase custom widgets.',
    category: 'Plugin',
    tier: 'Experimental',
    icon: 'settings',
    owner: 'SE',
    support_contact: 'custombuilds@staffbase.com',
    has_live_demo: true,
    live_demo_url: 'https://cckelvin.staffbase.com/',
    github_url: '#',
    overview: [
      'Config Lang JS provides a declarative configuration layer that sits between your Staffbase widget code and its runtime behavior. Instead of requiring code changes to adjust widget settings, it allows content editors and non-technical administrators to control widget logic through a structured, JSON-like syntax.',
      'This standardizes configuration across multi-brand Staffbase instances and reduces deployment risk when adjusting widget behavior in production.',
      'The library parses configuration objects, validates them against a schema, and applies them to widget initialization logic at runtime.',
    ],
    use_cases: [
      { title: 'Content Editor Control', description: 'Enable content editors to control widget logic like display rules, filtering, and formatting without needing engineering involvement.', icon: 'edit' },
      { title: 'Multi-Brand Standardization', description: 'Standardize widget configuration across multiple brands or regions within a single Staffbase instance for consistency.', icon: 'layers' },
      { title: 'Safe Production Updates', description: 'Reduce deployment risk by allowing configuration changes without code modifications, making production adjustments safer and faster.', icon: 'shield' },
    ],
    prerequisites: [
      { title: 'Fork the Repository', description: 'Fork the Config Lang JS repository on GitHub to your own account so you can customize and deploy it independently.' },
      { title: 'Review the README', description: 'Read through the repository README for detailed setup instructions, configuration schema documentation, and usage examples.' },
      { title: 'Configure for Your Environment', description: 'Update the configuration files with your Staffbase instance details, widget schemas, and any custom validation rules.' },
      { title: 'Deploy', description: 'Build and deploy the bundle to your hosting environment following the deployment guide in the repository.' },
      { title: 'Reference Bundle URL in Staffbase Studio', description: 'Add the deployed bundle URL as a custom widget reference in Staffbase Studio to start using it on your pages.' },
    ],
    screenshots: [
      { label: 'Editor', alt: 'Config Lang Editor view' },
      { label: 'Schema', alt: 'Config Lang Schema view' },
      { label: 'Output', alt: 'Config Lang Output view' },
    ],
    config_options: [],
  },
  {
    id: 'textflow-js',
    title: 'Textflow JS',
    short_description: 'Advanced text rendering and content flow control for Staffbase custom widgets.',
    category: 'Plugin',
    tier: 'Experimental',
    icon: 'text',
    owner: 'SE',
    support_contact: 'custombuilds@staffbase.com',
    has_live_demo: true,
    live_demo_url: 'https://cckelvin.staffbase.com/',
    github_url: '#',
    overview: [
      'Textflow JS is an advanced text rendering library designed for Staffbase custom widgets. It handles dynamic content injection from APIs, rich text formatting, and configurable truncation/expansion behavior (show more/less).',
      'The library supports personalized text based on user profile attributes, making it possible to display different content to different user groups.',
      'It also includes utilities for text measurement, line clamping, and responsive text sizing that adapts to the widget\'s container dimensions.',
    ],
    use_cases: [
      { title: 'API-Sourced Rich Text', description: 'Render rich text content fetched from external APIs inside custom widgets with proper formatting, links, and media embeds.', icon: 'file-code' },
      { title: 'Expandable Content Blocks', description: 'Build "show more / show less" content sections that truncate long text and let users expand to read the full content.', icon: 'chevrons-down' },
      { title: 'Personalized Text', description: 'Inject different text content based on user profile attributes like department, location, or role for targeted messaging.', icon: 'user-cog' },
    ],
    prerequisites: [
      { title: 'Fork the Repository', description: 'Fork the Textflow JS repository on GitHub to your own account so you can customize and deploy it independently.' },
      { title: 'Review the README', description: 'Read through the repository README for detailed setup instructions, API documentation, and rendering examples.' },
      { title: 'Configure for Your Environment', description: 'Update the configuration files with your Staffbase instance details, API endpoints, and text rendering preferences.' },
      { title: 'Deploy', description: 'Build and deploy the bundle to your hosting environment following the deployment guide in the repository.' },
      { title: 'Reference Bundle URL in Staffbase Studio', description: 'Add the deployed bundle URL as a custom widget reference in Staffbase Studio to start using it on your pages.' },
    ],
    screenshots: [
      { label: 'Rich Text', alt: 'Textflow Rich Text view' },
      { label: 'Expand View', alt: 'Textflow Expand View' },
      { label: 'Personalized', alt: 'Textflow Personalized view' },
    ],
    config_options: [],
  },
];

export function getSolutionById(id: string): Solution | undefined {
  return SOLUTIONS.find((s) => s.id === id);
}

export function getSupportedSolutions(): Solution[] {
  return SOLUTIONS.filter((s) => s.tier === 'Supported');
}

export function getExperimentalSolutions(): Solution[] {
  return SOLUTIONS.filter((s) => s.tier === 'Experimental');
}
