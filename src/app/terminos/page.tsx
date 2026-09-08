import LegalDocumentPage from '@/components/legal/LegalDocumentPage';
import { termsDocuments } from '@/data/legalDocuments';

export default function TermsPage() {
  return <LegalDocumentPage documents={termsDocuments} />;
}
