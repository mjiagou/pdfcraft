/**
 * Site configuration
 */
export const siteConfig = {
  name: '免费在线PDF工具 - PDF转换、编辑、压缩一站式服务 | pdf.tpsh.cc',
  description: 'pdf.tpsh.cc提供完全免费的在线PDF工具，支持PDF转换、合并、拆分、压缩、加密解密等多种功能。无需安装软件，打开网页即可使用，安全便捷的PDF处理平台。',
  url: 'https://pdf.tpsh.cc',
  ogImage: '/images/og-image.png',
  links: {
    github: 'https://github.com/mjiagou/pdfcraft',
    twitter: '',
  },
  creator: 'PDFCraft Team',
  keywords: [
    'PDF tools',
    'PDF editor',
    'merge PDF',
    'split PDF',
    'compress PDF',
    'convert PDF',
    'free PDF tools',
    'online PDF editor',
    'browser-based PDF',
    'private PDF processing',
  ],
  // SEO-related settings
  seo: {
    titleTemplate: '%s | 免费在线PDF工具',
    defaultTitle: '一个免费的在线PDF工具 - Professional PDF Tools',
    twitterHandle: '@pdfcraft',
    locale: 'zh_CN',
  },
};

/**
 * Navigation configuration
 */
export const navConfig = {
  mainNav: [
    { title: 'Home', href: '/' },
    { title: 'Tools', href: '/tools' },
    { title: 'Blog', href: '/blog' },
    { title: 'About', href: '/about' },
    { title: 'FAQ', href: '/faq' },
  ],
  footerNav: [
    { title: 'Privacy', href: '/privacy' },
    { title: 'Terms', href: '/terms' },
    { title: 'Contact', href: '/contact' },
  ],
};
