# Loja de veículos — Vercel + Supabase

Site estático em HTML, CSS e JavaScript, hospedado na Vercel. O Supabase fornece autenticação, banco de dados e armazenamento das fotos.

## Variáveis de ambiente da Vercel

No painel da Vercel, abra **Project → Settings → Environment Variables** e crie estas variáveis. Marque **Production** e, se quiser testar versões de prévia, também **Preview**.

| Nome | Valor |
|---|---|
| `STORE_NAME` | Nome comercial exibido no site (ex.: Minha Loja Veículos) |
| `STORE_SUBTITLE` | Texto curto abaixo do nome (ex.: Seminovos selecionados) |
| `WHATSAPP_NUMBER` | DDI + DDD + telefone, somente números (ex.: 5551999999999) |
| `SUPABASE_URL` | Project URL do Supabase |
| `SUPABASE_PUBLISHABLE_KEY` | Chave publicável do Supabase. Se o projeto fornecer a chave anon legada, use `SUPABASE_ANON_KEY` no lugar. |

Não crie as duas variáveis de chave ao mesmo tempo, a menos que saiba qual delas o projeto está usando. O endpoint `/api/config` retorna somente valores públicos necessários ao navegador. **Nunca** cadastre `service_role`, chaves secretas ou senha do banco para exposição no frontend.

Depois de salvar ou alterar variáveis, faça um novo deploy em **Deployments → Redeploy** ou envie um novo commit.

## Supabase: banco e fotos

1. Crie um projeto Supabase.
2. No **SQL Editor**, execute todo o conteúdo de `supabase/schema.sql`.
3. Em **Authentication → Users**, crie o usuário administrador.
4. Copie a Project URL e a chave publicável (ou anon legada) para as variáveis da Vercel.
5. Use o mesmo usuário administrador para gerenciar os anúncios; as políticas iniciais limitam a gestão ao usuário que criou cada veículo.

O projeto usa o **Supabase Storage** no bucket público `vehicle-photos` para as imagens. Não precisa configurar Vercel Blob: usar o armazenamento do Supabase mantém fotos, autenticação e banco de dados no mesmo serviço. O bucket e as políticas são criados pelo SQL, caso as permissões permitam executar o script.

## Vercel: deploy

- Conecte o repositório `alvaro070599-ctrl/Loja-Carro` e a branch `main`.
- Como a página usa HTML/CSS/JS sem compilação, não é necessário comando de build nem Output Directory personalizado; mantenha a configuração estática padrão.
- O arquivo `api/config.js` é uma função Vercel que fornece as variáveis públicas em tempo de execução.
- O arquivo `vercel.json` faz `/admin` carregar a aplicação; o painel administrativo não aparece como botão na página inicial.
- Depois de publicar, abra `https://SEU-DOMINIO/admin` para entrar no painel.

## Cadastro e teste

1. Acesse `/admin`, entre com o usuário criado no Supabase.
2. Cadastre um veículo com pelo menos uma foto.
3. Confirme que aparece no catálogo público.
4. Atualize a página para confirmar que o cadastro persiste.
5. Teste editar, ocultar, publicar e excluir um veículo.
6. Teste o site no celular e o contato por WhatsApp.

Não cadastre anúncios fictícios como estoque real. Sem configuração do Supabase, o catálogo permanece vazio e o painel informa o que falta configurar.
