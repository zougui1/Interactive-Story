export const ToastMessage = ({ label, details }: ToastMessageProps) => {
  return (
    <div className="flex flex-col">
      <span className="text-lg">{label}</span>
      {details && <span className="text-sm text-gray-200">{details}</span>}
    </div>
  );
};

export interface ToastMessageProps {
  label: string;
  details?: string;
}
