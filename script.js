// Get all DOM elements
const hide = document.getElementById("hide");

const nombre = document.getElementById("nombre");

const showLogin = document.getElementById("showLogin");


const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const signOutBtn = document.getElementById("signOutBtn");
const favoritesBtn = document.getElementById("favoritesBtn");
const cartBtn = document.getElementById("cartBtn");

const displayTrendingProductsUl = document.getElementById("displayTrendingProducts");
const backBtn = document.getElementById("backBtn");
const displaySearchResultsUl = document.getElementById("displaySearchResults");

const beforeSearch = document.getElementById("beforeSearch");
const afterSearch = document.getElementById("afterSearch");

//Favorite section
const favoriteSection = document.getElementById("favoriteSection");
const displayFavoritesUL = document.getElementById("displayFavorites");
const closeFavoritesBtn = document.getElementById("closeFavoritesBtn");

//Cart section
const cart = document.getElementById("cart");
const displayCartItemsUl = document.getElementById("displayCartItems");
const closeCart = document.getElementById("closeCart");
const checkoutBtn = document.getElementById("checkoutBtn");


//Sign up
const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const email = document.getElementById("email");
const password = document.getElementById("password");
const createAccountBtn = document.getElementById("createAccountBtn");
const create = document.getElementById("create");

//Sign in
const signInEmail = document.getElementById("signInEmail");
const signInPassword = document.getElementById("signInPassword");
const logInBtn = document.getElementById("logInBtn");
const login = document.getElementById("login");
const backButton = document.getElementById("backButton");


//Storage (single source of truth)
let state = {
    products: [],
    trendingProducts: [],
    cartData: [],
    favorites: [],
    userData: [],
    searchQuery: "",
    selectedCategory: "all"

}

// Restore favorites and cart from localStorage on page load
state.favorites = JSON.parse(localStorage.getItem("favorites")) || [];
state.cartData = JSON.parse(localStorage.getItem("cartData")) || [];

//Show trending products immediately on page load
trendingProducts();

// Update trending products every 10 seconds
setInterval(trendingProducts, 10000);


//--------
//Sign up validation
//--------

function signUpValidation(){
    if(firstName.value === "" || !isNaN(firstName.value)){
        return false;
    }

    if(lastName.value === "" || !isNaN(lastName.value)){
        return false;
    }
    if(email.value === ""){
        return false;
    }
    if(password.value === ""){
        return false;
    }
    return true;
}



//--------
//Sign up functionality (function)
//--------

function signUp(){
    if(!signUpValidation()){
        return;
    }

    // state.userData = [];

    const accountData = {
        firstName: firstName.value,
        lastName: lastName.value,
        email: email.value,
        password: password.value
    }
    state.userData.push(accountData);
    create.style.display = "none"


    //Save data to local storage
    localStorage.setItem("users", JSON.stringify(state.userData))


}

createAccountBtn.addEventListener("click", function(e){
    e.preventDefault();
    signUp();
    login.style.display = "block"

});


//--------
//Log in functionality
//--------

function logInFunctionality(){
    //Get saved data from local storage
    let users = JSON.parse(localStorage.getItem("users")) || [];

    state.userData = users;

    if(users.length === 0){
       alert("No user found");
       return;
    }

    // Check if input matches any saved user
    const emailInput = signInEmail.value.trim();
    const passwordInput = signInPassword.value.trim();

    const matchedUser = users.find(user => 
        user.email === emailInput && user.password === passwordInput
    );

    if(matchedUser){
        alert(`Welcome back, ${matchedUser.firstName}!`);
        hide.style.display = "block"; // show the hidden section after login
        login.style.display = "none"; // hide login form
        nombre.textContent = matchedUser.firstName.toUpperCase();
    } else {
        alert("Incorrect email or password");
    }

}


const naam = JSON.parse(localStorage.getItem("users") || "[]");

if(naam.length > 0){
    nombre.textContent = naam[0].firstName.toUpperCase();
}



//--------
//Fetch data from API for trending products (function)
//--------

async function trendingProducts(){

    //Fetch data from API (fakestore API)
    const response = await fetch('https://fakestoreapi.com/products');
    const data = await response.json();

    // Setting our trending products storage to empty just incase we have any data from before
    state.trendingProducts = [];

       //Get 4 random products
    for(let i = 0; i < 4; i++){

       //Pick a random product(index) from the entire API data
    const randomIndex = Math.floor(Math.random() * data.length)

    const randomProduct = data[randomIndex];

        //Now push that random product to our storage
    state.trendingProducts.push(randomProduct)

    }

    renderTrendingProducts()
}


//--------
//Render trending products (function)
//--------

function renderTrendingProducts(){

    //Setting our UL to empty just incase we have any data from before
    displayTrendingProductsUl.innerHTML = "";

    //Designing display structure for each random product
    state.trendingProducts.forEach(function(product){
        const li = document.createElement("li");

        //Structure
        li.innerHTML = `<img src="${product.image}" width="100">
        <h3>${product.title}</h3>
        <p>$${product.price}</p>
        <button class="favBtn"><i class="fa-regular fa-heart"></i></button>
        <button class="theCartBtn"><i class="fa-solid fa-cart-arrow-down"></i></button>`

        //If user clicks heart button
        const favBtn = li.querySelector(".favBtn");

        favBtn.addEventListener("click", function(){
            state.favorites.push(product);
            localStorage.setItem("favorites", JSON.stringify(state.favorites));
            alert(`${product.title} added to favorites!`);
        })

        //If user clicks cart button
        const theCartBtn = li.querySelector(".theCartBtn");

        theCartBtn.addEventListener("click", function(){
            state.cartData.push(product);
            localStorage.setItem("cartData", JSON.stringify(state.cartData));
            alert(`${product.title} added to cart!`)
        })

        displayTrendingProductsUl.appendChild(li)

    })

}


//--------
//Search validation (function)
//--------
function searchValidation(){
    if(searchInput.value.trim().toLowerCase() === ""){
        alert("Please type something to search");
        return false;
    }

    //if user typed something
    return true;

}

//--------
//Fetch data from API for searched products
//--------
async function searchProducts(){

    //First check if user typed anything to search
    if(!searchValidation()){
        return false;
    }

// Now fetch data from API (fakestore)
const response = await fetch('https://fakestoreapi.com/products');
const data = await response.json();

//We set our products storage to empty array just incase we have any data from before
state.products = [];

//Storing the input value in a variable for ease
const query = searchInput.value.trim().toLowerCase();

//
let found = false;

// Now we decide how we want the data
for(let i = 0; i < data.length; i++){

    if(data[i].title.toLowerCase().includes(query)){
        state.products.push(data[i]);
        found = true;
    }

}

//If searched product doesn't exist
if(!found){
    alert("No mathcing products found")
    return;
}

renderSearchProducts();

}

//--------
//Render searched products
//--------
function renderSearchProducts(){

    //hiding everything to have a new screen for searched products
    beforeSearch.style.display = "none";

    //Now showing the new screen for searched products
    afterSearch.style.display = "block"

    //Setting our UL to empty just incase we have any data from before
    displaySearchResultsUl.innerHTML = ""

    //Designing display structure for each searched product

    state.products.forEach(function(product){

        const li = document.createElement("li");

    //Structure
    li.innerHTML = `<img src="${product.image}" width="100">
    <h3>${product.title}</h3>
    <p>$${product.price}</p>
    <button class="favBtn"><i class="fa-regular fa-heart"></i></button>
    <button class="theCartBtn"><i class="fa-solid fa-cart-arrow-down"></i></button>`

    //If user clicks heart button
    const favBtn = li.querySelector(".favBtn");

    favBtn.addEventListener("click", function(){
        state.favorites.push(product);
        localStorage.setItem("favorites", JSON.stringify(state.favorites));
        alert(`${product.title} added to favorites!`)
    })

    //If user clicks cart button
    const cartBtn = li.querySelector(".theCartBtn");

    cartBtn.addEventListener("click", function(){
        state.cartData.push(product);
        localStorage.setItem("cartData", JSON.stringify(state.cartData));
        alert(`${product.title} added to cart!`)
    })

    displaySearchResultsUl.appendChild(li)

    })

}


//--------
//Render favorites (function)
//--------

function renderFavorites(){
    
    //Clear existing
    displayFavoritesUL.innerHTML = ""

    //If there's nothing in favorites already
    if(state.favorites.length === 0){
        displayFavoritesUL.innerHTML = "<li>Nothing in favorites yet.</li>";
        return;
    }

    //Design structure of displaying added favorite items 
    state.favorites.forEach(function(product){
        const li = document.createElement("li");

        li.innerHTML = `<img src="${product.image}" width="100">
                        <h3>${product.title}</h3>
                        <p>$${product.price}</p>
                        <button class="removeFavBtn">Remove</button>`;

//Remove button functionality
const removeButton = li.querySelector(".removeFavBtn");

removeButton.addEventListener("click", function(){

    // Remove this product from favorites
    state.favorites = state.favorites.filter(function(prod){
        if(prod !== product){
            return true;
            
        }else{
            return false;
        }
    });

localStorage.setItem("favorites", JSON.stringify(state.favorites));

//Calling render favorites function again to show updated items
    renderFavorites();
});

displayFavoritesUL.appendChild(li)
    });

};


//--------
//Render cart (function)
//--------
function renderCart(){

    //clear existing
    displayCartItemsUl.innerHTML = "";

    //If there's nothing in cart already
    if(state.cartData.length === 0){
        displayCartItemsUl.innerHTML = "<h3>Your cart is empty</h3>";
        return;
    }

    //Design structure of displaying added cart items
    state.cartData.forEach(function(product){
        const li = document.createElement("li");

        li.innerHTML = `<img src="${product.image}" width="100">
            <h3>${product.title}</h3>
            <p>$${product.price}</p>
            <button class="removeCartBtn">Remove</button>`;

        //Remove items from cart functionality
        const removeCartBtn = li.querySelector(".removeCartBtn");

        removeCartBtn.addEventListener("click", function(){
            state.cartData = state.cartData.filter(function(prod){
                if(prod !== product){
                    return true;
                } else {
                    checkoutBtn.style.display = "none"
                    return false;
                }
            });

            localStorage.setItem("cartData", JSON.stringify(state.cartData));
            //Calling render cart function again to show updated items
            renderCart();
        });

        //Check out button shows if cart has items in it
        if(state.cartData.length !== 0){
            checkoutBtn.style.display = "block"
        }

        // Append the li AFTER adding event listener
        displayCartItemsUl.appendChild(li);
    });

}


//--------
//Render checkout functionality (function)
//--------

function renderCheckout(){

const priceText = document.createElement("h3");

if(state.cartData.length === 0){
    alert("No items in cart")
    return;
}

let totalPrice = 0
for(let i = 0; i < state.cartData.length; i++){

    totalPrice = totalPrice + state.cartData[i].price;
}

priceText.textContent = `Price: $${totalPrice}`;
checkoutBtn.style.display = "none"
displayCartItemsUl.appendChild(priceText)


}


//--------
//Event listeners
//--------

// Event listener for search button: triggers searchProducts function
searchBtn.addEventListener("click", searchProducts);

// Event listener for checkout button: calculates total price and shows it
checkoutBtn.addEventListener("click", renderCheckout);

// Event listener for back button in search results: returns to homepage view
backBtn.addEventListener("click", function(){
    beforeSearch.style.display = "block"; // Show homepage
    afterSearch.style.display = "none";   // Hide search results
    searchInput.value = "";                // Clear search input
});

// Event listener for favorites button: shows favorites section
favoritesBtn.addEventListener("click", function(){
    renderFavorites();                     // Render favorite items
    favoriteSection.style.display = "block"; // Show favorites section
    beforeSearch.style.display = "none";     // Hide main homepage
    afterSearch.style.display = "none";      // Hide search results
});

// Event listener to close favorites section and return to homepage
closeFavoritesBtn.addEventListener("click", function(){
    beforeSearch.style.display = "block"; // Show homepage
    favoriteSection.style.display = "none"; // Hide favorites section
});

// Event listener for cart button: shows cart section
cartBtn.addEventListener("click", function(){
    renderCart();                          // Render cart items
    cart.style.display = "block";          // Show cart section
    beforeSearch.style.display = "none";   // Hide homepage
    afterSearch.style.display = "none";    // Hide search results
});

// Event listener to close cart section and return to homepage
closeCart.addEventListener("click", function(){
    beforeSearch.style.display = "block"; // Show homepage
    cart.style.display = "none";          // Hide cart section
});

// Event listener for sign out button: hides main section and reloads page
signOutBtn.addEventListener("click", function(){
    hide.style.display = "none";         // Hide main section
    create.style.display = "block";      // Show sign up form
    window.location.reload();            // Reload page to reset state
});

// Event listener for "click here to sign in" link
showLogin.addEventListener("click", function(e){
    e.preventDefault();                  // Prevent default link behavior
    create.style.display = "none";       // Hide sign up form
    login.style.display = "block";       // Show login form
});

// Event listener for login button: triggers login functionality
logInBtn.addEventListener("click", function(e){
    e.preventDefault();                  // Prevent form submission
    logInFunctionality();                // Run login function
});

//Back button on the login page
backButton.addEventListener("click", function(){
    login.style.display = "none";
    create.style.display = "block"
})