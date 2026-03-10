import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  path?: string;
}

const BASE_URL = 'https://formula1-hub.vercel.app';
const DEFAULT_TITLE = 'F1Pulse — Real-Time Formula 1 Data Dashboard';
const DEFAULT_DESC = 'Live driver standings, race schedule, results, constructor standings and live timing for Formula 1.';

const SEO = ({ title, description, path = '' }: SEOProps) => {
  const fullTitle = title ? `${title} | F1Pulse` : DEFAULT_TITLE;
  const desc = description ?? DEFAULT_DESC;
  const url = `${BASE_URL}${path}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
    </Helmet>
  );
};

export default SEO;
