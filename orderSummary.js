"use strict";
//import { fetchData } from "./fetch.js";
let url = 'https://fakestoreapi.com/products/';
const customer = JSON.parse(sessionStorage.getItem('customer'));
const productsInCart = JSON.parse(localStorage.getItem('cart'))

if (productsInCart == null || customer == null) {
    
    if (productsInCart == null) {
        document.getElementById('orderSummary').innerHTML = `Your cart is empty, please go back to the shop and add some items to your cart.`;
    }
    if (customer == null) {
        document.getElementById('customer').innerHTML = `Please fill in your information to complete your order.`;
    }
} else {
    getProductsFromLocalStorage();
    
}



async function getProductsFromLocalStorage() {
    let response = await fetch(url);
    let data = await response.json();
    data.forEach(isInLocalStorage);
}

function isInLocalStorage(element) {
    if (productsInCart.some(product => product[0] === element.id)) {
        renderConfirmationCard(element, getQuantity(element));
    }
}

function getQuantity(element) {
    return productsInCart.find(product => product[0] === element.id)[1];
}

    //fetchData(renderConfirmationCard, shop);
    renderCustomer(customer);

    function renderConfirmationCard(element, quantity) {
        const confirmationCard = document.createElement('div');
        confirmationCard.classList.add('col-sm-11', 'col-md-11', 'col-lg-7', 'mb-4');
        confirmationCard.innerHTML = `
    <div class="card" style="border-radius: 15px;">
        <div class="row g-0">
            <div class="col-md-2">
                <img src="${element.image}" style="border-top-left-radius: 15px; border-bottom-left-radius: 15px; max-height: 150px; object-fit: cover;" class="img-fluid" alt="${element.title}" />
            </div>
            <div class="col-md-10">
                <div class="card-body">
                    <div class="d-flex justify-content-between">
                        <div>
                            <p>${element.title}</p>
                            <p class="small">${element.description}</p>
                            <p class="small text-muted">${element.category}</p>
                        </div>
                        <div>
                            <p>$${element.price}</p>
                            <p>Quantity: ${quantity}</p>
                            <p class="small text-muted">${element.rating.rate} rating (${element.rating.count} votes)</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
`;
        document.getElementById('orderSummary').appendChild(confirmationCard);
    }



    function renderCustomer(customer) {
        let card = document.createElement('div');
        card.classList.add('col-sm-11', 'col-md-11', 'col-lg-7', 'mb-4');
        card.innerHTML = `
            <div class="card-body">
                <div class="col-12 d-flex justify-content-center">
                    <div>
                        <h3>Shipping & Billing:</h3>
                        <div class="col-12">
                            <p><b>Name</b>: ${customer.name}<br><b>Email:</b> ${customer.email}<br><b>Phone:</b> ${customer.phone}</p>
                            <p><b>Address:</b> <br>${customer.address}<br>${customer.zip} ${customer.city}</p>
                        </div>
                    </div>
                </div>
            </div>
    `;

        document.getElementById('customer').appendChild(card);
        sessionStorage.clear();
    }
