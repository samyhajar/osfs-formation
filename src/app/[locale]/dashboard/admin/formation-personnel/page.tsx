'use client';

import { useState, useEffect } from 'react';
import { fetchLeadershipFormationMembers } from '@/lib/wordpress/api';
import { getFormationSettings, updateFormationSettings } from '@/lib/supabase/formation-settings';
import type { WPMember } from '@/lib/wordpress/types';
import MemberSelectionTable from '@/components/dashboard/admin/MemberSelectionTable';
import SaveControls from '@/components/dashboard/admin/SaveControls';

const SELECTED_MEMBERS_KEY = 'selectedFormationMembers';

export default function AdminFormationPersonnelPage() {
  const [allFormationMembers, setAllFormationMembers] = useState<WPMember[]>([]);
  const [selectedMemberIds, setSelectedMemberIds] = useState<number[]>([]);
  const [originalSelectedIds, setOriginalSelectedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const hasUnsavedChanges = JSON.stringify(selectedMemberIds.sort()) !== JSON.stringify(originalSelectedIds.sort());

  useEffect(() => {
    async function loadData() {
      try {
        console.log('🔄 Loading formation personnel data...');

        // Load saved selections from database first
        const savedMemberIds = await getFormationSettings();
        console.log(`📋 Found ${savedMemberIds.length} saved member selections in database`);

        setSelectedMemberIds(savedMemberIds);
        setOriginalSelectedIds([...savedMemberIds]);

        // Load all formation members from WordPress
        const formationMembers = await fetchLeadershipFormationMembers();
        console.log(`👥 Loaded ${formationMembers.length} formation members from WordPress API`);

        setAllFormationMembers(formationMembers);
      } catch (err) {
        console.error('❌ Error loading formation personnel data:', err);
        setError('Failed to load Leadership Formation personnel data');
      } finally {
        setLoading(false);
      }
    }

    void loadData();
  }, []);

  const handleMemberToggle = (memberId: number) => {
    const newSelection = selectedMemberIds.includes(memberId)
      ? selectedMemberIds.filter(id => id !== memberId)
      : [...selectedMemberIds, memberId];

    console.log(`🔄 Member ${memberId} toggled. New selection count: ${newSelection.length}`);
    setSelectedMemberIds(newSelection);
    setSaveMessage(null);

    // Keep localStorage updated as backup
    localStorage.setItem(SELECTED_MEMBERS_KEY, JSON.stringify(newSelection));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setSaveMessage(null);

      console.log(`💾 Saving ${selectedMemberIds.length} selected members to database...`);
      const result = await updateFormationSettings(selectedMemberIds);

      if (result.success) {
        setOriginalSelectedIds([...selectedMemberIds]);
        setSaveMessage({ type: 'success', text: 'Leadership Formation personnel selection saved successfully!' });
        console.log('✅ Successfully saved to database');

        // Auto-hide success message after 3 seconds
        setTimeout(() => {
          setSaveMessage(null);
        }, 3000);
      } else {
        setSaveMessage({
          type: 'error',
          text: result.error || 'Failed to save Leadership Formation personnel selection'
        });
        console.error('❌ Failed to save to database:', result.error);
      }
    } catch (error) {
      console.error('❌ Error saving formation personnel:', error);
      setSaveMessage({
        type: 'error',
        text: 'An unexpected error occurred while saving'
      });
    } finally {
      setSaving(false);
    }
  };

  // Get selected members for the second table
  const selectedMembers = allFormationMembers.filter(member =>
    selectedMemberIds.includes(member.id)
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading Leadership Formation personnel...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error</h3>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Leadership Formation Personnel Management
        </h1>
        <p className="text-gray-600">
          Select Leadership Formation members to display in the formation personnel directory. Check console for API response details.
        </p>
      </div>

      <SaveControls
        onSave={() => void handleSave()}
        saving={saving}
        hasUnsavedChanges={hasUnsavedChanges}
        saveMessage={saveMessage}
      />

      <div className="space-y-8">
        <MemberSelectionTable
          members={allFormationMembers}
          selectedMemberIds={selectedMemberIds}
          onMemberToggle={handleMemberToggle}
          title="All Leadership Formation Members"
        />

        <MemberSelectionTable
          members={selectedMembers}
          selectedMemberIds={selectedMemberIds}
          onMemberToggle={handleMemberToggle}
          title="Selected Members (Will Display to Users)"
        />
      </div>
    </div>
  );
}