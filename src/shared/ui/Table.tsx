/**
 * Accessible Table component with sorting and pagination
 */

import { ReactNode } from 'react';
import { cn } from '../lib/utils';

interface TableProps {
  children: ReactNode;
  className?: string;
}

interface TableHeaderProps {
  children: ReactNode;
  className?: string;
}

interface TableBodyProps {
  children: ReactNode;
  className?: string;
}

interface TableRowProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

interface TableHeadProps {
  children: ReactNode;
  className?: string;
  sortable?: boolean;
  sorted?: 'asc' | 'desc' | null;
  onSort?: () => void;
}

interface TableCellProps {
  children: ReactNode;
  className?: string;
}

export function Table({ children, className }: TableProps) {
  return (
    <div className="overflow-x-auto">
      <table className={cn(
        'w-full border-collapse border-spacing-0 text-left text-sm',
        className
      )}>
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ children, className }: TableHeaderProps) {
  return (
    <thead className={cn(
      'bg-gray-50 border-b border-gray-200',
      className
    )}>
      {children}
    </thead>
  );
}

export function TableBody({ children, className }: TableBodyProps) {
  return (
    <tbody className={cn('divide-y divide-gray-200', className)}>
      {children}
    </tbody>
  );
}

export function TableRow({ children, className, onClick }: TableRowProps) {
  return (
    <tr 
      className={cn(
        'hover:bg-gray-50 transition-colors',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      } : undefined}
    >
      {children}
    </tr>
  );
}

export function TableHead({ 
  children, 
  className, 
  sortable, 
  sorted, 
  onSort 
}: TableHeadProps) {
  return (
    <th 
      className={cn(
        'px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
        sortable && 'cursor-pointer select-none hover:bg-gray-100',
        className
      )}
      onClick={sortable ? onSort : undefined}
      role={sortable ? 'button' : undefined}
      tabIndex={sortable ? 0 : undefined}
      onKeyDown={sortable && onSort ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSort();
        }
      } : undefined}
    >
      <div className="flex items-center gap-1">
        {children}
        {sortable && (
          <div className="flex flex-col">
            <svg 
              className={cn(
                'h-3 w-3 transition-colors',
                sorted === 'asc' ? 'text-primary-500' : 'text-gray-400'
              )}
              fill="currentColor" 
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
        )}
      </div>
    </th>
  );
}

export function TableCell({ children, className }: TableCellProps) {
  return (
    <td className={cn('px-4 py-3 text-gray-900', className)}>
      {children}
    </td>
  );
}