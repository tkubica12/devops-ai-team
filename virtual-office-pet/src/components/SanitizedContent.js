import React from 'react';
import DOMPurify from 'dompurify';

const SanitizedContent = ({ htmlContent }) => {
  const sanitizedContent = DOMPurify.sanitize(htmlContent);

  return <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />;
};

export default SanitizedContent;
