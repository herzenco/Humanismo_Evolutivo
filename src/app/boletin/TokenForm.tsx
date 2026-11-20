'use client';

import { useActionState } from 'react';
import { confirmNewsletter, unsubscribeNewsletter } from './actions';

export default function TokenForm({ mode, token }: { mode: 'confirm' | 'baja'; token: string }) {
  const confirm = mode === 'confirm';
  const [result, action, pending] = useActionState(confirm ? confirmNewsletter : unsubscribeNewsletter, null);
  return <main className="mx-auto max-w-xl px-6 py-20">
    {result === true ? <p role="status">{confirm ? 'Listo. Tu suscripción al boletín está confirmada.' : 'Te diste de baja del boletín. Ya no recibirás nuestros correos.'}</p> :
      <form action={action}>
        <input type="hidden" name="token" value={token} />
        <button className="design-button" type="submit" disabled={pending}>{confirm ? 'Confirmar suscripción' : 'Darme de baja'}</button>
        {result === false ? <p role="alert">No pudimos registrar tu correo. Inténtalo de nuevo.</p> : null}
      </form>}
  </main>;
}
