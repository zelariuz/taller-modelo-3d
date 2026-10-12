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
    largoComercial: 3.2,                         // m, largo máximo de pieza comercial
  };

  const fmt = n => n.toFixed(2).replace('.', ',');

  // Catálogo de opciones: cada punto de decisión con sus alternativas (para el presupuesto)
  const IMPREGNADO = 'Pino radiata impregnado, cepillado';
  const OPCIONES = [
    { id: 'madera', titulo: 'Madera de la estructura', alternativas: [
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
  ];

  // borde izquierdo (x mínimo) de un elemento de geometría, según su tipo
  const xMinimo = e =>
    e.tipo === 'caja' ? e.min[0]
    : e.tipo === 'pieza' ? Math.min(e.a[0], e.b[0]) - e.seccion[0] / 2
    : e.centro[0] - (e.eje === 'x' ? e.largo / 2 : e.radio);

  function modeloTaller(parametros = {}, seleccion = {}) {
    const P = { ...PARAMETROS_ACORDADOS, ...parametros };
    const elegida = id => {
      const o = OPCIONES.find(o => o.id === id);
      return o.alternativas.find(a => a.id === seleccion[id]) || o.alternativas.find(a => a.recomendada);
    };
    const madera = elegida('madera');
    const base = P.goma + P.soleraH;
    const techoTop = z => P.techoMuro - P.pendiente * z;
    const topePilar = z => techoTop(z) - P.vigaTechoH - P.vigaPerimetralH;
    const xs = [P.pilar / 2, P.ancho / 2, P.ancho - P.pilar / 2];

    const pilares = [];
    for (const x of xs) for (const z of P.filasZ) {
      if (x === xs[1] && z === P.filasZ[1]) continue;      // sin pilar central
      pilares.push({ x, z, alto: topePilar(z) - base });
    }
    const largoPilar = Math.max(...pilares.map(p => p.alto)) / 100;

    const geometria = [];
    const caja = (nombre, capa, min, tam, material, { estructural = true } = {}) =>
      geometria.push({ nombre, capa, tipo: 'caja', min, tam, material, estructural });
    const BASE_C = 'Base (goma + solera)', ESQ = 'Esqueleto (pilares + vigas)', APOYO = 'Viga de apoyo en cadena';
    const G = P.gomaLado, S = P.soleraAncho, VP = P.vigaPerimetralH;

    // base: gomas bajo cada pilar y solera perimetral
    for (const p of pilares) caja('goma', BASE_C, [p.x - G / 2, 0, p.z - G / 2], [G, P.goma, G], 'goma', { estructural: false });
    const z0 = P.filasZ[0] - P.pilar / 2;
    caja('solera', BASE_C, [0, P.goma, z0], [P.ancho, P.soleraH, S], 'maderaOsc');
    caja('solera', BASE_C, [0, P.goma, P.fondo - S], [P.ancho, P.soleraH, S], 'maderaOsc');
    caja('solera', BASE_C, [0, P.goma, z0], [S, P.soleraH, P.fondo - z0], 'maderaOsc');
    caja('solera', BASE_C, [P.ancho - S, P.goma, z0], [S, P.soleraH, P.fondo - z0], 'maderaOsc');

    // esqueleto: vigas perimetrales bajo las vigas de techo y pilares
    const vigaInf = z => techoTop(z) - P.vigaTechoH;
    const [zA, , zF] = P.filasZ;
    caja('viga perimetral', ESQ, [0, vigaInf(zA) - VP, zA - P.pilar / 2], [P.ancho, VP, P.pilar], 'madera');
    caja('viga perimetral', ESQ, [0, vigaInf(zF) - VP, zF - P.pilar / 2], [P.ancho, VP, P.pilar], 'madera');
    for (const x of [xs[0], xs[2]])
      geometria.push({ nombre: 'viga perimetral', capa: ESQ, tipo: 'pieza', estructural: true, material: 'madera',
        a: [x, vigaInf(zA) - VP / 2, zA - P.pilar / 2], b: [x, vigaInf(zF) - VP / 2, zF + P.pilar / 2], seccion: [P.pilar, VP] });
    for (const p of pilares)
      caja('pilar', ESQ, [p.x - P.pilar / 2, base, p.z - P.pilar / 2], [P.pilar, p.alto, P.pilar], 'madera');

    caja('viga de apoyo', APOYO, [0, P.apoyoY, 0], [P.ancho, P.apoyoH, P.apoyoEspesor], 'maderaOsc');
    const xsPernos = [];
    for (let x = P.pernoX0; x < P.ancho; x += P.pernoPaso) xsPernos.push(x);
    for (const x of xsPernos)
      geometria.push({ nombre: 'perno de anclaje', capa: APOYO, tipo: 'cilindro', estructural: true,
        material: 'perno', centro: [x, P.pernoY, P.apoyoEspesor], radio: 1, largo: 8, eje: 'z' });

    // posición del taller: x0 corre todo respecto de la orilla izquierda (lado de la muralla vecina)
    for (const e of geometria) {
      if (e.min) e.min = [e.min[0] + P.x0, e.min[1], e.min[2]];
      if (e.centro) e.centro = [e.centro[0] + P.x0, e.centro[1], e.centro[2]];
      if (e.a) { e.a = [e.a[0] + P.x0, e.a[1], e.a[2]]; e.b = [e.b[0] + P.x0, e.b[1], e.b[2]]; }
    }
    const xMinEstructural = Math.min(...geometria.filter(e => e.estructural).map(xMinimo));

    const lc = String(P.largoComercial).replace('.', ',');
    const verificacion = (id, protege, ok, siOk, siFalla) =>
      ({ id, protege, estado: ok ? 'ok' : 'falla', explicacion: ok ? siOk : siFalla });
    const verificaciones = [
      verificacion('pilares-largo-comercial', 'ADR 0006', largoPilar <= P.largoComercial,
        `Los pilares miden hasta ${fmt(largoPilar)} m y caben en piezas comerciales de ${lc} m.`,
        `Los pilares miden ${fmt(largoPilar)} m: no caben en piezas comerciales de ${lc} m. Baja el techo o considera empalmes o madera de mayor largo.`),
      verificacion('muralla-vecina-sin-carga', 'CONTEXT: bordes', xMinEstructural >= 0,
        'Ningún elemento estructural se apoya en la muralla del vecino.',
        `La estructura invade ${Math.round(-xMinEstructural)} cm hacia la muralla del vecino, que es endeble y no puede recibir carga.`),
    ];

    return {
      geometria,
      verificaciones,
      piezas: [
        { elemento: 'Pilar', escuadria: '4 × 4"', cantidad: pilares.length, largo: largoPilar, clase: 'pilar' },
        { elemento: 'Solera perimetral', escuadria: '2 × 4" (acostada)', cantidad: 4, largo: P.ancho / 100, clase: 'suelo' },
        { elemento: 'Viga perimetral superior', escuadria: '2 × 6" doble', cantidad: 4, largo: P.ancho / 100, clase: 'interior' },
        { elemento: 'Viga de apoyo en la cadena', escuadria: '2 × 8"', cantidad: 1, largo: P.ancho / 100, clase: 'contacto-muro' },
      ].map(p => ({ ...p, especificacion: madera.especificar(p.clase) })).concat(
        { elemento: 'Perno de anclaje a la cadena', escuadria: 'Ø 3/8" galvanizado en caliente o inoxidable', cantidad: xsPernos.length,
          largo: null, especificacion: 'Perno con anclaje químico; antes de perforar, detectar el fierro de la cadena' }),
      opciones: OPCIONES.map(o => ({ id: o.id, titulo: o.titulo, elegida: elegida(o.id).id,
        alternativas: o.alternativas.map(({ especificar, ...a }) => a) })),
    };
  }

  const api = { modeloTaller, PARAMETROS_ACORDADOS };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else raiz.ModeloTaller = api;
})(typeof window !== 'undefined' ? window : globalThis);
