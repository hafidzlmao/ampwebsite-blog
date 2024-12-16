/// <reference types="astro/client" />
/// <reference types="@astrojs/mdx/client" />

interface ImportMetaEnv {
  readonly PUBLIC_TINYMCE_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}