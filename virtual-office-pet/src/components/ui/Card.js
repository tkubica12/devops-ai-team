import React from 'react';
import classNames from 'classnames';

const defaultCardClass = 'bg-white shadow-md rounded-lg p-4';
const defaultHeaderClass = 'mb-4';
const defaultTitleClass = 'text-xl font-bold';

export const Card = ({ children, className }) => (
  <div className={classNames(defaultCardClass, className)}>{children}</div>
);

export const CardHeader = ({ children }) => <div className={defaultHeaderClass}>{children}</div>;
export const CardTitle = ({ children }) => <h2 className={defaultTitleClass}>{children}</h2>;
export const CardContent = ({ children }) => <div>{children}</div>;