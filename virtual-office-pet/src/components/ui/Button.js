export const Button = ({ children, onClick, className }) => (
  <button
    onClick={(e) => {
      e.preventDefault();
      onClick();
    }}
    className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${className}`}
    style={{ padding: '10px 20px', borderRadius: '5px' }} 
  >
    {children}
  </button>
);