'use client';

import { useTranslations } from 'next-intl';

type WorkflowStepsProps = {
  documentsConfirmed: boolean;
  selectedUserIds: string[];
  selectedDocumentIds: string[];
};

export const WorkflowSteps = ({
  documentsConfirmed,
  selectedUserIds,
  selectedDocumentIds,
}: WorkflowStepsProps) => {
  const t = useTranslations('EmailPage');

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 flex justify-center">
      <div className="flex items-center max-w-4xl w-full">
        <div className={`px-4 py-2 rounded-full text-sm font-medium ${
          !documentsConfirmed ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
        }`}>
          1. {t('selectDocuments')}
        </div>
        <div className="w-12 h-1 bg-gray-200 mx-2">
          <div className={`h-1 ${documentsConfirmed ? 'bg-green-500' : 'bg-gray-200'}`} style={{ width: documentsConfirmed ? '100%' : '0%' }}></div>
        </div>
        <div className={`px-4 py-2 rounded-full text-sm font-medium ${
          documentsConfirmed && selectedUserIds.length === 0 ? 'bg-blue-100 text-blue-700' :
          selectedUserIds.length > 0 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
        }`}>
          2. {t('selectUsers')}
        </div>
        <div className="w-12 h-1 bg-gray-200 mx-2">
          <div className={`h-1 ${selectedUserIds.length > 0 ? 'bg-green-500' : 'bg-gray-200'}`} style={{ width: selectedUserIds.length > 0 ? '100%' : '0%' }}></div>
        </div>
        <div className={`px-4 py-2 rounded-full text-sm font-medium ${
          selectedUserIds.length > 0 && selectedDocumentIds.length > 0 ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
        }`}>
          3. {t('sendEmails')}
        </div>
      </div>
    </div>
  );
};