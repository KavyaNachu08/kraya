//GENERAL DECLARATIONS

let productsData;
const containerBody = document.querySelector('#containerbody');
const totalProducts = document.querySelector('#total');
const ratingEl = document.querySelector('.ratings');
const priceEl = document.querySelector('.price_low_high');
const newEl = document.querySelector('.newFirst');
const brand = document.querySelectorAll('.checkbox');

//FETCHING DATA FROM JSON FILE

const products = async () => {
    const response = await fetch('./index.json');
    productsData = await response.json();
    loadData(productsData);

}
products();

// RATING OF PRODUCTS

const renderStars = (ratings) => {
    let rate = '';
    for (let j = 0; j < 5; j++) {
        if (j < ratings) {
            rate += `<i class="fa-solid fa-star ratedStars" ></i>`;
        }
        else {
            rate += `<i class="fa-solid fa-star unratedStars"></i>`;
        }
    }
    return rate;
}

//RENDERING OF EACH PRODUCT

function loadData(productsData) {

    containerBody.innerHTML = "";

    productsData.forEach(function (item) {
        const products = `
        <article class="kraya-mobile">
            <nav class="kraya-mobile-info">
                <div class="wishlist-icon">
                    <i class="fa-regular fa-heart"></i>
                </div>
                <div class="sale-new">
                    <div class="kraya-mobile-new">${item.new ? '<span>NEW</span>' : ''}</div>
                    <div class="kraya-mobile-sale">${item.sale ? '<span>SALE</span>' : ''}</div>    
                </div>
                <div class="overlay">
                    <div class="kraya-mobile__product">
                        <img src=${item.imageSrc} alt="mobile">
                    </div>
                    <form class="kraya-mobile__cart-buttons">
                        <input type="button" class="kraya-mobile__cart" value="ADD TO CART">
                        <input type="button" class="kraya-mobile__gallery" value="VIEW GALLERY">
                    </form>
                </div>
                <div class="mobile-information">
                    <div class="mobile-name">${item.productName}</div>
                    <div class="kraya-mobile__rating">
                        ${renderStars(item.starRating)}
                        <span>(${item.reviewCount})</span>
                    </div>
                    <div class="kraya-mobile__price">
                        <span class="kraya-mobile__disc-price">$${item.discountedPrice}</span>
                        <span class="kraya-mobile__original-price">${item.originalPrice}</span>
                        <span class="kraya-mobile__disc">${item.discountPercent}</span>
                    </div>    
                </div>
            </nav>
        </article> 
    `
        containerBody.innerHTML += products;

    });

    wishlistUpdate();
    cartUpdate();
    totalProducts.innerText = productsData.length;
}

//WISHLIST UPDATE

const wishlistUpdate = () => {
    const wishlist = document.querySelectorAll('.wishlist-icon');
    const countElWish = document.querySelector('.wishlist_count');
    let count = 0;
    if (localStorage.getItem('wishlist_count')) {
        countElWish.innerHTML = localStorage.getItem('wishlist_count');
    }
    else {
        countElWish.innerHTML = count;
    }
    for (let i = 0; i < wishlist.length; i++) {
        wishlist[i].addEventListener('click', function (event) {
            event.preventDefault();
            event.target.classList.toggle('wishlist-active');
            event.target.classList.toggle('fa-solid');
            event.target.classList.toggle('fa-regular');
            if (event.target.classList.contains('fa-solid')) {
                count = count + 1;
                countElWish.innerHTML = count;
                localStorage.setItem('wishlist_count', count);
            }
            else {
                count = count - 1;
                countElWish.innerHTML = count;
                localStorage.setItem('wishlist_count', count);
            }
        })
    }
}

//CART UPDATE

const cartUpdate = () => {
    let cartlist = document.querySelectorAll('.kraya-mobile__cart');
    let countELCart = document.querySelector('.cart_count');
    let count = 0;
    if (localStorage.getItem('cart_count')) {
        countELCart.innerHTML = localStorage.getItem('cart_count');
    }
    else {
        countELCart.innerHTML = count;
    }
    for (let i = 0; i < cartlist.length; i++) {
        cartlist[i].addEventListener('click', function (e) {
            e.preventDefault();
            count = count + 1;
            countELCart.innerHTML = count
            localStorage.setItem('cart_count', count);
        }
        )
    }
}


//ACCORDION

const accordian = document.querySelectorAll('.label');
for (let i = 0; i < accordian.length; i++) {
    accordian[i].addEventListener('click', function (e) {
        const nextElSibling = this.nextElementSibling.classList;
        if (nextElSibling.contains('d-none')) {
            nextElSibling.remove('d-none');
            nextElSibling.add('d-block');
        }
        else {
            nextElSibling.remove('d-block');
            nextElSibling.add('d-none');
        }
    })
}

//SORT BY RATING

function rating() {
    ratingEl.addEventListener('click', function (e) {
        e.preventDefault();
        let new_list = checkedProducts();
        new_list.sort((a, b) => b.starRating - a.starRating);
        loadData(new_list);
    }
    )
}
rating();

//SORT BY NEW LABEL

function sortLabel() {
    newEl.addEventListener('click', function (e) {
        e.preventDefault();
        let new_list = checkedProducts();
        new_list.sort((a, b) => b.new - a.new);
        loadData(new_list);
    })
}
sortLabel();

//SORT BY PRICE

function sortPrice() {
    priceEl.addEventListener('click', function (e) {
        e.preventDefault();
        let new_list = checkedProducts();
        new_list.sort((a, b) => a.discountedPrice - b.discountedPrice);
        loadData(new_list);
    })
}
sortPrice();

//SORTED PRODUCTS BY BRAND

function checkedProducts() {
    let checkBrand = [];
    for (let j of brand) {
        if (j.checked) {
            checkBrand.push(j.name);
        }
    }

    if (checkBrand.length == 0) {
        return productsData;
    }
    let checkedProducts = [];
    for (let i = 0; i < checkBrand.length; i++) {
        for (let j = 0; j < productsData.length; j++) {
            let brandName = productsData[j].brand;
            if (brandName == checkBrand[i]) {
                checkedProducts.push(productsData[j]);
            }
        }
    }
    return checkedProducts;
}

//SORT BY BRAND

function sortBrand() {
    for (let i = 0; i < brand.length; i++) {
        brand[i].addEventListener('click', function (e) {
            let sortedProducts= checkedProducts();
            loadData(sortedProducts);

        })
    }
}
sortBrand();

//CLEAR ALL

function clearAll() {
    let clear = document.querySelector('#clear');
    clear.addEventListener('click', function () {
        containerBody.innerHTML = "";
        loadData(productsData);
        let brand = document.querySelectorAll('.checkbox');
        for (let i = 0; i < brand.length; i++) {
            brand[i].checked = false;
        }
    })
}
clearAll();

//VALUES THROUGH PRICE SLIDER

function priceRange(minPrice, maxPrice) {
    let priceValue = checkedProducts();
    priceValue = priceValue.filter((price) => parseInt(price.discountedPrice) >= parseInt(minPrice) && parseInt(price.discountedPrice) <= parseInt(maxPrice));
    loadData(priceValue);
}

//PRICE SLIDER

$(function () {
    $("#slider").slider({
        range: true,
        min: 0,
        max: 2500,
        values: [75, 500],
        slide: function (event, ui) {
            $("#amount").val("$" + ui.values[0] + " - $" + ui.values[1]);
            let minPrice = ui.values[0];
            let maxPrice = ui.values[1];
            priceRange(minPrice, maxPrice);
        }
    })
$("#amount").val("$" + $("#slider").slider("values", 0) +
        " - $" + $("#slider").slider("values", 1));
});
