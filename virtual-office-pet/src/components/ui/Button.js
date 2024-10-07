export const Button = ({ children, onClick, className = '' }) => {
  const safeClassName = className.replace(/[^a-zA-Z0-9-_\s]/g, ''); // Sanitize className\n  return (
    <button
      onClick={onClick}
      className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${safeClassName}`}
    >
      {children}
    </button>
  );
};