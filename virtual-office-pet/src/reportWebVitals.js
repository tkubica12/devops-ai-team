const reportWebVitals = onPerfEntry => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      const anonymizeData = (metric) => {
        return { ...metric, path: window.location.pathname };
      };
      getCLS((m) => onPerfEntry(anonymizeData(m)));
      getFID((m) => onPerfEntry(anonymizeData(m)));
      getFCP((m) => onPerfEntry(anonymizeData(m)));
      getLCP((m) => onPerfEntry(anonymizeData(m)));
      getTTFB((m) => onPerfEntry(anonymizeData(m)));
    });
  }
};

export default reportWebVitals;
