# Create-Clusterfuck

Initializes one of many typescript templates - [see here](https://github.com/Exponential-Workload/create-clusterfuck/tree/main/templateFiles).

## Usage

`pnpm create clusterfuck`

## Naming

If you're wondering why I named this `create-clusterfuck`, it's because the project I initially made this for, [`ElectroKit`](https://github.com/Exponential-Workload/create-clusterfuck/tree/main/templateFiles/electrokit), [internally refers to itself as a clusterfuck a lot](https://github.com/Exponential-Workload/create-clusterfuck/blob/4b56b57/templateFiles/electrokit/electron/package.json#L2-L5) because I didn't come up with the name ElectroKit until after development was done & the build process was a clusterfuck (A confused or disorganized situation & [A chaotic situation where everything seems to go wrong](https://en.wiktionary.org/wiki/clusterfuck#Noun)) during development.<br/>
Additionally, naming this `create-electrokit` would not be true to the actual project, as it also includes several other of my typescript-related templates.

## Usage from Source

on POSIX systems:
```bash
git clone https://github.com/Exponential-Workload/create-clusterfuck.git create-clusterfuck;
cd create-clusterfuck;
pnpm i;
pnpm build;
chmod +x ./dist/index.js
ln -s ./dist/index.js $HOME/.bin/create-clusterfuck; # assumes $HOME/.bin exists & is in your path
cd ..;

# to run:
create-clusterfuck
```
