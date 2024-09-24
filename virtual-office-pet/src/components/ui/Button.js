import sanitizeHtml from 'sanitize-html';

export const Button = ({ children, onClick, className }) => {
  const safeChildren = Array.isArray(children) 
    ? children.map(child => (typeof child === 'string' ? sanitizeHtml(child) : child)) 
    : typeof children === 'string' ? sanitizeHtml(children) : children;

  return (
    <button
      onClick={onClick}
      className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${className}`}
      style={{ padding: '10px 20px', borderRadius: '5px' }} 
    >
      {safeChildren}
    </button>
  );
};