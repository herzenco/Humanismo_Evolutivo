"use client";

import { useLanguage } from '@/contexts/LanguageContext';
import PageWrapper from '@/components/layout/PageWrapper';
import { motion } from 'framer-motion';

const Vision = () => {
  const { t, language } = useLanguage();

  return (
    <PageWrapper>
      <article className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {t('vision.title')}
            </h1>
            <p className="text-2xl font-light italic text-muted-foreground">
              {t('vision.subtitle')}
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-6">La fuente de la que bebí:</h2>
              <p className="mb-6">
                Lo que hace a los individuos únicos e irrepetibles es que cada uno posee su propia "visión del mundo".
              </p>
              <p className="mb-6">
                En el mundo actual se confunde el concepto de <em>visión propia</em> con el de <em>visión verdadera</em>; y eso se confunde con el que cada quien posee su propia verdad y esta es valedera; esa confusión ha dispersado la realidad, pues la verdad no es otra cosa que la comprensión de la realidad, y lo que es real es que esa comprensión ha evolucionado, pondría como ejemplo a la física Newtoniana, con la física cuántica, que aparentemente se contradicen, cuando en realidad se complementan.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-6">Otros ejemplos serían:</h2>

              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4">La visión del sexo:</h3>
                  <p className="mb-4">
                    En los años 50, era un tabú que no se mencionaba ni en público, ni en privado; "la liberación sexual" toma fuerza en los movimientos sociales de 1968, en todo el mundo, que fue una rebelión en contra del "establishment" en general, que alteró la visión del mundo: que se tenía del sexo, de la moda, de las parejas, del matrimonio, de la sexualidad individual, etc.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">La visión de la participación social de la mujer:</h3>
                  <p className="mb-4">
                    A partir de la intervención femenina en la producción masiva de las naciones en conflicto, pues los hombres estaban en guerra (1940-1946); la mujer dejó de ver su participación en el hogar, como un mecanismo de autorrealización y catapultó un movimiento que ya ha tenido enormes consecuencias políticas, sociales, económicas. Pongo de ejemplo: en la generación 58-62 de Ingeniería, había, entre miles, una estudiante de Ingeniería, y en la generación de mi hijo Marcos en la Universidad Iberoamericana (1990-1994), de los 22 mejores estudiantes de la universidad (entre los que se encontraba mi hijo), eran 3 hombres y 19 mujeres. Las parejas jóvenes, sin matrimonio y sin hijos, son totalmente aceptadas en la sociedad actual.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">En la comunicación:</h3>
                  <p className="mb-4">
                    Me platica mi maestro y amigo, el Ing. Luis B. Gómez, que, en Guadalajara, él tuvo el primer teléfono en los años de la década de 1930; en el 2020 se calcula que existen entre cuatro y cinco mil millones de teléfonos celulares; la comunicación se ha vuelto mundial y en tiempo real. La idea de la aldea global, que McLuhan pronosticó en los años 60, se convirtió en una realidad, provocando una enorme inconformidad en las comunidades por los contrastes de riqueza y pobreza.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">En el mercado libre:</h3>
                  <p className="mb-4">
                    Las bolsas de valores, cuyo objetivo era mercadear las acciones de las empresas, en función de "su productividad", con la globalización se volvieron "casinos de apuestas" a escala mundial de "derivados", que son instrumentos financieros creados por Wall Street por economistas matemáticos, que ha tenido como consecuencia, una enorme acumulación de riqueza para todas las empresas y personas dedicadas a la especulación financiera, desvirtuando totalmente "el verdadero valor del mercado".
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">En las familias del mundo occidental:</h3>
                  <p className="mb-4">
                    Con la vida laboral de los padres, ha cambiado drásticamente la transmisión de valores tradicionales; en Occidente se eliminaron de las escuelas las materias de Civismo, Ética, Moral, Filosofía, Música, etc., sustrayendo de la enseñanza todos los valores greco-judeo-cristiano-romanos, fundacionales de la Europa moderna y de sus colonias, cayendo en el positivismo y la materialización económica del consumo como objetivo de vida; los valores trascendentes desaparecieron y se generalizó una actitud hedonista del "aquí y ahora", regida por el dinero y la intensidad de la experiencia.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">En el medio ambiente:</h3>
                  <p className="mb-4">
                    La humanidad desarrolló una consciencia de cómo opera la biosfera de la Tierra, que comprende desde las profundidades del océano, hasta la estratosfera, y se dio cuenta de la profunda interrelación que existe en la naturaleza de todos los seres vivos de la misma, y también se dio cuenta de cómo operan los ciclos del agua y los ciclos de la vida y se percató de que es posible que la sociedad de consumo, que actualmente prevalece en el mundo, genere desequilibrios que puedan alterar el equilibrio ecológico del mismo y atentar a la sobrevivencia de la especie humana.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-6">En relación a la salud:</h2>
              <p className="mb-6">
                El descubrimiento y el catálogo del genoma humano a través del ADN brinda una perspectiva de salud de inmensa trascendencia, no solo de las enfermedades congénitas que se van a poder evitar en su totalidad, sino de las enfermedades que se manifiesten a través del ADN, que puedan ser corregidas.
              </p>
              <p className="mb-6">
                No hay duda que en los países desarrollados llegarán a tener en el presente siglo una vida promedio de 90 años, y será muy frecuente ver que una gran cantidad de personas rebasen los 100 años, lo cual va a tener grandes consecuencias económicas (las pensiones) y sociales, pues conjuntamente con la decisión de los matrimonios jóvenes de tener solo un hijo, o máximo dos, más la gran cantidad que está decidiendo no casarse, va a plantear un problema demográfico de gran trascendencia.
              </p>
              <p className="mb-6">
                Prácticamente, no hay actividad humana que no se haya visto afectada en el siglo XX, que fue un siglo de revolución de todas las revoluciones anteriores de la humanidad: en el consumo energético, en el transporte, en las comunicaciones, en la alimentación, en la vida dentro del hogar, en las relaciones humanas, en el medio ambiente y en la salud; todo se transformó, y a un ritmo frenético, que llevó tan solo dos generaciones.
              </p>
            </section>

            <section className="mb-12">
              <p className="mb-6">
                La visión moderna, que afirma que "no existe una verdad universal", se contradice, pues afirma lo que niega y quiere convertir la negación en verdad universal.
              </p>
              <p className="mb-6">
                Es una absoluta realidad que todo en el universo evoluciona, todo es un movimiento permanente, pero la razón y el análisis, la fe y la ciencia, demuestran que no es movimiento anárquico y loco, sino que tiene dirección y sentido, a pesar de que use el azar para lograr ese objetivo, y Teilhard de Chardin lo definió correctamente al decir: <strong>"La evolución es la espiritualización de la materia."</strong>
              </p>
            </section>

            <section className="mb-12">
              <p className="mb-6">
                La generación que nacimos en el año 1940, somos una generación que nos formamos en el seno de una cultura occidental, impuesta en México durante 300 años de la conquista española y a la cual hemos dado continuidad durante 200 años de independencia, y nuestra cultura original, a pesar de la supervivencia de exponentes de ella, algunos de los cuales no hablan el español, ya prácticamente no existe y se ha vuelto motivo de estudio de especialistas; sin embargo, algunas características personales persisten, pues somos una nación mezcla de nacionalidades.
              </p>
              <p className="mb-6">
                En mi caso particular, soy un mestizo de herencia mexicana por la línea materna, y holandesa y española en la paterna; soy un mestizo como la mayoría de nosotros.
              </p>
              <p className="mb-6">
                Pertenezco a una familia armónica de un segundo matrimonio de mi padre (de herencia protestante de mi abuelo holandés) y de mi madre, profundamente católica; fuimos tres hermanos y dos medios hermanos, que vivimos siempre en armonía; nuestra familia perteneció a una clase media, que nos formó profesionalmente.
              </p>
            </section>

            <section className="mb-12">
              <p className="mb-6">
                Nuestra cultura occidental-española-católica, nos formó en nuestra infancia, con las tradiciones fundacionales de la cultura europea de orígenes greco-judeo-cristiano-romanos, que ensenaba que los seres humanos perseguimos los ideales de verdad-justicia-belleza-bondad como directrices de vida.
              </p>
              <p className="mb-6">
                En lo material soy una combinación milagrosa (como todos nosotros), de carbono, hidrógeno, oxígeno, fósforo, nitrógeno, azufre, azúcar y algo más.
              </p>
              <p className="mb-6">
                En lo espiritual, nuestra formación del hogar de primaria, secundaria y preparatoria fue en escuelas católicas dirigidas por la hermandad de los maristas, de tradición católica-apostólica-romana, que he evolucionado en "Mi visión del mundo" hasta lo que soy hoy.
              </p>
            </section>

            <section className="mb-12">
              <p className="mb-6">He observado que, en relación a nuestra visión del mundo, existen tres características espirituales en los seres humanos:</p>

              <div className="space-y-6 ml-6">
                <div>
                  <p className="mb-4"><strong>I</strong> Aquellos espíritus que encuentran paz con la información que les brindan sus sentidos y que no cuestionan las realidades que a ellos les informan.</p>
                </div>
                <div>
                  <p className="mb-4"><strong>II</strong> Aquellos espíritus que no se conforman con lo que sus sentidos les informan, pero que, al seguir una religión o una fe determinada, esta los complementa y les da la paz que requieren.</p>
                </div>
                <div>
                  <p className="mb-4"><strong>III</strong> Aquellos espíritus que no logran tener su paz a través de la fe y desean profundizar en las realidades que les rodean, y estos suelen seguir uno de dos caminos:</p>
                  <div className="ml-8 mt-4 space-y-4">
                    <p className="mb-4">
                      <strong>1.</strong> Aquellos espíritus que profundizan los caminos esotéricos de las grandes mitologías ancestrales, o que exploran posibilidades de realidades extraterrestres, o de explicaciones mágicas de la realidad, caminos esotéricos que han sido explorados ancestralmente y que no obedecen al análisis dialéctico de la realidad, ni a la confirmación científica, pero que les dan argumentos de fe, que les da tranquilidad y convicción.
                    </p>
                    <p className="mb-4">
                      <strong>2.</strong> Aquellos espíritus que buscan a través del estudio y el análisis del pensamiento racional e histórico y en el método de análisis dialéctico de la realidad, apoyándose en el devenir y la evolución histórica del ser humano y tomando las realidades científicas comprobadas como verdaderas, o parcialmente verdaderas, y con todo el análisis racional de sus capacidades y las enseñanzas históricas de profetas, maestros, filósofos, científicos, etc., tratan de encontrar la mayor aproximación a la verdad, que hoy yo en particular, la resumo como un imperativo ético, al cual señala la evolución histórica de la humanidad y sus maestros, profetas y científicos.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <p className="mb-6">
                La humanidad fue creada a imagen y semejanza de su creador, para ser feliz, a través de identificar su razón existencial, que no es otra que el imperativo ético; es aquel que señala que "el otro es como yo" y que el espíritu reside tanto en él como en nosotros.
              </p>
              <p className="mb-6">
                En mi caso, pertenezco a esta última categoría, y cuando menciono en "Mi visión del mundo" que, "cuando llegué ya estaba aquí y que al irme me quedaré en los otros", trato de decir lo siguiente:
              </p>
              <p className="mb-6">
                Si el espíritu reside en el ser humano, como dicen Buda y Hegel, y Cristo se refiere al él como "su padre", esta situación nos hace a todos hermanos en un origen común (que conocemos como Big-Bang u origen de todo el universo) y nos convierte en objetivo de la creación y nos da a todos dimensión divina o nos hace a imagen y semejanza del creador, pues podemos como él "crear en la libertad de elegir", y esto nos convierte en fin de la creación y no en un medio de la misma. Al espíritu lo encontramos en nosotros, no afuera de nosotros.
              </p>
              <p className="mb-6">
                Con esa visión del ser humano y del universo, podremos comprender mejor lo que Einstein preguntaba de la unidad universal, y que es posible comprendiendo, cuando él demuestra que energía y materia son lo mismo, manifestándose en forma diferente (E=mc²).
              </p>
            </section>

            <section className="mb-12">
              <p className="mb-6">
                Ese proceso se logra a través de la búsqueda y el análisis de las experiencias propias, y partiendo de que, al principio, cuando nacemos, somos "tabula rasa", como dijo Santo Tomás de Aquino.
              </p>
              <p className="mb-6">
                Y también Agustín de Hipona dijo que: "La verdad no debe buscarse afuera de ti, sino en tu interior". A Dios se le encuentra en el interior del hombre; y Buda dijo: "no busques ni sigas a un Buda exterior, porque eso no existe, Buda está en tu interior, ahí lo podrás encontrar".
              </p>
            </section>

            <section className="mb-12">
              <p className="mb-6">Santo Tomás esgrimió los siguientes argumentos:</p>
              <ol className="list-decimal ml-8 space-y-3">
                <li>Existe movimiento en la naturaleza y alguna cosa lo originó.</li>
                <li>Todos los fenómenos que observamos se deben a una cosa. En él estaban debe haber un origen.</li>
                <li>¿Qué es lo posible? Lo que todavía no existe, pero puede ser realizado, por lo tanto, tiene que ser concebido antes de existir.</li>
                <li>En la naturaleza hay seres jerarquizados, que reflejan bondad, nobleza, belleza.</li>
                <li>El universo refleja el orden que requiere la existencia de una inteligencia ordenadora.</li>
              </ol>
            </section>

            <section className="mb-12">
              <p className="mb-6">
                Todo esto quiere decir que nosotros, al nacer, no tenemos el espíritu en nosotros; el espíritu nos llega a través de los seres humanos que nos rodean, porque ese conocimiento ellos ya lo tienen, cada ser humano en su visión del mundo, de tal forma que eso es lo que nos enseñan en la niñez e infancia, de tal manera que hasta la adolescencia somos lo que nos han enseñado, y lo que nos han enseñado es lo que ya sabían cuando nosotros llegamos, o sea que somos y tenemos la consciencia que nos enseñaron y que "ya estaba aquí".
              </p>
              <p className="mb-6">
                Ahora, nosotros somos un "yo que se hace del otro". En ese momento para nosotros también somos "la experiencia propia de nuestra esencia". ¿Qué quiere decir? Nuestra experiencia, principalmente en la adolescencia, nos enfrenta y confronta nuestra "visión del mundo" en ese momento de una "realidad consciente", con un "daños cuenta" de la realidad, y es ahí en donde aparecen esas formas en las que cada espíritu reacciona individualmente.
              </p>
            </section>

            <section className="mb-12">
              <p className="mb-6">
                En mi caso, la realidad que yo percibí, no correspondía con lo que me habían enseñado y ese fue el inicio de una búsqueda que, en realidad, no fue inmediata, porque el primer impulso fue liberador; dejar lo aprendido y experimentar otras formas de vida, perseguir la salvación exterior del alma en la posteridad se cambió por una actitud de vivir el presente, y cometí dos errores: me volví libertino en vez de un liberal y dejé el concepto de Dios, y convertí mi vida en un frenesí de experiencias, la cual sustenté con una apasionada entrega al trabajo que repercutió en una total independencia económica que sustentó el conjunto. Esto duró de los 18 a los 28 años; 10 años que recordaré como los de mayor energía e intensidad de mi vida.
              </p>
              <p className="mb-6">
                A los 28 años me casé y descubrí el enorme vacío que me había producido esa vida libertina; fue intensa y universal, pero primitiva, y en el fondo, vacía; aunque hubo emociones profundas de amor, pasión y de aprendizaje en el trabajo; me volví un trabajador consistente y sólido.
              </p>
              <p className="mb-6">
                Casado, con gran fortuna y satisfacción con Inna y con tres hermosos hijos, buenos hermanos y amigos, y éxito económico, empecé a sentir algo que yo llamé "angustia existencial", que no era comprendida por mí; lo hablaba yo con mi esposa, y mi pregunta era: "si tengo todo lo que se puede desear, una bella y buena esposa, hijos sanos y hermosos, hermanos y amigos solidarios, y éxito económico... ¿Por qué este vacío?"
              </p>
            </section>

            <section className="mb-12">
              <p className="mb-6">
                Y esa fue la gran incógnita: ¿Por dónde comenzar? Y ahí fue la buena fortuna, apareció el que fue mi segundo gran maestro, el Ing. Luis B. Gómez, que era ingeniero civil, pero había estudiado Arquitectura, Antropología, Filosofía e Historia; yo ya había incursionado en la Historia, buscando soluciones, pero fue con él que descubrí "la Antropología" y sobre todo, "la Evolución".
              </p>
              <p className="mb-6">
                Familiarmente yo estaba en una época de "reencuentro" con mi familia, pues por mi trabajo, había descuidado el trato doméstico con la misma, y la decisión fue que, independientemente de mi trabajo, el verano y las fiestas de fin de año estaríamos juntos, y durante 17 años viajamos por todo el mundo, y los fines de año estudiábamos quince días. Eso y otras circunstancias provocaron que yo conociera más de 100 países y que realizara con mis hijos un viaje por todos los diferentes imperios de Occidente: empezamos en Egipto, Grecia, Roma, Venecia, Florencia, Francia, España, Austria, Inglaterra, etc., y con el tiempo identifiqué características de la cultura universal y tradiciones espirituales diversas, y que yo no capitalizara económicamente.
              </p>
            </section>

            <section className="mb-12">
              <p className="mb-6">
                A los 50 años, y producto de un engaño de un socio con el que yo creía que había establecido una relación de enorme trascendencia, con el cual estábamos desarrollando una idea mía a la que llamamos "club vacacional", que era una derivación de un tiempo compartido hotelero-recreacional que era exitosísimo, caí en el engaño de ese socio y vendí mis acciones a precio de remate sobre la base de que ambos vendríamos, pero en la trampa que me hizo, él se quedó con todas las acciones.
              </p>
              <p className="mb-6">
                Esa experiencia me llevó a la mayor depresión de toda mi vida cuando me di cuenta cómo me dejé engañar, y fue tan fuerte, que caí en cama tres meses, que los pasé en México, cuando mi familia estudiaba en la Universidad Iberoamericana.
              </p>
              <p className="mb-6">
                En mi vida ha habido tres amigos que han tenido enorme influencia en mí. Mi amigo José Calvo, que es al que le debo haberme ayudado a rescatar mis estudios universitarios, que había abandonado por la intensidad de vida que yo llevaba, y él me reorientó y auxilió en todos mis estudios. Óscar H. Villarreal, quien fue un elemento básico, pues establecimos, al inicio de las empresas con mis hermanos, una relación de trabajo que me impulsó enormemente a mi superación profesional y empresarial. Y Enrique Herrera, el cual, en esa depresión, se volvía mi apoyo más fuerte, pues mi familia no comprendía lo que yo estaba viviendo, y al verme en cama, se preocupaban más que ocuparse, y con él empecé a salir a Ixtapan de la Sal, en donde lentamente me fui recuperando.
              </p>
            </section>

            <section className="mb-12">
              <p className="mb-6">
                Y fue en ese momento en el que tomé una decisión que fue trascendental y que consistió en que me inscribí, con Inna, en la Universidad Iberoamericana a un curso de "desarrollo transpersonal", y en ese curso conocí a mi maestro Luis Brito Crabtree, que dio la materia de "Filosofía antropológica". Fue en esas clases y con las experiencias de las mismas, en donde yo descubrí que lo que me hacía falta, era recuperar mi fe en Dios que yo había perdido 30 años atrás. Con el maestro Brito conocí al profesor filósofo Porfirio Miranda, el cual con su libro "Hegel tenía razón", y con las pláticas que teníamos con seis jesuitas retirados, casados, en el estudio del profesor Porfirio, se consolidaron profundamente las bases de "Mi visión del mundo".
              </p>
              <p className="mb-6">
                Esa consolidación me permitió terminar el libro "Yo soy nosotros", que recibí el primer lugar de la industria editorial de 2003, como ensayo filosófico. Y ese fue el final de mi búsqueda espiritual y de aquello que yo llamaba mi "angustia existencial".
              </p>
              <p className="mb-6">
                Regresé a Cancún a incorporarme en la formación del Grupo Xcaret, en el cual éramos socios los tres hermanos con el Arq. Quintara, y como fundador y director de administración, finanzas, etc., colaboré 25 años.
              </p>
            </section>

            <section className="mb-12">
              <p className="mb-6">
                Sin embargo, me llevó llegar a los 81 años, para que, en el confinamiento de la pandemia, en la noche del 31 de diciembre del 2020, yo lograra escribir los 20 principios que rigen mis valores y "Mi visión del mundo", sobre los cuales "he tratado" de regir mi vida en esta etapa de la misma.
              </p>
              <p className="mb-6">
                Ahora, al decir que "al irme me quedo en los demás", quiero decir que, la diferencia de lo que yo era, al llegar y al ser que era en mi adolescencia, a lo que soy y pienso ahora, esa diferencia es a lo que llamo "mi propia evolución", mi propia "visión del mundo"; es lo que me hace decir que "evolucionar es ser", y ese ser que soy ahora, es el que se queda en las personas que he tenido la fortuna de tener cerca: mi esposa, hijos, familiares, amigos, compañeros de trabajo, y también en mis escritos, como el presente.
              </p>
              <p className="mb-6">
                Eso confirma "al yo que se hace a través del otro", como yo me hice al principio, y mi declaración de "Mi visión del mundo" es lo que queda de mí en los demás, cuando yo me vaya.
              </p>
              <p className="mb-6">
                En resumen, nunca he llegado, ni nunca me iré; siempre he permanecido a través de los otros, mientras la humanidad exista y el espíritu se continúe manifestando y continúe "la espiritualización de la materia".
              </p>
            </section>

            {/* Credo Personal */}
            <section className="mt-16 border-t pt-12">
              <h2 className="text-3xl font-bold text-center mb-8">
                {language === 'es' ? 'Credo Personal' : 'Personal Creed'}
              </h2>

              <div className="space-y-4 bg-muted/30 p-8 rounded-lg">
                <div className="space-y-3">
                  <p><strong>I</strong> Creo que en el origen está Dios, diseñador y creador del universo.</p>

                  <p><strong>II</strong> Creo que mi credo se integra de las enseñanzas de seis grandes profetas y maestros: Moisés, Buda, Cristo, Charles Darwin, Hegel y Pierre Teilhard de Chardin; y de mis maestros personales: Ing. Miguel Beltrán Valenzuela, Ing. Luis B. Gómez, Prof. Luis Brito Crabtree y Prof. José Porfirio Miranda.</p>

                  <p><strong>III</strong> Creo que mi Dios nos crea a su imagen y semejanza.</p>

                  <p><strong>IV</strong> Creo que Dios para crear el universo utiliza el Big Bang, que tiene toda la información de la evolución del mismo. Información entre muchas como E=MC² (energía = material).</p>

                  <p><strong>V</strong> Creo que la evolución es, como dijo Teilhard de Chardin: "la espiritualización de la materia".</p>

                  <p><strong>VI</strong> Creo que para poder evolucionar, Dios nos dio el libre albedrío, la libertad de decidir y de crear como Él. Y de realizar nuestra propia "visión del mundo".</p>

                  <p><strong>VII</strong> Creo que la dirección de la evolución es la búsqueda de la verdad a través de la belleza, la justicia y la bondad.</p>

                  <p><strong>VIII</strong> Creo que como dijeron Buda y Hegel, Dios es el espíritu y se encuentra en todos nosotros, en nuestro potencial interior de amar.</p>

                  <p><strong>IX</strong> Creo que amor "es sacrificio" y que en el clímax de amor y sacrificio, el Cristo le pidió a su padre (su creador): "Perdónalos. No saben lo que hacen."</p>

                  <p><strong>X</strong> Creo que la clave de la evolución se encuentra en la obediencia de 7 de los mandamientos de la tradición judía del Antiguo Testamento (Moisés):</p>
                  <ol className="list-decimal ml-8 mt-2 space-y-1">
                    <li>Amarás a Dios sobre todas las cosas.</li>
                    <li>Honrarás a tu padre y a tu madre.</li>
                    <li>No matarás.</li>
                    <li>No robarás.</li>
                    <li>No darás falso testimonio, ni mentirás.</li>
                    <li>No consentirás pensamientos ni deseos impuros.</li>
                    <li>No codiciarás los bienes ajenos.</li>
                  </ol>

                  <p><strong>XI</strong> Creo que la virtud es la congruencia entre pensamiento y acto.</p>

                  <p><strong>XII</strong> Creo que la humanización consiste en el reconocimiento del otro, y es alejarnos de nuestro origen animal y nuestros instintos primarios, de nuestras fuerzas conscientes e inconscientes negativas, de nuestro egoísmo.</p>

                  <p><strong>XIII</strong> Creo que el "nuevo testamento" es el esclarecimiento de que Dios es el amor y de que Cristo, es el sacrificio del ser humano por el amor a los otros. Amor no es poesía, es sacrificio; el amor no es lo que recibimos, es lo que damos. Y recibes lo que das. Y das lo que eres.</p>

                  <p><strong>XIV</strong> Creo que el ejemplo más claro de amor se da en los más próximos. La compañera y los hijos, por los cuales estamos de acuerdo con el sacrificio voluntario de nuestra libertad, nuestro tiempo (vida) y de nuestro egoísmo, en la familia (confucio), padres, abuelos, hermanos. Todos, sobrinos, primos y en la familia por voluntad: "los amigos" y en todos "los otros".</p>

                  <p><strong>XV</strong> Creo que amar al prójimo como a ti mismo, es reconocer la hermandad de todos los humanos. Al ser hijos de un mismo Dios. Y se ejercita, respetando e impulsando los "derechos humanos".</p>

                  <p><strong>XVI</strong> Creo que el ser humano cumple el mandato de evolucionar al vencer sus egoísmos (el mal) y amar al prójimo (el bien), eso es el humanismo.</p>

                  <p><strong>XVII</strong> Creo que todo ser humano fue creado para ser feliz. El cielo y el infierno existen, pero durante nuestra vida, no después de la muerte. La felicidad surge de adentro hacia afuera, no de afuera hacia adentro y está en función de que cada ser humano encuentre su vocación, que le dé dirección y sentido a su propia vida y que descubra que, es en el servicio y reconocimiento del otro, en donde está la autorrealización del individuo.</p>

                  <p><strong>XVIII</strong> Creo que evolucionar es "ser". Y que "yo soy nosotros".</p>

                  <p><strong>XIX</strong> Creo que "al llegar, ya estaba aquí en los otros. Y "al irme", me quedaré en los otros.</p>

                  <p><strong>XX</strong> Creo que la diferencia de la visión del mundo que había cuando llegué, a la que yo tendré al irme, es lo que evolucioné con mi experiencia y criterio. Y "eso es lo que soy yo".</p>
                </div>
              </div>

              <div className="text-center mt-8">
                <p className="font-semibold">Cancún, Q. Roo</p>
                <p className="font-semibold">año M(XX)</p>
                <p className="font-bold text-lg mt-2">Marcos Constandse Madrazo</p>
              </div>
            </section>
          </div>
        </motion.div>
      </article>
    </PageWrapper>
  );
};

export default Vision;
