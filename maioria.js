let carrinho = [];

        
        const btnAdicionar = document.querySelectorAll('.btn-add'); 
        const contadorCarrinho = document.querySelector('.carro'); 
        const modal = document.getElementById('carrinho-modal');
        const listaItens = document.getElementById('itens-carrinho-lista');
        const valorTotalDisplay = document.getElementById('carrinho-valor-total');
        const btnAbrirCarrinho = document.querySelector('.carrin');
        const btnFinalizarCompra = document.getElementById('btn-finalizar-compra'); 

        
        const selectPais = document.getElementById('select-pais');
        const freteValorDisplay = document.getElementById('frete-valor');
        
        
        const RESTAURANTE_PAIS = "Espanha";

        
        const FRETE_VALORES = {
            "Espanha": 25.00, 
            "Portugal": 80.00,
            "França": 95.00,
            "Alemanha": 105.00,
            "Estados Unidos": 150.00,
            "Brasil": 180.00 
        };


        function getValorFrete(pais) {
            
            if (carrinho.length === 0) {
                return 0;
            }
            
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
                
                
                if (btnFinalizarCompra) {
                    btnFinalizarCompra.disabled = true;
                    btnFinalizarCompra.style.opacity = '0.5';
                }
                
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
                
                
                if (btnFinalizarCompra) {
                    btnFinalizarCompra.disabled = false;
                    btnFinalizarCompra.style.opacity = '1';
                }
                
                
                freteValorDisplay.textContent = `Frete: R$ ${valorFrete.toFixed(2).replace('.', ',')}`;
            }
            
            
            valorTotalDisplay.textContent = `R$ ${totalGeral.toFixed(2).replace('.', ',')}`;
        }

        
        selectPais.addEventListener('change', renderizarItensDoCarrinho);


        function finalizarCompra() {
            if (carrinho.length === 0) {
                alert('Seu carrinho está vazio. Adicione itens antes de finalizar a compra!');
                return;
            }

            const totalGeral = calcularTotalItens() + getValorFrete(selectPais.value);
            const totalFormatado = totalGeral.toFixed(2).replace('.', ',');

            
            alert(`Compra no valor total de R$ ${totalFormatado} (incluindo frete) concluída com sucesso! Obrigado pela preferência!`);

            
            carrinho = []; 

            
            fecharModal(); 
            attCarrinho(); 
            
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

        
        listaItens.addEventListener('click', (event) => {
            if (event.target.classList.contains('remove-item-btn')) {
                const nome = event.target.getAttribute('data-nome');
                removerItemDoCarrinho(nome);
            }

        });
