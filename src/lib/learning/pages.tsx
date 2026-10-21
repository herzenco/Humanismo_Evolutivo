import 'server-only';
import Link from 'next/link';
import { redirect, notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { isEmailAccountClaims } from '@/lib/auth';
import PortalDashboard from '@/components/portal/PortalDashboard';
import { resourceArticles } from '@/data/resources';
import { getEducationContext } from '@/lib/education/server';
export async function learningIdentity(next: string) {
 if (!isSupabaseConfigured) redirect(`/auth?next=${encodeURIComponent(next)}`);
 const client=await createClient();
 const {data,error}=await client.auth.getClaims();
 if(error || !isEmailAccountClaims(data?.claims)) redirect(`/auth?next=${encodeURIComponent(next)}`);
 return data.claims;
}
export async function LearningShell({children}: {children: React.ReactNode}) {
 const claims=await learningIdentity('/portal');
 const name=claims.user_metadata?.first_name;
 return <PortalDashboard firstName={typeof name==='string' ? name : claims.email?.split('@')[0] || 'Estudiante'} email={claims.email} articles={resourceArticles} educationContext={await getEducationContext()} courseWorkspace={children}/>;
}
export function LearningUnavailable() {
 return <div className="portal-empty" role="alert"><h2>No pudimos cargar tu progreso</h2><p>Vuelve a intentarlo en unos momentos. Tu avance se conserva y las siguientes clases permanecen bloqueadas.</p><Link className="design-text-link" href="/portal">Volver a mis cursos</Link></div>;
}
export { notFound };
