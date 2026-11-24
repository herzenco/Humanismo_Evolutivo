import type { Language } from '@/lib/site';

type CourseObjectives = {
  general: string;
  specific: { label?: string; text: string }[];
};

type Preview = {
  summary: string;
  summaryPending?: true;
  objectives?: CourseObjectives;
  venue?: string;
  title: string;
  lesson: string;
  exercise: string;
  credit?: string;
};

const historiaEvolutivaDelArteObjectives: Record<Language, CourseObjectives> = {
  es: {
    general: "Explorar cómo el ser humano, a través de su aparato perceptual, ha buscado comunicarse, encontrar la belleza y expresar su sentido de vida mediante una diversidad de recursos y herramientas visuales, táctiles, gustativas, auditivas y kinestésicas.",
    specific: [
      { label: "Analizar la percepción sensorial:", text: "Examinar el papel del aparato perceptual humano como el canal fundamental para interpretar, experimentar y dar significado al entorno a lo largo de la historia." },
      { label: "Identificar los lenguajes expresivos:", text: "Estudiar las diferentes herramientas y recursos visuales, táctiles, gustativos, auditivos y kinestésicos empleados por distintas culturas para plasmar su visión del mundo." },
      { label: "Comprender el arte como búsqueda de sentido:", text: "Profundizar en cómo las creaciones artísticas reflejan la necesidad humana de trascendencia, comunicación profunda y búsqueda de la belleza en la experiencia vital." },
    ],
  },
  en: {
    general: "To explore how human beings, through their perceptual faculties, have sought to communicate, find beauty and express their sense of life through a wide range of visual, tactile, gustatory, auditory and kinesthetic resources and tools.",
    specific: [
      { label: "Analyze sensory perception:", text: "Examine the role of the human perceptual apparatus as the fundamental channel for interpreting, experiencing and giving meaning to the environment throughout history." },
      { label: "Identify expressive languages:", text: "Study the visual, tactile, gustatory, auditory and kinesthetic tools and resources that different cultures have used to express their view of the world." },
      { label: "Understand art as a search for meaning:", text: "Explore how artistic creations reflect the human need for transcendence, deep communication and the search for beauty in lived experience." },
    ],
  },
};

const filosofiaParaNinosObjectives: Record<Language, CourseObjectives> = {
  es: {
    general: "Despertar la curiosidad, el asombro y el gusto por pensar en niños y niñas mediante experiencias de diálogo, juego y exploración de la naturaleza, que les permitan descubrir nuevas ideas, hacer preguntas sobre el mundo y desarrollar un pensamiento crítico, creativo y cuidadoso con los demás y con su entorno.",
    specific: [
      { text: "Estimular el pensamiento crítico mediante preguntas, argumentos y la exploración de diferentes puntos de vista." },
      { text: "Fomentar el pensamiento creativo a través de la imaginación, la formulación de hipótesis y la búsqueda de nuevas posibilidades." },
      { text: "Desarrollar el pensamiento cuidadoso, promoviendo la empatía, la escucha, el respeto y la reflexión sobre cómo nuestras decisiones afectan a los demás y a la naturaleza." },
      { text: "Aprovechar el entorno natural del parque como un espacio de asombro, observación, descubrimiento y reflexión filosófica." },
      { text: "Fortalecer el diálogo y la construcción colectiva de ideas, aprendiendo a escuchar, expresar opiniones y cuestionar respetuosamente." },
      { text: "Invitar a niños y niñas a explorar preguntas sobre la vida, la amistad, la justicia, las emociones, la naturaleza y nuestra relación con el mundo." },
    ],
  },
  en: {
    general: "To awaken curiosity, wonder and a love of thinking in children through experiences of dialogue, play and exploring nature that let them discover new ideas, ask questions about the world and develop critical, creative and caring thinking toward others and their surroundings.",
    specific: [
      { text: "Stimulate critical thinking through questions, arguments and exploring different points of view." },
      { text: "Encourage creative thinking through imagination, forming hypotheses and searching for new possibilities." },
      { text: "Develop caring thinking by promoting empathy, listening, respect and reflection on how our decisions affect others and nature." },
      { text: "Use the park's natural setting as a space for wonder, observation, discovery and philosophical reflection." },
      { text: "Strengthen dialogue and the collective building of ideas, learning to listen, express opinions and question respectfully." },
      { text: "Invite children to explore questions about life, friendship, justice, emotions, nature and our relationship with the world." },
    ],
  },
};

const historiaDeLasReligionesObjectives: Record<Language, CourseObjectives> = {
  es: {
    general: "Estudiar de manera objetiva, crítica e imparcial la evolución histórica, los fundamentos y el impacto cultural de las diversas tradiciones religiosas de la humanidad, manteniendo una perspectiva neutral que fomente el análisis académico sin pretender convencer ni dirigir a los participantes hacia ninguna fe o creencia en particular.",
    specific: [
      { label: "Examinar el desarrollo histórico:", text: "Analizar el surgimiento, la expansión y las transformaciones de las principales religiones en su contexto sociocultural a lo largo del tiempo." },
      { label: "Comprender los sistemas de creencias:", text: "Distinguir los textos y los principios éticos de cada tradición desde una perspectiva filosófica." },
      { text: "Proveer un espacio de estudio basado en el respeto y la objetividad permitiendo a los participantes valorar la diversidad espiritual del mundo." },
    ],
  },
  en: {
    general: "To study, objectively, critically and impartially, the historical development, foundations and cultural impact of humanity's diverse religious traditions, keeping a neutral perspective that encourages academic analysis without seeking to persuade participants or steer them toward any particular faith or belief.",
    specific: [
      { label: "Examine historical development:", text: "Analyze the emergence, expansion and transformation of the major religions in their sociocultural context over time." },
      { label: "Understand belief systems:", text: "Distinguish the texts and ethical principles of each tradition from a philosophical perspective." },
      { text: "Provide a space for study grounded in respect and objectivity, allowing participants to appreciate the world's spiritual diversity." },
    ],
  },
};

// The four courses with an online curriculum use their opening lesson as the basis
// for the sample. The remaining samples are introductory activities written for this site.
// Public summaries and venues use HE_contenido_paginas_cursos_2027.md.
export const schoolCoursePreviews: Record<string, Record<Language, Preview>> = {
  'humanismo-evolutivo-transpersonal': {
    es: {
      summary: "Un recorrido guiado, clase por clase, por Introducción al Humanismo Evolutivo Transpersonal, del Ing. Marcos Constandse Madrazo: la obra que reúne en un solo texto su visión de la evolución, la conciencia y la ética.",
      venue: "Jardín de la Filosofía, Parque Cancún",
      title: 'La pregunta que abre el curso',
      lesson: 'El prólogo de Marcos Constandse invita a leer con espíritu crítico y a preguntarse qué tipo de ser humano se forma detrás de cada obra material.',
      exercise: 'Elige algo que hayas construido o mejorado. ¿Qué aprendiste al hacerlo y a quién benefició tu trabajo?',
    },
    en: {
      summary: "A guided, class-by-class reading of Introducción al Humanismo Evolutivo Transpersonal by Ing. Marcos Constandse Madrazo, the book that brings together his view of evolution, consciousness and ethics in a single text.",
      venue: "Garden of Philosophy (Jardín de la Filosofía), Parque Cancún",
      title: 'The question that opens the course',
      lesson: 'Marcos Constandse’s prologue invites readers to think critically and ask what kind of person is shaped by the work they do.',
      exercise: 'Choose something you built or improved. What did you learn, and who benefited from your work?',
    },
  },
  'yo-soy-nosotros': {
    es: {
      summary: "Lectura metódica de Yo soy nosotros. Una visión transpersonal del mundo, el primer libro del Ing. Marcos Constandse Madrazo: del cosmos y la vida a la filosofía, la psicología y las tradiciones espirituales.",
      venue: "Jardín de la Filosofía, Parque Cancún",
      title: '¿Por dónde comenzar?',
      lesson: 'Los prólogos del libro parten de una crisis de sentido. La primera clase usa esa experiencia para examinar cómo nuestras creencias orientan lo que hacemos.',
      exercise: 'Escribe una creencia que haya cambiado con el tiempo. ¿Qué experiencia te llevó a reconsiderarla?',
    },
    en: {
      summary: "A methodical reading of Yo soy nosotros. Una visión transpersonal del mundo (\"I Am We: A Transpersonal View of the World\"), the first book by Ing. Marcos Constandse Madrazo, moving from the cosmos and life to philosophy, psychology and spiritual traditions.",
      venue: "Garden of Philosophy (Jardín de la Filosofía), Parque Cancún",
      title: 'Where should we begin?',
      lesson: 'The book’s prologues start with a crisis of meaning. The opening lesson uses that experience to examine how beliefs guide what we do.',
      exercise: 'Write down a belief that changed over time. What experience led you to reconsider it?',
    },
  },
  'ecologia-y-espiritualidad': {
    es: {
      summary: "Un curso monográfico sobre Ecología y espiritualidad, del Ing. Marcos Constandse Madrazo: la relación del ser humano con la biosfera, vista desde el imperativo ético y los niveles de conciencia, con un ejercicio de aplicación en cada clase.",
      venue: "Jardín de la Filosofía, Parque Cancún",
      title: 'La biosfera como hogar',
      lesson: 'La introducción del curso propone mirar la biosfera como el hogar compartido del que dependen nuestras decisiones cotidianas.',
      exercise: 'Elige un hábito diario y sigue el rastro de un recurso que consumes. ¿Qué cambiaría si tuvieras en cuenta su origen y su destino?',
    },
    en: {
      summary: "A course on Ecología y espiritualidad by Ing. Marcos Constandse Madrazo: the relationship between human beings and the biosphere, seen through the ethical imperative and the levels of consciousness, with a hands-on exercise in every class.",
      venue: "Garden of Philosophy (Jardín de la Filosofía), Parque Cancún",
      title: 'The biosphere as home',
      lesson: 'The opening lesson frames the biosphere as our shared home and connects it to the choices we make every day.',
      exercise: 'Choose a daily habit and trace one resource it consumes. What would change if you considered both its origin and its destination?',
    },
  },
  'introduccion-a-la-filosofia': {
    es: {
      summary: "Un recorrido por la historia del pensamiento occidental, de los primeros filósofos griegos al existencialismo, para conocer las grandes preguntas que el ser humano se ha formulado durante veinticinco siglos.",
      credit: 'Curso basado en la obra de Luis B. Gómez y de Marcos Constandse.',
      title: 'De una opinión a un argumento',
      lesson: 'Un argumento presenta razones que permiten examinar una idea. Para comprobar su alcance, conviene ponerlo a prueba con un caso que podría contradecirlo.',
      exercise: 'Escribe una opinión sobre qué hace justa una decisión. Da una razón y busca un ejemplo que ponga esa razón a prueba.',
    },
    en: {
      summary: "A journey through the history of Western thought, from the first Greek philosophers to existentialism, to explore the great questions human beings have asked for twenty-five centuries.",
      title: 'From an opinion to an argument',
      lesson: 'An argument gives reasons that others can examine. A case that might contradict it can help test how far those reasons hold.',
      exercise: 'Write down an opinion about what makes a decision fair. Give one reason, then find an example that tests it.',
    },
  },
  'introduccion-a-la-antropologia': {
    es: {
      summary: "Una introducción a la antropología como estudio del ser humano en su totalidad biológica, cultural y social: de la evolución y la adaptación al poblamiento, las civilizaciones y las grandes teorías etnológicas.",
      credit: 'Curso basado en la obra de Luis B. Gómez y de Marcos Constandse.',
      title: 'Observar antes de interpretar',
      lesson: 'Una misma práctica puede tener sentidos distintos para quienes participan en ella. La observación ayuda a distinguir lo que vemos de lo que suponemos.',
      exercise: 'Describe una comida familiar sin interpretar su significado. Después, escribe una pregunta que harías a alguien que participa en ella.',
    },
    en: {
      summary: "An introduction to anthropology as the study of the human being in its biological, cultural and social whole: from evolution and adaptation to human settlement, civilizations and the major ethnological theories.",
      title: 'Observe before interpreting',
      lesson: 'The same practice can mean different things to its participants. Observation helps separate what we see from what we assume.',
      exercise: 'Describe a family meal without interpreting it. Then write one question you would ask somebody who takes part.',
    },
  },
  'historia-evolutiva-del-arte': {
    es: {
      summary: historiaEvolutivaDelArteObjectives.es.general,
      objectives: historiaEvolutivaDelArteObjectives.es,
      title: 'Dos obras, dos maneras de mirar',
      lesson: 'Comparar obras de épocas distintas permite observar cómo cambian los materiales, las formas y las funciones que una sociedad les atribuye.',
      exercise: 'Elige dos retratos de épocas distintas. Describe una diferencia en la composición y plantea qué pregunta sobre su contexto te ayudaría a entenderla.',
    },
    en: {
      summary: historiaEvolutivaDelArteObjectives.en.general,
      objectives: historiaEvolutivaDelArteObjectives.en,
      title: 'Two works, two ways of seeing',
      lesson: 'Comparing works from different periods reveals changes in materials, forms, and the purposes people assign to art.',
      exercise: 'Choose two portraits from different periods. Describe a difference in their composition and pose a question about context that could help explain it.',
    },
  },
  'el-arte-de-ser-empresario': {
    es: {
      summary: "Un curso monográfico sobre El arte de ser empresario (3.ª ed., 2025), impartido por su autor, el Ing. Marcos Constandse Madrazo: el trabajo, el capital, el mercado y la ética de quien emprende.",
      venue: "Jardín de la Filosofía, Parque Cancún",
      title: 'El impulso evolutivo y la razón de ser empresario',
      lesson: 'La primera clase conecta la vocación empresarial con el trabajo y la manera en que una organización contribuye al bienestar de otros.',
      exercise: 'Piensa en una empresa que conozcas. Identifica una decisión que beneficie a alguien más allá de sus propietarios y explica cómo.',
    },
    en: {
      summary: "A course on El arte de ser empresario (3rd ed., 2025), taught by its author, Ing. Marcos Constandse Madrazo: work, capital, the market and the ethics of those who build businesses.",
      venue: "Garden of Philosophy (Jardín de la Filosofía), Parque Cancún",
      title: 'The evolutionary impulse and the purpose of enterprise',
      lesson: 'The opening class connects entrepreneurial vocation with work and the ways an organization can support the welfare of others.',
      exercise: 'Think of a business you know. Identify one decision that benefits someone beyond its owners and explain how.',
    },
  },
  'historia-de-las-religiones': {
    es: {
      summary: historiaDeLasReligionesObjectives.es.general,
      objectives: historiaDeLasReligionesObjectives.es,
      title: 'El significado de un rito',
      lesson: 'Una práctica religiosa adquiere sentido en su contexto. Dos celebraciones pueden compartir un gesto y darle significados diferentes.',
      exercise: 'Elige dos celebraciones en las que se use luz. Describe el gesto compartido y formula una pregunta sobre su significado en cada tradición.',
    },
    en: {
      summary: historiaDeLasReligionesObjectives.en.general,
      objectives: historiaDeLasReligionesObjectives.en,
      title: 'The meaning of a ritual',
      lesson: 'A religious practice takes on meaning in context. Two celebrations may share a gesture while giving it different meanings.',
      exercise: 'Choose two celebrations that use light. Describe the shared gesture and pose a question about its meaning in each tradition.',
    },
  },
  'filosofia-para-ninos': {
    es: {
      summary: filosofiaParaNinosObjectives.es.general,
      objectives: filosofiaParaNinosObjectives.es,
      title: '¿Qué significa compartir?',
      lesson: 'Una pregunta común puede abrir un diálogo filosófico. Escuchar un ejemplo distinto ayuda a descubrir ideas que al principio pasamos por alto.',
      exercise: 'Imagina que tres amigos tienen que repartir dos manzanas. Propón una solución y explica por qué te parece justa.',
    },
    en: {
      summary: filosofiaParaNinosObjectives.en.general,
      objectives: filosofiaParaNinosObjectives.en,
      title: 'What does it mean to share?',
      lesson: 'An everyday question can open a philosophical discussion. Hearing a different example can reveal ideas we overlooked at first.',
      exercise: 'Imagine three friends have two apples to share. Suggest a solution and explain why you think it is fair.',
    },
  },
};
