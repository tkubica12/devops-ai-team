import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    const anonymize = (metric) => {
      metric.entries.forEach((entry) => delete entry.name);
      onPerfEntry(metric);
    };

    getCLS(anonymize);
    getFID(anonymize);
    getFCP(anonymize);
    getLCP(anonymize);
    getTTFB(anonymize);
  }
};

export default reportWebVitals;
