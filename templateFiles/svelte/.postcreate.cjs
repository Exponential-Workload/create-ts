const perNodeStaticFiles = {
  static: {
    'docker-compose.static.yml': 'docker-compose.yml',
    'Dockerfile.static': 'Dockerfile',
    'nginx.static.conf': 'nginx.conf',
  },
  node: {
    'docker-compose.node.yml': 'docker-compose.yml',
    'Dockerfile.node': 'Dockerfile',
    'nginx.node.conf': 'nginx.conf',
  },
};

(async () => {
  const fs = require('fs');
  const prompts = require('prompts');
  const scjs = __dirname + '/svelte.config.js';
  const isTemplateBase = fs.existsSync(__dirname + '/../../templateFiles') || fs.existsSync(__dirname + '/../../.createroot')
  const { node, csrf, csr, inlineStyleThreshold, inlineStyleThresholdShouldBeInfinite, minimal, completed } = await prompts([
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
      initial: true
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
      name: 'minimal',
      type: 'confirm',
      message: 'Do you want a minimal setup?',
      initial: false,
    },
    {
      name: 'completed',
      type: 'confirm',
      message: 'Is this configuration correct?',
      initial: !isTemplateBase,
    },
  ], {
    onCancel: () => {
      throw new Error('Exited.')
    },
  });
  if (!completed)
    throw new Error('Cancelled.')
  if (minimal) {
    // if the parent dir name is templateFiles, error
    if (isTemplateBase)
      throw new Error('Minimal mode is destructive and cannot be run in the templateFiles directory.')
    fs.rmSync(__dirname + '/src/routes/(app)', {
      recursive: true,
      force: true,
    });
    fs.rmSync(__dirname + '/src/lib/', {
      recursive: true,
      force: true,
    });
    fs.unlinkSync(__dirname + '/ABOUT-TEMPLATE.md');
    fs.mkdirSync(__dirname + '/src/routes/(app)');
    fs.writeFileSync(__dirname + '/src/routes/(app)/+page.svelte', `<script lang="ts">
  // script stuff!
</script>

<style lang="scss">
  // add styles
</style>`)
  }
  fs.writeFileSync(scjs, fs.readFileSync(scjs, 'utf-8').replace(/@sveltejs\/adapter-[a-zA-Z0-9\-\_]+/, '@sveltejs/adapter-' + (node ? 'node' : 'static')))
  if (node)
    fs.writeFileSync(scjs, fs.readFileSync(scjs, 'utf-8').replace(/checkOrigin: [a-zA-Z0-9]+/, 'checkOrigin: ' + csrf))
  fs.writeFileSync(__dirname + '/src/routes/+layout.ts', `export const csr = ${!!csr};
${node ? '' : `export const prerender = true;
`}`)
  fs.writeFileSync(scjs, fs.readFileSync(scjs, 'utf-8').replace(/inlineStyleThreshold: -?([0-9]+|Infinity)/, 'inlineStyleThreshold: ' + ((inlineStyleThresholdShouldBeInfinite ? 'Infinity' : inlineStyleThreshold === -1 ? 'Infinity' : inlineStyleThreshold) ?? 0)))
  Object.entries(perNodeStaticFiles[node ? 'node' : 'static']).forEach(([k, v]) => {
    fs[isTemplateBase ? 'copyFileSync' : 'renameSync'](__dirname + '/' + k, __dirname + '/' + v);
  })
  if (!isTemplateBase) {
    const pkg = JSON.parse(fs.readFileSync(__dirname + '/package.json', 'utf-8'));
    delete pkg.scripts.postcreate;
    fs.writeFileSync(__dirname + '/package.json', JSON.stringify(pkg, null, 2))
    fs.unlinkSync(__filename)
    Object.entries(perNodeStaticFiles[node ? 'static' : 'node']).forEach(([k]) => {
      fs.unlinkSync(__dirname + '/' + k);
    })
  }
})();
