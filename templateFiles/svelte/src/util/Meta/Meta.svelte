<!-- Page/Site Meta tags -->
<script lang="ts">
  import {
    TwitterCardTypes,
    type OpenGraphMetaTypes,
    type TwitterMetaTypes,
    type UniversalMetaTypes,
  } from './MetaTypes';

  export let tags: Partial<Record<UniversalMetaTypes, string>> = {};
  export let openGraph: Partial<Record<OpenGraphMetaTypes, string>> = {};
  export let twitter: Partial<Record<TwitterMetaTypes, string>> = {};
  export let additionalMetaTags: Record<string, string | undefined> = {};
  export let bigImage = false;
  export let setTitleIfTitleInTags = true;

  if (bigImage) tags.card = TwitterCardTypes.summaryLargeImage;
  let metaTags: Record<string, string> = {};
  for (const _key of Object.keys(tags)) {
    const key = _key as UniversalMetaTypes;
    const val = tags[key];
    if (val === undefined) delete tags[key];
    else {
      if (!metaTags[`og:${key}`]) metaTags[`og:${key}`] = val;
      if (!metaTags[`twitter:${key}`]) metaTags[`twitter:${key}`] = val;
      metaTags[key] = val;
    }
  }
  metaTags = {
    ...metaTags,
    ...openGraph,
    ...twitter,
    ...additionalMetaTags,
  };
</script>

{#if setTitleIfTitleInTags && metaTags.title}
  <title>{metaTags.title}</title>
{/if}

{#each Object.keys(metaTags) as key}
  {#if typeof metaTags[key] !== 'undefined'}
    <meta name={key} content={metaTags[key]} />
  {/if}
{/each}
