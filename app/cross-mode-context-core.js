(function (root, factory) {
  'use strict';
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.AzureCrossModeContextCore = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const MODES = new Set(['architecture', 'learning']);
  const STATUSES = new Set(['direct', 'related', 'none']);
  const SUBTYPES = new Set(['direct', 'related_path', 'indirect_parent_context', 'none']);
  const EXPECTED_RUNTIME_SCHEMA = '3.3-cross-mode-runtime-1.0';
  const EXPECTED_FEATURE_SCHEMA = '3.3-phase-3-feature-flags-1.0';

  function list(value) {
    return Array.isArray(value) ? value : [];
  }

  function entries(value) {
    return value && typeof value === 'object' ? Object.entries(value) : [];
  }

  function clone(value) {
    if (value === undefined) return undefined;
    return JSON.parse(JSON.stringify(value));
  }

  function toSet(value) {
    if (value instanceof Set) return value;
    if (Array.isArray(value)) return new Set(value);
    return null;
  }

  function issue(code, location, message) {
    return { code, location, message };
  }

  function validatePhase3Runtime(runtime, options) {
    const config = options || {};
    const issues = [];
    const knownNodeIds = toSet(config.knownNodeIds);
    const scenarioIds = toSet(config.scenarioIds);
    const learningStepIds = toSet(config.learningStepIds);

    if (!runtime || runtime.schema_version !== EXPECTED_RUNTIME_SCHEMA) {
      issues.push(issue('RUNTIME_SCHEMA', 'runtime.schema_version', 'Unbekannte oder fehlende Phase-3-Runtime.'));
      return { valid: false, issues };
    }
    if (runtime.automatic_open !== false) issues.push(issue('RUNTIME_AUTO_OPEN', 'runtime.automatic_open', 'Automatisches Öffnen ist nicht erlaubt.'));
    if (!runtime.modes || typeof runtime.modes !== 'object') issues.push(issue('RUNTIME_MODES', 'runtime.modes', 'Modusdaten fehlen.'));
    if (knownNodeIds && runtime.node_count !== knownNodeIds.size) issues.push(issue('RUNTIME_NODE_COUNT', 'runtime.node_count', 'Runtime und Wissensbasis besitzen unterschiedliche Node-Anzahlen.'));

    for (const mode of MODES) {
      const modeRuntime = runtime.modes?.[mode];
      const contextEntries = entries(modeRuntime?.contexts);
      if (!modeRuntime || !Number.isInteger(modeRuntime.context_count) || !Number.isInteger(modeRuntime.none_count)) {
        issues.push(issue('MODE_CONTRACT', `runtime.modes.${mode}`, 'Kontext- oder None-Zählwert fehlt.'));
        continue;
      }
      if (contextEntries.length !== modeRuntime.context_count) issues.push(issue('MODE_CONTEXT_COUNT', `runtime.modes.${mode}.context_count`, 'Kontextanzahl stimmt nicht mit den Einträgen überein.'));
      if (modeRuntime.context_count + modeRuntime.none_count !== runtime.node_count) issues.push(issue('MODE_TOTAL', `runtime.modes.${mode}`, 'Kontext und None ergeben nicht die Node-Anzahl.'));

      for (const [nodeId, result] of contextEntries) {
        const location = `runtime.modes.${mode}.contexts.${nodeId}`;
        if (knownNodeIds && !knownNodeIds.has(nodeId)) issues.push(issue('UNKNOWN_NODE', location, `Unbekannte Node-ID ${nodeId}.`));
        if (!STATUSES.has(result?.status) || result.status === 'none') issues.push(issue('CONTEXT_STATUS', location, 'Ein gespeicherter Kontext muss direct oder related sein.'));
        if (!SUBTYPES.has(result?.subtype) || result.subtype === 'none') issues.push(issue('CONTEXT_SUBTYPE', location, 'Ein gespeicherter Kontext benötigt einen gültigen Subtype.'));
        if (result?.automatic_open !== false) issues.push(issue('CONTEXT_AUTO_OPEN', location, 'Automatisches Öffnen ist nicht erlaubt.'));
        if (result?.requires_selection !== true) issues.push(issue('CONTEXT_SELECTION', location, 'Jeder Kontext erfordert eine bewusste Auswahl.'));
        if (result?.provenance?.origin_node_id !== nodeId) issues.push(issue('CONTEXT_ORIGIN', location, 'Die Herkunft verweist nicht auf den Ursprungsknoten.'));
        const candidates = list(result?.candidates);
        if (!candidates.length) issues.push(issue('CANDIDATE_COUNT', location, 'Ein gespeicherter Kontext benötigt mindestens einen Kandidaten.'));
        const seen = new Set();
        for (const candidate of candidates) {
          if (!candidate.candidate_id || seen.has(candidate.candidate_id)) issues.push(issue('CANDIDATE_ID', location, 'Kandidaten-ID fehlt oder ist doppelt.'));
          seen.add(candidate.candidate_id);
          if (mode === 'architecture' && scenarioIds && !scenarioIds.has(candidate.candidate_id)) issues.push(issue('UNKNOWN_SCENARIO', location, `Unbekanntes Szenario ${candidate.candidate_id}.`));
          if (mode === 'learning' && learningStepIds && !learningStepIds.has(candidate.candidate_id)) issues.push(issue('UNKNOWN_LEARNING_STEP', location, `Unbekannter Lernschritt ${candidate.candidate_id}.`));
          if (result.subtype === 'indirect_parent_context' && result.provenance?.donor_resolution === 'related' && !candidate.allowlist_reason) {
            issues.push(issue('MISSING_ALLOWLIST_REASON', location, `Related-Spender-Kandidat ${candidate.candidate_id} ist nicht begründet.`));
          }
        }
      }
    }
    return { valid: issues.length === 0, issues };
  }

  function queryForcesOff(queryString, feature) {
    if (feature?.allow_query_force_disable !== true) return false;
    const raw = String(queryString || '').replace(/^\?/, '');
    return new URLSearchParams(raw).get('phase3') === 'off';
  }

  function featureDecision(featureRuntime, runtime, options) {
    const feature = featureRuntime?.features?.cross_mode_context;
    const featureSchemaValid = featureRuntime?.schema_version === EXPECTED_FEATURE_SCHEMA;
    const runtimeValidation = validatePhase3Runtime(runtime, options);
    const forcedOff = queryForcesOff(options?.queryString, feature);
    const enabled = featureSchemaValid
      && feature?.enabled === true
      && feature?.fail_closed === true
      && feature?.allow_query_force_enable === false
      && !forcedOff
      && runtimeValidation.valid;
    return {
      enabled,
      forced_off: forcedOff,
      feature_schema_valid: featureSchemaValid,
      runtime_validation: runtimeValidation,
      fallback: feature?.fallback || 'v3.2-direct-maps'
    };
  }

  function fallbackCandidates(nodeId, mode, config) {
    const source = mode === 'architecture' ? config.scenariosByNode : config.stepsByNode;
    const values = source instanceof Map ? list(source.get(nodeId)) : list(source?.[nodeId]);
    return values.map((value) => mode === 'architecture' ? {
      candidate_id: value.id,
      candidate_type: 'scenario',
      title: value.title
    } : {
      candidate_id: value.id,
      candidate_type: 'learning_step',
      title: value.title,
      learning_path_id: value.path_id
    });
  }

  function noneResult(nodeId, mode, engine, decision) {
    return {
      node_id: nodeId,
      mode,
      status: 'none',
      subtype: 'none',
      candidates: [],
      provenance: { origin_node_id: nodeId },
      requires_selection: false,
      automatic_open: false,
      engine,
      ...(decision ? { feature_decision: clone(decision) } : {})
    };
  }

  function normalizeStoredResult(nodeId, mode, stored, decision) {
    if (!stored) return noneResult(nodeId, mode, 'phase3', decision);
    return {
      node_id: nodeId,
      mode,
      status: stored.status,
      subtype: stored.subtype,
      candidates: clone(stored.candidates),
      provenance: clone(stored.provenance),
      requires_selection: true,
      automatic_open: false,
      engine: 'phase3',
      feature_decision: clone(decision)
    };
  }

  function normalizeFallback(nodeId, mode, config, decision) {
    const candidates = fallbackCandidates(nodeId, mode, config);
    if (!candidates.length) return noneResult(nodeId, mode, 'v3.2-fallback', decision);
    return {
      node_id: nodeId,
      mode,
      status: 'direct',
      subtype: 'direct',
      candidates,
      provenance: { origin_node_id: nodeId, source: 'v3.2-direct-maps' },
      requires_selection: candidates.length > 0,
      automatic_open: false,
      engine: 'v3.2-fallback',
      feature_decision: clone(decision)
    };
  }

  function createResolver(config) {
    const options = config || {};
    const decision = featureDecision(options.featureRuntime, options.runtime, {
      knownNodeIds: options.knownNodeIds,
      scenarioIds: options.scenarioIds,
      learningStepIds: options.learningStepIds,
      queryString: options.queryString
    });

    function resolve(nodeId, mode) {
      if (!MODES.has(mode)) throw new Error(`Unbekannter Cross-Mode: ${String(mode)}`);
      const known = toSet(options.knownNodeIds);
      if (known && !known.has(nodeId)) return noneResult(nodeId, mode, decision.enabled ? 'phase3' : 'v3.2-fallback', decision);
      if (!decision.enabled) return normalizeFallback(nodeId, mode, options, decision);
      const stored = options.runtime.modes[mode].contexts[nodeId];
      return normalizeStoredResult(nodeId, mode, stored, decision);
    }

    return Object.freeze({
      enabled: decision.enabled,
      decision: clone(decision),
      resolve
    });
  }

  return Object.freeze({
    createResolver,
    validatePhase3Runtime,
    featureDecision,
    constants: Object.freeze({
      runtime_schema: EXPECTED_RUNTIME_SCHEMA,
      feature_schema: EXPECTED_FEATURE_SCHEMA,
      modes: Object.freeze([...MODES])
    })
  });
});
