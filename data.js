/**
 * Mock EDI orders for the ops-team central tracker prototype.
 *
 * Aligned to HLR BEESEDI-51860 — EDI Central Tracking — Operational Tool for
 * Vendor Operations Teams (Confluence page 6218907975).
 *
 * Order status taxonomy (4 only):
 *   ACCEPTED  — fully accepted (clean lines accepted)
 *   BLOCKED   — partially accepted: valid lines accepted; some lines need review
 *   REJECTED  — order will not be processed unless bypassed/reprocessed
 *   IN_QUEUE  — pending processing in the pipeline
 *
 * Business rules (9 only) and rule-specific corrective actions per the HLR.
 */
window.EDI_DATA = (function () {

  // ----------------------------------------------------------------
  // Retailer chains — ops users see orders across many chains.
  // ----------------------------------------------------------------
  const CHAINS = [
    { code: 'OXXO',    name: 'Oxxo' },
    { code: 'WALMART', name: 'Walmart' },
    { code: 'EXTRA',   name: 'Extra' },
    { code: 'KIOSKO',  name: 'Kiosko' },
  ];

  // Vendors managed by this ops team (single tenant in this prototype).
  const VENDORS = [
    { code: 'AMBEV',   name: 'Ambev' },
    { code: 'GRUPO_M', name: 'Grupo Modelo' },
    { code: 'AB_BRWY', name: 'AB Brewery' },
    { code: 'AB_INBV', name: 'AB InBev US' },
  ];

  // Sales reps assigned per retailer chain (mock data only — drives the
  // Sales rep filter dimension required by HLR FR-2).
  const SALES_REPS = [
    { id: 'rep-001', name: 'María González',   chains: ['OXXO', 'EXTRA'] },
    { id: 'rep-002', name: 'Carlos Rodríguez', chains: ['WALMART', 'KIOSKO'] },
    { id: 'rep-003', name: 'Ana Martínez',     chains: ['OXXO', 'WALMART'] },
    { id: 'rep-004', name: 'Juan Hernández',   chains: ['EXTRA', 'KIOSKO'] },
  ];

  // Region/zone the POC sits in — used by the Region filter dimension.
  const REGIONS = [
    { code: 'NORTE',   name: 'Norte' },
    { code: 'CENTRO',  name: 'Centro' },
    { code: 'BAJIO',   name: 'Bajío' },
    { code: 'SURESTE', name: 'Sureste' },
    { code: 'PACIF',   name: 'Pacífico' },
  ];

  // POCs across the four retailer chains and five regions (e.g. Oxxo Monterrey).
  const POCS = (function () {
    const cities = {
      NORTE:   ['Monterrey', 'Saltillo', 'Torreón', 'Chihuahua'],
      CENTRO:  ['Mexico City', 'Toluca', 'Puebla', 'Querétaro'],
      BAJIO:   ['Guadalajara', 'León', 'Aguascalientes'],
      SURESTE: ['Mérida', 'Cancún', 'Villahermosa'],
      PACIF:   ['Tijuana', 'Hermosillo', 'Mazatlán'],
    };
    const out = [];
    let n = 1000;
    CHAINS.forEach((c) => {
      const regions = ['NORTE', 'CENTRO', 'BAJIO', 'SURESTE', 'PACIF'];
      regions.forEach((r) => {
        cities[r].slice(0, 2).forEach((city) => {
          n += 1;
          out.push({
            id: 'POC-' + n,
            name: c.name + ' ' + city,
            chainCode: c.code,
            city,
            region: r,
          });
        });
      });
    });
    return out;
  })();

  // ----------------------------------------------------------------
  // Order status taxonomy — exactly 4 statuses per HLR.
  // weight = how many mock orders to generate per status (must sum > 0)
  // ----------------------------------------------------------------
  const STATUSES = [
    { id: 'ACCEPTED', label: 'Accepted', tone: 'success', weight: 45 },
    { id: 'BLOCKED',  label: 'Partially accepted', tone: 'warning', weight: 22 },
    { id: 'REJECTED', label: 'Rejected', tone: 'error',   weight: 18 },
    { id: 'IN_QUEUE', label: 'Pending', tone: 'info', weight: 15 },
  ];

  // ----------------------------------------------------------------
  // Business rules per the HLR. Each rule maps to a corrective action
  // pattern that the drawer will render. Bulk reprocess is permitted for
  // BLOCKED line-scope orders sharing the same rule, and for REJECTED
  // order-scope rules flagged bulkAllowed (e.g. POC not found, delivery window).
  //
  // action patterns:
  //   'reprocess-no-fix' — single primary button, no extra config
  //   'bypass-only'      — single primary button labeled "Bypass rule"
  //   'upc-selector'     — analyst picks the correct UPC per affected line
  //   'price-choice'     — analyst picks Retailer price OR BEES price
  //   'rejected-choice'  — analyst picks (1) reprocess as-is OR (2) bypass rule
  //
  // scope:
  //   'order' — rule applies to the whole order
  //   'line'  — rule applies to specific lines (drawer shows the lines)
  // ----------------------------------------------------------------
  const RULES = [
    // ---------- Blocked rules (partially accepted) ----------
    {
      code: 'UPC_NOT_FOUND',
      label: 'UPC not found',
      status: 'BLOCKED',
      scope: 'line',
      action: 'reprocess-no-fix',
      actionLabel: 'Reprocess',
      blurb: 'One or more lines reference a UPC that is not in the BEES catalog. Reprocess to send the order back through validation after the catalog mapping is fixed upstream.',
      orderCopy: 'Some product UPCs in this order were not found in the BEES catalog.',
      bulkAllowed: true,
    },
    {
      code: 'PRICE_MISMATCH',
      label: 'Price mismatch',
      status: 'BLOCKED',
      scope: 'line',
      action: 'reprocess-no-fix',
      actionLabel: 'Reprocess',
      blurb: 'One or more lines have a chain-submitted price below the BEES contract/catalog price. Reprocess to send the order back through validation after pricing is fixed upstream.',
      orderCopy: 'The chain requested a unit price below the BEES contract price on one or more lines.',
      bulkAllowed: true,
    },
    {
      code: 'INVALID_PACKAGING',
      label: 'Invalid package',
      status: 'BLOCKED',
      scope: 'line',
      action: 'reprocess-no-fix',
      actionLabel: 'Reprocess',
      blurb: 'One or more lines reference an invalid packaging / unit-of-measure for the product. Reprocess to re-include the order in the queue — fix the product packaging configuration upstream if you want this rule to stop firing.',
      orderCopy: 'Invalid package (UoM) was detected on one or more lines.',
      bulkAllowed: true,
    },
    {
      code: 'SKU_AVAILABILITY',
      label: 'SKU availability',
      status: 'BLOCKED',
      scope: 'line',
      action: 'reprocess-no-fix',
      actionLabel: 'Reprocess without fixes',
      blurb: 'One or more lines request more units than are currently in stock for that SKU. Reprocess to re-include the order in the queue — inventory may have changed since the order was received.',
      orderCopy: 'Insufficient stock to fulfill the requested quantity on one or more lines.',
      bulkAllowed: true,
    },
    // ---------- Rejected rules (order-level unless noted) ----------
    {
      code: 'POC_NOT_FOUND',
      label: 'POC not found',
      status: 'REJECTED',
      scope: 'order',
      action: 'reprocess-no-fix',
      actionLabel: 'Reprocess',
      blurb: 'The POC referenced by this order is not mapped to the vendor. Without a valid POC, downstream validations and order creation cannot run. Reprocess after the POC mapping is fixed upstream.',
      orderCopy: 'The POC referenced in this order is not mapped to your vendor — the order cannot be validated or created in BEES.',
      bulkAllowed: true,
    },
    {
      code: 'PO_DUPLICATED',
      label: 'PO duplicated',
      status: 'REJECTED',
      scope: 'order',
      action: 'reprocess-no-fix',
      actionLabel: 'Reprocess',
      blurb: 'BEES detected a previous order with the same PO number for this POC. Reprocess when the chain intentionally resubmitted the same PO.',
      orderCopy: 'A previous order with the same PO number was already processed for this POC — this submission was rejected as a duplicate.',
      bulkAllowed: true,
    },
    {
      code: 'INVALID_DELIVERY_RANGE',
      label: 'Invalid delivery range',
      status: 'REJECTED',
      scope: 'order',
      action: 'reprocess-no-fix',
      actionLabel: 'Reprocess',
      blurb: 'The requested delivery date is outside the valid range. Reprocess to send the order back through validation.',
      orderCopy: 'The requested delivery date falls outside the valid range for this account.',
      bulkAllowed: true,
    },
    {
      code: 'INVALID_DELIVERY_WINDOW',
      label: 'Invalid delivery window',
      status: 'REJECTED',
      scope: 'order',
      action: 'reprocess-no-fix',
      actionLabel: 'Reprocess',
      blurb: 'The requested delivery slot is outside the valid delivery window for this POC. Reprocess to send the order back through validation.',
      orderCopy: 'The requested delivery slot is outside the valid window for this POC.',
      bulkAllowed: true,
    },
    {
      code: 'MIN_ORDER_QUANTITY',
      label: 'Minimum order quantity',
      status: 'REJECTED',
      scope: 'order',
      action: 'reprocess-no-fix',
      actionLabel: 'Reprocess',
      blurb: 'The order total is below the minimum order quantity for this account. Reprocess to send the order back through validation.',
      orderCopy: 'The order total falls below the minimum order quantity for this account.',
      bulkAllowed: true,
    },
    {
      code: 'MAX_ORDER_QUANTITY',
      label: 'Maximum order quantity',
      status: 'REJECTED',
      scope: 'order',
      action: 'reprocess-no-fix',
      actionLabel: 'Reprocess',
      blurb: 'The order total exceeds the maximum order quantity allowed for this account. Reprocess to send the order back through validation.',
      orderCopy: 'The order total exceeds the maximum order quantity allowed for this account.',
      bulkAllowed: true,
    },
  ];

  const RULE_BY_CODE = Object.fromEntries(RULES.map((r) => [r.code, r]));
  const BLOCKING_RULES = RULES.filter((r) => r.status === 'BLOCKED');
  const REJECTING_RULES = RULES.filter((r) => r.status === 'REJECTED');
  const ORDER_REJECT_RULE_CODES = new Set(REJECTING_RULES.map((r) => r.code));
  const LINE_PRODUCT_RULE_CODES = new Set([
    'UPC_NOT_FOUND',
    'PRICE_MISMATCH',
    'INVALID_PACKAGING',
    'SKU_AVAILABILITY',
  ]);
  const META_RULE_CODES = new Set(['PRODUCT_ISSUES', 'NO_ACCEPTED_LINES']);

  function isAcceptedLine(it) {
    return it.status === 'OK';
  }

  function isFailedProductLine(it) {
    return (it.status === 'ALERT' || it.status === 'REJECTED')
      && it.ruleCode
      && LINE_PRODUCT_RULE_CODES.has(it.ruleCode);
  }

  function allLinesHaveProductLevelIssue(items) {
    return items.length > 0 && items.every(isFailedProductLine);
  }

  const FILTER_RULE_CODES = [
    ...RULES.map((r) => r.code),
    ...META_RULE_CODES,
  ];

  /** Derive order status + business rule badge from line outcomes (HLR line-level rules). */
  function deriveOrderMetaFromLines(items) {
    if (!items?.length) return { statusId: 'ACCEPTED', ruleCode: null };

    const okCount = items.filter(isAcceptedLine).length;
    const pendingCount = items.filter((it) => it.status === 'PENDING').length;
    const failedProduct = items.filter(isFailedProductLine);
    const failedProductCodes = [...new Set(failedProduct.map((it) => it.ruleCode))];

    const rejectedLines = items.filter((it) => it.status === 'REJECTED' && it.ruleCode);
    const rejectedCodes = [...new Set(rejectedLines.map((it) => it.ruleCode))];
    if (
      okCount === 0
      && rejectedCodes.length === 1
      && ORDER_REJECT_RULE_CODES.has(rejectedCodes[0])
      && rejectedLines.length === items.length
    ) {
      return { statusId: 'REJECTED', ruleCode: rejectedCodes[0] };
    }

    if (pendingCount === items.length) {
      return { statusId: 'IN_QUEUE', ruleCode: null };
    }

    if (pendingCount > 0 && okCount === 0 && failedProduct.length === 0) {
      return { statusId: 'BLOCKED', ruleCode: null };
    }

    if (okCount === items.length) {
      return { statusId: 'ACCEPTED', ruleCode: null };
    }

    if (failedProduct.length > 0) {
      // No partial acceptance when every line has a product-level issue and none are OK.
      if (okCount === 0 && allLinesHaveProductLevelIssue(items)) {
        if (failedProductCodes.length > 1) {
          return { statusId: 'REJECTED', ruleCode: 'NO_ACCEPTED_LINES' };
        }
        return { statusId: 'REJECTED', ruleCode: failedProductCodes[0] };
      }

      if (okCount > 0) {
        const ruleCode = failedProductCodes.length > 1 ? 'PRODUCT_ISSUES' : failedProductCodes[0];
        return { statusId: 'BLOCKED', ruleCode };
      }
    }

    if (okCount > 0 && items.some((it) => it.status === 'ALERT' || it.status === 'REJECTED')) {
      return { statusId: 'BLOCKED', ruleCode: failedProductCodes.length > 1 ? 'PRODUCT_ISSUES' : (failedProductCodes[0] || null) };
    }

    if (items.every((it) => it.status === 'REJECTED')) {
      return { statusId: 'REJECTED', ruleCode: rejectedCodes[0] || null };
    }

    return { statusId: 'BLOCKED', ruleCode: null };
  }

  function metaRuleLabel(code) {
    if (code === 'PRODUCT_ISSUES') return 'Product issues';
    if (code === 'NO_ACCEPTED_LINES') return 'No accepted lines';
    return null;
  }

  function resolveOrderRuleMeta(statusId, rule, items, forcedRuleCode) {
    const orderLevelRule = forcedRuleCode && RULE_BY_CODE[forcedRuleCode]?.scope === 'order'
      ? forcedRuleCode
      : null;
    if (orderLevelRule && ORDER_REJECT_RULE_CODES.has(orderLevelRule)) {
      return { code: orderLevelRule, label: RULE_BY_CODE[orderLevelRule].label };
    }
    if (forcedRuleCode === 'PRODUCT_ISSUES' || forcedRuleCode === 'NO_ACCEPTED_LINES') {
      return { code: forcedRuleCode, label: metaRuleLabel(forcedRuleCode) };
    }

    const derived = deriveOrderMetaFromLines(items);
    if (derived.ruleCode) {
      const label = RULE_BY_CODE[derived.ruleCode]?.label || metaRuleLabel(derived.ruleCode);
      return { code: derived.ruleCode, label };
    }
    if (rule) return { code: rule.code, label: rule.label };
    return { code: null, label: null };
  }

  // Catalog of BEES products — base SKUs plus generated variants for a realistic large catalog.
  const CATALOG_BASE = [
    { sku: '7891000100103', name: 'Corona Extra 355ml — 24-pack',      family: 'Lager',   uom: 'CASE' },
    { sku: '7891000100110', name: 'Stella Artois 330ml — 24-pack',     family: 'Lager',   uom: 'CASE' },
    { sku: '7891000100127', name: 'Budweiser 350ml — 12-pack',         family: 'Lager',   uom: 'CASE' },
    { sku: '7891000100134', name: 'Bohemia Pilsen 355ml — 6-pack',     family: 'Pilsner', uom: 'CASE' },
    { sku: '7891000100141', name: 'Modelo Especial 355ml — 12-pack',   family: 'Lager',   uom: 'CASE' },
    { sku: '7891000100158', name: 'Negra Modelo 355ml — 6-pack',       family: 'Dark',    uom: 'CASE' },
    { sku: '7891000100165', name: 'Pacífico 355ml — 12-pack',          family: 'Lager',   uom: 'CASE' },
    { sku: '7891000100172', name: 'Victoria 355ml — 12-pack',          family: 'Lager',   uom: 'CASE' },
    { sku: '7891000100189', name: 'Hoegaarden 330ml — 6-pack',         family: 'Wheat',   uom: 'CASE' },
    { sku: '7891000100196', name: 'Leffe Blonde 330ml — 6-pack',       family: 'Abbey',   uom: 'CASE' },
    { sku: '7891000100202', name: 'Goose Island IPA 355ml — 6-pack',   family: 'IPA',     uom: 'CASE' },
    { sku: '7891000100219', name: 'Michelob Ultra 355ml — 12-pack',    family: 'Light',   uom: 'CASE' },
    { sku: '7891000100226', name: "Beck's 330ml — 6-pack",             family: 'Pilsner', uom: 'CASE' },
    { sku: '7891000100233', name: 'Brahma Chopp 350ml — 12-pack',      family: 'Lager',   uom: 'CASE' },
    { sku: '7891000100240', name: 'Skol 350ml — 12-pack',              family: 'Lager',   uom: 'CASE' },
    { sku: '7891000100257', name: 'Antarctica Original 355ml — 6-pack',family: 'Lager',   uom: 'CASE' },
    { sku: '7891000100264', name: 'Quilmes Cristal 340ml — 12-pack',   family: 'Lager',   uom: 'CASE' },
    { sku: '7891000100271', name: 'Patagonia Amber Lager 355ml — 6-pack', family: 'Amber', uom: 'CASE' },
  ];

  const CATALOG_BRANDS = [
    { name: 'Corona Extra', family: 'Lager' },
    { name: 'Stella Artois', family: 'Lager' },
    { name: 'Budweiser', family: 'Lager' },
    { name: 'Bohemia Pilsen', family: 'Pilsner' },
    { name: 'Modelo Especial', family: 'Lager' },
    { name: 'Negra Modelo', family: 'Dark' },
    { name: 'Pacífico', family: 'Lager' },
    { name: 'Victoria', family: 'Lager' },
    { name: 'Hoegaarden', family: 'Wheat' },
    { name: 'Leffe Blonde', family: 'Abbey' },
    { name: 'Goose Island IPA', family: 'IPA' },
    { name: 'Michelob Ultra', family: 'Light' },
    { name: "Beck's", family: 'Pilsner' },
    { name: 'Brahma Chopp', family: 'Lager' },
    { name: 'Skol', family: 'Lager' },
    { name: 'Antarctica Original', family: 'Lager' },
    { name: 'Quilmes Cristal', family: 'Lager' },
    { name: 'Patagonia Amber Lager', family: 'Amber' },
    { name: 'Andes Origen Rubia', family: 'Lager' },
    { name: 'Imperial Golden', family: 'Lager' },
    { name: 'Salta Cautiva', family: 'Lager' },
    { name: 'Schneider', family: 'Red Lager' },
    { name: 'Warsteiner', family: 'Pilsner' },
    { name: 'Franziskaner', family: 'Wheat' },
  ];

  const CATALOG_VOLUMES_ML = [250, 310, 330, 350, 355, 473, 500, 600, 710];
  const CATALOG_PACKS = [4, 6, 12, 18, 24];

  function buildCatalog() {
    const catalog = [...CATALOG_BASE];
    const seen = new Set(catalog.map((c) => c.sku));
    let seq = 100300;
    for (const brand of CATALOG_BRANDS) {
      for (const vol of CATALOG_VOLUMES_ML) {
        for (const pack of CATALOG_PACKS) {
          const sku = `7891${String(seq).padStart(9, '0')}`;
          seq += 1;
          if (seen.has(sku)) continue;
          seen.add(sku);
          catalog.push({
            sku,
            name: `${brand.name} ${vol}ml — ${pack}-pack`,
            family: brand.family,
            uom: 'CASE',
          });
        }
      }
    }
    return catalog;
  }

  const CATALOG = buildCatalog();

  // ----------------------------------------------------------------
  // Deterministic pseudo-random so every reload renders the same mock.
  // ----------------------------------------------------------------
  let seed = 51860;
  const rand = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
  const pick = (arr) => arr[Math.floor(rand() * arr.length)];
  const pickWeighted = (arr) => {
    const total = arr.reduce((s, x) => s + x.weight, 0);
    let r = rand() * total;
    for (const x of arr) { r -= x.weight; if (r <= 0) return x; }
    return arr[arr.length - 1];
  };

  const now = Date.now();
  const DAY = 24 * 60 * 60 * 1000;

  const LINE_SCOPE_RULES = BLOCKING_RULES.filter((r) => r.scope === 'line');

  function catalogSku(sku) {
    return CATALOG.find((c) => c.sku === sku) || CATALOG_BASE.find((c) => c.sku === sku) || CATALOG[0];
  }

  /** Retailer EDI prices are usually below BEES contract/catalog (typical gap 5–22%). */
  function retailerPriceBelowContract(contractUnitPrice, ratio) {
    const r = ratio ?? (0.78 + rand() * 0.17);
    return Math.max(50, Math.round(contractUnitPrice * r));
  }

  function applyPriceMismatchLine(it, contractUnitPrice) {
    const contract = contractUnitPrice ?? it.unitPrice;
    it.unitPrice = contract;
    it.requestedUnitPrice = retailerPriceBelowContract(contract);
    it.lineValue = it.qty * it.unitPrice;
    it.requestedLineValue = it.requestedQty * it.requestedUnitPrice;
  }

  function applySkuAvailabilityLine(it, requestedQty, availableQty) {
    const requested = requestedQty ?? it.requestedQty ?? it.qty ?? 24;
    let available = availableQty ?? Math.max(1, Math.floor(requested * (0.25 + rand() * 0.45)));
    if (available >= requested) available = Math.max(1, Math.floor(requested * 0.35));
    it.requestedQty = requested;
    it.qty = requested;
    it.availableQty = available;
    it.lineValue = it.qty * it.unitPrice;
    it.requestedLineValue = it.requestedQty * it.requestedUnitPrice;
  }

  function buildLineItem(sku, lineNumber, spec) {
    const product = typeof sku === 'string' ? catalogSku(sku) : sku;
    const qty = spec.qty ?? 12;
    let unitPrice = spec.unitPrice;
    let requestedUnitPrice = spec.requestedUnitPrice;

    if (spec.ruleCode === 'PRICE_MISMATCH') {
      unitPrice = unitPrice ?? 480;
      if (requestedUnitPrice == null) {
        requestedUnitPrice = retailerPriceBelowContract(unitPrice, spec.retailerRatio);
      } else if (unitPrice <= requestedUnitPrice) {
        // Ensure contract/catalog stays above what the retailer sent.
        unitPrice = Math.max(requestedUnitPrice + 25, Math.round(requestedUnitPrice / (spec.retailerRatio ?? 0.85)));
      }
    } else {
      const base = unitPrice ?? requestedUnitPrice ?? 480;
      unitPrice = base;
      requestedUnitPrice = requestedUnitPrice ?? base;
    }

    const line = {
      lineNumber,
      sku: product.sku,
      name: product.name,
      family: product.family,
      uom: product.uom,
      qty,
      unitPrice,
      lineValue: qty * unitPrice,
      requestedQty: qty,
      requestedUnitPrice,
      requestedLineValue: qty * requestedUnitPrice,
      status: spec.status,
      ruleCode: spec.ruleCode ?? null,
    };

    if (spec.ruleCode === 'SKU_AVAILABILITY') {
      applySkuAvailabilityLine(line, spec.qty, spec.availableQty);
    }

    return line;
  }

  function pocFor(chainCode, city) {
    return POCS.find((p) => p.chainCode === chainCode && (!city || p.city === city))
      || POCS.find((p) => p.chainCode === chainCode)
      || POCS[0];
  }

  const SEED_SKUS = [
    '7891000100103', '7891000100110', '7891000100127', '7891000100134', '7891000100141',
    '7891000100158', '7891000100165', '7891000100172', '7891000100189', '7891000100196',
  ];

  function linesAccepted(count = 4) {
    return SEED_SKUS.slice(0, count).map((sku, i) => ({ sku, status: 'OK', qty: 10 + i * 6 }));
  }

  function linesBlockedOrderScope(count = 4) {
    return SEED_SKUS.slice(0, count).map((sku, i) => ({ sku, status: 'PENDING', qty: 8 + i * 3 }));
  }

  function linesBlockedLineRule(ruleCode, alertCount = 2, total = 4) {
    return SEED_SKUS.slice(0, total).map((sku, i) => {
      if (i < alertCount) {
        const line = { sku, status: 'ALERT', ruleCode, qty: 12 + i * 5 };
        if (ruleCode === 'PRICE_MISMATCH') {
          line.unitPrice = 680 + i * 55;
          line.requestedUnitPrice = Math.round((680 + i * 55) * (0.78 + i * 0.03));
        }
        if (ruleCode === 'SKU_AVAILABILITY') {
          line.qty = 20 + i * 8;
          line.availableQty = Math.max(2, 6 + i * 2);
        }
        return line;
      }
      return { sku, status: 'OK', qty: 16 + i * 2 };
    });
  }

  function linesRejected(ruleCode, count = 4) {
    return SEED_SKUS.slice(0, count).map((sku, i) => ({ sku, status: 'REJECTED', ruleCode, qty: 10 + i * 4 }));
  }

  function linesAllProductRule(ruleCode, count = 4) {
    return SEED_SKUS.slice(0, count).map((sku, i) => {
      const line = { sku, status: 'ALERT', ruleCode, qty: 12 + i * 5 };
      if (ruleCode === 'PRICE_MISMATCH') {
        line.unitPrice = 680 + i * 55;
        line.requestedUnitPrice = Math.round((680 + i * 55) * (0.78 + i * 0.03));
      }
      if (ruleCode === 'SKU_AVAILABILITY') {
        line.qty = 20 + i * 8;
        line.availableQty = 0;
      }
      return line;
    });
  }

  const SEED_CONTEXTS = [
    { chainCode: 'OXXO', city: 'Mexico City', vendorCode: 'AMBEV' },
    { chainCode: 'WALMART', city: 'Monterrey', vendorCode: 'GRUPO_M' },
    { chainCode: 'EXTRA', city: 'Guadalajara', vendorCode: 'AB_BRWY' },
    { chainCode: 'KIOSKO', city: 'Tijuana', vendorCode: 'AB_INBV' },
    { chainCode: 'OXXO', city: 'Puebla', vendorCode: 'GRUPO_M' },
  ];

  function buildSeededOrder(spec) {
    const rule = spec.ruleCode && !META_RULE_CODES.has(spec.ruleCode) ? RULE_BY_CODE[spec.ruleCode] : null;
    const poc = spec.pocId
      ? POCS.find((p) => p.id === spec.pocId)
      : pocFor(spec.chainCode || 'OXXO', spec.city);
    const chain = CHAINS.find((c) => c.code === poc.chainCode);
    const vendor = VENDORS.find((v) => v.code === spec.vendorCode) || VENDORS[0];
    const eligibleReps = SALES_REPS.filter((r) => r.chains.includes(chain.code));
    const salesRep = eligibleReps[0] || SALES_REPS[0];
    const receivedAt = new Date(now - spec.minutesAgo * 60 * 1000);
    const expirationDate = new Date(receivedAt.getTime() + (spec.expirationDays ?? 14) * DAY);
    const items = spec.lines.map((line, i) => buildLineItem(line.sku, i + 1, line));
    const totalValue = items.reduce((s, it) => s + it.lineValue, 0);
    const requestedTotalValue = items.reduce((s, it) => s + it.requestedLineValue, 0);
    const orderTotalQty = spec.orderTotalQty ?? items.reduce((s, it) => s + it.requestedQty, 0);
    const deliveryOffsetDays = spec.deliveryOffsetDays ?? 8;
    const requestedDeliveryDate = new Date(receivedAt.getTime() + deliveryOffsetDays * DAY);
    const firstValidDeliveryDate = spec.invalidDeliveryDaysAfter != null
      ? new Date(requestedDeliveryDate.getTime() + spec.invalidDeliveryDaysAfter * DAY)
      : new Date(requestedDeliveryDate.getTime());

    const derived = deriveOrderMetaFromLines(items);
    const orderLevelRule = spec.ruleCode && RULE_BY_CODE[spec.ruleCode]?.scope === 'order' ? spec.ruleCode : null;
    let statusId = derived.statusId;
    if (orderLevelRule && ORDER_REJECT_RULE_CODES.has(orderLevelRule)) {
      statusId = 'REJECTED';
    }
    const status = STATUSES.find((s) => s.id === statusId) || STATUSES[0];
    const orderRule = resolveOrderRuleMeta(statusId, rule, items, spec.ruleCode);

    const hasReleasedLines = items.some((it) => it.status === 'OK');
    const beesOrderNumber = spec.beesOrderNumber !== undefined
      ? spec.beesOrderNumber
      : ((statusId === 'ACCEPTED' || (statusId === 'BLOCKED' && hasReleasedLines))
        ? 'BEES-' + String(1800000000 + Math.abs(spec.id.split('').reduce((s, c) => s + c.charCodeAt(0), 0) % 899999999))
        : null);

    const audit = [{ ts: receivedAt.toISOString(), event: 'Order received via EDI', actor: 'system' }];
    if (orderRule.code === 'PRODUCT_ISSUES') {
      audit.push({
        ts: new Date(receivedAt.getTime() + 45 * 1000).toISOString(),
        event: 'Partially accepted: Product issues',
        actor: 'BRE',
      });
    } else if (orderRule.code === 'NO_ACCEPTED_LINES') {
      audit.push({
        ts: new Date(receivedAt.getTime() + 40 * 1000).toISOString(),
        event: 'Rejected: No accepted lines',
        actor: 'BRE',
      });
    } else if (orderRule.code && RULE_BY_CODE[orderRule.code]) {
      audit.push({
        ts: new Date(receivedAt.getTime() + 30 * 1000).toISOString(),
        event: `${status.label}: ${RULE_BY_CODE[orderRule.code].label}`,
        actor: 'BRE',
      });
    } else if (statusId === 'ACCEPTED') {
      audit.push({
        ts: new Date(receivedAt.getTime() + 60 * 1000).toISOString(),
        event: 'Order accepted into BEES OMS',
        actor: 'system',
      });
    }

    return {
      id: spec.id,
      receivedAt: receivedAt.toISOString(),
      expirationDate: expirationDate.toISOString(),
      vendorCode: vendor.code,
      vendorName: vendor.name,
      chainCode: chain.code,
      chainName: chain.name,
      pocId: poc.id,
      pocName: poc.name,
      pocCity: poc.city,
      pocRegion: poc.region,
      salesRepId: salesRep.id,
      salesRepName: salesRep.name,
      poNumber: spec.poNumber,
      beesOrderNumber,
      statusId: status.id,
      statusLabel: status.label,
      statusTone: status.tone,
      ruleCode: orderRule.code,
      ruleLabel: orderRule.label,
      itemCount: items.length,
      orderTotalQty,
      minOrderQty: spec.minOrderQty ?? 80,
      maxOrderQty: spec.maxOrderQty ?? 520,
      requestedDeliveryDate: requestedDeliveryDate.toISOString(),
      firstValidDeliveryDate: firstValidDeliveryDate.toISOString(),
      totalValue,
      requestedTotalValue,
      items,
      audit,
      notes: spec.notes ?? [],
    };
  }

  function seedBatch(idPrefix, startNum, count, base) {
    return Array.from({ length: count }, (_, i) => {
      const ctx = SEED_CONTEXTS[i % SEED_CONTEXTS.length];
      const n = startNum + i;
      return buildSeededOrder({
        id: `${idPrefix}${String(n).padStart(3, '0')}`,
        minutesAgo: 25 + n * 41,
        poNumber: String(41000000 + n),
        chainCode: ctx.chainCode,
        city: ctx.city,
        vendorCode: ctx.vendorCode,
        ...base,
        lines: typeof base.lines === 'function' ? base.lines(i) : base.lines,
      });
    });
  }

  /** Curated order — status and rule badge are derived from line outcomes. */
  function buildProductIssuesOrder(spec) {
    return buildSeededOrder(spec);
  }

  function buildCuratedShowcaseOrders() {
    const accepted = seedBatch('EDI-801', 1, 5, {
      statusId: 'ACCEPTED',
      lines: linesAccepted(5),
    });

    const pocNotFound = seedBatch('EDI-802', 1, 5, {
      ruleCode: 'POC_NOT_FOUND',
      lines: (i) => linesRejected('POC_NOT_FOUND', 3 + (i % 3)),
    });

    const poDuplicatedOriginals = Array.from({ length: 5 }, (_, i) => {
      const ctx = SEED_CONTEXTS[i % SEED_CONTEXTS.length];
      const n = 1 + i;
      return buildSeededOrder({
        id: `EDI-798${String(n).padStart(3, '0')}`,
        minutesAgo: 25 + n * 41 + 2880,
        poNumber: String(41000000 + n),
        chainCode: ctx.chainCode,
        city: ctx.city,
        vendorCode: ctx.vendorCode,
        beesOrderNumber: `BEES-${1700000000 + n}`,
        lines: linesAccepted(4),
      });
    });

    const poDuplicated = seedBatch('EDI-803', 1, 5, {
      ruleCode: 'PO_DUPLICATED',
      lines: (i) => linesRejected('PO_DUPLICATED', 3 + (i % 3)),
    });

    const upcNotFound = seedBatch('EDI-804', 1, 5, {
      lines: (i) => linesBlockedLineRule('UPC_NOT_FOUND', 1 + (i % 2), 4 + (i % 2)),
    });

    const priceMismatch = seedBatch('EDI-805', 1, 5, {
      lines: (i) => linesBlockedLineRule('PRICE_MISMATCH', 1 + (i % 2), 4 + (i % 2)),
    });

    const invalidPackaging = seedBatch('EDI-806', 1, 5, {
      lines: (i) => linesBlockedLineRule('INVALID_PACKAGING', 1 + (i % 2), 4 + (i % 2)),
    });

    const skuAvailability = seedBatch('EDI-811', 1, 5, {
      lines: (i) => linesBlockedLineRule('SKU_AVAILABILITY', 1 + (i % 2), 4 + (i % 2)),
    });

    const skuAvailabilityRejected = seedBatch('EDI-812', 1, 5, {
      lines: () => SEED_SKUS.slice(0, 5).map((sku, i) => ({
        sku,
        status: 'ALERT',
        ruleCode: 'SKU_AVAILABILITY',
        qty: 16 + i * 4,
        availableQty: 0,
      })),
    });

    const invalidDeliveryRange = seedBatch('EDI-807', 1, 5, {
      statusId: 'REJECTED',
      ruleCode: 'INVALID_DELIVERY_RANGE',
      invalidDeliveryDaysAfter: 3,
      lines: (i) => linesRejected('INVALID_DELIVERY_RANGE', 3 + (i % 3)),
    });

    const invalidDeliveryWindow = seedBatch('EDI-808', 1, 5, {
      statusId: 'REJECTED',
      ruleCode: 'INVALID_DELIVERY_WINDOW',
      invalidDeliveryDaysAfter: 2,
      lines: (i) => linesRejected('INVALID_DELIVERY_WINDOW', 3 + (i % 3)),
    });

    const minOrderQty = seedBatch('EDI-809', 1, 5, {
      statusId: 'REJECTED',
      ruleCode: 'MIN_ORDER_QUANTITY',
      minOrderQty: 120,
      maxOrderQty: 600,
      orderTotalQty: 48,
      lines: (i) => linesRejected('MIN_ORDER_QUANTITY', 3).map((line, li) => ({ ...line, qty: 12 + li * 4 + i })),
    });

    const maxOrderQty = seedBatch('EDI-810', 1, 5, {
      statusId: 'REJECTED',
      ruleCode: 'MAX_ORDER_QUANTITY',
      minOrderQty: 60,
      maxOrderQty: 180,
      orderTotalQty: 240 + 15,
      lines: (i) => linesRejected('MAX_ORDER_QUANTITY', 4).map((line, li) => ({ ...line, qty: 50 + li * 8 + i * 2 })),
    });

    const productIssues = [
      buildProductIssuesOrder({
        id: 'EDI-900001',
        pocId: pocFor('OXXO', 'Mexico City').id,
        vendorCode: 'AMBEV',
        poNumber: '48291037',
        beesOrderNumber: 'BEES-1847293051',
        minutesAgo: 35,
        lines: [
          { sku: '7891000100103', status: 'OK' },
          { sku: '7891000100110', status: 'OK' },
          { sku: '7891000100127', status: 'ALERT', ruleCode: 'UPC_NOT_FOUND', qty: 18 },
          { sku: '7891000100134', status: 'ALERT', ruleCode: 'PRICE_MISMATCH', qty: 24, unitPrice: 785, requestedUnitPrice: 620 },
          { sku: '7891000100141', status: 'OK' },
        ],
      }),
      buildProductIssuesOrder({
        id: 'EDI-900002',
        pocId: pocFor('WALMART', 'Monterrey').id,
        vendorCode: 'GRUPO_M',
        poNumber: '77310482',
        beesOrderNumber: 'BEES-2093847561',
        minutesAgo: 95,
        lines: [
          { sku: '7891000100158', status: 'OK' },
          { sku: '7891000100165', status: 'ALERT', ruleCode: 'UPC_NOT_FOUND', qty: 10 },
          { sku: '7891000100172', status: 'ALERT', ruleCode: 'INVALID_PACKAGING', qty: 15 },
          { sku: '7891000100189', status: 'ALERT', ruleCode: 'PRICE_MISMATCH', qty: 20, unitPrice: 643, requestedUnitPrice: 540 },
          { sku: '7891000100196', status: 'OK' },
          { sku: '7891000100202', status: 'OK' },
        ],
      }),
      buildProductIssuesOrder({
        id: 'EDI-900003',
        pocId: pocFor('EXTRA', 'Guadalajara').id,
        vendorCode: 'AB_BRWY',
        poNumber: '59103847',
        beesOrderNumber: 'BEES-3309182746',
        minutesAgo: 210,
        lines: [
          { sku: '7891000100219', status: 'ALERT', ruleCode: 'PRICE_MISMATCH', qty: 8, unitPrice: 922, requestedUnitPrice: 710 },
          { sku: '7891000100226', status: 'ALERT', ruleCode: 'INVALID_PACKAGING', qty: 14 },
          { sku: '7891000100233', status: 'OK' },
          { sku: '7891000100240', status: 'OK' },
        ],
      }),
      buildProductIssuesOrder({
        id: 'EDI-900004',
        pocId: pocFor('KIOSKO', 'Tijuana').id,
        vendorCode: 'AB_INBV',
        poNumber: '66482019',
        beesOrderNumber: 'BEES-4471029385',
        minutesAgo: 480,
        lines: [
          { sku: '7891000100257', status: 'OK' },
          { sku: '7891000100264', status: 'ALERT', ruleCode: 'UPC_NOT_FOUND', qty: 6 },
          { sku: '7891000100271', status: 'ALERT', ruleCode: 'INVALID_PACKAGING', qty: 22 },
          { sku: '7891000100103', status: 'OK' },
          { sku: '7891000100233', status: 'ALERT', ruleCode: 'PRICE_MISMATCH', qty: 16, unitPrice: 449, requestedUnitPrice: 395 },
        ],
      }),
      buildProductIssuesOrder({
        id: 'EDI-900005',
        pocId: pocFor('OXXO', 'Cancún').id,
        vendorCode: 'AMBEV',
        poNumber: '55829104',
        beesOrderNumber: 'BEES-5129384756',
        minutesAgo: 720,
        lines: [
          { sku: '7891000100141', status: 'OK' },
          { sku: '7891000100158', status: 'ALERT', ruleCode: 'UPC_NOT_FOUND', qty: 9 },
          { sku: '7891000100165', status: 'ALERT', ruleCode: 'PRICE_MISMATCH', qty: 18, unitPrice: 812, requestedUnitPrice: 655 },
          { sku: '7891000100172', status: 'ALERT', ruleCode: 'INVALID_PACKAGING', qty: 11 },
          { sku: '7891000100189', status: 'OK' },
        ],
      }),
    ];

    const statusRuleExamples = [
      buildSeededOrder({
        id: 'EDI-900100',
        pocId: pocFor('OXXO', 'Mexico City').id,
        vendorCode: 'AMBEV',
        poNumber: '90010001',
        minutesAgo: 18,
        lines: [
          { sku: '7891000100103', status: 'ALERT', ruleCode: 'UPC_NOT_FOUND', qty: 12 },
          { sku: '7891000100110', status: 'ALERT', ruleCode: 'PRICE_MISMATCH', qty: 14, unitPrice: 720, requestedUnitPrice: 580 },
          { sku: '7891000100127', status: 'ALERT', ruleCode: 'INVALID_PACKAGING', qty: 10 },
          { sku: '7891000100134', status: 'ALERT', ruleCode: 'SKU_AVAILABILITY', qty: 18, availableQty: 0 },
          { sku: '7891000100141', status: 'ALERT', ruleCode: 'SKU_AVAILABILITY', qty: 22, availableQty: 0 },
        ],
      }),
      buildSeededOrder({
        id: 'EDI-900101',
        pocId: pocFor('WALMART', 'Monterrey').id,
        vendorCode: 'GRUPO_M',
        poNumber: '90010101',
        beesOrderNumber: 'BEES-9001010001',
        minutesAgo: 42,
        lines: [
          { sku: '7891000100158', status: 'ALERT', ruleCode: 'UPC_NOT_FOUND', qty: 9 },
          { sku: '7891000100165', status: 'ALERT', ruleCode: 'PRICE_MISMATCH', qty: 18, unitPrice: 812, requestedUnitPrice: 655 },
          { sku: '7891000100172', status: 'ALERT', ruleCode: 'INVALID_PACKAGING', qty: 11 },
          { sku: '7891000100189', status: 'OK', qty: 20 },
          { sku: '7891000100196', status: 'OK', qty: 16 },
        ],
      }),
      buildSeededOrder({
        id: 'EDI-900102',
        pocId: pocFor('EXTRA', 'Guadalajara').id,
        vendorCode: 'AB_BRWY',
        poNumber: '90010201',
        beesOrderNumber: 'BEES-9001020001',
        minutesAgo: 55,
        lines: [
          { sku: '7891000100202', status: 'ALERT', ruleCode: 'UPC_NOT_FOUND', qty: 8 },
          { sku: '7891000100219', status: 'OK', qty: 24 },
          { sku: '7891000100226', status: 'OK', qty: 18 },
          { sku: '7891000100233', status: 'OK', qty: 30 },
          { sku: '7891000100240', status: 'OK', qty: 12 },
        ],
      }),
      buildSeededOrder({
        id: 'EDI-900110',
        pocId: pocFor('OXXO', 'Mexico City').id,
        vendorCode: 'AMBEV',
        poNumber: '90011001',
        minutesAgo: 48,
        lines: linesAllProductRule('INVALID_PACKAGING', 4),
      }),
      buildSeededOrder({
        id: 'EDI-900111',
        pocId: pocFor('WALMART', 'Monterrey').id,
        vendorCode: 'GRUPO_M',
        poNumber: '90011101',
        minutesAgo: 46,
        lines: linesAllProductRule('UPC_NOT_FOUND', 5),
      }),
      buildSeededOrder({
        id: 'EDI-900112',
        pocId: pocFor('KIOSKO', 'Tijuana').id,
        vendorCode: 'AB_INBV',
        poNumber: '90011201',
        minutesAgo: 44,
        lines: linesAllProductRule('PRICE_MISMATCH', 4),
      }),
      buildSeededOrder({
        id: 'EDI-900113',
        pocId: pocFor('OXXO', 'Monterrey').id,
        vendorCode: 'AMBEV',
        poNumber: '90011301',
        minutesAgo: 60 * 24 * 12,
        deliveryOffsetDays: -8,
        lines: linesBlockedLineRule('SKU_AVAILABILITY', 2, 4),
      }),
    ];

    return [
      ...accepted,
      ...pocNotFound,
      ...poDuplicatedOriginals,
      ...poDuplicated,
      ...upcNotFound,
      ...priceMismatch,
      ...invalidPackaging,
      ...skuAvailability,
      ...skuAvailabilityRejected,
      ...invalidDeliveryRange,
      ...invalidDeliveryWindow,
      ...minOrderQty,
      ...maxOrderQty,
      ...productIssues,
      ...statusRuleExamples,
    ];
  }

  // ~120 orders across the last 90 days (ops scope = wider than retailer's 30d).
  const ORDER_COUNT = 120;
  const orders = [];
  for (let i = 0; i < ORDER_COUNT; i++) {
    const poc = pick(POCS);
    const chain = CHAINS.find((c) => c.code === poc.chainCode);
    const vendor = pick(VENDORS);
    const status = pickWeighted(STATUSES);
    const minutesAgo = Math.floor(rand() * 90 * 24 * 60);
    const receivedAt = new Date(now - minutesAgo * 60 * 1000);
    const expirationDays = 7 + Math.floor(rand() * 38);
    const expirationDate = new Date(receivedAt.getTime() + expirationDays * DAY);
    const po = (10000000 + Math.floor(rand() * 89999999)).toString();
    const itemCount = 3 + Math.floor(rand() * 9);

    // Sales rep: pick a rep whose chains[] contains this retailer chain.
    const eligibleReps = SALES_REPS.filter((r) => r.chains.includes(chain.code));
    const salesRep = eligibleReps.length ? pick(eligibleReps) : SALES_REPS[0];

    // Pick a rule based on status.
    let rule = null;
    if (status.id === 'BLOCKED')  rule = pick(BLOCKING_RULES);
    if (status.id === 'REJECTED') rule = pick(REJECTING_RULES);

    // Build line items.
    const items = [];
    let totalValue = 0;
    let requestedTotalValue = 0;

    for (let li = 0; li < itemCount; li++) {
      const sku = pick(CATALOG);
      const requestedQty = 1 + Math.floor(rand() * 40);
      let qty = requestedQty;
      let unitPrice = 80 + Math.floor(rand() * 1200);
      let requestedUnitPrice = unitPrice;
      // Per-line status: OK (accepted) | ALERT (needs review) | REJECTED | PENDING
      let lineStatus = 'OK';
      let lineRuleCode = null;

      if (status.id === 'IN_QUEUE') {
        lineStatus = 'PENDING';
      } else if (status.id === 'BLOCKED' && rule.scope === 'line') {
        // ~50% of lines need review; the rest were accepted.
        if (rand() < 0.5) {
          lineStatus = 'ALERT';
          lineRuleCode = rule.code;
          if (rule.code === 'PRICE_MISMATCH') {
            // Retailer-submitted price is below BEES contract/catalog.
            requestedUnitPrice = retailerPriceBelowContract(unitPrice);
          }
        }
      } else if (status.id === 'REJECTED') {
        // All rejection rules are order-level — every line shares the verdict.
        lineStatus = 'REJECTED';
        lineRuleCode = rule.code;
      }

      const requestedLineValue = requestedQty * requestedUnitPrice;
      const lineValue = qty * unitPrice;
      requestedTotalValue += requestedLineValue;
      totalValue += lineValue;

      items.push({
        lineNumber: li + 1,
        sku: sku.sku,
        name: sku.name,
        family: sku.family,
        uom: sku.uom,
        qty,
        unitPrice,
        lineValue,
        requestedQty,
        requestedUnitPrice,
        requestedLineValue,
        status: lineStatus,
        ruleCode: lineRuleCode,
      });
      if (lineRuleCode === 'SKU_AVAILABILITY') {
        applySkuAvailabilityLine(items[items.length - 1]);
      }
    }

    // Guarantee at least one line needing review for BLOCKED + line-scope rules.
    if (status.id === 'BLOCKED' && rule && rule.scope === 'line') {
      if (!items.some((it) => it.status === 'ALERT')) {
        const it = items[0];
        it.status = 'ALERT';
        it.ruleCode = rule.code;
        if (rule.code === 'PRICE_MISMATCH') applyPriceMismatchLine(it);
        if (rule.code === 'SKU_AVAILABILITY') applySkuAvailabilityLine(it);
      }
      // ~40% of line-scope orders mix two different product issues across lines.
      if (rand() < 0.4) {
        const lineRules = LINE_SCOPE_RULES.filter((r) => r.code !== rule.code);
        const secondRule = lineRules.length ? pick(lineRules) : null;
        const target = items.find((it) => it.status === 'OK');
        if (secondRule && target) {
          target.status = 'ALERT';
          target.ruleCode = secondRule.code;
          if (secondRule.code === 'PRICE_MISMATCH') applyPriceMismatchLine(target);
          if (secondRule.code === 'SKU_AVAILABILITY') applySkuAvailabilityLine(target);
        }
        // Optional third distinct issue on another released line.
        if (rand() < 0.35) {
          const usedCodes = new Set(items.filter((it) => it.status === 'ALERT' && it.ruleCode).map((it) => it.ruleCode));
          const thirdRule = LINE_SCOPE_RULES.find((r) => !usedCodes.has(r.code));
          const anotherOk = items.find((it) => it.status === 'OK');
          if (thirdRule && anotherOk) {
            anotherOk.status = 'ALERT';
            anotherOk.ruleCode = thirdRule.code;
            if (thirdRule.code === 'PRICE_MISMATCH') applyPriceMismatchLine(anotherOk);
            if (thirdRule.code === 'SKU_AVAILABILITY') applySkuAvailabilityLine(anotherOk);
          }
        }
      }
    }

    if (items.length) {
      totalValue = items.reduce((s, it) => s + it.lineValue, 0);
      requestedTotalValue = items.reduce((s, it) => s + it.requestedLineValue, 0);
    }

    let statusId = status.id;
    let orderRuleCode = rule ? rule.code : null;
    let orderRuleLabel = rule ? rule.label : null;

    if (status.id === 'IN_QUEUE') {
      statusId = 'IN_QUEUE';
      orderRuleCode = null;
      orderRuleLabel = null;
    } else if (status.id === 'REJECTED' && rule && rule.scope === 'order') {
      statusId = 'REJECTED';
      orderRuleCode = rule.code;
      orderRuleLabel = rule.label;
    } else if (status.id === 'ACCEPTED') {
      statusId = 'ACCEPTED';
      orderRuleCode = null;
      orderRuleLabel = null;
    } else {
      const derived = deriveOrderMetaFromLines(items);
      statusId = derived.statusId;
      if (derived.ruleCode) {
        orderRuleCode = derived.ruleCode;
        orderRuleLabel = RULE_BY_CODE[derived.ruleCode]?.label || metaRuleLabel(derived.ruleCode);
      } else {
        orderRuleCode = null;
        orderRuleLabel = null;
      }
    }

    const resolvedStatus = STATUSES.find((s) => s.id === statusId) || status;

    // BEES order number is assigned once valid lines are in the BEES OMS (accepted or partially accepted).
    const hasReleasedLines = items.some((it) => it.status === 'OK');
    const beesOrderNumber = (statusId === 'ACCEPTED' || (statusId === 'BLOCKED' && hasReleasedLines))
      ? 'BEES-' + (1000000000 + Math.floor(rand() * 8999999999)).toString()
      : null;

    const orderTotalQty = items.reduce((s, it) => s + it.requestedQty, 0);
    const deliveryOffsetDays = 5 + Math.floor(rand() * 14);
    const requestedDeliveryDate = new Date(receivedAt.getTime() + deliveryOffsetDays * DAY);
    let firstValidDeliveryDate = new Date(requestedDeliveryDate.getTime());
    if (rule && (rule.code === 'INVALID_DELIVERY_RANGE' || rule.code === 'INVALID_DELIVERY_WINDOW')) {
      firstValidDeliveryDate = new Date(requestedDeliveryDate.getTime() + (2 + Math.floor(rand() * 5)) * DAY);
    } else if (rand() < 0.15) {
      firstValidDeliveryDate = new Date(requestedDeliveryDate.getTime() - (1 + Math.floor(rand() * 3)) * DAY);
    }

    orders.push({
      id: 'EDI-' + String(100000 + i),
      receivedAt: receivedAt.toISOString(),
      expirationDate: expirationDate.toISOString(),
      vendorCode: vendor.code,
      vendorName: vendor.name,
      chainCode: chain.code,
      chainName: chain.name,
      pocId: poc.id,
      pocName: poc.name,
      pocCity: poc.city,
      pocRegion: poc.region,
      salesRepId: salesRep.id,
      salesRepName: salesRep.name,
      poNumber: po,
      beesOrderNumber,
      statusId: resolvedStatus.id,
      statusLabel: resolvedStatus.label,
      statusTone: resolvedStatus.tone,
      ruleCode: orderRuleCode,
      ruleLabel: orderRuleLabel,
      itemCount,
      orderTotalQty,
      minOrderQty: 60 + Math.floor(rand() * 40),
      maxOrderQty: 400 + Math.floor(rand() * 250),
      requestedDeliveryDate: requestedDeliveryDate.toISOString(),
      firstValidDeliveryDate: firstValidDeliveryDate.toISOString(),
      totalValue,
      requestedTotalValue,
      items,
      // Audit trail starts with the original system events; ops actions are
      // appended at runtime by index.html when the analyst reprocesses /
      // bypasses / adds a note.
      audit: [
        { ts: receivedAt.toISOString(), event: 'Order received via EDI', actor: 'system' },
        ...(orderRuleCode && RULE_BY_CODE[orderRuleCode] ? [{
          ts: new Date(receivedAt.getTime() + 30 * 1000).toISOString(),
          event: `${resolvedStatus.label}: ${RULE_BY_CODE[orderRuleCode].label}`,
          actor: 'BRE',
        }] : (orderRuleCode === 'PRODUCT_ISSUES' ? [{
          ts: new Date(receivedAt.getTime() + 45 * 1000).toISOString(),
          event: 'Partially accepted: Product issues',
          actor: 'BRE',
        }] : (orderRuleCode === 'NO_ACCEPTED_LINES' ? [{
          ts: new Date(receivedAt.getTime() + 40 * 1000).toISOString(),
          event: 'Rejected: No accepted lines',
          actor: 'BRE',
        }] : (statusId === 'ACCEPTED' ? [{
          ts: new Date(receivedAt.getTime() + 60 * 1000).toISOString(),
          event: 'Order accepted into BEES OMS',
          actor: 'system',
        }] : [])))),
      ],
      // Resolution notes (FR-9). Empty by default; analyst adds notes at runtime.
      notes: [],
    });
  }

  function enrichPoDuplicatedOrders(allOrders) {
    allOrders.forEach((o) => {
      if (o.ruleCode !== 'PO_DUPLICATED') return;
      const prior = allOrders
        .filter((other) => other.id !== o.id
          && other.pocId === o.pocId
          && other.poNumber === o.poNumber
          && other.beesOrderNumber)
        .sort((a, b) => new Date(a.receivedAt) - new Date(b.receivedAt))[0];
      if (prior) {
        o.duplicateBeesOrderNumber = prior.beesOrderNumber;
        o.duplicateBeesOrderId = prior.id;
        return;
      }
      const hash = Math.abs((o.pocId + o.poNumber).split('').reduce((s, c) => s + c.charCodeAt(0), 0) % 899999999) + 1000000000;
      o.duplicateBeesOrderNumber = `BEES-${hash}`;
      o.duplicateBeesOrderId = null;
    });
  }

  orders.push(...buildCuratedShowcaseOrders());
  enrichPoDuplicatedOrders(orders);

  orders.sort((a, b) => b.receivedAt.localeCompare(a.receivedAt));

  return {
    CHAINS, VENDORS, SALES_REPS, REGIONS, POCS,
    STATUSES, RULES, RULE_BY_CODE, BLOCKING_RULES, REJECTING_RULES, FILTER_RULE_CODES,
    LINE_PRODUCT_RULE_CODES, META_RULE_CODES, deriveOrderMetaFromLines,
    CATALOG, orders,
  };
})();
