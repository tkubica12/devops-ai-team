const sanitizeInput = (input) => {
  // Basic sanitization
  return input.replace(/[<>"'/]/g, "");
};

export default sanitizeInput;
