import React from 'react';

type CardProps = React.HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden ${className || ''}`}
      {...props}
    />
  );
}

type CardHeaderProps = React.HTMLAttributes<HTMLDivElement>;

export function CardHeader({ className, ...props }: CardHeaderProps) {
  return (
    <div
      className={`px-6 py-4 border-b border-gray-100 ${className || ''}`}
      {...props}
    />
  );
}

type CardTitleProps = React.HTMLAttributes<HTMLHeadingElement>;

export function CardTitle({ className, children, ...props }: CardTitleProps) {
  return (
    <h3
      className={`text-lg font-medium text-gray-900 ${className || ''}`}
      {...props}
    >
      {children}
    </h3>
  );
}

type CardDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;

export function CardDescription({ className, ...props }: CardDescriptionProps) {
  return (
    <p
      className={`text-sm text-gray-500 mt-1 ${className || ''}`}
      {...props}
    />
  );
}

type CardContentProps = React.HTMLAttributes<HTMLDivElement>;

export function CardContent({ className, ...props }: CardContentProps) {
  return (
    <div
      className={`px-6 py-4 ${className || ''}`}
      {...props}
    />
  );
}

type CardFooterProps = React.HTMLAttributes<HTMLDivElement>;

export function CardFooter({ className, ...props }: CardFooterProps) {
  return (
    <div
      className={`px-6 py-4 bg-gray-50 border-t border-gray-100 ${className || ''}`}
      {...props}
    />
  );
}