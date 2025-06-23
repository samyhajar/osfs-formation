'use client';

import { FormField } from '@/components/admin/documents/FormField';

const commonTopics = [
  'Community',
  'Constitutions',
  'Directory',
  'Evaluation',
  'History',
  'Ministry',
  'Origins: Formation Coordinator',
  'Other',
  'Prayer',
  'Psychology',
  'Salesian',
  'Spirituality',
  'Vows'
];

interface EditTopicsSelectorProps {
  topics: string[];
  onChange: (topics: string[]) => void;
  disabled?: boolean;
}

export function EditTopicsSelector({ topics, onChange, disabled = false }: EditTopicsSelectorProps) {
  const handleKeywordsChange = (value: string) => {
    const topicArray = value.split(',').map(topic => topic.trim()).filter(topic => topic.length > 0);
    const selectedCommonTopics = topics.filter(t => commonTopics.includes(t));
    const customTopics = topicArray.filter(t => !commonTopics.includes(t));
    onChange([...selectedCommonTopics, ...customTopics]);
  };

  return (
    <div>
      <label htmlFor="topics-edit-section" className="block text-sm font-medium text-gray-700 mb-2">
        Topics
      </label>
      <div id="topics-edit-section" className="flex flex-wrap gap-2 mb-2">
        {commonTopics.map((topic) => (
          <button
            key={topic}
            type="button"
            onClick={() => {
              onChange(
                topics.includes(topic)
                  ? topics.filter(t => t !== topic)
                  : [...topics, topic]
              );
            }}
            disabled={disabled}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors disabled:opacity-50 ${
              topics.includes(topic)
                ? 'bg-blue-100 text-blue-800 border border-blue-300'
                : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-blue-50 hover:text-blue-700'
            }`}
          >
            {topic}
          </button>
        ))}
      </div>
      <FormField
        id="custom-topics"
        label="Additional Topics (comma-separated)"
        value={topics.filter(t => !commonTopics.includes(t)).join(', ')}
        onChange={handleKeywordsChange}
        disabled={disabled}
        placeholder="e.g., Custom topic 1, Custom topic 2"
      />
    </div>
  );
}