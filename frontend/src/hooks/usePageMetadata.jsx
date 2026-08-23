import { useEffect } from 'react';

function usePageMetadata({ title, description, image, url, schema }) {
  useEffect(() => {
    const previousTitle = document.title;

    const setMetaTag = (selector, attributeName, attributeValue, content) => {
      if (!content) return;
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attributeName, attributeValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    const setCanonicalLink = (href) => {
      if (!href) return;
      let element = document.querySelector('link[rel="canonical"]');
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', 'canonical');
        document.head.appendChild(element);
      }
      element.setAttribute('href', href);
    };

    if (title) document.title = title;
    if (description) setMetaTag('meta[name="description"]', 'name', 'description', description);

    // Open Graph Metadata
    if (title) setMetaTag('meta[property="og:title"]', 'property', 'og:title', title);
    if (description) setMetaTag('meta[property="og:description"]', 'property', 'og:description', description);
    if (image) setMetaTag('meta[property="og:image"]', 'property', 'og:image', image);
    if (url) {
      setMetaTag('meta[property="og:url"]', 'property', 'og:url', url);
      setCanonicalLink(url);
    }
    setMetaTag('meta[property="og:type"]', 'property', 'og:type', 'website');

    // Twitter Card Metadata
    setMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', image ? 'summary_large_image' : 'summary');
    if (title) setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', title);
    if (description) setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    if (image) setMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', image);

    // Schema.org Structured Data
    let scriptTag = null;
    if (schema) {
      scriptTag = document.createElement('script');
      scriptTag.type = 'application/ld+json';
      scriptTag.text = JSON.stringify(schema);
      document.head.appendChild(scriptTag);
    }

    return () => {
      document.title = previousTitle;
      if (scriptTag && scriptTag.parentNode) {
        scriptTag.parentNode.removeChild(scriptTag);
      }
    };
  }, [title, description, image, url, schema]);
}

export default usePageMetadata;
