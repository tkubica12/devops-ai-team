const log = {
  debug: (message, ...optionalParams) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(message, ...optionalParams);
    }
  },
  info: (message, ...optionalParams) => {
    console.info(message, ...optionalParams);
  },
  error: (message, ...optionalParams) => {
    console.error(message, ...optionalParams);
  },
};

export default log;
