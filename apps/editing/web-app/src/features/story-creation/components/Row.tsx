
export const Row = ({ children }: RowProps) => {
  return (
    <div className="Row flex max-w-full space-x-4 overflow-x-auto pt-6 pb-10">
      {children}
    </div>
  );
}

export interface RowProps {
  children: React.ReactNode;
  className?: string;
}
