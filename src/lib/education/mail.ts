import 'server-only';
import { educationAccess } from './server';
/** Deliver membership invitations to new AND existing accounts without replacing credentials. */
export async function deliverSchoolInvitation(invitationId: string) {
 const { data, error } = await educationAccess({action:'invitations.prepare',input:{invitationId}});
 if(error || !data) return {deliveryStatus:'failed',deliveryMessage:'No se pudo preparar el envío.'};
 const invitation=data as {email:string;schoolName:string};
 const key=process.env.RESEND_API_KEY, from=process.env.PORTAL_INVITATION_FROM, site=process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL;
 let sent=false;
 if(key&&from&&site){
  try{
   const link=new URL('/portal?view=school',site).toString();
   const result=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/json'},body:JSON.stringify({from,to:[invitation.email],subject:`Invitación a ${invitation.schoolName}`,text:`Te han invitado a ${invitation.schoolName} en Humanismo Evolutivo.\n\nInicia sesión o crea tu cuenta con este correo y acepta la invitación en Mis escuelas:\n${link}\n\nSi ya tienes cuenta, conserva tu contraseña y tu progreso. La invitación vence en 14 días.`}),signal:AbortSignal.timeout(10000)});
   sent=result.ok;
  }catch{sent=false;}
 }
 await educationAccess({action:'invitations.delivery',input:{invitationId,deliveryStatus:sent?'sent':'failed'}});
 return {deliveryStatus:sent?'sent':'failed',deliveryMessage:sent?'Invitación enviada por correo.':'Invitación guardada. El correo no se pudo enviar. Revisa la configuración y utiliza Reenviar.'};
}
