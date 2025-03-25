const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")//
const cartCounter = document.getElementById("cart-count")// Elemento para exibir a quantidade de itens no carrinho
const errorWarn = document.getElementById("error-warn") // Elemento para exibir a mensagem de erro/warn
const addressInput = document.getElementById("address")   // Elemento de entrada de endereço de entrega
const addressWarn = document.getElementById("address-warn") // Elemento para exibir a mensagem de erro/warn
const deliveryMethodSelect = document.getElementById("delivery-method");
const paymentMethodSelect = document.getElementById("payment-method");
const pixDetailsDiv = document.getElementById("pix-details");
const addressLabel = document.getElementById("address-label");
const copyPixKeyButton = document.getElementById("copy-pix-key");
const pixKey = document.getElementById("pix-key");

const productForm = document.getElementById("product-form");
const menuDiv = document.getElementById("menu");

const adminPanel = document.getElementById("admin-panel");
const adminButton = document.getElementById("admin-button");



const closeAdminPanelButton = document.getElementById("close-admin-panel");

adminButton.addEventListener("click", function () {
    const password = prompt("Digite a senha de administrador:");
    if (password === "123456") { // Substitua "suaSenha" por uma senha segura
        adminPanel.classList.remove("hidden");
    } else {
        alert("Senha incorreta.");
    }
});

productForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const productName = document.getElementById("product-name").value;
    const productPrice = document.getElementById("product-price").value;
    const productDescription = document.getElementById("product-description").value;
    const productImage = document.getElementById("product-image").files[0];
    const productType = document.getElementById("product-type").value;

    if (productImage) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const imageUrl = e.target.result;
            addProductToMenu(productName, productPrice, productDescription, imageUrl, productType);
        };
        reader.readAsDataURL(productImage);
    } else {
        addProductToMenu(productName, productPrice, productDescription, null, productType);
    }

    alert("Produto adicionado com sucesso!");
    productForm.reset();
});

closeAdminPanelButton.addEventListener("click", function () {
    adminPanel.classList.add("hidden");
});



function addProductToMenu(name, price, description, imageUrl, type) {
    const productDiv = document.createElement("div");
    productDiv.classList.add("flex", "gap-5");

    let imageHtml = "";
    if (imageUrl) {
        imageHtml = `<img src="${imageUrl}" alt="${name}" class="w-28 h-28 rounded-lg hover:scale-110 hover:-rotate-12 duration-300"/>`;
    } else {
        imageHtml = `<img src="./assets/default-product.png" alt="${name}" class="w-28 h-28 rounded-lg hover:scale-110 hover:-rotate-12 duration-300"/>`;
    }

    productDiv.innerHTML = `
        ${imageHtml}
        <div>
            <p class="font-bold">${name}</p>
            <p class="text-sm">${description}</p>
            <div class="flex items-center gap-2 justify-between mt-3">
                <p class="font-bold text-lg">R$ ${price}</p>
                <button class="bg-gray-900 px-5 rounded add-to-cart-btn" data-name="${name}" data-price="${price}">
                    <i class="fa fa-cart-plus text-lg text-white"></i>
                </button>
            </div>
        </div>
    `;

    if (type === "sandwich") {
        menuDiv.querySelector("main").appendChild(productDiv);
    } else if (type === "drink") {
        menuDiv.querySelectorAll("div.grid")[1].appendChild(productDiv);
    }
}



let cart = []

//
deliveryMethodSelect.addEventListener("change", function () {
    if (deliveryMethodSelect.value === "pickup") {
        addressInput.classList.add("hidden");
        addressLabel.classList.add("hidden");
        addressWarn.classList.add("hidden");
    } else {
        addressInput.classList.remove("hidden");
        addressLabel.classList.remove("hidden");
    }
});

// Função exibir o modal do carrinho
cartBtn.addEventListener("click", function () {
    updateCartModal();
    cartModal.style.display = "flex"
    
});
//fechar  modal do carrinho qyando clicar fora dele 
window.addEventListener("click", function (event) {
    if (event.target == cartModal) {
        cartModal.style.display = "none"
    }       
})
//fechar  modal do carrinho qyando clicar no botão de fechar
closeModalBtn.addEventListener("click", function () {
    cartModal.style.display = "none"
});
menu.addEventListener("click", function (event) {
    // Função para saber onde foi o click do usuário
    let parentButton = event.target.closest(".add-to-cart-btn")
    //console.log(parentButton)
   if (parentButton) {
  
    const name = parentButton.getAttribute("data-name") // Obter o atributo data-name do botão clicadoquerySelector(".data-name")
    const price = parseFloat(parentButton.getAttribute("data-price")) // Obter o atributo data-price do botão clicadoproduct.querySelector(".data-price")
   
    //adicionar o item ao carrinho
    addToCart(name, price)
   }    
})
function addToCart(name, price) {

    // Verificar se o item já está no carrinho
    const existingItem = cart.find(item => item.name === name)     
    //alert("Item " + name + "adicionado ao carrinho!") 
    Toastify({
        text: "Item " + name + " " + "adicionado ao carrinho!",
        duration: 2000,
        close: true,
        gravity: "top",
        position: "center",
        stopOnFocus: true,
        style: {
            background: "#00FA9A",
        },
        onClick: function () {},
    }).showToast();
    

    if (existingItem) {
        // Se o item já está no carrinho, incrementar a quantidade
        existingItem.quantity +=1;
    } else {
        cart.push({
            name,
            price,
            quantity: 1 })
    }  
    updateCartModal()
}

//Atualizar a exibição do carrinho
function updateCartModal() {
    cartItemsContainer.innerHTML = "";
    let total = 0
    cart.forEach(item => {
        const cartItemElement = document.createElement("div")
        cartItemElement.classList.add("flex","justify-between", "mb-4", "flex-col")

        cartItemElement.innerHTML = `
        <div class="flex items-center justify-between">            
            <div>                
                <p class="font-medium">${item.name}</p>
                <p> Qtd: ${item.quantity}</p>
                <p class="font-medium mt-2"> R$ ${item.price.toFixed(2)}</p>                
            </div>
            <button class="remove-from-cart-btn" data-name="${item.name}">
                Remover
            </button>     
        </div 
        `
        total += item.price * item.quantity
        cartItemsContainer.appendChild(cartItemElement)
    })      
    cartTotal.textContent = total.toLocaleString("pt-BR", 
        {style: "currency", 
        currency: "BRL"
    });
    cartCounter.innerHTML = cart.length
}
    
// removr item do carrinho
cartItemsContainer.addEventListener("click", function (event) {
    if (event.target.classList.contains("remove-from-cart-btn")) {
        const name = event.target.getAttribute("data-name") // Obter o atributo data-name do botão clicado(".flex").querySelector("p").textContent
        removeItemCart(name);
    }
})

 function removeItemCart(name) {
    const index = cart.findIndex(item => item.name === name);// Encontrar o índice do item no carrinho onde o nome do item seja igual ao nome selecionado (item => significa      
        if (index !== -1) {
            const item = cart[index];

            if (item.quantity > 1) {
                item.quantity -= 1;
                updateCartModal() 
                return                
            }          
        }
    cart.splice(index, 1);
    updateCartModal()
}


addressInput.addEventListener("input", function(event){   
    let inputValue = event.target.value;

    if (inputValue !== "") {
        addressWarn.classList.add("hidden")
        addressInput.classList.remove("border-red-500") 
    }
})  

checkoutBtn.addEventListener("click", function () {
    const isOpen = checRestauranteOpen();
    if (!isOpen) {
        Toastify({
            text: "Estamos Fechados no Momento - Funcionamos de SEG a DOM - 18:00 - 22:00",
            duration: 5000,
            close: true,
            gravity: "top",
            position: "center",
            stopOnFocus: true,
            style: {
                background: "#ef4444",
            },
            onClick: function () {},
        }).showToast();
        return;
    }

    if (cart.length === 0) return;

    const deliveryMethod = deliveryMethodSelect.value;

    if (deliveryMethod === "delivery") {
        // Se o método de entrega for "delivery", valide o endereço
        if (addressInput.value === "") {
            addressWarn.classList.remove("hidden");
            addressInput.classList.add("border-red-500");
            return;
        }
    } else {
        // Se o método de entrega for "pickup", esconda o input de endereço e remova a validação
        addressInput.classList.add("hidden");
        addressLabel.classList.add("hidden");
        addressWarn.classList.add("hidden");
    }

    // Enviar o pedido para a API do WhatsApp
    const cartItems = cart.map((item) => {
        return `${item.name} Quantidade: ${item.quantity} Preço: R$ ${item.price} |`;
    }).join("");

    const message = encodeURIComponent(`${cartItems} Endereço: ${addressInput.value}`);
    const phone = "5592991155839";

    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");

    cart = [];
    updateCartModal();
});


// Função para verificar se o restaurante está aberto
function checRestauranteOpen() {
    const data = new Date();
    const hour = data.getHours();
    //return hour >= 23 && hour < 1; // Ajuste para 18h às 21:59
    return hour >= 8 || hour < 11; // Verifica se está entre 23:00 e 05:59
}

const spanItem = document.getElementById("date-span"); // Seleciona a div
const isOpen = checRestauranteOpen();

if (isOpen) {
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600");
    spanItem.querySelector("span").classList.add("text-white","font-medium");
    spanItem.querySelector("span").innerHTML = "Aberto de SEG a DOM - 18:00 - 22:00";
} else {
    spanItem.classList.remove("bg-green-600");
    spanItem.classList.add("bg-red-500");
    spanItem.querySelector("span").innerHTML = " Estamos Fechados no Momento - Funcionamos de SEG a DOM - 18:00 - 22:00";
}

// FUNÇÃO FORMA DE PAGAMENTO

paymentMethodSelect.addEventListener("change", function () {
    if (paymentMethodSelect.value === "pix") {
        pixDetailsDiv.classList.remove("hidden");
        pixDetailsDiv.classList.add("flex", "flex-col", "items-center", "justify-center");
    } else {
        pixDetailsDiv.classList.add("hidden");
        pixDetailsDiv.classList.remove("flex", "flex-col", "items-center", "justify-center");
    }
});


copyPixKeyButton.addEventListener("click", function () {
    const textArea = document.createElement("textarea");
    textArea.value = pixKey.textContent;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
    alert("Chave PIX copiada!");
});