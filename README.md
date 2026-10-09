# Loja de veículos — Vercel + Supabase

Site estático HTML/CSS/JavaScript hospedado na Vercel. O Supabase fornece banco de dados e armazenamento de fotos. O painel administrativo usa uma senha definida na Vercel, sem exigir e-mail ou usuário do Supabase.

## Variáveis de ambiente na Vercel

Em **Project → Settings → Environment Variables**, configure:

| Nome | Valor | Sensitive? |
|---|---|---|
| `STORE_NAME` | Nome da loja | Não |
| `STORE_SUBTITLE` | Texto abaixo do nome | Não |
| `WHATSAPP_NUMBER` | DDI + DDD + telefone, só números | Não |
| `SUPABASE_URL` | Project URL do Supabase | Não |
| `SUPABASE_PUBLISHABLE_KEY` | Chave publicável (ou use `SUPABASE_ANON_KEY`) para leitura pública do catálogo | Pública |
| `SUPABASE_SERVICE_ROLE_KEY` | Chave secreta de servidor do Supabase | **Sim, secreta** |
| `ADMIN_PASSWORD` | A senha que tu escolher para entrar em `/admin` | **Sim, secreta** |
| `ADMIN_SESSION_SECRET` | Segredo aleatório forte para assinar a sessão; usa pelo menos 32 bytes aleatórios | **Sim, secreta** |

Marca **Production**; marca **Preview** também se fores testar em previews. Nunca use `SUPABASE_SERVICE_ROLE_KEY` em código de navegador ou em variáveis com prefixo público. O endpoint público `/api/config` retorna apenas o nome da loja, WhatsApp, URL e chave publicável — nunca a senha administrativa ou a chave de serviço.

Gera um segredo de sessão longo e aleatório; não reutilizes a senha administrativa para `ADMIN_SESSION_SECRET`. Depois de criar/alterar variáveis, faz um novo deploy.

## Supabase: banco e fotos

1. Cria um projeto Supabase.
2. Executa `supabase/schema.sql` no SQL Editor. Isso cria a tabela `vehicles` e o bucket público `vehicle-photos`.
3. Em Project Settings / API Keys, copia a URL, a chave publicável e a chave de serviço para as variáveis correspondentes na Vercel.
4. O site público lê apenas veículos ativos usando a chave pública e as políticas RLS.
5. As funções da Vercel usam a chave de serviço exclusivamente no servidor para validar a sessão e gerir anúncios/fotos. Não é necessário criar usuário administrador em Supabase Authentication.

## Vercel

- Conecta o repositório `alvaro070599-ctrl/Loja-Carro`, branch `main`.
- É um site estático sem build command.
- `/admin` abre a página de login e pede somente a senha.
- A senha é validada no servidor. A sessão usa cookie HttpOnly, Secure e SameSite=Strict.
- As rotas `/api/admin/*` permitem gerir anúncios e enviar fotos somente com sessão válida.
- As fotos são guardadas no Supabase Storage; não é necessário Vercel Blob.

## Testes

1. Visita `/admin` e entra com `ADMIN_PASSWORD`.
2. Cadastra um carro com fotos, salva e confirma que aparece no catálogo.
3. Testa editar, ocultar, publicar, excluir e sair.
4. Atualiza a página para confirmar que os anúncios continuam salvos.
5. Testa o site no celular e os links do WhatsApp.

A sessão dura 8 horas. Usa uma senha forte e não a compartilha. Para maior proteção em produção, adiciona limitação de tentativas de login/WAF na Vercel.
