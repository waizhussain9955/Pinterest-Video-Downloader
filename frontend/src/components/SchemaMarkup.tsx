import React from 'react';
import { Helmet } from 'react-helmet-async';

interface WebSiteSchemaProps {
  type: 'website';
  name: string;
  url: string;
  description: string;
}

interface ArticleSchemaProps {
  type: 'article';
  title: string;
  description: string;
  author: string;
  publishedDate: string;
  modifiedDate?: string;
  url: string;
  imageUrl?: string;
}

interface WebApplicationSchemaProps {
  type: 'webapplication';
  name: string;
  url: string;
  description: string;
  applicationCategory: string;
  operatingSystem: string;
}

type SchemaProps = WebSiteSchemaProps | ArticleSchemaProps | WebApplicationSchemaProps;

export const SchemaMarkup: React.FC<SchemaProps> = (props) => {
  let schemaData: any = {
    '@context': 'https://schema.org',
  };

  if (props.type === 'website') {
    schemaData = {
      ...schemaData,
      '@type': 'WebSite',
      name: props.name,
      url: props.url,
      description: props.description,
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${props.url}?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    };
  } else if (props.type === 'article') {
    schemaData = {
      ...schemaData,
      '@type': 'Article',
      headline: props.title,
      description: props.description,
      author: {
        '@type': 'Person',
        name: props.author,
      },
      datePublished: props.publishedDate,
      dateModified: props.modifiedDate || props.publishedDate,
      url: props.url,
      ...(props.imageUrl && {
        image: {
          '@type': 'ImageObject',
          url: props.imageUrl,
        },
      }),
    };
  } else if (props.type === 'webapplication') {
    schemaData = {
      ...schemaData,
      '@type': 'WebApplication',
      name: props.name,
      url: props.url,
      description: props.description,
      applicationCategory: props.applicationCategory,
      operatingSystem: props.operatingSystem,
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
    };
  }

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
    </Helmet>
  );
};

// Pre-configured Schema for common pages
export const HomePageSchema: React.FC = () => (
  <SchemaMarkup
    type="webapplication"
    name="Pinterest Video Downloader"
    url={window.location.origin}
    description="Download Pinterest videos easily and legally. Fast, free, and respects copyright."
    applicationCategory="MultimediaApplication"
    operatingSystem="Web Browser"
  />
);

export const BlogPageSchema: React.FC = () => (
  <SchemaMarkup
    type="website"
    name="Pinterest Video Downloader Blog"
    url={`${window.location.origin}/blog`}
    description="Learn about Pinterest video downloading, best practices, and technical guides."
  />
);
