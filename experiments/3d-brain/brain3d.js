(function () {
  'use strict';

  const DATA = window.AZURE_DIGITAL_BRAIN;
  const THREE = window.THREE;
  const MAX_CONTEXT_NODES = 64;
  const VISUAL_NEURON_COUNT = 960;
  const DEFAULT_FOCUS_ID = 'azure-0322';
  const ANIMATION_CONFIG = Object.freeze({
    autoRotationSecondsPerTurn: 180,
    interactionResumeDelayMs: 1400,
    interactionResumeEaseMs: 2400,
    clusterPulseAmplitude: 0.018,
    clusterPulsePeriodMs: 7600,
    signalPoolSize: 4,
    signalSpawnIntervalMs: 1900,
    signalDurationMs: 6400,
    mobileFrameIntervalMs: 1000 / 30,
    desktopFrameIntervalMs: 1000 / 60
  });
  const CLUSTER_DEFINITIONS = Object.freeze([
    { id: 'compute', label: 'Compute', symbol: '◇', categories: ['Compute'], color: '#52c7ff' },
    { id: 'networking', label: 'Networking', symbol: '⌬', categories: ['Networking'], color: '#43d7ef' },
    { id: 'storage', label: 'Storage', symbol: '▤', categories: ['Storage'], color: '#7bd66d' },
    { id: 'identity-security', label: 'Identity & Security', symbol: '⬡', categories: ['Identity', 'Security'], color: '#a889ff' },
    { id: 'databases', label: 'Databases', symbol: '◫', categories: ['Databases'], color: '#ff9c54' },
    { id: 'management-governance', label: 'Management & Governance', symbol: '⌁', categories: ['Governance', 'Monitoring', 'Cost & Lifecycle'], color: '#ff6f91' },
    { id: 'architecture-foundations', label: 'Architecture & Foundations', symbol: '△', categories: ['Architecture', 'Azure Fundamentals'], color: '#f3ce58' }
  ]);
  const COLORS = {
    'Architecture': '#f3ce58',
    'Azure Fundamentals': '#f3ce58',
    'Compute': '#52c7ff',
    'Cost & Lifecycle': '#ff6f91',
    'Databases': '#ff9c54',
    'Governance': '#ff6f91',
    'Identity': '#a889ff',
    'Monitoring': '#ff6f91',
    'Networking': '#43d7ef',
    'Security': '#a889ff',
    'Storage': '#7bd66d'
  };

  const element = (id) => document.getElementById(id);
  const dom = {
    stage: element('stage'),
    canvas: element('brain3dCanvas'),
    labels: element('labelLayer'),
    tooltip: element('graphTooltip'),
    fallback: element('fallback'),
    focusSelect: element('focusSelect'),
    fit: element('fitView'),
    zoomIn: element('zoomIn'),
    zoomOut: element('zoomOut'),
    renderStatus: element('renderStatus'),
    contextStatus: element('contextStatus'),
    category: element('detailCategory'),
    title: element('detailTitle'),
    id: element('detailId'),
    path: element('detailPath'),
    summary: element('detailSummary'),
    relations: element('relationList'),
    focusSelected: element('focusSelected'),
    detailHandoff: element('openDetailPanel')
  };

  if (!DATA?.nodes?.length || !Array.isArray(DATA.relations) || !THREE?.WebGLRenderer) {
    dom.fallback.hidden = false;
    dom.renderStatus.textContent = 'Runtime oder Three.js fehlt';
    document.documentElement.dataset.pocReady = 'error';
    return;
  }

  const nodes = DATA.nodes;
  const relations = DATA.relations;
  const relationTypes = DATA.relation_types || [];
  const nodeById = new Map(nodes.map((node) => [node.id, node]));
  const requestedFocusId = new URLSearchParams(window.location.search).get('node');
  const relationTypeById = new Map(relationTypes.map((type) => [type.id, type]));
  const relationsByNode = new Map(nodes.map((node) => [node.id, []]));
  for (const relation of relations) {
    relationsByNode.get(relation.source)?.push(relation);
    relationsByNode.get(relation.target)?.push(relation);
  }

  const state = {
    focusId: nodeById.has(requestedFocusId) ? requestedFocusId : nodeById.has(DEFAULT_FOCUS_ID) ? DEFAULT_FOCUS_ID : nodes[0].id,
    selectedId: null,
    context: null,
    yaw: 0.62,
    pitch: 0.28,
    distance: 235,
    pointers: new Map(),
    pointerStart: null,
    pinchDistance: null,
    renderer: null,
    scene: null,
    modelGroup: null,
    camera: null,
    raycaster: new THREE.Raycaster(),
    pointerNdc: new THREE.Vector2(),
    nodeMeshes: [],
    clusterHubs: [],
    signalPool: [],
    signalEdges: [],
    signalCursor: 0,
    visualNeuronCount: 0,
    visualFilamentCount: 0,
    selectedRing: null,
    glowTexture: null,
    dirty: true,
    renderScheduled: false,
    renderCount: 0,
    worldPosition: new THREE.Vector3(),
    reducedMotion: window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || false,
    animation: {
      running: false,
      frameRequest: null,
      lastFrameAt: 0,
      lastLabelAt: 0,
      lastDiagnosticsAt: 0,
      lastSignalAt: 0,
      lastInteractionAt: -Infinity,
      interacting: false,
      rotationVelocity: 0,
      modelRotation: 0,
      activeSignals: 0
    }
  };

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, (character) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[character]);
  }

  function otherNodeId(relation, id) {
    return relation.source === id ? relation.target : relation.source;
  }

  function relationLabel(relation) {
    return relationTypeById.get(relation.type)?.label || relation.type || 'verknüpft';
  }

  function nodePath(node) {
    const path = [node];
    const seen = new Set([node.id]);
    let current = node;
    while (current?.parent && nodeById.has(current.parent) && !seen.has(current.parent)) {
      current = nodeById.get(current.parent);
      seen.add(current.id);
      path.unshift(current);
    }
    return path.map((item) => item.title).join(' › ');
  }

  function nodeImportance(node) {
    const degree = relationsByNode.get(node.id)?.length || 0;
    const contentWeight = Number(Boolean(node.content?.simple || node.content?.technical || node.content?.architecture));
    return degree * 5 + contentWeight + Math.max(0, 10 - Number(node.depth || 10));
  }

  function buildContext(focusId, maxNodes = MAX_CONTEXT_NODES) {
    const include = new Set([focusId]);
    const hops = new Map([[focusId, 0]]);
    const donor = new Map();
    const directRelations = [...(relationsByNode.get(focusId) || [])]
      .sort((a, b) => nodeImportance(nodeById.get(otherNodeId(b, focusId))) - nodeImportance(nodeById.get(otherNodeId(a, focusId))));

    for (const relation of directRelations) {
      if (include.size >= maxNodes) break;
      const candidateId = otherNodeId(relation, focusId);
      if (!nodeById.has(candidateId)) continue;
      include.add(candidateId);
      hops.set(candidateId, 1);
      donor.set(candidateId, focusId);
    }

    const firstHop = [...include].filter((id) => hops.get(id) === 1)
      .sort((a, b) => nodeImportance(nodeById.get(b)) - nodeImportance(nodeById.get(a)));
    for (const firstHopId of firstHop) {
      for (const relation of relationsByNode.get(firstHopId) || []) {
        if (include.size >= maxNodes) break;
        const candidateId = otherNodeId(relation, firstHopId);
        if (!nodeById.has(candidateId) || include.has(candidateId)) continue;
        include.add(candidateId);
        hops.set(candidateId, 2);
        donor.set(candidateId, firstHopId);
      }
      if (include.size >= maxNodes) break;
    }

    const contextNodes = [...include].map((id) => ({
      ...nodeById.get(id),
      hop: hops.get(id) ?? 2,
      donorId: donor.get(id) || null
    }));
    const contextEdges = relations.filter((relation) => include.has(relation.source) && include.has(relation.target));
    return { focusId, nodes: contextNodes, edges: contextEdges, include, hops, donor };
  }

  function hashUnit(value) {
    let hash = 2166136261;
    for (let index = 0; index < value.length; index += 1) {
      hash ^= value.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0) / 4294967295;
  }

  function fibonacciPosition(index, total, radius, seed) {
    const offset = 2 / Math.max(total, 1);
    const y = (index * offset - 1) + offset / 2;
    const radial = Math.sqrt(Math.max(0, 1 - y * y));
    const angle = index * Math.PI * (3 - Math.sqrt(5)) + hashUnit(seed) * 0.55;
    return new THREE.Vector3(Math.cos(angle) * radial * radius, y * radius, Math.sin(angle) * radial * radius);
  }

  function clusterForNode(node) {
    return CLUSTER_DEFINITIONS.find((definition) => definition.categories.includes(node.category)) || null;
  }

  function layoutContext(context) {
    const positions = new Map([[context.focusId, new THREE.Vector3(0, 0, 0)]]);
    const activeDefinitions = CLUSTER_DEFINITIONS.filter((definition) => context.nodes.some((node) => definition.categories.includes(node.category)));
    const groups = new Map(activeDefinitions.map((definition) => [definition.id, []]));
    const ungrouped = [];
    for (const node of context.nodes.filter((candidate) => candidate.id !== context.focusId)) {
      const definition = clusterForNode(node);
      if (definition && groups.has(definition.id)) groups.get(definition.id).push(node);
      else ungrouped.push(node);
    }

    activeDefinitions.forEach((definition, definitionIndex) => {
      const members = groups.get(definition.id).sort((a, b) => (a.hop - b.hop) || a.id.localeCompare(b.id));
      if (!members.length) return;
      const direction = fibonacciPosition(definitionIndex, activeDefinitions.length, 1, definition.id).normalize();
      const referenceAxis = Math.abs(direction.y) > 0.86 ? new THREE.Vector3(1, 0, 0) : new THREE.Vector3(0, 1, 0);
      const tangent = new THREE.Vector3().crossVectors(direction, referenceAxis).normalize();
      const bitangent = new THREE.Vector3().crossVectors(direction, tangent).normalize();
      members.forEach((node, index) => {
        const distribution = Math.sqrt((index + 0.55) / members.length);
        const angle = index * Math.PI * (3 - Math.sqrt(5)) + hashUnit(`${definition.id}-${node.id}`) * 0.85;
        const lateralRadius = (10 + distribution * 27) * (node.hop === 1 ? 0.82 : 1);
        const radialJitter = (hashUnit(`depth-${node.id}`) - 0.5) * 16;
        const radialDistance = (node.hop === 1 ? 67 : 78) + radialJitter;
        const position = direction.clone().multiplyScalar(radialDistance)
          .addScaledVector(tangent, Math.cos(angle) * lateralRadius)
          .addScaledVector(bitangent, Math.sin(angle) * lateralRadius);
        positions.set(node.id, position);
      });
    });

    ungrouped.sort((a, b) => a.id.localeCompare(b.id)).forEach((node, index) => {
      positions.set(node.id, fibonacciPosition(index, ungrouped.length, node.hop === 1 ? 68 : 86, node.id));
    });

    for (const node of context.nodes.filter((candidate) => candidate.hop === 2 && candidate.donorId !== context.focusId)) {
      const position = positions.get(node.id);
      const donorPosition = positions.get(node.donorId);
      if (position && donorPosition && clusterForNode(node)?.id === clusterForNode(nodeById.get(node.donorId))?.id) {
        position.lerp(donorPosition, 0.1);
      }
    }
    return positions;
  }

  function colorForNode(node) {
    return COLORS[node.category] || '#8aa2b5';
  }

  function edgeColor(relation) {
    return relationTypeById.get(relation.type)?.color || '#4b6f87';
  }

  function blendedEdgeColor(relation) {
    const source = nodeById.get(relation.source);
    const target = nodeById.get(relation.target);
    if (!source || !target) return new THREE.Color(edgeColor(relation));
    return new THREE.Color(colorForNode(source)).lerp(new THREE.Color(colorForNode(target)), 0.5);
  }

  function relationCurveControl(source, target, relationId) {
    const midpoint = source.clone().lerp(target, 0.5);
    const chord = target.clone().sub(source);
    const axis = Math.abs(chord.y) > Math.abs(chord.x) ? new THREE.Vector3(1, 0, 0) : new THREE.Vector3(0, 1, 0);
    const perpendicular = new THREE.Vector3().crossVectors(chord, axis).normalize();
    const direction = hashUnit(`curve-${relationId}`) > 0.5 ? 1 : -1;
    const curvature = Math.min(10, chord.length() * 0.075) * direction;
    return midpoint.addScaledVector(perpendicular, curvature).multiplyScalar(0.96);
  }

  function quadraticPoint(source, control, target, progress, destination) {
    const inverse = 1 - progress;
    return destination.copy(source).multiplyScalar(inverse * inverse)
      .addScaledVector(control, 2 * inverse * progress)
      .addScaledVector(target, progress * progress);
  }

  function clearScene() {
    if (!state.modelGroup) return;
    const geometries = new Set();
    const materials = new Set();
    state.modelGroup.traverse((object) => {
      if (object.geometry) geometries.add(object.geometry);
      if (Array.isArray(object.material)) object.material.forEach((material) => materials.add(material));
      else if (object.material) materials.add(object.material);
    });
    state.modelGroup.clear();
    geometries.forEach((geometry) => geometry.dispose());
    materials.forEach((material) => material.dispose());
    state.nodeMeshes = [];
    state.clusterHubs = [];
    state.signalPool = [];
    state.signalEdges = [];
    state.signalCursor = 0;
    state.visualNeuronCount = 0;
    state.visualFilamentCount = 0;
    state.selectedRing = null;
    dom.labels.replaceChildren();
  }

  function createStarField() {
    const positions = [];
    for (let index = 0; index < 420; index += 1) {
      const radius = 300 + hashUnit(`star-r-${index}`) * 400;
      const point = fibonacciPosition(index, 420, radius, `star-${index}`);
      positions.push(point.x, point.y, point.z);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({ color: 0x5383a0, size: 0.75, transparent: true, opacity: 0.42, sizeAttenuation: true });
    const stars = new THREE.Points(geometry, material);
    stars.userData.permanent = true;
    state.scene.add(stars);
  }

  function createGlowTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 96;
    canvas.height = 96;
    const context = canvas.getContext('2d');
    const gradient = context.createRadialGradient(48, 48, 0, 48, 48, 48);
    gradient.addColorStop(0, 'rgba(255,255,255,0.92)');
    gradient.addColorStop(0.16, 'rgba(255,255,255,0.42)');
    gradient.addColorStop(0.48, 'rgba(255,255,255,0.10)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, 96, 96);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }

  function createBrainEnvelope() {
    const inner = new THREE.Mesh(
      new THREE.SphereGeometry(106, 40, 28),
      new THREE.MeshBasicMaterial({ color: 0x1f6f9a, transparent: true, opacity: 0.025, side: THREE.BackSide, depthWrite: false })
    );
    inner.scale.set(1.06, 0.95, 1);
    inner.userData.contextObject = true;
    const membrane = new THREE.Mesh(
      new THREE.SphereGeometry(108, 32, 22),
      new THREE.MeshBasicMaterial({ color: 0x4ebde8, transparent: true, opacity: 0.032, wireframe: true, blending: THREE.AdditiveBlending, depthWrite: false })
    );
    membrane.scale.copy(inner.scale);
    membrane.userData.contextObject = true;
    state.modelGroup.add(inner, membrane);
  }

  function createVisualNeurons(context, positions) {
    const activeDefinitions = CLUSTER_DEFINITIONS.filter((definition) => context.nodes.some((node) => definition.categories.includes(node.category)));
    if (!activeDefinitions.length) return;
    const clusterEntries = activeDefinitions.map((definition, definitionIndex) => {
      const members = context.nodes.filter((node) => definition.categories.includes(node.category) && positions.has(node.id));
      const centroid = new THREE.Vector3();
      for (const member of members) centroid.add(positions.get(member.id));
      if (members.length) centroid.divideScalar(members.length);
      const direction = centroid.length() > 8
        ? centroid.normalize()
        : fibonacciPosition(definitionIndex, activeDefinitions.length, 1, definition.id).normalize();
      return { definition, members, direction, points: [], count: 0 };
    });
    const totalWeight = clusterEntries.reduce((sum, entry) => sum + Math.max(2, entry.members.length), 0);
    let allocated = 0;
    clusterEntries.forEach((entry) => {
      entry.count = Math.floor(VISUAL_NEURON_COUNT * Math.max(2, entry.members.length) / totalWeight);
      allocated += entry.count;
    });
    for (let remainder = VISUAL_NEURON_COUNT - allocated, index = 0; remainder > 0; remainder -= 1, index += 1) {
      clusterEntries[index % clusterEntries.length].count += 1;
    }

    const particlePositions = [];
    const particleColors = [];
    for (const entry of clusterEntries) {
      const direction = entry.direction;
      const referenceAxis = Math.abs(direction.y) > 0.86 ? new THREE.Vector3(1, 0, 0) : new THREE.Vector3(0, 1, 0);
      const tangent = new THREE.Vector3().crossVectors(direction, referenceAxis).normalize();
      const bitangent = new THREE.Vector3().crossVectors(direction, tangent).normalize();
      const baseColor = new THREE.Color(entry.definition.color);
      for (let index = 0; index < entry.count; index += 1) {
        const seed = `${entry.definition.id}-visual-${index}`;
        const angle = index * Math.PI * (3 - Math.sqrt(5)) + hashUnit(seed) * 0.9;
        const spread = 0.12 + Math.sqrt((index + 0.5) / entry.count) * 0.48;
        const localDirection = direction.clone()
          .addScaledVector(tangent, Math.cos(angle) * spread)
          .addScaledVector(bitangent, Math.sin(angle) * spread)
          .normalize();
        const volume = Math.pow(hashUnit(`volume-${seed}`), 0.42);
        const radius = 54 + volume * 51 + (hashUnit(`surface-${seed}`) - 0.5) * 4;
        const point = localDirection.multiplyScalar(Math.min(106, radius));
        entry.points.push(point);
        particlePositions.push(point.x, point.y, point.z);
        const luminance = 0.64 + hashUnit(`light-${seed}`) * 0.34;
        const color = baseColor.clone().lerp(new THREE.Color(0xdff7ff), hashUnit(`tint-${seed}`) * 0.16).multiplyScalar(luminance);
        particleColors.push(color.r, color.g, color.b);
      }
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.Float32BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('color', new THREE.Float32BufferAttribute(particleColors, 3));
    const neurons = new THREE.Points(
      particleGeometry,
      new THREE.PointsMaterial({
        vertexColors: true,
        size: 1.35,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.72,
        depthWrite: false,
        fog: true
      })
    );
    neurons.renderOrder = -1;
    neurons.userData.contextObject = true;
    const neuronGlow = new THREE.Points(
      particleGeometry,
      new THREE.PointsMaterial({
        vertexColors: true,
        size: 3.8,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.085,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        fog: true
      })
    );
    neuronGlow.renderOrder = -2;
    neuronGlow.userData.contextObject = true;

    const filamentPositions = [];
    const filamentColors = [];
    for (const entry of clusterEntries) {
      const color = new THREE.Color(entry.definition.color).multiplyScalar(0.72);
      for (let index = 0; index < entry.points.length; index += 4) {
        const source = entry.points[index];
        let target = null;
        let bestDistance = Infinity;
        for (let offset = 3; offset <= 14; offset += 1) {
          const candidate = entry.points[(index + offset) % entry.points.length];
          const distance = source.distanceToSquared(candidate);
          if (distance < bestDistance) {
            bestDistance = distance;
            target = candidate;
          }
        }
        if (!target || bestDistance > 1050) continue;
        filamentPositions.push(source.x, source.y, source.z, target.x, target.y, target.z);
        filamentColors.push(color.r, color.g, color.b, color.r, color.g, color.b);
      }
    }
    const filamentGeometry = new THREE.BufferGeometry();
    filamentGeometry.setAttribute('position', new THREE.Float32BufferAttribute(filamentPositions, 3));
    filamentGeometry.setAttribute('color', new THREE.Float32BufferAttribute(filamentColors, 3));
    const filaments = new THREE.LineSegments(
      filamentGeometry,
      new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.11,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        fog: true
      })
    );
    filaments.renderOrder = -1;
    filaments.userData.contextObject = true;
    state.visualNeuronCount = particlePositions.length / 3;
    state.visualFilamentCount = filamentPositions.length / 6;
    state.modelGroup.add(neuronGlow, neurons, filaments);
  }

  function createEdgeSegments(context, positions) {
    const vertices = [];
    const colors = [];
    for (const relation of context.edges) {
      const source = positions.get(relation.source);
      const target = positions.get(relation.target);
      if (!source || !target) continue;
      const control = relationCurveControl(source, target, relation.id);
      const color = blendedEdgeColor(relation);
      const next = new THREE.Vector3();
      let previous = source;
      for (let segment = 1; segment <= 6; segment += 1) {
        quadraticPoint(source, control, target, segment / 6, next);
        vertices.push(previous.x, previous.y, previous.z, next.x, next.y, next.z);
        const fade = 0.72 + segment / 22;
        colors.push(color.r * fade, color.g * fade, color.b * fade, color.r, color.g, color.b);
        previous = next.clone();
      }
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    const material = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.27, depthWrite: false });
    const lines = new THREE.LineSegments(geometry, material);
    lines.userData.contextObject = true;
    const glow = new THREE.LineSegments(
      geometry.clone(),
      new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.075, blending: THREE.AdditiveBlending, depthWrite: false })
    );
    glow.userData.contextObject = true;
    state.modelGroup.add(lines, glow);
  }

  function createRealNodeHalos(context, positions) {
    const haloPositions = [];
    const haloColors = [];
    for (const node of context.nodes) {
      const position = positions.get(node.id);
      if (!position) continue;
      const color = new THREE.Color(colorForNode(node)).lerp(new THREE.Color(0xdff8ff), node.hop === 0 ? 0.34 : 0.16);
      haloPositions.push(position.x, position.y, position.z);
      haloColors.push(color.r, color.g, color.b);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(haloPositions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(haloColors, 3));
    const halos = new THREE.Points(
      geometry,
      new THREE.PointsMaterial({
        vertexColors: true,
        size: 8.5,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.18,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        fog: true
      })
    );
    halos.userData.contextObject = true;
    state.modelGroup.add(halos);
  }

  function createNodeMesh(node, position) {
    const radius = node.hop === 0 ? 4.9 : node.hop === 1 ? 2.35 : 1.55;
    const geometry = new THREE.SphereGeometry(radius, node.hop === 0 ? 28 : 18, node.hop === 0 ? 20 : 12);
    const material = new THREE.MeshStandardMaterial({
      color: colorForNode(node),
      emissive: colorForNode(node),
      emissiveIntensity: node.hop === 0 ? 0.78 : node.hop === 1 ? 0.48 : 0.26,
      roughness: 0.38,
      metalness: 0.08,
      transparent: true,
      opacity: node.hop === 2 ? 0.78 : 0.96,
      depthWrite: node.hop !== 2
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.copy(position);
    mesh.userData = {
      nodeId: node.id,
      hop: node.hop,
      radius,
      contextObject: true,
      baseOpacity: material.opacity,
      baseEmissiveIntensity: material.emissiveIntensity
    };
    state.modelGroup.add(mesh);
    state.nodeMeshes.push(mesh);
    return mesh;
  }

  function createClusterHubs(context, positions) {
    for (const [definitionIndex, definition] of CLUSTER_DEFINITIONS.entries()) {
      const members = context.nodes.filter((node) => definition.categories.includes(node.category) && positions.has(node.id));
      if (members.length < 2) continue;
      const centroid = new THREE.Vector3();
      let averageRadius = 0;
      for (const member of members) {
        centroid.add(positions.get(member.id));
        averageRadius += positions.get(member.id).length();
      }
      centroid.divideScalar(members.length);
      averageRadius /= members.length;
      const hubRadius = Math.max(58, Math.min(92, averageRadius * 0.74));
      if (centroid.length() < 8) centroid.copy(fibonacciPosition(definitionIndex, CLUSTER_DEFINITIONS.length, hubRadius, definition.id));
      else centroid.normalize().multiplyScalar(hubRadius);

      const group = new THREE.Group();
      group.position.copy(centroid);
      group.userData = { clusterId: definition.id, contextObject: true };
      const core = new THREE.Mesh(
        new THREE.SphereGeometry(4.8, 20, 14),
        new THREE.MeshBasicMaterial({
          color: definition.color,
          transparent: true,
          opacity: 0.23,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        })
      );
      const halo = new THREE.Mesh(
        new THREE.SphereGeometry(7.8, 20, 14),
        new THREE.MeshBasicMaterial({
          color: definition.color,
          transparent: true,
          opacity: 0.13,
          wireframe: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        })
      );
      const aura = new THREE.Sprite(new THREE.SpriteMaterial({
        map: state.glowTexture,
        color: definition.color,
        transparent: true,
        opacity: 0.17,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        depthTest: true
      }));
      aura.scale.set(34, 34, 1);
      group.add(aura, core, halo);
      state.modelGroup.add(group);

      const label = document.createElement('div');
      label.className = 'cluster-label';
      label.dataset.clusterId = definition.id;
      label.style.setProperty('--cluster-color', definition.color);
      label.innerHTML = `<i aria-hidden="true">${escapeHtml(definition.symbol)}</i><b>${escapeHtml(definition.label)}</b><span>${members.length} Knoten</span>`;
      dom.labels.append(label);
      state.clusterHubs.push({
        id: definition.id,
        group,
        label,
        phase: hashUnit(definition.id) * Math.PI * 2,
        aura,
        core,
        halo
      });
    }
  }

  function createSignalPool(context, positions) {
    state.signalEdges = context.edges.map((relation) => ({
      relationId: relation.id,
      source: positions.get(relation.source)?.clone(),
      target: positions.get(relation.target)?.clone(),
      control: positions.get(relation.source) && positions.get(relation.target)
        ? relationCurveControl(positions.get(relation.source), positions.get(relation.target), relation.id)
        : null,
      color: `#${blendedEdgeColor(relation).getHexString()}`
    })).filter((edge) => edge.source && edge.target && edge.control);
    if (!state.signalEdges.length) return;

    const coreGeometry = new THREE.SphereGeometry(1.15, 10, 8);
    const glowGeometry = new THREE.SphereGeometry(2.7, 10, 8);
    for (let index = 0; index < ANIMATION_CONFIG.signalPoolSize; index += 1) {
      const group = new THREE.Group();
      const coreMaterial = new THREE.MeshBasicMaterial({
        color: 0x8eeaff,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0x52bfff,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      const core = new THREE.Mesh(coreGeometry, coreMaterial);
      const glow = new THREE.Mesh(glowGeometry, glowMaterial);
      const trails = [0, 1].map((trailIndex) => {
        const trailMaterial = new THREE.MeshBasicMaterial({
          color: 0x52bfff,
          transparent: true,
          opacity: 0,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        });
        const trail = new THREE.Mesh(new THREE.SphereGeometry(0.82 - trailIndex * 0.2, 8, 6), trailMaterial);
        group.add(trail);
        return { mesh: trail, material: trailMaterial, lag: 0.025 + trailIndex * 0.026 };
      });
      group.add(glow, core);
      group.visible = false;
      group.userData.signal = { active: false, core, glow, trails, coreMaterial, glowMaterial, edge: null, startedAt: 0, durationMs: 0 };
      state.modelGroup.add(group);
      state.signalPool.push(group);
    }
  }

  function createLabel(node, className) {
    const label = document.createElement('div');
    label.className = `node-label ${className}`;
    label.dataset.nodeId = node.id;
    label.innerHTML = `<b>${escapeHtml(node.title)}</b><code>${escapeHtml(node.id)}</code>`;
    dom.labels.append(label);
    return label;
  }

  function buildScene(focusId) {
    state.focusId = focusId;
    state.selectedId = focusId;
    state.context = buildContext(focusId);
    const positions = layoutContext(state.context);
    clearScene();
    createBrainEnvelope();
    createVisualNeurons(state.context, positions);
    createEdgeSegments(state.context, positions);
    createRealNodeHalos(state.context, positions);
    for (const node of state.context.nodes) createNodeMesh(node, positions.get(node.id));
    createClusterHubs(state.context, positions);
    createSignalPool(state.context, positions);
    createLabel(nodeById.get(focusId), 'focus');
    updateSelection(focusId, false);
    fitView();
    dom.contextStatus.textContent = `${state.context.nodes.length} Wissensknoten · ${state.visualNeuronCount} visuelle Neuronen · ${state.context.edges.length} bestehende Relationen`;
    dom.focusSelect.value = focusId;
    scheduleRender();
  }

  function updateSelection(nodeId, render = true) {
    const node = nodeById.get(nodeId);
    const mesh = state.nodeMeshes.find((candidate) => candidate.userData.nodeId === nodeId);
    if (!node || !mesh) return false;
    state.selectedId = nodeId;
    if (state.selectedRing) {
      state.selectedRing.parent?.remove(state.selectedRing);
      state.selectedRing.geometry.dispose();
      state.selectedRing.material.dispose();
    }
    state.selectedRing = new THREE.Mesh(
      new THREE.SphereGeometry(mesh.userData.radius + 1.8, 22, 16),
      new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.78 })
    );
    state.selectedRing.position.copy(mesh.position);
    state.selectedRing.userData.contextObject = true;
    state.modelGroup.add(state.selectedRing);
    updateDetails(node);
    syncLabels();
    if (render) scheduleRender();
    return true;
  }

  function updateDetails(node) {
    const visibleRelations = state.context.edges.filter((relation) => relation.source === node.id || relation.target === node.id);
    dom.category.textContent = node.category || 'Azure';
    dom.category.style.borderColor = colorForNode(node);
    dom.category.style.color = colorForNode(node);
    dom.title.textContent = node.title;
    dom.id.textContent = node.id;
    dom.path.textContent = nodePath(node);
    dom.summary.textContent = node.content?.simple || node.summary || `${visibleRelations.length} sichtbare Beziehung(en) im aktuellen 3D-Kontext.`;
    dom.focusSelected.disabled = node.id === state.focusId;
    dom.detailHandoff.href = `../../app/index.html#mode=brain&node=${encodeURIComponent(node.id)}`;
    dom.detailHandoff.setAttribute('aria-disabled', 'false');
    if (!visibleRelations.length) {
      dom.relations.innerHTML = '<p class="empty">Keine bestehende Relation im aktuellen Kontext sichtbar.</p>';
      return;
    }
    dom.relations.innerHTML = visibleRelations.map((relation) => {
      const targetId = otherNodeId(relation, node.id);
      const target = nodeById.get(targetId);
      return `<button type="button" data-node-id="${escapeHtml(targetId)}"><span>${escapeHtml(relationLabel(relation))}</span><b>${escapeHtml(target?.title || targetId)}</b><small>${escapeHtml(targetId)}</small></button>`;
    }).join('');
    dom.relations.querySelectorAll('[data-node-id]').forEach((button) => button.addEventListener('click', () => updateSelection(button.dataset.nodeId)));
  }

  function syncLabels() {
    const selected = nodeById.get(state.selectedId);
    const existingSelected = dom.labels.querySelector('.node-label.selected');
    existingSelected?.remove();
    if (selected && selected.id !== state.focusId) createLabel(selected, 'selected');
  }

  function updateProjectedLabels() {
    const rect = dom.canvas.getBoundingClientRect();
    for (const label of dom.labels.querySelectorAll('.node-label')) {
      const mesh = state.nodeMeshes.find((candidate) => candidate.userData.nodeId === label.dataset.nodeId);
      if (!mesh) continue;
      const projected = mesh.getWorldPosition(state.worldPosition).clone().project(state.camera);
      const visible = projected.z > -1 && projected.z < 1;
      label.hidden = !visible;
      if (!visible) continue;
      label.style.left = `${(projected.x * 0.5 + 0.5) * rect.width}px`;
      label.style.top = `${(-projected.y * 0.5 + 0.5) * rect.height}px`;
    }
    for (const hub of state.clusterHubs) {
      const projected = hub.group.getWorldPosition(state.worldPosition).clone().project(state.camera);
      const visible = projected.z > -1 && projected.z < 1;
      hub.label.hidden = !visible;
      if (!visible) continue;
      hub.label.style.left = `${(projected.x * 0.5 + 0.5) * rect.width}px`;
      hub.label.style.top = `${(-projected.y * 0.5 + 0.5) * rect.height}px`;
    }
  }

  function updateCamera() {
    const horizontal = Math.cos(state.pitch) * state.distance;
    state.camera.position.set(
      Math.sin(state.yaw) * horizontal,
      Math.sin(state.pitch) * state.distance,
      Math.cos(state.yaw) * horizontal
    );
    state.camera.lookAt(0, 0, 0);
  }

  function noteManualInteraction(active = false) {
    state.animation.interacting = active;
    state.animation.lastInteractionAt = performance.now();
    if (active) state.animation.rotationVelocity = 0;
  }

  function spawnSignal(now) {
    if (state.reducedMotion || !state.signalEdges.length) return;
    const available = state.signalPool.find((group) => !group.userData.signal.active);
    if (!available) return;
    const edge = state.signalEdges[state.signalCursor % state.signalEdges.length];
    state.signalCursor = (state.signalCursor + 17) % state.signalEdges.length;
    const signal = available.userData.signal;
    const color = new THREE.Color(edge.color).lerp(new THREE.Color('#b9f4ff'), 0.56);
    signal.coreMaterial.color.copy(color);
    signal.glowMaterial.color.copy(color);
    signal.trails.forEach((trail) => trail.material.color.copy(color));
    signal.edge = edge;
    signal.startedAt = now;
    signal.durationMs = ANIMATION_CONFIG.signalDurationMs * (0.86 + hashUnit(edge.relationId) * 0.28);
    signal.active = true;
    available.position.set(0, 0, 0);
    available.visible = true;
  }

  function updateSignals(now) {
    if (state.reducedMotion) {
      state.signalPool.forEach((group) => { group.visible = false; });
      state.animation.activeSignals = 0;
      return;
    }
    if (now - state.animation.lastSignalAt >= ANIMATION_CONFIG.signalSpawnIntervalMs) {
      spawnSignal(now);
      state.animation.lastSignalAt = now;
    }
    let active = 0;
    for (const group of state.signalPool) {
      const signal = group.userData.signal;
      if (!signal.active) continue;
      const progress = (now - signal.startedAt) / signal.durationMs;
      if (progress >= 1) {
        signal.active = false;
        group.visible = false;
        signal.coreMaterial.opacity = 0;
        signal.glowMaterial.opacity = 0;
        signal.trails.forEach((trail) => { trail.material.opacity = 0; });
        continue;
      }
      active += 1;
      const eased = progress * progress * (3 - 2 * progress);
      const envelope = Math.sin(Math.PI * progress);
      quadraticPoint(signal.edge.source, signal.edge.control, signal.edge.target, eased, signal.core.position);
      signal.glow.position.copy(signal.core.position);
      const signalScale = 0.82 + envelope * 0.35;
      signal.core.scale.setScalar(signalScale);
      signal.glow.scale.setScalar(signalScale);
      signal.coreMaterial.opacity = envelope * 0.72;
      signal.glowMaterial.opacity = envelope * 0.2;
      signal.trails.forEach((trail, trailIndex) => {
        const trailProgress = Math.max(0, progress - trail.lag);
        const trailEased = trailProgress * trailProgress * (3 - 2 * trailProgress);
        quadraticPoint(signal.edge.source, signal.edge.control, signal.edge.target, trailEased, trail.mesh.position);
        trail.material.opacity = envelope * (0.28 - trailIndex * 0.09);
      });
    }
    state.animation.activeSignals = active;
  }

  function updateClusters(now) {
    for (const hub of state.clusterHubs) {
      const wave = state.reducedMotion ? 0 : Math.sin((now / ANIMATION_CONFIG.clusterPulsePeriodMs) * Math.PI * 2 + hub.phase);
      const scale = 1 + wave * ANIMATION_CONFIG.clusterPulseAmplitude;
      hub.group.scale.setScalar(scale);
      hub.core.material.opacity = 0.23 + wave * 0.025;
      hub.halo.material.opacity = 0.13 + wave * 0.018;
      hub.aura.material.opacity = 0.17 + wave * 0.02;
    }
  }

  function updateDepthStyling() {
    for (const mesh of state.nodeMeshes) {
      mesh.getWorldPosition(state.worldPosition);
      const distance = state.worldPosition.distanceTo(state.camera.position);
      const normalizedDepth = Math.max(0, Math.min(1, (distance - (state.distance - 105)) / 210));
      const frontFactor = 1 - normalizedDepth;
      mesh.material.opacity = mesh.userData.baseOpacity * (0.46 + frontFactor * 0.54);
      mesh.material.emissiveIntensity = mesh.userData.baseEmissiveIntensity * (0.58 + frontFactor * 0.72);
    }
  }

  function animationFrame(now) {
    if (document.hidden) {
      state.animation.running = false;
      state.animation.frameRequest = null;
      return;
    }
    const frameInterval = innerWidth <= 720 ? ANIMATION_CONFIG.mobileFrameIntervalMs : ANIMATION_CONFIG.desktopFrameIntervalMs;
    if (state.animation.lastFrameAt && now - state.animation.lastFrameAt < frameInterval) {
      state.animation.frameRequest = requestAnimationFrame(animationFrame);
      return;
    }
    const deltaSeconds = state.animation.lastFrameAt ? Math.min(0.1, (now - state.animation.lastFrameAt) / 1000) : 0;
    state.animation.lastFrameAt = now;

    const elapsedSinceInteraction = now - state.animation.lastInteractionAt;
    const resumeProgress = Math.max(0, Math.min(1, (elapsedSinceInteraction - ANIMATION_CONFIG.interactionResumeDelayMs) / ANIMATION_CONFIG.interactionResumeEaseMs));
    const resumeEase = resumeProgress * resumeProgress * (3 - 2 * resumeProgress);
    const fullRotationSpeed = state.reducedMotion ? 0 : (Math.PI * 2) / ANIMATION_CONFIG.autoRotationSecondsPerTurn;
    const targetVelocity = state.animation.interacting ? 0 : fullRotationSpeed * resumeEase;
    const response = 1 - Math.exp(-deltaSeconds * 2.2);
    state.animation.rotationVelocity += (targetVelocity - state.animation.rotationVelocity) * response;
    state.animation.modelRotation = (state.animation.modelRotation + state.animation.rotationVelocity * deltaSeconds) % (Math.PI * 2);
    state.modelGroup.rotation.y = state.animation.modelRotation;

    updateClusters(now);
    updateSignals(now);
    updateCamera();
    state.scene.updateMatrixWorld(true);
    updateDepthStyling();
    state.renderer.render(state.scene, state.camera);
    if (now - state.animation.lastLabelAt > 40) {
      updateProjectedLabels();
      state.animation.lastLabelAt = now;
    }
    if (now - state.animation.lastDiagnosticsAt > 500) {
      document.documentElement.dataset.modelRotation = state.animation.modelRotation.toFixed(5);
      document.documentElement.dataset.rotationVelocity = state.animation.rotationVelocity.toFixed(5);
      document.documentElement.dataset.activeSignals = String(state.animation.activeSignals);
      document.documentElement.dataset.clusterCount = String(state.clusterHubs.length);
      document.documentElement.dataset.interacting = String(state.animation.interacting);
      document.documentElement.dataset.renderCount = String(state.renderCount);
      state.animation.lastDiagnosticsAt = now;
    }
    state.renderCount += 1;
    state.dirty = false;
    state.animation.frameRequest = requestAnimationFrame(animationFrame);
  }

  function scheduleRender() {
    state.dirty = true;
    if (state.animation.running || document.hidden || !state.renderer) return;
    state.animation.running = true;
    state.animation.lastFrameAt = 0;
    state.animation.frameRequest = requestAnimationFrame(animationFrame);
  }

  function resize() {
    const rect = dom.stage.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    state.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, innerWidth <= 720 ? 1.2 : 1.6));
    state.renderer.setSize(rect.width, rect.height, false);
    state.camera.aspect = rect.width / rect.height;
    state.camera.updateProjectionMatrix();
    scheduleRender();
  }

  function fitView() {
    noteManualInteraction(false);
    state.yaw = 0.62;
    state.pitch = 0.28;
    state.distance = state.context?.nodes.length > 45 ? 258 : 225;
    scheduleRender();
  }

  function zoom(factor) {
    noteManualInteraction(false);
    state.distance = Math.max(72, Math.min(520, state.distance * factor));
    scheduleRender();
  }

  function pointerPosition(event) {
    const rect = dom.canvas.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top, width: rect.width, height: rect.height };
  }

  function pickNode(event) {
    const point = pointerPosition(event);
    state.pointerNdc.set((point.x / point.width) * 2 - 1, -(point.y / point.height) * 2 + 1);
    state.raycaster.setFromCamera(state.pointerNdc, state.camera);
    return state.raycaster.intersectObjects(state.nodeMeshes, false)[0]?.object || null;
  }

  function showTooltip(event, mesh) {
    if (!mesh) {
      dom.tooltip.hidden = true;
      return;
    }
    const node = nodeById.get(mesh.userData.nodeId);
    const point = pointerPosition(event);
    dom.tooltip.innerHTML = `<b>${escapeHtml(node.title)}</b><code>${escapeHtml(node.id)}</code>`;
    dom.tooltip.style.left = `${point.x + 14}px`;
    dom.tooltip.style.top = `${point.y + 14}px`;
    dom.tooltip.hidden = false;
  }

  function pointerDistance() {
    const values = [...state.pointers.values()];
    if (values.length < 2) return null;
    return Math.hypot(values[0].x - values[1].x, values[0].y - values[1].y);
  }

  function onPointerDown(event) {
    noteManualInteraction(true);
    dom.canvas.setPointerCapture(event.pointerId);
    state.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (state.pointers.size === 1) {
      state.pointerStart = { x: event.clientX, y: event.clientY, yaw: state.yaw, pitch: state.pitch, moved: false };
    } else if (state.pointers.size === 2) {
      state.pinchDistance = pointerDistance();
    }
  }

  function onPointerMove(event) {
    const previous = state.pointers.get(event.pointerId);
    if (!previous) {
      showTooltip(event, pickNode(event));
      return;
    }
    state.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (state.pointers.size === 2) {
      const nextDistance = pointerDistance();
      if (state.pinchDistance && nextDistance) zoom(state.pinchDistance / nextDistance);
      state.pinchDistance = nextDistance;
      return;
    }
    if (!state.pointerStart) return;
    const dx = event.clientX - state.pointerStart.x;
    const dy = event.clientY - state.pointerStart.y;
    if (Math.hypot(dx, dy) > 4) state.pointerStart.moved = true;
    state.yaw = state.pointerStart.yaw - dx * 0.007;
    state.pitch = Math.max(-1.25, Math.min(1.25, state.pointerStart.pitch + dy * 0.006));
    dom.tooltip.hidden = true;
    scheduleRender();
  }

  function onPointerUp(event) {
    const wasClick = state.pointers.size === 1 && state.pointerStart && !state.pointerStart.moved;
    state.pointers.delete(event.pointerId);
    if (wasClick) {
      const mesh = pickNode(event);
      if (mesh) updateSelection(mesh.userData.nodeId);
    }
    if (!state.pointers.size) {
      state.pointerStart = null;
      state.pinchDistance = null;
      noteManualInteraction(false);
    }
  }

  function initializeFocusSelect() {
    const candidates = nodes
      .filter((node) => (relationsByNode.get(node.id)?.length || 0) >= 3)
      .sort((a, b) => (relationsByNode.get(b.id).length - relationsByNode.get(a.id).length) || a.title.localeCompare(b.title, 'de'))
      .slice(0, 18);
    dom.focusSelect.innerHTML = candidates.map((node) => `<option value="${escapeHtml(node.id)}">${escapeHtml(node.title)} · ${node.id}</option>`).join('');
    if (!candidates.some((node) => node.id === state.focusId)) {
      const focus = nodeById.get(state.focusId);
      dom.focusSelect.insertAdjacentHTML('afterbegin', `<option value="${escapeHtml(focus.id)}">${escapeHtml(focus.title)} · ${focus.id}</option>`);
    }
    dom.focusSelect.value = state.focusId;
  }

  function initializeRenderer() {
    try {
      state.renderer = new THREE.WebGLRenderer({ canvas: dom.canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
      state.renderer.setClearColor(0x000000, 0);
      state.renderer.outputColorSpace = THREE.SRGBColorSpace;
      state.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      state.renderer.toneMappingExposure = 1.08;
      state.scene = new THREE.Scene();
      state.scene.fog = new THREE.FogExp2(0x030912, 0.0032);
      state.camera = new THREE.PerspectiveCamera(48, 1, 0.1, 1400);
      state.glowTexture = createGlowTexture();
      state.modelGroup = new THREE.Group();
      state.modelGroup.name = 'living-brain-model';
      state.scene.add(state.modelGroup);
      state.scene.add(new THREE.AmbientLight(0x7ab9df, 0.92));
      const keyLight = new THREE.PointLight(0xd8f3ff, 1250, 640, 1.6);
      keyLight.position.set(110, 150, 180);
      state.scene.add(keyLight);
      const cyanLight = new THREE.PointLight(0x35d4ff, 760, 480, 1.9);
      cyanLight.position.set(-160, -70, 120);
      state.scene.add(cyanLight);
      createStarField();
      initializeFocusSelect();
      buildScene(state.focusId);
      resize();
      dom.renderStatus.textContent = state.reducedMotion
        ? `WebGL aktiv · reduzierte Bewegung · Three.js r${THREE.REVISION}`
        : `Live · ${ANIMATION_CONFIG.autoRotationSecondsPerTurn} s/Umdrehung · ${state.clusterHubs.length} Cluster · max. ${ANIMATION_CONFIG.signalPoolSize} Signale`;
      document.documentElement.dataset.pocReady = 'true';
      document.documentElement.dataset.visualNeuronCount = String(state.visualNeuronCount);
      document.documentElement.dataset.visualFilamentCount = String(state.visualFilamentCount);
    } catch (error) {
      console.error(error);
      dom.fallback.hidden = false;
      dom.renderStatus.textContent = 'WebGL-Initialisierung fehlgeschlagen';
      document.documentElement.dataset.pocReady = 'error';
    }
  }

  dom.canvas.addEventListener('pointerdown', onPointerDown);
  dom.canvas.addEventListener('pointermove', onPointerMove);
  dom.canvas.addEventListener('pointerup', onPointerUp);
  dom.canvas.addEventListener('pointercancel', onPointerUp);
  dom.canvas.addEventListener('pointerleave', () => { if (!state.pointers.size) dom.tooltip.hidden = true; });
  dom.canvas.addEventListener('wheel', (event) => { event.preventDefault(); zoom(Math.exp(event.deltaY * 0.001)); }, { passive: false });
  dom.canvas.addEventListener('dblclick', (event) => {
    const mesh = pickNode(event);
    if (mesh) buildScene(mesh.userData.nodeId);
  });
  dom.canvas.addEventListener('keydown', (event) => {
    noteManualInteraction(false);
    if (event.key === 'ArrowLeft') state.yaw -= 0.12;
    else if (event.key === 'ArrowRight') state.yaw += 0.12;
    else if (event.key === 'ArrowUp') state.pitch = Math.min(1.25, state.pitch + 0.1);
    else if (event.key === 'ArrowDown') state.pitch = Math.max(-1.25, state.pitch - 0.1);
    else if (event.key === '+' || event.key === '=') zoom(0.86);
    else if (event.key === '-') zoom(1.16);
    else if (event.key.toLowerCase() === 'f') fitView();
    else return;
    event.preventDefault();
    scheduleRender();
  });
  dom.canvas.addEventListener('webglcontextlost', (event) => {
    event.preventDefault();
    dom.fallback.hidden = false;
    dom.renderStatus.textContent = 'WebGL-Kontext verloren';
    document.documentElement.dataset.pocReady = 'context-lost';
  });
  dom.focusSelect.addEventListener('change', () => buildScene(dom.focusSelect.value));
  dom.focusSelected.addEventListener('click', () => { if (state.selectedId) buildScene(state.selectedId); });
  dom.fit.addEventListener('click', fitView);
  dom.zoomIn.addEventListener('click', () => zoom(0.82));
  dom.zoomOut.addEventListener('click', () => zoom(1.2));
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      state.animation.lastSignalAt = performance.now();
      scheduleRender();
    }
  });
  new ResizeObserver(resize).observe(dom.stage);

  window.ADB3D_POC = {
    getState() {
      return {
        ready: document.documentElement.dataset.pocReady,
        focusId: state.focusId,
        selectedId: state.selectedId,
        nodeCount: state.context?.nodes.length || 0,
        edgeCount: state.context?.edges.length || 0,
        visualNeuronCount: state.visualNeuronCount,
        visualFilamentCount: state.visualFilamentCount,
        threeRevision: THREE.REVISION,
        renderCount: state.renderCount,
        handoffHref: dom.detailHandoff.getAttribute('href'),
        animation: {
          reducedMotion: state.reducedMotion,
          autoRotationSecondsPerTurn: ANIMATION_CONFIG.autoRotationSecondsPerTurn,
          modelRotation: state.animation.modelRotation,
          rotationVelocity: state.animation.rotationVelocity,
          interacting: state.animation.interacting,
          clusterCount: state.clusterHubs.length,
          activeSignals: state.animation.activeSignals,
          signalPoolSize: state.signalPool.length,
          pulseAmplitude: ANIMATION_CONFIG.clusterPulseAmplitude
        }
      };
    },
    selectNode(nodeId) { return updateSelection(nodeId); },
    focusNode(nodeId) {
      if (!nodeById.has(nodeId)) return false;
      buildScene(nodeId);
      return true;
    },
    contextNodeIds() { return state.context?.nodes.map((node) => node.id) || []; }
  };

  initializeRenderer();
})();
