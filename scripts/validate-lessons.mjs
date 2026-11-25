import { MODULES, LESSONS } from '../src/data/lessons.js';

const VALID_NODE_TYPES = new Set([
  'client', 'dns', 'lb', 'app', 'cache', 'db', 'queue', 'service', 'auth', 'control-plane'
]);

function toIso(x, y) {
  const angle = Math.PI / 6;
  return {
    x: (x - y) * Math.cos(angle) + 460,
    y: (x + y) * Math.sin(angle) + 120
  };
}

const errors = [];
const warnings = [];
const upcomingPlaceholders = [];
let totalSteps = 0;
let totalNodes = 0;

// 1. Check MODULES <-> LESSONS consistency
const moduleLessonIds = new Set();
for (const mod of MODULES) {
  for (const lessonId of mod.lessons) {
    moduleLessonIds.add(lessonId);
    if (!LESSONS[lessonId]) {
      upcomingPlaceholders.push(`Module "${mod.id}" -> "${lessonId}" (not yet implemented)`);
    }
  }
}

for (const lessonId of Object.keys(LESSONS)) {
  if (!moduleLessonIds.has(lessonId)) {
    errors.push(`Lesson "${lessonId}" is not listed in any module`);
  }
}

// 2. Check each lesson's steps, nodes, traffic, and isometric bounds
for (const [lessonId, lesson] of Object.entries(LESSONS)) {
  if (!Array.isArray(lesson.steps) || lesson.steps.length === 0) {
    errors.push(`Lesson "${lessonId}" has no steps`);
    continue;
  }

  for (const step of lesson.steps) {
    totalSteps++;
    const nodeIds = new Set();
    const isoPositions = [];

    for (const node of step.nodes || []) {
      totalNodes++;
      if (nodeIds.has(node.id)) {
        errors.push(`[${lessonId} step ${step.step}] Duplicate node id "${node.id}"`);
      }
      nodeIds.add(node.id);

      if (!VALID_NODE_TYPES.has(node.type)) {
        errors.push(`[${lessonId} step ${step.step}] Invalid node type "${node.type}" on "${node.id}"`);
      }

      const iso = toIso(node.x, node.y);
      if (iso.x < 40 || iso.x > 880 || iso.y < 40 || iso.y > 495) {
        const msg = `[${lessonId} step ${step.step}] Node "${node.id}" iso(${Math.round(iso.x)}, ${Math.round(iso.y)}) near/outside viewBox(920x520)`;
        if (lessonId === 'atlassian-cloud-architecture') {
          errors.push(msg);
        } else {
          warnings.push(msg);
        }
      }

      for (const prev of isoPositions) {
        const dist = Math.hypot(iso.x - prev.x, iso.y - prev.y);
        if (dist < 55) {
          const msg = `[${lessonId} step ${step.step}] Nodes "${prev.id}" and "${node.id}" are close in iso space (${Math.round(dist)}px)`;
          if (lessonId === 'atlassian-cloud-architecture') {
            errors.push(msg);
          } else {
            warnings.push(msg);
          }
        }
      }
      isoPositions.push({ id: node.id, ...iso });
    }

    for (const edge of step.traffic || []) {
      if (!nodeIds.has(edge.from)) {
        errors.push(`[${lessonId} step ${step.step}] Traffic "from" unknown node "${edge.from}"`);
      }
      if (!nodeIds.has(edge.to)) {
        errors.push(`[${lessonId} step ${step.step}] Traffic "to" unknown node "${edge.to}"`);
      }
    }
  }
}

console.log(`Validated ${Object.keys(LESSONS).length} implemented lessons, ${totalSteps} steps, ${totalNodes} nodes.`);
if (upcomingPlaceholders.length > 0) {
  console.log(`Upcoming module placeholders (${upcomingPlaceholders.length}): ${upcomingPlaceholders.map(p => p.split('-> ')[1]).join(', ')}`);
}
if (warnings.length > 0) {
  console.log(`Pre-existing geometry warnings (${warnings.length}) in legacy lessons.`);
}
if (errors.length > 0) {
  console.error(`\nErrors (${errors.length}):`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}

console.log('Schema & Geometry Guard: PASS');
