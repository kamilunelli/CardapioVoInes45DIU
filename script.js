/* js menu e carrinho */
const produtos = [
    { id: 1, nome: "Pão Francês", categoria: "paes", preco: 1.20, descricao: "Crosta crocante e miolo macio.", imagem: "images/pao_frances.webp" },
    { id: 2, nome: "Bolo de Fubá", categoria: "bolos", preco: 6.50, descricao: "Receita tradicional da Vó Inês.", imagem: "images/bolo_de_fuba.webp" },
    { id: 3, nome: "Sonho de Creme", categoria: "doces", preco: 4.00, descricao: "Recheado com creme caseiro delicioso.", imagem: "images/sonho_de_creme.webp" },
    { id: 4, nome: "Café Expresso", categoria: "bebidas", preco: 3.00, descricao: "Café forte e aromático.", imagem: "images/cafe_expresso.jpg" },
    { id: 5, nome: "Pão de Queijo", categoria: "paes", preco: 2.50, descricao: "Feito com queijo minas fresco.", imagem: "images/pao_de_queijo.jpg" },
    { id: 6, nome: "Bolo de Chocolate", categoria: "bolos", preco: 8.90, descricao: "Cobertura cremosa e sabor intenso.", imagem: "images/bolo_de_chocolate.webp" },
    { id: 7, nome: "Brigadeiro", categoria: "doces", preco: 2.00, descricao: "O clássico das festas brasileiras.", imagem: "images/brigadeiro.webp" },
    { id: 8, nome: "Suco Natural de Laranja", categoria: "bebidas", preco: 5.00, descricao: "Feito com frutas frescas.", imagem: "images/suco_natural_de_laranja.webp" }
];

const container = document.getElementById('menu-container');
const filterButtons = document.querySelectorAll('.filter-btn');
const cartBtn = document.getElementById('cart-btn');
const cart = document.getElementById('cart');
const cartItemsDiv = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const productModal = document.getElementById('product-modal');
const modalDetails = document.getElementById('modal-details');
const closeBtn = document.querySelector('.close-btn');
const finishOrderBtn = document.getElementById('finish-order-btn');
const minimizeCartBtn = document.getElementById('minimize-cart-btn');

let carrinho = [];

function renderMenu(categoria = 'tudo') {
    container.innerHTML = '';
    const filtrados = categoria === 'tudo' ? produtos : produtos.filter(p => p.categoria === categoria);
    
    // feedback caso não haja produtos
    if (filtrados.length === 0) {
        container.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; padding: 20px;">Nenhum produto encontrado nesta categoria.</p>';
        return;
    }

    filtrados.forEach(produto => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="${produto.imagem}" alt="${produto.nome}">
            <div class="card-content">
                <h3>${produto.nome}</h3>
                <p>${produto.descricao}</p>
                <div class="price">R$ ${produto.preco.toFixed(2)}</div>

                <div class="button-group">
                    <button class="add-btn" onclick="adicionarAoCarrinho(${produto.id})">Adicionar</button>
                    
                    <button class="add-btn ver-detalhes-btn" onclick="mostrarDetalhes(${produto.id})">Ver Detalhes</button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

function adicionarAoCarrinho(id) {
    const produto = produtos.find(p => p.id === id);
    const item = carrinho.find(i => i.id === id);
    if (item) item.qtd++;
    else carrinho.push({ ...produto, qtd: 1 });
    atualizarCarrinho();
}

function atualizarCarrinho() {
    cartItemsDiv.innerHTML = '';
    let total = 0;
    carrinho.forEach(item => {
        total += item.preco * item.qtd;
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <span>${item.nome} x${item.qtd}</span>
            <span>R$ ${(item.preco * item.qtd).toFixed(2)}</span>
        `;
        cartItemsDiv.appendChild(div);
    });
    // uso de template literal no total
    cartTotal.textContent = `Total: R$ ${total.toFixed(2)}`;
    // adiciona estado expandido se o carrinho estiver visivel wcag
    cartBtn.setAttribute('aria-expanded', cart.style.display === 'block');
    
    const cartActions = document.querySelector('.cart-actions');
    if (carrinho.length > 0 && cartActions) {
        cartActions.style.display = 'flex';
    } else if (cartActions) {
        cartActions.style.display = 'none';
    }
}

function mostrarDetalhes(id) {
    const produto = produtos.find(p => p.id === id);
    if (!produto) return;

    document.getElementById('modal-title').textContent = produto.nome;
    document.getElementById('modal-image').src = produto.imagem;
    document.getElementById('modal-image').alt = produto.nome;
    document.getElementById('modal-description').textContent = produto.descricao;
    document.getElementById('modal-price').textContent = `Preço: R$ ${produto.preco.toFixed(2)}`;
    
    const modalAddBtn = document.getElementById('modal-add-btn');
    modalAddBtn.onclick = null; 
    modalAddBtn.onclick = () => {
        adicionarAoCarrinho(produto.id);
        productModal.style.display = 'none'; 
    };

    productModal.style.display = 'flex'; 
    productModal.focus(); 
}

function fecharModal() {
    productModal.style.display = 'none';
}

function finalizarPedido() {
    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }
    // limpa o array
    carrinho = []; 
    atualizarCarrinho();
    alert("Pedido finalizado com sucesso! Seu carrinho foi limpo.");
    cart.style.display = 'none';
    cartBtn.setAttribute('aria-expanded', false);
}

function minimizarCarrinho() {
    cart.style.display = 'none';
    cartBtn.setAttribute('aria-expanded', false);
}

if (finishOrderBtn) {
    finishOrderBtn.addEventListener('click', finalizarPedido);
}

if (minimizeCartBtn) {
    minimizeCartBtn.addEventListener('click', minimizarCarrinho);
}

closeBtn.addEventListener('click', fecharModal);

window.addEventListener('click', (event) => {
    if (event.target === productModal) {
        fecharModal();
    }
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && productModal.style.display === 'flex') {
        fecharModal();
    }
});

filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderMenu(btn.dataset.category);
    });
});

cartBtn.addEventListener('click', () => {
    const isVisible = cart.style.display === 'block'; 
    cart.style.display = isVisible ? 'none' : 'block';
    
    // novo estado para leitores de tela wcag
    cartBtn.setAttribute('aria-expanded', !isVisible); 
    
    // move o foco para o carrinho quando aberto wcag
    if (!isVisible) {
         
         cart.setAttribute('tabindex', '-1'); 
         cart.focus();
    }
});


renderMenu();

document.addEventListener('DOMContentLoaded', () => {
    atualizarCarrinho(); 
});