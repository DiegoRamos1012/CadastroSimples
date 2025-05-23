// Interface que representa a resposta do backend (corresponde à struct do Go)

import '@fortawesome/fontawesome-free/css/all.min.css'
interface CadastroResponse {
  nome: string;
  email: string;
  message: string;
}

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
    const senha = formData.get("senha") as string;

    try {
      // Enviar dados para o backend
      const response = await fetch("https://localhost:8080/cadastro", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          nome,
          email,
          senha,
        }),
      });

      if (!response.ok) {
        throw new Error(
          `Erro ao enviar os dados: ${response.status} ${response.statusText}`
        );
      }

      // Obter e processar a resposta
      const responseText = await response.text();
      console.log("Resposta do servidor:", responseText);
      console.log("JSON bruto:", responseText); // Adicione esta linha após receber a resposta

      // Converter para JSON
      let data: CadastroResponse;
      try {
        data = JSON.parse(responseText);
      } catch (jsonError) {
        console.error("Erro ao processar JSON:", jsonError);
        throw new Error("Resposta do servidor não é um JSON válido");
      }

      console.log("Dados processados:", data);

      // Mostrar mensagem de sucesso usando APENAS dados do backend
      mensagemDiv.innerHTML = `
        <div class="sucesso">
            <p>${data.message}</p>
            <p>Nome: ${data.nome}</p>
            <p>Email: ${data.email}</p>
            <p>Senha: ****** (dados sensíveis)</p>
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
                <p>${
                  error instanceof Error
                    ? error.message
                    : "Erro ao processar o cadastro. Tente novamente."
                }</p>
            </div>
        </div>
      `;
    }
  });

  // Funcionalidade para mostrar/ocultar senha
  const senhaInput = document.getElementById("senha") as HTMLInputElement;
  const toggleSenha = document.getElementById("toggleSenha") as HTMLButtonElement;

  if (toggleSenha && senhaInput) {
    toggleSenha.addEventListener("click", () => {
      // Alterna o tipo do input entre password e text
      const isPassword = senhaInput.type === "password";
      senhaInput.type = isPassword ? "text" : "password";
      
      // Alterna o ícone usando classes do Font Awesome
      toggleSenha.innerHTML = isPassword 
        ? '<i class="fa-solid fa-eye"></i>' // Olho fechado quando a senha está visível
        : '<i class="fa-solid fa-eye-slash"></i>';      // Olho aberto quando a senha está oculta
      
      // Alterna a classe para mudar o estilo
      toggleSenha.classList.toggle("visible");
    });
    
    // Define o ícone inicial (olho aberto)
    toggleSenha.innerHTML = '<i class="fas fa-eye"></i>';
  }
});
