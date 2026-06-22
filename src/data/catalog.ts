export type Category = 'Widget' | 'Plugin' | 'Integration';
export type Tier = 'Supported' | 'Experimental';

export interface ConfigOption {
  label: string;
  type: string;
  description: string;
  example?: string;
  required?: boolean;
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
  // ─── Supported Solutions ───────────────────────────────────────────────────

  {
    id: 'celebration-widget',
    title: 'Celebration Widget',
    short_description:
      'Display and celebrate users based on key dates like birthdays, work anniversaries, and special milestones. Automatically sync with user profile data and highlight your workforce culture directly on any Staffbase page.',
    category: 'Widget',
    tier: 'Supported',
    overview: [
      'The Celebration Widget provides a dynamic, automated way to foster inclusion and recognition within your organization. By leveraging existing user profile data, the widget calculates upcoming milestones and presents them in a visually engaging format on any Staffbase page.',
      'Whether it\'s a first day at the company or a 20-year milestone, ensure no achievement goes unnoticed. The widget supports birthdays, work anniversaries, and custom date-based celebrations, with full control over which users appear and how far into the past or future the widget looks.',
      'Administrators can configure the widget to split celebrations by year, highlight special milestone years (like 5, 10, or 15 years of service), and even allow users to opt out of being displayed if they prefer privacy.',
    ],
    use_cases: [
      {
        title: 'Birthday Recognition',
        description:
          'Boost morale by highlighting employee birthdays across the team. Integrates with profile data for automatic, privacy-compliant displays.',
        icon: 'party-popper',
      },
      {
        title: 'Work Anniversary Milestones',
        description:
          'Celebrate loyalty by surfacing years of service on the exact day. Perfect for fostering long-term employee engagement and retention.',
        icon: 'check-circle',
      },
      {
        title: 'Special Year Celebrations',
        description:
          'Highlight milestone years like 5, 10, or 15 years of service with special formatting and emphasis to make those moments stand out.',
        icon: 'party-popper',
      },
    ],
    prerequisites: [
      {
        title: 'PSP or PSP+ Instance',
        description:
          'Ensure your Staffbase environment is running on a compatible Platform Standard Plus or Platform Standard Plus+ subscription.',
      },
      {
        title: 'Date Attribute Mapping',
        description:
          'Birthdays and join dates must be mapped to user profile attributes in your user synchronization source (e.g. Azure AD, SCIM).',
      },
      {
        title: 'Widget Access Tokens',
        description:
          'Generate a secure API token from your admin settings to allow the widget to read non-PII employee data.',
      },
      {
        title: 'Staffbase CC Coordination',
        description:
          'Contact your Customer Care representative to enable the backend feature toggle for your tenant.',
      },
    ],
    config_options: [
      {
        label: 'Title',
        type: 'string',
        description: 'The heading text displayed above the celebration list on the widget.',
        example: 'Celebrations',
      },
      {
        label: 'Date Format',
        type: 'select',
        description: 'Choose between DD.MM (European) or MM.DD (US) date display format.',
        example: 'DD.MM',
      },
      {
        label: 'Celebration Profile Field ID',
        type: 'string',
        description:
          'The unique identifier of the user profile field that stores the celebration date (e.g. birthday or hire date).',
        example: 'birthday_date',
        required: true,
      },
      {
        label: 'Split by Year',
        type: 'boolean',
        description:
          'When enabled, groups celebrations by year so milestones are visually separated.',
      },
      {
        label: 'Special Years',
        type: 'string',
        description:
          'Comma-separated list of milestone years that receive special highlighting (e.g. 5, 10, 15, 20, 25).',
        example: '5, 10, 15, 20, 25',
      },
      {
        label: 'Number of Past Days',
        type: 'number',
        description: 'How many days in the past to look for recent celebrations to still display.',
        example: '7',
      },
      {
        label: 'Number of Future Days',
        type: 'number',
        description: 'How many days in the future to look ahead for upcoming celebrations.',
        example: '30',
      },
      {
        label: 'Header Color',
        type: 'string',
        description: 'Hex color code for the section headers within the widget.',
        example: '#009FE3',
      },
      {
        label: 'Hide Year Header',
        type: 'boolean',
        description: 'When enabled, hides the year grouping headers for a flatter display.',
      },
      {
        label: 'Profile Field ID for Opt-Out',
        type: 'string',
        description:
          'The profile field that determines whether a user has opted out of appearing in celebrations.',
        example: 'celebration_opt_out',
      },
      {
        label: 'Include Pending Users',
        type: 'boolean',
        description:
          'When enabled, users with a "pending" account status will also appear in celebrations.',
      },
      {
        label: 'Network Plugin ID',
        type: 'string',
        description:
          'The plugin ID used to scope the widget to a specific Staffbase network or community.',
        example: 'plugin-12345',
      },
    ],
    screenshots: [
      {
        label: 'Birthday View',
        alt: 'Celebration widget showing birthday view with employee profiles',
      },
      {
        label: 'Anniversary View',
        alt: 'Celebration widget showing work anniversary milestones',
      },
      {
        label: 'Mobile View',
        alt: 'Celebration widget displayed on a mobile device',
      },
    ],
    has_live_demo: true,
    live_demo_url: 'https://cckelvin.staffbase.com/',
    owner: 'CC',
    support_contact: 'custombuilds@staffbase.com',
    icon: 'party-popper',
  },

  {
    id: 'clocks-widget',
    title: 'Clocks Widget',
    short_description:
      'Displays analog and/or digital clocks for configurable timezones, helping global teams stay in sync across office locations.',
    category: 'Widget',
    tier: 'Supported',
    overview: [
      'The Clocks Widget provides a clean, configurable way to display the current time across multiple timezones on any Staffbase page. Supporting both analog and digital clock styles, it helps globally distributed teams stay aligned.',
      'Each clock instance can be individually titled, formatted, and styled to match your intranet\'s design language. Whether mounted in a reception lobby display or embedded on a team hub page, the widget adapts to your needs with minimal configuration.',
    ],
    use_cases: [
      {
        title: 'Global Teams',
        description:
          'Show multiple office timezones on a single hub page so distributed teams always know the local time at every office.',
        icon: 'clock',
      },
      {
        title: 'Reception Displays',
        description:
          'Mount a full-screen browser tab showing office clocks in your lobby or reception area for visiting clients.',
        icon: 'clock',
      },
      {
        title: 'Office Hub Pages',
        description:
          'Embed timezone clocks on department or location-specific pages so employees can coordinate across regions.',
        icon: 'clock',
      },
    ],
    prerequisites: [
      {
        title: 'PSP or PSP+ Instance',
        description:
          'Ensure your Staffbase environment is running on a compatible Platform Standard Plus or Platform Standard Plus+ subscription.',
      },
      {
        title: 'Timezone Data Available',
        description:
          'Ensure IANA timezone identifiers are available and correctly configured for each office location you wish to display.',
      },
      {
        title: 'Widget Access Tokens',
        description:
          'Generate a secure API token from your admin settings to allow the widget to read non-PII employee data.',
      },
      {
        title: 'Staffbase CC Coordination',
        description:
          'Contact your Customer Care representative to enable the backend feature toggle for your tenant.',
      },
    ],
    config_options: [
      {
        label: 'Timezone',
        type: 'string',
        description:
          'The IANA timezone identifier (e.g. America/New_York, Europe/Berlin) that determines what time the clock displays.',
        example: 'America/New_York',
        required: true,
      },
      {
        label: 'Use Analog Clock Style',
        type: 'boolean',
        description:
          'When enabled, renders a traditional round clock face with hour, minute, and second hands.',
      },
      {
        label: 'Use Digital Clock Style',
        type: 'boolean',
        description:
          'When enabled, renders a numeric time display. Can be used alongside or instead of the analog style.',
      },
      {
        label: 'Show Heading',
        type: 'boolean',
        description: 'Controls whether a text label appears above the clock.',
      },
      {
        label: 'Heading Text',
        type: 'string',
        description: 'The label displayed above the clock when Show Heading is enabled.',
        example: 'New York Office',
      },
      {
        label: 'Digital Clock Format',
        type: 'string',
        description:
          'A format string that controls how the digital time is displayed (e.g. HH:mm:ss for 24-hour, hh:mm A for 12-hour).',
        example: 'HH:mm:ss',
      },
    ],
    screenshots: [
      {
        label: 'Analog View',
        alt: 'Clocks widget showing analog clock face display',
      },
      {
        label: 'Digital View',
        alt: 'Clocks widget showing digital time display',
      },
      {
        label: 'Multi-Timezone',
        alt: 'Clocks widget showing multiple timezones side by side',
      },
    ],
    has_live_demo: true,
    live_demo_url: 'https://cckelvin.staffbase.com/',
    owner: 'CC',
    support_contact: 'custombuilds@staffbase.com',
    icon: 'clock',
  },

  {
    id: 'countdown-widget',
    title: 'Countdown Widget',
    short_description:
      'A countdown timer to a configurable date and time, with customizable labels for days, hours, minutes, and seconds.',
    category: 'Widget',
    tier: 'Supported',
    overview: [
      'The Countdown Widget builds anticipation for important company events by displaying a live ticking countdown on any Staffbase page. Configure it with any future date and time, customize the label text for each unit, and set colors to match your brand.',
      'When the countdown expires, a configurable message replaces the timer. Individual time units (days, hours, minutes, seconds) can be hidden to simplify the display for longer countdowns.',
    ],
    use_cases: [
      {
        title: 'Company Events',
        description:
          'Build excitement for annual company meetings, holiday parties, or town halls by counting down the days on your homepage.',
        icon: 'timer',
      },
      {
        title: 'Open Enrollment Deadlines',
        description:
          'Remind employees of important HR deadlines like benefits enrollment with a visible, ticking countdown.',
        icon: 'timer',
      },
      {
        title: 'Product Launch Countdowns',
        description:
          'Generate buzz for internal product launches or feature releases by adding countdown timers to relevant team pages.',
        icon: 'timer',
      },
    ],
    prerequisites: [
      {
        title: 'PSP or PSP+ Instance',
        description:
          'Ensure your Staffbase environment is running on a compatible Platform Standard Plus or Platform Standard Plus+ subscription.',
      },
      {
        title: 'Target Date Defined',
        description:
          'Identify the event date and time you want to count down to, formatted as YYYY-MM-DD HH:mm.',
      },
      {
        title: 'Widget Access Tokens',
        description:
          'Generate a secure API token from your admin settings to allow the widget to read non-PII employee data.',
      },
      {
        title: 'Staffbase CC Coordination',
        description:
          'Contact your Customer Care representative to enable the backend feature toggle for your tenant.',
      },
    ],
    config_options: [
      {
        label: 'Countdown Date + Time',
        type: 'string',
        description:
          'The target date and time the widget counts down to, in YYYY-MM-DD HH:mm format.',
        example: '2026-12-31 23:59',
        required: true,
      },
      {
        label: 'Days Word (singular)',
        type: 'string',
        description:
          'Customizable label for the days unit, singular form.',
        example: 'Day',
      },
      {
        label: 'Days Word (plural)',
        type: 'string',
        description: 'Customizable label for the days unit, plural form.',
        example: 'Days',
      },
      {
        label: 'Hours Word (singular)',
        type: 'string',
        description: 'Customizable label for the hours unit, singular form.',
        example: 'Hour',
      },
      {
        label: 'Hours Word (plural)',
        type: 'string',
        description: 'Customizable label for the hours unit, plural form.',
        example: 'Hours',
      },
      {
        label: 'Minutes Word (singular)',
        type: 'string',
        description: 'Customizable label for the minutes unit, singular form.',
        example: 'Minute',
      },
      {
        label: 'Minutes Word (plural)',
        type: 'string',
        description: 'Customizable label for the minutes unit, plural form.',
        example: 'Minutes',
      },
      {
        label: 'Seconds Word (singular)',
        type: 'string',
        description: 'Customizable label for the seconds unit, singular form.',
        example: 'Second',
      },
      {
        label: 'Seconds Word (plural)',
        type: 'string',
        description: 'Customizable label for the seconds unit, plural form.',
        example: 'Seconds',
      },
      {
        label: 'Expired Message',
        type: 'string',
        description: 'The text displayed once the countdown reaches zero, replacing the timer.',
        example: 'The event has started!',
      },
      {
        label: 'Text Color',
        type: 'string',
        description: 'Hex color code for the countdown numbers and labels.',
        example: '#FFFFFF',
      },
      {
        label: 'Background Color',
        type: 'string',
        description: 'Hex color code for the widget background.',
        example: '#0D1C3D',
      },
      {
        label: 'Hide Days',
        type: 'boolean',
        description: 'Individual toggle to hide the days unit from the display.',
      },
      {
        label: 'Hide Hours',
        type: 'boolean',
        description: 'Individual toggle to hide the hours unit from the display.',
      },
      {
        label: 'Hide Minutes',
        type: 'boolean',
        description: 'Individual toggle to hide the minutes unit from the display.',
      },
      {
        label: 'Hide Seconds',
        type: 'boolean',
        description: 'Individual toggle to hide the seconds unit from the display.',
      },
    ],
    screenshots: [
      {
        label: 'Full View',
        alt: 'Countdown widget showing full countdown with days, hours, minutes, and seconds',
      },
      {
        label: 'Expired State',
        alt: 'Countdown widget showing expired state with custom message',
      },
      {
        label: 'Custom Colors',
        alt: 'Countdown widget with custom brand colors applied',
      },
    ],
    has_live_demo: true,
    live_demo_url: 'https://cckelvin.staffbase.com/',
    owner: 'CC',
    support_contact: 'custombuilds@staffbase.com',
    icon: 'timer',
  },

  {
    id: 'digital-business-card',
    title: 'Digital Business Card',
    short_description:
      'Generates a digital business card with QR code linking to a vCard download, enabling seamless professional networking.',
    category: 'Widget',
    tier: 'Supported',
    overview: [
      'The Digital Business Card widget creates personalized, shareable digital business cards for employees directly from their Staffbase profile data. Each card can display the user\'s name, title, company, department, location, email, phone, and even social media links.',
      'A QR code is generated that links to a downloadable vCard file, making it easy to share contact information at conferences, meetings, or on frontline worker ID displays.',
      'Administrators have granular control over which fields appear and can toggle visibility for each section.',
    ],
    use_cases: [
      {
        title: 'Employee Directory Enhancement',
        description:
          'Add digital business cards to employee profile pages so colleagues can quickly save each other\'s contact details.',
        icon: 'contact',
      },
      {
        title: 'Conference Networking',
        description:
          'Give employees a shareable QR code for events and conferences that links directly to their professional contact card.',
        icon: 'contact',
      },
      {
        title: 'Frontline Worker ID Cards',
        description:
          'Display a simplified digital ID card on frontline workers\' mobile devices with essential contact and role information.',
        icon: 'contact',
      },
    ],
    prerequisites: [
      {
        title: 'PSP or PSP+ Instance',
        description:
          'Ensure your Staffbase environment is running on a compatible Platform Standard Plus or Platform Standard Plus+ subscription.',
      },
      {
        title: 'Date Attribute Mapping',
        description:
          'Birthdays and join dates must be mapped to user profile attributes in your user synchronization source (e.g. Azure AD, SCIM).',
      },
      {
        title: 'Widget Access Tokens',
        description:
          'Generate a secure API token from your admin settings to allow the widget to read non-PII employee data.',
      },
      {
        title: 'Staffbase CC Coordination',
        description:
          'Contact your Customer Care representative to enable the backend feature toggle for your tenant.',
      },
    ],
    config_options: [
      {
        label: 'Staffbase User ID',
        type: 'string',
        description:
          'The unique identifier of the user whose business card is displayed. Leave empty to show the currently logged-in user.',
        example: 'user-abc-123',
      },
      {
        label: 'Use Default First Name',
        type: 'boolean',
        description:
          'When enabled, pulls the name from the user\'s default Staffbase profile rather than a custom field.',
      },
      {
        label: 'Use Default Last Name',
        type: 'boolean',
        description:
          'When enabled, pulls the last name from the user\'s default Staffbase profile rather than a custom field.',
      },
      {
        label: 'First Name Profile Field ID',
        type: 'string',
        description: 'Custom profile field ID to use for the first name when the default toggle is off.',
        example: 'first_name',
      },
      {
        label: 'Last Name Profile Field ID',
        type: 'string',
        description: 'Custom profile field ID to use for the last name when the default toggle is off.',
        example: 'last_name',
      },
      {
        label: 'Hide Name',
        type: 'boolean',
        description: 'Toggle to hide the name field from the card.',
      },
      {
        label: 'Hide Title',
        type: 'boolean',
        description: 'Toggle to hide the title field from the card.',
      },
      {
        label: 'Hide Company',
        type: 'boolean',
        description: 'Toggle to hide the company field from the card.',
      },
      {
        label: 'Hide Position',
        type: 'boolean',
        description: 'Toggle to hide the position field from the card.',
      },
      {
        label: 'Hide Department',
        type: 'boolean',
        description: 'Toggle to hide the department field from the card.',
      },
      {
        label: 'Hide Location',
        type: 'boolean',
        description: 'Toggle to hide the location field from the card.',
      },
      {
        label: 'Hide Email',
        type: 'boolean',
        description: 'Toggle to hide the email field from the card.',
      },
      {
        label: 'Hide Phone',
        type: 'boolean',
        description: 'Toggle to hide the phone field from the card.',
      },
      {
        label: 'Enable Address Fields',
        type: 'boolean',
        description: 'When enabled, displays the user\'s physical address on the business card.',
      },
      {
        label: 'Enable Social Field',
        type: 'boolean',
        description: 'When enabled, adds a social media link to the card.',
      },
      {
        label: 'Social Media URL Profile Field ID',
        type: 'string',
        description: 'The profile field that stores the user\'s social media URL.',
        example: 'linkedin_url',
      },
      {
        label: 'Social Media Type',
        type: 'select',
        description: 'The type of social media platform (e.g. LinkedIn, Twitter) used for the icon and label.',
        example: 'LinkedIn',
      },
      {
        label: 'Show User Details Section',
        type: 'boolean',
        description: 'Controls visibility of the detailed information section below the card header.',
      },
      {
        label: 'Show Avatar',
        type: 'boolean',
        description: 'Toggle for the profile picture.',
      },
      {
        label: 'Show Header',
        type: 'boolean',
        description: 'Toggle for the card header banner.',
      },
      {
        label: 'Show QR Code Behind Button',
        type: 'boolean',
        description:
          'When enabled, hides the QR code behind a button click rather than displaying it directly.',
      },
    ],
    screenshots: [
      {
        label: 'Desktop View',
        alt: 'Digital business card displayed on desktop with full contact details',
      },
      {
        label: 'QR Code View',
        alt: 'Digital business card showing QR code for vCard download',
      },
      {
        label: 'Mobile View',
        alt: 'Digital business card displayed on a mobile device',
      },
    ],
    has_live_demo: true,
    live_demo_url: 'https://cckelvin.staffbase.com/',
    owner: 'CC',
    support_contact: 'custombuilds@staffbase.com',
    icon: 'contact',
  },

  {
    id: 'print-button-widget',
    title: 'Print Button Widget',
    short_description:
      'Triggers the browser\'s native print dialog with a single click, making it easy to print news articles, policies, and schedules.',
    category: 'Widget',
    tier: 'Supported',
    overview: [
      'The Print Button Widget adds a simple, configurable print button to any Staffbase page. When clicked, it triggers the browser\'s native print dialog, allowing employees to easily print news articles, policy documents, schedules, or any other page content.',
      'The widget supports customizable button text, optional printer icon display, and the ability to hide the button itself when the page is being printed so it doesn\'t appear on the printed output.',
    ],
    use_cases: [
      {
        title: 'Printing News Articles',
        description:
          'Allow employees to print important company news and announcements for offline reading or bulletin board posting.',
        icon: 'printer',
      },
      {
        title: 'Policy Documents',
        description:
          'Give HR and compliance teams a one-click way to print policy pages for physical distribution or archival.',
        icon: 'printer',
      },
      {
        title: 'Printable Schedules',
        description:
          'Enable shift workers to print their schedules directly from the intranet for personal reference.',
        icon: 'printer',
      },
    ],
    prerequisites: [
      {
        title: 'PSP or PSP+ Instance',
        description:
          'Ensure your Staffbase environment is running on a compatible Platform Standard Plus or Platform Standard Plus+ subscription.',
      },
      {
        title: 'Date Attribute Mapping',
        description:
          'Birthdays and join dates must be mapped to user profile attributes in your user synchronization source (e.g. Azure AD, SCIM).',
      },
      {
        title: 'Widget Access Tokens',
        description:
          'Generate a secure API token from your admin settings to allow the widget to read non-PII employee data.',
      },
      {
        title: 'Staffbase CC Coordination',
        description:
          'Contact your Customer Care representative to enable the backend feature toggle for your tenant.',
      },
    ],
    config_options: [
      {
        label: 'Button Text',
        type: 'string',
        description: 'The label displayed on the print button.',
        example: 'Print this page',
      },
      {
        label: 'Hide Button Text',
        type: 'boolean',
        description: 'When enabled, shows only the printer icon without any text label.',
      },
      {
        label: 'Hide Printer Icon',
        type: 'boolean',
        description: 'When enabled, shows only the text label without the printer icon.',
      },
      {
        label: 'Hide Button on Print',
        type: 'boolean',
        description:
          'When enabled, the print button is hidden from the printed output via CSS print media query.',
      },
    ],
    screenshots: [
      {
        label: 'Default View',
        alt: 'Print button widget with default styling on a Staffbase page',
      },
      {
        label: 'Print Dialog',
        alt: 'Browser print dialog triggered by the print button widget',
      },
      {
        label: 'Custom Styling',
        alt: 'Print button widget with custom text and icon configuration',
      },
    ],
    has_live_demo: true,
    live_demo_url: 'https://cckelvin.staffbase.com/',
    owner: 'CC',
    support_contact: 'custombuilds@staffbase.com',
    icon: 'printer',
  },

  {
    id: 'scrolling-banner',
    title: 'Scrolling Banner',
    short_description:
      'A horizontally scrolling announcement ticker for urgent company-wide alerts, breaking news banners, and IT maintenance notifications.',
    category: 'Widget',
    tier: 'Supported',
    overview: [
      'The Scrolling Banner widget creates a horizontally scrolling marquee-style announcement bar on any Staffbase page. It\'s ideal for urgent messages that need high visibility, like company-wide alerts, breaking news, or IT maintenance windows.',
      'Administrators can configure the announcement title, message text, link URL, and visual styling including colors, animation speed, and border options. The ticker can be paused on hover to give users time to read the full message.',
    ],
    use_cases: [
      {
        title: 'Urgent Company Announcements',
        description:
          'Push critical alerts like office closures, emergency contacts, or CEO messages across every page with maximum visibility.',
        icon: 'megaphone',
      },
      {
        title: 'Breaking News Banners',
        description:
          'Highlight time-sensitive internal news like acquisition announcements, quarterly results, or product milestones.',
        icon: 'megaphone',
      },
      {
        title: 'IT Maintenance Alerts',
        description:
          'Warn employees about upcoming system maintenance windows, outages, or required software updates.',
        icon: 'triangle-alert',
      },
    ],
    prerequisites: [
      {
        title: 'PSP or PSP+ Instance',
        description:
          'Ensure your Staffbase environment is running on a compatible Platform Standard Plus or Platform Standard Plus+ subscription.',
      },
      {
        title: 'Date Attribute Mapping',
        description:
          'Birthdays and join dates must be mapped to user profile attributes in your user synchronization source (e.g. Azure AD, SCIM).',
      },
      {
        title: 'Widget Access Tokens',
        description:
          'Generate a secure API token from your admin settings to allow the widget to read non-PII employee data.',
      },
      {
        title: 'Staffbase CC Coordination',
        description:
          'Contact your Customer Care representative to enable the backend feature toggle for your tenant.',
      },
    ],
    config_options: [
      {
        label: 'Title',
        type: 'string',
        description: 'An optional static label displayed before the scrolling content.',
        example: 'Important Notice',
      },
      {
        label: 'Show Title',
        type: 'boolean',
        description: 'Controls whether the static title label is visible.',
      },
      {
        label: 'Title Color',
        type: 'string',
        description: 'Hex color for the static title text.',
        example: '#FFFFFF',
      },
      {
        label: 'Announcement Title',
        type: 'string',
        description: 'Bold text that appears at the start of each scrolling announcement.',
        example: 'System Update',
      },
      {
        label: 'Announcement Message',
        type: 'string',
        description: 'The main body text of the scrolling announcement.',
        example: 'Scheduled maintenance this Saturday 10pm-2am',
        required: true,
      },
      {
        label: 'Announcement Link URL',
        type: 'string',
        description: 'An optional URL that makes the announcement clickable.',
        example: 'https://example.com/details',
      },
      {
        label: 'Announcement Link Title',
        type: 'string',
        description: 'The label for the clickable link within the announcement.',
        example: 'Learn More',
      },
      {
        label: 'Announcement Link Color',
        type: 'string',
        description: 'Hex color for the link text.',
        example: '#009FE3',
      },
      {
        label: 'Pause Slider on Hover',
        type: 'boolean',
        description:
          'When enabled, the scrolling animation pauses when a user hovers over the banner.',
      },
      {
        label: 'Animation Speed (seconds)',
        type: 'number',
        description:
          'How many seconds it takes for the announcement to scroll across the full width of the banner.',
        example: '15',
      },
      {
        label: 'Background Color',
        type: 'string',
        description: 'Hex color for the banner background.',
        example: '#0D1C3D',
      },
      {
        label: 'Border Color',
        type: 'string',
        description: 'Hex color for the optional top and bottom border.',
        example: '#009FE3',
      },
      {
        label: 'Show Border',
        type: 'boolean',
        description: 'Controls whether the banner has visible top and bottom borders.',
      },
      {
        label: 'Text Color',
        type: 'string',
        description: 'Hex color for the announcement body text.',
        example: '#FFFFFF',
      },
    ],
    screenshots: [
      {
        label: 'Default View',
        alt: 'Scrolling Banner default view with standard styling',
      },
      {
        label: 'Custom Colors',
        alt: 'Scrolling Banner with custom color configuration',
      },
      {
        label: 'With Link',
        alt: 'Scrolling Banner with clickable link',
      },
    ],
    has_live_demo: true,
    live_demo_url: 'https://cckelvin.staffbase.com/',
    owner: 'CC',
    support_contact: 'custombuilds@staffbase.com',
    icon: 'megaphone',
  },

  {
    id: 'text-on-image',
    title: 'Text on Image Widget',
    short_description:
      'Overlay headline and description text on top of an uploaded image with optional color overlay for maximum visual impact.',
    category: 'Widget',
    tier: 'Supported',
    overview: [
      'The Text on Image Widget allows communicators to create visually striking hero banners by overlaying text content on top of uploaded images. With support for custom headline and description text, adjustable alignment, color overlay with opacity control, and optional icon placement, this widget is perfect for campaign landing pages, department start pages, and any page that needs a bold visual statement.',
      'The overlay ensures text remains readable regardless of the underlying image.',
    ],
    use_cases: [
      {
        title: 'Hero Banners',
        description:
          'Create eye-catching hero sections at the top of your intranet homepage or campaign pages with branded imagery and messaging.',
        icon: 'image',
      },
      {
        title: 'Campaign Landing Pages',
        description:
          'Build visually compelling landing pages for internal campaigns like wellness programs, charity drives, or cultural initiatives.',
        icon: 'image',
      },
      {
        title: 'Department Start Pages',
        description:
          'Design distinctive header images for department or location-specific pages that set the tone and identity.',
        icon: 'image',
      },
    ],
    prerequisites: [
      {
        title: 'PSP or PSP+ Instance',
        description:
          'Ensure your Staffbase environment is running on a compatible Platform Standard Plus or Platform Standard Plus+ subscription.',
      },
      {
        title: 'Date Attribute Mapping',
        description:
          'Birthdays and join dates must be mapped to user profile attributes in your user synchronization source (e.g. Azure AD, SCIM).',
      },
      {
        title: 'Widget Access Tokens',
        description:
          'Generate a secure API token from your admin settings to allow the widget to read non-PII employee data.',
      },
      {
        title: 'Staffbase CC Coordination',
        description:
          'Contact your Customer Care representative to enable the backend feature toggle for your tenant.',
      },
    ],
    config_options: [
      {
        label: 'Upload Image',
        type: 'file',
        description: 'The background image file that appears behind the text overlay.',
        example: 'hero-banner.jpg',
        required: true,
      },
      {
        label: 'Headline',
        type: 'string',
        description: 'The main heading text displayed on top of the image.',
        example: 'Welcome to Our Team',
      },
      {
        label: 'Headline Color',
        type: 'string',
        description: 'Hex color for the headline text.',
        example: '#FFFFFF',
      },
      {
        label: 'Description',
        type: 'string',
        description: 'Supporting body text displayed below the headline.',
        example: 'Join us on our journey',
      },
      {
        label: 'Description Color',
        type: 'string',
        description: 'Hex color for the description text.',
        example: '#E8EAED',
      },
      {
        label: 'Headline Alignment',
        type: 'select',
        description: 'Horizontal alignment of the headline (Left, Center, Right).',
        example: 'Center',
      },
      {
        label: 'Description Alignment',
        type: 'select',
        description: 'Horizontal alignment of the description text.',
        example: 'Center',
      },
      {
        label: 'Apply Color Overlay',
        type: 'boolean',
        description:
          'When enabled, adds a semi-transparent color layer between the image and text for improved readability.',
      },
      {
        label: 'Overlay Color',
        type: 'string',
        description: 'Hex color for the overlay layer.',
        example: '#0D1C3D',
      },
      {
        label: 'Overlay Opacity',
        type: 'number',
        description: 'A value from 0 to 1 controlling the transparency of the color overlay.',
        example: '0.5',
      },
      {
        label: 'Add Icon',
        type: 'boolean',
        description: 'When enabled, displays an icon alongside the text content.',
      },
      {
        label: 'Upload Icon',
        type: 'file',
        description: 'The icon image file to display when Add Icon is enabled.',
      },
      {
        label: 'Icon Size',
        type: 'number',
        description: 'The size of the icon in pixels.',
        example: '48',
      },
      {
        label: 'Icon Alignment',
        type: 'select',
        description: 'Horizontal alignment of the icon (Left, Center, Right).',
        example: 'Center',
      },
    ],
    screenshots: [
      {
        label: 'Hero View',
        alt: 'Text on Image widget showing a hero banner with headline overlay',
      },
      {
        label: 'With Overlay',
        alt: 'Text on Image widget with color overlay for readability',
      },
      {
        label: 'Mobile View',
        alt: 'Text on Image widget displayed on a mobile device',
      },
    ],
    has_live_demo: true,
    live_demo_url: 'https://cckelvin.staffbase.com/',
    owner: 'CC',
    support_contact: 'custombuilds@staffbase.com',
    icon: 'image',
  },

  {
    id: 'qualtrics-insights',
    title: 'Qualtrics Insights Widget',
    short_description:
      'Embed a Qualtrics feedback form via Organization ID directly within the Staffbase intranet for seamless employee surveys.',
    category: 'Widget',
    tier: 'Supported',
    overview: [
      'The Qualtrics Insights Widget provides a seamless bridge between your Staffbase intranet and Qualtrics survey platform. By simply entering your Qualtrics Organization ID, the widget embeds a fully functional feedback form directly into any Staffbase page.',
      'This eliminates the need for employees to navigate away from the intranet to complete surveys, resulting in higher completion rates and better feedback quality. The widget handles authentication, rendering, and submission entirely within the Staffbase experience.',
    ],
    use_cases: [
      {
        title: 'In-App Employee Surveys',
        description:
          'Embed pulse surveys and engagement questionnaires directly in the employee feed for maximum participation and convenience.',
        icon: 'bar-chart-3',
      },
      {
        title: 'Pulse Checks',
        description:
          'Run quick sentiment checks on specific topics by embedding short Qualtrics forms on relevant department or project pages.',
        icon: 'bar-chart-3',
      },
      {
        title: 'Feedback Loops',
        description:
          'Create always-available feedback channels on leadership pages or town hall recap pages where employees can share thoughts.',
        icon: 'bar-chart-3',
      },
    ],
    prerequisites: [
      {
        title: 'PSP or PSP+ Instance',
        description:
          'Ensure your Staffbase environment is running on a compatible Platform Standard Plus or Platform Standard Plus+ subscription.',
      },
      {
        title: 'Qualtrics Account',
        description:
          'You must have an active Qualtrics organization account with API access enabled and at least one published survey.',
      },
      {
        title: 'Widget Access Tokens',
        description:
          'Generate a secure API token from your admin settings to allow the widget to read non-PII employee data.',
      },
      {
        title: 'Staffbase CC Coordination',
        description:
          'Contact your Customer Care representative to enable the backend feature toggle for your tenant.',
      },
    ],
    config_options: [
      {
        label: 'Qualtrics Organization ID',
        type: 'string',
        description:
          'The unique identifier for your Qualtrics organization account, used to authenticate and load the correct survey forms within the widget.',
        example: 'org_abc123xyz',
        required: true,
      },
    ],
    screenshots: [
      {
        label: 'Survey View',
        alt: 'Qualtrics Insights widget showing survey view with embedded form',
      },
      {
        label: 'Embedded Form',
        alt: 'Qualtrics Insights widget showing embedded feedback form',
      },
      {
        label: 'Mobile View',
        alt: 'Qualtrics Insights widget displayed on a mobile device',
      },
    ],
    has_live_demo: true,
    live_demo_url: 'https://cckelvin.staffbase.com/',
    owner: 'CC',
    support_contact: 'custombuilds@staffbase.com',
    icon: 'bar-chart-3',
  },

  {
    id: 'weather-widget',
    title: 'Weather Widget',
    short_description:
      'Display current weather conditions and a 7-day forecast for a configured location, powered by OpenWeatherMap.',
    category: 'Widget',
    tier: 'Supported',
    overview: [
      'The Weather Widget brings real-time weather data to any Staffbase page, showing current conditions and an optional 7-day forecast for a configured location. Powered by the OpenWeatherMap API, it supports both Celsius and Fahrenheit display, customizable colors, and location-specific configuration.',
      'It\'s particularly valuable for organizations with frontline workers who need to check conditions before shifts, facilities teams managing outdoor spaces, and multi-site organizations wanting to show weather for each office location.',
    ],
    use_cases: [
      {
        title: 'Frontline Worker Safety',
        description:
          'Help frontline workers check weather conditions before outdoor shifts so they can prepare appropriate gear and safety measures.',
        icon: 'cloud-sun',
      },
      {
        title: 'Facilities Management',
        description:
          'Give facilities teams real-time weather data to plan outdoor maintenance, events, and space management decisions.',
        icon: 'cloud-sun',
      },
      {
        title: 'Multi-Site Organizations',
        description:
          'Show location-specific weather on each office or site page so traveling employees know what to expect at their destination.',
        icon: 'cloud-sun',
      },
    ],
    prerequisites: [
      {
        title: 'PSP or PSP+ Instance',
        description:
          'Ensure your Staffbase environment is running on a compatible Platform Standard Plus or Platform Standard Plus+ subscription.',
      },
      {
        title: 'OpenWeatherMap API Key',
        description:
          'Register for a free or paid OpenWeatherMap API key at openweathermap.org to enable weather data retrieval.',
      },
      {
        title: 'Widget Access Tokens',
        description:
          'Generate a secure API token from your admin settings to allow the widget to read non-PII employee data.',
      },
      {
        title: 'Staffbase CC Coordination',
        description:
          'Contact your Customer Care representative to enable the backend feature toggle for your tenant.',
      },
    ],
    config_options: [
      {
        label: 'OpenWeatherMap API Key',
        type: 'string',
        description:
          'Your personal API key from OpenWeatherMap, required to fetch weather data. Sign up at openweathermap.org.',
        example: 'sk-abc123...',
        required: true,
      },
      {
        label: 'Location',
        type: 'string',
        description:
          'The city, state, and country for weather data retrieval (e.g. "New York, NY, US" or "Berlin, Germany").',
        example: 'New York, NY, US',
        required: true,
      },
      {
        label: 'Prefer Fahrenheit',
        type: 'boolean',
        description:
          'When enabled, temperatures display in Fahrenheit. When disabled, temperatures display in Celsius.',
      },
      {
        label: 'Show Forecast',
        type: 'boolean',
        description: 'When enabled, displays a 7-day weather forecast below the current conditions.',
      },
      {
        label: 'Widget Background Color',
        type: 'string',
        description: 'Hex color for the widget background.',
        example: '#FFFFFF',
      },
      {
        label: 'Widget Text Color',
        type: 'string',
        description: 'Hex color for all text within the widget.',
        example: '#0D1C3D',
      },
    ],
    screenshots: [
      {
        label: 'Current View',
        alt: 'Weather widget showing current conditions with temperature and icon',
      },
      {
        label: 'Forecast View',
        alt: 'Weather widget showing 7-day forecast with daily temperatures',
      },
      {
        label: 'Mobile View',
        alt: 'Weather widget displayed on a mobile device',
      },
    ],
    has_live_demo: true,
    live_demo_url: 'https://cckelvin.staffbase.com/',
    owner: 'CC',
    support_contact: 'custombuilds@staffbase.com',
    icon: 'cloud-sun',
  },

  {
    id: 'image-comparison-slider',
    title: 'Image Comparison Slider',
    short_description:
      'Side-by-side image comparison with a draggable divider, perfect for before/after views and visual storytelling.',
    category: 'Widget',
    tier: 'Supported',
    overview: [
      'The Image Comparison Slider widget displays two images side by side with a draggable divider that lets users reveal one image over the other. It supports both horizontal and vertical slider directions, customizable divider positioning, and optional automatic sliding on mouse hover.',
      'This widget is ideal for showcasing before/after transformations, product design comparisons, or campaign visual reveals. The divider and handle colors are fully customizable to match your brand.',
    ],
    use_cases: [
      {
        title: 'Before/After Renovations',
        description:
          'Showcase office renovations, facility upgrades, or workspace transformations with compelling visual comparisons.',
        icon: 'columns-2',
      },
      {
        title: 'Product Design Comparisons',
        description:
          'Compare design iterations, packaging updates, or brand refresh visuals side by side for internal review and feedback.',
        icon: 'columns-2',
      },
      {
        title: 'Campaign Visual Reveals',
        description:
          'Create engaging reveal moments for marketing campaigns by letting employees slide to discover new brand assets or campaign visuals.',
        icon: 'columns-2',
      },
    ],
    prerequisites: [
      {
        title: 'PSP or PSP+ Instance',
        description:
          'Ensure your Staffbase environment is running on a compatible Platform Standard Plus or Platform Standard Plus+ subscription.',
      },
      {
        title: 'Date Attribute Mapping',
        description:
          'Birthdays and join dates must be mapped to user profile attributes in your user synchronization source (e.g. Azure AD, SCIM).',
      },
      {
        title: 'Widget Access Tokens',
        description:
          'Generate a secure API token from your admin settings to allow the widget to read non-PII employee data.',
      },
      {
        title: 'Staffbase CC Coordination',
        description:
          'Contact your Customer Care representative to enable the backend feature toggle for your tenant.',
      },
    ],
    config_options: [
      {
        label: 'Upload Image 1',
        type: 'file',
        description:
          'The first image (typically the "before" state) displayed on the left or top side of the slider.',
        example: 'before-image.jpg',
        required: true,
      },
      {
        label: 'Upload Image 2',
        type: 'file',
        description:
          'The second image (typically the "after" state) displayed on the right or bottom side of the slider.',
        example: 'after-image.jpg',
        required: true,
      },
      {
        label: 'Slider Direction',
        type: 'select',
        description:
          'Controls whether the divider slides horizontally (left/right) or vertically (top/bottom).',
        example: 'Horizontal',
      },
      {
        label: 'Divider Position (0-100)',
        type: 'number',
        description:
          'The initial position of the divider as a percentage from 0 to 100, where 50 is the center.',
        example: '50',
      },
      {
        label: 'Automatic Slide on Mouse Hover',
        type: 'boolean',
        description:
          'When enabled, the divider follows the mouse cursor position without requiring a click and drag.',
      },
      {
        label: 'Divider Color',
        type: 'string',
        description: 'Hex color for the divider line between the two images.',
        example: '#FFFFFF',
      },
      {
        label: 'Handle Color',
        type: 'string',
        description: 'Hex color for the draggable handle on the divider.',
        example: '#009FE3',
      },
    ],
    screenshots: [
      {
        label: 'Horizontal View',
        alt: 'Image Comparison Slider showing horizontal sliding mode',
      },
      {
        label: 'Vertical View',
        alt: 'Image Comparison Slider showing vertical sliding mode',
      },
      {
        label: 'Mobile View',
        alt: 'Image Comparison Slider displayed on a mobile device',
      },
    ],
    has_live_demo: true,
    live_demo_url: 'https://cckelvin.staffbase.com/',
    owner: 'CC',
    support_contact: 'custombuilds@staffbase.com',
    icon: 'columns-2',
  },

  {
    id: 'new-starter-widget',
    title: 'New Starter Widget',
    short_description:
      'Display recent new hires within a configurable date window, helping teams welcome and connect with new colleagues.',
    category: 'Widget',
    tier: 'Supported',
    overview: [
      'The New Starter Widget automatically surfaces recently joined employees on any Staffbase page, making it easy for teams to welcome and connect with new colleagues. It reads from user profile start date fields and displays new hires within a configurable time window.',
      'Like the Celebration Widget, it supports year-based grouping, special year highlighting, opt-out functionality, and customizable messaging for loading and empty states. It\'s the perfect addition to home pages, team pages, and HR dashboard pages.',
    ],
    use_cases: [
      {
        title: 'Homepage Welcome',
        description:
          'Feature new joiners prominently on the company homepage so everyone across the organization can say hello and welcome them.',
        icon: 'user-plus',
      },
      {
        title: 'Team Onboarding Visibility',
        description:
          'Add the widget to team or department pages so managers and colleagues can see who has recently joined their group.',
        icon: 'user-plus',
      },
      {
        title: 'HR Dashboard Pages',
        description:
          'Give HR teams a quick overview of recent hires across the organization, filterable by date range and department.',
        icon: 'user-plus',
      },
    ],
    prerequisites: [
      {
        title: 'PSP or PSP+ Instance',
        description:
          'Ensure your Staffbase environment is running on a compatible Platform Standard Plus or Platform Standard Plus+ subscription.',
      },
      {
        title: 'Date Attribute Mapping',
        description:
          'Birthdays and join dates must be mapped to user profile attributes in your user synchronization source (e.g. Azure AD, SCIM).',
      },
      {
        title: 'Widget Access Tokens',
        description:
          'Generate a secure API token from your admin settings to allow the widget to read non-PII employee data.',
      },
      {
        title: 'Staffbase CC Coordination',
        description:
          'Contact your Customer Care representative to enable the backend feature toggle for your tenant.',
      },
    ],
    config_options: [
      {
        label: 'Title',
        type: 'string',
        description: 'The heading text displayed above the new starter list.',
        example: 'Welcome New Starters',
      },
      {
        label: 'Start Date Profile Field ID',
        type: 'string',
        description: 'The user profile field that stores the employee\'s start date.',
        example: 'start_date',
        required: true,
      },
      {
        label: 'Date Format',
        type: 'select',
        description: 'Choose between DD.MM (European) or MM.DD (US) date display format.',
        example: 'DD.MM',
      },
      {
        label: 'Show Anniversary Date',
        type: 'boolean',
        description: 'When enabled, shows the actual start date next to each new starter\'s name.',
      },
      {
        label: 'Loading Message',
        type: 'string',
        description: 'Text displayed while the widget fetches user data.',
        example: 'Loading new starters...',
      },
      {
        label: 'No Users Message',
        type: 'string',
        description: 'Text displayed when no new starters fall within the configured date range.',
        example: 'No new starters in this period',
      },
      {
        label: 'Year Word',
        type: 'string',
        description: 'Customizable label for the year grouping headers, singular form.',
        example: 'Year',
      },
      {
        label: 'Year Word Plural',
        type: 'string',
        description: 'Customizable label for the year grouping headers, plural form.',
        example: 'Years',
      },
      {
        label: 'Split by Year',
        type: 'boolean',
        description: 'When enabled, groups new starters by their start year.',
      },
      {
        label: 'Number of Visible Past Days',
        type: 'number',
        description: 'How many days in the past to look for recently started employees.',
        example: '7',
      },
      {
        label: 'Number of Visible Future Days',
        type: 'number',
        description: 'How many days in the future to show upcoming starters.',
        example: '30',
      },
      {
        label: 'Header Color',
        type: 'string',
        description: 'Hex color for the section headers within the widget.',
        example: '#009FE3',
      },
      {
        label: 'Special Years',
        type: 'string',
        description: 'Comma-separated list of milestone years that receive special formatting.',
        example: '1, 5, 10',
      },
      {
        label: 'Hide Year Header',
        type: 'boolean',
        description: 'When enabled, hides the year grouping headers.',
      },
      {
        label: 'Profile Field ID for Opt-Out',
        type: 'string',
        description: 'The profile field that determines whether a user has opted out of being shown.',
        example: 'new_starter_opt_out',
      },
      {
        label: 'Include Pending Users',
        type: 'boolean',
        description: 'When enabled, users with pending status will also appear.',
      },
      {
        label: 'Network Plugin ID',
        type: 'string',
        description: 'Scopes the widget to a specific Staffbase network.',
        example: 'plugin-12345',
      },
    ],
    screenshots: [
      {
        label: 'List View',
        alt: 'New Starter Widget showing list view of recent hires',
      },
      {
        label: 'Card View',
        alt: 'New Starter Widget showing card view of recent hires',
      },
      {
        label: 'Mobile View',
        alt: 'New Starter Widget displayed on a mobile device',
      },
    ],
    has_live_demo: true,
    live_demo_url: 'https://cckelvin.staffbase.com/',
    owner: 'CC',
    support_contact: 'custombuilds@staffbase.com',
    icon: 'user-plus',
  },

  {
    id: 'analytics-email-open-viewer',
    title: 'Analytics Email Open Viewer',
    short_description:
      'Display recently sent or specific Staffbase emails as a widget on any page, enabling internal comms teams to track engagement.',
    category: 'Widget',
    tier: 'Supported',
    overview: [
      'The Analytics Email Open Viewer widget surfaces Staffbase email campaign data directly on any intranet page. By connecting to your Staffbase domain, it displays recently sent emails along with key engagement metrics. Internal communications teams can use it to create editorial dashboards, track email performance at a glance, and share communication metrics on leadership pages.',
      'The widget provides a real-time view of email engagement without requiring users to navigate to the Staffbase analytics backend.',
    ],
    use_cases: [
      {
        title: 'Internal Comms Tracking',
        description:
          'Give communications teams a quick dashboard view of recent email campaign performance and open rates directly on their team page.',
        icon: 'mail-open',
      },
      {
        title: 'Editorial Dashboards',
        description:
          'Build dedicated editorial pages that show all recent internal newsletter sends and their engagement metrics in one place.',
        icon: 'mail-open',
      },
      {
        title: 'Leadership Metrics',
        description:
          'Surface communication engagement data on executive and leadership pages to demonstrate the reach and impact of internal messaging.',
        icon: 'mail-open',
      },
    ],
    prerequisites: [
      {
        title: 'PSP or PSP+ Instance',
        description:
          'Ensure your Staffbase environment is running on a compatible Platform Standard Plus or Platform Standard Plus+ subscription.',
      },
      {
        title: 'Staffbase Email Module',
        description:
          'Your Staffbase instance must have the Email module enabled with at least one sent email campaign for the widget to display data.',
      },
      {
        title: 'Widget Access Tokens',
        description:
          'Generate a secure API token from your admin settings to allow the widget to read non-PII employee data.',
      },
      {
        title: 'Staffbase CC Coordination',
        description:
          'Contact your Customer Care representative to enable the backend feature toggle for your tenant.',
      },
    ],
    config_options: [
      {
        label: 'Staffbase Domain',
        type: 'string',
        description:
          'Your organization\'s Staffbase domain (e.g. yourcompany.staffbase.com) used to connect to the email analytics API and retrieve send data.',
        example: 'yourcompany.staffbase.com',
        required: true,
      },
    ],
    screenshots: [
      {
        label: 'Email Viewer Dashboard',
        alt: 'Analytics Email Open Viewer showing email campaign dashboard',
      },
      {
        label: 'Email Viewer Metrics',
        alt: 'Analytics Email Open Viewer showing engagement metrics',
      },
      {
        label: 'Mobile View',
        alt: 'Analytics Email Open Viewer displayed on a mobile device',
      },
    ],
    has_live_demo: true,
    live_demo_url: 'https://cckelvin.staffbase.com/',
    owner: 'CC',
    support_contact: 'custombuilds@staffbase.com',
    icon: 'mail-open',
  },

  {
    id: 'company-stock-widget',
    title: 'Company Stock Widget',
    short_description:
      'Display your organization\'s live stock price with a sparkline chart, powered by the Twelve Data API.',
    category: 'Widget',
    tier: 'Supported',
    overview: [
      'The Company Stock Widget displays your organization\'s current stock price along with a sparkline chart showing recent price movement. Powered by the Twelve Data API, it refreshes at a configurable interval to keep the display current throughout the trading day.',
      'The widget supports customizable background and text colors to match your intranet design, and works with any publicly traded stock ticker symbol. It\'s ideal for investor relations pages, company performance dashboards, and executive intranet sections.',
    ],
    use_cases: [
      {
        title: 'Investor Relations Pages',
        description:
          'Display the company\'s current stock price and trend on investor-focused intranet pages to keep employees informed about market performance.',
        icon: 'trending-up',
      },
      {
        title: 'Company Performance Dashboards',
        description:
          'Add live stock data to performance dashboards alongside other business metrics for a comprehensive view of company health.',
        icon: 'trending-up',
      },
      {
        title: 'Executive Intranets',
        description:
          'Surface real-time stock information on leadership and executive pages as part of a broader business intelligence display.',
        icon: 'trending-up',
      },
    ],
    prerequisites: [
      {
        title: 'PSP or PSP+ Instance',
        description:
          'Ensure your Staffbase environment is running on a compatible Platform Standard Plus or Platform Standard Plus+ subscription.',
      },
      {
        title: 'Twelve Data API Key',
        description:
          'Register for a Twelve Data API account at twelvedata.com and generate an API key to enable stock price data retrieval.',
      },
      {
        title: 'Widget Access Tokens',
        description:
          'Generate a secure API token from your admin settings to allow the widget to read non-PII employee data.',
      },
      {
        title: 'Staffbase CC Coordination',
        description:
          'Contact your Customer Care representative to enable the backend feature toggle for your tenant.',
      },
    ],
    config_options: [
      {
        label: 'Stock Ticker Symbol',
        type: 'string',
        description: 'The stock exchange ticker symbol for your company (e.g. AAPL, MSFT, GOOG).',
        example: 'AAPL',
        required: true,
      },
      {
        label: 'API Key (Twelve Data)',
        type: 'string',
        description:
          'Your API key from Twelve Data (twelvedata.com), required to fetch real-time stock price data.',
        example: 'td-abc123...',
        required: true,
      },
      {
        label: 'Widget Background Color',
        type: 'string',
        description: 'Hex color for the widget background.',
        example: '#FFFFFF',
      },
      {
        label: 'Widget Text Color',
        type: 'string',
        description: 'Hex color for all text and the sparkline chart within the widget.',
        example: '#0D1C3D',
      },
      {
        label: 'Refresh Interval',
        type: 'number',
        description: 'How often (in seconds) the widget fetches updated stock price data.',
        example: '60',
      },
    ],
    screenshots: [
      {
        label: 'Stock Widget View',
        alt: 'Company Stock Widget showing live stock price',
      },
      {
        label: 'Sparkline Chart',
        alt: 'Company Stock Widget showing sparkline price chart',
      },
      {
        label: 'Mobile View',
        alt: 'Company Stock Widget displayed on a mobile device',
      },
    ],
    has_live_demo: true,
    live_demo_url: 'https://cckelvin.staffbase.com/',
    owner: 'CC',
    support_contact: 'custombuilds@staffbase.com',
    icon: 'trending-up',
  },

  {
    id: 'social-feed-taggbox',
    title: 'Social Feed (Taggbox)',
    short_description:
      'Displays a single social media feed — YouTube, Instagram, or LinkedIn — sourced from the customer\'s Taggbox account, rendered as a navigable card with a full-post modal.',
    category: 'Widget',
    tier: 'Supported',
    overview: [
      'The Social Feed (Taggbox) widget surfaces posts from a single social platform — YouTube, Instagram, Instagram Business, or LinkedIn — pulled from the customer\'s own Taggbox gallery. Posts render as a horizontally navigable card, with a "Read more" modal showing the full post, platform-specific media, and a link to the original.',
      'The widget is designed to be deployed multiple times on the same page, one instance per platform, each configured with its own Feed ID. The platform is detected automatically from the Taggbox network ID, applying the correct icon and media renderer. Fetched posts are cached in the browser for a configurable period to reduce API calls.',
      'This is a third-party integration: each instance calls the Taggbox API directly from the client using the customer\'s own API key, Gallery ID, and Feed ID. There is no Staffbase-side proxy, so the customer must own and provision their Taggbox subscription and feeds.',
    ],
    use_cases: [
      {
        title: 'Branded Social Walls',
        description:
          'Embed an Instagram, YouTube, or LinkedIn feed on a campaign or homepage to bring official social content into the intranet.',
        icon: 'megaphone',
      },
      {
        title: 'Multi-Platform Showcase',
        description:
          'Place several instances side by side — one per platform — to present a unified view of the organization\'s social presence.',
        icon: 'image',
      },
      {
        title: 'Employer Branding & Culture',
        description:
          'Highlight curated LinkedIn or Instagram posts to reinforce employer brand and culture for frontline and desk workers alike.',
        icon: 'trending-up',
      },
    ],
    prerequisites: [
      {
        title: 'PSP or PSP+ Instance',
        description:
          'Available for Platform Standard Plus / Platform Standard Plus+ customers and tech offerings requests.',
      },
      {
        title: 'Customer Taggbox Subscription',
        description:
          'The customer must own a Taggbox account and provide an API key, a Gallery ID, and a Feed ID for each platform they want to display.',
      },
      {
        title: 'Supported Platform',
        description:
          'The widget currently renders Instagram, Instagram Business, YouTube, and LinkedIn feeds. Other Taggbox networks require widget development before they can be used.',
      },
      {
        title: 'One Instance Per Platform',
        description:
          'Each platform is shown by a separate widget instance configured with its own Feed ID; multiple platforms require multiple instances on the page.',
      },
      {
        title: 'Staffbase CC Coordination',
        description:
          'Contact your Customer Care representative to scope the request and deploy the widget instances for your tenant.',
      },
    ],
    config_options: [
      {
        label: 'Taggbox API key',
        type: 'string',
        description:
          'Taggbox API key used for authentication. Rendered as a password field in the editor. Sent from the client, so scope it to read-only feed access where possible.',
        required: true,
      },
      {
        label: 'Gallery ID',
        type: 'string',
        description: 'The Taggbox gallery ID that contains the feeds.',
        required: true,
      },
      {
        label: 'Feed ID',
        type: 'string',
        description:
          'The Taggbox feed ID for the platform this instance should display. Use a different Feed ID per instance to show different platforms.',
        required: true,
      },
      {
        label: 'Widget title',
        type: 'string',
        description: 'Optional title displayed above the card. Leave empty to omit it.',
      },
      {
        label: 'Max posts',
        type: 'number',
        description: 'Maximum number of posts to load. Allowed range 1–20.',
        example: '10',
      },
      {
        label: 'Caption lines',
        type: 'number',
        description:
          'Maximum number of caption lines shown on the card before truncating with an ellipsis. Full text is always visible in the modal. Allowed range 1–10.',
        example: '3',
      },
      {
        label: 'Arrow background color',
        type: 'color',
        description:
          'Background color of the circular prev/next arrow buttons (also applied to the modal\'s carousel arrows). Must be a valid hex color; invalid values fall back to the default.',
        example: '#00355D',
      },
      {
        label: 'Arrow icon color',
        type: 'color',
        description:
          'Color of the arrow icons. Must be a valid hex color; invalid values fall back to the default.',
        example: '#FFFFFF',
      },
      {
        label: 'Cache TTL (minutes)',
        type: 'number',
        description:
          'How long fetched posts are cached in localStorage before a refetch. Minimum 1.',
        example: '5',
      },
    ],
    screenshots: [
      {
        label: 'Feed Card',
        alt: 'Social feed widget showing a single post as a navigable card',
      },
      {
        label: 'Post Detail Modal',
        alt: 'Read-more modal showing the full post, media, and a link to the original',
      },
      {
        label: 'Multiple Instances',
        alt: 'Several social feed instances on one page, one per platform',
      },
    ],
    has_live_demo: true,
    live_demo_url: 'https://cckelvin.staffbase.com/',
    owner: 'CC',
    support_contact: 'custombuilds@staffbase.com',
    icon: 'megaphone',
  },

  // ─── Experimental Solutions ────────────────────────────────────────────────

  {
    id: 'dom-embedder',
    title: 'DOM Embedder',
    short_description:
      'Dynamically embeds external DOM elements or iFrames into Staffbase pages using configurable CSS selector targeting.',
    category: 'Widget',
    tier: 'Experimental',
    overview: [
      'DOM Embedder is a community-built utility that lets you inject content from external websites directly into your Staffbase pages. Using configurable CSS selectors, it targets specific elements on third-party sites and re-renders them within your intranet layout.',
      'This is particularly useful for embedding self-service panels from tools like Workday or ServiceNow, injecting external HTML widgets into specific page zones, or rapid prototyping of integrations before committing to a full custom plugin build.',
      'The tool handles cross-origin considerations and provides fallback options for when target elements are unavailable.',
    ],
    use_cases: [
      {
        title: 'Embedding Third-Party Tools',
        description:
          'Embed Workday self-service panels, ServiceNow forms, or other enterprise tool interfaces directly into Staffbase pages without a full integration.',
        icon: 'code',
      },
      {
        title: 'Injecting External Widgets',
        description:
          'Place external HTML widgets into specific zones on your Staffbase pages using CSS selector targeting for precise placement.',
        icon: 'code',
      },
      {
        title: 'Rapid Integration Prototyping',
        description:
          'Quickly test how external content looks and behaves within Staffbase before investing in a full custom plugin build.',
        icon: 'code',
      },
    ],
    prerequisites: [
      {
        title: 'Fork the Repository',
        description:
          'Fork the DOM Embedder repository on GitHub to your own account so you can customize and deploy it independently.',
      },
      {
        title: 'Review the README',
        description:
          'Read through the repository README for detailed setup instructions, configuration options, and known limitations.',
      },
      {
        title: 'Configure for Your Environment',
        description:
          'Update the configuration files with your Staffbase instance details, target selectors, and any custom styling overrides.',
      },
      {
        title: 'Deploy',
        description:
          'Build and deploy the bundle to your hosting environment following the deployment guide in the repository.',
      },
      {
        title: 'Reference Bundle URL in Staffbase Studio',
        description:
          'Add the deployed bundle URL as a custom widget reference in Staffbase Studio to start using it on your pages.',
      },
    ],
    config_options: [],
    screenshots: [
      {
        label: 'Dashboard',
        alt: 'DOM Embedder Dashboard view',
      },
      {
        label: 'Configuration',
        alt: 'DOM Embedder Configuration view',
      },
      {
        label: 'Result',
        alt: 'DOM Embedder Result view',
      },
    ],
    has_live_demo: true,
    live_demo_url: 'https://cckelvin.staffbase.com/',
    github_url: '#',
    owner: 'SE',
    support_contact: '',
    icon: 'code',
  },

  {
    id: 'config-lang-js',
    title: 'Config Lang JS',
    short_description:
      'A lightweight declarative configuration language layer for Staffbase custom widgets, enabling non-developers to configure widget behavior through structured JSON-like syntax.',
    category: 'Widget',
    tier: 'Experimental',
    overview: [
      'Config Lang JS provides a declarative configuration layer that sits between your Staffbase widget code and its runtime behavior. Instead of requiring code changes to adjust widget settings, it allows content editors and non-technical administrators to control widget logic through a structured, JSON-like syntax.',
      'This standardizes configuration across multi-brand Staffbase instances and reduces deployment risk when adjusting widget behavior in production.',
      'The library parses configuration objects, validates them against a schema, and applies them to widget initialization logic at runtime.',
    ],
    use_cases: [
      {
        title: 'Content Editor Control',
        description:
          'Enable content editors to control widget logic like display rules, filtering, and formatting without needing engineering involvement.',
        icon: 'settings',
      },
      {
        title: 'Multi-Brand Standardization',
        description:
          'Standardize widget configuration across multiple brands or regions within a single Staffbase instance for consistency.',
        icon: 'settings',
      },
      {
        title: 'Safe Production Updates',
        description:
          'Reduce deployment risk by allowing configuration changes without code modifications, making production adjustments safer and faster.',
        icon: 'shield-check',
      },
    ],
    prerequisites: [
      {
        title: 'Fork the Repository',
        description:
          'Fork the Config Lang JS repository on GitHub to your own account so you can customize and deploy it independently.',
      },
      {
        title: 'Review the README',
        description:
          'Read through the repository README for detailed setup instructions, configuration schema documentation, and usage examples.',
      },
      {
        title: 'Configure for Your Environment',
        description:
          'Update the configuration files with your Staffbase instance details, widget schemas, and any custom validation rules.',
      },
      {
        title: 'Deploy',
        description:
          'Build and deploy the bundle to your hosting environment following the deployment guide in the repository.',
      },
      {
        title: 'Reference Bundle URL in Staffbase Studio',
        description:
          'Add the deployed bundle URL as a custom widget reference in Staffbase Studio to start using it on your pages.',
      },
    ],
    config_options: [],
    screenshots: [
      {
        label: 'Editor',
        alt: 'Config Lang Editor view',
      },
      {
        label: 'Schema',
        alt: 'Config Lang Schema view',
      },
      {
        label: 'Output',
        alt: 'Config Lang Output view',
      },
    ],
    has_live_demo: true,
    live_demo_url: 'https://cckelvin.staffbase.com/',
    github_url: '#',
    owner: 'SE',
    support_contact: '',
    icon: 'settings',
  },

  {
    id: 'textflow-js',
    title: 'Textflow JS',
    short_description:
      'Advanced text rendering and content flow control for Staffbase custom widgets, supporting dynamic content injection, rich text formatting, and configurable truncation/expansion.',
    category: 'Widget',
    tier: 'Experimental',
    overview: [
      'Textflow JS is an advanced text rendering library designed for Staffbase custom widgets. It handles dynamic content injection from APIs, rich text formatting, and configurable truncation/expansion behavior (show more/less).',
      'The library supports personalized text based on user profile attributes, making it possible to display different content to different user groups.',
      'It also includes utilities for text measurement, line clamping, and responsive text sizing that adapts to the widget\'s container dimensions.',
    ],
    use_cases: [
      {
        title: 'API-Sourced Rich Text',
        description:
          'Render rich text content fetched from external APIs inside custom widgets with proper formatting, links, and media embeds.',
        icon: 'text',
      },
      {
        title: 'Expandable Content Blocks',
        description:
          'Build "show more / show less" content sections that truncate long text and let users expand to read the full content.',
        icon: 'text',
      },
      {
        title: 'Personalized Text',
        description:
          'Inject different text content based on user profile attributes like department, location, or role for targeted messaging.',
        icon: 'text',
      },
    ],
    prerequisites: [
      {
        title: 'Fork the Repository',
        description:
          'Fork the Textflow JS repository on GitHub to your own account so you can customize and deploy it independently.',
      },
      {
        title: 'Review the README',
        description:
          'Read through the repository README for detailed setup instructions, API documentation, and rendering examples.',
      },
      {
        title: 'Configure for Your Environment',
        description:
          'Update the configuration files with your Staffbase instance details, API endpoints, and text rendering preferences.',
      },
      {
        title: 'Deploy',
        description:
          'Build and deploy the bundle to your hosting environment following the deployment guide in the repository.',
      },
      {
        title: 'Reference Bundle URL in Staffbase Studio',
        description:
          'Add the deployed bundle URL as a custom widget reference in Staffbase Studio to start using it on your pages.',
      },
    ],
    config_options: [],
    screenshots: [
      {
        label: 'Rich Text',
        alt: 'Textflow Rich Text view',
      },
      {
        label: 'Expand View',
        alt: 'Textflow Expand View',
      },
      {
        label: 'Personalized',
        alt: 'Textflow Personalized view',
      },
    ],
    has_live_demo: true,
    live_demo_url: 'https://cckelvin.staffbase.com/',
    github_url: '#',
    owner: 'SE',
    support_contact: '',
    icon: 'text',
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
