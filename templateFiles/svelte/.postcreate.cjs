(async () => {
  const fs = require('fs');
  const prompts = require('prompts');
  const scjs = __dirname + '/svelte.config.js';
  const {node,csrf,csr} = await prompts([
    {
      name: 'node',
      type: 'confirm',
      message: 'Do you want to output a node app (Y=node, n=static)?',
      initial: true
    },
    {
      name: 'csrf',
      type: v=>v?'select':null,
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
  ])
  fs.writeFileSync(scjs, fs.readFileSync(scjs, 'utf-8').replace(/@sveltejs\/adapter-[a-zA-Z0-9\-\_]+/, '@sveltejs/adapter-' + (node ? 'node' : 'static')))
  if (node)
    fs.writeFileSync(scjs, fs.readFileSync(scjs, 'utf-8').replace(/checkOrigin: [a-zA-Z0-9]+/, 'checkOrigin: ' + csrf))
  fs.writeFileSync(__dirname + '/src/routes/+layout.ts', `export const csr = ${csr};
${node ? '' : `export const prerender = true;
`}`)
  if (!fs.existsSync(__dirname+'/../../.ccf'))
    fs.unlinkSync(__filename)
})();
