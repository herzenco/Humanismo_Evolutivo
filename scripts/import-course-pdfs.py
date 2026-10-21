from pathlib import Path
from pypdf import PdfReader
import argparse
import re,json
parser=argparse.ArgumentParser()
parser.add_argument('--source-dir',type=Path,required=True)
args=parser.parse_args()
root=Path(__file__).resolve().parents[1]
specs=[('yo-soy-nosotros','Introduccion_Yo_Soy_Nosotros_Programa_45_Clases','Introducción a la filosofía de Yo Soy Nosotros',45,60),('ecologia-y-espiritualidad','Introduccion_Ecologia_y_Espiritualidad_Programa_45_Clases','Introducción a Ecología y Espiritualidad',45,60),('humanismo-evolutivo-transpersonal','Introduccion_Humanismo_Evolutivo_Transpersonal_45_Clases','Introducción al Humanismo Evolutivo Transpersonal',45,60),('el-arte-de-ser-empresario','El_arte_de_ser_empresario_Programa_11_Clases','El arte de ser empresario',11,120)]
courses=[]
for id,file,title,count,minutes in specs:
 text='\n'.join(page.extract_text() for page in PdfReader(args.source_dir/(file+'.pdf')).pages)
 text='\n'.join(l.rstrip() for l in text.splitlines() if not l.startswith('Fundación Humanismo Evolutivo') and not re.match(r'^Página \d+$',l))
 matches=list(re.finditer(r'^CLASE (\d+)\s*$',text,re.M))
 assert len(matches)==count,(id,len(matches))
 lessons=[]
 for i,m in enumerate(matches):
  chunk=text[m.end():matches[i+1].start() if i+1<len(matches) else len(text)].strip()
  if i+1==count: chunk=re.split(r'\nCierre\nCómo se articula el curso',chunk)[0]
  lessonTitle,body=re.split(r'\nLibro\s+',chunk,maxsplit=1)
  lessonTitle=' '.join(lessonTitle.split())
  body='Libro '+body
  pattern=r'^(Resumen de la Clase|Objetivos de Aprendizaje|Conceptos Clave|Desarrollo de la sesión[^\n]*|Preguntas de Reflexión|Lectura[^\n]*)\s*$'
  parts=re.split(pattern,body,flags=re.M)
  sections=[{'title':'Ficha de la clase','text':parts[0].strip()}]
  for j in range(1,len(parts),2): sections.append({'title':parts[j].strip(),'text':parts[j+1].strip()})
  assert len(sections)>=7,(id,i,len(sections))
  for section in sections:
   paragraphs=[]
   for line in section['text'].splitlines():
    line=' '.join(line.split())
    starts=bool(re.match(r'^(• |\d+[.] |\d+\s*[–−-]\s*\d+ min|Libro |Temática |Secciones |Duración |Requisitos )',line))
    if not paragraphs or starts: paragraphs.append(line)
    else: paragraphs[-1]+=' '+line
   section['text']='\n\n'.join(paragraphs)
  lessons.append({'id':str(i+1),'title':lessonTitle,'sections':sections})
 courses.append({'id':id,'title':title,'description':{'yo-soy-nosotros':'Una visión transpersonal del mundo: de la pregunta por el ser al desarrollo de la consciencia.','ecologia-y-espiritualidad':'Explora la relación entre la conciencia, la naturaleza y nuestra responsabilidad con la vida.','humanismo-evolutivo-transpersonal':'Un recorrido por la evolución, el imperativo ético y el trabajo consciente al servicio del bien común.','el-arte-de-ser-empresario':'El trabajo, la ética y la empresa como caminos de autorrealización y transformación social.'}[id],'minutes':minutes,'source':file+'.pdf','lessons':lessons})
(root/'src/generated/course-content.json').write_text(json.dumps(courses,ensure_ascii=False,indent=2)+'\n')
public=[{**{k:v for k,v in c.items() if k not in ['lessons','source']},'lessons':[{'id':l['id'],'title':l['title']} for l in c['lessons']]} for c in courses]
(root/'src/generated/course-catalog.json').write_text(json.dumps(public,ensure_ascii=False,indent=2)+'\n')
print([(c['id'],len(c['lessons']),c['lessons'][-1]['title']) for c in courses])
