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

const run = (async () => {
  const fs = require('fs');
  const prompts = require('prompts');
  const scjs = __dirname + '/svelte.config.js';
  const isTemplateBase = fs.existsSync(__dirname + '/../../templateFiles') || fs.existsSync(__dirname + '/../../.createroot')
  const { node, csrf, csr, inlineStyleThreshold, inlineStyleThresholdShouldBeInfinite, minimal, completed, ciProvider } = await prompts([
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
      type: (_, o) => o.node ? 'confirm' : null,
      message: 'Do you want a minimal setup?',
      initial: false,
    },
    {
      name: 'ciProvider',
      type: 'select',
      message: 'Which CI/CD provider do you want to use to build and deploy your Docker image?',
      choices: [
        { title: 'GitHub Actions, Github Registry', value: 'github' },
        { title: 'GitLab CI, Any Registry (untested)', value: 'gitlab' },
        // { title: 'AppVeyor (untested)', value: 'appveyor' },
        // { title: 'CircleCI (untested)', value: 'circleci' },
        { title: 'Drone CI, Any Registry (untested)', value: 'drone' },
        { title: 'None', value: 'none' },
      ],
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
    return await run();
  if (ciProvider && ciProvider !== 'none') {
    switch (ciProvider) {
      case 'github':
        fs.mkdirSync(__dirname + '/.github/workflows', { recursive: true });
        fs.writeFileSync(__dirname + '/.github/workflows/build.yml', `name: Build and Deploy Docker Image

on:
  push:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v2

      - name: Build Docker image
        run: docker build -t docker-image .

      - name: Create .tar.gz archive
        run: |
          docker save docker-image | gzip > docker-image.tar.gz
      - name: Upload docker archive to Artifacts
        uses: actions/upload-artifact@v3.1.3
        with:
          name: docker-image
          path: docker-image.tar.gz

  # If you wish to deploy the .tar.gz archive elsewhere, or only wish to have it in artifacts, change or remove the below
  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Download Artifact
        uses: actions/download-artifact@v3.0.2
        with:
          name: docker-image
          path: docker-image.tar.gz

      # You may want to look into hosting your own Docker registry, or using a completely free one like https://treescale.com/ for private packages - for this, you'll need to modify or replace the below step.
      # If you wish to use Docker Hub, you'll also need to change the below.
      - name: Push Docker image to GitHub Packages
        run: |
          docker login -u \${{ github.actor }} -p \${{ secrets.GITHUB_TOKEN }} docker.pkg.github.com
          docker tag docker-image docker.pkg.github.com/\${{ github.repository }}/docker-image:latest
          docker push docker.pkg.github.com/\${{ github.repository }}/docker-image:latest
`);
        break;

      case 'gitlab':
        console.warn('[CI] WARNING: GitLab CI is untested.');
        console.warn('[CI] WARNING: You\'ll need to provide environment variables CI_REGISTRY, CI_REGISTRY_USER, and CI_REGISTRY_PASSWORD to your CI.');
        fs.writeFileSync(__dirname + '/.gitlab-ci.yml', `
stages:
  - build
  - deploy

build:
  stage: build
  image: docker:latest
  services:
    - docker:dind
  script:
    - docker build -t docker-image .
    - docker save docker-image | gzip > docker-image.tar.gz
  artifacts:
    paths:
      - docker-image.tar.gz

deploy:
  stage: deploy
  image: docker:stable
  services:
    - docker:dind
  dependencies:
    - build
  script:
    - docker load < docker-image.tar.gz
    - docker login -u \${CI_REGISTRY_USER} -p \${CI_REGISTRY_PASSWORD} \${CI_REGISTRY}
    - docker tag docker-image \${CI_REGISTRY_IMAGE}/docker-image:latest
    - docker push \${CI_REGISTRY_IMAGE}/docker-image:latest
`);
        break;
      case 'drone':
        console.warn('[CI] WARNING: Drone CI is untested.');
        console.warn('[CI] WARNING: You\'ll need to provide environment variables CI_REGISTRY, CI_REGISTRY_USER, and CI_REGISTRY_PASSWORD to your CI.');
        fs.writeFileSync(__dirname + '/.drone.yml', `
kind: pipeline
type: docker
name: default

steps:
  - name: build
    image: docker:latest
    commands:
      - docker build -t docker-image .
      - docker save docker-image | gzip > docker-image.tar.gz
    volumes:
      - name: docker
        path: /var/run/docker.sock

  - name: deploy
    image: docker:stable
    commands:
      - docker load < docker-image.tar.gz
      - docker login -u \${CI_REGISTRY_USER} -p \${CI_REGISTRY_PASSWORD} \${CI_REGISTRY}
      - docker tag docker-image \${CI_REGISTRY_IMAGE}/docker-image:latest
      - docker push \${CI_REGISTRY_IMAGE}/docker-image:latest

volumes:
  - name: docker
    host:
      path: /var/run/docker.sock

trigger:
  event:
    - push
`);
        break;
      default:
        break;
    }
  }
  if (minimal || !node) {
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
});
run();
