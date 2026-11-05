import type { EducationRequest } from './contracts';
export async function educationRequest<T>(request: EducationRequest, signal?: AbortSignal): Promise<T> {
 const response = await fetch('/api/education/access', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(request),signal,cache:'no-store'});
 const result = await response.json();
 if (!response.ok) throw new Error(result.error || 'No se pudo completar la operación.');
 return result.data as T;
}
