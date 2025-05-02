import { fetchMembersByNames } from '@/lib/wordpress/api';
import type { WPMember } from '@/lib/wordpress/types';
import MemberCard from '@/components/formation/MemberCard';
import { getTranslations } from 'next-intl/server';

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
  // Get translations using getTranslations for Server Components
  const t = await getTranslations('AdminFormationPersonnelPage');

  let fetchedMembers: WPMember[] = [];
  let fetchError: string | null = null;
  let groupedPersonnel: PersonnelGroup[] = [];

  // Get translated static group titles
  const translatedCoordinatorTitle = t('groupTitleCoordinator');
  const translatedOtherTitle = t('groupTitleOther');

  try {
    fetchedMembers = await fetchMembersByNames(targetPersonnelNames);

    const groups: Record<string, PersonnelGroup> = {};
    const coordinatorName = 'Francis W. Danella';

    const generalCoordinator = fetchedMembers.find(m => m.title.rendered === coordinatorName);
    if (generalCoordinator) {
      // Use the translated title as the key and in the object
      groups[translatedCoordinatorTitle] = {
        title: translatedCoordinatorTitle,
        members: [generalCoordinator]
      };
    }

    fetchedMembers.forEach(member => {
      if (member.title.rendered === coordinatorName) return;

      // Use the translated title for the 'Other' group if no province
      const province = getProvinceName(member) || translatedOtherTitle;
      console.log(`Grouping member: ${member.title.rendered}, Province/Group: ${province}`);
      if (!groups[province]) {
        groups[province] = { title: province, members: [] };
      }
      groups[province].members.push(member);
    });

    // Define desired order using translated static titles where applicable
    const groupOrder = [
      translatedCoordinatorTitle,
      'North American Provinces', // Dynamic - Keep as is
      'France-West Africa Province', // Dynamic - Keep as is
      'German-speaking Province', // Dynamic - Keep as is
      'South American and Caribbean Province', // Dynamic - Keep as is
      'Southern African Region', // Dynamic - Keep as is
      'Indian Region', // Dynamic - Keep as is
      translatedOtherTitle // Use translated fallback title
    ];

    groupedPersonnel = groupOrder
      .map(title => groups[title])
      .filter((group): group is PersonnelGroup => group !== undefined);

    console.log("Final groupedPersonnel structure:", JSON.stringify(groupedPersonnel.map(g => ({ title: g.title, memberCount: g.members.length })), null, 2));

  } catch (error) {
    console.error("Failed to fetch/group formation personnel:", error);
    fetchError = error instanceof Error ? error.message : 'An unknown error occurred.';
  }

  return (
    <main>
      <h1 className="text-3xl font-bold mb-8">{t('title')}</h1>

      {fetchError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
          <strong className="font-bold">{t('errorPrefix')}</strong>
          <span className="block sm:inline"> {t('errorLoading')} {fetchError}</span>
        </div>
      )}

      {!fetchError && groupedPersonnel.length === 0 && (
        <p className="text-gray-500">{t('emptyState')}</p>
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