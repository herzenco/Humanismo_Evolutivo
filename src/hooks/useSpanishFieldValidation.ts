import { createElement, useId, useState } from 'react';
import { flushSync } from 'react-dom';
import { z } from 'zod';

const messages = {
  name: 'Escribe tu nombre.',
  email: 'Escribe un correo electrónico válido.',
  subject: 'Escribe el asunto.',
  message: 'Escribe tu mensaje.',
  consent: 'Debes aceptar el aviso de privacidad para continuar.',
};

type Field = keyof typeof messages;
const email = z.email();

export function useSpanishFieldValidation() {
  const id = useId();
  const [invalid, setInvalid] = useState<Field[]>([]);

  function validate(form: HTMLFormElement, fields: Field[]) {
    const errors = fields.filter((field) => {
      const control = form.elements.namedItem(field) as HTMLInputElement | HTMLTextAreaElement;
      if (field === 'consent') return !(control as HTMLInputElement).checked;
      const value = control.value.trim();
      return !value || (field === 'email' && !email.safeParse(value).success);
    });

    flushSync(() => setInvalid(errors));
    if (errors.length) (form.elements.namedItem(errors[0]) as HTMLElement).focus();
    return errors.length === 0;
  }

  return {
    validate,
    clear: () => setInvalid([]),
    attributes: (field: Field) => ({
      'aria-invalid': invalid.includes(field) || undefined,
      'aria-describedby': invalid.includes(field) ? `${id}-${field}` : undefined,
    }),
    feedback: (field: Field) => invalid.includes(field)
      ? createElement('span', { id: `${id}-${field}` }, messages[field])
      : null,
  };
}
