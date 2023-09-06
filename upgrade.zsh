#!/bin/zsh

echo "Upgrading all template files..."
echo "Upgrading all template files..." > upgrade.log

cd templateFiles
# For each directory in the templateFiles directory, cd into it, run pnpm upgrade -L, and cd back out
for d in */ ; do
  cd $d
  echo "Upgrading $d"
  echo "Upgrading $d" >> ../../upgrade.log
  pnpm upgrade -L >> ../../upgrade.log
  cd ..
done

# For electrokit, we need to upgrade templateFiles/electrokit/electron and templateFiles/electrokit/svelte separately
cd electrokit/electron
echo "Upgrading electrokit/electron/"
echo "Upgrading electrokit/electron/" >> ../../../upgrade.log
pnpm upgrade -L >> ../../upgrade.log
cd ../svelte
echo "Upgrading electrokit/svelte/"
echo "Upgrading electrokit/svelte/" >> ../../../upgrade.log
pnpm upgrade -L >> ../../upgrade.log
cd ../..

# Finally exit
cd ..
echo "Done upgrading all template files!"
echo "Done upgrading all template files!" >> upgrade.log
