<h1>This is my Node Bamazon App</h1>
<p>It's entirely back-end, and uses mysql and node js.</p>
<p>There's a Customer version, Manager version, and Supervisor version.</p>

<h2>Customer</h2>
A customer can create an account, login, and then view the products. Then, they will be promted to buy one by id, and the quantity they want.<br>
They are then asked if they want to see the products again, if they say yes they can buy another, if not they will exit the app.
<br>
<ul>
<li>the account username/password is saved in its own table</li>
<li>once creating an account you can login with the same account</li>
<li>the product quantity and sales are updated in the products table</li>
</ul>
<img src="https://giphy.com/gifs/xT1R9TSREdgo03yenm"
full video demo: (https://www.youtube.com/watch?v=4htim3aFy7o)

<h2>Manager</h2>
A manager can create an account, and login. Then, they will be prompted to either view products, low inventory, add to inventory, add products, or exit the app.
<br>
<ul>
<li>the account username/password is saved in its own table</li>
<li>once creating an account you can login with the same account</li>
<li>view products displays all products and info</li>
<li>low inventory displays products with a quantity of 5 or less</li>
<li>add to inventory adds to the quantity of a chosen product</li>
<li>add new product creates a new product, adds it to a department, and adds the chosen quantity</li>
<li>exit quits the app</li>
</ul>
video demo: (https://www.youtube.com/watch?v=JNcJgZ6jur4)

<h2>Supervisor</h2>
A supervisor can create an account, and login. Then, they will be prompted to either view product sales by dept, create a new dept, or exit the app.
<br>
<ul>
<li>the account username/password is saved in its own table</li>
<li>once creating an account you can login with the same account</li>
<li>all of the product info is displayed</li>
<li>The product sales are created on the fly by adding all the sales from each department and joining into the departments table</li>
<li>The total profits are created on the fly by adding all the sales from each department, subtracting the over head costs and joining into the departments table</li>
<li>exit quits the app</li>
</ul>
video demo: (https://www.youtube.com/watch?v=ugUaFfWm7NE)


