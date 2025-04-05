"use client"

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { CircleAlert, Copy, Check } from "lucide-react";
import { generateValidCardNumber, generateValidCPF, generateHolderName, generateCVV, generateExpirationDate } from "@/lib/card.utils";

export default function Home() {
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [paymentToken, setPaymentToken] = useState("");
  const [cardMask, setCardMask] = useState("");
  const [accountId, setAccountId] = useState("");
  const [environment, setEnvironment] = useState<"production" | "sandbox">("sandbox");
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

  const handleCopy = async (text: string, type: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedToken(type);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const handleSubmit = async () => {
    setError("");
    setPaymentToken("");
    setCardMask("");
    setLoading(true);

    try {
      const EfiPay = (await import("payment-token-efi")).default;
      const result = await EfiPay.CreditCard
        .setAccount(accountId)
        .setEnvironment(environment)
        .setCreditCardData(cardData)
        .getPaymentToken() as { payment_token?: string; card_mask?: string };

      setPaymentToken(result?.payment_token || "");
      setCardMask(result?.card_mask || "");
    } catch (error: unknown) {
      if (error && typeof error === "object" && "error_description" in error) {
        setError((error as { error_description: string }).error_description);
      } else {
        setError("Erro desconhecido.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === "expiration") {
      const [month, year] = value.split("/");
      setCardData({
        ...cardData,
        expirationMonth: month || "",
        expirationYear: year || ""
      });
    } else {
      setCardData({ ...cardData, [name]: value });
    }
  };

  const gerarCartao = async () => {
    try {
      setLoading(true);
      setError("");
      // Gera os dados do cartão
      const cardNumber = generateValidCardNumber();
      const holderDocument = generateValidCPF();
      const holderName = generateHolderName();
      const cvv = generateCVV();
      const expiration = generateExpirationDate();

      setCardData({
        brand: "visa",
        number: cardNumber,
        cvv: cvv,
        expirationMonth: expiration.month,
        expirationYear: expiration.year,
        holderName: holderName,
        holderDocument: holderDocument,
        reuse: false
      });
    } catch{
      setError("Falha ao gerar dados do cartão.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full justify-center items-center">
      <h1 className="text-2xl mb-6">Gerar payment_token</h1>
      <Card className="w-3xl max-3xl flex max-w-md flex-col gap-4">
        <CardContent className="flex flex-col gap-4">
          <div>
            <div className="flex flex-1 flex-col gap-2">
              <div className="flex items-center gap-1">
                <Label>Identificador de conta</Label>
                <CircleAlert size={12} />

                <Button variant="link" className="h-0">
                  <a target="_blank" href="https://efipay.github.io/js-payment-token-efi/assets/img/local-identificador-de-conta.png">
                  onde encontro?
                  </a>
                </Button>
              </div>
              <Input
                placeholder="Identificador de conta"
                name="accountId"
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
              />
            </div>
          </div>
          <div>
            <fieldset className="flex flex-col gap-3">
              <legend className="text-sm font-medium ">Ambiente</legend>
              <p className="text-muted-foreground text-sm">
                Selecione o ambiente para gerar o payment token.
              </p>
              <RadioGroup
                value={environment}
                onValueChange={(value: "production" | "sandbox") => setEnvironment(value)}
                defaultValue="sandbox"
                className="grid gap-3 md:grid-cols-2"
              >
                <Label
                  className="has-[[data-state=checked]]:border-ring has-[[data-state=checked]]:bg-input/30 flex items-start gap-3 rounded-lg border p-3"
                >
                  <RadioGroupItem
                    value="sandbox"
                    id="sandbox"
                    className="data-[state=checked]:border-primary"
                  />
                  <div className="grid gap-1 font-normal">
                    <div className="font-medium">Sandbox</div>
                    <div className="text-muted-foreground pr-2 text-xs leading-snug text-balance">
                      Ambiente de testes para desenvolvimento e homologação
                    </div>
                  </div>
                </Label>
                <Label
                  className="has-[[data-state=checked]]:border-ring has-[[data-state=checked]]:bg-input/30 flex items-start gap-3 rounded-lg border p-3"
                >
                  <RadioGroupItem
                    value="production"
                    id="production"
                    className="data-[state=checked]:border-primary"
                  />
                  <div className="grid gap-1 font-normal">
                    <div className="font-medium">Produção</div>
                    <div className="text-muted-foreground pr-2 text-xs leading-snug text-balance">
                      Ambiente de produção para transações reais
                    </div>
                  </div>
                </Label>
              </RadioGroup>
            </fieldset>
          </div>
          <div className="flex flex-col gap-3 md:flex-row">
            <div className="flex flex-1 flex-col gap-2">
              <Label htmlFor="holderName">Nome</Label>
              <Input
                id="holderName"
                name="holderName"
                value={cardData.holderName}
                onChange={handleInputChange}
                placeholder="Nome completo"
              />
            </div>
            <div className="flex flex-1 flex-col gap-2">
              <Label htmlFor="holderDocument">CPF</Label>
              <Input
                id="holderDocument"
                name="holderDocument"
                value={cardData.holderDocument}
                onChange={handleInputChange}
                placeholder="000.000.000-00"
              />
            </div>
          </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="card-number">Card Number</Label>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-[1fr_80px_60px]">
              <Input
                id="card-number"
                name="number"
                value={cardData.number}
                onChange={handleInputChange}
                placeholder="1234 1234 1234 1234"
                className="col-span-2 md:col-span-1"
              />
              <Input
                id="card-number-expiry"
                name="expiration"
                value={`${cardData.expirationMonth}${cardData.expirationYear ? "/" + cardData.expirationYear : ""}`}
                onChange={handleInputChange}
                placeholder="MM/YY"
                className="col-span-1"
              />
              <Input
                id="card-number-cvc"
                name="cvv"
                value={cardData.cvv}
                onChange={handleInputChange}
                placeholder="CVC"
              />
            </div>
          </div>
          
        </CardContent>
        <Separator className="my-4" />
        <CardFooter className="flex justify-between">
          <Button variant="secondary" onClick={gerarCartao} disabled={loading}>
            {loading ? "Gerando..." : "  Gerar cartão de teste"}
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Gerando..." : "Gerar payment_token"}
          </Button>
        </CardFooter>
      </Card>

      {error && (
        <div className="mt-4 w-3xl max-3xl flex max-w-md p-4 text-red-500 bg-red-50 rounded-lg">
          {error}
        </div>
      )}

      <Card className="mt-4 w-3xl max-3xl flex max-w-md flex-col gap-4">
        <CardContent>
          <div className="flex flex-col gap-4">
            <div>
              <div className="flex items-center justify-between mb-0">
                <h2 className="text-md font-medium">Payment Token</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => handleCopy(paymentToken || "", "token")}
                >
                  {copiedToken === "token" ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  <span className="sr-only">Copy token</span>
                </Button>
              </div>
              <p className="text-muted-foreground text-sm font-mono">{paymentToken || ""}</p>
            </div>
            <div>
              <div className="flex items-center justify-between mb-0">
                <h2 className="text-md font-medium mb-0">Máscara do cartão</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => handleCopy(cardMask || "", "mask")}
                >
                  {copiedToken === "mask" ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  <span className="sr-only">Copy card mask</span>
                </Button>
              </div>
              <p className="text-muted-foreground text-sm font-mono">{cardMask || ""}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


