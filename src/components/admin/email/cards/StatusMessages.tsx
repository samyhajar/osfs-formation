'use client';

interface StatusMessagesProps {
  successMessage: string;
  errorMessage: string;
}

export default function StatusMessages({ successMessage, errorMessage }: StatusMessagesProps) {
  if (!successMessage && !errorMessage) return null;

  return (
    <div className="mt-4">
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-800 rounded-md p-4">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4">
          {errorMessage}
        </div>
      )}
    </div>
  );
}