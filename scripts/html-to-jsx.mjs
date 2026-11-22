/* Converts a chunk of the prototype's HTML into JSX.
   Used once per markup block while porting; keeps the hand-drawn SVG artwork
   byte-for-byte identical instead of being retyped.

   Usage: node scripts/html-to-jsx.mjs <file> <startLine> <endLine> */
import { readFileSync } from 'node:fs';

const ATTR = {
  class: 'className',
  for: 'htmlFor',
  'stroke-width': 'strokeWidth',
  'stroke-linecap': 'strokeLinecap',
  'stroke-linejoin': 'strokeLinejoin',
  'stroke-dasharray': 'strokeDasharray',
  'stroke-opacity': 'strokeOpacity',
  'fill-opacity': 'fillOpacity',
  'stop-color': 'stopColor',
  'stop-opacity': 'stopOpacity',
  'clip-path': 'clipPath',
  'clip-rule': 'clipRule',
  'fill-rule': 'fillRule',
  'text-anchor': 'textAnchor',
  'dominant-baseline': 'dominantBaseline',
  'font-size': 'fontSize',
  'font-family': 'fontFamily',
  'font-weight': 'fontWeight',
  'preserveaspectratio': 'preserveAspectRatio',
  'viewbox': 'viewBox',
  'pathlength': 'pathLength',
  'crossorigin': 'crossOrigin',
  'autocomplete': 'autoComplete',
  'maxlength': 'maxLength',
  'novalidate': 'noValidate',
  'tabindex': 'tabIndex',
  'srcset': 'srcSet',
  'colspan': 'colSpan',
  'rowspan': 'rowSpan',
  'readonly': 'readOnly',
};

// Attributes that are booleans in JSX
const BOOLEAN = new Set(['hidden', 'required', 'disabled', 'checked', 'multiple', 'readOnly', 'noValidate', 'selected']);

// Void elements that must be self-closed in JSX
const VOID = new Set(['img', 'input', 'br', 'hr', 'meta', 'link', 'source', 'path', 'circle', 'rect', 'ellipse', 'line', 'polygon', 'polyline', 'use', 'stop', 'area', 'col', 'embed', 'track', 'wbr']);

function styleToObject(css) {
  const entries = css
    .split(';')
    .map((d) => d.trim())
    .filter(Boolean)
    .map((d) => {
      const i = d.indexOf(':');
      const prop = d.slice(0, i).trim();
      const value = d.slice(i + 1).trim();
      const key = prop.startsWith('--')
        ? `'${prop}'`
        : prop.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      return `${key}: '${value.replace(/'/g, "\\'")}'`;
    });
  return `{ ${entries.join(', ')} }`;
}

function convert(html) {
  // Comments
  let out = html.replace(/<!--([\s\S]*?)-->/g, (_, body) => `{/*${body}*/}`);

  // Tags
  out = out.replace(/<([a-zA-Z][\w-]*)((?:\s+[^<>"']+(?:"[^"]*"|'[^']*')?)*)\s*(\/?)>/g,
    (full, tag, attrs, selfClose) => {
      let converted = attrs.replace(
        /\s+([a-zA-Z_:][\w:.-]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'))?/g,
        (_m, rawName, dq, sq) => {
          const value = dq !== undefined ? dq : sq;
          if (/^(data-|aria-)/.test(rawName)) {
            return value === undefined ? ` ${rawName}` : ` ${rawName}="${value}"`;
          }
          const name = ATTR[rawName] ?? ATTR[rawName.toLowerCase()] ?? rawName;
          if (value === undefined) {
            return BOOLEAN.has(name) ? ` ${name}` : ` ${name}`;
          }
          if (name === 'style') return ` style={${styleToObject(value)}}`;
          return ` ${name}="${value}"`;
        },
      );
      const close = selfClose || VOID.has(tag.toLowerCase()) ? ' />' : '>';
      return `<${tag}${converted}${close}`;
    });

  // Entities React would otherwise print literally
  out = out.replace(/&nbsp;/g, '{"\\u00a0"}');

  // Braces in text would be read as JSX expressions
  return out;
}

const [file, from, to] = process.argv.slice(2);
const lines = readFileSync(file, 'utf8').split('\n');
const chunk = lines.slice(Number(from) - 1, Number(to)).join('\n');
process.stdout.write(convert(chunk));
