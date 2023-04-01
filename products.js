"use strict";
//import { fetchData } from "./fetch.js";
let url = 'https://fakestoreapi.com/products/';
let productsInCart;
if (localStorage.getItem("cart") === null) {
  productsInCart = [];
  console.log("products in cart array", productsInCart);
} else {
  productsInCart = JSON.parse(localStorage.getItem("cart"));
  console.log(productsInCart);
  //Rendera dessa produkter i Cart utifrån productsInCart med fetch.
  getProductsFromLocalStorage();
}

async function getProductsFromLocalStorage() {
  let response = await fetch(url);
  let data = await response.json();
  data.forEach(isInLocalStorage);
}

function isInLocalStorage(element) {
  if (productsInCart.some(product => product[0] === element.id)) {
    addToCart(element);
  }
}


getProducts();

async function getProducts() {
  let response = await fetch(url);
  let data = await response.json();
  data.forEach(renderProductCard);
}

function renderProductCard(element) {
  const card = document.createElement('div');
  card.classList.add('col-sm-11', 'col-md-6', 'col-lg-3', 'col-xl-3', 'col-xxl-2', 'mb-4', 'card-container');
  card.innerHTML = `
            <div class="card card-hover" style="border-radius: 15px;">
              <div class="text-center" style="height: 200px">
                <img src="${element.image}" style="border-top-left-radius: 15px; border-top-right-radius: 15px; max-height: 200px;" class="img-fluid" alt="${element.title}"/>
              </div>
              <div class="card-body pb-0">
                <div class="d-flex justify-content-between">
                  <div>
                    <p class="title">${element.title}</p>
                    <p class="small text-muted">${element.category}</p>
                  </div>
                  <div>
                  <div class="d-flex flex-row justify-content-end mt-1 mb-4 text-danger">
                </div>
                  </div>
                </div>
              </div>
              <hr class="my-0" />
              <div class="card-body pb-0">
                <div class="d-flex justify-content-between">
                  <p>$${element.price}</p>
                  <p class="small text-muted">${element.rating.rate} rating (${element.rating.count} votes)</p>
                </div>
              </div>
              <hr class="my-0" />
              <div class="card-body pb-0">
              <div class="description-container">
                <p class="text-dark line-clamp">${element.description}</p>
              </div>
            </div>
            <hr class="my-0" />
              <div class="card-body">
                <div class="d-flex justify-content-center align-items-center pb-2 mb-1">
                  <button class="btn btn-primary btn_addToCart">Add to cart</button>
                </div>
              </div>
            </div>
      `;
  document.querySelector('.row').appendChild(card);

  card.querySelector(".btn_addToCart").addEventListener("click", () => {
    if (productsInCart.some(product => product[0] === element.id)) {
      addToLocalStorage(element.id, 1);
      updateQuantity(element);
    } else {
      addToLocalStorage(element.id, 1);
      addToCart(element);
    }
  })
  /*card.querySelector('.btn').addEventListener('click', () => {
      renderInDropdown(element);
      addToLocalStorage(element.id, 1);
  });*/

  const descriptionContainerElement = card.querySelector('.description-container');
  //adds the class 'has-more-text' to the description container if the description is longer than the container and shows a gradient at the bottom when it's not expanded
  if (descriptionContainerElement.scrollHeight > descriptionContainerElement.clientHeight) {
    descriptionContainerElement.classList.add('has-more-text');
  }

  //made the description expand on hover and collapse on mouseleave of the entire card
  descriptionContainerElement.addEventListener('mouseenter', () => {
    descriptionContainerElement.classList.add('expanded');
  });

  card.addEventListener('mouseleave', () => {
    descriptionContainerElement.classList.remove('expanded');
  });
}


function getQuantity(element) {
  return productsInCart.find(product => product[0] === element.id)[1];
}

function updateQuantity(element) {
  document.getElementById("quantity_" + element.id).textContent = "Quantity: " + getQuantity(element);
}

function addToCart(element) {
  /*document.getElementById("emptyCart").remove();

  let btn_goTocheckout = document.createElement('button');
  btn_goTocheckout.textContent = "Checkout";
  btn_goTocheckout.classList.add('btn');
  btn_goTocheckout.classList.add('btn-primary');
  btn_goTocheckout.classList.add('btn_goToCheckout');
  document.querySelector('.dropdown-menu').appendChild(btn_goTocheckout);
  document.querySelector('.btn_goToCheckout').addEventListener('click', () => {
    location.href = "checkout.html";
  });*/

  //Om produkten redan finns i productsInCart rendera inte

  let list = document.createElement('li');
  list.classList.add('dropdown-item');
  list.classList.add('dropdown-item-container');
  list.innerHTML = `
      
      <p>${element.title}</p>
      <p>$${element.price}</p>
      <p id="quantity_${element.id}">Quantity: ${getQuantity(element)}</p>

      <button class="btn btn-primary btn_delete" data-bs-toggle="modal">DELETE</button>
      <button class="btn btn-primary btn_plus" data-bs-toggle="modal">+</button>
      <button class="btn btn-primary btn_minus" data-bs-toggle="modal">-</button>

      `;
  document.querySelector('.dropdown-menu').appendChild(list);

  list.querySelector('.btn_plus').addEventListener('click', () => {
    addToLocalStorage(element.id, 1);
    updateQuantity(element);
  })

  list.querySelector('.btn_minus').addEventListener('click', () => {
    subtractFromLocalStorage(element.id, 1);
    updateQuantity(element);
  })

  list.querySelector('.btn_delete').addEventListener('click', () => {
    deleteProduct(element);
  });
}

function addToLocalStorage(id, quantity) {
  //Om id == något id i productsInCart så öka quantity.
  if (productsInCart.some(product => product[0] === id)) {
    productsInCart.find(product => product[0] === id)[1] += 1;
  } else {
    let product = [id, quantity];
    productsInCart.push(product);
  }
  localStorage.setItem('cart', JSON.stringify(productsInCart));
}

function subtractFromLocalStorage(id, quantity) {
  if (quantity === 0) {
    //deleteFromCart();
  }

  if (quantity > 0) {
    if (productsInCart.some(product => product[0] === id)) {
      productsInCart.find(product => product[0] === id)[1] -= 1;
      localStorage.setItem('cart', JSON.stringify(productsInCart));
    }
  }
}

function deleteProduct(element) {

}


function goToCheckout() {
  location.href = "checkout.html";
}