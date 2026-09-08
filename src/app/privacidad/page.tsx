import LegalDocumentPage from '@/components/legal/LegalDocumentPage';
import { privacyDocuments } from '@/data/legalDocuments';

export default function PrivacyPage() {
  return <LegalDocumentPage documents={privacyDocuments} />;
}
