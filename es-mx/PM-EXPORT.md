# Seguimiento EDI — prototipo es-MX (handoff PM)

**Producto:** BEES Link · Administración de Link  
**Idioma UI:** Español (México)  
**Versión:** V4-es-mx (basado en V3 en inglés)  
**Audiencia:** Revisión de producto / usabilidad (no es PRD ni build de producción)

---

## 1. Qué muestra este prototipo

**Fase 2 — resolución de problemas en plataforma:** seguimiento de pedidos EDI y resolución de incidencias de producto antes del surtido, dentro de BEES One / Link Admin.

**Flujos principales:**

- Hub de **Administración de Link** → módulo **Seguimiento de pedidos EDI**
- Pestaña **Pedidos** — KPI por estado, filtros, tabla con reproceso masivo
- Pestaña **Problemas del producto** — tarjetas por tipo de incidencia, tabla contextual y acciones por línea
- **Discrepancia de precios** — selección masiva, aceptar / rechazar precio, confirmaciones
- Otras incidencias — cantidad no válida, disponibilidad de SKU, UPC no encontrado (acciones según tipo)
- **Página de pedido** y bandejas laterales (detalle de pedido, línea, búsqueda por código de barras, edición de cantidad)

---

## 2. Cómo abrirlo

1. Entra a la carpeta **`export/`** (esta carpeta).
2. Mac: doble clic en **`START-LOCAL-PREVIEW.command`**  
   Windows / Linux: `python3 serve.py` desde `export/`.
3. URL: **http://127.0.0.1:5183/**
4. Mantén la terminal abierta mientras revisas.

> No abras `prototype/index.html` directamente en el navegador (rutas de assets); usa el servidor local.

---

## 3. Recorrido sugerido

### A. Seguimiento de pedidos (pestaña Pedidos)

1. En el hub, abre **Seguimiento de pedidos EDI**.
2. Revisa tarjetas de estado: Rechazado, Procesado parcialmente, Procesado, En procesamiento.
3. Usa filtros (Estado, Cadena, Tienda, Problema, Fecha de vencimiento) y búsqueda por número de pedido u OC.
4. Selecciona filas y prueba **Reprocesar seleccionados** (pedidos elegibles).
5. Abre **Mostrar detalles del pedido** en la bandeja lateral.

### B. Problemas del producto — discrepancia de precios

1. Pestaña **Problemas del producto**.
2. Tarjeta **Discrepancia de precios** (ya seleccionada por defecto).
3. Revisa tabla: producto, pedido, OC, tienda, vencimiento, precios registrado/solicitado, diferencia, totales.
4. Acciones por fila: **Aceptar el nuevo precio** / **Aplicar precio de catálogo**.
5. Selección masiva arriba a la derecha: contador, **Deseleccionar todo**, **Aceptar seleccionados**, **Rechazar seleccionados**.

### C. Otras incidencias de producto

1. Cambia de tarjeta: **Cantidad no válida**, **Disponibilidad del SKU**, **No se encontró el UPC**.
2. Observa cómo cambian columnas y acciones según el tipo de problema.
3. Prueba búsqueda por producto/EAN y filtros de cadena, tienda y vencimiento.

### D. Página de pedido

1. Desde una OC en la tabla de productos, abre el enlace de número de OC.
2. Revisa encabezado, notas, líneas y **Reprocesar** / **Agregar nota**.

---

## 4. Alcance vs fuera de alcance

### Incluido (prototipo)

- UI en español (México) según hoja de localización EDI
- Datos mock, estados y flujos de resolución simulados
- Navegación BEES One shell (nav lateral, breadcrumb)
- Bandejas, diálogos de confirmación y toasts
- Tablas con scroll horizontal y columnas fijas (producto / selección)

### No incluido

- APIs reales, persistencia ni autenticación
- Integración con ERP / BEES backend
- Traducción completa de componentes de sistema (p. ej. paginación en inglés en algunos controles)
- Validación de negocio de producción ni permisos por rol

---

## 5. Notas de localización

- Etiquetas visibles al usuario: **es-MX**.
- Claves internas de lógica (p. ej. `Price mismatch`) permanecen en inglés en código; no afectan la UI.
- Referencia de strings: `src/i18n/translations.ts` en el repo de diseño.

---

## 6. Compartir esta carpeta

1. Comprime solo la carpeta **`export/`** (incluye `prototype/` y los scripts).
2. Envía el zip al PM; indica que abra con **`START-LOCAL-PREVIEW.command`** (Mac) o `python3 serve.py`.
3. Para actualizar después de cambios de diseño: el equipo corre `npm run build` en `web/V4-es-mx` y vuelve a empaquetar `export/`.

---

## 7. Preguntas útiles para la revisión

1. ¿Los copy en español son claros para operación en México?
2. ¿El flujo de **discrepancia de precios** (individual y masivo) es comprensible sin capacitación?
3. ¿Faltan estados, filtros o columnas para el trabajo diario del usuario?
4. ¿La prioridad entre pestañas **Pedidos** vs **Problemas del producto** coincide con el modelo mental del usuario?
5. ¿Qué incidencias deberían bloquear reproceso vs permitir resolución en línea?
