const sanitizeInput = (input) => {
  if (!input) return '';
  // Basic sanitization - removing potentially harmful characters
  return input.replace(/[<>"'/]/g, '');
};

export default sanitizeInput;
