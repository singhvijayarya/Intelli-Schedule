import React from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  hover?: boolean;
}

const sizeClasses = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  header,
  footer,
  className,
  size = 'md',
  hover = false,
}) => {
  return (
    <div
      className={cn(
        'glass-card animate-fade-in',
        sizeClasses[size],
        hover && 'transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:border-primary/20',
        className
      )}
    >
      {header && (
        <div className="mb-4 pb-4 border-b border-border/30">
          {header}
        </div>
      )}
      {children}
      {footer && (
        <div className="mt-4 pt-4 border-t border-border/30">
          {footer}
        </div>
      )}
    </div>
  );
};
