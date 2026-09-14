import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Termos de Uso — PedeFree",
  robots: { index: false },
};

const TermsOfServicePage = () => {
  return (
    <div className="mx-auto max-w-2xl space-y-6 px-5 py-10 text-sm leading-relaxed text-foreground">
      <div className="rounded-xl border border-yellow-400 bg-yellow-50 p-4 text-xs text-yellow-900">
        <strong>Aviso interno — remover antes de publicar:</strong> os trechos marcados com{" "}
        <code>[PENDENTE]</code> precisam ser preenchidos com dados reais da empresa e revisados
        por um advogado antes desta página ir ao ar.
      </div>

      <h1 className="text-2xl font-bold">Termos de Uso</h1>
      <p className="text-muted-foreground">Última atualização: [PENDENTE — data de publicação]</p>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">1. Sobre o serviço</h2>
        <p>
          O PedeFree é uma plataforma de cardápio digital que permite visualizar o menu de um
          restaurante e fazer pedidos para consumo no local ou retirada. O PedeFree é operado por{" "}
          <strong>[PENDENTE — razão social]</strong>, CNPJ <strong>[PENDENTE — CNPJ]</strong>.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">2. Responsabilidade pelo pedido</h2>
        <p>
          O restaurante exibido em cada cardápio é o responsável pela produção, preços,
          disponibilidade dos produtos e atendimento ao pedido. O PedeFree fornece apenas a
          plataforma tecnológica de exibição do cardápio e recebimento de pedidos.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">3. Pagamento</h2>
        <p>
          [PENDENTE — descrever a forma de pagamento aceita pelo restaurante (presencial, online,
          etc.), já que o checkout atual não processa pagamento diretamente na plataforma]
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">4. Cancelamento</h2>
        <p>
          Pedidos podem ser cancelados enquanto estiverem com status &quot;Aguardando&quot; ou
          &quot;Em preparo&quot;, diretamente pela página de acompanhamento do pedido. Após o
          início da produção, o restaurante pode não aceitar o cancelamento.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">5. Privacidade</h2>
        <p>
          O uso dos seus dados pessoais é descrito na nossa{" "}
          <Link href="/privacidade" className="underline">
            Política de Privacidade
          </Link>
          .
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">6. Contato</h2>
        <p>
          Dúvidas sobre estes termos podem ser enviadas para{" "}
          <strong>[PENDENTE — canal de atendimento]</strong>.
        </p>
      </section>
    </div>
  );
};

export default TermsOfServicePage;
