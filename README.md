# create-ts

Initializes one of many typescript templates - [see here](https://github.com/Exponential-Workload/create-ts/tree/main/templateFiles).

## Usage

`pnpm create @femboycafe`

## Usage from Source

on POSIX systems:
```bash
git clone https://github.com/Exponential-Workload/create-ts.git create-ts;
cd create-ts;
pnpm i;
pnpm build;
chmod +x ./dist/index.js
ln -s ./dist/index.js $HOME/.bin/create-ts; # assumes $HOME/.bin exists & is in your path
cd ..;

# to run:
create-ts
```
