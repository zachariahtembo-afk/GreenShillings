import type { Translations } from './i18n/translations/en';

// Translated navigation helpers
export function getNavLinks(t: Translations) {
  return [
    { href: '/', label: t.nav.home },
    { href: '/work', label: t.nav.advocacy },
    { href: '/projects', label: t.nav.projects },
    { href: '/integrity', label: t.nav.integrity },
    { href: '/insights', label: t.nav.insights },
    { href: '/partners', label: t.nav.partners },
    { href: '/donate', label: t.nav.donate },
  ];
}

export function getFooterLinks(t: Translations) {
  return {
    main: [
      { href: '/', label: t.nav.home },
      { href: '/work', label: t.nav.advocacy },
      { href: '/projects', label: t.nav.projects },
      { href: '/integrity', label: t.nav.integrity },
      { href: '/insights', label: t.nav.insights },
      { href: '/partners', label: t.nav.partners },
      { href: '/contact', label: t.nav.contact },
    ],
    legal: [{ href: '/portal/login', label: t.nav.partnerPortal }],
  };
}

// Static versions for non-translated contexts (portal, internal, etc.)
export const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/work', label: 'Advocacy' },
  { href: '/projects', label: 'Projects' },
  { href: '/integrity', label: 'Integrity' },
  { href: '/insights', label: 'Insights' },
  { href: '/partners', label: 'Partners' },
  { href: '/donate', label: 'Donate' },
];

export const ctaLinks = {
  donate: { href: '/donate', label: 'Donate' },
  contact: { href: '/contact', label: 'Contact' },
  partners: { href: '/partners', label: 'Partners' },
  portal: { href: '/portal/login', label: 'Partner Portal' },
};

export const footerLinks = {
  main: [
    { href: '/', label: 'Home' },
    { href: '/work', label: 'Advocacy' },
    { href: '/projects', label: 'Projects' },
    { href: '/integrity', label: 'Integrity' },
    { href: '/insights', label: 'Insights' },
    { href: '/partners', label: 'Partners' },
    { href: '/contact', label: 'Contact' },
  ],
  legal: [{ href: '/portal/login', label: 'Partner Portal' }],
};
