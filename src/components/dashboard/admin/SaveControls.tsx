import { Button } from '@/components/ui/Button';

interface SaveControlsProps {
  onSave: () => void;
  saving: boolean;
  hasUnsavedChanges: boolean;
  saveMessage: { type: 'success' | 'error'; text: string } | null;
}

export default function SaveControls({
  onSave,
  saving,
  hasUnsavedChanges,
  saveMessage
}: SaveControlsProps) {
  return (
    <div className="mb-6 flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
      <Button
        onClick={() => void onSave()}
        disabled={saving || !hasUnsavedChanges}
        className={`${
          saving ? 'bg-blue-400' : hasUnsavedChanges ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400'
        } text-white px-6 py-2 rounded-lg font-medium transition-colors`}
      >
        {saving ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            Saving...
          </>
        ) : (
          'Save Selection'
        )}
      </Button>

      {hasUnsavedChanges && !saving && (
        <span className="text-amber-600 text-sm font-medium">
          You have unsaved changes
        </span>
      )}

      {saveMessage && (
        <div className={`text-sm font-medium ${
          saveMessage.type === 'success' ? 'text-green-600' : 'text-red-600'
        }`}>
          {saveMessage.text}
        </div>
      )}
    </div>
  );
}