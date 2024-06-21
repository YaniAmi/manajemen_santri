/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // sub-path routing untuk multibahasa dari https://nextjs.org/docs/pages/building-your-application/routing/internationalization
  i18n: {
    locales: ["en-US", "fr", "nl-NL", "kr", "id-ID"],
    defaultLocale: "en-US",
  },
};

module.exports = nextConfig;
