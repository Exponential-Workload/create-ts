(async () => {
  const fs = require('fs');
  const prompts = require('prompts');
  const scjs = __dirname + '/svelte.config.js';
  const { node, csrf, csr, inlineStyleThreshold, inlineStyleThresholdShouldBeInfinite, completed } = await prompts([
    {
      name: 'node',
      type: 'confirm',
      message: 'Do you want to output a node app (Y=node, n=static)?',
      initial: true
    },
    {
      name: 'csrf',
      type: v => v ? 'select' : null,
      message: 'Do you want to enable CSRF protection?',
      choices: [
        { title: 'Always', value: 'true' },
        { title: 'Only in Production Builds', value: 'dev' },
        { title: 'Never (discouraged)', value: 'false' },
      ],
      initial: 1
    },
    {
      name: 'csr',
      type: 'confirm',
      message: `Do you want to enable client-side rendering?`,
      initial: 1
    },
    {
      name: 'inlineStyleThresholdShouldBeInfinite',
      type: (_, { node, csr }) => (!node && !csr) ? 'confirm' : null,
      message: 'Do you want to inline all stylesheets? (useful for single-file-per-route html outputs)',
    },
    {
      name: 'inlineStyleThreshold',
      type: (_, { node, csr }) => (node || csr) ? 'number' : null,
      message: 'What is the maximum length (in bytes) of a stylesheet to inline? (-1=all stylesheets inlined, 0=no stylesheets inlined)',
      initial: 64,
      min: -1,
      max: Infinity
    },
    {
      name: 'completed',
      type: 'confirm',
      message: 'Is this configuration correct?',
      initial: false
    }
  ])
  if (!completed)
    throw new Error('Cancelled.')
  fs.writeFileSync(scjs, fs.readFileSync(scjs, 'utf-8').replace(/@sveltejs\/adapter-[a-zA-Z0-9\-\_]+/, '@sveltejs/adapter-' + (node ? 'node' : 'static')))
  if (node)
    fs.writeFileSync(scjs, fs.readFileSync(scjs, 'utf-8').replace(/checkOrigin: [a-zA-Z0-9]+/, 'checkOrigin: ' + csrf))
  fs.writeFileSync(__dirname + '/src/routes/+layout.ts', `export const csr = ${csr};
${node ? '' : `export const prerender = true;
`}`)
  fs.writeFileSync(scjs, fs.readFileSync(scjs, 'utf-8').replace(/inlineStyleThreshold: -?([0-9]+|Infinity)/, 'inlineStyleThreshold: ' + ((inlineStyleThresholdShouldBeInfinite ? 'Infinity' : inlineStyleThreshold === -1 ? 'Infinity' : inlineStyleThreshold) ?? 0)))
  if (!fs.existsSync(__dirname + '/../../.createroot'))
    fs.unlinkSync(__filename)
})();
