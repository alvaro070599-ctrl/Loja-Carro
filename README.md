# Loja K Motors

Site responsivo para catálogo de veículos, com filtros, detalhes de cada carro e painel de administração.

## O que já está incluído
- Página inicial responsiva e catálogo com busca por marca/modelo/versão.
- Filtros por marca, ano mínimo e preço máximo.
- Página/modal de detalhes, informações do veículo e contato por WhatsApp.
- Painel de administração com login via Supabase Auth.
- Cadastro, edição, publicação/ocultação e exclusão de veículos.
- Upload de várias fotos por veículo para o Supabase Storage.
- Banco de dados com políticas de acesso (RLS) no arquivo `supabase/schema.sql`.
- Modo de demonstração sem credenciais (os veículos mostrados são ilustrativos e os cadastros não ficam salvos).

## Estrutura
- `index.html` — site e interface do catálogo/painel.
- `config.js` — URL/chave pública do Supabase e WhatsApp da loja.
- `supabase/schema.sql` — tabelas, políticas de segurança e bucket de fotos.

## Como colocar no ar

### 1. Criar o projeto Supabase
1. Entre em https://supabase.com/ e crie um projeto.
2. No projeto, abra **SQL Editor**, crie uma consulta, cole todo o conteúdo de `supabase/schema.sql` e execute.
3. Abra **Project Settings → API** (ou **Connect**) e copie a Project URL e a chave pública anon/publishable.
4. No GitHub, abra `config.js`, clique no lápis e preencha `supabaseUrl` e `supabaseAnonKey`. Preencha também `whatsapp` com DDI + DDD + número, somente dígitos, por exemplo `5551999999999`.
5. Em **Authentication → Users**, crie o usuário que será administrador. Use o mesmo usuário para cadastrar os veículos, porque as políticas iniciais permitem que cada usuário gerencie os veículos que cadastrou.

> Nunca use a chave `service_role` no navegador. Somente a chave pública anon/publishable deve estar em `config.js`, com RLS ativado.

### 2. Publicar o site
Opção simples: **Vercel**
1. Entre em https://vercel.com/ e escolha **Add New → Project**.
2. Importe o repositório GitHub `alvaro070599-ctrl/Loja-Carro`.
3. Como o site é estático, não precisa de comando de build nem pasta de saída: deixe os campos de build vazios ou use a configuração estática padrão.
4. Depois de publicar, a Vercel vai fornecer um endereço público. Cada novo commit na branch `main` será publicado automaticamente.

Também pode ser publicado pelo GitHub Pages; a Vercel costuma ser mais simples para começar.

## Antes de usar com clientes
- Substitua os carros e fotos ilustrativos por veículos reais cadastrados pela administração.
- Configure o WhatsApp correto em `config.js`.
- Teste login, cadastro, edição, upload e publicação com um veículo de teste.
- Confirme os dados, preços e disponibilidade antes de anunciar.
- A política de administração inicial é intencionalmente simples para uma única conta administradora. Para equipe com vários usuários, vale implementar uma tabela de administradores/roles.

## Observações
O projeto usa HTML/CSS/JavaScript sem etapa de build. O Supabase é necessário para persistência compartilhada de veículos, autenticação do painel e armazenamento permanente de fotos. Sem a configuração, o site abre em modo de demonstração e mostra dados fictícios de exemplo.
