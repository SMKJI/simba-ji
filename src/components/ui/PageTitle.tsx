
import React from 'react';

interface PageTitleProps {
  title: string;
  description?: string;
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
}

const PageTitle = ({ 
  title, 
  description, 
  className = '',
  titleClassName = '',
  descriptionClassName = ''
}: PageTitleProps) => {
  return (
    <div className={`mb-8 ${className}`}>
      <h1 className={`text-3xl font-bold text-gray-900 mb-2 ${titleClassName}`}>
        {title}
      </h1>
      {description && (
        <p className={`text-gray-600 ${descriptionClassName}`}>
          {description}
        </p>
      )}
    </div>
  );
};

export default PageTitle;
