import Image from 'next/image';

interface ImageUploadSectionProps {
  imageUrl?: string;
  uploading: boolean;
  onUpload: (file: File) => void;
  onDelete: () => void;
  position: string;
  onPositionChange: (value: string) => void;
  columnName: string;
}

export function ImageUploadSection({
  imageUrl,
  uploading,
  onUpload,
  onDelete,
  position,
  onPositionChange,
  columnName
}: ImageUploadSectionProps) {
  return (
    <div className="space-y-4">
      <div>
        <span className="block text-sm font-medium text-gray-700 mb-2">
          {columnName} Column Image
        </span>
        {imageUrl ? (
          <div className="space-y-3">
            <div className="relative inline-block">
              <Image
                src={imageUrl}
                alt={`${columnName} column image`}
                width={300}
                height={200}
                className="rounded-lg object-cover"
              />
              <button
                type="button"
                onClick={onDelete}
                className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 transition"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        ) : (
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onUpload(file);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-accent-primary focus:border-accent-primary"
              disabled={uploading}
            />
            {uploading && (
              <p className="mt-1 text-sm text-blue-600">Uploading...</p>
            )}
          </div>
        )}
      </div>

      <div>
        <label htmlFor={`${columnName.toLowerCase()}_column_image_position`} className="block text-sm font-medium text-gray-700 mb-1">
          Image Position
        </label>
        <select
          id={`${columnName.toLowerCase()}_column_image_position`}
          value={position}
          onChange={(e) => onPositionChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-accent-primary focus:border-accent-primary"
        >
          <option value="above">Above Text</option>
          <option value="below">Below Text</option>
        </select>
      </div>
    </div>
  );
}