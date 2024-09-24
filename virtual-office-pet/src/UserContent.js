import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const UserContent = ({ userId }) => {
  const [content, setContent] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch(`/api/user/${userId}/content`);
        if (!response.ok) {
          throw new Error('Failed to fetch content');
        }
        const data = await response.json();
        setContent(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchContent();
  }, [userId]);

  if (error) return <div>Error: {error}</div>;
  if (!content) return <div>Loading...</div>;

  return <div>{content}</div>;
};

UserContent.propTypes = {
  userId: PropTypes.string.isRequired,
};

export default UserContent;
