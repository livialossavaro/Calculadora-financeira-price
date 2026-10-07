const formulario = document.getElementById("financing-form");

const valor = document.getElementById("valor");
const entrada = document.getElementById("entrada");
const prazo = document.getElementById("prazo");
const juros = document.getElementById("juros");

const resultadoFinanciado = document.getElementById("valor-financiado");
const resultadoParcela = document.getElementById("valor-parcela");
const resultadoQuantidadeParcelas = document.getElementById("quantidade-parcelas");
const resultadoAmortizacao = document.getElementById("amortizacao-inicial");
const resultadoTaxaMensal = document.getElementById("taxa-mensal");
const resultadoTaxaAnual = document.getElementById("taxa-anual");
const resultadoTotalJuros = document.getElementById("total-juros");
const resultadoCustoTotal = document.getElementById("custo-total");
const tabelaBody = document.getElementById("table-body");


function formatarMoeda(input) {

    let valor = input.value;

    valor = valor.replace(/\D/g, "");

    if (valor === "") {
        input.value = "";
        return;
    }

    valor = Number(valor) / 100;

    input.value = valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function converterParaNumero(valor) {

    return Number(
        valor
            .replace("R$", "")
            .replace(/\./g, "")
            .replace(",", ".")
            .trim()
    );

}

valor.addEventListener("input", function() {
    formatarMoeda(valor);
});

entrada.addEventListener("input", function() {
    formatarMoeda(entrada);
});


formulario.addEventListener("submit", function(event) {

    event.preventDefault();

    const valorImovel = converterParaNumero(valor.value);
    const valorEntrada = converterParaNumero(entrada.value);

    const numeroParcelas = Number(prazo.value);
    const taxaJuros = Number(juros.value);

    if (taxaJuros <= 0) {
    alert("A taxa de juros deve ser maior que 0%.");
    return;
}

    const valorFinanciado = valorImovel - valorEntrada;

    const taxaMensal = taxaJuros / 100;

    const parcela = valorFinanciado *
        (taxaMensal * Math.pow(1 + taxaMensal, numeroParcelas)) /
        (Math.pow(1 + taxaMensal, numeroParcelas) - 1);

    const jurosInicial = valorFinanciado * taxaMensal;

    const amortizacaoInicial = parcela - jurosInicial;

    const totalPago = parcela * numeroParcelas;

    const totalJuros = totalPago - valorFinanciado;

    const taxaAnual = (Math.pow(1 + taxaMensal, 12) - 1) * 100;

tabelaBody.innerHTML = "";

let saldoDevedor = valorFinanciado;

for (let i = 1; i <= numeroParcelas; i++) {

    const jurosParcela = saldoDevedor * taxaMensal;

    const amortizacao = parcela - jurosParcela;

    const saldoFinal = saldoDevedor - amortizacao;

    const linha = document.createElement("tr");

    linha.innerHTML = `
        <td>${i}</td>
        <td>${saldoDevedor.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })}</td>
        <td>${jurosParcela.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })}</td>
        <td>${amortizacao.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })}</td>
        <td>${parcela.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })}</td>
        <td>${saldoFinal.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })}</td>
    `;

    tabelaBody.appendChild(linha);

    saldoDevedor = saldoFinal;
}

    resultadoFinanciado.textContent = valorFinanciado.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    resultadoParcela.textContent = parcela.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    resultadoQuantidadeParcelas.textContent = numeroParcelas;

    resultadoAmortizacao.textContent = amortizacaoInicial.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    resultadoTaxaMensal.textContent = taxaJuros.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }) + "% a.m.";

    resultadoTaxaAnual.textContent = taxaAnual.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }) + "% a.a.";

    resultadoTotalJuros.textContent = totalJuros.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    resultadoCustoTotal.textContent = (valorImovel + totalJuros).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

});