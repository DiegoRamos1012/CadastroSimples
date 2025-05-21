document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("cadastroForm") as HTMLFormElement;
  const mensagemDiv = document.getElementById("mensagem") as HTMLDivElement;

  if (!form || !mensagemDiv) {
    console.error("Elementos do formulário não encontrados");
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Obter os dados do formulário
    const formData = new FormData(form);
    const nome = formData.get("nome") as string;
    const email = formData.get("email") as string;

    try {
      // Enviar dados para o backend
      const response = await fetch("http://localhost:8080/cadastro", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          nome,
          email,
        }),
      });

      console.log("Status da resposta:", response.status);
      
      if (!response.ok) {
        throw new Error(`Erro ao enviar os dados: ${response.status} ${response.statusText}`);
      }

      // Debugar o corpo da resposta
      const responseText = await response.text();
      console.log("Resposta do servidor:", responseText);
      
      // Tentar converter a resposta para JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (jsonError) {
        console.error("Erro ao processar JSON:", jsonError);
        throw new Error("Resposta do servidor não é um JSON válido");
      }

      console.log("Dados processados:", data);

      // Mostrar mensagem de sucesso
      mensagemDiv.innerHTML = `
        <div class="sucesso">
            <p>${data.message || 'Cadastro realizado com sucesso!'}</p>
            <p>Nome: ${data.nome || nome}</p>
            <p>Email: ${data.email || email}</p>
        </div>
      `;

      // Limpar o formulário
      form.reset();
    } catch (error) {
      console.error("Erro completo:", error);
      mensagemDiv.innerHTML = `
        <div class="erro erro-animada">
            <div class="erro-icon">⚠️</div>
            <div class="erro-content">
                <h4>Falha no Cadastro</h4>
                <p>${error instanceof Error ? error.message : 'Erro ao processar o cadastro. Tente novamente.'}</p>
            </div>
        </div>
      `;
    }
  });
});
