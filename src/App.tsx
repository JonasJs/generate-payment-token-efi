import { useState } from 'react'
import './App.css'
import EfiPay from "payment-token-efi";

function App() {
  const [accountId, setAccountId] = useState("Identificador_de_conta_aqui");
  const [environment, setEnvironment] = useState<"sandbox" | "production">("sandbox");

  const [cardData, setCardData] = useState({
    brand: "visa",
    number: "4485785674290087",
    cvv: "123",
    expirationMonth: "05",
    expirationYear: "2029",
    holderName: "Gorbadoc Oldbuck",
    holderDocument: "94271564656",
    reuse: false
  });

  const [paymentToken, setPaymentToken] = useState("");
  const [cardMask, setCardMask] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardData({ ...cardData, [name]: value });
  };

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
