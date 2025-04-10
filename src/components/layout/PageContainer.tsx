
import { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
  title: string;
  description?: string;
}

export function PageContainer({ children, title, description }: PageContainerProps) {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-8xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{title}</h1>
        {description && (
          <p className="mt-2 text-sm text-gray-600">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}
