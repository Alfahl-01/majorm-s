let carrinho = [];

        
        const btnAdicionar = document.querySelectorAll('.btn-add'); 
        const contadorCarrinho = document.querySelector('.carro'); 
        const modal = document.getElementById('carrinho-modal');
        const listaItens = document.getElementById('itens-carrinho-lista');
        const valorTotalDisplay = document.getElementById('carrinho-valor-total');
        const btnAbrirCarrinho = document.querySelector('.carrin');
        const btnFinalizarCompra = document.getElementById('btn-finalizar-compra'); 

        // NOVO: Referências aos elementos de Frete
        const selectPais = document.getElementById('select-pais');
        const freteValorDisplay = document.getElementById('frete-valor');
        
        // Dados do restaurante (Madrid, Espanha)
        const RESTAURANTE_PAIS = "Espanha";

        // Valores de frete (em Reais, R$)
        const FRETE_VALORES = {
            "Espanha": 25.00, // Frete Local (Madrid)
            "Portugal": 80.00,
            "França": 95.00,
            "Alemanha": 105.00,
            "Estados Unidos": 150.00,
            "Brasil": 180.00 // Frete para o Brasil
        };


        function getValorFrete(pais) {
            // Se o carrinho estiver vazio, o frete é 0
            if (carrinho.length === 0) {
                return 0;
            }
            // Retorna o valor fixo para o país selecionado, ou um valor padrão (ex: 0) se não for encontrado
            return FRETE_VALORES[pais] || 0; 
        }

        
        function calcularTotalItens() {
            return carrinho.reduce((total, item) => total + (item.preco * item.quantidade), 0);
        }

        
        function abrirModal() {
            renderizarItensDoCarrinho(); 
            modal.style.display = 'flex';
        }

        function fecharModal() {
            modal.style.display = 'none';
        }

        
        function renderizarItensDoCarrinho() {
            listaItens.innerHTML = ''; 
            const totalItens = calcularTotalItens();
            const paisSelecionado = selectPais.value;
            const valorFrete = getValorFrete(paisSelecionado);
            const totalGeral = totalItens + valorFrete;

            if (carrinho.length === 0) {
                listaItens.innerHTML = '<li>O carrinho está vazio.</li>';
                
                // Desativa o botão de compra se o carrinho estiver vazio
                if (btnFinalizarCompra) {
                    btnFinalizarCompra.disabled = true;
                    btnFinalizarCompra.style.opacity = '0.5';
                }
                // Garante que o Frete seja 0 quando o carrinho está vazio
                freteValorDisplay.textContent = 'Frete: R$ 0,00';
            } else {
                carrinho.forEach(item => {
                    const subtotal = item.preco * item.quantidade;
                    const li = document.createElement('li');
                    
                    li.innerHTML = `
                        <span>${item.nome} (${item.quantidade}x)</span>
                        <div class="item-actions">
                            <button class="remove-item-btn" data-nome="${item.nome}">-</button>
                            <span class="item-subtotal">R$ ${subtotal.toFixed(2).replace('.', ',')}</span>
                        </div>
                    `;
                    listaItens.appendChild(li);
                });
                
                // Ativa o botão de compra se houver itens
                if (btnFinalizarCompra) {
                    btnFinalizarCompra.disabled = false;
                    btnFinalizarCompra.style.opacity = '1';
                }
                
                // Exibe o valor do frete
                freteValorDisplay.textContent = `Frete: R$ ${valorFrete.toFixed(2).replace('.', ',')}`;
            }
            
            // Exibe o Total Geral (Itens + Frete)
            valorTotalDisplay.textContent = `R$ ${totalGeral.toFixed(2).replace('.', ',')}`;
        }

        // NOVO: Adiciona listener ao select para atualizar o carrinho quando o país mudar
        selectPais.addEventListener('change', renderizarItensDoCarrinho);


        function finalizarCompra() {
            if (carrinho.length === 0) {
                alert('Seu carrinho está vazio. Adicione itens antes de finalizar a compra!');
                return;
            }

            const totalGeral = calcularTotalItens() + getValorFrete(selectPais.value);
            const totalFormatado = totalGeral.toFixed(2).replace('.', ',');

            // 1. Mostrar mensagem de conclusão
            alert(`Compra no valor total de R$ ${totalFormatado} (incluindo frete) concluída com sucesso! Obrigado pela preferência!`);

            // 2. Resetar o carrinho
            carrinho = []; 

            // 3. Atualizar a UI
            fecharModal(); 
            attCarrinho(); 
            // Garante que a Espanha seja selecionada como padrão ao resetar
            selectPais.value = RESTAURANTE_PAIS; 
        }

        
        function adicionarItem(nome, preco) {
            const itemExistente = carrinho.find(item => item.nome === nome);
            
            if (itemExistente) {
                itemExistente.quantidade += 1;
            } else {
                carrinho.push({ nome: nome, preco: preco, quantidade: 1 });
            }

            attCarrinho();
        }

        
        function attCarrinho() {
            const totalItens = carrinho.reduce((total, item) => total + item.quantidade, 0);
            contadorCarrinho.textContent = totalItens;
        }

        btnAdicionar.forEach(botao => {
            botao.addEventListener('click', (evento) => {
                const card = evento.target.closest('.card');
                const nomeProduto = card.querySelector('.cardT').textContent.trim();
                
                const precoString = card.querySelector('.money').textContent.replace('R$', '').trim().replace(',', '.');
                const precoNumerico = parseFloat(precoString);

                adicionarItem(nomeProduto, precoNumerico);
            });
        });

        
        btnAbrirCarrinho.addEventListener('click', abrirModal);
        
        if (btnFinalizarCompra) {
            btnFinalizarCompra.addEventListener('click', finalizarCompra);
        }

        attCarrinho();

        function removerItemDoCarrinho(nome) {
            const itemIndex = carrinho.findIndex(item => item.nome === nome);

            if (itemIndex > -1) {
                const item = carrinho[itemIndex];

            if (item.quantidade > 1) {
                item.quantidade -= 1;
            } else {
                carrinho.splice(itemIndex, 1);
        }
    }
            attCarrinho();
            renderizarItensDoCarrinho(); 
        }

        // Adiciona um listener de evento para delegar a remoção
        listaItens.addEventListener('click', (event) => {
            if (event.target.classList.contains('remove-item-btn')) {
                const nome = event.target.getAttribute('data-nome');
                removerItemDoCarrinho(nome);
            }
        });