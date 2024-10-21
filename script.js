const itemsWrapper = document.querySelector('.shop_items_wrapper'),
    ordersWrapper = document.querySelector('.shop_cart_orders_wrapper'),
    modalWindow = document.querySelector('.shop_modal'),
    modalOrdersWrapper = document.querySelector('.shop_modal_orders_wrapper'),
    cartTitle = document.querySelector('.shop_cart_title')
let orders = []
let ordersCount = []
let totalPrice = 0;
async function fetchData() {
    try {
        const response = await fetch('data.json');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

function checkScreenWidth() {
    let screenWidth = window.innerWidth;
    let windowSizes = ['mobile', 'tablet', 'desktop']
    let windowSizesPx = [screenWidth < 768, 768 <= screenWidth && screenWidth < 1024, screenWidth >= 1024]
    let screenType = ''
    windowSizesPx.forEach(el => {
        if (el === true) {
            screenType = windowSizes[windowSizesPx.indexOf(el)]
        }
    })
    return screenType;
}

function resetAll(){
    orders = []
    ordersCount = []
    totalPrice = 0;
    localStorage.setItem('orders', JSON.stringify(orders))
    localStorage.setItem('orders_count', JSON.stringify(ordersCount))
    localStorage.setItem('total_price', JSON.stringify(totalPrice))
    showItems()
}

async function showItems() {
    let dataSet = await fetchData();
    console.log(dataSet);
    dataSet.forEach(el => {

        let item = `						
        <div class="shop_item">
			<img
				src="${el.image[checkScreenWidth()]}"
				alt=""
				class="shop_item_img"
			/>

			<button class="shop_item_btn" onclick="addToCart(${dataSet.indexOf(el)})">
				<img src="assets/images/icon-add-to-cart.svg" alt="" /> Add to
				Cart
			</button>

            <div class="shop_order_items_count">
                  <button class="shop_order_item_less" onclick="decrementOrdersCount(${dataSet.indexOf(el)})">
                    <img src="assets/images/icon-decrement-quantity.svg" alt="">
                  </button>
                  <p class="shop_order_item_count">1</p>
                  <button class="shop_order_item_more" onclick="incrementOrdersCount(${dataSet.indexOf(el)})">
                    <img src="assets/images/icon-increment-quantity.svg" alt="">
                  </button>
            </div>

			<div class="shop_item_text">
				<p class="shop_item_type">${el.category}</p>
				<h2 class="shop_item_name">${el.name}</h2>
				<h3 class="shop_item_price">$${(el.price).toFixed(2)}</h3>
			</div>
		</div>`

        itemsWrapper.innerHTML += item
    });
    upDateItemsCount()
}

function incrementOrdersCount(id){
    ordersCount[id] = ordersCount[id] + 1
    localStorage.setItem('orders_count', JSON.stringify(ordersCount))
    document.querySelectorAll('.shop_order_item_count')[id].innerHTML = ordersCount[id]
    upDateCart()
}
function decrementOrdersCount(id){
    if(ordersCount[id] < 2){
        return
    }
    ordersCount[id] = ordersCount[id] - 1
    localStorage.setItem('orders_count', JSON.stringify(ordersCount))
    document.querySelectorAll('.shop_order_item_count')[id].innerHTML = ordersCount[id]
    upDateCart()
}

function addToCart(id) {
    document.querySelectorAll('.shop_item_btn')[id].style.display = 'none'
    document.querySelectorAll('.shop_order_items_count')[id].style.display = 'flex'
    document.querySelectorAll('.shop_item_img')[id].style.border = '3px solid hsl(14, 86%, 42%)'
    orders.push(id)
    ordersCount[id] = ordersCount[id] + 1
    localStorage.setItem('orders', JSON.stringify(orders))
    localStorage.setItem('orders_count', JSON.stringify(ordersCount))
    upDateCart()
}

async function upDateCart() {
    let dataSet = await fetchData();
    totalPrice = 0
    if (orders.length > 0){
        document.querySelector('.shop_cart_full').style.display = 'flex'
        document.querySelector('.shop_cart_empty').style.display = 'none'
    }
    ordersWrapper.innerHTML = '';
    orders = JSON.parse(localStorage.getItem('orders'))
    cartTitle.innerHTML = `Your Cart (${orders.length})`
    orders.forEach(el=>{
        totalPrice = totalPrice + ordersCount[el]*dataSet[el].price
        ordersCount = JSON.parse(localStorage.getItem('orders_count'))
        let item = `								
        <div class="shop_order">
			<div class="shop_order_info">
				<h3 class="shop_order_name">${dataSet[el].name}</h3>
				<div class="shop_order_info_bottom">
					<p class="shop_order_quantity">${ordersCount[el]}x</p>
					<p class="shop_order_price">@ $${(dataSet[el].price).toFixed(2)}</p>
					<p class="shop_order_total">$${(ordersCount[el]*dataSet[el].price).toFixed(2)}</p>
				</div>
			</div>
			<button class="shop_order_delete" onclick="deleteOrder(${el})">
				<img src="assets/images/icon-remove-item.svg" alt="" />
			</button>
		</div>`
        localStorage.setItem('total_price', JSON.stringify(totalPrice))
        document.querySelector('.shop_order_total_price').innerHTML = `$${totalPrice.toFixed(2)}`
        ordersWrapper.innerHTML += item
    })        
}

function upDateItemsCount(){
    orders = JSON.parse(localStorage.getItem('orders'))
    ordersCount = JSON.parse(localStorage.getItem('orders_count'))
    orders.forEach(el=>{
        document.querySelectorAll('.shop_item_btn')[el].style.display = 'none'
        document.querySelectorAll('.shop_order_items_count')[el].style.display = 'flex'
        document.querySelectorAll('.shop_item_img')[el].style.border = '3px solid hsl(14, 86%, 42%)'
        document.querySelectorAll('.shop_order_item_count')[el].innerHTML = ordersCount[el]
    })
    upDateCart()
}

function deleteOrder(id){
    orders = orders.filter(item => item != id)
    localStorage.setItem('orders', JSON.stringify(orders))
    ordersCount[id] = 0
    localStorage.setItem('orders_count', JSON.stringify(ordersCount))
    if (orders.length != 0) {
        document.querySelectorAll('.shop_item_btn')[id].style.display = 'flex'
        document.querySelectorAll('.shop_item_img')[id].style.border = 'none'
        document.querySelectorAll('.shop_order_items_count')[id].style.display = 'none'
        document.querySelectorAll('.shop_order_item_count')[id].innerHTML = "1"


        upDateCart()
    }else{
        document.querySelectorAll('.shop_item_btn')[id].style.display = 'flex'
        document.querySelectorAll('.shop_order_items_count')[id].style.display = 'none'
        document.querySelectorAll('.shop_item_img')[id].style.border = 'none'
        document.querySelector('.shop_cart_full').style.display = 'none'
        document.querySelector('.shop_cart_empty').style.display = 'flex'
        document.querySelectorAll('.shop_order_item_count')[id].innerHTML = "1"
        cartTitle.innerHTML = `Your Cart (${orders.length})`
    }
}

async function setOrdersCount(){
    let dataSet = await fetchData()
    dataSet.forEach(el=>{
        ordersCount.push(0)
    })
    localStorage.setItem('orders_count', JSON.stringify(ordersCount))
}


async function showModal(){
    modalWindow.style.display = 'flex'
    document.querySelector('.shop_overlay').style.display = 'block'
    let dataSet = await fetchData();
    modalOrdersWrapper.innerHTML = '';
    cartTitle.innerHTML = `Your Cart (${orders.length})`
    orders = JSON.parse(localStorage.getItem('orders'))
    totalPrice = 0;
    orders.forEach(el=>{
        totalPrice = totalPrice + ordersCount[el]*dataSet[el].price
        ordersCount = JSON.parse(localStorage.getItem('orders_count'))
        let item = `								
        <div class="shop_order shop_modal_order">
            <div class="shop_modal_order_left">
              <img src="${dataSet[el].image.thumbnail}" alt="" class="shop_modal_order_img">
              <div class="shop_order_info shop_modal_order_info">
                <h3 class="shop_order_name">${dataSet[el].name}</h3>
                <div class="shop_order_info_bottom">
                  <p class="shop_order_quantity">${ordersCount[el]}x</p>
                  <p class="shop_order_price">@ $${(dataSet[el].price).toFixed(2)}</p>
                </div>
              </div>
            </div>
            <h2 class="shop_order_total shop_modal_order_total">$${(ordersCount[el]*dataSet[el].price).toFixed(2)}</h2>
        </div>`
        localStorage.setItem('total_price', JSON.stringify(totalPrice))
        document.querySelector('.shop_modal_total').innerHTML = `$${totalPrice.toFixed(2)}`
        modalOrdersWrapper.innerHTML += item
    })        

}
function closeModal() {
    modalWindow.style.display = 'none'
    document.querySelector('.shop_overlay').style.display = 'none'
    
}


if (localStorage.getItem('orders')) {
    orders = JSON.parse(localStorage.getItem('orders'))
    if (orders.length != 0) {
        upDateCart()
    }
} else {
    localStorage.setItem('orders', JSON.stringify(orders))
}
if (localStorage.getItem('orders_count')) {
    ordersCount = JSON.parse(localStorage.getItem('orders_count'))
} else {
    setOrdersCount()
}
if (localStorage.getItem('total_price')) {
    totalPrice = JSON.parse(localStorage.getItem('total_price'))
} else {
    localStorage.setItem('total_price', JSON.stringify(totalPrice))
}
showItems()

