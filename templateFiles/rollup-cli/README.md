# <program>

## Development Guide

### Installing Dependencies
```bash
$ <package manager install>
Lockfile is up to date, resolution step is skipped
Packages: +33
+++++++++++++++++++++++++++++++++
Progress: resolved 33, reused 33, downloaded 0, added 33, done

devDependencies:
+ @rollup/plugin-alias 5.0.0
+ @rollup/plugin-terser 0.4.3
+ @rollup/plugin-typescript 11.1.3
+ @types/node 20.5.9
+ rollup 3.29.0
+ typescript 5.2.2

Done in 336ms
```

### Starting a Development Server

```bash
$ <package manager run> dev

rollup v3.29.0
bundles src/main.ts → dist/lib.cjs, dist/lib.esm.mjs...
created dist/lib.cjs, dist/lib.esm.mjs in 679ms

[2023-09-08 10:30:44] waiting for changes...
```

### Building the CLI Application

```bash
$ <package manager run> build

> rollup-cli@<program> build ~/<program>
> rollup --configPlugin @rollup/plugin-typescript --config rollup.config.ts

loaded rollup.config.ts with warnings
(!) Plugin typescript: @rollup/plugin-typescript TS5110: Option 'module' must be set to 'NodeNext' when option 'moduleResolution' is set to 'NodeNext'.
(!) Plugin typescript: @rollup/plugin-typescript: Rollup 'sourcemap' option must be set to generate source maps.

src/main.ts → dist/lib.cjs, dist/lib.esm.mjs...
created dist/lib.cjs, dist/lib.esm.mjs in 682ms
```

## Additional Resources

A few relevant ones: [Rollup Docs](https://rollupjs.org/introduction/) | [TS-Jest Docs](https://github.com/kulshekhar/ts-jest) | [NodeJS Docs](https://nodejs.org/en/docs) | [TypeScript Docs](https://typescriptlang.org)<br/>
Additional Resources for complete noobs: [JavaScript.Info](https://javascript.info/) ([JP](https://ja.javascript.info/)) | [JavaScript.Info Discord](https://discord.gg/AuEWpFkfD4) | [MDN](https://developer.mozilla.org/) | [MDN HTML Basics](https://developer.mozilla.org/en-US/docs/Learn/HTML) | [MDN JavaScript Basics](https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/JavaScript_basics) | [MDN CSS Basics](https://developer.mozilla.org/en-US/docs/Learn/CSS) | [MDN Command Line Crash Course](https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Understanding_client-side_tools/Command_line) | [W3Schools JavaScript Tutorial](https://www.w3schools.com/js/DEFAULT.asp) | [W3Schools Git Tutorial](https://www.w3schools.com/git/default.asp) | [Github Git Tutorial](https://docs.github.com/en/get-started/using-git)

## License
Copyright <year>  <name of author>.<br/>
Licensed under <license name>.

*This was generated by [`@femboycafe/create`](https://npm.im/@femboycafe/create) (Licensed under the MIT License) & is based on [`create-svelte`](https://github.com/sveltejs/kit/tree/master/packages/create-svelte)'s template*