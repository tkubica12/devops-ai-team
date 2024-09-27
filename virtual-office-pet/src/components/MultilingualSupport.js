import React from 'react';
import { useTranslation } from 'react-i18next';

const MultilingualSupport = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="multilingual-support">
      <h2>{t('welcome_message')}</h2>
      <button onClick={() => changeLanguage('en')}>English</button>
      <button onClick={() => changeLanguage('fr')}>Français</button>
      <button onClick={() => changeLanguage('es')}>Español</button>
    </div>
  );
};

export default MultilingualSupport;
