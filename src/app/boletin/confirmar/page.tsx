import type { Metadata } from 'next';
import TokenForm from '../TokenForm';

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function Page({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams;
  return <TokenForm mode="confirm" token={typeof token === 'string' ? token : ''} />;
}
