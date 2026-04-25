import React from 'react';

export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => (
    <div className={`animate-pulse bg-gray-200 dark:bg-slate-800 rounded-3xl ${className}`} />
);

export const SkeletonText: React.FC<{ className?: string }> = ({ className = '' }) => (
    <div className={`animate-pulse bg-gray-200 dark:bg-slate-800 rounded-md ${className}`} />
);

export const SkeletonRow: React.FC = () => (
    <tr>
        <td className="px-6 py-4"><div className="animate-pulse bg-gray-200 dark:bg-slate-800 rounded-full h-6 w-20" /></td>
        <td className="px-6 py-4"><div className="animate-pulse bg-gray-200 dark:bg-slate-800 rounded h-5 w-32" /></td>
        <td className="px-6 py-4"><div className="animate-pulse bg-gray-200 dark:bg-slate-800 rounded h-5 w-16" /></td>
        <td className="px-6 py-4"><div className="animate-pulse bg-gray-200 dark:bg-slate-800 rounded h-5 w-24" /></td>
        <td className="px-6 py-4 text-right"><div className="animate-pulse bg-gray-200 dark:bg-slate-800 rounded h-5 w-12 ml-auto" /></td>
    </tr>
);

export const DashboardSkeleton: React.FC = () => (
    <div className="space-y-8">
        <div className="flex justify-between items-center">
            <div className="animate-pulse bg-gray-200 dark:bg-slate-800 rounded h-9 w-56" />
            <div className="animate-pulse bg-gray-200 dark:bg-slate-800 rounded-lg h-10 w-44" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
                <SkeletonCard key={i} className="h-32" />
            ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <SkeletonCard className="h-72" />
            <SkeletonCard className="h-72" />
        </div>
    </div>
);
