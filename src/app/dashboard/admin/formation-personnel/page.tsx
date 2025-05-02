import { fetchMembersByNames } from '@/lib/wordpress/api';
import type { WPMember } from '@/lib/wordpress/types';
import MemberCard from '@/components/formation/MemberCard';

// Define the structure for grouping
interface PersonnelGroup {
  title: string;
  members: WPMember[];
}

// List of specific personnel to display - using the original list again
const targetPersonnelNames = [
  'Danella Francis W.',
  'Wisniewski Daniel P.',
  'Kifolo Patrick J.',
  'McKenna Kenneth N.',
  'Extejt John I.',
  'GANYE Fabrice Emmanuel Sèdjro', // Check accent/casing if issues persist
  'SOGBEGNON Jean Degbegnon',
  'Nguyen Dominik Viet Hien',
  'Célleri Luis Paul Muñoz',
  'Jean Nixon',
  'Adams Fernando Miguel',
  'Pontier Ronald',
  'Vergara Alberto Benavides',
  'Mostert Jan',
  'Atkins Gavin Peter',
  'Mekala Thambi Joseph',
  'Akkutte Jacob Anil'
];

// Helper function to get province name (copied from MemberCard for grouping)
function getProvinceName(member: WPMember): string | null {
  const terms = member._embedded?.['wp:term']
    ?.find(termArray => termArray[0]?.taxonomy === 'province');
  return terms?.[0]?.name ?? null;
}

export default async function AdminFormationPersonnelPage() {
  let fetchedMembers: WPMember[] = [];
  let fetchError: string | null = null;
  let groupedPersonnel: PersonnelGroup[] = [];

  try {
    fetchedMembers = await fetchMembersByNames(targetPersonnelNames);

    // Grouping logic
    const groups: Record<string, PersonnelGroup> = {};

    // Special case for General Coordinator - Use the name returned by API
    const coordinatorName = 'Francis W. Danella'; // Corrected name based on logs
    const generalCoordinator = fetchedMembers.find(m => m.title.rendered === coordinatorName);
    if (generalCoordinator) {
      groups['General Formation Coordinator'] = {
        title: 'General Formation Coordinator',
        members: [generalCoordinator]
      };
    }

    // Group the rest by Province
    fetchedMembers.forEach(member => {
      // Skip the coordinator already grouped
      if (member.title.rendered === coordinatorName) return;

      const province = getProvinceName(member) || 'Other Personnel'; // Group under 'Other' if no province
      // --- TEMPORARY LOGGING ---
      console.log(`Grouping member: ${member.title.rendered}, Province: ${province}`);
      // --- END TEMPORARY LOGGING ---
      if (!groups[province]) {
        groups[province] = { title: province, members: [] };
      }
      groups[province].members.push(member);
    });

    // Define desired order of groups (check if these match logged province names)
    const groupOrder = [
      'General Formation Coordinator',
      'North American Provinces', // Check exact name from log
      'France-West Africa Province', // Check exact name from log
      'German-speaking Province', // Check exact name from log
      'South American and Caribbean Province', // Check exact name from log
      'Southern African Region', // Check exact name from log
      'Indian Region', // Check exact name from log
      'Other Personnel' // Catch-all for unmatched/missing provinces
    ];

    // Convert groups object to array in the desired order
    groupedPersonnel = groupOrder
      .map(title => groups[title])
      .filter((group): group is PersonnelGroup => group !== undefined); // Filter out non-existent groups

    // --- TEMPORARY LOGGING ---
    console.log("Final groupedPersonnel structure:", JSON.stringify(groupedPersonnel.map(g => ({ title: g.title, memberCount: g.members.length })), null, 2));
    // --- END TEMPORARY LOGGING ---

  } catch (error) {
    console.error("Failed to fetch/group formation personnel:", error);
    fetchError = error instanceof Error ? error.message : 'An unknown error occurred.';
  }

  return (
    <main>
      <h1 className="text-3xl font-bold mb-8">Formation Personnel</h1>

      {fetchError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> Failed to load members. {fetchError}</span>
        </div>
      )}

      {!fetchError && groupedPersonnel.length === 0 && (
        <p className="text-gray-500">No specified members found.</p>
      )}

      {!fetchError && groupedPersonnel.length > 0 && (
        <div className="space-y-10">
          {groupedPersonnel.map((group) => (
            <section key={group.title}>
              <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b border-gray-200 pb-2">{group.title}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {group.members.map((member) => (
                  <MemberCard key={member.id} member={member} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </main>
  );
}