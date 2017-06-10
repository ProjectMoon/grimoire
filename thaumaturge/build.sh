#!/bin/bash
rm -rf dist/
tsc -p .
rm -rf dist/test/
dts-bundle --name thaumaturge --main dist/lib/index.d.ts
mv dist/lib/thaumaturge.d.ts dist/lib/thaumaturge.d.ts.2
rm dist/lib/*.d.ts
mv dist/lib/thaumaturge.d.ts.2 dist/lib/thaumaturge.d.ts
