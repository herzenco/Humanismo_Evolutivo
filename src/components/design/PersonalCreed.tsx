export default function PersonalCreed({ title }: { title: string }) {
  return (
    <section id="credo-personal" aria-labelledby="credo-title" className="mt-16 border-t pt-12">
      <h2 id="credo-title" className="text-3xl font-bold text-center mb-8">
        {title}
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
  );
}
