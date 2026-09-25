/**
 * Site configuration
 */
export const siteConfig = {
  name: 'TPSH PDF',
  description: 'TPSH PDF (pdf.tpsh.cc) - 免费高效的在线PDF工具箱。基于WebAssembly纯浏览器本地运行，支持PDF合并、拆分、无损压缩、格式转换、水印签名等67+款专业工具。100%本地处理，文件无需上传服务器，绝不泄露隐私。',
  url: 'https://pdf.tpsh.cc',
  ogImage: '/images/og-image.png',
  links: {
    github: 'https://github.com',
    twitter: 'https://twitter.com',
  },
  creator: 'TPSH Team',
  keywords: [
    'TPSH PDF',
    'PDF tools',
    'free PDF editor',
    'merge PDF online',
    'split PDF',
    'compress PDF free',
    'PDF to Word',
    'convert PDF',
    'browser-based PDF',
    'private PDF processing',
    '在线PDF转换器',
    'PDF在线合并',
    'PDF极速压缩',
    '离线PDF处理',
    '免上传PDF工具',
    '本地安全PDF编辑',
  ],
  // SEO-related settings
  seo: {
    titleTemplate: '%s | TPSH PDF 免费在线工具箱',
    defaultTitle: 'TPSH PDF - 免费在线PDF转换与编辑神器 | 100%本地安全不上传',
    twitterHandle: '@tpsh_pdf',
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
    { title: 'About', href: '/about' },
    { title: 'FAQ', href: '/faq' },
  ],
  footerNav: [
    { title: 'Privacy', href: '/privacy' },
    { title: 'Contact', href: '/contact' },
  ],
};
