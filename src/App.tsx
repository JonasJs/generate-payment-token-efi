import { useState } from 'react'
import './App.css'
import EfiPay from "payment-token-efi";

function App() {
  // STATES agrupados
  const [accountId, setAccountId] = useState("Identificador_de_conta_aqui");
  const [environment, setEnvironment] = useState<"sandbox" | "production">("sandbox");
  const [paymentToken, setPaymentToken] = useState("");
  const [cardMask, setCardMask] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [cardData, setCardData] = useState({
    brand: "visa",
    number: "",
    cvv: "",
    expirationMonth: "",
    expirationYear: "",
    holderName: "",
    holderDocument: "",
    reuse: false
  });

  // Submeter para gerar token de pagamento
  const handleSubmit = async () => {
    setError("");
    setPaymentToken("");
    setCardMask("");
    setLoading(true);

    try {
      const result: any = await EfiPay.CreditCard
        .setAccount(accountId)
        .setEnvironment(environment)
        .setCreditCardData(cardData)
        .getPaymentToken();

      setPaymentToken(result?.payment_token || "");
      setCardMask(result?.card_mask || "");
    } catch (error: any) {
      setError(error?.error_description || "Erro desconhecido.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardData({ ...cardData, [name]: value });
  };

  // estilos
  const inputStyle: React.CSSProperties = {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "14px",
    outline: "none",
  };

  const selectStyle: React.CSSProperties = {
    ...inputStyle,
    backgroundColor: "#fff"
  };

  const containerStyle: React.CSSProperties = {
    maxWidth: "400px",
    margin: "50px auto",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.05)"
  };

  const buttonStyle: React.CSSProperties = {
    padding: "10px",
    backgroundColor: loading ? "#aaa" : "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    cursor: loading ? "not-allowed" : "pointer"
  };

  const gerarCartao = async () => {
    try {
      setLoading(true);
      setError("");

      const formData = new FormData();
      formData.append("acao", "gerar_cc");
      formData.append("pontuacao", "N");
      formData.append("bandeira", "visa"); // pode usar visa, mastercard, etc
      formData.append("quantidade", "1");
      formData.append("banco", "001");
      formData.append("idade", "25");
  
      const response = await fetch("https://www.4devs.com.br/ferramentas_online.php", {
        method: "POST",
        body: formData
      });
  
      const result = await response.json();
      console.log(result);
  
      // Exemplo: preenchendo seus states com os dados recebidos
      if (result && result[0]) {
        const cartao = result[0];
        setCardData({
          brand: cartao.bandeira,
          number: cartao.numero,
          cvv: cartao.cvv,
          expirationMonth: cartao.mes,
          expirationYear: cartao.ano,
          holderName: `${cartao.nome} ${cartao.sobrenome}`,
          holderDocument: cartao.cpf,
          reuse: false
        });
      }
    } catch (err) {
      setError("Falha ao gerar dados do cartão.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div style={containerStyle}>

      <h2 style={{ textAlign: "center" }}>Pagamento com Cartão</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <input
          type="text"
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)}
          placeholder="Account ID"
          style={inputStyle}
        />

        <select
          value={environment}
          onChange={(e) => setEnvironment(e.target.value as "sandbox" | "production")}
          style={selectStyle}
        >
          <option value="sandbox">Sandbox</option>
          <option value="production">Production</option>
        </select>

        <input type="text" name="number" value={cardData.number} onChange={handleInputChange} placeholder="Número do cartão" style={inputStyle} />
        <input type="text" name="cvv" value={cardData.cvv} onChange={handleInputChange} placeholder="CVV" style={inputStyle} />
        <input type="text" name="expirationMonth" value={cardData.expirationMonth} onChange={handleInputChange} placeholder="Mês de expiração (MM)" style={inputStyle} />
        <input type="text" name="expirationYear" value={cardData.expirationYear} onChange={handleInputChange} placeholder="Ano de expiração (YYYY)" style={inputStyle} />
        <input type="text" name="holderName" value={cardData.holderName} onChange={handleInputChange} placeholder="Nome do titular" style={inputStyle} />
        <input type="text" name="holderDocument" value={cardData.holderDocument} onChange={handleInputChange} placeholder="CPF do titular" style={inputStyle} />

        <button onClick={gerarCartao} style={buttonStyle} disabled={loading}>
          {loading ? "Gerando..." : "Gerar Dados Falsos"}
        </button>

        <button onClick={handleSubmit} style={buttonStyle} disabled={loading}>
          {loading ? "Gerando..." : "Gerar Token de Pagamento"}
        </button>

        {paymentToken && (
          <div style={{ marginTop: "20px", color: "green" }}>
            <p><strong>Token:</strong> {paymentToken}</p>
            <p><strong>Cartão:</strong> {cardMask}</p>
          </div>
        )}

        {error && (
          <div style={{ marginTop: "20px", color: "red" }}>
            <strong>Erro:</strong> {error}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
