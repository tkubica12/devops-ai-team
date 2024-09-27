const reportWebVitals = onPerfEntry => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      const anonymize = (metric) => {
        metric.entries.forEach(entry => delete entry.name); // Example anonymization
        onPerfEntry(metric);
      };
      getCLS(anonymize);
      getFID(anonymize);
      getFCP(anonymize);
      getLCP(anonymize);
      getTTFB(anonymize);
    });
  }
};

export default reportWebVitals;
