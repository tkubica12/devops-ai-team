import styles from './Button.module.css';

export const Button = ({ children, onClick, className }) => (
  <button
    onClick={onClick}
    className={`${styles.ButtonLocal} ${className}`}
  >
    {children}
  </button>
);