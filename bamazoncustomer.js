var inquirer = require("inquirer");
var mysql = require('mysql');
var total;
var sales;
var con = mysql.createConnection({
	host: "localhost",
	user: "Ben",
	password: "bgrant88",
	database: "bamazon"
});

display();

function display() {

	con.query("SELECT * FROM products", function(err, result, fields) {
		if (err) throw err;

		for (var i = 0; i < result.length; i++) {
			total = result[i].product_id;
			console.log("\nProduct id: " + result[i].product_id);
			console.log("Product name: " + result[i].product_name);
			console.log("Department name: " + result[i].dept_name);
			console.log("Product price: $" + result[i].price);
			console.log("Stock quantity: " + result[i].stock_quant);
			console.log("Product Sales: $" + result[i].product_sales);
		}
	});

	setTimeout(function() {

		buy();

	}, 500);
}

function buy() {

	inquirer
		.prompt([

			{
				type: "input",
				message: "\nType in the Id of the product you would like to buy:",
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
				message: "\nType in the amount of units you would like to buy:",
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
					sales = data.amount * result[0].price;

					if (JSON.parse(data.amount) <= result[0].stock_quant) {
						console.log("\nOrder placed! Total amount is: $" + data.amount * result[0].price);

						var sql = "UPDATE products SET stock_quant = '" +
							(result[0].stock_quant - JSON.parse(data.amount)) +
							"' WHERE stock_quant = '" + result[0].stock_quant + "'";

						con.query(sql, function(err, result) {
							if (err) throw err;
						});

						console.log("\ninventory updated!");
					
					} 

					else if (JSON.parse(data.amount) > result[0].stock_quant){

						console.log("\nNot enough inventory!\n");
						buy();
						return false;
					}

					var sql2 = "UPDATE products SET product_sales = '" +
							(sales + result[0].product_sales) +
							"' WHERE product_id = '" + data.prod + "'";

						con.query(sql2, function(err, result) {
							if (err) throw err;

						});
						console.log("\nSales updated!");
						agains();
				})
			});
}

function agains() {
	inquirer.prompt([{
		type: "confirm",
		message: "\nWould you like to see the products again?",
		name: "conf",
		default: true

	}]).then(function(again) {

		if (again.conf) {

			display();
		} 

		else {

			console.log("\nBYE!!");
			con.end();
		}
	})
}