var inquirer = require("inquirer");
var mysql = require('mysql');
var lowflag = false;
var total;
var con = mysql.createConnection({
	host: "localhost",
	user: "Ben",
	password: "bgrant88",
	database: "bamazon"

});

start();

function start() {

	con.query("SELECT * FROM products", function(err, result, fields) {
		if (err) throw err;

		for (var i = 0; i < result.length; i++) {

			total = result[i].item_id;
		}
	});

	lowflag = false;

	inquirer
		.prompt([

			{
				type: "list",
				message: "\nWhat would you like to do?",
				choices: ["view products for sale", "view low inventory",
					"add to inventory", "add new product"
				],
				name: "options",


			}
		]).then(function(input) {

			switch (input.options) {

				case 'view products for sale':
					viewProds();
					break;

				case 'view low inventory':
					viewLow();
					break;

				case 'add to inventory':
					addInv();
					break;

				case 'add new product':
					addProd();
					break;
			}
		})
}


function viewProds() {

	con.query("SELECT * FROM products", function(err, result, fields) {
		if (err) throw err;

		for (var i = 0; i < result.length; i++) {

			console.log("\nProduct id: " + result[i].item_id);
			console.log("Product name: " + result[i].product_name);
			console.log("Department name: " + result[i].dept_name);
			console.log("Product price: " + result[i].price);
			console.log("Stock quantity: " + result[i].stock_quant);
		}
	});

	setTimeout(function() {

		start();

	}, 500);
}

function viewLow() {

	con.query("SELECT * FROM products", function(err, result, fields) {
		if (err) throw err;

		for (var i = 0; i < result.length; i++) {

			if (result[i].stock_quant < 6) {

				lowflag = true;
				console.log("\nProduct id: " + result[i].item_id);
				console.log("Product name: " + result[i].product_name);
				console.log("Department name: " + result[i].dept_name);
				console.log("Product price: " + result[i].price);
				console.log("Stock quantity: " + result[i].stock_quant);
			}

		}

		if (lowflag === false) {

			console.log("\nNo low inventory!!");
			start();
		}

	});

	if (lowflag === true) {
		setTimeout(function() {

			start();
		}, 500);

	}
}

function addInv() {

	inquirer
		.prompt([

			{
				type: "input",
				message: "Type in the Id of the product you would like to add:",
				name: "prod",
				validate: function(num) {
					if (isNaN(num) || num > total || num < 1) {
						return false;
					} 

					else {
						return true;
					}
				}
			}, {
				type: "input",
				message: "Type in the amount of units you would like to add:",
				name: "amount",
				validate: function(num) {
					if (isNaN(num) || num < 1) {
						return false;
					} 

					else {
						return true;
					}
				}

			}
		])
		.then(function(data) {

			con.query("SELECT * FROM products where item_id =" + data.prod + "",
				function(err, result, fields) {
					if (err) throw err;
					var sql = "UPDATE products SET stock_quant = '" +
						(result[0].stock_quant + JSON.parse(data.amount)) +
						"' WHERE stock_quant = '" + result[0].stock_quant + "'";

					con.query(sql, function(err, result) {
						if (err) throw err;
					});
					console.log("\ninventory updated!");
					start();
				})
		});
}

function addProd() {

	inquirer
		.prompt([

			{
				type: "input",
				message: "Which product would like to add:",
				name: "prod",

			}, {
				type: "input",
				message: "Which department is the product in?",
				name: "dept",

			}, {
				type: "input",
				message: "Type in the price of the product:",
				name: "price",
				validate: function(num) {
					if (isNaN(num) || num < 1) {
						return false;
					} 

					else {
						return true;
					}
				}

			}, {
				type: "input",
				message: "Type in the amount of units you would like to add:",
				name: "amount",
				validate: function(num) {
					if (isNaN(num) || num < 1) {
						return false;
					} 

					else {
						return true;
					}
				}

			}
		])
		.then(function(data) {

			con.query("INSERT INTO products (product_name, dept_name, price, stock_quant) values('" + data.prod + "', '" + data.dept + "'," + data.price + "," + data.amount + ")");

			console.log("\nPoduct added!");
			start();
		})

}