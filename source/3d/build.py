#!/usr/bin/env python3
"""3D पेज बनाना: esbuild से bundle, फिर shell.html में सुरक्षित (try/catch) रूप में डालना।
उपयोग:  cd 3d && npm ci && python3 build.py   →  dist/index.html
"""
import os, subprocess
here = os.path.dirname(os.path.abspath(__file__))
subprocess.run(['npx', 'esbuild', 'src/main.js', '--bundle', '--minify', '--format=iife',
                '--outfile=dist/bundle.js'], cwd=here, check=True)
b = open(os.path.join(here, 'dist/bundle.js'), encoding='utf-8').read()
shell = open(os.path.join(here, 'src/shell.html'), encoding='utf-8').read()
wrapped = ('if(!window.__noWebGL){try{' + b + '\n}catch(e){console.warn("3D init failed",e);'
           'window.__fallback&&window.__fallback((e&&e.glReason)||"init");}}')
assert '/*BUNDLE*/' in shell
out = shell.replace('/*BUNDLE*/', wrapped.replace('</script', '<\\/script'))
open(os.path.join(here, 'dist/index.html'), 'w', encoding='utf-8').write(out)
print('dist/index.html', len(out.encode()), 'bytes')
