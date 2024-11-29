/***********************************************/
/*********** Registration Process **************/
/***********************************************/
function userVerification(email){
    let sUser = JSON.parse(localStorage.getItem('users'))
    let isExist = sUser.find(i => i.email === email)
    return isExist;
}

registerData = (e) => {
    e.preventDefault();
    let userEmail = e.target.email.value;
    let userPassword = e.target.password.value;
    let userFirstName = e.target.fname.value;
    let userLastName = e.target.lname.value;
    let userData = [];
    userData.push(
        {'userEmail': userEmail,
        'userPassword': userPassword,
        'userFirstName': userFirstName,
        'userLastName': userLastName}
    )
    // console.log(userData);
    userRegistration(userData);
}

async function userRegistration(userData){
    
    try{
        const Id = Math.floor(Math.random() * 1000);
        let lUsers = [];
        if(localStorage.getItem('users')){
            debugger
            console.log('we have this key')
            if(!userVerification(userData[0].userEmail)){
                let sUser = JSON.parse(localStorage.getItem('users'))
                sUser.push({
                    Id: Id,
                    email: userData[0].userEmail,
                    password: userData[0].userPassword,
                    fname: userData[0].userFirstName,
                    lname: userData[0].userLastName
                })
                localStorage.setItem('users', JSON.stringify(sUser))
                document.getElementById('message').innerHTML = 'Registered successfully.'
                setTimeout(()=>{
                    window.location.href = 'login.html';
                }, 1000)
            }
            else{
                debugger
                document.getElementById('message').innerHTML = 'User exists. Try again!!'
                // data reset
                document.getElementById('fname').value = ''
                document.getElementById('lname').value = ''
                document.getElementById('email').value = ''
                document.getElementById('password').value = ''
            }
        }
        else{
            debugger
            console.log('No key found');
            console.log(userData)
            lUsers.push({
                Id : Id,
                email: userData[0].userEmail,
                password: userData[0].userPassword,
                fname: userData[0].userFirstName,
                lname: userData[0].userLastName
            })
            localStorage.setItem('users', JSON.stringify(lUsers))
            document.getElementById('message').innerHTML = 'Registered successfully.'
            setTimeout(()=>{
                window.location.href = 'login.html';
            }, 1000)
        }
    }
    catch(error){
        console.log(error);
    }
}

/***********************************************/
/************** Login Process *****************/
/***********************************************/
function Login(e){
    e.preventDefault();
    let userEmail = e.target.email.value;
    let userPassword = e.target.password.value;
    userValidation(userEmail, userPassword);
}


async function userValidation(userEmail, userPassword) {
    debugger
    try{
        let sUser = JSON.parse(localStorage.getItem('users'));
        let userDetails = sUser.find(i => i.email === userEmail)
        console.log(userDetails.email, userDetails.password)
        if (userEmail === userDetails.email && userPassword === userDetails.password) {
            debugger 
            document.getElementById('message').innerHTML = 'Login successfully.'
            localStorage.setItem('isLoggedIn', true);
            setTimeout(()=>{
                window.location.href = 'dashboard.html';
            }, 1000)
            localStorage.setItem('userName', `${userDetails.fname} ${userDetails.lname}`);
        } else {
           document.getElementById('message').innerHTML = 'Login failed.'
           document.getElementById('email').innerHTML = ''
           document.getElementById('password').innerHTML = ''
        }
    }
    catch(err){
        console.log(err);
        document.getElementById('message').innerHTML = 'User data not found!!'
        document.getElementById('email').innerHTML = ''
        document.getElementById('password').innerHTML = ''
    }
}

/***********************************************/
/************** Dashboard *****************/
/***********************************************/

// products data
async function productData(){
    try{
        // division block identify
        let products = document.getElementById('products');

        // api calling and data set
        let response = await fetch('https://dummyjson.com/products');
        let data = await response.json();
        let productData = data.products;
        // console.log(response);
        // console.log(data.products);
        let cartItems = JSON.parse(localStorage.getItem('cartProduct')) || [];
        productData.forEach(element => {
            let isExist = cartItems.find(i=> i.id === element.id);
            let card = `
            <div class="col-lg-4 mb-4">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${element.title}</h5>
                        <img src="${element.images}" class="card-img-top" alt="${element.title}">
                        <p class="card-text">${element.category}</p>                                    
                        <p class="card-text">${element.price}</p>
                        <p class="card-text">${element.rating}</p>
                    </div>
                    <div class="card-body my-3 d-flex justify-content-center">
                        <button id="${element.id}" class="btn btn-primary ${isExist && 'd-none'}" onclick="addCart(${element.id})">${isExist ? 'Added' : 'Add to cart' }</button>
                        <div class="input-group ${isExist ? '' : 'd-none'}" style="max-width: 200px;">
                            <button class="btn btn-outline-secondary" type="button" id="minus-btn" onclick="count(false, ${element.id})">-</button>
                            <input type="number" class="form-control text-center" id="numberInput_${element.id}" value="${isExist?.qty || 0}" min="1" step="1">
                            <button class="btn btn-outline-secondary" type="button" id="plus-btn" onclick="count(true, ${element.id})">+</button>
                        </div>
                    </div>
                   
                </div>
             </div>`;
            console.log(element);
            products.innerHTML += card;
        });
    }
    catch(error){
        console.log(error);
    }
}
productData();


// add cart
async function addCart(id){
    console.log('this is id', id)
     // api calling and data set
    let response = await fetch('https://dummyjson.com/products');
    let data = await response.json();
    let productData = data.products;
    let addedProduct = productData.find(i => i.id === id)
    console.log(addedProduct)
    // test product array
    let cartProduct = JSON.parse(localStorage.getItem('cartProduct'))
    if(!cartProduct){
        addedProduct['isAdded'] = true;
        let cartProduct = [];
        cartProduct.push(addedProduct);
        console.log(cartProduct)
        localStorage.setItem('cartProduct', JSON.stringify(cartProduct))
        // alert(addedProduct.id);
        document.getElementById(addedProduct.id).innerHTML = 'Added'
        document.getElementById(addedProduct.id).attr = 'disabled'
        location.reload();
    }
    else{
        addedProduct['isAdded'] = true;
        cartProduct.push(addedProduct)
        localStorage.setItem('cartProduct', JSON.stringify(cartProduct))
        // alert(addedProduct.id);
        let ele = document.getElementById(addedProduct.id)
        ele.innerHTML = 'Added'
        ele.setAttribute("disabled", true)
        location.reload();
    }
}

// single product data
// async function singleProduct(id){
//     try{
//         let response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
//         let data = await response.json();
//         console.log(data.products);
//         window.location.href = `single-product.html?id=${id}`;
//     }
//     catch(error){
//         console.log(error);
//     }
// }

// counter function
function count(e, id){
    let value = parseInt(document.getElementById('numberInput_'+id).value);
    console.log(e)
    if(e){
        value = value + 1;
        console.log('clicked',  value)
    }
    else{
        if(value>1){
            value = value - 1;
        }
    }
    document.getElementById('numberInput_'+id).value = value;

    let cartProduct = JSON.parse(localStorage.getItem('cartProduct'));
    let cartItem = cartProduct.find(i=>i.id === id)
    cartItem['qty'] = value;
    cartProduct.forEach((ele)=>{

    })
    localStorage.getItem('cartProduct' , JSON.stringify(cartItem))

}

// logout function
function logOut(){
    window.location.href = 'index.html';
    localStorage.setItem('isLoggedIn', 'false');
}

