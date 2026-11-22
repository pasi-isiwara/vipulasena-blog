#!/bin/sh
# mkcomp.sh <out.tsx> <name> <from> <to> [comment]
out="$1"; name="$2"; from="$3"; to="$4"; comment="$5"
{
  [ -n "$comment" ] && printf '/* %s */\n' "$comment"
  printf 'export function %s() {\n  return (\n' "$name"
  node scripts/html-to-jsx.mjs reference/parts/body.html "$from" "$to" | sed 's/^/    /'
  printf '\n  );\n}\n'
} > "$out"
