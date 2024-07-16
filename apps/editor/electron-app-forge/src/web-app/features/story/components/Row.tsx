
export const Row = ({ children }: RowProps) => {
  return (
    <div className="flex flex-wrap justify-center gap-12">
      {children}
    </div>
  );
}

export interface RowProps {
  children: React.ReactNode;
  className?: string;
}
