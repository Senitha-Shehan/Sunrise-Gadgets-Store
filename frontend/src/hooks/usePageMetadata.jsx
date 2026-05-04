import { useEffect } from 'react';

function usePageMetadata({ title, description }) {
  useEffect(() => {
    const previousTitle = document.title;
    const metaDescription = document.querySelector('meta[name="description"]');
    const previousDescription = metaDescription?.getAttribute('content') || '';

    if (title) {
      document.title = title;
    }

    if (description) {
      if (metaDescription) {
        metaDescription.setAttribute('content', description);
      } else {
        const descriptionTag = document.createElement('meta');
        descriptionTag.name = 'description';
        descriptionTag.content = description;
        document.head.appendChild(descriptionTag);
      }
    }

    return () => {
      document.title = previousTitle;
      if (metaDescription) {
        metaDescription.setAttribute('content', previousDescription);
      }
    };
  }, [title, description]);
}

export default usePageMetadata;
