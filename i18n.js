/**
 * English / Spanish UI strings for EDI Central Tracking ops prototype.
 * Proper nouns (retailers, POCs, vendors, SKUs, order numbers) stay untranslated at call sites.
 */
window.I18n = (function () {
  const STORAGE_KEY = 'edi-ops-lang';
  let lang = localStorage.getItem(STORAGE_KEY) || 'en';
  if (lang !== 'en' && lang !== 'es') lang = 'en';

  const STATUS = {
    en: { ACCEPTED: 'Accepted', BLOCKED: 'Partially accepted', REJECTED: 'Rejected', IN_QUEUE: 'Pending' },
    es: { ACCEPTED: 'Aceptado', BLOCKED: 'Parcialmente aceptado', REJECTED: 'Rechazado', IN_QUEUE: 'Pendiente' },
  };

  const LINE_STATUS = {
    en: { OK: 'Accepted', ALERT: 'Rejected', REJECTED: 'Rejected', PENDING: 'Pending' },
    es: { OK: 'Aceptado', ALERT: 'Rechazado', REJECTED: 'Rechazado', PENDING: 'Pendiente' },
  };

  const RULE = {
    PRODUCT_ISSUES: {
      en: { label: 'Product issues', actionLabel: 'Reprocess', orderCopy: 'Multiple product lines need review. Valid lines were accepted.', blurb: 'This order has more than one product issue across its lines. Reprocess to send the order back through validation.' },
      es: { label: 'Incidencias de producto', actionLabel: 'Reprocesar', orderCopy: 'Varias líneas de producto requieren revisión. Las líneas válidas fueron aceptadas.', blurb: 'Este pedido tiene más de una incidencia de producto en sus líneas. Reprocese para volver a enviar el pedido a validación.' },
    },
    NO_ACCEPTED_LINES: {
      en: { label: 'No accepted lines', actionLabel: 'Reprocess', orderCopy: 'No lines in this order were accepted.', blurb: 'Every line failed validation. Reprocess to send the order back through validation.' },
      es: { label: 'Sin líneas aceptadas', actionLabel: 'Reprocesar', orderCopy: 'No se aceptó ninguna línea de este pedido.', blurb: 'Todas las líneas fallaron la validación. Reprocese para volver a enviar el pedido a validación.' },
    },
    POC_NOT_FOUND: {
      en: { label: 'POC not found', actionLabel: 'Reprocess', orderCopy: 'The POC referenced in this order is not mapped to your vendor — the order cannot be validated or created in BEES.', blurb: 'The POC referenced by this order is not mapped to the vendor. Without a valid POC, downstream validations and order creation cannot run. Reprocess after the POC mapping is fixed upstream.' },
      es: { label: 'POC no encontrado', actionLabel: 'Reprocesar', orderCopy: 'El POC referenciado en este pedido no está mapeado a su proveedor — el pedido no puede validarse ni crearse en BEES.', blurb: 'El POC referenciado por este pedido no está mapeado al proveedor. Sin un POC válido, las validaciones posteriores y la creación del pedido no pueden ejecutarse. Reprocese después de corregir el mapeo del POC aguas arriba.' },
    },
    PO_DUPLICATED: {
      en: { label: 'PO duplicated', actionLabel: 'Reprocess', orderCopy: 'A previous order with the same PO number was already processed for this POC — this submission was rejected as a duplicate.', blurb: 'BEES detected a previous order with the same PO number for this POC. Reprocess when the chain intentionally resubmitted the same PO.' },
      es: { label: 'PO duplicado', actionLabel: 'Reprocesar', orderCopy: 'Ya se procesó un pedido anterior con el mismo número de PO para este POC — este envío fue rechazado como duplicado.', blurb: 'BEES detectó un pedido anterior con el mismo número de PO para este POC. Reprocese cuando la cadena haya reenviado el mismo PO intencionalmente.' },
    },
    UPC_NOT_FOUND: {
      en: { label: 'UPC not found', actionLabel: 'Reprocess', orderCopy: 'Some product UPCs in this order were not found in the BEES catalog.', blurb: 'One or more lines reference a UPC that is not in the BEES catalog. Reprocess to send the order back through validation after the catalog mapping is fixed upstream.' },
      es: { label: 'UPC no encontrado', actionLabel: 'Reprocesar', orderCopy: 'Algunos UPC de producto de este pedido no se encontraron en el catálogo BEES.', blurb: 'Una o más líneas referencian un UPC que no está en el catálogo BEES. Reprocese para volver a enviar el pedido a validación después de corregir el mapeo del catálogo aguas arriba.' },
    },
    PRICE_MISMATCH: {
      en: { label: 'Price mismatch', actionLabel: 'Reprocess', orderCopy: 'The chain requested a unit price below the BEES contract price on one or more lines.', blurb: 'One or more lines have a chain-submitted price below the BEES contract/catalog price. Reprocess to send the order back through validation after pricing is fixed upstream.' },
      es: { label: 'Discrepancia de precio', actionLabel: 'Reprocesar', orderCopy: 'La cadena solicitó un precio unitario por debajo del precio de contrato BEES en una o más líneas.', blurb: 'Una o más líneas tienen un precio enviado por la cadena por debajo del precio de contrato/catálogo BEES. Reprocese para volver a enviar el pedido a validación después de corregir precios aguas arriba.' },
    },
    INVALID_PACKAGING: {
      en: { label: 'Invalid package', actionLabel: 'Reprocess', orderCopy: 'Invalid package (UoM) was detected on one or more lines.', blurb: 'One or more lines reference an invalid packaging / unit-of-measure for the product. Reprocess to re-include the order in the queue — fix the product packaging configuration upstream if you want this rule to stop firing.' },
      es: { label: 'Empaque inválido', actionLabel: 'Reprocesar', orderCopy: 'Se detectó empaque (UdM) inválido en una o más líneas.', blurb: 'Una o más líneas referencian un empaque / unidad de medida inválida para el producto. Reprocese para volver a incluir el pedido en la cola — corrija la configuración de empaque aguas arriba si desea que esta regla deje de aplicarse.' },
    },
    SKU_AVAILABILITY: {
      en: { label: 'SKU availability', actionLabel: 'Reprocess without fixes', orderCopy: 'Insufficient stock to fulfill the requested quantity on one or more lines.', blurb: 'One or more lines request more units than are currently in stock for that SKU. Reprocess to re-include the order in the queue — inventory may have changed since the order was received.' },
      es: { label: 'Disponibilidad de SKU', actionLabel: 'Reprocesar sin correcciones', orderCopy: 'Stock insuficiente para cumplir la cantidad solicitada en una o más líneas.', blurb: 'Una o más líneas solicitan más unidades de las que hay en stock para ese SKU. Reprocese para volver a incluir el pedido en la cola — el inventario puede haber cambiado desde que se recibió el pedido.' },
    },
    INVALID_DELIVERY_RANGE: {
      en: { label: 'Invalid delivery range', actionLabel: 'Reprocess', orderCopy: 'The requested delivery date falls outside the valid range for this account.', blurb: 'The requested delivery date is outside the valid range. Either reprocess as-is (no fix) or bypass the delivery-range rule for this order.' },
      es: { label: 'Rango de entrega inválido', actionLabel: 'Reprocesar', orderCopy: 'La fecha de entrega solicitada está fuera del rango válido para esta cuenta.', blurb: 'La fecha de entrega solicitada está fuera del rango válido. Reprocese tal cual (sin corrección) u omita la regla de rango de entrega para este pedido.' },
    },
    INVALID_DELIVERY_WINDOW: {
      en: { label: 'Invalid delivery window', actionLabel: 'Reprocess', orderCopy: 'The requested delivery slot is outside the valid window for this POC.', blurb: 'The requested delivery slot is outside the valid delivery window for this POC. Either reprocess as-is or bypass the delivery-window rule for this order.' },
      es: { label: 'Ventana de entrega inválida', actionLabel: 'Reprocesar', orderCopy: 'El horario de entrega solicitado está fuera de la ventana válida para este POC.', blurb: 'El horario de entrega solicitado está fuera de la ventana de entrega válida para este POC. Reprocese tal cual u omita la regla de ventana de entrega para este pedido.' },
    },
    MIN_ORDER_QUANTITY: {
      en: { label: 'Minimum order quantity', actionLabel: 'Reprocess', orderCopy: 'The order total falls below the minimum order quantity for this account.', blurb: 'The order total is below the minimum order quantity for this account. Either reprocess as-is or bypass the minimum-order-quantity rule for this order.' },
      es: { label: 'Cantidad mínima de pedido', actionLabel: 'Reprocesar', orderCopy: 'El total del pedido está por debajo de la cantidad mínima de pedido para esta cuenta.', blurb: 'El total del pedido está por debajo de la cantidad mínima para esta cuenta. Reprocese tal cual u omita la regla de cantidad mínima para este pedido.' },
    },
    MAX_ORDER_QUANTITY: {
      en: { label: 'Maximum order quantity', actionLabel: 'Reprocess', orderCopy: 'The order total exceeds the maximum order quantity allowed for this account.', blurb: 'The order total exceeds the maximum order quantity allowed for this account. Either reprocess as-is or bypass the maximum-order-quantity rule for this order.' },
      es: { label: 'Cantidad máxima de pedido', actionLabel: 'Reprocesar', orderCopy: 'El total del pedido supera la cantidad máxima permitida para esta cuenta.', blurb: 'El total del pedido supera la cantidad máxima permitida para esta cuenta. Reprocese tal cual u omita la regla de cantidad máxima para este pedido.' },
    },
  };

  const NOTE_CAT = {
    en: { 'catalog fix': 'catalog fix', 'pricing update': 'pricing update', 'POC configuration': 'POC configuration', 'delivery window': 'delivery window', packaging: 'packaging', 'retailer-side issue': 'chain-side issue', other: 'other' },
    es: { 'catalog fix': 'corrección de catálogo', 'pricing update': 'actualización de precios', 'POC configuration': 'configuración de POC', 'delivery window': 'ventana de entrega', packaging: 'empaque', 'retailer-side issue': 'incidencia de la cadena', other: 'otro' },
  };

  const EN_RULE_LABEL_TO_CODE = Object.fromEntries(
    Object.entries(RULE).map(([code, tr]) => [tr.en.label, code])
  );

  const M = {
    en: {
      'lang.en': 'English',
      'lang.es': 'Español',
      'lang.menu': 'Language',
      'page.ediTitle': 'EDI Central Tracking',
      'page.mvpBanner': 'MVP preview',
      'page.orderDetails': 'Order details',
      'filter.toggle': 'Filter',
      'filter.status': 'Status',
      'filter.rule': 'Business rule',
      'filter.poc': 'POC',
      'filter.retailer': 'Chain',
      'filter.poNumber': 'PO number',
      'filter.beesOrder': 'BEES order number',
      'filter.receiveDate': 'Receive date (max 90 days · default last 30 days)',
      'filter.expirationDate': 'Expiration date',
      'filter.apply': 'Apply filters',
      'filter.clearAll': 'Clear all',
      'filter.periodHint': 'Maximum interval: 90 days · default: last 30 days',
      'filter.periodCapped': 'Period capped at 90 days (ops scope).',
      'filter.allStatuses': 'All statuses',
      'filter.allRules': 'All rules',
      'filter.allPocs': 'All POCs',
      'filter.allRetailers': 'All chains',
      'filter.statusCount': '{count} status',
      'filter.statusesCount': '{count} statuses',
      'filter.ruleCount': '{count} rule',
      'filter.rulesCount': '{count} rules',
      'filter.pocCount': '{count} POC',
      'filter.pocsCount': '{count} POCs',
      'filter.retailerCount': '{count} chain',
      'filter.retailersCount': '{count} chains',
      'filter.poPlaceholder': 'e.g. 12345678',
      'filter.beesPlaceholder': 'e.g. BEES-1234567890',
      'filter.pocSearch': 'Search POC name, id, city…',
      'filter.pocNoMatch': 'No POC matches.',
      'filter.groupBlocked': 'Partially accepted',
      'filter.groupRejected': 'Rejected',
      'sort.label': 'Sort by',
      'sort.columnReceive': 'Receive date',
      'sort.columnExpiration': 'Expiration date',
      'sort.ascLabel': 'Sorted lowest to highest',
      'sort.descLabel': 'Sorted highest to lowest',
      'sort.defaultLabel': 'Default order (newest receive date first)',
      'sort.clickToSort': 'Click to sort',
      'summary.of': '{count} of {total}',
      'summary.filter': 'Filter',
      'summary.clear': 'Clear',
      'table.status': 'Status',
      'table.receiveDate': 'Receive date',
      'table.poc': 'POC',
      'table.rule': 'Business rule',
      'table.po': 'PO number',
      'table.bees': 'BEES order number',
      'table.expiration': 'Expiration date',
      'table.actions': 'Actions',
      'table.notAssigned': 'Not yet assigned',
      'table.selectBulk': 'Select for bulk action',
      'table.cantBulk': 'This order is not eligible for bulk actions',
      'table.takeAction': 'Reprocess order',
      'table.rejectOrder': 'Reject order',
      'table.viewSummary': 'View order summary',
      'table.ruleFilterTitle': 'Filter the list by this rule',
      'empty.title': 'No orders match your filters',
      'empty.body': 'Try widening the period or clearing some filters.',
      'empty.clear': 'Clear all filters',
      'pagination.range': '{start} - {end} of {total}',
      'pagination.linesPerPage': 'Lines per page:',
      'pagination.page': 'Page {n}',
      'pagination.first': 'First page',
      'pagination.prev': 'Previous page',
      'pagination.next': 'Next page',
      'pagination.last': 'Last page',
      'bulk.selectAll': 'Select all on this page ({count})',
      'bulk.clearSelection': 'Clear selection ({count} on this page)',
      'bulk.noEligible': 'No eligible orders on this page',
      'bulk.selectedOne': '1 selected',
      'bulk.selectedMany': '{count} selected',
      'bulk.reprocess': 'Reprocess selected',
      'bulk.reprocessCount': 'Reprocess selected ({count})',
      'bulk.accept': 'Accept selected',
      'bulk.acceptCount': 'Accept selected ({count})',
      'bulk.acceptPriceTooltip': 'Accept and reprocess selected orders with requested price',
      'bulk.hintAcceptPrice': 'Bulk accept: select partially accepted or rejected orders with price mismatch only.',
      'bulk.mustAcceptPriceMismatch': 'Accept selected works only when every selected order has a price mismatch.',
      'bulk.confirmAcceptPrice': 'You are about to accept {count} orders at the requested price. Continue?',
      'bulk.hintAccept': 'Bulk accept: select rejected orders with minimum or maximum order quantity issues.',
      'bulk.mustAcceptEligible': 'Accept selected works only on rejected orders with minimum or maximum order quantity issues.',
      'bulk.confirmAccept': 'You are about to accept {count} orders. Continue?',
      'bulk.hintDefault': 'Bulk reprocess: select any rejected or partially accepted orders — mixed business rules are allowed.',
      'bulk.notEligible': 'Only rejected or partially accepted orders can be selected for bulk reprocess.',
      'bulk.confirm': 'You are about to reprocess {count} orders. Continue?',
      'drawer.eyebrow': 'Order detail',
      'drawer.close': 'Close',
      'drawer.cancel': 'Cancel',
      'drawer.order': 'Order',
      'drawer.receiveDate': 'Receive date',
      'drawer.retailer': 'Chain',
      'drawer.poc': 'POC',
      'drawer.vendor': 'Vendor',
      'drawer.po': 'PO number',
      'drawer.bees': 'BEES order #',
      'drawer.items': 'Items',
      'drawer.totalValue': 'Total value',
      'drawer.requestedDelivery': 'Requested delivery date',
      'drawer.firstValidDelivery': 'First valid delivery date',
      'drawer.whyRejected': 'Why was this rejected?',
      'drawer.whyBlocked': 'Why does this order have alerts?',
      'drawer.noAction': 'No action available',
      'drawer.acceptedMsg': 'This order was accepted and is in the BEES OMS.',
      'drawer.queueMsg': 'This order is pending processing in the BEES pipeline.',
      'drawer.notes': 'Resolution notes ({count})',
      'drawer.noNotes': 'No resolution notes yet.',
      'drawer.category': 'Category',
      'drawer.note': 'Note',
      'drawer.notePlaceholder': 'Describe what you did or what the chain should know…',
      'drawer.saveNote': 'Save note',
      'drawer.addNote': 'Add note',
      'drawer.timeline': 'Timeline',
      'drawer.beesHistory': 'Order history (coming soon)',
      'drawer.duplicateBeesOrder': 'Existing BEES order (same PO · POC)',
      'action.corrective': 'Corrective action',
      'action.selectUpcs': 'Select correct UPCs',
      'action.choosePrice': 'Choose price',
      'action.chooseReprocess': 'Choose how to reprocess',
      'action.line': 'Line {n}',
      'action.requestedSku': 'Requested SKU: {sku}',
      'action.chooseUpc': 'Choose correct UPC…',
      'action.fixUpc': 'Fix UPC',
      'action.applyUpc': 'Apply UPC',
      'action.changeUpc': 'Change',
      'action.searchUpcLabel': 'Search catalog',
      'action.searchUpcPlaceholder': 'UPC or product name…',
      'action.upcSearchHint': 'Type at least 2 characters to search the BEES catalog.',
      'action.upcNoResults': 'No products match your search.',
      'action.upcSearchCount': '{count} matches — click to select',
      'action.upcSelected': 'Selected product',
      'action.selectUpcsOnLines': 'Choose the correct UPC on each affected product line below, then confirm reprocessing.',
      'action.retailerRequested': 'Chain requested {price} · BEES contract {contract}',
      'action.useBeesPrice': 'Use BEES contract price',
      'action.useRetailerPrice': 'Accept chain\'s requested price',
      'action.reprocessAsIs': 'Reprocess without fixes (re-include as-is)',
      'action.bypassReprocess': 'Accept order and reprocess',
      'action.pickUpc': 'Pick a UPC for every affected line before reprocessing.',
      'action.approveLine': 'Approve line',
      'action.rejectLine': 'Reject line',
      'action.acceptRequestedPrice': 'Accept requested price',
      'action.acceptPriceList': 'Accept price list price',
      'action.reprocessPriceList': 'Reprocess with price list',
      'action.approveLineHint': 'Accept this line with the current resolution.',
      'action.rejectLineHint': 'Reject this line from the order.',
      'action.acceptRequestedPriceHint': 'Accept this line at the price requested on the order.',
      'action.acceptPriceListHint': 'Reject the requested price and accept this line at the price from the price list.',
      'action.reprocessPriceListHint': 'Reject the requested price and accept this line at the price from the price list.',
      'action.rejectOrder': 'Reject order',
      'action.priceRequested': 'Requested price',
      'action.priceContract': 'BEES contract price',
      'action.priceDifference': 'Difference',
      'action.deliveryRequested': 'Requested delivery',
      'action.deliveryFirstValid': 'First valid delivery',
      'action.reprocessAfterDeliveryBlocked': 'Reprocess is not available after the requested delivery date ({date}).',
      'action.deliveryWindowInvalid': 'The requested slot is outside the valid window for this POC.',
      'modal.rejectOrderTitle': 'Reject this order?',
      'modal.rejectOrderBody': 'All lines still under review will be rejected. Lines already accepted will not be reversed in this prototype.',
      'modal.rejectOrderNoteBody': 'Add a resolution note to confirm rejecting this order.',
      'modal.acceptOrderTitle': 'Accept this order?',
      'modal.acceptOrderNoteBody': 'Add a resolution note to confirm accepting this order.',
      'modal.acceptOrdersTitle': 'Accept {count} orders?',
      'modal.acceptOrdersNoteBody': 'Add a resolution note to confirm accepting these orders.',
      'modal.noteRequired': 'A resolution note is required.',
      'modal.confirmAccept': 'Confirm accept',
      'modal.addNoteTitle': 'Add resolution note',
      'modal.addNoteBody': 'Describe what you did or what the chain should know.',
      'modal.confirmSaveNote': 'Save note',
      'modal.rejectLineTitle': 'Reject this line?',
      'modal.rejectLineBody': 'This product line will not be processed.',
      'modal.confirmReject': 'Confirm reject',
      'modal.reprocessOrder': 'Reprocess order',
      'modal.bypassReprocess': 'Accept and reprocess',
      'modal.reprocessResolvedUpcsTitle': 'Reprocess resolved UPCs?',
      'modal.reprocessResolvedUpcsBody': 'This order will be reprocessed with the UPCs you resolved on each affected line.',
      'modal.confirmReprocessResolvedUpcs': 'Confirm reprocess',
      'modal.reprocessInvalidPackageBody': 'This order will be reprocessed and sent back through validation.',
      'modal.confirmReprocess': 'Confirm reprocess',
      'modal.chooseUpc': 'Choose correct UPC',
      'details.addNote': 'Add resolution note',
      'details.timeline': 'Order timeline',
      'details.timelineOne': '({count} entry)',
      'details.timelineMany': '({count} entries)',
      'details.notFound': 'Order not found.',
      'details.back': 'Back to all orders',
      'details.beesOrder': 'BEES order number',
      'details.duplicateBeesOrder': 'Existing BEES order (same PO · POC)',
      'details.po': 'PO number',
      'details.receiveDate': 'Receive date',
      'details.retailer': 'Chain',
      'details.vendor': 'Vendor',
      'details.items': 'Items',
      'details.totalValue': 'Total value',
      'details.requestedDelivery': 'Requested delivery date',
      'details.firstValidDelivery': 'First valid delivery date',
      'details.orderQtySummary': 'Order quantity',
      'details.orderQtyDetail': '{lines} lines · {qty} units total',
      'details.minOrderQty': 'Minimum quantity',
      'details.maxOrderQty': 'Maximum quantity',
      'details.lineProgress': 'Line progress',
      'details.lineProgressDetail': '{released} accepted · {rejected} rejected',
      'details.rejectOrder': 'Reject order',
      'details.acceptOrder': 'Accept order',
      'details.products': 'Products in this order',
      'details.itemOne': '{count} item',
      'details.itemMany': '{count} items',
      'details.line': 'Line {n}',
      'details.reqQty': 'Requested Qty',
      'details.availQty': 'Available Qty',
      'details.reqPrice': 'Requested Unit Price',
      'details.reqTotal': 'Requested Line Total',
      'details.requested': 'Requested {value}',
      'details.priceList': 'Price list {value}',
      'timeline.none': 'No activity recorded yet.',
      'timeline.resolutionNote': 'Resolution note',
      'audit.orderReceived': 'Order received via EDI',
      'audit.orderAccepted': 'Order accepted into BEES OMS',
      'audit.orderAcceptedOps': 'Order accepted by ops user',
      'audit.reprocessRequested': 'Reprocess requested — {detail}',
      'audit.outcome': 'Outcome: {status}',
      'audit.noteAdded': 'Resolution note added ({category})',
      'actor.system': 'system',
      'actor.bre': 'BRE',
      'actor.ops': 'Ops user',
      'audit.detail.reprocessNoFix': '{code}: reprocess without fixes',
      'audit.detail.bypass': '{code}: accepted and reprocessed',
      'audit.detail.upc': '{code}: selected new UPCs for {count} line(s)',
      'audit.detail.priceBees': '{code}: applied BEES contract price, price validation bypassed',
      'audit.detail.priceRetailer': '{code}: applied chain\'s requested price, price validation bypassed',
      'audit.detail.rejectedBypass': '{code}: bypassed rule and reprocessed',
      'audit.detail.rejectedAsIs': '{code}: reprocessed without fixes',
      'audit.lineApproved': 'Line {n} approved — accepted',
      'audit.lineAcceptedRequestedPrice': 'Line {n} accepted at requested price',
      'audit.orderAcceptedRequestedPrice': 'Accepted {count} line(s) at requested price',
      'audit.lineAcceptedPriceList': 'Line {n} accepted at price list price',
      'audit.lineRejected': 'Line {n} rejected',
      'audit.orderRejected': 'Order rejected by ops user',
    },
    es: {
      'lang.en': 'English',
      'lang.es': 'Español',
      'lang.menu': 'Idioma',
      'page.ediTitle': 'Seguimiento central EDI',
      'page.mvpBanner': 'Vista previa MVP',
      'page.orderDetails': 'Detalle del pedido',
      'filter.toggle': 'Filtrar',
      'filter.status': 'Estado',
      'filter.rule': 'Regla de negocio',
      'filter.poc': 'POC',
      'filter.retailer': 'Cadena',
      'filter.poNumber': 'Número de PO',
      'filter.beesOrder': 'Número de pedido BEES',
      'filter.receiveDate': 'Fecha de recepción (máx. 90 días · predeterminado últimos 30 días)',
      'filter.expirationDate': 'Fecha de vencimiento',
      'filter.apply': 'Aplicar filtros',
      'filter.clearAll': 'Borrar todo',
      'filter.periodHint': 'Intervalo máximo: 90 días · predeterminado: últimos 30 días',
      'filter.periodCapped': 'Período limitado a 90 días (alcance operaciones).',
      'filter.allStatuses': 'Todos los estados',
      'filter.allRules': 'Todas las reglas',
      'filter.allPocs': 'Todos los POC',
      'filter.allRetailers': 'Todas las cadenas',
      'filter.statusCount': '{count} estado',
      'filter.statusesCount': '{count} estados',
      'filter.ruleCount': '{count} regla',
      'filter.rulesCount': '{count} reglas',
      'filter.pocCount': '{count} POC',
      'filter.pocsCount': '{count} POC',
      'filter.retailerCount': '{count} cadena',
      'filter.retailersCount': '{count} cadenas',
      'filter.poPlaceholder': 'ej. 12345678',
      'filter.beesPlaceholder': 'ej. BEES-1234567890',
      'filter.pocSearch': 'Buscar nombre, id o ciudad del POC…',
      'filter.pocNoMatch': 'Ningún POC coincide.',
      'filter.groupBlocked': 'Parcialmente aceptado',
      'filter.groupRejected': 'Rechazado',
      'sort.label': 'Ordenar por',
      'sort.columnReceive': 'Fecha de recepción',
      'sort.columnExpiration': 'Fecha de vencimiento',
      'sort.ascLabel': 'Ordenado de menor a mayor',
      'sort.descLabel': 'Ordenado de mayor a menor',
      'sort.defaultLabel': 'Orden predeterminado (recepción más reciente primero)',
      'sort.clickToSort': 'Clic para ordenar',
      'summary.of': '{count} de {total}',
      'summary.filter': 'Filtrar',
      'summary.clear': 'Borrar',
      'table.status': 'Estado',
      'table.receiveDate': 'Fecha de recepción',
      'table.poc': 'POC',
      'table.rule': 'Regla de negocio',
      'table.po': 'Número de PO',
      'table.bees': 'Número de pedido BEES',
      'table.expiration': 'Fecha de vencimiento',
      'table.actions': 'Acciones',
      'table.notAssigned': 'Aún no asignado',
      'table.selectBulk': 'Seleccionar para acción masiva',
      'table.cantBulk': 'Este pedido no es elegible para acciones masivas',
      'table.takeAction': 'Reprocesar pedido',
      'table.rejectOrder': 'Rechazar pedido',
      'table.viewSummary': 'Ver resumen del pedido',
      'table.ruleFilterTitle': 'Filtrar la lista por esta regla',
      'empty.title': 'Ningún pedido coincide con sus filtros',
      'empty.body': 'Intente ampliar el período o borrar algunos filtros.',
      'empty.clear': 'Borrar todos los filtros',
      'pagination.range': '{start} - {end} de {total}',
      'pagination.linesPerPage': 'Líneas por página:',
      'pagination.page': 'Página {n}',
      'pagination.first': 'Primera página',
      'pagination.prev': 'Página anterior',
      'pagination.next': 'Página siguiente',
      'pagination.last': 'Última página',
      'bulk.selectAll': 'Seleccionar todo en esta página ({count})',
      'bulk.clearSelection': 'Limpiar selección ({count} en esta página)',
      'bulk.noEligible': 'No hay pedidos elegibles en esta página',
      'bulk.selectedOne': '1 seleccionado',
      'bulk.selectedMany': '{count} seleccionados',
      'bulk.reprocess': 'Reprocesar seleccionados',
      'bulk.reprocessCount': 'Reprocesar seleccionados ({count})',
      'bulk.accept': 'Aceptar seleccionados',
      'bulk.acceptCount': 'Aceptar seleccionados ({count})',
      'bulk.acceptPriceTooltip': 'Aceptar y reprocesar pedidos seleccionados con precio solicitado',
      'bulk.hintAcceptPrice': 'Aceptación masiva: seleccione solo pedidos parcialmente aceptados o rechazados con discrepancia de precio.',
      'bulk.mustAcceptPriceMismatch': 'Aceptar seleccionados solo funciona cuando todos los pedidos seleccionados tienen discrepancia de precio.',
      'bulk.confirmAcceptPrice': 'Está a punto de aceptar {count} pedidos al precio solicitado. ¿Continuar?',
      'bulk.hintAccept': 'Aceptación masiva: seleccione pedidos rechazados con cantidad mínima o máxima de pedido.',
      'bulk.mustAcceptEligible': 'Aceptar seleccionados solo funciona en pedidos rechazados con cantidad mínima o máxima de pedido.',
      'bulk.confirmAccept': 'Está a punto de aceptar {count} pedidos. ¿Continuar?',
      'bulk.hintDefault': 'Reproceso masivo: seleccione pedidos rechazados o parcialmente aceptados — se permiten reglas de negocio distintas.',
      'bulk.notEligible': 'Solo los pedidos rechazados o parcialmente aceptados pueden seleccionarse para reproceso masivo.',
      'bulk.confirm': 'Está a punto de reprocesar {count} pedidos. ¿Continuar?',
      'drawer.eyebrow': 'Detalle del pedido',
      'drawer.close': 'Cerrar',
      'drawer.cancel': 'Cancelar',
      'drawer.order': 'Pedido',
      'drawer.receiveDate': 'Fecha de recepción',
      'drawer.retailer': 'Cadena',
      'drawer.poc': 'POC',
      'drawer.vendor': 'Proveedor',
      'drawer.po': 'Número de PO',
      'drawer.bees': 'Nº pedido BEES',
      'drawer.items': 'Ítems',
      'drawer.totalValue': 'Valor total',
      'drawer.requestedDelivery': 'Fecha de entrega solicitada',
      'drawer.firstValidDelivery': 'Primera fecha de entrega válida',
      'drawer.whyRejected': '¿Por qué fue rechazado?',
      'drawer.whyBlocked': '¿Por qué este pedido tiene alertas?',
      'drawer.noAction': 'No hay acción disponible',
      'drawer.acceptedMsg': 'Este pedido fue aceptado y está en BEES OMS.',
      'drawer.queueMsg': 'Este pedido está pendiente de procesamiento en el pipeline de BEES.',
      'drawer.notes': 'Notas de resolución ({count})',
      'drawer.noNotes': 'Aún no hay notas de resolución.',
      'drawer.category': 'Categoría',
      'drawer.note': 'Nota',
      'drawer.notePlaceholder': 'Describa lo que hizo o lo que la cadena debe saber…',
      'drawer.saveNote': 'Guardar nota',
      'drawer.addNote': 'Agregar nota',
      'drawer.timeline': 'Línea de tiempo',
      'drawer.beesHistory': 'Historial del pedido (próximamente)',
      'drawer.duplicateBeesOrder': 'Pedido BEES existente (mismo PO · POC)',
      'action.corrective': 'Acción correctiva',
      'action.selectUpcs': 'Seleccionar UPCs correctos',
      'action.choosePrice': 'Elegir precio',
      'action.chooseReprocess': 'Elegir cómo reprocesar',
      'action.line': 'Línea {n}',
      'action.requestedSku': 'SKU solicitado: {sku}',
      'action.chooseUpc': 'Elegir UPC correcto…',
      'action.fixUpc': 'Corregir UPC',
      'action.applyUpc': 'Aplicar UPC',
      'action.changeUpc': 'Cambiar',
      'action.searchUpcLabel': 'Buscar en catálogo',
      'action.searchUpcPlaceholder': 'UPC o nombre del producto…',
      'action.upcSearchHint': 'Escriba al menos 2 caracteres para buscar en el catálogo BEES.',
      'action.upcNoResults': 'Ningún producto coincide con su búsqueda.',
      'action.upcSearchCount': '{count} coincidencias — haga clic para seleccionar',
      'action.upcSelected': 'Producto seleccionado',
      'action.selectUpcsOnLines': 'Elija el UPC correcto en cada línea de producto afectada abajo y luego confirme el reproceso.',
      'action.retailerRequested': 'Cadena solicitó {price} · contrato BEES {contract}',
      'action.useBeesPrice': 'Usar precio de contrato BEES',
      'action.useRetailerPrice': 'Aceptar precio solicitado por la cadena',
      'action.reprocessAsIs': 'Reprocesar sin correcciones (reincluir tal cual)',
      'action.bypassReprocess': 'Aceptar pedido y reprocesar',
      'action.pickUpc': 'Elija un UPC para cada línea afectada antes de reprocesar.',
      'action.approveLine': 'Aprobar línea',
      'action.rejectLine': 'Rechazar línea',
      'action.acceptRequestedPrice': 'Aceptar precio solicitado',
      'action.reprocessPriceList': 'Reprocesar con lista de precios',
      'action.rejectOrder': 'Rechazar pedido',
      'action.approveLineHint': 'Aceptar esta línea con la resolución actual.',
      'action.rejectLineHint': 'Rechazar esta línea del pedido.',
      'action.acceptRequestedPriceHint': 'Aceptar esta línea al precio solicitado en el pedido.',
      'action.reprocessPriceListHint': 'Rechazar el precio solicitado y aceptar esta línea al precio de la lista de precios.',
      'action.priceRequested': 'Precio solicitado',
      'action.priceContract': 'Precio de contrato BEES',
      'action.priceDifference': 'Diferencia',
      'action.deliveryRequested': 'Entrega solicitada',
      'action.deliveryFirstValid': 'Primera entrega válida',
      'action.reprocessAfterDeliveryBlocked': 'El reproceso no está disponible después de la fecha de entrega solicitada ({date}).',
      'action.deliveryWindowInvalid': 'El horario solicitado está fuera de la ventana válida para este POC.',
      'modal.rejectOrderTitle': '¿Rechazar este pedido?',
      'modal.rejectOrderBody': 'Todas las líneas aún en revisión serán rechazadas. Las líneas ya aceptadas no se revertirán en este prototipo.',
      'modal.rejectOrderNoteBody': 'Agregue una nota de resolución para confirmar el rechazo de este pedido.',
      'modal.acceptOrderTitle': '¿Aceptar este pedido?',
      'modal.acceptOrderNoteBody': 'Agregue una nota de resolución para confirmar la aceptación de este pedido.',
      'modal.acceptOrdersTitle': '¿Aceptar {count} pedidos?',
      'modal.acceptOrdersNoteBody': 'Agregue una nota de resolución para confirmar la aceptación de estos pedidos.',
      'modal.noteRequired': 'Se requiere una nota de resolución.',
      'modal.confirmAccept': 'Confirmar aceptación',
      'modal.addNoteTitle': 'Agregar nota de resolución',
      'modal.addNoteBody': 'Describa lo que hizo o lo que la cadena debe saber.',
      'modal.confirmSaveNote': 'Guardar nota',
      'modal.rejectLineTitle': '¿Rechazar esta línea?',
      'modal.rejectLineBody': 'Esta línea de producto no se procesará.',
      'modal.confirmReject': 'Confirmar rechazo',
      'modal.reprocessOrder': 'Reprocesar pedido',
      'modal.bypassReprocess': 'Aceptar y reprocesar',
      'modal.reprocessResolvedUpcsTitle': '¿Reprocesar UPCs resueltos?',
      'modal.reprocessResolvedUpcsBody': 'Este pedido se reprocesará con los UPC que resolvió en cada línea afectada.',
      'modal.confirmReprocessResolvedUpcs': 'Confirmar reproceso',
      'modal.reprocessInvalidPackageBody': 'Este pedido se reprocesará y volverá a pasar por la validación.',
      'modal.confirmReprocess': 'Confirmar reproceso',
      'modal.chooseUpc': 'Elegir UPC correcto',
      'details.addNote': 'Agregar nota de resolución',
      'details.timeline': 'Línea de tiempo del pedido',
      'details.timelineOne': '({count} registro)',
      'details.timelineMany': '({count} registros)',
      'details.notFound': 'Pedido no encontrado.',
      'details.back': 'Volver a todos los pedidos',
      'details.beesOrder': 'Número de pedido BEES',
      'details.duplicateBeesOrder': 'Pedido BEES existente (mismo PO · POC)',
      'details.po': 'Número de PO',
      'details.receiveDate': 'Fecha de recepción',
      'details.retailer': 'Cadena',
      'details.vendor': 'Proveedor',
      'details.items': 'Ítems',
      'details.totalValue': 'Valor total',
      'details.requestedDelivery': 'Fecha de entrega solicitada',
      'details.firstValidDelivery': 'Primera fecha de entrega válida',
      'details.orderQtySummary': 'Cantidad del pedido',
      'details.orderQtyDetail': '{lines} líneas · {qty} unidades en total',
      'details.minOrderQty': 'Cantidad mínima',
      'details.maxOrderQty': 'Cantidad máxima',
      'details.lineProgress': 'Progreso de líneas',
      'details.lineProgressDetail': '{released} aceptadas · {rejected} rechazadas',
      'details.rejectOrder': 'Rechazar pedido',
      'details.acceptOrder': 'Aceptar pedido',
      'details.products': 'Productos en este pedido',
      'details.itemOne': '{count} ítem',
      'details.itemMany': '{count} ítems',
      'details.line': 'Línea {n}',
      'details.reqQty': 'Cant. solicitada',
      'details.availQty': 'Cant. disponible',
      'details.reqPrice': 'Precio unitario solicitado',
      'details.reqTotal': 'Total de línea solicitado',
      'details.requested': 'Solicitado {value}',
      'details.priceList': 'Lista de precios {value}',
      'timeline.none': 'Aún no hay actividad registrada.',
      'timeline.resolutionNote': 'Nota de resolución',
      'audit.orderReceived': 'Pedido recibido vía EDI',
      'audit.orderAccepted': 'Pedido aceptado en BEES OMS',
      'audit.orderAcceptedOps': 'Pedido aceptado por usuario de operaciones',
      'audit.reprocessRequested': 'Reproceso solicitado — {detail}',
      'audit.outcome': 'Resultado: {status}',
      'audit.noteAdded': 'Nota de resolución agregada ({category})',
      'actor.system': 'sistema',
      'actor.bre': 'BRE',
      'actor.ops': 'Usuario de operaciones',
      'audit.detail.reprocessNoFix': '{code}: reprocesar sin correcciones',
      'audit.detail.bypass': '{code}: aceptado y reprocesado',
      'audit.detail.upc': '{code}: UPC nuevos seleccionados para {count} línea(s)',
      'audit.detail.priceBees': '{code}: precio de contrato BEES aplicado, validación de precio omitida',
      'audit.detail.priceRetailer': '{code}: precio solicitado por la cadena aplicado, validación de precio omitida',
      'audit.detail.rejectedBypass': '{code}: regla omitida y reprocesado',
      'audit.detail.rejectedAsIs': '{code}: reprocesado sin correcciones',
      'audit.lineApproved': 'Línea {n} aprobada — aceptada',
      'audit.lineAcceptedRequestedPrice': 'Línea {n} aceptada al precio solicitado',
      'audit.orderAcceptedRequestedPrice': 'Se aceptaron {count} línea(s) al precio solicitado',
      'audit.lineAcceptedPriceList': 'Línea {n} aceptada al precio de lista',
      'audit.lineRejected': 'Línea {n} rechazada',
      'audit.orderRejected': 'Pedido rechazado por usuario de operaciones',
    },
  };

  const MODAL_TITLE = {
    en: { 'reprocess-no-fix': 'modal.reprocessOrder', 'bypass-only': 'modal.bypassReprocess', 'upc-selector': 'modal.reprocessResolvedUpcsTitle', 'price-choice': 'action.choosePrice', 'rejected-choice': 'action.chooseReprocess' },
    es: { 'reprocess-no-fix': 'modal.reprocessOrder', 'bypass-only': 'modal.bypassReprocess', 'upc-selector': 'modal.reprocessResolvedUpcsTitle', 'price-choice': 'action.choosePrice', 'rejected-choice': 'action.chooseReprocess' },
  };

  function t(key, vars) {
    let str = (M[lang] && M[lang][key]) || (M.en[key]) || key;
    if (vars) {
      Object.keys(vars).forEach((k) => {
        str = str.replace(new RegExp('\\{' + k + '\\}', 'g'), String(vars[k]));
      });
    }
    return str;
  }

  function ruleField(code, field) {
    return (RULE[code] && RULE[code][lang] && RULE[code][lang][field])
      || (RULE[code] && RULE[code].en[field])
      || '';
  }

  function statusLabel(id) { return STATUS[lang][id] || STATUS.en[id] || id; }
  function lineStatusLabel(id) {
    if (id === 'BLOCKED') id = 'ALERT';
    return LINE_STATUS[lang][id] || LINE_STATUS.en[id] || id;
  }
  function ruleLabel(code) { return ruleField(code, 'label'); }
  function ruleActionLabel(code) { return ruleField(code, 'actionLabel'); }
  function ruleBlurb(code) { return ruleField(code, 'blurb'); }
  function ruleOrderCopy(code) { return ruleField(code, 'orderCopy'); }
  function noteCategoryLabel(slug) { return (NOTE_CAT[lang] && NOTE_CAT[lang][slug]) || slug; }
  function modalTitleForAction(action) { const k = MODAL_TITLE[lang][action]; return k ? t(k) : ''; }
  function locale() { return lang === 'es' ? 'es-AR' : 'en'; }

  function translateActor(actor) {
    if (actor === 'system') return t('actor.system');
    if (actor === 'BRE') return t('actor.bre');
    if (actor === 'Ops user') return t('actor.ops');
    return actor;
  }

  function translateActionDetail(detail) {
    const m1 = detail.match(/^([A-Z_]+): reprocess without fixes$/);
    if (m1) return t('audit.detail.reprocessNoFix', { code: m1[1] });
    const m2 = detail.match(/^([A-Z_]+): (?:bypassed rule|accepted and reprocessed)$/);
    if (m2) return t('audit.detail.bypass', { code: m2[1] });
    const m3 = detail.match(/^([A-Z_]+): selected new UPCs for (\d+) line\(s\)$/);
    if (m3) return t('audit.detail.upc', { code: m3[1], count: m3[2] });
    const m4 = detail.match(/^([A-Z_]+): applied BEES contract price, price validation bypassed$/);
    if (m4) return t('audit.detail.priceBees', { code: m4[1] });
    const m5 = detail.match(/^([A-Z_]+): applied (?:retailer's|chain's) requested price, price validation bypassed$/);
    if (m5) return t('audit.detail.priceRetailer', { code: m5[1] });
    const m6 = detail.match(/^([A-Z_]+): bypassed rule and reprocessed$/);
    if (m6) return t('audit.detail.rejectedBypass', { code: m6[1] });
    const m7 = detail.match(/^([A-Z_]+): reprocessed without fixes$/);
    if (m7) return t('audit.detail.rejectedAsIs', { code: m7[1] });
    return detail;
  }

  function translateAuditEvent(event) {
    if (event === 'Order received via EDI') return t('audit.orderReceived');
    if (event === 'Order accepted into BEES OMS') return t('audit.orderAccepted');
    const orderAcceptedOps = event.match(/^Order accepted by ops user$/);
    if (orderAcceptedOps) return t('audit.orderAcceptedOps');
    const orderAcceptedOpsEs = event.match(/^Pedido aceptado por usuario de operaciones$/);
    if (orderAcceptedOpsEs) return t('audit.orderAcceptedOps');
    const bre = event.match(/^(Blocked|Rejected|Accepted|In queue): (.+)$/);
    if (bre) {
      const statusMap = { Blocked: 'BLOCKED', Rejected: 'REJECTED', Accepted: 'ACCEPTED', 'In queue': 'IN_QUEUE' };
      const code = EN_RULE_LABEL_TO_CODE[bre[2]];
      if (code) return statusLabel(statusMap[bre[1]]) + ': ' + ruleLabel(code);
      return statusLabel(statusMap[bre[1]] || bre[1]) + ': ' + bre[2];
    }
    if (event.startsWith('Reprocess requested — ')) {
      return t('audit.reprocessRequested', { detail: translateActionDetail(event.slice('Reprocess requested — '.length)) });
    }
    if (event.startsWith('Outcome: ')) {
      const raw = event.slice('Outcome: '.length);
      const statusMap = { Accepted: 'ACCEPTED', Blocked: 'BLOCKED', Rejected: 'REJECTED', 'In queue': 'IN_QUEUE' };
      return t('audit.outcome', { status: statusLabel(statusMap[raw] || raw) });
    }
    const noteMatch = event.match(/^Resolution note added \((.+)\)$/);
    if (noteMatch) return t('audit.noteAdded', { category: noteCategoryLabel(noteMatch[1]) });
    const lineApproved = event.match(/^Line (\d+) approved — released to SAP$/);
    if (lineApproved) return t('audit.lineApproved', { n: lineApproved[1] });
    const lineApprovedEs = event.match(/^Línea (\d+) aprobada — enviada a SAP$/);
    if (lineApprovedEs) return t('audit.lineApproved', { n: lineApprovedEs[1] });
    return event;
  }

  function applyStaticLabels() {
    document.documentElement.lang = lang === 'es' ? 'es' : 'en';
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      el.textContent = t(el.getAttribute('data-i18n'));
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      el.placeholder = t(el.getAttribute('data-i18n-placeholder'));
    });
    document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
      el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria')));
    });
    document.querySelectorAll('.lang-switcher-option').forEach((btn) => {
      btn.classList.toggle('is-active', btn.getAttribute('data-lang') === lang);
    });
    const hint = document.getElementById('periodHint');
    if (hint && !hint.dataset.flash) hint.textContent = t('filter.periodHint');
    const langBtn = document.getElementById('langToggle');
    if (langBtn) langBtn.setAttribute('aria-label', t('lang.menu'));
  }

  function setLang(next) {
    if (next !== 'en' && next !== 'es') return;
    lang = next;
    localStorage.setItem(STORAGE_KEY, lang);
    applyStaticLabels();
    if (typeof window.onLanguageChanged === 'function') window.onLanguageChanged();
  }

  function getLang() { return lang; }

  return {
    t, setLang, getLang, locale, applyStaticLabels,
    statusLabel, lineStatusLabel, ruleLabel, ruleActionLabel, ruleBlurb, ruleOrderCopy,
    noteCategoryLabel, modalTitleForAction, translateAuditEvent, translateActor,
    NOTE_CATEGORY_KEYS: Object.keys(NOTE_CAT.en),
  };
})();
