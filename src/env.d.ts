/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_SUPABASE_URL: string
  readonly PUBLIC_SUPABASE_ANON_KEY: string
  readonly PUBLIC_TINYMCE_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}