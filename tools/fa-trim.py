"""Rebuild assets/fontawesome/css/fa-site.css and the subset webfonts.

Keeps only the Font Awesome icons referenced in *.html and assets/*.js.
Run from the repo root after adding an icon:
    pip install fonttools brotli
    python3 tools/fa-trim.py
"""
import re, subprocess, pathlib, glob
root = pathlib.Path('.')
src = ''.join((root/f'assets/fontawesome/css/{n}.css').read_text() for n in ['fontawesome','solid','brands'])
used = set(re.findall(r'fa-[a-z0-9-]+', ''.join(pathlib.Path(p).read_text() for p in glob.glob('*.html')+glob.glob('assets/*.js'))))
used |= {'fa','fas','fab','far','fa-solid','fa-brands','fa-regular','fa-classic','fa-sharp'}
src = re.sub(r'/\*.*?\*/', '', src, flags=re.S)
# split top-level blocks
blocks, depth, start = [], 0, 0
for i, c in enumerate(src):
    if c == '{': depth += 1
    elif c == '}':
        depth -= 1
        if depth == 0: blocks.append(src[start:i+1].strip()); start = i+1
out, cps = [], {'solid': set(), 'brands': set()}
anims = ('fa-beat','fa-bounce','fa-shake')
for b in blocks:
    sel, body = b.split('{', 1)
    sel = sel.strip()
    if sel.startswith('@font-face'):
        b = b.replace('font-display: block', 'font-display: swap')
        b = re.sub(r',\s*url\("[^"]+\.ttf"\) format\("truetype"\)', '', b)
        out.append(b); continue
    if sel.startswith(':root'): out.append(b); continue
    if sel.startswith('@media (prefers-reduced-motion'): out.append(b); continue
    m = re.match(r'@(-webkit-)?keyframes (\S+)', sel)
    if m:
        if m.group(2) in anims: out.append(b)
        continue
    if sel.startswith('@'): continue
    parts = [s.strip() for s in sel.split(',')]
    def ok(s):
        cls = re.findall(r'\.(fa[a-z0-9-]*)', s)
        return cls and all(c in used for c in cls)
    keep = [s for s in parts if ok(s)]
    if not keep: continue
    if ':before' in sel or ':after' in sel:
        m = re.search(r'content:\s*"\\([0-9a-f]+)"', body)
        if m: cps['x'] = cps.get('x', set()) | {m.group(1)}
    out.append(',\n'.join(keep) + ' {' + body)
css = '/*!\n * Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com\n * License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License)\n * Copyright 2023 Fonticons, Inc.\n * Trimmed to the icons this site uses (regenerate if you add icons).\n */\n' + '\n'.join(out) + '\n'
css = css.replace('fa-solid-900.woff2', 'fa-solid-900-site.woff2').replace('fa-brands-400.woff2', 'fa-brands-400-site.woff2')
(root/'assets/fontawesome/css/fa-site.css').write_text(css)
unicodes = ','.join('U+'+c for c in sorted(cps['x']))
for f in ['fa-solid-900', 'fa-brands-400']:
    subprocess.run(['pyftsubset', f'assets/fontawesome/webfonts/{f}.woff2', f'--unicodes={unicodes}',
                    '--flavor=woff2', "--layout-features=*",
                    f'--output-file=assets/fontawesome/webfonts/{f}-site.woff2'], check=True)
print('icons:', unicodes)
