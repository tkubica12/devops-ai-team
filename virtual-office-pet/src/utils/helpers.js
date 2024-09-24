import { THEME_MODES } from './themeConstants';

export const getIconForPetType = (type) => {
  const iconMap = {
    Dog: 'Dog',
    Cat: 'Cat',
  };
  return iconMap[type] || null;
};

export const validateAction = (action) => {
  const validActions = ['Fed', 'Talked', 'Adopted'];
  if (!validActions.includes(action)) {
    throw new Error(`Invalid action: ${action}`);
  }
};

export const useThemeStyles = () => {
  const theme = THEME_MODES.LIGHT; // This would typically come from context or state
  const themeClass = theme === THEME_MODES.DARK ? 'dark-theme' : 'light-theme';
  return {
    themeClass,
  };
};
