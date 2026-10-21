import Link from "next/link";
import { DocumentaryVideo, PhilosophersVideo, TutorialVideoButton } from "./HomepageVideos";

// Ported from the supplied Inicio.html; navigation uses application routes.
export default function HomeEditorial() { return <div className="editorial">
<section aria-labelledby="hero-title" className="he-e149bc314 he-row">
<div className="he-42a6ea32f he-sized">
<div className="he-11a930e85">
{"TRANSPERSONAL"}
</div>
<h1 id="hero-title" className="he-274ef8b1e he-h1">
{"Humanismo Evolutivo"}
</h1>
<p className="he-57a52e76d">
{"Yo soy nosotros"}
</p>
<p className="he-b485a87c8 he-sized">
{"Un viaje de conciencia para entender quiénes somos, de dónde venimos y hacia dónde vamos, conectando ciencia, espíritu y humanidad."}
</p>
<div className="he-152d372b7 he-row">
<Link href="/libros" prefetch={false} className="he-21e3a953a he-row">
{"Explorar libros\n"}
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
<path d="M5 12h14M13 6l6 6-6 6">

</path>
</svg>
</Link>
<Link href="/autor" prefetch={false} className="he-b9cc09976 he-row">
{"Sobre el autor"}
</Link>
</div>
</div>
<figure className="he-c6c41e2c2 he-sized">
<div className="he-b64348458">
<img src="/design/d9ef2c3feb3964e9f2f4951421e08277.jpg" alt="Marcos Constandse Madrazo sentado en su oficina, frente a un muro de fotografías de los parques de Xcaret" fetchPriority="high" className="he-6e3379ba7" />
</div>
<figcaption className="he-9061e6128">
{"MARCOS CONSTANDSE MADRAZO"}
</figcaption>
</figure>
</section>
<section aria-labelledby="hub-title" className="he-65fbe60ac he-row">
<div className="he-37f350293 he-sized">
<h2 id="hub-title" className="he-5865219a8 he-h2">
{"Explora, conoce y profundiza a través de estos 8 contenidos:"}
</h2>
<TutorialVideoButton />
</div>
<ol aria-label="Los 8 contenidos" className="home-content-buttons">
{[
  ['s1', 'Conozca a los tres filósofos'],
  ['s2', 'Las grandes preguntas'],
  ['s3', 'Un camino a través de los jardines'],
  ['s4', 'Documental completo'],
  ['s5', 'Las 51 preguntas'],
  ['s6', 'Profundiza en los libros'],
  ['s7', 'Más contenido en nuestras plataformas'],
  ['s8', 'Únete al Club de Amigos que Evolucionan'],
].map(([id, label], index) => <li key={id}><a href={`#${id}`} className="home-content-button"><span className="home-content-number">{index + 1}</span><span>{label}</span><span className="home-content-arrow" aria-hidden="true">↗</span></a></li>)}
</ol>
</section>
<section id="sobre-el-autor" aria-labelledby="about-title" className="he-af688e964 he-row">
<figure className="home-author-portrait">
<div className="home-author-portrait-frame">
<img src="/design/d0c13d41b6fee9d4b2f4174db365259c.jpg" alt="Marcos Constandse Madrazo, sonriente, en su escritorio" loading="lazy" className="he-8f6f0f1a2" />
</div>
</figure>
<div className="he-3c083ca55">
<div className="he-971633377">
{"SOBRE EL AUTOR"}
</div>
<h2 id="about-title" className="he-22e182e34 he-h2">
{"Marcos Constandse Madrazo"}
</h2>
<p className="he-36c72a4b6">
{"Marcos Constandse Madrazo es un pensador incansable, empresario visionario y explorador del alma humana. Desde hace más de tres décadas, ha recorrido un camino único que integra ciencia, filosofía, ecología y espiritualidad para ofrecer una visión del mundo donde todo está profundamente conectado: el universo, la Tierra, la vida, el ser humano y su evolución consciente."}
</p>
<p className="he-9645b261d">
{"En su vida empresarial formó cuatro grupos. El grupo inicial en el que adquiere experiencia, Grupo Mezcalapa, que administró una diversidad de empresas. El segundo grupo que fue cofundador fue Grupo Ritco. El tercer grupo que formó como cofundador también y aportando las ideas básicas del mismo fue Grupo Palace, grupo de hoteles Palace en Cancún. Y el cuarto grupo que fue cofundador y que estuvo al frente de la formación espiritual, financiera, legal y de auditoría fue Grupo Xcaret. De esos cuatro grupos que formó parte en su fundación, tres de ellos, en su momento, han estado calificados como las 200 empresas más importantes de México."}
</p>
<p className="he-9645b261d">
{"Su obra literaria desarrolla la filosofía del Humanismo Evolutivo Transpersonal, planteando la evolución desde la conciencia individual hacia la conciencia colectiva como proceso transformador de la humanidad. Su libro "}
<em>
{"“Yo soy nosotros”"}
</em>
{" fue galardonado con el "}
<strong>
{"Premio Nacional de Ensayo Filosófico"}
</strong>
{"."}
</p>
<p className="he-9645b261d">
{"Autor de obras como "}
<em>
{"Yo soy nosotros"}
</em>
{", "}
<em>
{"Ecología y espiritualidad"}
</em>
{", "}
<em>
{"Déjalo ser"}
</em>
{", "}
<em>
{"El arte de ser empresario"}
</em>
{" y "}
<em>
{"¡Y lo mejor aún está por venir!"}
</em>
{", Constandse ha dedicado su vida a explorar las conexiones profundas entre todos los aspectos de la existencia."}
</p>
<Link href="/autor" prefetch={false} className="he-40d6486ca he-row">
{"Conocer más\n"}
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
<path d="M5 12h14M13 6l6 6-6 6">

</path>
</svg>
</Link>
</div>
</section>

<section id="s1" className="he-580031031 he-row">
<div className="he-c2365a66f he-sized">
<div className="he-3619f855d he-row">
<span className="he-702f28551 he-row he-sized">
{"1"}
</span>
<h2 className="he-22e182e34 he-h2">
{"Conozca a los tres filósofos"}
</h2>
</div>
<p className="he-42c9249ac">
{"Sócrates, Platón y Aristóteles te acompañan para explorar las grandes preguntas de la vida desde el Humanismo Evolutivo Transpersonal."}
</p>
<div className="he-6b1b061fa">
{"PREGUNTAR · REFLEXIONAR · COMPRENDER"}
</div>
<aside className="he-262a265ce">
<div className="he-049d5de8a">
{"Nota sobre los personajes"}
</div>
<p className="he-d30482db2">
{"Platón, Sócrates y Aristóteles son recursos didácticos. No reproducen literalmente sus palabras ni sus doctrinas históricas."}
</p>
</aside>
</div>
<div className="he-400621ff7 he-grid">
<div className="he-a1beba773">
<img src="/design/e9d8b6dd9b5bae33ad53213e7108d372.jpg" alt="Ilustración de Sócrates" loading="lazy" className="he-77cc1379b he-sized" />
<div className="he-5836052f4">
{"Sócrates"}
</div>
<div className="he-4fd9c33ff">
{"PREGUNTA"}
</div>
</div>
<div className="he-a1beba773">
<img src="/design/0a1d8b321a8a134ffb37fad57897d60e.jpg" alt="Ilustración de Platón" loading="lazy" className="he-77cc1379b he-sized" />
<div className="he-5836052f4">
{"Platón"}
</div>
<div className="he-4fd9c33ff">
{"REFLEXIONA"}
</div>
</div>
<div className="he-a1beba773">
<img src="/design/e328f548b774f58907e42fe156bd5276.jpg" alt="Ilustración de Aristóteles" loading="lazy" className="he-77cc1379b he-sized" />
<div className="he-5836052f4">
{"Aristóteles"}
</div>
<div className="he-4fd9c33ff">
{"INTEGRA"}
</div>
</div>
</div>
<PhilosophersVideo />
</section>
<section id="s2" className="he-1da7f6aa5">
<div className="he-3619f855d he-row">
<span className="he-9a7a98995 he-row he-sized">
{"2"}
</span>
<h2 className="he-d98cfa764 he-h2">
{"Las grandes preguntas"}
</h2>
</div>
<div className="he-f97962489 he-grid">
<img src="/design/17d4f7daf232ea4fbcaa033a26207ca3.jpg" alt="¿De dónde venimos? Preguntar es el inicio del conocimiento. El Jardín de la Evolución." loading="lazy" className="he-0ded6cc87" />
<img src="/design/04392e0cfc55badb8bb441819c60883b.jpg" alt="¿Hacia dónde podemos evolucionar? Conocer · Comprender · Transformar · Evolucionar." loading="lazy" className="he-3667c6366" />
</div>
<div className="home-great-questions-summary home-big-questions">
<article><h3>¿De dónde venimos?</h3><p><strong>TODO · Texto provisional para revisión:</strong> Del Big Bang y de sus partículas portadoras de información, que dieron origen al universo y a la vida.</p></article>
<article><h3>¿Hacia dónde podemos evolucionar?</h3><p><strong>TODO · Texto provisional para revisión:</strong> Hacia el espíritu, ampliando nuestra conciencia y nuestra conexión con los demás.</p></article>
</div>
</section>
<section id="s3" className="he-2ce0874f2">
<div className="he-e0ac64c88 he-sized">
<div className="he-3619f855d he-row">
<span className="he-702f28551 he-row he-sized">
{"3"}
</span>
<h2 className="he-22e182e34 he-h2">
{"Un camino a través de los jardines"}
</h2>
</div>
<p className="he-42c9249ac">
{"Conoce el camino del Humanismo Evolutivo Transpersonal a través de sus tres Jardines:"}
</p>
<div className="he-2a485c9e5">
{"EVOLUCIÓN · MEDITACIÓN · FILOSOFÍA"}
</div>
</div>
<article className="he-aba102a70 he-row">
<div className="he-21067afe7 he-sized">
<img src="/design/ed9c86fd90f33e7d1ba2e1287ad8bcb6.jpg" alt="Mosaicos del Jardín de la Evolución" loading="lazy" className="he-84253380f he-sized" />
<div className="he-9782dec4a">
{"JARDÍN DE LA EVOLUCIÓN"}
</div>
</div>
<div className="he-3c28cb097">
<h3 className="he-891611ef3 he-h3">
{"El Jardín de la Evolución"}
</h3>
<ul className="he-7caee8e56">
<li className="he-33b6c86b7">
{"Los "}
<strong>
{"quince mosaicos"}
</strong>
{" del jardín de la evolución simbolizan los procesos más importantes, científicamente comprobados, del proceso evolutivo del universo, referido a los tiempos en que se llevaron a cabo."}
</li>
<li className="he-33b6c86b7">
{"Por los tiempos evolutivos, una vez formado el cerebro humano del Homo Sapiens Sapiens (hace 300,000 años), a través de millones de años, la conclusión es, que todos los seres humanos tenemos el mismo número de neuronas, o sea, al nacer somos “potencialmente iguales”."}
</li>
<li className="he-33b6c86b7">
{"Tenemos el "}
<strong>
{"mismo origen"}
</strong>
{": en las partículas emitidas por el Big Bang."}
</li>
<li className="he-33b6c86b7">
{"Tenemos la "}
<strong>
{"misma ancestro"}
</strong>
{", que fue la primera mujer Homo Sapiens Sapiens."}
</li>
<li className="he-33b6c86b7">
{"Son las diferentes condiciones socioeconómico y ambientales lo que marca nuestras diversas “visiones del mundo” y capacidades. Por lo tanto, el esfuerzo humano se deben canalizar (para lograr el mayor grado de igualdades) las condiciones de inicio y desarrollo de nuestra conciencia y nuestras capacidades, y aplicarlas en nuestro "}
<strong>
{"trabajo"}
</strong>
{" y participación social."}
</li>
<li className="he-33b6c86b7">
{"Es el "}
<strong>
{"trabajo"}
</strong>
{" (como en la evolución del universo trabajan las partículas del Big Bang para crear nuestra realidad actual), hecho con la "}
<strong>
{"información correcta"}
</strong>
{", lo que conecta al ser humano con las fuerzas evolutivas del universo, y si es útil y provechoso para los demás, conecta también con todas las religiones vigentes en el universo humano."}
</li>
</ul>
</div>
</article>
<article className="he-aba102a70 he-row">
<div className="he-3c28cb097">
<h3 className="he-891611ef3 he-h3">
{"El Jardín de la Meditación"}
</h3>
<ul className="he-7caee8e56">
<li className="he-33b6c86b7">
{"Explica los ritos, visión y principios de 6 de las "}
<strong>
{"religiones más importantes"}
</strong>
{" en el mundo."}
</li>
<li className="he-33b6c86b7">
{"Demuestra que TODAS las religiones tienen un objetivo común: el reconocer al otro como igual a mí, y de ahí surge el "}
<strong>
{"IMPERATIVO ÉTICO"}
</strong>
{" que dice que “todos tenemos dignidad absoluta y debemos respetarnos y amarnos”."}
</li>
<li className="he-33b6c86b7">
{"A partir de ahí es que se llega a la misma conclusión evolutiva: por amor o solidaridad hacia “los otros” (“amaos los unos a los otros”), debemos hacer valer los derechos humanos, como el derecho a la vida, la salud, la vivienda, la educación, la alimentación, el trabajo, la recreación, etc."}
</li>
</ul>
</div>
<div className="he-21067afe7 he-sized">
<img src="/design/e4ac4e8708df48eeccff81d2686c6998.jpg" alt="Esculturas del Jardín de la Meditación" loading="lazy" className="he-e8eda883c he-sized" />
<div className="he-9782dec4a">
{"JARDÍN DE LA MEDITACIÓN"}
</div>
</div>
</article>
<article className="he-aba102a70 he-row">
<div className="he-21067afe7 he-sized">
<img src="/design/26992f25dd3efc30930eb809112915c2.jpg" alt="Edificio del Jardín de la Filosofía" loading="lazy" className="he-21b002869 he-sized" />
<div className="he-9782dec4a">
{"JARDÍN DE LA FILOSOFÍA"}
</div>
</div>
<div className="he-3c28cb097">
<h3 className="he-891611ef3 he-h3">
{"El Jardín de la Filosofía"}
</h3>
<p className="he-9645b261d">
{"Este jardín está diseñado para que aquellos que decidan "}
<strong>
{"profundizar"}
</strong>
{" más en "}
<strong>
{"conocimiento"}
</strong>
{", tanto de la ciencia (antropología) y la filosofía, para cimentar más profundamente su conciencia y con el conocimiento básico abordar la teoría de "}
<strong>
{"“Humanismo Evolutivo”"}
</strong>
{", puedan acceder a niveles superiores de conciencia y les sea más accesible la felicidad, la paz interior y la autorrealización."}
</p>
</div>
</article>
</section>
<section id="s4" className="he-580031031 he-row">
<div className="he-c2365a66f he-sized">
<div className="he-3619f855d he-row">
<span className="he-702f28551 he-row he-sized">
{"4"}
</span>
<h2 className="he-22e182e34 he-h2">
{"Documental completo"}
</h2>
</div>
<p className="he-42c9249ac">
{"Conoce Parque Cancún, sus Jardines y sus conclusiones. Tú decides cuándo y cómo verlo."}
</p>
</div>
<DocumentaryVideo />
</section>
<section id="s5" className="he-0ee09cc2f he-row">
<div className="he-c2365a66f he-sized">
<div className="he-3619f855d he-row">
<span className="he-702f28551 he-row he-sized">
{"5"}
</span>
<h2 className="he-22e182e34 he-h2">
{"Las 51 preguntas"}
</h2>
</div>
<p className="he-42c9249ac">
{"Un recorrido de preguntas y respuestas para reflexionar sobre el ser humano, la vida, la conciencia y nuestra evolución."}
</p>
<p className="he-a752415ad">
{"Encuentra las respuestas que deseas conocer."}
</p>
<Link href="/51preguntas" prefetch={false} className="he-ff88883eb he-row">
{"Las 51 preguntas\n"}
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
<path d="M5 12h14M13 6l6 6-6 6">

</path>
</svg>
</Link>
</div>
<div className="he-77dd9108d he-row">
<div className="he-f46dabc48 he-row">
<div className="he-55adca8b6 he-sized">
<span className="he-cf456a5be">
{"51"}
</span>
<span className="he-6c3793b18">
{"PREGUNTAS"}
<br />
{"Y DIÁLOGO"}
</span>
</div>
<div className="he-afb86b617 he-row he-sized">
<span className="he-fcccf8b19">
{"Preguntar también es evolucionar."}
</span>
</div>
</div>
</div>
</section>
<section id="s6" className="he-298106cb6">
<div className="he-57d5bebd9 he-sized">
<div className="he-3619f855d he-row">
<span className="he-702f28551 he-row he-sized">
{"6"}
</span>
<h2 className="he-22e182e34 he-h2">
{"Profundiza en los libros"}
</h2>
</div>
<p className="he-42c9249ac">
{"El humanismo evolutivo es una corriente de pensamiento filosófico que el Ing. Marcos Constandse Madrazo desarrolló, a través de la escritura de seis de sus libros:"}
</p>
</div>
<div className="he-a9bef34c5 he-grid">
<div className="he-ff96ce4f1 he-row">
<img src="/design/456d7db8a3c876f22040458c07c9eb30.jpg" alt="Portada de Yo soy nosotros" loading="lazy" className="he-211d92610 he-sized" />
<div className="he-355eeddb9">
<span className="he-59f40951f">
{"I"}
</span>
<h3 className="he-269aa0047 he-h3">
{"Yo soy nosotros"}
</h3>
<p className="he-d30482db2">
{"Se expone con un enfoque filosófico y basado en "}
<strong>
{"“La evolución del universo”"}
</strong>
{", la teoría filosófica."}
</p>
</div>
</div>
<div className="he-ff96ce4f1 he-row">
<img src="/design/daba8e942d8f02d4888334c0e1ea21e4.jpg" alt="Portada de Ecología y espiritualidad" loading="lazy" className="he-211d92610 he-sized" />
<div className="he-355eeddb9">
<span className="he-59f40951f">
{"II"}
</span>
<h3 className="he-269aa0047 he-h3">
{"Ecología y espiritualidad"}
</h3>
<p className="he-d30482db2">
{"Plantea una visión de sostenibilidad ecológica del planeta y su biósfera."}
</p>
</div>
</div>
<div className="he-ff96ce4f1 he-row">
<img src="/design/ed689a07290096a7574e1b91b2c72a4e.jpg" alt="Portada de ¡Déjalo ser!" loading="lazy" className="he-211d92610 he-sized" />
<div className="he-355eeddb9">
<span className="he-59f40951f">
{"III"}
</span>
<h3 className="he-269aa0047 he-h3">
{"¡Déjalo ser!"}
</h3>
<p className="he-d30482db2">
{"Novela sobre Cancún, basado en la realidad evolutiva de un personaje nativo maya de un pueblo perdido en la selva, que evoluciona hasta formar una familia moderna en 3 generaciones. Un ejemplo de la vida real que demuestra que "}
<strong>
{"“evolucionar es ser”"}
</strong>
{"."}
</p>
</div>
</div>
<div className="he-ff96ce4f1 he-row">
<img src="/design/67949123c5d2ce183c6e143227e64975.jpg" alt="Portada de ¡Y lo mejor aún está por venir!" loading="lazy" className="he-211d92610 he-sized" />
<div className="he-355eeddb9">
<span className="he-59f40951f">
{"IV"}
</span>
<h3 className="he-269aa0047 he-h3">
{"¡Y lo mejor aún está por venir!"}
</h3>
<p className="he-d30482db2">
{"Una disertación que explica, que si fundamentamos nuestras acciones en los ejemplos que nos da el universo en la evolución, la humanidad podrá tener un futuro luminoso."}
</p>
</div>
</div>
<div className="he-ff96ce4f1 he-row">
<img src="/design/93f963ec6c044b62ae621d38fefc05c7.jpg" alt="Portada de El arte de ser empresario" loading="lazy" className="he-211d92610 he-sized" />
<div className="he-355eeddb9">
<span className="he-59f40951f">
{"V"}
</span>
<h3 className="he-269aa0047 he-h3">
{"El arte de ser empresario"}
</h3>
<p className="he-d30482db2">
{"Un ensayo que trata de reivindicar el oficio empresarial o demostrar cómo la labor empresarial es paralela a la corriente de “humanismo evolutivo” y genera bienestar a la humanidad."}
</p>
</div>
</div>
<div className="he-ff96ce4f1 he-row">
<div role="img" aria-label="Portada de Humanismo evolutivo" className="he-68882a153 he-sized">
<span className="he-77c0bef52">
{"HUMANISMO"}
<br />
{"EVOLUTIVO"}
</span>
<svg width="44" height="44" viewBox="0 0 24 24" aria-hidden="true">
<circle cx="12" cy="12" r="10" fill="#FFFFFF">

</circle>
<path d="M12 2A10 10 0 0 0 12 22A5 5 0 0 0 12 12A5 5 0 0 1 12 2Z" fill="#0F2E20">

</path>
<circle cx="12" cy="17" r="1.5" fill="#FFFFFF">

</circle>
<circle cx="12" cy="7" r="1.5" fill="#0F2E20">

</circle>
</svg>
<span className="he-1e39182c4">
{"[PORTADA PENDIENTE]"}
</span>
</div>
<div className="he-355eeddb9">
<span className="he-59f40951f">
{"VI"}
</span>
<h3 className="he-269aa0047 he-h3">
{"Humanismo evolutivo"}
</h3>
<p className="he-d30482db2">
{"Resumen explicativo de los Jardines de la Evolución, la Meditación y la Filosofía, y define al resumen del "}
<strong>
{"“pensamiento del humanismo evolutivo”"}
</strong>
{"."}
</p>
</div>
</div>
</div>
<div className="he-70d97b874 he-row">
<p className="he-112d2d8ab">
{"Consulta los resúmenes y elige por dónde comenzar."}
</p>
<Link href="/libros" prefetch={false} className="he-1d05055b6 he-row">
{"Ver los resúmenes\n"}
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
<path d="M5 12h14M13 6l6 6-6 6">

</path>
</svg>
</Link>
</div>
</section>
<section id="s7" className="he-0ee09cc2f he-row">
<div className="he-c2365a66f he-sized">
<div className="he-3619f855d he-row">
<span className="he-702f28551 he-row he-sized">
{"7"}
</span>
<h2 className="he-22e182e34 he-h2">
{"Más contenido en nuestras plataformas"}
</h2>
</div>
<p className="he-42c9249ac">
{"Continúa explorando:"}
</p>
</div>
<div className="he-76a93d7e8 he-grid">
<Link href="/" prefetch={false} className="he-a27bfcb8c">
<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2F6B45" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
<rect x="3" y="4" width="18" height="12" rx="2">

</rect>
<path d="M8 20h8M12 16v4">

</path>
<path d="M10.5 8v4.5l3.8-2.25z">

</path>
</svg>
<span className="he-2ec7ee111">
{"Página web"}
</span>
<span className="he-6663c68e7">
{"www.humanismoevolutivo.com"}
</span>
</Link>
<Link href="/medios?tab=videos" prefetch={false} className="he-a27bfcb8c">
<div className="he-b52f768c1 he-row">
<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
<path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v7h4v-7h3l1-4h-4V8.5a.5.5 0 0 1 .5-.5z">

</path>
</svg>
<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
<rect x="3" y="3" width="18" height="18" rx="5">

</rect>
<circle cx="12" cy="12" r="4">

</circle>
<circle cx="17.5" cy="6.5" r="0.6">

</circle>
</svg>
<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
<path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5">

</path>
<path d="M14 3c.5 2.8 2.4 4.6 5 5">

</path>
</svg>
<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
<rect x="2.5" y="5.5" width="19" height="13" rx="4">

</rect>
<path d="M10 9.5v5l4.5-2.5z">

</path>
</svg>
</div>
<span className="he-2ec7ee111">
{"Redes sociales"}
</span>
<span className="he-6663c68e7">
{"@humanismoevolutivo"}
</span>
</Link>
<Link href="/medios" prefetch={false} className="he-a27bfcb8c">
<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2F6B45" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
<path d="M6 3h9l3 3v15H6z">

</path>
<path d="M9 9h6M9 13h6M9 17h4">

</path>
</svg>
<span className="he-2ec7ee111">
{"Artículos y boletines"}
</span>
</Link>
<Link href="/medios" prefetch={false} className="he-a27bfcb8c">
<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2F6B45" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
<path d="M3 5.5c2.5-1 5.5-1 9 1 3.5-2 6.5-2 9-1v13c-2.5-1-5.5-1-9 1-3.5-2-6.5-2-9-1z">

</path>
<path d="M12 6.5v13">

</path>
</svg>
<span className="he-2ec7ee111">
{"Revista"}
</span>
</Link>
</div>
</section>
<section id="s8" className="he-580031031 he-row">
<div className="he-3dd055e70 he-sized">
<div className="he-3619f855d he-row">
<span className="he-702f28551 he-row he-sized">
{"8"}
</span>
<h2 className="he-22e182e34 he-h2">
{"Únete al Club de Amigos que Evolucionan"}
</h2>
</div>
<p className="he-42c9249ac">
{"Conoce, comparte y forma parte de un mundo más consciente, solidario y humano."}
</p>
<p className="he-9645b261d">
{"Al unirte al Club obtienes acceso gratuito al "}
<strong>
{"Portal educativo"}
</strong>
{": un espacio en línea para estudiar los cursos de Humanismo Evolutivo Transpersonal a tu ritmo. Las lecturas están organizadas por partes y clases, y tu avance se guarda en tu cuenta para que retomes donde te quedaste."}
</p>
<div className="he-e8e21757e he-row">
<Link href="/auth?mode=signup" prefetch={false} className="he-e002036e7 he-row">
{"Únete al club\n"}
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
<path d="M5 12h14M13 6l6 6-6 6">

</path>
</svg>
</Link>
<Link href="/auth" prefetch={false} className="he-a42476497 he-row">
{"Ya soy miembro · Entrar al portal"}
</Link>
</div>
</div>
<div className="he-84988341f">
<div className="he-96c17f161 he-row">
<span className="he-093c31c5d he-row">
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
<path d="M2 9l10-5 10 5-10 5z">

</path>
<path d="M6 11v5c3 2.5 9 2.5 12 0v-5">

</path>
<path d="M22 9v6">

</path>
</svg>
{"\nEN EL PORTAL EDUCATIVO"}
</span>
<span className="he-9d43a1299">
{"4 cursos · 146 clases"}
</span>
</div>
<ul className="he-10b5f204b">
<li className="he-aa11c2b97 he-row">
<span className="he-ebe1ad91f">
{"El arte de ser empresario"}
</span>
<span className="he-2a286500d">
{"Acceso libre"}
</span>
</li>
<li className="he-aa11c2b97 he-row">
<span className="he-ebe1ad91f">
{"Introducción al Humanismo Evolutivo Transpersonal"}
</span>
<span className="he-2a286500d">
{"Acceso libre"}
</span>
</li>
<li className="he-aa11c2b97 he-row">
<span className="he-ebe1ad91f">
{"Introducción a Ecología y Espiritualidad"}
</span>
<span className="he-2a286500d">
{"Acceso libre"}
</span>
</li>
<li className="he-aa11c2b97 he-row">
<span className="he-ebe1ad91f">
{"Introducción a la filosofía de Yo Soy Nosotros"}
</span>
<span className="he-2a286500d">
{"Acceso libre"}
</span>
</li>
</ul>
</div>
</section>
<section id="libros" aria-labelledby="books-title" className="he-74bc7aede">
<div className="he-70dacc86f he-row">
<div className="he-780634c87 he-sized">
<div className="he-d76576463">
{"OBRA DESTACADA"}
</div>
<h2 id="books-title" className="he-d98cfa764 he-h2">
{"Biblioteca filosófica"}
</h2>
<p className="he-f72702ec1">
{"Una colección de obras que exploran la evolución de la conciencia humana"}
</p>
</div>
<Link href="/libros" prefetch={false} className="he-57588e735 he-row">
{"Ver todos los libros\n"}
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
<path d="M5 12h14M13 6l6 6-6 6">

</path>
</svg>
</Link>
</div>
<div className="he-3dc4886ab he-grid">
<article className="he-e480d9a91">
<div className="he-c6882064a he-row">
<img src="/design/456d7db8a3c876f22040458c07c9eb30.jpg" alt="Portada de Yo soy nosotros" loading="lazy" className="he-bf7ebf40a he-sized" />
</div>
<span className="he-080ac00a5">
{"I"}
</span>
<h3 className="he-2af6fd6c3 he-h3">
{"Yo soy nosotros"}
</h3>
<p className="he-6fc4d7b2c">
{"Una visión transpersonal del mundo"}
</p>
<p className="he-bdfdf5abd">
{"En "}
<em>
{"Yo soy nosotros"}
</em>
{", Marcos Constandse nos invita a recorrer un mapa del conocimiento que conecta ciencia, filosofía, psicología, espiritualidad y ecología bajo una visión evolutiva e integradora del ser humano. Esta obra ganó el Premio Nacional de Ensayo Filosófico."}
</p>
<Link href="/libros/yo-soy-nosotros" prefetch={false} className="he-22268af18 he-row">
{"Leer más\n"}
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
<path d="M5 12h14M13 6l6 6-6 6">

</path>
</svg>
</Link>
</article>
<article className="he-bdf5742e3">
<div className="he-77a465934 he-row">
<img src="/design/daba8e942d8f02d4888334c0e1ea21e4.jpg" alt="Portada de Ecología y espiritualidad" loading="lazy" className="he-2daacf39a he-sized" />
<div className="he-9808a2141">
<span className="he-a66a6c63b">
{"II"}
</span>
<h3 className="he-a0fec3019 he-h3">
{"Ecología y espiritualidad"}
</h3>
<p className="he-1544816b6">
{"Una mirada integral al cuidado del planeta y del alma"}
</p>
</div>
</div>
<p className="he-85fe10d5f">
{"En "}
<em>
{"Ecología y espiritualidad"}
</em>
{", Marcos Constandse entrelaza ciencia, conciencia y ética para ofrecer una visión profundamente integradora entre el mundo natural y el del ser humano."}
</p>
<Link href="/libros/ecologia-y-espiritualidad" prefetch={false} className="he-252de5a21 he-row">
{"Leer más\n"}
<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
<path d="M5 12h14M13 6l6 6-6 6">

</path>
</svg>
</Link>
</article>
<article className="he-bdf5742e3">
<div className="he-77a465934 he-row">
<img src="/design/ed689a07290096a7574e1b91b2c72a4e.jpg" alt="Portada de ¡Déjalo ser!" loading="lazy" className="he-2daacf39a he-sized" />
<div className="he-9808a2141">
<span className="he-a66a6c63b">
{"III"}
</span>
<h3 className="he-a0fec3019 he-h3">
{"¡Déjalo ser!"}
</h3>
<p className="he-1544816b6">
{"Una novela sobre identidad, memoria y libertad"}
</p>
</div>
</div>
<p className="he-85fe10d5f">
<em>
{"Déjalo ser"}
</em>
{" es una novela que entrelaza memoria, identidad y tecnología en un relato íntimo y visionario. Marcos Constandse nos conduce a un futuro posible, donde la acumulación de datos personales confronta a sus protagonistas con sus raíces más profundas y sus decisiones más humanas."}
</p>
<Link href="/libros/dejalo-ser" prefetch={false} className="he-252de5a21 he-row">
{"Leer más\n"}
<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
<path d="M5 12h14M13 6l6 6-6 6">

</path>
</svg>
</Link>
</article>
<article className="he-bdf5742e3">
<div className="he-77a465934 he-row">
<img src="/design/67949123c5d2ce183c6e143227e64975.jpg" alt="Portada de ¡Y lo mejor aún está por venir!" loading="lazy" className="he-2daacf39a he-sized" />
<div className="he-9808a2141">
<span className="he-a66a6c63b">
{"IV"}
</span>
<h3 className="he-a0fec3019 he-h3">
{"¡Y lo mejor aún está por venir!"}
</h3>
<p className="he-1544816b6">
{"Un ensayo filosófico de autoayuda"}
</p>
</div>
</div>
<p className="he-85fe10d5f">
{"En esta obra íntima y lúcida, Marcos Constandse entrelaza filosofía, experiencia personal y reflexión social para ofrecernos una guía hacia una vida con mayor conciencia, bienestar y sentido."}
</p>
<Link href="/libros/lo-mejor-esta-por-venir" prefetch={false} className="he-252de5a21 he-row">
{"Leer más\n"}
<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
<path d="M5 12h14M13 6l6 6-6 6">

</path>
</svg>
</Link>
</article>
<article className="he-bdf5742e3">
<div className="he-77a465934 he-row">
<img src="/design/93f963ec6c044b62ae621d38fefc05c7.jpg" alt="Portada de El arte de ser empresario" loading="lazy" className="he-2daacf39a he-sized" />
<div className="he-9808a2141">
<span className="he-a66a6c63b">
{"V"}
</span>
<h3 className="he-a0fec3019 he-h3">
{"El arte de ser empresario"}
</h3>
<p className="he-1544816b6">
{"Una mirada ética y evolutiva al quehacer empresarial"}
</p>
</div>
</div>
<p className="he-85fe10d5f">
{"En esta obra, Marcos Constandse redefine la figura del empresario desde una perspectiva ética, filosófica y evolutiva. Más que un manual, "}
<em>
{"El arte de ser empresario"}
</em>
{" es una invitación a vivir el emprendimiento como un noble servicio del bien común."}
</p>
<Link href="/libros/el-arte-de-ser-empresario" prefetch={false} className="he-252de5a21 he-row">
{"Leer más\n"}
<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
<path d="M5 12h14M13 6l6 6-6 6">

</path>
</svg>
</Link>
</article>
</div>
</section>
<section id="podcast" aria-labelledby="podcast-title" className="he-feeeb26a8 he-row">
<div className="he-6572ada2c he-sized">
<div className="he-971633377">
{"CONVERSACIONES"}
</div>
<h2 id="podcast-title" className="he-22e182e34 he-h2">
{"Podcast y entrevistas"}
</h2>
<p className="he-e818cb532">
{"Escucha las conversaciones de Marcos Constandse en diversos podcasts y programas donde profundiza sobre filosofía, espiritualidad, ecología y ética empresarial."}
</p>
<p className="he-2e3eeeb26">
{"Una oportunidad para comprender mejor el pensamiento del autor a través del diálogo con otros pensadores y comunicadores contemporáneos."}
</p>
<Link href="/medios" prefetch={false} className="he-b5744218c he-row">
{"Ver todos los episodios\n"}
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
<path d="M5 12h14M13 6l6 6-6 6">

</path>
</svg>
</Link>
</div>
<div className="he-3c083ca55">
<article className="he-d83277bc6 he-row">
<div className="he-af370049b he-row he-sized">
<svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
<path d="M4 15v-3a8 8 0 0 1 16 0v3">

</path>
<rect x="3" y="14" width="4" height="6" rx="1.5">

</rect>
<rect x="17" y="14" width="4" height="6" rx="1.5">

</rect>
</svg>
</div>
<div className="he-93e0490f3">
<Link href="/medios/show/yo-soy-nosotros" prefetch={false} className="he-b39e72518">
{"SERIE · YO SOY NOSOTROS"}
</Link>
<h3 className="he-84dc46585 he-h3">
<Link href="/medios/yo-soy-nosotros/el-universo" prefetch={false} className="he-fed916622">
{"El Universo"}
</Link>
</h3>
<p className="he-1be044b03">
{"Humanismo Evolutivo Transpersonal"}
</p>
<span className="he-f1903d132 he-row">
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
<circle cx="12" cy="12" r="9">

</circle>
<path d="M12 7v5l3 2">

</path>
</svg>
{"45:32"}
</span>
</div>
<Link href="/medios/yo-soy-nosotros/el-universo" aria-label="Escuchar El Universo" prefetch={false} className="he-a3d3d092a he-row">
<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
<path d="M8 5v14l11-7z" fill="currentColor">

</path>
</svg>
{"\nEscuchar"}
</Link>
</article>
<article className="he-d83277bc6 he-row">
<div className="he-af370049b he-row he-sized">
<svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
<path d="M4 15v-3a8 8 0 0 1 16 0v3">

</path>
<rect x="3" y="14" width="4" height="6" rx="1.5">

</rect>
<rect x="17" y="14" width="4" height="6" rx="1.5">

</rect>
</svg>
</div>
<div className="he-93e0490f3">
<Link href="/medios/show/yo-soy-nosotros" prefetch={false} className="he-b39e72518">
{"SERIE · YO SOY NOSOTROS"}
</Link>
<h3 className="he-84dc46585 he-h3">
<Link href="/medios/yo-soy-nosotros/introduccion-yo-soy-nosotros" prefetch={false} className="he-fed916622">
{"El inicio de la búsqueda"}
</Link>
</h3>
<p className="he-1be044b03">
{"Humanismo Evolutivo Transpersonal"}
</p>
<span className="he-f1903d132 he-row">
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
<circle cx="12" cy="12" r="9">

</circle>
<path d="M12 7v5l3 2">

</path>
</svg>
{"38:15"}
</span>
</div>
<Link href="/medios/yo-soy-nosotros/introduccion-yo-soy-nosotros" aria-label="Escuchar El inicio de la búsqueda" prefetch={false} className="he-a3d3d092a he-row">
<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
<path d="M8 5v14l11-7z" fill="currentColor">

</path>
</svg>
{"\nEscuchar"}
</Link>
</article>
</div>
</section>
<section id="descargas" aria-labelledby="download-title" className="he-76bb15af4">
<div className="he-70dacc86f he-row">
<div className="he-780634c87 he-sized">
<div className="he-971633377">
{"BIBLIOTECA"}
</div>
<h2 id="download-title" className="he-22e182e34 he-h2">
{"Descarga nuestros libros"}
</h2>
<p className="he-42c9249ac">
{"Accede a las obras completas de Marcos Constandse en formato digital. Comparte conocimiento y expande la conciencia."}
</p>
</div>
<Link href="/libros" prefetch={false} className="he-8d45ecf54 he-row">
{"Ver biblioteca completa\n"}
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
<path d="M5 12h14M13 6l6 6-6 6">

</path>
</svg>
</Link>
</div>
<div className="he-2e74e6109 he-grid">
<article className="he-7f09162ce">
<div className="he-65419438f he-row">
<img src="/design/456d7db8a3c876f22040458c07c9eb30.jpg" alt="Portada de Yo soy nosotros" loading="lazy" className="he-3e3b1c439 he-sized" />
<div className="he-9808a2141">
<h3 className="he-269aa0047 he-h3">
{"Yo soy nosotros"}
</h3>
<p className="he-cf2674169">
{"Una visión transpersonal del mundo"}
</p>
</div>
</div>
<p className="he-449c5dd52">
{"En "}
<em>
{"Yo soy nosotros"}
</em>
{", Marcos Constandse nos invita a recorrer un mapa del conocimiento que conecta ciencia, filosofía, psicología, espiritualidad y ecología bajo una visión evolutiva e integradora del ser humano. Esta obra ganó el Premio Nacional de Ensayo Filosófico."}
</p>
<Link href="/libros?descargar=yo-soy-nosotros" prefetch={false} className="he-eb38a0ae0 he-row">
<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
<path d="M12 4v11M7 10l5 5 5-5M5 20h14">

</path>
</svg>
{"\nDescargar libro"}
</Link>
</article>
<article className="he-7f09162ce">
<div className="he-65419438f he-row">
<img src="/design/daba8e942d8f02d4888334c0e1ea21e4.jpg" alt="Portada de Ecología y espiritualidad" loading="lazy" className="he-3e3b1c439 he-sized" />
<div className="he-9808a2141">
<h3 className="he-269aa0047 he-h3">
{"Ecología y espiritualidad"}
</h3>
<p className="he-cf2674169">
{"Una mirada integral al cuidado del planeta y del alma"}
</p>
</div>
</div>
<p className="he-449c5dd52">
{"En "}
<em>
{"Ecología y espiritualidad"}
</em>
{", Marcos Constandse entrelaza ciencia, conciencia y ética para ofrecer una visión profundamente integradora entre el mundo natural y el del ser humano."}
</p>
<Link href="/libros?descargar=ecologia-y-espiritualidad" prefetch={false} className="he-eb38a0ae0 he-row">
<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
<path d="M12 4v11M7 10l5 5 5-5M5 20h14">

</path>
</svg>
{"\nDescargar libro"}
</Link>
</article>
<article className="he-7f09162ce">
<div className="he-65419438f he-row">
<img src="/design/ed689a07290096a7574e1b91b2c72a4e.jpg" alt="Portada de ¡Déjalo ser!" loading="lazy" className="he-3e3b1c439 he-sized" />
<div className="he-9808a2141">
<h3 className="he-269aa0047 he-h3">
{"¡Déjalo ser!"}
</h3>
<p className="he-cf2674169">
{"Una novela sobre identidad, memoria y libertad"}
</p>
</div>
</div>
<p className="he-449c5dd52">
<em>
{"Déjalo ser"}
</em>
{" es una novela que entrelaza memoria, identidad y tecnología en un relato íntimo y visionario. Marcos Constandse nos conduce a un futuro posible, donde la acumulación de datos personales confronta a sus protagonistas con sus raíces más profundas y sus decisiones más humanas."}
</p>
<Link href="/libros?descargar=dejalo-ser" prefetch={false} className="he-eb38a0ae0 he-row">
<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
<path d="M12 4v11M7 10l5 5 5-5M5 20h14">

</path>
</svg>
{"\nDescargar libro"}
</Link>
</article>
</div>
</section>
<section id="portal" aria-labelledby="portal-title" className="he-f1875aa15">
<div className="he-9d8773e24 he-row">
<div className="he-cddefe03b he-sized">
<span className="he-9a8091bf0 he-row">
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D4AF5A" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
<path d="M2 9l10-5 10 5-10 5z">

</path>
<path d="M6 11v5c3 2.5 9 2.5 12 0v-5">

</path>
<path d="M22 9v6">

</path>
</svg>
{"\nUn espacio para aprender y profundizar"}
</span>
<h2 id="portal-title" className="he-d98cfa764 he-h2">
{"Portal educativo"}
</h2>
<p className="he-6b5165f1c">
{"Crea tu cuenta gratuita para estudiar los cursos de Humanismo Evolutivo Transpersonal."}
</p>
<Link href="/auth" prefetch={false} className="he-c01a194ae he-row">
{"Entrar al portal\n"}
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
<path d="M5 12h14M13 6l6 6-6 6">

</path>
</svg>
</Link>
</div>
<div className="he-3c28cb097">
<div className="he-320260234 he-row">
<span className="he-6bb3e3586 he-row he-sized">
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
<path d="M3 5.5c2.5-1 5.5-1 9 1 3.5-2 6.5-2 9-1v13c-2.5-1-5.5-1-9 1-3.5-2-6.5-2-9-1z">

</path>
<path d="M12 6.5v13">

</path>
</svg>
</span>
<div className="he-ef1f3a5df">
<h3 className="he-6812c172a he-h3">
{"Todo en un lugar"}
</h3>
<p className="he-6b4c8d099">
{"Cursos organizados por partes y clases."}
</p>
</div>
</div>
<div className="he-320260234 he-row">
<span className="he-6bb3e3586 he-row he-sized">
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
<rect x="5" y="11" width="14" height="10" rx="2">

</rect>
<path d="M8 11V7a4 4 0 0 1 8 0v4">

</path>
</svg>
</span>
<div className="he-ef1f3a5df">
<h3 className="he-6812c172a he-h3">
{"Acceso personal"}
</h3>
<p className="he-6b4c8d099">
{"Tu avance guardado en una cuenta segura."}
</p>
</div>
</div>
</div>
</div>
</section>
</div>; }
