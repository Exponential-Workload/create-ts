import path from 'path';
import defaultMap from './defaultMap';
import { existsSync } from 'fs';
import { mkdir, readFile, writeFile } from 'fs/promises';

const cacheDir = path.resolve(process.env.CACHE_DIR ?? process.env.CACHE ?? process.env.TEMP ?? process.env.TMP ?? (process.env.HOME ? existsSync(path.join(process.env.HOME, '.cache')) ? path.join(process.env.HOME, '.cache') : null : null) ?? '/tmp', 'license-cache');

try {
  if (!existsSync(cacheDir)) {
    console.log('Creating cache directory');
    mkdir(cacheDir, { recursive: true }).catch(e => {
      console.warn('Failed to create license cache directory', e);
    });
  }
} catch (error) { }

const getLicenseFetcher = (() => {
  const hashes = fetch('https://gh.expo.moe/licenses/license-map.json').then(v => v.json()).catch(e => {
    console.error('Failed to fetch license map', e);
    return defaultMap;
  });
  return (name: string, format = 'md') => {
    return async () => {
      const hash = (await hashes)[name][format];
      if (!hash) throw new Error(`No hash found for ${name} in ${format}`);
      try {
        if (existsSync(path.join(cacheDir, hash))) return await readFile(path.join(cacheDir, hash), 'utf-8');
      } catch (error) {
        console.warn('Failed to check for/read cached license', error);
      }
      const license = await fetch(`https://gh.expo.moe/licenses/hashed/${hash}`).then(v => v.text());
      try {
        await writeFile(path.join(cacheDir, hash), license);
      } catch (error) {
        console.warn('Failed to cache license', error);
      }
      return license;
    }
  }
})();

export default ({
  'BEERWARE': getLicenseFetcher('BEER'),
  'MIT': getLicenseFetcher('MIT'),
  'AGPL-3.0-OR-LATER': getLicenseFetcher('AGPL-3.0'),
  'GPL-3.0-OR-LATER': getLicenseFetcher('GPL-3.0'),
  'LGPL-3.0-OR-LATER': getLicenseFetcher('LGPL-3.0'),
  'LGPL-2.0-OR-LATER': getLicenseFetcher('LGPL-2.0'),
  'GPL-2.0-OR-LATER': getLicenseFetcher('GPL-2.0'),
} as Record<string, () => Promise<string>>)
