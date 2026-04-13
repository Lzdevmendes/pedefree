# PedeFree

Sistema de cardápio digital e pedidos online para **fast foods e restaurantes locais**.
Desenvolvido para estabelecimentos da sua cidade que precisam de uma solução segura, moderna e sem mensalidade de plataformas de terceiros.

---

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 15 (App Router) |
| Banco de dados | PostgreSQL 16 (via Docker) |
| ORM | Prisma 6 |
| Estilização | Tailwind CSS + shadcn/ui |
| Autenticação | HMAC-SHA256 + bcryptjs |
| Notificações push | Firebase Cloud Messaging (FCM) |
| Linguagem | TypeScript 5 |
| Infra local | Docker Compose |

---

## Funcionalidades

### Cardápio do cliente
- Cardápio digital acessível por QR code de mesa ou link direto
- Navegação SPA sem recarregamento de página
- Busca de produtos em tempo real
- Badges de destaque: **Novo**, **Mais pedido**, **Promoção**
- Seção de destaques automática para produtos com badge
- Produtos indisponíveis ocultos automaticamente do cardápio
- Status **Aberto / Fechado** dinâmico com base nos horários cadastrados
- Cor primária personalizada por restaurante

### Pedido
- Escolha entre **Comer aqui (Mesa)** ou **Retirar**
- Identificação do cliente: nome, telefone e número da mesa
- Observações por item no carrinho
- Aplicação de **cupom de desconto** (% de desconto, validade, limite de usos)
- Proteção contra uso simultâneo de cupom via transação atômica no banco
- Confirmação com resumo completo do pedido

### Rastreamento em tempo real
- Linha do tempo de status: **Aguardando → Em preparo → Pronto**
- Polling automático a cada 10 segundos (para quando o pedido é finalizado)
- Notificações push via **Firebase Cloud Messaging** quando o status é atualizado
- Aviso de **falha de conexão** exibido após tentativas consecutivas sem resposta
- Aviso imediato caso o pedido seja **cancelado**

### Avaliação pós-pedido
- Formulário de 1 a 5 estrelas disponível após o pedido ser concluído
- Campo de comentário opcional
- Avaliação registrada apenas uma vez por pedido
- Botões de estrela com suporte a leitores de tela (ARIA)

### Histórico de pedidos
- Busca de pedidos por número de telefone do cliente

### Cozinha
- Painel protegido por senha (hash bcrypt por restaurante)
- Colunas: **Aguardando** e **Em preparo**
- Botão para avançar status do pedido
- Botão para **cancelar** pedido (com confirmação)
- Exibe observações por item e número da mesa
- Polling adaptativo: **15s** com pedidos ativos, **30s** quando ocioso

### Gerador de QR Code
- Página para gerar QR codes por número de mesa
- Impressão direta pelo navegador

### Painel Administrativo
- Login seguro (HMAC assinado + bcrypt)
- Cadastro e edição de restaurantes com cor primária, avatar, capa e senha da cozinha
- Gerenciamento de **categorias** do cardápio
- Gerenciamento de **produtos** com badge e toggle de disponibilidade
- CRUD completo de **cupons de desconto** com ativação/desativação
- Configuração de **horários de funcionamento** por dia da semana
- Gestão do **número de mesas**
- **Analytics** por restaurante: faturamento hoje / 7 dias / 30 dias, ticket médio, top 5 produtos, pedidos recentes

### PWA
- App instalável em celular via `manifest.json`
- Meta tags completas para iOS e Android
- Ícones otimizados para tela inicial
- Tema e cor configurados

---

## Segurança

| Ponto | Mecanismo |
|---|---|
| Sessão do admin | Cookie `httpOnly + sameSite:strict` com token **HMAC-SHA256** assinado |
| Senha do admin | `ADMIN_PASSWORD_HASH` (bcrypt) ou `ADMIN_PASSWORD` (plain, só em dev) |
| Senha da cozinha | Hash **bcrypt** armazenado no banco, jamais o texto puro |
| Autenticação da cozinha | Cookie signed por slug, verificado no middleware |
| Middleware | Valida assinatura antes de qualquer rota protegida |
| Cupons | Validação de limite de usos e validade no servidor via transação atômica |

> **Produção**: gere o hash da senha admin com:
> ```bash
> node -e "const b=require('bcryptjs'); b.hash('sua_senha', 10).then(console.log)"
> ```
> Cole o resultado em `ADMIN_PASSWORD_HASH` no `.env` e remova `ADMIN_PASSWORD`.

---

## Como rodar

### Pré-requisitos
- Node.js 20+
- Docker + Docker Compose

### 1. Clone e instale

```bash
git clone <repo>
cd Pedefree
npm install
```

### 2. Configure o ambiente

Copie o `.env.example` e preencha as variáveis:

```bash
cp .env.example .env
```

### 3. Suba o banco

```bash
docker compose up -d
```

### 4. Aplique o schema e seed

```bash
npx prisma db push
npx prisma db seed
```

### 5. Rode o projeto

```bash
npm run dev
```

Acesse: `http://localhost:3000`

---

## Rotas principais

| Rota | Descrição |
|---|---|
| `/` | Página inicial |
| `/{slug}` | Boas-vindas + escolha do método (mesa ou retirada) |
| `/{slug}?consumptionMethod=DINE_IN` | Abre direto no cardápio (via QR code de mesa) |
| `/{slug}/orders/{id}` | Confirmação e rastreamento do pedido |
| `/{slug}/orders` | Histórico por telefone |
| `/{slug}/kitchen` | Painel da cozinha (protegido por senha) |
| `/{slug}/qrcode` | Gerador de QR codes por mesa |
| `/admin` | Painel administrativo |
| `/admin/restaurants/{id}/analytics` | Analytics do restaurante |

---

## Estrutura de pastas

```
src/
├── app/
│   ├── admin/               # Painel administrativo
│   │   └── restaurants/
│   │       └── [id]/
│   │           ├── analytics/  # Dashboard de vendas
│   │           └── edit/
│   ├── api/orders/          # API route de status do pedido
│   └── [slug]/              # Rotas públicas por restaurante
│       ├── restaurant-app.tsx   # SPA wrapper (welcome / menu / orders)
│       ├── menu/            # Cardápio + carrinho
│       ├── kitchen/         # Painel da cozinha
│       ├── orders/          # Histórico e confirmação de pedido
│       └── qrcode/          # Gerador de QR
├── components/ui/           # shadcn/ui
├── contexts/                # Cart context
└── lib/
    ├── prisma.ts            # Client do banco
    ├── session.ts           # HMAC sign/verify
    ├── firebase.ts          # Firebase client (FCM)
    ├── firebase-admin.ts    # Firebase Admin SDK (envio de push)
    ├── use-fcm-token.ts     # Hook para coletar token FCM
    └── utils.ts
prisma/
├── schema.prisma            # Modelos do banco
├── seed.ts                  # Dados iniciais
└── migrations/
```

---

## Variáveis de ambiente

| Variável | Obrigatória | Descrição |
|---|---|---|
| `DATABASE_URL` | Sim | String de conexão PostgreSQL |
| `NEXTAUTH_SECRET` | Sim | Chave para assinar sessões (mín. 32 chars) |
| `ADMIN_EMAIL` | Sim | Email do administrador |
| `ADMIN_PASSWORD` | Dev | Senha em texto plano (só para desenvolvimento) |
| `ADMIN_PASSWORD_HASH` | Produção | Hash bcrypt da senha admin |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Opcional | Chave pública do projeto Firebase |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Opcional | Domínio de autenticação Firebase |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Opcional | ID do projeto Firebase |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Opcional | Bucket de armazenamento Firebase |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Opcional | Sender ID do FCM |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Opcional | App ID do Firebase |
| `NEXT_PUBLIC_FIREBASE_VAPID_KEY` | Opcional | Chave VAPID para Web Push |
| `FIREBASE_PROJECT_ID` | Opcional | ID do projeto (Admin SDK) |
| `FIREBASE_CLIENT_EMAIL` | Opcional | Email da conta de serviço (Admin SDK) |
| `FIREBASE_PRIVATE_KEY` | Opcional | Chave privada da conta de serviço (Admin SDK) |

> As variáveis Firebase são opcionais. Sem elas, o sistema funciona normalmente — apenas sem notificações push.

---

## Roadmap

- [ ] Integração com pagamento (Pix via Mercado Pago ou Stripe)
- [ ] Suporte a múltiplos admins por restaurante (multi-tenant)
- [ ] Upload de imagens integrado
- [ ] Cache offline via Service Worker (PWA completo)

---

## Licença

Uso privado — todos os direitos reservados.
