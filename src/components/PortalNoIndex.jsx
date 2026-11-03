import { useEffect } from 'react';

/**
 * Drop this component anywhere inside a portal page to prevent indexing.
 * It injects <meta name="robots" content="noindex, nofollow"> for the duration
 * of the page mount and removes it on unmount.
 */
export default function PortalNoIndex() {
  useEffect(() => {
    let tag = document.querySelector('meta[name="robots"][data-portal]');
    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute('name', 'robots');
      tag.setAttribute('data-portal', 'true');
      document.head.appendChild(tag);
    }
    tag.setAttribute('content', 'noindex, nofollow');
    return () => {
      if (tag && tag.parentNode) tag.parentNode.removeChild(tag);
    };
  }, []);
  return null;
}