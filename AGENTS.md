# Guia de Contexto para IA (AGENTS.md)

Este documento serve como guia principal para agentes de IA que atuarem neste repositório.

## Arquitetura
O projeto `Pedefree` utiliza uma arquitetura monorepo com as seguintes aplicações:
- `apps/admin`: Painel administrativo em Next.js para gerenciamento de restaurantes, cardápios e relatórios.
- `apps/store`: PWA em Next.js voltado para o consumidor final, onde podem realizar pedidos (mesa, retirada) lendo um QR Code.
- `packages/shared`: Código compartilhado, regras de negócio e tipagens.

## Princípios (Clean Code e SOLID)
- **SRP (Single Responsibility Principle)**: Mantenha componentes pequenos. Hooks e funções utilitárias devem fazer apenas uma coisa.
- **Camadas**: A lógica de acesso ao banco (Prisma) e ações complexas devem estar isoladas de componentes de interface. Componentes chamam hooks ou Server Actions.
- **Resiliência**: Qualquer chamada de rede deve considerar instabilidade. Use timeouts e retries. Ao realizar mutações, previna múltiplos cliques (debounce/estado de loading).

## Dependências
Consulte `docs/architecture.md` e `docs/database.md` para entender as tabelas e o fluxo de dados do Supabase/Prisma.

## Padrões de Código
- **Idioma**: O código, tipagens e comentários técnicos devem estar em inglês. Variáveis de exibição (strings na UI) em pt-BR.
- **Testes**: Código novo de regras de negócios (`packages/shared`, `lib`) DEVE ter cobertura de testes com Vitest.

---
> **Nota para IAs**: Ao modificar a lógica de negócios, inclua testes unitários correspondentes e adicione JSDoc às funções exportadas.
