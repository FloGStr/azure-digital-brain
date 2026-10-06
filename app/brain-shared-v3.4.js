(function (root) {
  'use strict';
  const model = root.AZURE_BRAIN_MODEL_V34;
  if (!model || model.release !== '3.4') return;
  const entityById = new Map(model.entities.map(entity => [entity.id, entity]));
  const domainById = new Map(model.domains.map(domain => [domain.id, domain]));
  const domainByName = new Map(model.domains.map(domain => [domain.name, domain]));
  const canonicalById = new Map((root.AZURE_DIGITAL_BRAIN?.nodes || []).map(node => [node.id, node]));
  const normalizeText = value => String(value ?? '').normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('de').trim();
  const storageKey = 'azure-brain-v3.4-semantic-state';
  const deriveSubgraph = centerId => {
    const center = entityById.get(centerId);
    if (!center) return { mode: 'overview', nodeIds: model.entities.map(entity => entity.id), relationIds: model.relations.map(relation => relation.id), firstHopIds: [] };
    const include = new Set([centerId]), firstHop = new Set();
    if (center.kind === 'domain') {
      for (const entity of model.entities) if (entity.domain === center.domain) { include.add(entity.id); if (entity.id !== centerId) firstHop.add(entity.id); }
      const domainMembers = new Set(include);
      for (const relation of model.relations) {
        if (domainMembers.has(relation.source)) include.add(relation.target);
        if (domainMembers.has(relation.target)) include.add(relation.source);
      }
    } else {
      for (const entity of model.entities) if (entity.parentId === centerId || entity.id === center.parentId) { include.add(entity.id); firstHop.add(entity.id); }
      const domain = domainByName.get(center.domain);
      if (domain) { include.add(domain.id); firstHop.add(domain.id); }
      for (const relation of model.relations) if (relation.source === centerId || relation.target === centerId) {
        const id = relation.source === centerId ? relation.target : relation.source;
        include.add(id); firstHop.add(id);
      }
      const direct = new Set(include);
      for (const relation of model.relations) {
        if (include.size >= 64) break;
        if (direct.has(relation.source) || direct.has(relation.target)) { include.add(relation.source); include.add(relation.target); }
      }
    }
    return { mode: center.kind === 'domain' ? 'domain' : 'canonical', nodeIds: [...include], relationIds: model.relations.filter(relation => include.has(relation.source) && include.has(relation.target)).map(relation => relation.id), firstHopIds: [...firstHop] };
  };
  const empty = () => ({ selectedEntityId: null, selectedCanonicalId: null, selectedDomainId: null, contextCenterId: null, contextMode: 'overview', activeSemanticSubgraph: deriveSubgraph(null), detailEntityId: null });
  const normalize = candidate => {
    const next = empty();
    const id = candidate?.selectedEntityId;
    const center = candidate?.contextCenterId;
    const domain = candidate?.selectedDomainId;
    if (entityById.has(id)) {
      const entity = entityById.get(id);
      next.selectedEntityId = id;
      next.selectedCanonicalId = entity.canonicalId;
      next.selectedDomainId = entity.kind === 'domain' ? id : null;
      next.detailEntityId = id;
    } else if (domainById.has(domain)) {
      next.selectedEntityId = domain;
      next.selectedCanonicalId = domain;
      next.selectedDomainId = domain;
      next.detailEntityId = domain;
    }
    if (domainById.has(center)) {
      next.contextMode = 'domain';
      next.contextCenterId = center;
      next.selectedDomainId = center;
    } else if (entityById.has(center)) {
      next.contextMode = 'canonical';
      next.contextCenterId = center;
    } else if (candidate?.contextMode === 'overview') {
      next.contextMode = 'overview';
    } else if (next.selectedDomainId) {
      next.contextMode = 'domain';
      next.contextCenterId = next.selectedDomainId;
    } else if (next.selectedEntityId) {
      next.contextMode = 'canonical';
      next.contextCenterId = next.selectedEntityId;
    }
    next.activeSemanticSubgraph = deriveSubgraph(next.contextCenterId);
    return next;
  };
  const read = () => { try { return JSON.parse(sessionStorage.getItem(storageKey) || 'null'); } catch { return null; } };
  const save = state => { try { sessionStorage.setItem(storageKey, JSON.stringify(state)); } catch {} return state; };
  const fromLocation = () => {
    const query = new URLSearchParams(location.search);
    const hash = new URLSearchParams(location.hash.replace(/^#/, ''));
    const id = query.get('node') || hash.get('node');
    const domain = query.get('domain') || hash.get('domain');
    const center = query.get('center') || hash.get('center');
    const mode = query.get('view') || hash.get('view');
    if (id && entityById.has(id)) return normalize({ selectedEntityId: id, contextCenterId: entityById.has(center) ? center : mode === 'overview' ? null : id, contextMode: mode });
    const target = domainById.get(domain) || domainByName.get(domain);
    if (target) return normalize({ selectedEntityId: target.id, selectedDomainId: target.id, contextCenterId: entityById.has(center) ? center : mode === 'overview' ? null : target.id, contextMode: mode });
    if (mode === 'overview') return empty();
    return null;
  };
  const current = save(fromLocation() || normalize(read()));
  const shared = {
    model, entityById, canonicalById, domainById, domainByName,
    state: current,
    select(id, focus = false) {
      if (!entityById.has(id)) return false;
      const entity = entityById.get(id);
      const center = focus ? id : this.state.contextCenterId;
      const next = normalize({ selectedEntityId: id, contextCenterId: center, selectedDomainId: entity.kind === 'domain' ? id : null, contextMode: center ? undefined : 'overview' });
      Object.assign(this.state, save(next));
      return true;
    },
    focus(id) { return this.select(id, true); },
    overview() { Object.assign(this.state, save(empty())); },
    urlFor(renderer) {
      const base = 'index.html#mode=brain&renderer=' + (renderer === '3d' ? '3d' : '2d');
      const id = this.state.selectedEntityId;
      if (!id) return base + '&view=overview';
      const key = entityById.get(id)?.kind === 'domain' ? 'domain' : 'node';
      const center = this.state.contextCenterId;
      return base + '&' + key + '=' + encodeURIComponent(id) + (center ? '&center=' + encodeURIComponent(center) : '&view=overview');
    },
    semanticEdges(ids) { const included = new Set(ids); return model.relations.filter(relation => included.has(relation.source) && included.has(relation.target)); },
    subgraph(centerId = this.state.contextCenterId) { return deriveSubgraph(centerId); },
    domainEntities(domainId) { const domain = domainById.get(domainId); return domain ? model.entities.filter(entity => entity.domain === domain.name) : []; },
    search(query, limit = 30) {
      const term = normalizeText(query);
      if (!term) return [];
      const tokens = term.split(/\s+/);
      return model.entities.map(entity => {
        const canonical = canonicalById.get(entity.id);
        const title = normalizeText(entity.title);
        const acronym = title.match(/\(([^)]+)\)/)?.[1] || '';
        const aliases = (canonical?.aliases || entity.aliases || []).map(alias => normalizeText(typeof alias === 'string' ? alias : alias?.text || alias?.title || alias?.name)).filter(Boolean);
        let score = entity.id === term ? 2000 : title === term ? 1800 : aliases.includes(term) ? 1600 : title.startsWith(term) ? 1300 : aliases.some(alias => alias.startsWith(term)) ? 1100 : tokens.every(token => title.includes(token)) ? 900 : aliases.some(alias => tokens.every(token => alias.includes(token))) ? 700 : 0;
        if (acronym === term) score = Math.max(score, 1550);
        else if (acronym.startsWith(term)) score = Math.max(score, 1450 - acronym.length);
        if (score && entity.kind === 'canonical') score += 100;
        return { entity, score };
      }).filter(result => result.score).sort((a, b) => b.score - a.score || a.entity.title.localeCompare(b.entity.title, 'de')).slice(0, limit).map(result => result.entity);
    },
    detail(id) { const entity = entityById.get(id); return entity ? { ...canonicalById.get(id), ...entity } : null; }
  };
  root.AZURE_BRAIN_SHARED_V34 = shared;
})(window);
