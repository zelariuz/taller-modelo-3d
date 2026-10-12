// Modelo del taller: fuente de verdad de medidas, piezas y verificaciones (cm).
// Script clásico: en el navegador publica window.ModeloTaller; en Node se exporta con module.exports.
(function (raiz) {
  const PARAMETROS_ACORDADOS = {
    x0: 0,                   // orilla izquierda del taller (lado de la muralla vecina)
    ancho: 350, fondo: 300,
    pilar: 9,
    pendiente: 0.03,
    techoMuro: 290,          // cara superior de las vigas de techo junto al muro (ADR 0006)
    vigaTechoH: 14, vigaPerimetralH: 14,
    goma: 1.5, gomaLado: 15,
    soleraH: 4.5, soleraAncho: 9,
    filasZ: [9, 150, 295.5], // fila trasera por delante de la viga de apoyo
    apoyoY: 236, apoyoH: 19, apoyoEspesor: 4.5, // viga de apoyo en la cadena (230–260)
    pernoY: 250, pernoX0: 30, pernoPaso: 72,     // pernos a 250, dentro de la cadena
    largoComercial: 3.2,                         // m, largo máximo de pieza comercial habitual
    largosComerciales: [3.2, 3.6, 4.0, 4.8],     // m, largos que se consiguen (los mayores, por encargo)
    vigasTecho: 7,                               // vigas de techo sobre el esqueleto (~58 cm) + 1 en el alero lateral
    // vanos sin diagonal porque los ocupa una abertura (puerta tapada, ventana del frente, portón)
    vanosAbiertos: ['trasera-izq', 'frente-izq', 'derecha-frontal'],
    diagonalSeccion: [4.5, 9],                   // 2 × 4"
    diagonalDespeje: 10,                         // la diagonal parte 10 sobre la base y termina 5 bajo su tope
    travesanoY: 165, travesanoSeccion: [4.5, 9], // travesaño a ~170 (165–174), bajo las franjas altas
    portonAlto: 200, portonAncho: 140, portonEspesor: 4, portonSeparacion: 3, // hoja colgante (ADR 0005)
    rielH: 5, rielAncho: 6,
    puertaX: 60, puertaAncho: 75, puertaAlto: 210, escalon: 18, // puerta tapada del muro (medida)
    franjaY: 172,                                // franjas altas: de 172 hasta el cielo
    cieloMuro: 238, cieloFrente: 249,            // cielo invertido (ADR 0008)
    dintel: 228,                                 // dintel de la puerta tapada (medido)
    esquinaCasa: 375,                            // el techo llega a la esquina de la casa (ADR 0003)
    anchoTecho: null,                            // null = hasta la esquina (esquinaCasa − x0)
    vigaTechoAncho: 4.5,
    bajadaX: [357, 365],                         // bajada de aguas lluvias de la casa (Ø 8, centro 361)
    aleroFrontal: 30,                            // alero frontal con sofito (ADR 0004)
    parapeto: 20, cubiertaH: 1.8,                // parapeto en muro y costados (el frente queda libre para el agua)
    canaleta: { alto: 10, ancho: 12 },           // canaleta frontal colgada bajo el alero
    bajadaRadio: 4, bajadaCorteBajoTecho: 8,     // la bajada se corta 8 bajo el techo y sigue con un codo
    pozoLado: 40,                                // pozo de grava al pie de la cadena de lluvia
    bajadaTope: 500,                             // la bajada de la casa baja desde el techo de la casa
    catioFondo: 220, catioPasoPostes: 110,       // postes del catio sobre las vigas de techo
    catioAlto: null,                             // null = el de la opción de catio elegida
    ventanaDormitorio: { x: 135, ancho: 135, alfeizar: 350, alto: 98 }, // 2º piso, sobre el taller (medida)
    mallaAncho: 90, mallaRollo: 30, mallaMargenMin: 3,                  // rollo comprado: 90 cm × 30 m
    cajaVentanaFondo: 40,
    // escalera bajo la hoja izquierda de la ventana (la que abre): repisa y peldaños de ~19 hasta el techo
    escaleraGatas: { x: 140, ancho: 60, repisaBajoAlfeizar: 2, peldano: 19, peldanos: 2, fondo: 30 },
    desnivelGatasMax: 25,                        // gatas de 16–17 años saltan ~40 cm; se deja holgura
    rincon: { x: 285, ancho: 80, fondo: 60, alto: 55 }, // rincón con sombra contra el muro
    cajaPuertaCatio: { x: 150, ancho: 70 },      // puerta de malla en el frente del catio, hacia la franja libre
    franjaLibreMin: 60,                          // para pararse frente a la puerta del catio sin pisar la canaleta
    chimeneaSobreCatio: 60,                      // la salida del calefón debe quedar bien por encima del catio (monóxido)
    posteCatio: 4, puertaCatioEspesor: 3, cajaVentanaMargen: 5, membranaH: 0.4,
    techoRincon: { espesor: 3, vuelo: 5 },
    // piso (ADR 0009): goma + durmientes acostados, lana entre durmientes, OSB 18 + terciado 12 + terminación
    // durmientes 2 × 4" ACOSTADOS (9 × 4,5): de canto el piso sube 2,5 cm y la altura libre del frente baja de 240
    durmientePaso: 40, durmienteX0: 12, durmienteSeccion: [9, 4.5], gomaPisoH: 1,
    pisoZ: [12, 291],                            // entre soleras
    capasPiso: { osb: 1.8, terciado: 1.2, terminacion: 0.3 },
    corteEscalonado: [25, 60, 95],               // el dibujo recorta cada capa para verla en corte desde el frente
    durmientePasoMax: 40,                        // máximo de la ADR 0009 (el paso de diseño puede cambiar; este no)
    placa: [1.22, 2.44],                         // formato de placa (m)
    pernoPlataformaPaso: 50,                     // pernos de la plataforma a la solera
    // muros (ADR 0010): un panel por vano, salvo el muro de la casa y el vano del portón
    vanosSinPanel: ['derecha-frontal'],
    zonaCaliente: ['izquierda-frontal', 'frente-izq'],          // vanos junto a la fundición
    interiorPanel: 'OSB 18 mm (se puede colgar donde sea)',
    interiorZonaCaliente: 'Fibrocemento 8 mm (incombustible) sobre el OSB',
    montantePaso: 60, panelEspesor: 1.8, fibrocementoInterior: 0.8,
    zocaloAlto: 30, zocaloEspesor: 1, zocaloSeparacion: 1,   // por fuera del perímetro, con burlete
    // interior (propuesta): huellas en planta (x, z) y áreas de uso
    mesa: { x: 9, z: 70, ancho: 50, largo: 110, alto: 92, cubierta: 4, vuelo: 2 }, // mesa de joyero, costado sur (izquierdo)
    // laminador sobre su banco contra el muro; manivela hacia el frente (largo = radio del barrido)
    laminador: { x: 222, z: 12, lado: 56, banco: 70, alto: 32, margen: 8, manivelaAlto: 19, manivelaLargo: 28, barridoAncho: 20 },
    lavadora: { x: 290, z: 17, lado: 52, alto: 85, bandeja: 5, bandejaAlto: 4, goma: 1, carga: 40 }, // esquina trasera derecha
    fundicion: [[6, 294], [106, 294], [106, 250], [56, 200], [6, 200]], // esquina frontal izq. con chaflán
    fundicionAlto: 60, pararse: { x: 98, z: 192, radio: 22 },
    distanciaFundicion: 50,                                            // menos que esto: despejar la mesa al fundir
    yunqueArea: 60,                                                    // área de trabajo Ø 120
    pasadaAncho: 80, pasadaInicioZ: 30,                                // la pasada arranca recién pasada la puerta
    puertaBisagra: 'derecha',                                          // con bisagra a la izquierda la hoja barre la mesa
    // costado norte de la casa (medido o estimado de las fotos): el muro corre desde la esquina hacia el interior (z < 0)
    muroNorte: { x: 355, espesor: 20, z: [-520, -25] },
    cadenaCasa: [230, 260], muroCasaTope: 500, radierCostado: 420,   // cadena medida; alto y radier del costado estimados
    ventanaBano: { z: -90, y: 110, ancho: 70, alto: 75 }, ventanaCocina: { z: -255, y: 100, ancho: 80, alto: 115 },
    puertaReja: { z: -335, ancho: 80, alto: 210 },
    calefon: { z: -175, y: 120, ancho: 60, alto: 80, fondo: 18, chimeneaZ: -145, chimeneaRadio: 5, chimeneaTope: 500 },
    llave: { z: -192, y: 55 }, sumidero: { z: -270, lado: 40 },
    zonaAutos: { x: 420, z: -480, ancho: 340, largo: 470 },
    // servicios de la lavadora por fuera, pegados al muro norte (CONTEXT: lavadora); planta (x, z), de la lavadora al tubo
    // los trazados parten de la lavadora y corren a una distancia fija de la cara exterior del muro norte
    serviciosSeparacionMuro: 5, desagueDiametro: 4, aguaDiametro: 2,
    desagueSalidaY: 105,                         // altura de salida de la manguera (confirmar en el manual Samsung)
    desaguePendiente: 0.03, desaguePendienteMin: 0.02, desaguePendienteMax: 0.04,
    desaguePendientes: {},                       // pendiente propia de un tramo, por nombre (si difiere de la general)
    tuboExistente: { z: -245, radio: 2.5, alto: 90 }, // a ~2,45 m de la esquina (foto: 1,9–2,2 m ± 30 cm)
    camaraAire: 3, desagueSellado: false,
    aguaY: 60,                                   // la llave existente está a ~60 del suelo; el agua va a esa altura
    canaletaServicios: { y: 50, alto: 55, ancho: 10 }, // envuelve agua y desagüe a lo largo del muro norte (zona de autos)
    registro: { x: 290, z: 200, lado: 40 },      // registro en la pasada del portón (siempre libre)
    yunque: { x: 175, z: 245, pedestalAlto: 75, pedestalRadio: 18, holgura: 3, largo: 28, ancho: 16, alto: 10 }, // pedestal al radier
    alturaLibreMin: 240,                         // bajo la viga frontal (portón, materiales largos)
    // extracción (ADR 0007): cada captación con su ducto y por dónde sale ('frente', 'costado', 'techo', 'muro-casa')
    ductoLado: 12, extractor: { y: 178, lado: 30, fondo: 12 }, // ductos y extractor en el frente
    entradaAire: { x: 200, y: 20, ancho: 40, alto: 15 },       // rejilla baja en el frente, lejos de la puerta
    cieloEspesor: 1.2,
    extraccion: [
      { nombre: 'campana sobre la fundición', salida: 'frente' },
      { nombre: 'rejilla alta junto al muro (respaldo, con ventilador)', salida: 'frente' },
    ],
    ventanaFrente: { x: 25, y: 90, ancho: 125, alto: 70 }, // ventana normal en el vano frontal izq.
  };

  const fmt = n => n.toFixed(2).replace('.', ',');

  // Catálogo de opciones: cada punto de decisión con sus alternativas (para el presupuesto)
  const IMPREGNADO = 'Pino radiata impregnado, cepillado';
  const OPCIONES = [
    { id: 'madera', titulo: 'Madera de la estructura', afecta: ['Pilar', 'Solera perimetral', 'Viga perimetral superior', 'Viga de apoyo en la cadena', 'Viga de techo', 'Diagonal', 'Travesaño', 'Durmiente del piso', 'Panel de muro'], alternativas: [
      { id: 'A', nombre: 'Pino radiata impregnado', recomendada: true,
        ventajas: 'Estándar para exterior, se consigue en cualquier ferretería, resiste humedad e insectos, precio medio.',
        desventajas: 'Color verdoso; cada corte se repinta con preservante; no debe quedar expuesto al calor de la fundición.',
        especificar: () => IMPREGNADO },
      { id: 'B', nombre: 'Mixta: impregnado afuera y abajo, pino seco adentro',
        ventajas: 'Interior más limpio y claro; algo más barata; la madera seca se deforma menos.',
        desventajas: 'Hay que controlar qué pieza es de qué tipo; el pino seco expuesto a humedad dura poco.',
        especificar: clase => clase === 'interior' ? 'Pino seco en cámara, cepillado, con protector' : IMPREGNADO },
      { id: 'C', nombre: 'Pilares de madera dura, el resto impregnado',
        ventajas: 'Pilares muy durables y rígidos, mejor aspecto.',
        desventajas: 'Más cara y pesada (se nota al desarmar); escuadrías menos estándar; pretaladrar para los pernos.',
        especificar: clase => clase === 'pilar' ? 'Madera dura (eucalipto o nativa), pretaladrada' : IMPREGNADO },
    ] },
    { id: 'membrana', titulo: 'Membrana del techo (clara, transitable, antideslizante)', afecta: ['Membrana del techo'], alternativas: [
      { id: 'A', nombre: 'Membrana líquida elastomérica blanca con arena', recomendada: true,
        ventajas: 'Clara (refleja el sol), sin uniones, se aplica con rodillo sobre el OSB con malla de refuerzo; se repara con brocha. La arena de cuarzo en la última mano la hace antideslizante para las gatas.',
        desventajas: 'Hay que repintar una mano cada 4–6 años; necesita días secos para aplicarla.',
        material: 'membranaBlanca',
        especificacion: 'Membrana líquida elastomérica (poliuretano o acrílica) blanca, 3 manos con malla de refuerzo; última mano con arena de cuarzo: superficie clara y antideslizante' },
      { id: 'B', nombre: 'Membrana asfáltica autoprotegida con gránulo claro',
        ventajas: 'Barata y muy conocida por los instaladores; buena impermeabilización.',
        desventajas: 'Se suelda con soplete sobre madera (riesgo); el gránulo se suelta con el tránsito y es menos clara.',
        material: 'membranaGranulo',
        especificacion: 'Membrana asfáltica 4 mm autoprotegida con gránulo mineral claro, sobre OSB con imprimante; superficie clara y antideslizante por el gránulo' },
      { id: 'C', nombre: 'Lámina de PVC o TPO blanca con pasillos de caucho',
        ventajas: 'La más durable (20 años o más) y muy blanca; los pasillos de caucho son antideslizantes y protegen la lámina.',
        desventajas: 'La más cara; requiere instalador especializado; uniones termosoldadas.',
        material: 'membranaPvc',
        especificacion: 'Lámina de PVC o TPO blanca 1,2 mm termosoldada sobre geotextil; pasillos de palmetas de caucho: superficie clara y antideslizante' },
    ] },
    { id: 'anclajes', titulo: 'Anclajes extra al radier', afecta: ['Anclaje al radier'], alternativas: [
      { id: 'A', nombre: 'Sin anclajes al radier', recomendada: true, anclajes: 0,
        ventajas: 'Respeta la decisión de no perforar el radier; la estabilidad la dan la cadena, las diagonales y el peso del interior. Se mantiene mientras no se ubiquen las cámaras de inspección.',
        desventajas: 'Si bajo el borde del patio no pasa ninguna cámara ni tubería, se pierde una ayuda barata contra el viento.' },
      { id: 'B', nombre: '3 anclajes desmontables en el borde del patio', anclajes: 3,
        ventajas: 'Más resistencia al viento en el frente, que es el lado con alero; se sueltan con llave para desarmar.',
        desventajas: 'Perforar el radier: antes hay que ubicar las cámaras de inspección y tuberías para no romperlas.' },
    ] },
    { id: 'revestimiento', titulo: 'Revestimiento exterior de los muros', afecta: ['Panel de muro'], alternativas: [
      { id: 'A', nombre: 'Lata prepintada clara', recomendada: true, material: 'lata',
        ventajas: 'Liviana, rápida de montar y desmontar, clara (refleja el sol); con la cámara de aire no se condensa por dentro.',
        desventajas: 'Con la brisa salina hay que cuidar cortes y tornillos (sellar cantos, tornillos con golilla); suena con la lluvia si no lleva lana.',
        especificacion: 'Lata prepintada clara (zincalum prepintado) 0,4 mm; tornillos autoperforantes galvanizados en caliente o inoxidables con golilla EPDM; forros en bordes y esquinas' },
      { id: 'B', nombre: 'Fibrocemento siding', material: 'fibrocemento',
        ventajas: 'No se oxida con la costa, incombustible, se pinta del color que se quiera.',
        desventajas: 'Más pesado y frágil al desarmar; hay que pintarlo; más mano de obra.',
        especificacion: 'Fibrocemento siding 6 mm traslapado, fijado con clavos o tornillos inoxidables, pintado claro' },
      { id: 'C', nombre: 'Tinglado de pino impregnado', material: 'tinglado', combustible: true,
        ventajas: 'Aspecto cálido de madera; fácil de reparar por tabla.',
        desventajas: 'Hay que repintar o reimpregnar cada pocos años; combustible (no junto a la fundición); se mueve con la humedad.',
        especificacion: 'Tinglado de pino impregnado 1 × 6", fijaciones inoxidables, con protector de poro abierto' },
    ] },
    { id: 'terminacionPiso', titulo: 'Terminación del piso', afecta: ['Terminación del piso'], alternativas: [
      { id: 'A', nombre: 'Vinílico claro en rollo', recomendada: true, material: 'vinilo',
        ventajas: 'Liso y claro: una piedra o una limadura que cae se ve y se recoge; se limpia fácil y es barato.',
        desventajas: 'Una pieza caliente o una herramienta pesada que cae lo puede marcar; cerca de la fundición conviene una plancha incombustible encima.',
        especificacion: 'Vinílico en rollo color claro, liso, pegado sobre el terciado, con juntas soldadas' },
      { id: 'B', nombre: 'Goma lisa en rollo',
        ventajas: 'Amortigua golpes y caídas de herramientas; antideslizante y silencioso.',
        desventajas: 'Más cara; los colores claros son escasos (cuesta ver piezas pequeñas) y se mancha con aceite.',
        material: 'gomaLisa',
        especificacion: 'Goma lisa en rollo de 3 mm, el color más claro disponible, pegada sobre el terciado' },
    ] },
    { id: 'rutaServicios', titulo: 'Ruta del agua y el desagüe de la lavadora', afecta: ['Conexión por el baño'], alternativas: [
      { id: 'A', nombre: 'Por fuera, pegados al muro norte', recomendada: true,
        ventajas: 'Reversible: no se rompe nada de la casa; se ve y se repara; usa la llave y el tubo de desagüe que ya existen.',
        desventajas: 'Queda a la vista y en la zona de autos necesita canaleta de protección; el agua expuesta puede helarse en invierno (aislar el tramo).',
        piezas: () => [] },
      { id: 'B', nombre: 'Por dentro, a través del baño',
        ventajas: 'No queda nada a la vista por fuera; tramos más cortos.',
        desventajas: 'Descartada: hay que romper cerámica y muro del baño, y deja de ser desarmable. Se documenta solo para comparar en el presupuesto.',
        piezas: () => [{ elemento: 'Conexión por el baño', escuadria: 'Pasada por el muro del baño', cantidad: 1, largo: null,
          especificacion: 'Romper muro y cerámica del baño, conectar a la red interior de agua y al desagüe del baño, reponer terminaciones' }] },
    ] },
    { id: 'catio', titulo: 'Catio de las gatas sobre el techo', afecta: ['Malla del catio', 'Poste del catio', 'Puerta del catio', 'Caja de malla en la ventana'], alternativas: [
      { id: 'A', nombre: 'Catio cerrado de 180 cm (2 corridas de malla)', recomendada: true, alto: 180, cajaVentana: false,
        ventajas: 'El techo de malla queda por encima de la ventana del dormitorio: las gatas entran y salen por la ventana sin escaparse, y una persona puede entrar a limpiar casi de pie.',
        desventajas: 'Usa casi todo el rollo de malla (queda poco margen); más superficie expuesta al viento.' },
      { id: 'B', nombre: 'Catio cerrado de 90 cm con caja de malla en la ventana', alto: 90, cajaVentana: true,
        ventajas: 'Más bajo y discreto; menos viento; sobra más malla.',
        desventajas: 'Hay que armar una caja de malla alrededor de la ventana para unir el catio con ella; limpiar se hace agachado.' },
    ] },
    { id: 'porton', titulo: 'Portón del costado derecho', afecta: ['Riel del portón', 'Guía y retén del portón'], alternativas: [
      { id: 'A', nombre: 'Colgante, con riel superior a nivel', recomendada: true,
        ventajas: 'No depende del radier (que tiene pendiente y está quebrado); nada que barrer ni que se tranque con tierra.',
        desventajas: 'El riel y la viga lateral cargan la hoja: la viga debe ir firme y el riel bien nivelado.',
        piezas: P => [
          { elemento: 'Riel del portón', escuadria: 'Riel superior colgante galvanizado', cantidad: 1, largo: 3, especificacion: 'Riel superior colgante, a nivel, con 2 carros y topes' },
          { elemento: 'Guía y retén del portón', escuadria: 'Guía inferior de pivote + retén', cantidad: 1, largo: null, especificacion: 'Guía al piso solo para que no pendulee; retén en abierto y en cerrado' },
        ] },
      { id: 'B', nombre: 'Corredizo con riel inferior', rielInferior: true,
        ventajas: 'Herrajes más baratos y comunes; la hoja se apoya en el piso.',
        desventajas: 'El radier tiene pendiente y está quebrado: el riel inferior queda desnivelado, junta tierra y la hoja se escapa. Descartado por eso.',
        piezas: P => [
          { elemento: 'Riel del portón', escuadria: 'Riel inferior de piso galvanizado', cantidad: 1, largo: 3, especificacion: 'Riel inferior al piso con ruedas; requiere nivelar sobre el radier' },
          { elemento: 'Guía y retén del portón', escuadria: 'Guía superior + retén', cantidad: 1, largo: null, especificacion: 'Guía superior de rodillos; retén en abierto y en cerrado' },
        ] },
    ] },
  ];

  // cada cara del esqueleto tiene dos vanos; cada esquina toca un vano en cada una de sus dos caras
  // especificaciones de texto para quien construye o presupuesta (prosa, sin referencias internas)
  const especificacionesPara = P => ({
    fijaciones: [
      'Toda la ferretería expuesta (pernos, escuadras, anclajes, riel del portón, abrazaderas, tornillos de la lata) va galvanizada en caliente o en acero inoxidable (A2, o A4 en lo más expuesto): la casa está en la costa y el galvanizado brillante común se oxida en poco tiempo.',
      'Los paneles y el techo van atornillados, no clavados: el taller tiene que poder desarmarse.',
      'Los pernos a la cadena del muro llevan anclaje químico; los de la plataforma del piso, golilla de goma.',
      'Canaletas de PVC; cadena de lluvia de acero inoxidable o cobre.',
    ],
    precauciones: [
      { titulo: 'Fierro dentro de la cadena', texto: `La viga de apoyo se fija con pernos a ${P.pernoY} cm, dentro de la cadena del muro (${P.cadenaCasa.join('–')} cm), que lleva fierro. Antes de perforar, detectar el fierro con un detector de metales o con una broca fina, y mover el punto si se topa metal. Nunca cortar la armadura.` },
      { titulo: 'Probar la cadena antes de confiar en ella', texto: 'Hacer una perforación de ensayo para comprobar que el hormigón de la cadena está sano (que no se desgrane) antes de fijar la viga de apoyo.' },
      { titulo: 'Reparar el muro antes de taparlo', texto: 'Una vez armado el taller, el tramo del muro de la casa que queda detrás ya no se puede mantener desde afuera. Antes de armar: sellar grietas, pintar con impermeabilizante y revisar la bajada de aguas lluvias.' },
      { titulo: 'Cámaras de inspección', texto: 'Antes de perforar el radier por cualquier motivo, ubicar las cámaras de inspección y el recorrido del desagüe del baño.' },
      { titulo: 'Radier disparejo', texto: 'Nivelar cada apoyo con calces o placas de goma y verificar con nivel y diagonales de la solera antes de levantar los pilares. Una base desnivelada descuadra el esqueleto y fuerza la viga de apoyo.' },
      { titulo: 'Goma dura bajo los pilares', texto: 'La base de cada pilar va sobre goma dura (neopreno o EPDM reforzado de 10 a 20 mm). Una goma blanda se hunde dispareja.' },
      { titulo: 'Gases lejos del dormitorio', texto: 'Justo encima del taller está la ventana de un dormitorio. Ninguna salida de gases (soldadura, decapado, fundición) puede ir por el techo ni por el muro de la casa: siempre al frente o al costado.' },
      { titulo: 'Unión del techo con el muro', texto: 'El encuentro del techo con el ladrillo es el punto con más riesgo de filtración: lleva un forro de hojalatería embutido o pegado con sellante elástico.' },
      { titulo: 'Semillas y maleza', texto: 'Cada entrada o salida de aire lleva malla desmontable contra insectos y semillas; la canaleta, rejilla cubre-hojas; el zócalo cierra la junta con el radier para que no crezca maleza bajo el piso.' },
      { titulo: 'Desagüe existente y calefón', texto: 'Limpiar y probar el tubo de desagüe y el sumidero existentes antes de conectar la lavadora. El calefón a gas no se mueve, pero conviene que lo revise un técnico y que su chimenea termine por sobre el techo del taller.' },
      { titulo: 'Electricidad', texto: 'El cordón flexible disponible sirve solo para extensiones; la instalación fija se define al final, con conductores en ducto según la norma eléctrica vigente.' },
    ],
    mantenimiento: [
      { cada: 'Cada 3 meses (revisión trimestral)', texto: 'Mallas de ventilación, canaleta y registro de la bajada; registro del piso (hormigas y cebos).' },
      { cada: 'Cada año', texto: 'Forro de la unión techo–muro, óxido en la ferretería, estado de la membrana del techo.' },
      { cada: 'Cada 4 a 6 años', texto: 'Mano de mantención de la membrana del techo (si es líquida) y repaso de sellos.' },
    ],
  });

  // extremos: [pilar de esquina, pilar del medio] como índices [columna x, fila z]; franja: la cara lleva franja alta
  const VANOS = [
    { id: 'trasera-izq', cara: 'muro', texto: 'del muro, mitad izquierda (puerta tapada)', extremos: [[0, 0], [1, 0]], franja: false },
    { id: 'trasera-der', cara: 'muro', texto: 'del muro, mitad derecha', extremos: [[2, 0], [1, 0]], franja: false },
    { id: 'frente-izq', cara: 'frente', texto: 'del frente, mitad izquierda (ventana)', extremos: [[0, 2], [1, 2]], franja: true },
    { id: 'frente-der', cara: 'frente', texto: 'del frente, mitad derecha', extremos: [[2, 2], [1, 2]], franja: true },
    { id: 'izquierda-trasero', cara: 'izquierda', texto: 'del costado izquierdo, mitad trasera', extremos: [[0, 0], [0, 1]], franja: true },
    { id: 'izquierda-frontal', cara: 'izquierda', texto: 'del costado izquierdo, mitad frontal', extremos: [[0, 2], [0, 1]], franja: true },
    { id: 'derecha-trasero', cara: 'derecha', texto: 'del costado derecho, mitad trasera', extremos: [[2, 0], [2, 1]], franja: false },
    { id: 'derecha-frontal', cara: 'derecha', texto: 'del costado derecho, mitad frontal (portón)', extremos: [[2, 2], [2, 1]], franja: false },
  ];
  const ESQUINAS = [
    { nombre: 'trasera izquierda', vanos: ['trasera-izq', 'izquierda-trasero'] },
    { nombre: 'trasera derecha', vanos: ['trasera-der', 'derecha-trasero'] },
    { nombre: 'frente izquierda', vanos: ['frente-izq', 'izquierda-frontal'] },
    { nombre: 'frente derecha', vanos: ['frente-der', 'derecha-frontal'] },
  ];

  // dónde está cada captación de la extracción y qué la representa
  const FORMAS_EXTRACCION = {
    'campana sobre la fundición': { min: [16, 150, 214], tam: [80, 25, 76], boca: [56, 175, 252] },
    'rejilla alta junto al muro (respaldo, con ventilador)': { min: [155, 225, 2], tam: [40, 10, 3], boca: [175, 230, 5] },
  };
  // dónde termina el ducto de cada salida; la verificación mira ese punto, no el nombre de la salida
  const FIN_DE_SALIDA = {
    frente: (c, [bx]) => [bx, c.P.extractor.y + c.P.extractor.lado / 2, c.P.fondo + 3],
    costado: (c, [, , bz]) => [-3, c.P.extractor.y + c.P.extractor.lado / 2, bz],
    techo: (c, [bx, , bz]) => [bx, c.techoTop(bz) + 30, bz],
    'muro-casa': (c, [bx, by]) => [bx, by, 0],
  };

  // geometría en planta (x, z) para huellas y áreas de uso
  const distPuntoSegmento = ([px, pz], [ax, az], [bx, bz]) => {
    const dx = bx - ax, dz = bz - az, t = Math.max(0, Math.min(1, ((px - ax) * dx + (pz - az) * dz) / (dx * dx + dz * dz || 1)));
    return Math.hypot(px - ax - t * dx, pz - az - t * dz);
  };
  const cruza = (a, b, c, d) => {
    const o = (p, q, r) => Math.sign((q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0]));
    return o(a, b, c) !== o(a, b, d) && o(c, d, a) !== o(c, d, b);
  };
  const dentro = ([x, z], pts) => pts.reduce((ins, [x1, z1], i) => {
    const [x2, z2] = pts[(i + 1) % pts.length];
    return (z1 > z) !== (z2 > z) && x < x1 + (z - z1) * (x2 - x1) / (z2 - z1) ? !ins : ins;
  }, false);
  const puntosDe = h => h.forma === 'rect' ? [[h.min[0], h.min[1]], [h.max[0], h.min[1]], [h.max[0], h.max[1]], [h.min[0], h.max[1]]] : h.puntos;
  // distancia de un segmento a una huella (0 si la toca)
  const distanciaAHuella = (a, b, h) => {
    if (h.forma === 'circulo') return Math.max(0, distPuntoSegmento(h.centro, a, b) - h.radio);
    const pts = puntosDe(h), lados = pts.map((p, i) => [p, pts[(i + 1) % pts.length]]);
    if (dentro(a, pts) || lados.some(([p, q]) => cruza(a, b, p, q))) return 0;
    return Math.min(...pts.map(p => distPuntoSegmento(p, a, b)), ...lados.flatMap(([p, q]) => [distPuntoSegmento(a, p, q), distPuntoSegmento(b, p, q)]));
  };
  // distancia entre dos huellas poligonales (0 si se tocan)
  const distanciaEntreHuellas = (h1, h2) => {
    const lados = h => { const p = puntosDe(h); return p.map((q, i) => [q, p[(i + 1) % p.length]]); };
    return Math.min(...lados(h1).map(([a, b]) => distanciaAHuella(a, b, h2)));
  };
  // lado de la bisagra de la puerta de la casa: dónde está (fracción del ancho), hacia dónde barre la hoja en x
  // y desde qué ángulo se dibuja el cuarto de círculo (medido desde +z hacia +x)
  const LADOS_BISAGRA = {
    derecha: { bisagra: 1, haciaX: -1, desde: 3 * Math.PI / 2 },
    izquierda: { bisagra: 0, haciaX: 1, desde: 0 },
  };
  const rect = (x, z, ancho, largo) => ({ forma: 'rect', min: [x, z], max: [x + ancho, z + largo] });

  // agrupa largos (cm) en cortes { largo (m), cantidad }, del más largo al más corto
  const cortesDe = largosCm => {
    const grupos = new Map();
    for (const l of largosCm) { const k = Math.round(l); grupos.set(k, (grupos.get(k) ?? 0) + 1); }
    return [...grupos].sort((a, b) => b[0] - a[0]).map(([l, cantidad]) => ({ largo: l / 100, cantidad }));
  };
  // pieza de madera con cortes de distinto largo: cantidad total y largo mayor (el que define la pieza comercial)
  const conCortes = (p, largosCm) => ({ ...p, cantidad: largosCm.length, largo: Math.max(...largosCm) / 100, cortes: cortesDe(largosCm) });

  const largo = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);

  // borde izquierdo (x mínimo) de un elemento de geometría, según su tipo
  const xMinimo = e =>
    e.tipo === 'caja' ? e.min[0]
    : e.tipo === 'pieza' ? Math.min(e.a[0], e.b[0]) - e.seccion[0] / 2
    : e.centro[0] - (e.eje === 'x' ? e.largo / 2 : e.radio);

  const lcTexto = l => String(l).replace('.', ',');
  const verificacion = (id, protege, ok, siOk, siFalla, siNo = 'falla') =>
    ({ id, protege, estado: ok ? 'ok' : siNo, explicacion: ok ? siOk : siFalla });

  // capas del dibujo
  const BASE_C = 'Base (goma + solera)', ESQ = 'Esqueleto (pilares + vigas)', APOYO = 'Viga de apoyo en cadena',
    DIAG = 'Diagonales', PORTON = 'Portón corredizo (ADR 0005)', ENTORNO = 'Casa y entorno',
    VENT = 'Ventanas y extracción', PISO = 'Piso (capas en corte)', PANELES = 'Paneles de muro', CIELO = 'Cielo interior (pendiente invertida)', TECHO = 'Techo';
  const INTERIOR = 'Interior (propuesta)', CATIO = 'Techo de las gatas (catio cerrado)', SERVICIOS = 'Agua y desagüe lavadora';
  const NO = { estructural: false }, CASA = { estructural: false, casa: true };

  // contexto compartido por las partes: parámetros, alturas derivadas y los acumuladores de salida
  function contexto(P, seleccion) {
    const elegida = id => {
      const o = OPCIONES.find(o => o.id === id);
      return o.alternativas.find(a => a.id === seleccion[id]) || o.alternativas.find(a => a.recomendada);
    };
    const madera = elegida('madera');
    const techoTop = z => P.techoMuro - P.pendiente * z;
    const vigaInf = z => techoTop(z) - P.vigaTechoH;
    const c = {
      P, elegida, techoTop, vigaInf,
      base: P.goma + P.soleraH,
      topePilar: z => vigaInf(z) - P.vigaPerimetralH,
      bajoVigaFrente: vigaInf(P.filasZ[2]) - P.vigaPerimetralH,   // punto más bajo de las vigas perimetrales
      xs: [P.pilar / 2, P.ancho / 2, P.ancho - P.pilar / 2],
      zFin: P.fondo + P.aleroFrontal,
      pisoTerminado: P.gomaPisoH + P.durmienteSeccion[1] + P.capasPiso.osb + P.capasPiso.terciado + P.capasPiso.terminacion,
      anchoTecho: P.anchoTecho ?? P.esquinaCasa - P.x0,
      geometria: [], piezas: [], verificaciones: [],
      caja: (nombre, capa, min, tam, material, { estructural = true, casa = false } = {}) =>
        c.geometria.push({ nombre, capa, tipo: 'caja', min, tam, material, estructural, ...(casa && { casa }) }),
      pieza: (nombre, capa, a, b, seccion, material, { estructural = false, casa = false } = {}) =>
        c.geometria.push({ nombre, capa, tipo: 'pieza', a, b, seccion, material, estructural, ...(casa && { casa }) }),
      cilindro: (nombre, capa, centro, radio, largo, eje, material, { estructural = false, casa = false } = {}) =>
        c.geometria.push({ nombre, capa, tipo: 'cilindro', centro, radio, largo, eje, material, estructural, ...(casa && { casa }) }),
      etiqueta: (capa, texto, posicion, duda = false) =>
        c.geometria.push({ nombre: 'etiqueta', capa, tipo: 'etiqueta', texto, posicion, duda }),
      // piezas de madera: la especificación sale de la opción de madera según su clase
      especificarMadera: clase => madera.especificar(clase),
      agregarPiezas: (...ps) => c.piezas.push(...ps.map(p => p.clase ? { ...p, especificacion: madera.especificar(p.clase) } : p)),
      verificar: (...vs) => c.verificaciones.push(...vs),
    };
    return c;
  }

  // base (gomas y solera perimetral), esqueleto (pilares y vigas perimetrales) y amarre a la cadena
  function baseYEsqueleto(c) {
    const { P, xs, base, vigaInf, topePilar, caja, pieza } = c;
    const G = P.gomaLado, S = P.soleraAncho, VP = P.vigaPerimetralH, [zA, , zF] = P.filasZ;
    const pilares = [];
    for (const x of xs) for (const z of P.filasZ) {
      if (x === xs[1] && z === P.filasZ[1]) continue;      // sin pilar central
      pilares.push({ x, z, alto: topePilar(z) - base });
    }
    c.pilares = pilares;
    const largoPilar = Math.max(...pilares.map(p => p.alto)) / 100;

    for (const p of pilares) caja('goma', BASE_C, [p.x - G / 2, 0, p.z - G / 2], [G, P.goma, G], 'goma', NO);
    const z0 = zA - P.pilar / 2;
    caja('solera', BASE_C, [0, P.goma, z0], [P.ancho, P.soleraH, S], 'maderaOsc');
    caja('solera', BASE_C, [0, P.goma, P.fondo - S], [P.ancho, P.soleraH, S], 'maderaOsc');
    caja('solera', BASE_C, [0, P.goma, z0], [S, P.soleraH, P.fondo - z0], 'maderaOsc');
    caja('solera', BASE_C, [P.ancho - S, P.goma, z0], [S, P.soleraH, P.fondo - z0], 'maderaOsc');

    caja('viga perimetral', ESQ, [0, vigaInf(zA) - VP, zA - P.pilar / 2], [P.ancho, VP, P.pilar], 'madera');
    caja('viga perimetral', ESQ, [0, vigaInf(zF) - VP, zF - P.pilar / 2], [P.ancho, VP, P.pilar], 'madera');
    for (const x of [xs[0], xs[2]])
      pieza('viga perimetral', ESQ, [x, vigaInf(zA) - VP / 2, zA - P.pilar / 2], [x, vigaInf(zF) - VP / 2, zF + P.pilar / 2],
        [P.pilar, VP], 'madera', { estructural: true });
    for (const p of pilares)
      caja('pilar', ESQ, [p.x - P.pilar / 2, base, p.z - P.pilar / 2], [P.pilar, p.alto, P.pilar], 'madera');

    caja('viga de apoyo', APOYO, [0, P.apoyoY, 0], [P.ancho, P.apoyoH, P.apoyoEspesor], 'maderaOsc');
    const xsPernos = [];
    for (let x = P.pernoX0; x < P.ancho; x += P.pernoPaso) xsPernos.push(x);
    for (const x of xsPernos)
      c.cilindro('perno de anclaje', APOYO, [x, P.pernoY, P.apoyoEspesor], 1, 8, 'z', 'perno', { estructural: true });

    c.agregarPiezas(
      { elemento: 'Pilar', escuadria: '4 × 4"', cantidad: pilares.length, largo: largoPilar, clase: 'pilar' },
      conCortes({ elemento: 'Solera perimetral', escuadria: '2 × 4" (acostada)', clase: 'suelo' }, [P.ancho, P.ancho, P.fondo - z0, P.fondo - z0]),
      conCortes({ elemento: 'Viga perimetral superior', escuadria: '2 × 6" doble', clase: 'interior' },
        [P.ancho, P.ancho, ...Array(2).fill(zF - zA + P.pilar)]),
      { elemento: 'Viga de apoyo en la cadena', escuadria: '2 × 8"', cantidad: 1, largo: P.ancho / 100, clase: 'contacto-muro' },
      { elemento: 'Perno de anclaje a la cadena', escuadria: 'Ø 3/8" galvanizado en caliente o inoxidable', cantidad: xsPernos.length,
        largo: null, especificacion: 'Perno con anclaje químico; antes de perforar, detectar el fierro de la cadena' });
    const lc = lcTexto(P.largoComercial);
    c.verificar(verificacion('pilares-largo-comercial', 'ADR 0006', largoPilar <= P.largoComercial,
      `Los pilares miden hasta ${fmt(largoPilar)} m y caben en piezas comerciales de ${lc} m.`,
      `Los pilares miden ${fmt(largoPilar)} m: no caben en piezas comerciales de ${lc} m. Baja el techo o considera empalmes o madera de mayor largo.`));
  }

  // rigidez: una diagonal por vano cerrado, de la base del pilar de esquina a lo alto del pilar del medio;
  // en las caras con franja alta (izquierda y frente) la diagonal termina bajo el travesaño
  function rigidez(c) {
    const { P, xs, base, topePilar, caja } = c;
    const [DS, DH] = P.diagonalSeccion, [TS, TH] = P.travesanoSeccion, [zA, , zF] = P.filasZ;
    const cerrados = VANOS.filter(v => !P.vanosAbiertos.includes(v.id));
    const diagonales = cerrados.map(v => {
      const [[c1, f1], [c2, f2]] = v.extremos;
      const alto = (v.franja ? P.travesanoY : topePilar(P.filasZ[f2])) - P.diagonalDespeje / 2;
      return { a: [xs[c1], base + P.diagonalDespeje, P.filasZ[f1]], b: [xs[c2], alto, P.filasZ[f2]] };
    });
    for (const d of diagonales) c.pieza('diagonal', DIAG, d.a, d.b, [DS, DH], 'diagonal', { estructural: true });
    caja('travesaño', DIAG, [xs[0] - TS / 2, P.travesanoY, zA], [TS, TH, P.fondo - zA], 'madera');
    caja('travesaño', DIAG, [0, P.travesanoY, zF - TS / 2], [P.ancho, TH, TS], 'madera');
    for (const v of VANOS.filter(v => P.vanosAbiertos.includes(v.id))) {
      const [[c1, f1], [c2, f2]] = v.extremos;
      c.etiqueta(DIAG, `Vano ${v.texto}: sin diagonal`, [(xs[c1] + xs[c2]) / 2, 120, (P.filasZ[f1] + P.filasZ[f2]) / 2], true);
    }

    c.agregarPiezas(
      conCortes({ elemento: 'Diagonal', escuadria: '2 × 4"', clase: 'interior' }, diagonales.map(d => largo(d.a, d.b))),
      conCortes({ elemento: 'Travesaño bajo las franjas altas', escuadria: '2 × 4"', clase: 'interior' }, [P.ancho, P.fondo - zA]));
    const sinDiagonal = ESQUINAS.filter(e => !e.vanos.some(v => cerrados.some(k => k.id === v))).map(e => e.nombre);
    c.verificar(verificacion('esquinas-con-diagonal', 'ADR 0001', sinDiagonal.length === 0,
      'Cada esquina del esqueleto tiene una diagonal en al menos una de sus dos caras.',
      `Queda sin diagonal la esquina ${sinDiagonal.join(' y ')}: agrega una diagonal en una de sus caras o rigidiza el vano.`));
  }

  // portón colgante del costado derecho: el riel va A NIVEL bajo la viga lateral, que baja hacia el frente
  function porton(c) {
    const { P, base, caja } = c;
    const [zA, zM] = P.filasZ;
    const xHoja = P.ancho + P.portonSeparacion;
    caja('hoja del portón', PORTON, [xHoja, base + 2, zM + 6], [P.portonEspesor, P.portonAlto, P.portonAncho], 'panel', NO);
    const inferior = c.elegida('porton').rielInferior;
    const rielY = inferior ? 0 : base + P.portonAlto + P.rielH;   // cara inferior del riel: en el radier o bajo la viga
    const yRiel = rielY + P.rielH / 2;
    c.pieza('riel del portón', PORTON, [xHoja + P.portonEspesor / 2, yRiel, zA], [xHoja + P.portonEspesor / 2, yRiel, P.fondo],
      [P.rielAncho, P.rielH], 'metal');
    for (const z of [zA + 4, P.fondo - 4])
      caja('retén del portón', PORTON, [xHoja + P.portonEspesor, base, z - 2], [3, 8, 4], 'metal', NO);
    const holgura = c.bajoVigaFrente - (rielY + P.rielH);

    c.agregarPiezas(
      { elemento: 'Hoja del portón', escuadria: `${P.portonAncho} × ${P.portonAlto} cm`, cantidad: 1, largo: null,
        especificacion: 'Bastidor de madera revestido como los muros (lata exterior, OSB interior)' },
      ...c.elegida('porton').piezas(P));
    c.verificar(verificacion('riel-porton-a-nivel', 'ADR 0005', !inferior && holgura >= 0,
      `El riel del portón va a nivel y queda ${Math.round(holgura)} cm bajo la viga lateral en su punto más bajo (el frente).`,
      inferior ? 'El riel inferior queda apoyado en el radier, que tiene pendiente y está quebrado: hay que nivelarlo con calces o una base, y aun así junta tierra. Por eso se recomienda el portón colgante.'
        : `El riel del portón, a nivel, choca ${Math.round(-holgura)} cm con la viga lateral en el frente: baja el portón o sube la viga.`,
      inferior ? 'aviso' : 'falla'));
  }

  // aberturas: puerta tapada (vano trasero izq.), ventana del frente (vano frontal izq.) y franjas altas; cielo invertido
  function aberturasYCielo(c) {
    const { P, caja } = c;
    caja('puerta tapada', ENTORNO, [P.puertaX, P.escalon, 0], [P.puertaAncho, P.puertaAlto, 0.5], 'puerta', CASA);
    caja('escalón de la puerta', ENTORNO, [P.puertaX, 0, 0], [P.puertaAncho, P.escalon, 12], 'cadena', CASA);
    caja('franja alta', VENT, [-3, P.franjaY, 12], [2, P.cieloMuro - P.franjaY, P.fondo - 20], 'vidrio', NO);
    caja('franja alta', VENT, [6, P.franjaY, P.fondo + 1], [P.ancho - 12, P.cieloFrente - P.franjaY, 2], 'vidrio', NO);
    const VF = P.ventanaFrente;
    caja('ventana del frente', VENT, [VF.x, VF.y, P.fondo + 1], [VF.ancho, VF.alto, 2], 'vidrio', NO);
    // cielo con pendiente invertida: bajo junto al muro, alto en el frente (ADR 0008)
    c.pieza('cielo', CIELO, [P.ancho / 2, P.cieloMuro, P.filasZ[0]], [P.ancho / 2, P.cieloFrente, P.fondo], [P.ancho, P.cieloEspesor], 'cielo');

    c.agregarPiezas({ elemento: 'Cortina roller', escuadria: `${VF.ancho} × ${VF.alto} cm`, cantidad: 1, largo: null,
      especificacion: 'Roller screen o blackout claro para el sol directo de la mañana (ventana del frente)' });
    const alturaLibre = c.bajoVigaFrente - c.pisoTerminado;
    c.etiqueta(ESQ, `Frente: libre ≈ ${Math.round(alturaLibre)} cm`, [P.ancho / 2, 150, P.fondo]);
    c.verificar(
      verificacion('cielo-sobre-dintel', 'ADR 0008', P.cieloMuro > P.dintel,
        `El cielo junto al muro (${P.cieloMuro}) queda sobre el dintel de la puerta (${P.dintel}): la puerta abre sin topar.`,
        `El cielo junto al muro (${P.cieloMuro}) queda bajo el dintel de la puerta (${P.dintel}): la puerta no podría abrir. Sube el cielo sobre ${P.dintel}.`),
      verificacion('altura-libre-frente', 'ADR 0006', alturaLibre >= P.alturaLibreMin,
        `Bajo la viga frontal quedan ${Math.round(alturaLibre)} cm libres sobre el piso terminado (mínimo ${P.alturaLibreMin}).`,
        `Bajo la viga frontal quedan solo ${Math.round(alturaLibre)} cm sobre el piso terminado; el mínimo acordado es ${P.alturaLibreMin}. Sube el techo.`));
  }

  // extracción: captación + ducto hasta su salida + extractor en la salida (ADR 0007)
  function extraccion(c) {
    const { P, caja } = c, EX = P.extractor, EA = P.entradaAire;
    const ductos = P.extraccion.map(ex => {
      const f = FORMAS_EXTRACCION[ex.nombre];
      caja(ex.nombre, VENT, f.min, f.tam, 'metal', NO);
      const fin = FIN_DE_SALIDA[ex.salida](c, f.boca);
      c.pieza(`ducto: ${ex.nombre}`, VENT, f.boca, fin, [P.ductoLado, P.ductoLado], 'metal');
      if (ex.salida === 'frente') caja('extractor', VENT, [fin[0] - EX.lado / 2, EX.y, P.fondo + 3], [EX.lado, EX.lado, EX.fondo], 'metal', NO);
      return { nombre: ex.nombre, fin };
    });
    caja('entrada de aire baja', VENT, [EA.x, EA.y, P.fondo + 1], [EA.ancho, EA.alto, 2], 'metal', NO);

    // hacia el dormitorio: un ducto que termina en el muro de la casa (z ≤ 0) o por encima del techo
    const destino = ({ fin: [, y, z] }) => z <= 0 ? 'el muro de la casa' : y > c.techoTop(z) ? 'sobre el techo' : null;
    const alDormitorio = ductos.filter(destino);
    c.verificar(verificacion('sin-gases-al-dormitorio', 'ADR 0007', alDormitorio.length === 0,
      'Todas las salidas de extracción van al frente o al costado: ninguna al muro de la casa ni sobre el techo.',
      alDormitorio.map(d => `La ${d.nombre} sale por ${destino(d)}: los gases subirían a la ventana del dormitorio.`).join(' ')
        + ' Llévala al frente.'));
  }

  // techo (ADR 0003, 0004, 0006): vigas hasta el alero, cubierta y membrana hasta la esquina, parapeto, canaleta y sofitos
  function techo(c) {
    const { P, techoTop, vigaInf, zFin, anchoTecho: AT, caja, pieza, etiqueta } = c;
    const VTH = P.vigaTechoH, VA = P.vigaTechoAncho, CN = P.canaleta;
    const xsVigas = Array.from({ length: P.vigasTecho }, (_, i) =>
      Math.min(Math.max(i * P.ancho / (P.vigasTecho - 1), VA / 2), P.ancho - VA / 2)).concat(AT - VA / 2);
    for (const x of xsVigas)
      pieza('viga de techo', TECHO, [x, techoTop(0) - VTH / 2, 0], [x, techoTop(zFin) - VTH / 2, zFin], [VA, VTH], 'madera', { estructural: true });
    const sobreTecho = (nombre, alto, sobre, material) =>
      pieza(nombre, TECHO, [AT / 2, techoTop(0) + sobre + alto / 2, 0], [AT / 2, techoTop(zFin) + sobre + alto / 2, zFin], [AT, alto], material);
    sobreTecho('cubierta', P.cubiertaH, 0, 'osb');
    sobreTecho('membrana del techo', P.membranaH, P.cubiertaH, c.elegida('membrana').material);
    caja('tapacán', TECHO, [0, techoTop(zFin) - VTH, zFin], [AT, VTH + 2, 2], 'maderaOsc', NO);
    pieza('tapacán', TECHO, [AT + 1, techoTop(0) - VTH / 2 + 1, 0], [AT + 1, techoTop(zFin) - VTH / 2 + 1, zFin], [2, VTH + 2], 'maderaOsc');
    const yParapeto = z => techoTop(z) + P.cubiertaH;
    caja('parapeto', TECHO, [0, yParapeto(0), 0], [AT, P.parapeto, VA], 'maderaOsc', NO);
    for (const x of [VA / 2, AT - VA / 2])
      pieza('parapeto', TECHO, [x, yParapeto(0) + P.parapeto / 2, 0], [x, yParapeto(zFin) + P.parapeto / 2, zFin], [VA, P.parapeto], 'maderaOsc');
    caja('canaleta frontal', TECHO, [0, techoTop(zFin) - CN.ancho, zFin + 2], [AT, CN.alto, CN.ancho], 'metal', NO);
    // sofitos: cierran bajo el alero frontal y bajo el alero lateral
    const sofito = (x, ancho, z1, z2) => pieza('sofito', TECHO, [x, vigaInf(z1) - .5, z1], [x, vigaInf(z2) - .5, z2], [ancho, 1], 'sofito');
    sofito(AT / 2, AT, P.fondo, zFin);
    sofito((P.ancho + AT) / 2, AT - P.ancho, 0, P.fondo);
    // anclajes para los postes del catio (fase 8), sobre las vigas de techo de los costados
    const anclajesCatio = [];
    for (const x of [VA / 2, AT - VA / 2]) for (const z of [0, P.catioPasoPostes, P.catioFondo - 4]) {
      caja('anclaje de poste del catio', TECHO, [x - 3, yParapeto(z), z], [6, 3, 6], 'perno', NO);
      anclajesCatio.push(x);
    }
    etiqueta(TECHO, 'Canaleta frontal', [60, techoTop(zFin) - 20, zFin + 8]);
    etiqueta(TECHO, 'Sofito (cierra bajo el alero)', [175, vigaInf(zFin) - 12, zFin - 15]);
    etiqueta(TECHO, `Alero frontal ${P.aleroFrontal} cm`, [-20, techoTop(zFin) + 10, P.fondo + P.aleroFrontal / 2]);
    etiqueta(TECHO, `Alero lateral ${AT - P.ancho} cm (hasta la esquina)`, [AT, techoTop(60) + 25, 60]);
    etiqueta(TECHO, `Parapeto ${P.parapeto} cm (base malla gatos)`, [175, techoTop(0) + 30, 10]);

    const largoViga = zFin * Math.hypot(1, P.pendiente) / 100;
    const comerciales = P.largosComerciales.filter(l => l >= largoViga).slice(0, 2).map(l => l.toFixed(1).replace('.', ','));
    const lc = lcTexto(P.largoComercial);
    c.agregarPiezas(
      { elemento: 'Viga de techo', escuadria: '2 × 6"', cantidad: xsVigas.length, largo: largoViga,
        largoComercial: P.largosComerciales.find(l => l >= largoViga) ?? null, clase: 'techo',
        nota: largoViga > P.largoComercial ? `Pedir piezas de ${comerciales.join(' o ')} m, o hacer un empalme sobre la viga perimetral` : '' },
      { elemento: 'Membrana del techo', escuadria: `${fmt(AT * zFin / 1e4)} m²`, cantidad: 1, largo: null,
        especificacion: c.elegida('membrana').especificacion },
      { elemento: 'Anclaje de poste del catio', escuadria: 'Placa base galvanizada + tirafondos inoxidables', cantidad: anclajesCatio.length,
        largo: null, especificacion: 'Atornillada a la viga de techo del costado, sellada bajo la membrana; queda lista para el catio' });
    // el techo llega hasta la esquina: se mide en la geometría de la cubierta
    const cubierta = c.geometria.find(e => e.nombre === 'cubierta');
    const finTecho = P.x0 + cubierta.a[0] + cubierta.seccion[0] / 2;
    const pasaEsquina = finTecho > P.esquinaCasa;
    c.verificar(
      verificacion('techo-hasta-esquina', 'ADR 0003', !pasaEsquina,
        `El techo llega a la esquina de la casa (${P.esquinaCasa}) sin pasarla.`,
        `El techo termina en ${finTecho} y pasa la esquina de la casa (${P.esquinaCasa}).`),
      verificacion('vigas-techo-largo-comercial', 'ADR 0004', largoViga <= P.largoComercial,
        `Las vigas de techo miden ${fmt(largoViga)} m y caben en piezas de ${lc} m.`,
        `Las vigas de techo miden ${fmt(largoViga)} m (fondo + alero): pasan el largo habitual de ${lc} m. Pide piezas de ${comerciales.join(' o ')} m, o considera un empalme sobre la viga perimetral.`,
        'aviso'));
  }

  // aguas lluvias (ADR 0003): la bajada de la casa se corta bajo el techo y con un codo viaja bajo el alero lateral
  // hasta la canaleta; de ahí, cadena de lluvia a un pozo de grava
  function aguasLluvias(c) {
    const { P, techoTop, zFin, etiqueta } = c;
    const xBajada = (P.bajadaX[0] + P.bajadaX[1]) / 2, yCorte = techoTop(0) - P.bajadaCorteBajoTecho;
    c.cilindro('bajada de la casa', ENTORNO, [xBajada, (P.bajadaTope + yCorte) / 2, 8], P.bajadaRadio, P.bajadaTope - yCorte, 'y', 'sofito', CASA);
    c.pieza('bajada bajo el alero lateral', TECHO, [xBajada, yCorte, 8], [xBajada, techoTop(zFin) - 8, zFin + 6],
      [2 * P.bajadaRadio, 2 * P.bajadaRadio], 'sofito', CASA);
    c.geometria.push({ nombre: 'cadena de lluvia', capa: TECHO, tipo: 'cadena', estructural: false, casa: true, material: 'metal',
      a: [xBajada, techoTop(zFin) - 14, zFin + 8], b: [xBajada, 2, zFin + 8] });
    c.caja('pozo de grava', TECHO, [xBajada - P.pozoLado / 2, 0, zFin - 12], [P.pozoLado, 4, P.pozoLado], 'quebrado', CASA);
    etiqueta(TECHO, 'Cadena de lluvia → pozo de grava → canal', [xBajada, 60, zFin + 8], true);
    etiqueta(TECHO, 'Bajada bajo el alero lateral (1 codo)', [xBajada, yCorte - 15, 150]);

    const pilarEnBajada = c.pilares.some(p => p.x + P.x0 + P.pilar / 2 > P.bajadaX[0] && p.x + P.x0 - P.pilar / 2 < P.bajadaX[1]);
    c.verificar(verificacion('bajada-libre', 'ADR 0003', !pilarEnBajada,
      `La bajada de aguas lluvias (${P.bajadaX.join('–')}) pasa libre junto a los pilares.`,
      `Un pilar choca con la bajada de aguas lluvias (${P.bajadaX.join('–')}): angosta el taller o corre la bajada.`));
  }

  // muros (ADR 0010): un panel por vano con sus capas, de afuera hacia adentro; zócalo de fibrocemento
  function muros(c) {
    const { P, xs, base, caja } = c, E = P.panelEspesor, FI = P.fibrocementoInterior;
    const conPanel = VANOS.filter(v => v.cara !== 'muro' && !P.vanosSinPanel.includes(v.id));
    const revestimiento = c.elegida('revestimiento');
    // placa sobre una cara: [d1, d2] a lo largo de la cara y [y1, y2] en altura; plano = posición de la cara
    const enCara = (cara, [d1, d2], [y1, y2], grosor, plano) => cara === 'frente'
      ? { min: [d1, y1, plano], tam: [d2 - d1, y2 - y1, grosor] } : { min: [plano, y1, d1], tam: [grosor, y2 - y1, d2 - d1] };
    const planoExterior = { izquierda: -E, derecha: P.ancho, frente: P.fondo };
    const planoInterior = { izquierda: P.pilar, derecha: P.ancho - P.pilar - FI, frente: P.filasZ[2] - P.pilar / 2 - FI };
    // borde del vano a lo largo de su cara: en el frente se mide en x (columnas), en los costados en z (filas)
    const bordeEnFrente = col => col === 0 ? 0 : col === 2 ? P.ancho : xs[col];
    const bordeEnCostado = fila => fila === 0 ? P.filasZ[0] - P.pilar / 2 : fila === 2 ? P.fondo : P.filasZ[fila];
    const ml = n => ({ cantidad: Math.round(n) / 100, unidad: 'm' }), m2 = n => ({ cantidad: Math.round(n / 100) / 100, unidad: 'm²' });
    const interiores = [];
    for (const v of conPanel) {
      const [[c1, f1], [c2, f2]] = v.extremos;
      const borde = v.cara === 'frente' ? ([col]) => bordeEnFrente(col) : ([, fila]) => bordeEnCostado(fila);
      const [d1, d2] = [borde([c1, f1]), borde([c2, f2])].sort((a, b) => a - b);
      const L = d2 - d1, yTope = v.franja ? P.travesanoY : c.bajoVigaFrente, H = yTope - base;
      const VF = v.id === 'frente-izq' ? P.ventanaFrente : null;   // el panel del frente izquierdo deja el hueco de la ventana
      const trozos = VF
        ? [[[d1, d2], [base, VF.y]], [[d1, d2], [VF.y + VF.alto, yTope]], [[d1, VF.x], [VF.y, VF.y + VF.alto]], [[VF.x + VF.ancho, d2], [VF.y, VF.y + VF.alto]]]
        : [[[d1, d2], [base, yTope]]];
      for (const [dd, yy] of trozos) {
        const ext = enCara(v.cara, dd, yy, E, planoExterior[v.cara]);
        caja('panel de muro', PANELES, ext.min, ext.tam, revestimiento.material, NO);
      }
      const caliente = P.zonaCaliente.includes(v.id);
      if (caliente) {
        const int = enCara(v.cara, [d1, d2], [base, yTope], FI, planoInterior[v.cara]);
        caja('revestimiento incombustible', PANELES, int.min, int.tam, 'fibrocemento', NO);
      }
      const montantes = Math.ceil(L / P.montantePaso) + 1, area = L * H - (VF ? VF.ancho * VF.alto : 0);
      const interior = caliente ? P.interiorZonaCaliente : P.interiorPanel;
      interiores.push({ vano: v, interior });
      c.agregarPiezas({ elemento: `Panel de muro ${v.texto}`, escuadria: `${Math.round(L)} × ${Math.round(H)} cm`, cantidad: 1, largo: null,
        especificacion: 'Panel atornillado al esqueleto (desarmable) con fijaciones galvanizadas en caliente o inoxidables; capas de afuera hacia adentro',
        capas: [
          { capa: 'Revestimiento exterior', ...m2(area), especificacion: revestimiento.especificacion },
          { capa: 'Listones de cámara', ...ml(montantes * H), especificacion: 'Listón impregnado 2 × 2 cm: cámara ventilada de 2 cm' },
          { capa: 'Malla de la cámara', ...ml(2 * L), especificacion: 'Malla anti-insectos inoxidable en la entrada (abajo) y la salida (arriba) de la cámara' },
          { capa: 'Membrana hidrófuga', ...m2(area), especificacion: 'Membrana hidrófuga respirable, traslapada hacia abajo' },
          { capa: 'Bastidor', ...ml(2 * (L + H) + (montantes - 2) * H), especificacion: `2 × 3": ${c.especificarMadera('interior')}` },
          { capa: 'Lana mineral 50 mm', ...m2(area), especificacion: 'Lana mineral 50 mm entre montantes' },
          { capa: 'Barrera de vapor', ...m2(area), especificacion: 'Polietileno 0,2 mm por el lado interior, traslapado y sellado' },
          { capa: 'Revestimiento interior', ...m2(area), especificacion: interior },
        ] });
    }
    // zócalo de fibrocemento con burlete, por fuera del perímetro
    const zZ = P.filasZ[0] - P.pilar / 2, ZS = P.zocaloSeparacion, ZE = P.zocaloEspesor;
    caja('zócalo', PISO, [-ZS - ZE, 0, zZ], [ZE, P.zocaloAlto, P.fondo - zZ], 'fibrocemento', NO);
    caja('zócalo', PISO, [P.ancho + ZS, 0, zZ], [ZE, P.zocaloAlto, P.fondo - zZ], 'fibrocemento', NO);
    caja('zócalo frontal', PISO, [0, 0, P.fondo + ZS], [P.ancho, P.zocaloAlto, ZE], 'fibrocemento', NO);
    c.etiqueta(PISO, 'Zócalo fibrocemento + burlete', [P.ancho + 2, P.zocaloAlto + 2, P.filasZ[1] + 50]);
    c.agregarPiezas({ elemento: 'Zócalo de fibrocemento', escuadria: `${P.zocaloAlto} cm de alto`, cantidad: 1,
      largo: (2 * (P.fondo - zZ) + P.ancho) / 100, especificacion: 'Fibrocemento 8 mm con burlete de goma contra el radier' });

    // zona caliente: se mira la capa interior de cada panel junto a la fundición y el revestimiento exterior elegido
    const enZona = interiores.filter(i => P.zonaCaliente.includes(i.vano.id));
    const combustibles = enZona.filter(i => !/fibrocemento|incombustible/i.test(i.interior));
    const exteriorCombustible = revestimiento.combustible;
    c.verificar(verificacion('zona-caliente-incombustible', 'ADR 0010', combustibles.length === 0 && !exteriorCombustible,
      'Los paneles junto a la fundición llevan fibrocemento por dentro (incombustible).',
      combustibles.length
        ? `Los paneles junto a la fundición (${combustibles.map(i => i.vano.texto).join('; ')}) quedan con ${combustibles[0].interior} por dentro: usa fibrocemento u otra placa incombustible.`
        : `Por dentro van con fibrocemento, pero el revestimiento exterior elegido (${revestimiento.nombre.toLowerCase()}) es combustible: junto a la fundición conviene lata o fibrocemento también por fuera.`,
      combustibles.length ? 'falla' : 'aviso'));
  }

  // piso rígido, silencioso y sellado (ADR 0009), dibujado en corte escalonado hacia el frente
  function piso(c) {
    const { P, caja } = c, [DA, DH] = P.durmienteSeccion, [z0, z1] = P.pisoZ, CP = P.capasPiso;
    const bordeIzq = P.soleraAncho, bordeDer = P.ancho - P.soleraAncho;   // la plataforma va entre soleras
    const xsD = [];
    for (let x = P.durmienteX0; x <= bordeDer - DA; x += P.durmientePaso) xsD.push(x);
    for (const x of xsD) {
      caja('tira de goma', PISO, [x, 0, z0], [DA, P.gomaPisoH, z1 - z0], 'goma', NO);
      caja('durmiente', PISO, [x, P.gomaPisoH, z0], [DA, DH, z1 - z0], 'maderaOsc', NO);
    }
    for (let i = 0; i < xsD.length - 1; i++)
      caja('lana mineral', PISO, [xsD[i] + DA, P.gomaPisoH, z0], [xsD[i + 1] - xsD[i] - DA, DH, z1 - z0], 'lana', NO);
    const anchoP = bordeDer - bordeIzq, [c1, c2, c3] = P.corteEscalonado;
    let y = P.gomaPisoH + DH;
    caja('OSB del piso', PISO, [bordeIzq, y, z0], [anchoP, CP.osb, z1 - z0 - c1], 'osb', NO); y += CP.osb;
    caja('terciado del piso', PISO, [bordeIzq, y, z0], [anchoP, CP.terciado, z1 - z0 - c2], 'terciado', NO); y += CP.terciado;
    const terminacion = c.elegida('terminacionPiso');
    caja('terminación del piso', PISO, [bordeIzq, y, z0], [anchoP, CP.terminacion, z1 - z0 - c3], terminacion.material, NO);

    const xEt = P.ancho / 2;
    c.etiqueta(PISO, `Durmientes 2 × 4" impregnados c/${P.durmientePaso} sobre goma`, [60, 4, z1 - 6]);
    c.etiqueta(PISO, 'Lana mineral (sin efecto tambor)', [160, 6, z1 - 6]);
    c.etiqueta(PISO, 'OSB 18', [xEt, 9, z1 - c1]);
    c.etiqueta(PISO, 'Terciado 12', [xEt, 11, z1 - c2]);
    c.etiqueta(PISO, `Terminación: ${terminacion.nombre.toLowerCase()}`, [xEt, 12, z1 - c3]);
    const R = P.registro, Y = P.yunque;
    caja('registro', PISO, [R.x, c.pisoTerminado, R.z], [R.lado, .4, R.lado], 'perno', NO);
    c.cilindro('pedestal del yunque', PISO, [Y.x, Y.pedestalAlto / 2, Y.z], Y.pedestalRadio, Y.pedestalAlto, 'y', 'maderaOsc');
    c.cilindro('hueco del pedestal', PISO, [Y.x, c.pisoTerminado, Y.z], Y.pedestalRadio + Y.holgura, .6, 'y', 'goma');
    c.etiqueta(PISO, `Registro ${R.lado}×${R.lado} en la pasada del portón`, [R.x + R.lado / 2, 14, R.z + R.lado / 2]);
    c.etiqueta(PISO, 'Yunque sobre pedestal al radier (no toca el piso)', [Y.x, Y.pedestalAlto + 20, Y.z], true);

    const area = anchoP * (z1 - z0) / 1e4, placas = Math.ceil(area / (P.placa[0] * P.placa[1]));
    const m2 = `${fmt(area)} m²`, formato = `placa ${P.placa.map(l => fmt(l)).join(' × ')} (${m2})`;
    const pernos = Math.ceil(2 * (anchoP + z1 - z0) / P.pernoPlataformaPaso);
    c.agregarPiezas(
      { elemento: 'Preparación del radier', escuadria: m2, cantidad: 1, largo: null,
        especificacion: 'Antes de armar: limpiar el radier, sellar las grietas y aplicar cebo o barrera contra hormigas; calces para nivelar los durmientes' },
      { elemento: 'Durmiente del piso', escuadria: '2 × 4" acostado', cantidad: xsD.length, largo: (z1 - z0) / 100, clase: 'suelo' },
      { elemento: 'Tira de goma bajo durmiente', escuadria: `${DA} cm × ${P.gomaPisoH * 10} mm`, cantidad: xsD.length, largo: (z1 - z0) / 100,
        especificacion: 'Goma dura en tira, desacopla el piso del radier' },
      { elemento: 'Lana mineral del piso', escuadria: `${m2}, ${DH * 10 - 5} mm`, cantidad: 1, largo: null,
        especificacion: 'Lana mineral entre durmientes (no poliestireno: las hormigas lo excavan); quita el efecto tambor' },
      { elemento: 'OSB 18 del piso', escuadria: formato, cantidad: placas, largo: null,
        especificacion: 'OSB 18 mm encolado y atornillado a los durmientes' },
      { elemento: 'Terciado 12 del piso', escuadria: formato, cantidad: placas, largo: null,
        especificacion: 'Terciado 12 mm con las juntas cruzadas respecto del OSB, encolado y atornillado' },
      { elemento: 'Terminación del piso', escuadria: m2, cantidad: 1, largo: null, especificacion: terminacion.especificacion },
      { elemento: 'Perno de la plataforma a la solera', escuadria: 'Ø 3/8" galvanizado en caliente', cantidad: pernos, largo: null,
        especificacion: `Cada ${P.pernoPlataformaPaso} cm, con golilla de goma (lastre útil y menos vibración)` },
      { elemento: 'Registro de inspección', escuadria: `${R.lado} × ${R.lado} cm`, cantidad: 1, largo: null,
        especificacion: 'Tapa removible a ras de piso, en la pasada del portón: revisar y reponer cebos cada 3 meses' },
      { elemento: 'Pedestal del yunque', escuadria: `Ø ${2 * Y.pedestalRadio} × ${Y.pedestalAlto} cm`, cantidad: 1, largo: null,
        especificacion: `Tronco o base de madera dura apoyada en el radier; pasa por un hueco de Ø ${2 * (Y.pedestalRadio + Y.holgura)} con borde de goma, sin tocar el piso` });

    // luces libres entre apoyos (solera o durmiente): con 40 a eje y durmientes de 9, la luz máxima es 31
    const apoyos = [[bordeIzq - P.soleraAncho, bordeIzq], ...xsD.map(x => [x, x + DA]), [bordeDer, bordeDer + P.soleraAncho]];
    const luz = Math.max(...apoyos.slice(1).map(([ini], i) => ini - apoyos[i][1]));
    const luzMax = P.durmientePasoMax - DA;
    c.verificar(verificacion('piso-apoyado', 'ADR 0009', luz <= luzMax,
      `Los durmientes van cada ${P.durmientePaso} cm (máximo ${P.durmientePasoMax}): ninguna placa queda más de ${Math.round(luz)} cm sin apoyo.`,
      `Hay tramos de ${Math.round(luz)} cm de placa sin apoyo (máximo ${luzMax}, que equivale a durmientes cada ${P.durmientePasoMax}). El piso cedería bajo el banco y el laminador.`));
  }

  // interior (propuesta): elementos con su huella y su área de uso; la pasada de 80 cm de la puerta al portón
  function interior(c) {
    const { P, caja, pisoTerminado: yP } = c, M = P.mesa, L = P.laminador, W = P.lavadora, Y = P.yunque;
    if (!LADOS_BISAGRA[P.puertaBisagra]) throw new Error(`La bisagra de la puerta (puertaBisagra) debe ser 'derecha' o 'izquierda', no '${P.puertaBisagra}'`);
    const ocupa = [];   // { nombre, huella }: elementos y áreas de uso que la pasada no puede cruzar
    for (const p of c.pilares)
      ocupa.push({ nombre: `pilar (x ${p.x}, z ${p.z})`, huella: rect(p.x - P.pilar / 2, p.z - P.pilar / 2, P.pilar, P.pilar) });
    // mesa de joyero
    caja('mesa de joyero', INTERIOR, [M.x, yP, M.z], [M.ancho, M.alto - yP - M.cubierta, M.largo], 'madera', NO);
    caja('cubierta de la mesa', INTERIOR, [M.x - M.vuelo, M.alto - M.cubierta, M.z - M.vuelo], [M.ancho + 2 * M.vuelo, M.cubierta, M.largo + 2 * M.vuelo], 'maderaOsc', NO);
    ocupa.push({ nombre: 'mesa de joyero', huella: rect(M.x - M.vuelo, M.z - M.vuelo, M.ancho + 2 * M.vuelo, M.largo + 2 * M.vuelo) });
    // laminador en su banco, manivela hacia el frente
    const xMan = L.x + L.lado / 2, zEje = L.z + L.lado - L.margen;
    caja('banco del laminador', INTERIOR, [L.x, yP, L.z], [L.lado, L.banco - yP, L.lado], 'metal', NO);
    caja('laminador', INTERIOR, [L.x + L.margen, L.banco, L.z + L.margen], [L.lado - 2 * L.margen, L.alto, L.lado - 2 * L.margen], 'perno', NO);
    c.pieza('manivela del laminador', INTERIOR, [xMan, L.banco + L.manivelaAlto, zEje], [xMan, L.banco + L.manivelaAlto, zEje + L.manivelaLargo], [3, 3], 'perno');
    ocupa.push({ nombre: 'banco del laminador', huella: rect(L.x, L.z, L.lado, L.lado) },
      { nombre: 'barrido de la manivela del laminador', huella: rect(xMan - L.barridoAncho / 2, zEje, L.barridoAncho, L.manivelaLargo + 2) });
    // lavadora sobre goma antivibración, dentro de una bandeja con desagüe; área de carga por delante
    const lb = W.lado + 2 * W.bandeja;
    caja('bandeja de la lavadora', INTERIOR, [W.x - W.bandeja, yP, W.z - W.bandeja], [lb, W.bandejaAlto, lb], 'metal', NO);
    caja('goma antivibración de la lavadora', INTERIOR, [W.x, yP + .5, W.z], [W.lado, W.goma, W.lado], 'goma', NO);
    caja('lavadora', INTERIOR, [W.x, yP + .5 + W.goma, W.z], [W.lado, W.alto, W.lado], 'vinilo', NO);
    c.cilindro('desagüe de la bandeja', INTERIOR, [W.x + W.lado + W.bandeja / 2, yP + 1, W.z + 4], 1.5, 2, 'y', 'perno');
    ocupa.push({ nombre: 'lavadora', huella: rect(W.x - W.bandeja, W.z - W.bandeja, lb, lb) },
      { nombre: 'carga de la lavadora', huella: rect(W.x, W.z + W.lado + W.bandeja, W.lado, W.carga) });
    c.agregarPiezas(
      { elemento: 'Bandeja de la lavadora', escuadria: `${lb} × ${lb} cm, borde ${W.bandejaAlto} cm`, cantidad: 1, largo: null,
        especificacion: 'Bandeja de acero inoxidable o plástica rígida con salida de desagüe conectada al desagüe de la lavadora' },
      { elemento: 'Goma antivibración de la lavadora', escuadria: `${W.lado} × ${W.lado} cm, ${W.goma * 10} mm`, cantidad: 1, largo: null,
        especificacion: 'Plancha de goma antivibración bajo la lavadora (no transmite el centrifugado al piso ni a la casa)' });
    // yunque sobre su pedestal (el pedestal lo pone el piso) con su área de trabajo
    const ped = c.geometria.find(e => e.nombre === 'pedestal del yunque'), topePedestal = ped.centro[1] + ped.largo / 2;
    caja('yunque', INTERIOR, [Y.x - Y.largo / 2, topePedestal, Y.z - Y.ancho / 2], [Y.largo, Y.alto, Y.ancho], 'perno', NO);
    c.cilindro('área de trabajo del yunque', INTERIOR, [Y.x, yP + 1, Y.z], P.yunqueArea, .6, 'y', 'golpe');
    ocupa.push({ nombre: 'área de trabajo del yunque', huella: { forma: 'circulo', centro: [Y.x, Y.z], radio: P.yunqueArea } });
    // fundición en la esquina con chaflán, sobre plataforma reforzada, y el lugar donde se para el usuario
    c.geometria.push({ nombre: 'fundición', capa: INTERIOR, tipo: 'prisma', estructural: false, material: 'quebrado',
      planta: P.fundicion, y: yP, alto: P.fundicionAlto });
    const PR = P.pararse;
    c.cilindro('lugar para pararse en la fundición', INTERIOR, [PR.x, yP + 1, PR.z], PR.radio, .6, 'y', 'pasada');
    ocupa.push({ nombre: 'fundición', huella: { forma: 'poligono', puntos: P.fundicion } },
      { nombre: 'lugar para pararse en la fundición', huella: { forma: 'circulo', centro: [PR.x, PR.z], radio: PR.radio } });

    // barrido de la puerta de la casa (cuarto de círculo desde la bisagra) y pasada hasta el portón
    const lado = LADOS_BISAGRA[P.puertaBisagra];
    const bisagraX = P.puertaX + lado.bisagra * P.puertaAncho;
    c.geometria.push({ nombre: 'barrido de la puerta', capa: INTERIOR, tipo: 'sector', estructural: false, material: 'pasada',
      centro: [bisagraX, yP + .6, 0], radio: P.puertaAncho, desde: lado.desde, angulo: Math.PI / 2 });
    // de la mitad de la puerta a la mitad del vano del portón, recién adentro del costado derecho
    const a = [P.puertaX + P.puertaAncho / 2, P.pasadaInicioZ];
    const b = [P.ancho - P.pilar - P.pasadaAncho / 4, P.filasZ[1] + P.pilar / 2 + P.portonAncho / 2];
    c.pieza('pasada', INTERIOR, [a[0], yP + .7, a[1]], [b[0], yP + .7, b[1]], [P.pasadaAncho, .5], 'pasada');
    c.etiqueta(INTERIOR, `Pasada casa → portón (${P.pasadaAncho} cm)`, [(a[0] + b[0]) / 2, 14, (a[1] + b[1]) / 2]);
    c.etiqueta(INTERIOR, `Mesa de joyero ${M.largo}×${M.ancho} · luz desde la izquierda (ventana frente)`, [M.x + 25, 100, M.z + 55], true);
    c.etiqueta(INTERIOR, 'Laminador junto a la lavadora · manivela hacia el frente', [xMan, 125, L.z + 28], true);
    c.etiqueta(INTERIOR, 'Lavadora · bandeja con desagüe + goma antivibración', [W.x + 26, 105, W.z + 26], true);
    c.etiqueta(INTERIOR, `Espacio del yunque Ø${2 * P.yunqueArea}`, [Y.x, 14, Y.z + 45]);
    c.etiqueta(INTERIOR, 'Barrido de la puerta', [P.puertaX + P.puertaAncho / 2, 14, 50]);
    c.etiqueta(VENT, 'Fundición en esquina con chaflán · plataforma reforzada', [50, 80, 260], true);
    c.etiqueta(VENT, 'Aquí te paras, mirando a la esquina', [PR.x, 20, PR.z - 7]);

    // la mesa no entra en el barrido de la puerta: punto de la mesa más cercano a la bisagra, dentro del cuarto de círculo
    const huellaDe = n => ocupa.find(o => o.nombre === n).huella;
    const hm = huellaDe('mesa de joyero'), cerca = [Math.max(hm.min[0], Math.min(bisagraX, hm.max[0])), Math.max(hm.min[1], Math.min(0, hm.max[1]))];
    const delLado = lado.haciaX * (cerca[0] - bisagraX) >= 0;
    const aBisagra = Math.hypot(cerca[0] - bisagraX, cerca[1]);
    const invade = delLado && aBisagra < P.puertaAncho;
    c.verificar(verificacion('mesa-lejos-de-la-puerta', 'CONTEXT: puerta tapada', !invade,
      `La mesa queda a ${Math.round(aBisagra - P.puertaAncho)} cm del barrido de la puerta (bisagra a la ${P.puertaBisagra}).`,
      `La mesa entra ${Math.round(P.puertaAncho - aBisagra)} cm en el barrido de la puerta (bisagra a la ${P.puertaBisagra}): la puerta toparía con la mesa. Cambia la bisagra de lado o corre la mesa hacia el frente.`));

    // mesa junto a la fundición: a menos de distanciaFundicion hay que despejarla al fundir
    const aFundicion = distanciaEntreHuellas(hm, huellaDe('fundición'));
    c.verificar(verificacion('mesa-junto-a-la-fundicion', 'CONTEXT: zona caliente', aFundicion >= P.distanciaFundicion,
      `La mesa queda a ${Math.round(aFundicion)} cm de la fundición.`,
      `La mesa queda a ${Math.round(aFundicion)} cm de la fundición: al fundir hay que despejarla (nada de papeles, solventes ni piezas) y cubre lo que quede con una plancha incombustible.`,
      'aviso'));

    // yunque desacoplado: se mira la geometría del pedestal y del hueco que deja el piso
    const hueco = c.geometria.find(e => e.nombre === 'hueco del pedestal');
    const alRadier = ped.centro[1] - ped.largo / 2 <= 0, libre = hueco.radio - ped.radio;
    c.verificar(verificacion('yunque-desacoplado', 'ADR 0009', alRadier && libre > 0,
      `El pedestal del yunque apoya en el radier y pasa por el piso con ${libre} cm de holgura: el golpe no llega a la casa.`,
      [!alRadier && 'El pedestal del yunque no llega al radier.', libre <= 0 && 'El pedestal toca la plataforma del piso: el golpe se transmitiría a la estructura y a la casa. Agranda el hueco.']
        .filter(Boolean).join(' ')));

    const estorban = ocupa.filter(o => distanciaAHuella(a, b, o.huella) < P.pasadaAncho / 2);
    c.verificar(verificacion('pasada-libre', 'CONTEXT: pasada', estorban.length === 0,
      `La pasada de ${P.pasadaAncho} cm de la puerta de la casa al portón queda libre de elementos y áreas de uso.`,
      `La pasada de ${P.pasadaAncho} cm queda cortada por: ${estorban.map(o => o.nombre).join(', ')}. Mueve eso fuera de la pasada.`));
  }

  // costado norte de la casa: muro con sus ventanas y puerta, calefón (queda tal cual), llave, sumidero y zona de autos
  function costadoNorte(c) {
    const { P, caja } = c, MN = P.muroNorte, cara = MN.x + MN.espesor;   // cara exterior del muro norte (x = 375)
    const largoMuro = MN.z[1] - MN.z[0];
    const [c0, c1] = P.cadenaCasa;
    caja('muro norte', ENTORNO, [MN.x, 0, MN.z[0]], [MN.espesor, c0, largoMuro], 'muro', CASA);
    caja('cadena del muro norte', ENTORNO, [MN.x, c0, MN.z[0]], [MN.espesor, c1 - c0, largoMuro], 'cadena', CASA);
    caja('muro norte (2º piso)', ENTORNO, [MN.x, c1, MN.z[0]], [MN.espesor, P.muroCasaTope - c1, largoMuro], 'muroSup', CASA);
    const enMuro = (nombre, v, material) =>
      caja(nombre, ENTORNO, [cara + .2, v.y ?? 0, v.z - v.ancho / 2], [.5, v.alto, v.ancho], material, CASA);
    enMuro('ventana del baño', P.ventanaBano, 'canal');
    enMuro('ventana de la cocina', P.ventanaCocina, 'canal');
    enMuro('puerta con reja', P.puertaReja, 'puerta');
    const K = P.calefon;
    caja('calefón', ENTORNO, [cara, K.y, K.z - K.ancho / 2], [K.fondo, K.alto, K.ancho], 'metal', CASA);
    const altoChim = K.chimeneaTope - (K.y + K.alto);
    c.cilindro('chimenea del calefón', ENTORNO, [cara + K.fondo / 2, K.y + K.alto + altoChim / 2, K.chimeneaZ], K.chimeneaRadio, altoChim, 'y', 'metal', CASA);
    caja('llave de agua', ENTORNO, [cara + 1, P.llave.y, P.llave.z - 3], [6, 8, 6], 'diagonal', CASA);
    caja('sumidero', ENTORNO, [cara + 3, -1, P.sumidero.z - P.sumidero.lado / 2], [P.sumidero.lado, 2, P.sumidero.lado], 'perno', CASA);
    caja('radier del costado', ENTORNO, [cara, -2, MN.z[0]], [P.radierCostado, 2, -MN.z[0]], 'radier', CASA);
    const ZA = P.zonaAutos;
    caja('zona de 2 autos', ENTORNO, [ZA.x, 0, ZA.z], [ZA.ancho, 1, ZA.largo], 'autos', CASA);
    c.etiqueta(ENTORNO, 'Zona de 2 autos (libre al sacar la lavadora)', [ZA.x + ZA.ancho / 2, 10, ZA.z + ZA.largo / 2], true);
    c.etiqueta(ENTORNO, 'Calefón a gas (queda tal cual) · ¿chimenea sobre el catio?', [cara + 15, K.chimeneaTope - 30, K.chimeneaZ], true);
    c.etiqueta(ENTORNO, 'Llave de agua', [cara + 10, P.llave.y + 15, P.llave.z]);
    c.etiqueta(ENTORNO, 'Desagüe existente (tubo gris + sumidero)', [cara + 15, 100, P.tuboExistente.z]);
    c.etiqueta(ENTORNO, 'Ventana baño', [cara + 3, P.ventanaBano.y + P.ventanaBano.alto + 10, P.ventanaBano.z + 35]);
  }

  // servicios de la lavadora: agua desde la llave existente y desagüe al tubo gris, por fuera y pegados al muro norte
  function servicios(c) {
    const { P } = c, W = P.lavadora, T = P.tuboExistente;
    const xMuro = P.muroNorte.x + P.muroNorte.espesor + P.serviciosSeparacionMuro;   // los tubos corren pegados al muro norte
    const zSalida = W.z + W.lado / 4;                                                  // por detrás de la lavadora, hacia el muro norte
    const pct = x => `${fmt(x * 100).replace(/,00$/, '')} %`;
    // desagüe: de la lavadora al tubo existente; las alturas salen de la pendiente de cada tramo
    const ruta = [
      { nombre: 'salida de la lavadora', hasta: [P.ancho + 2, zSalida] },
      { nombre: 'pasamuro del costado derecho', hasta: [xMuro, zSalida] },
      { nombre: 'esquina de la casa', hasta: [xMuro, 0] },
      { nombre: 'muro norte, en canaleta', hasta: [xMuro, T.z] },
    ];
    let desde = [W.x + W.lado - 4, P.desagueSalidaY, zSalida];
    const tramos = ruta.map(t => {
      const largoT = Math.hypot(t.hasta[0] - desde[0], t.hasta[1] - desde[2]);
      const pendiente = P.desaguePendientes[t.nombre] ?? P.desaguePendiente;
      const tramo = { nombre: t.nombre, a: desde, b: [t.hasta[0], desde[1] - pendiente * largoT, t.hasta[1]], largo: largoT };
      desde = tramo.b;
      return tramo;
    });
    const DD = P.desagueDiametro;
    for (const t of tramos) c.pieza(`desagüe: ${t.nombre}`, SERVICIOS, t.a, t.b, [DD, DD], 'desague', CASA);

    // llegada al tubo existente: por arriba, con cámara de aire y sin sellar (no sifona ni devuelve olores)
    const fin = tramos.at(-1).b, bordeTubo = T.alto;
    c.cilindro('tubo de desagüe existente', ENTORNO, [xMuro, T.alto / 2, T.z], T.radio, T.alto, 'y', 'vecino', CASA);
    const camara = fin[1] - bordeTubo;
    const yCaida = camara >= P.camaraAire ? bordeTubo + P.camaraAire : fin[1] - 1;   // termina sobre el borde, sin entrar
    c.pieza('caída al tubo existente', SERVICIOS, fin, [fin[0], yCaida, fin[2]], [DD, DD], 'desague', CASA);
    c.verificar(verificacion('desague-camara-de-aire', 'CONTEXT: lavadora', camara >= P.camaraAire && !P.desagueSellado,
      `El desagüe llega al tubo existente por arriba, ${Math.round(camara)} cm sobre su borde y sin sellar: queda una cámara de aire.`,
      [camara < P.camaraAire && `El desagüe llega a ${Math.round(fin[1])}, ${camara < 0 ? 'bajo' : 'apenas sobre'} el borde del tubo (${bordeTubo}): debe llegar por arriba con al menos ${P.camaraAire} cm de cámara de aire. Sube la salida de la lavadora o acorta el recorrido.`,
       P.desagueSellado && 'La llegada al tubo está sellada: debe quedar sin sellar, con cámara de aire, para que no sifone ni devuelva olores.']
        .filter(Boolean).join(' ')));

    // agua: de la llave existente a la entrada de la lavadora (atrás), a la altura de la llave, pegada al muro
    const aguaPts = [[xMuro, P.llave.z], [xMuro, 0], [xMuro, zSalida], [P.ancho + 2, zSalida], [W.x + W.lado - 10, W.z - 3]]
      .map(([x, z]) => [x, P.aguaY, z]);
    for (let i = 0; i < aguaPts.length - 1; i++) c.pieza('agua', SERVICIOS, aguaPts[i], aguaPts[i + 1], [P.aguaDiametro, P.aguaDiametro], 'agua', CASA);
    // canaleta de protección a lo largo del muro norte, del tubo existente a la esquina, envolviendo ambos tubos
    const CN = P.canaletaServicios, zCan = [T.z - 5, 0];
    c.caja('canaleta de protección', SERVICIOS, [xMuro - CN.ancho / 2, CN.y, zCan[0]], [CN.ancho, CN.alto, zCan[1] - zCan[0]], 'autos', CASA);
    c.etiqueta(SERVICIOS, 'Agua: extensión desde la llave existente', [xMuro + 4, P.aguaY - 8, P.llave.z + 100]);
    c.etiqueta(SERVICIOS, `Desagüe: pendiente ${pct(P.desaguePendiente)} hacia el tubo gris, llega por arriba sin sellar`, [xMuro + 4, fin[1] + 15, T.z + 125], true);

    const metros = pts => pts.slice(1).reduce((s, p, i) => s + largo(pts[i], p), 0) / 100;
    const largoDesague = (tramos.reduce((s, t) => s + t.largo, 0) + camara) / 100;
    c.agregarPiezas(
      { elemento: 'Cañería de agua', escuadria: `PPR o PEX ${P.aguaDiametro * 10} mm, aislada en el tramo exterior`, cantidad: 1, largo: metros(aguaPts),
        especificacion: 'Desde la llave existente, con llave de paso junto a la lavadora y abrazaderas inoxidables al muro' },
      { elemento: 'Cañería de desagüe', escuadria: `PVC sanitario ${P.desagueDiametro * 10} mm`, cantidad: 1, largo: largoDesague,
        especificacion: `Pendiente continua de ${pct(P.desaguePendiente)}, pasamuro sellado, llega por arriba al tubo existente sin sellar` },
      { elemento: 'Canaleta de protección', escuadria: `${CN.ancho} × ${CN.alto} cm`, cantidad: 1, largo: (zCan[1] - zCan[0]) / 100,
        especificacion: 'Canaleta o perfil metálico galvanizado que protege los tubos en la zona de los autos, atornillada al muro' },
      ...c.elegida('rutaServicios').piezas());

    const pendienteDe = t => (t.a[1] - t.b[1]) / t.largo;
    const fuera = tramos.filter(t => pendienteDe(t) < P.desaguePendienteMin - 1e-9 || pendienteDe(t) > P.desaguePendienteMax + 1e-9);
    c.verificar(verificacion('desague-pendiente-continua', 'CONTEXT: lavadora', fuera.length === 0,
      `El desagüe baja de forma continua en todos sus tramos (entre ${pct(P.desaguePendienteMin)} y ${pct(P.desaguePendienteMax)}).`,
      fuera.map(t => `El tramo "${t.nombre}" queda con ${pct(pendienteDe(t))}`).join('; ')
        + ` (debe bajar entre ${pct(P.desaguePendienteMin)} y ${pct(P.desaguePendienteMax)}: con menos se tapa, con más se separa el agua de los sólidos).`));
  }

  // catio de las gatas sobre el techo: postes en los anclajes del techo, malla de 90 en corridas, techo de malla
  function catio(c) {
    const { P, techoTop, zFin, anchoTecho: AT, caja } = c, VA = P.vigaTechoAncho, ZC = P.catioFondo, PS = P.posteCatio;
    const opcion = c.elegida('catio'), alto = P.catioAlto ?? opcion.alto;
    const yP = z => techoTop(z) + P.cubiertaH + P.parapeto;    // tope del parapeto
    for (const x of [0, AT])
      c.pieza('malla del catio', CATIO, [x, yP(0) + alto / 2, 0], [x, yP(ZC) + alto / 2, ZC], [1, alto], 'malla');
    caja('malla del catio', CATIO, [0, yP(ZC) - P.parapeto, ZC], [AT, alto + P.parapeto, 1], 'malla', NO);
    c.pieza('malla del catio (techo)', CATIO, [AT / 2, yP(0) + alto, 0], [AT / 2, yP(ZC) + alto, ZC], [AT, 1], 'malla');
    const zFrente = ZC - PS;   // los postes del frente quedan dentro del catio
    const postes = [];
    for (const x of [VA / 2, AT - VA / 2]) for (const z of [0, P.catioPasoPostes, zFrente]) postes.push([x, z]);
    for (let x = P.catioPasoPostes; x < AT - VA; x += P.catioPasoPostes) postes.push([x, zFrente]);
    for (const [x, z] of postes) caja('poste del catio', CATIO, [x - PS / 2, yP(z) - P.parapeto, z], [PS, alto + P.parapeto, PS], 'maderaOsc', NO);
    const PC = P.cajaPuertaCatio;
    caja('puerta del catio', CATIO, [PC.x, yP(ZC) - P.parapeto, ZC - P.puertaCatioEspesor / 2], [PC.ancho, alto, P.puertaCatioEspesor], 'panel', NO);
    caja('franja libre', CATIO, [0, techoTop(zFin) + P.cubiertaH + P.membranaH, ZC], [P.ancho, .3, zFin - ZC], 'pasada', NO);
    const VD = P.ventanaDormitorio, topeVentana = VD.alfeizar + VD.alto, M5 = P.cajaVentanaMargen;
    const altoCaja = VD.alto + 2 * M5;
    if (opcion.cajaVentana)
      caja('caja de malla en la ventana', CATIO, [VD.x, VD.alfeizar - M5, 0], [VD.ancho, altoCaja, P.cajaVentanaFondo], 'malla', NO);
    c.etiqueta(CATIO, `Catio cerrado ${AT} × ${ZC} · ${alto + P.parapeto} libres`, [0, yP(P.catioPasoPostes) + alto + 20, P.catioPasoPostes]);
    c.etiqueta(CATIO, 'Puerta de malla (entrar a limpiar)', [PC.x + PC.ancho / 2, yP(ZC) + 60, ZC + 2], true);
    c.etiqueta(CATIO, `Franja libre ${zFin - ZC} cm hasta la canaleta`, [P.ancho / 2, techoTop(zFin - 50) + 10, zFin - 40]);

    // malla en franjas del ancho del rollo: corridas en los tres lados (el cuarto es el muro de la casa), techo y caja
    const franjas = altoF => Math.ceil(altoF / P.mallaAncho);
    const corridas = franjas(alto), franjasTecho = franjas(ZC);
    const consumo = (corridas * (2 * ZC + AT) + franjasTecho * AT
      + (opcion.cajaVentana ? franjas(altoCaja) * (2 * P.cajaVentanaFondo + VD.ancho) + VD.ancho : 0)) / 100;
    c.agregarPiezas(
      { elemento: 'Malla del catio', escuadria: `rollo de ${P.mallaAncho} cm (ya comprado: ${P.mallaRollo} m)`, cantidad: 1, largo: consumo,
        especificacion: `${corridas} corrida(s) en los costados y el frente, ${franjasTecho} franjas de techo${opcion.cajaVentana ? ' y la caja de la ventana' : ''}; desmontable para limpiar` },
      { elemento: 'Poste del catio', escuadria: '2 × 2"', cantidad: postes.length, largo: (alto + P.parapeto) / 100,
        especificacion: `${c.especificarMadera('techo')}; apernado a la placa de anclaje que quedó en la viga de techo` },
      { elemento: 'Puerta del catio', escuadria: `${PC.ancho} × ${alto} cm`, cantidad: 1, largo: null,
        especificacion: 'Bastidor de madera con malla, bisagras inoxidables y candado' },
      ...(opcion.cajaVentana ? [{ elemento: 'Caja de malla en la ventana', escuadria: `${VD.ancho} × ${altoCaja} × ${P.cajaVentanaFondo} cm`, cantidad: 1, largo: null,
        especificacion: 'Caja de malla con bastidor que une el catio bajo con la ventana del dormitorio' }] : []));

    const margen = P.mallaRollo - consumo, alcanza = margen >= 0;
    c.verificar(verificacion('malla-suficiente', 'CONTEXT: catio', alcanza && margen >= P.mallaMargenMin,
      `La malla del catio usa ${fmt(consumo)} m del rollo de ${P.mallaRollo} m: sobran ${fmt(margen)} m para reparaciones.`,
      alcanza ? `La malla del catio usa ${fmt(consumo)} m del rollo de ${P.mallaRollo} m: sobran solo ${fmt(margen)} m (menos de ${P.mallaMargenMin}). Cortar con cuidado o comprar un tramo de reserva.`
        : `La malla del catio necesita ${fmt(consumo)} m y el rollo tiene ${P.mallaRollo} m: faltan ${fmt(-margen)} m.`,
      alcanza ? 'aviso' : 'falla'));
    // la puerta está en el frente del catio y abre hacia la franja libre que queda hasta la canaleta
    const franja = zFin - ZC;
    c.verificar(verificacion('puerta-catio-accesible', 'CONTEXT: catio', franja >= P.franjaLibreMin,
      `La puerta del catio da a una franja libre de ${franja} cm hasta la canaleta: se entra a limpiar parado en el techo.`,
      `Entre la puerta del catio y la canaleta quedan solo ${franja} cm de franja libre (mínimo ${P.franjaLibreMin}): no hay dónde pararse para entrar. Acorta el catio.`));
    const techoCatio = yP(0) + alto;
    c.verificar(verificacion('catio-sobre-ventana', 'CONTEXT: catio', techoCatio > topeVentana || opcion.cajaVentana,
      opcion.cajaVentana ? `El catio es bajo (techo a ${Math.round(techoCatio)}), pero la caja de malla une la ventana del dormitorio con el catio.`
        : `El techo del catio queda a ${Math.round(techoCatio)}, por encima de la ventana del dormitorio (tope a ${topeVentana}): las gatas no se escapan por arriba.`,
      `El techo del catio queda a ${Math.round(techoCatio)}, bajo el tope de la ventana del dormitorio (${topeVentana}): las gatas saldrían por encima. Sube el catio o agrega una caja de malla en la ventana.`));
    // chimenea del calefón: su salida debe quedar bien por encima del catio (la altura actual es estimada por foto)
    const sobre = P.calefon.chimeneaTope - techoCatio;
    c.verificar(verificacion('chimenea-sobre-catio', 'CONTEXT: calefón', sobre >= P.chimeneaSobreCatio,
      `La chimenea del calefón termina ${Math.round(sobre)} cm por encima del techo del catio.`,
      `La chimenea del calefón termina a ~${P.calefon.chimeneaTope} (estimado), apenas ${Math.round(sobre)} cm sobre el techo del catio: hay que medir la altura real y, si hace falta, prolongarla al menos ${P.chimeneaSobreCatio} cm por encima. Un calefón mal ventilado produce monóxido de carbono.`,
      'aviso'));
  }

  // escalera de las gatas (repisa bajo la ventana y peldaños hasta el techo) y rincón con sombra contra el muro
  function escaleraYRincon(c) {
    const { P, techoTop, caja } = c, VD = P.ventanaDormitorio, E = P.escaleraGatas;
    const superficie = z => techoTop(z) + P.cubiertaH + P.membranaH;   // sobre la membrana
    const niveles = [{ nombre: 'el alféizar', y: VD.alfeizar }];
    for (let i = 0; i <= E.peldanos; i++) {
      const tope = VD.alfeizar - E.repisaBajoAlfeizar - i * E.peldano, z0 = i * E.fondo;
      caja(i === 0 ? 'repisa bajo la ventana' : 'peldaño de las gatas', CATIO, [E.x, superficie(z0 + E.fondo), z0],
        [E.ancho, tope - superficie(z0 + E.fondo), E.fondo], i === 0 ? 'maderaOsc' : 'madera', NO);
      niveles.push({ nombre: i === 0 ? 'la repisa' : `el peldaño ${i}`, y: tope });
    }
    niveles.push({ nombre: 'el techo', y: superficie((E.peldanos + 1) * E.fondo) });
    const saltos = niveles.slice(1).map((n, i) => ({ de: niveles[i].nombre, a: n.nombre, alto: niveles[i].y - n.y }));
    const altos = saltos.filter(sl => sl.alto > P.desnivelGatasMax);
    // "de el" → "del", "a el" → "al"
    const contraer = (prep, t) => t.startsWith('el ') ? `${prep === 'de' ? 'del' : 'al'} ${t.slice(3)}` : `${prep} ${t}`;
    const frase = sl => { const t = `${contraer('de', sl.de)} ${contraer('a', sl.a)} hay ${Math.round(sl.alto)} cm`; return t[0].toUpperCase() + t.slice(1); };
    c.etiqueta(CATIO, `Repisa + ${E.peldanos} peldaños de ~${E.peldano} (lado izq., donde abre la ventana)`, [E.x + E.ancho / 2, VD.alfeizar + 10, 60], true);
    c.verificar(verificacion('peldanos-para-gatas', 'CONTEXT: catio', altos.length === 0,
      `De la ventana al techo ningún desnivel pasa de ${Math.round(Math.max(...saltos.map(sl => sl.alto)))} cm (máximo ${P.desnivelGatasMax}): sirve para gatas mayores.`,
      altos.map(frase).join('; ') + ` (máximo ${P.desnivelGatasMax}). Agrega un peldaño.`));

    const RN = P.rincon, TR = P.techoRincon;
    caja('rincón con sombra', CATIO, [RN.x, superficie(RN.fondo), 0], [RN.ancho, RN.alto, RN.fondo], 'vecino', NO);
    caja('techo del rincón', CATIO, [RN.x - TR.vuelo, superficie(RN.fondo) + RN.alto, 0], [RN.ancho + 2 * TR.vuelo, TR.espesor, RN.fondo + TR.vuelo], 'maderaOsc', NO);
    c.etiqueta(CATIO, 'Rincón con sombra', [RN.x + RN.ancho / 2, superficie(30) + 70, 30]);
    c.agregarPiezas(
      { elemento: 'Repisa y peldaños de las gatas', escuadria: `${E.ancho} × ${E.fondo} cm`, cantidad: E.peldanos + 1, largo: null,
        especificacion: `Cajones de madera con superficie antideslizante (goma o alfombra exterior), escalones de ~${E.peldano} cm, apoyados sin perforar la membrana` },
      { elemento: 'Rincón con sombra', escuadria: `${RN.ancho} × ${RN.fondo} × ${RN.alto} cm`, cantidad: 1, largo: null,
        especificacion: 'Caja abierta con techo de madera contra el muro, dentro del catio, para la sombra de la tarde' });
  }

  // anclajes extra al radier (opción): escuadras desmontables junto a los pilares del frente
  function anclajesExtra(c) {
    const n = c.elegida('anclajes').anclajes;
    for (const x of c.xs.slice(0, n))
      c.caja('anclaje al radier', BASE_C, [x - 6, 0, c.P.filasZ[2] + c.P.pilar / 2], [12, 15, 3], 'metal');
    if (n) c.agregarPiezas({ elemento: 'Anclaje al radier', escuadria: 'Escuadra galvanizada + perno de expansión inoxidable', cantidad: n,
      largo: null, especificacion: 'Desmontable (tuerca, no químico); ubicar antes las cámaras de inspección' });
  }

  // posición del taller: x0 corre todo respecto de la orilla izquierda (lado de la muralla vecina); la casa no se mueve
  function ubicarEnElSitio(c) {
    const { P } = c, corre = q => [q[0] + P.x0, q[1], q[2]];
    for (const e of c.geometria.filter(e => !e.casa))
      for (const k of ['min', 'posicion', 'centro', 'a', 'b']) if (e[k]) e[k] = corre(e[k]);
    const xMin = Math.min(...c.geometria.filter(e => e.estructural).map(xMinimo));
    c.verificar(verificacion('muralla-vecina-sin-carga', 'CONTEXT: bordes', xMin >= 0,
      'Ningún elemento estructural se apoya en la muralla del vecino.',
      `La estructura invade ${Math.round(-xMin)} cm hacia la muralla del vecino, que es endeble y no puede recibir carga.`));
  }

  const PARTES = [baseYEsqueleto, rigidez, porton, aberturasYCielo, extraccion, techo, aguasLluvias, muros, piso, interior, costadoNorte, servicios, catio, escaleraYRincon, anclajesExtra, ubicarEnElSitio];

  function modeloTaller(parametros = {}, seleccion = {}) {
    const P = { ...PARAMETROS_ACORDADOS };
    for (const [k, v] of Object.entries(parametros))   // un parámetro-objeto se completa con sus valores acordados
      P[k] = v && typeof v === 'object' && !Array.isArray(v) && P[k] && !Array.isArray(P[k]) ? { ...P[k], ...v } : v;
    const c = contexto(P, seleccion);
    for (const parte of PARTES) parte(c);
    return {
      geometria: c.geometria,
      verificaciones: c.verificaciones,
      piezas: c.piezas,
      especificaciones: especificacionesPara(c.P),
      opciones: OPCIONES.map(o => ({ id: o.id, titulo: o.titulo, afecta: o.afecta, elegida: c.elegida(o.id).id,
        alternativas: o.alternativas.map(({ especificar, piezas, especificacion, anclajes, material, combustible, rielInferior, alto, cajaVentana, ...a }) => a) })),
    };
  }

  // preguntas abiertas para quien presupueste (lo que el dueño todavía no sabe y el constructor puede responder)
  const PREGUNTAS = [
    '¿Qué madera consigue y a qué precio para cada alternativa de estructura? ¿Puede conseguir piezas de 3,6 m para las vigas de techo o conviene empalmar?',
    '¿Cuánto cuesta cada alternativa de membrana del techo, portón, revestimiento y terminación del piso (tablas de alternativas)?',
    '¿Cómo cotiza la mano de obra para que todo quede atornillado y desarmable?',
    '¿Puede hacer la perforación de prueba en la cadena del muro y detectar el fierro antes de fijar la viga de apoyo?',
    '¿Recomienda sumar los 3 anclajes al radier en el borde del patio? Antes habría que ubicar las cámaras de inspección.',
    '¿Incluye la reparación previa del muro (sellar grietas, impermeabilizar) y la revisión de la bajada de aguas lluvias?',
    '¿Qué plazo estima y en qué orden armaría (base, esqueleto, techo, muros, piso, interior)?',
    '¿El traslado de la lavadora con su agua y desagüe por fuera lo hace usted o un gasfíter?',
  ];

  // términos del proyecto que un tercero puede no conocer
  const TERMINOS = [
    ['Cadena del muro', 'Viga de hormigón armado que corre por lo alto del primer piso del muro de ladrillo de la casa (entre 230 y 260 cm de altura). El taller se afianza a ella; no es una cadena metálica.'],
    ['Cadena de lluvia', 'Cadena metálica colgada desde la canaleta que reemplaza a la bajada de aguas lluvias: el agua baja por ella hasta un pozo de grava.'],
    ['Viga de apoyo', 'Viga de madera atornillada a la cadena del muro, a lo largo de todo el taller; amarra la estructura a la casa.'],
    ['Solera perimetral', 'Marco de madera en el suelo, sobre goma, del que parten los pilares.'],
    ['Lastre útil', 'El peso del piso, los muebles y las máquinas, que ayuda a mantener el taller en su lugar sin perforar el radier.'],
    ['Catio', 'Recinto cerrado de malla sobre el techo del taller para que dos gatas tomen sol sin escaparse.'],
    ['Sofito', 'Tapa por debajo del alero que lo cierra contra el viento y los pájaros.'],
    ['Cielo', 'El cielo raso interior (la cara de abajo del techo vista desde adentro).'],
    ['A2 y A4', 'Calidades de acero inoxidable; la A4 resiste mejor la brisa marina.'],
    ['Zincalum', 'Acero con recubrimiento de aluminio y zinc; prepintado, resiste mejor que el galvanizado común.'],
    ['Radier', 'La losa de hormigón del patio sobre la que se apoya el taller.'],
  ];

  const esc = t => String(t ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const largoTexto = p => p.cortes ? p.cortes.map(k => `${k.cantidad} × ${fmt(k.largo)} m`).join(' + ')
    : p.largo != null ? `${fmt(p.largo)} m` : '';

  // documento para quien presupueste: HTML autocontenido e imprimible, en prosa, sin referencias internas
  function documentoPresupuesto(parametros = {}, seleccion = {}) {
    const m = modeloTaller(parametros, seleccion), P = { ...PARAMETROS_ACORDADOS, ...parametros };
    const elegida = id => { const o = m.opciones.find(o => o.id === id); return o.alternativas.find(a => a.id === o.elegida); };
    const nPilares = m.piezas.find(p => p.elemento === 'Pilar').cantidad, [c0, c1] = P.cadenaCasa;
    const avisos = m.verificaciones.filter(v => v.estado !== 'ok');
    const fila = p => `<tr><td><b>${esc(p.elemento)}</b>${p.capas ? `<ul>${p.capas.map(k => `<li>${esc(k.capa)}: ${fmt(k.cantidad)} ${k.unidad} — ${esc(k.especificacion)}</li>`).join('')}</ul>` : ''}</td>`
      + `<td>${esc(p.escuadria)}</td><td>${p.cantidad}</td><td>${largoTexto(p)}${p.nota ? `<br><i>${esc(p.nota)}</i>` : ''}</td><td>${esc(p.especificacion)}</td></tr>`;
    const tablaOpcion = o => `<h3>${esc(o.titulo)}</h3><table><tr><th>Alternativa</th><th>Ventajas</th><th>Desventajas</th><th>Precio</th></tr>`
      + o.alternativas.map(a => `<tr><td><b>${esc(a.nombre)}</b>${a.recomendada ? '<br><span class="rec">recomendada</span>' : ''}${a.id === o.elegida ? '<br><span class="eleg">elegida en este documento</span>' : ''}</td>`
        + `<td>${esc(a.ventajas)}</td><td>${esc(a.desventajas)}</td><td class="precio"></td></tr>`).join('') + '</table>';
    return `<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Taller de joyería — documento para presupuesto</title>
<style>
body { font-family: system-ui, sans-serif; max-width: 960px; margin: 24px auto; padding: 0 16px; color: #222; line-height: 1.45; }
h1 { font-size: 22px; } h2 { font-size: 18px; border-bottom: 2px solid #ccc; padding-bottom: 4px; margin-top: 28px; } h3 { font-size: 15px; }
table { width: 100%; border-collapse: collapse; font-size: 13px; margin: 8px 0 16px; }
th, td { border: 1px solid #bbb; padding: 4px 6px; vertical-align: top; text-align: left; } th { background: #eee; }
td ul { margin: 4px 0; padding-left: 18px; } .precio { min-width: 90px; } .rec { color: #1a7f37; } .eleg { color: #1f4fd1; }
.aviso { background: #fff4e5; border-left: 4px solid #b54708; padding: 6px 10px; margin: 6px 0; }
@media print { body { margin: 0; max-width: none; } h2 { page-break-after: avoid; } tr { page-break-inside: auto; } h3 { page-break-after: avoid; } }
dt { font-weight: 600; margin-top: 6px; } dd { margin-left: 18px; }
</style></head><body>
<h1>Taller de joyería — documento para presupuesto</h1>
<p>En este documento se verá qué se quiere construir, la lista de piezas con las alternativas elegidas, una tabla por cada punto de decisión para cotizar todas sus alternativas, las fijaciones y precauciones de obra, el mantenimiento y algunas preguntas para quien presupueste. Las medidas van en centímetros salvo que se indique otra cosa.</p>
<h2>Qué se va a construir</h2>
<p>Un taller de joyería y orfebrería de madera, de ${P.ancho} × ${P.fondo} cm, apoyado sobre el radier del patio detrás de la casa y afianzado a la cadena del muro trasero, sin perforar el radier. Es modular y se puede desarmar: los paneles y el techo van atornillados a un esqueleto de ${nPilares} pilares. Al final hay una lista de los términos usados.</p>
<p>La estructura descansa sobre goma dura y una solera perimetral; arriba la amarra una viga de apoyo atornillada a la cadena del muro (${c0} a ${c1} cm de altura). La rigidez la dan diagonales en las caras y el peso del interior. El techo baja de ${P.techoMuro} cm junto al muro hacia el frente, llega hasta la esquina de la casa, tiene un alero frontal de ${P.aleroFrontal} cm con sofito, canaleta y una cadena de lluvia, y es transitable para dos gatas (más adelante llevará un recinto de malla encima). Por dentro, el cielo sube hacia el frente (de ${P.cieloMuro} a ${P.cieloFrente} cm) para que el aire caliente salga por las ventanas altas.</p>
<p>Los muros son paneles con revestimiento exterior (${esc(elegida('revestimiento').nombre.toLowerCase())}), cámara ventilada, aislación y placa interior; junto a la zona de fundición, la placa interior es incombustible. El piso es una plataforma rígida y silenciosa sobre durmientes, con terminación lisa y clara (${esc(elegida('terminacionPiso').nombre.toLowerCase())}). El acceso desde el patio es un portón corredizo en el costado derecho (${esc(elegida('porton').nombre.toLowerCase())}). Adentro van una mesa de joyero, un laminador, un yunque sobre pedestal propio y la lavadora de la casa, con su agua y desagüe por fuera.</p>
${avisos.length ? `<h2>Puntos a tener en cuenta</h2>${avisos.map(v => `<div class="aviso">${esc(v.explicacion)}</div>`).join('')}` : ''}
<h2>Lista de piezas</h2>
<p>Con las alternativas elegidas en este documento. Los largos son de corte; los comerciales sugeridos van en la nota.</p>
<table><tr><th>Elemento</th><th>Escuadría o formato</th><th>Cant.</th><th>Largo</th><th>Especificación</th></tr>${m.piezas.map(fila).join('')}</table>
<h2>Alternativas para cotizar</h2>
<p>En cada punto de decisión se indica la alternativa recomendada y la elegida. Se agradece el precio de cada alternativa, para comparar.</p>
${m.opciones.map(tablaOpcion).join('')}
<h2>Fijaciones</h2><ul>${m.especificaciones.fijaciones.map(f => `<li>${esc(f)}</li>`).join('')}</ul>
<h2>Precauciones de obra</h2><ul>${m.especificaciones.precauciones.map(p => `<li><b>${esc(p.titulo)}.</b> ${esc(p.texto)}</li>`).join('')}</ul>
<h2>Mantenimiento</h2><ul>${m.especificaciones.mantenimiento.map(p => `<li><b>${esc(p.cada)}:</b> ${esc(p.texto)}</li>`).join('')}</ul>
<h2>Preguntas para quien presupueste</h2><ol>${PREGUNTAS.map(q => `<li>${esc(q)}</li>`).join('')}</ol>
<h2>Términos usados</h2><dl>${TERMINOS.map(([t, d]) => `<dt>${esc(t)}</dt><dd>${esc(d)}</dd>`).join('')}</dl>
</body></html>`;
  }

  const api = { modeloTaller, documentoPresupuesto, PARAMETROS_ACORDADOS };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else raiz.ModeloTaller = api;
})(typeof window !== 'undefined' ? window : globalThis);
