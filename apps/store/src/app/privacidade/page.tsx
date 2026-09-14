import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidade — PedeFree",
  robots: { index: false },
};

const PrivacyPolicyPage = () => {
  return (
    <div className="mx-auto max-w-2xl space-y-6 px-5 py-10 text-sm leading-relaxed text-foreground">
      <div className="rounded-xl border border-yellow-400 bg-yellow-50 p-4 text-xs text-yellow-900">
        <strong>Aviso interno — remover antes de publicar:</strong> os trechos marcados com{" "}
        <code>[PENDENTE]</code> precisam ser preenchidos com dados reais da empresa e revisados
        por um advogado antes desta página ir ao ar.
      </div>

      <h1 className="text-2xl font-bold">Política de Privacidade</h1>
      <p className="text-muted-foreground">Última atualização: [PENDENTE — data de publicação]</p>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">1. Quem somos</h2>
        <p>
          O PedeFree é operado por <strong>[PENDENTE — razão social]</strong>, inscrita no CNPJ{" "}
          <strong>[PENDENTE — CNPJ]</strong>. Para dúvidas sobre esta política ou sobre o
          tratamento dos seus dados, entre em contato com nosso encarregado de dados (DPO) em{" "}
          <strong>[PENDENTE — e-mail do encarregado]</strong>.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">2. Quais dados coletamos</h2>
        <p>Ao fazer um pedido pelo cardápio digital, coletamos:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Nome do cliente</li>
          <li>Telefone (obrigatório para pedidos para retirada)</li>
          <li>Número da mesa (para pedidos no local)</li>
          <li>Itens do pedido e observações adicionadas por você</li>
          <li>Avaliação e comentário sobre o pedido, se você optar por avaliar</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">3. Por que tratamos esses dados</h2>
        <p>
          Tratamos esses dados com base na execução do contrato de compra (art. 7º, V da LGPD) —
          para processar seu pedido e permitir que o restaurante entre em contato caso necessário
          — e, quando aplicável, no seu consentimento (art. 7º, I), coletado no momento do
          checkout.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">4. Com quem compartilhamos seus dados</h2>
        <p>Seus dados podem ser processados pelos seguintes prestadores de serviço (subprocessadores):</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong>Banco de dados:</strong> os dados do pedido são armazenados em um banco de
            dados PostgreSQL operado por <strong>[PENDENTE — provedor de hospedagem]</strong>.
          </li>
          <li>
            <strong>Notificações push:</strong> usamos o Firebase Cloud Messaging (Google) para
            avisar sobre o andamento do seu pedido, caso você autorize notificações no navegador.
          </li>
          <li>
            <strong>Armazenamento de imagens:</strong> fotos de produtos e do restaurante são
            hospedadas via Uploadthing.
          </li>
        </ul>
        <p>Não vendemos seus dados a terceiros.</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">5. Por quanto tempo guardamos seus dados</h2>
        <p>
          [PENDENTE — definir prazo de retenção do histórico de pedidos e critério de exclusão]
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">6. Seus direitos</h2>
        <p>
          Conforme a Lei Geral de Proteção de Dados (Lei 13.709/2018), você pode solicitar a
          qualquer momento a confirmação, correção, exclusão ou exportação dos seus dados pessoais
          tratados pelo restaurante. Para exercer esses direitos, envie um e-mail para{" "}
          <strong>[PENDENTE — canal de atendimento]</strong>.
        </p>
      </section>
    </div>
  );
};

export default PrivacyPolicyPage;
