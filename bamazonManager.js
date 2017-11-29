var inquirer = require("inquirer");
var mysql = require('mysql');
var table = require('console.table');
var total;
var con = mysql.createConnection({
	host: "localhost",
	user: "Ben",
	password: "bgrant88",
	database: "bamazon"
});

con.connect( function(err)
{
	if(!err){
	start();
}

});

function start() {

	con.query("SELECT * FROM products", function(err, result, fields) {
		if (err) throw err;

		for (var i = 0; i < result.length; i++) {

			total = result[i].product_id;
		}
	});

	inquirer
		.prompt([

			{
				type: "list",
				message: "\nWhat would you like to do?",
				choices: ["view products for sale", "view low inventory",
					"add to inventory", "add new product", "exit"
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

				case 'exit':
					exit();
					break;
			}
		})
}

function viewProds() {

	con.query("SELECT product_id, product_name, dept_name, price, stock_quant, product_sales FROM products", function(err, result, fields) {
		if (err) throw err;

		console.table(result)
	});

	setTimeout(function() {

		start();
	}, 500);
}

function viewLow() {

	con.query("SELECT product_id, product_name, dept_name, price, stock_quant, product_sales FROM products where stock_quant < '6'", function(err, result, fields) {

				console.table(result);

		setTimeout(function() {

			start();
		}, 500);
	});
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

			con.query("SELECT * FROM products where product_id =" + data.prod + "",
				function(err, result, fields) {
					if (err) throw err;
					var sql = "UPDATE products SET stock_quant = '" +
						(result[0].stock_quant + JSON.parse(data.amount)) +
						"' WHERE product_id = '" + data.prod + "'";

					con.query(sql, function(err, result) {
						if (err) throw err;
					});	
				});
			console.log("\ninventory updated!");
					start();
		});
}

function addProd() {

		con.query("SELECT * FROM products", function(err, result, fields) {
		if (err) throw err;

		for (var i = 0; i < result.length; i++) {

			total = result[i].product_id;
		}
	});

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

			con.query("INSERT INTO products (product_name, dept_name, price, stock_quant, product_sales, product_id) values('" + data.prod + "', '" + data.dept + "'," + data.price + "," + data.amount + ", 0," + (total + 1) +")");

			console.log("\nPoduct added!");
			start();
		});

}

function exit(){

	console.log("\nBYE!!");
			con.end();
}