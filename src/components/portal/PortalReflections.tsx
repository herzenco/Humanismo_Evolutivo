'use client';
import {useEffect,useState} from 'react';
import {educationRequest} from '@/lib/education/client';
type Reflection={course_id:string;lesson:number;body:string;submitted_at:string};
export default function PortalReflections({schoolId,userId}:{schoolId:string;userId:string}){
 const [result,setResult]=useState<{key:string;data?:Reflection[];error?:string}|null>(null),[offset,setOffset]=useState(0);
 const key=JSON.stringify([schoolId,userId,offset]);
 const data=result&&result.key===key?result.data:null,error=result&&result.key===key?result.error:'';
 useEffect(()=>{const c=new AbortController();educationRequest<Reflection[]>({action:'reflections.list',input:{schoolId,userId,limit:25,offset}},c.signal).then(data=>{if(!c.signal.aborted)setResult({key,data});}).catch(e=>{if(!c.signal.aborted)setResult({key,error:e.message});});return()=>c.abort();},[schoolId,userId,offset,key]);
 return <section className="portal-admin-section"><h3>Reflexiones compartidas</h3><p>Se muestran las entregas que puedes consultar según los permisos y la fecha de activación de esta escuela.</p>{!data&&!error?<p role="status">Consultando permisos…</p>:null}{error?<p role="alert">{error}</p>:null}{data?.map(r=><article key={`${r.course_id}-${r.lesson}`} className="portal-admin-classroom"><h4>{r.course_id} · Lección {r.lesson}</h4><p className="portal-source-text">{r.body}</p></article>)}{data?.length===0?<p>No hay reflexiones autorizadas para mostrar.</p>:null}<div className="portal-school-pagination"><button disabled={!offset} onClick={()=>setOffset(n=>Math.max(0,n-25))}>Anterior</button><button disabled={!data||data.length<25} onClick={()=>setOffset(n=>n+25)}>Siguiente</button></div></section>;
}
