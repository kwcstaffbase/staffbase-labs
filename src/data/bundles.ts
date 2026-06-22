/**
 * Bundle URL and custom element name for each supported solution.
 * Keyed by solution ID (matches catalog.ts).
 */
export interface WidgetBundle {
  bundleUrl: string;
  elementName: string;
}

export const WIDGET_BUNDLES: Record<string, WidgetBundle> = {
  'celebration-widget': {
    elementName: 'celebration-widget',
    bundleUrl: 'https://cc-scripts.staffbase.com/temp-celebration-widget-profile-api/sb-cc-tech.celebration-widget-profile-api.js',
  },
  'clocks-widget': {
    elementName: 'clocks-widget',
    bundleUrl: 'https://cc-scripts.staffbase.com/clocks-widget/sb-custom.clocks-widget.js',
  },
  'countdown-widget': {
    elementName: 'countdown-widget',
    bundleUrl: 'https://cc-scripts.staffbase.com/countdown-widget/staffbase.countdown-widget.js',
  },
  'print-button-widget': {
    elementName: 'print-button-widget',
    bundleUrl: 'https://cc-scripts.staffbase.com/print-button-widget/sb-custom.print-button-widget.js',
  },
  'scrolling-banner': {
    elementName: 'scrolling-banner',
    bundleUrl: 'https://cc-scripts.staffbase.com/scrolling-banner/sb-custom.scrolling-banner.js',
  },
  'text-on-image': {
    elementName: 'text-on-image',
    bundleUrl: 'https://cc-scripts.staffbase.com/text-on-image/staffbase.text-on-image.js',
  },
  'qualtrics-insights': {
    elementName: 'qualtrics-insights',
    bundleUrl: 'https://cc-scripts.staffbase.com/qualtrics-insights-iss/sb-custom.qualtrics-insights.js',
  },
  'weather-widget': {
    elementName: 'royston-weatherwidget',
    bundleUrl: 'https://cc-scripts.staffbase.com/royston-weatherwidget/staffbase.royston-weatherwidget.js',
  },
  'image-comparison-slider': {
    elementName: 'image-comparison-slider',
    bundleUrl: 'https://cc-scripts.staffbase.com/image-comparison-slider/staffbase.image-comparison-slider.js',
  },
  'new-starter-widget': {
    elementName: 'new-joiners-widget',
    bundleUrl: 'https://cc-scripts.staffbase.com/new-joiners-widget/cctech.new-joiners-widget.js',
  },
  'analytics-email-open-viewer': {
    elementName: 'analytics-email-open-viewer',
    bundleUrl: 'https://terencezeng1.github.io/analytics-email-open-viewer/dist/staffbase.analytics-email-open-viewer.js',
  },
  'company-stock-widget': {
    elementName: 'stock-price',
    bundleUrl: 'https://cc-scripts.staffbase.com/stock-price/sb-cctech.stock-price.js',
  },
  'digital-business-card': {
    // elementName inferred from the bundle filename — confirm against the widget source.
    elementName: 'digital-business-card',
    bundleUrl: 'https://cc-scripts.staffbase.com/digital-business-card/sb-custom.digital-business-card.js',
  },
  'social-feed-taggbox': {
    // elementName inferred from the bundle filename — confirm against the widget source.
    elementName: 'social-feed-taggbox',
    bundleUrl: 'https://cc-scripts.staffbase.com/widgets/sb-cctech.social-feed-taggbox.min.js',
  },
};
