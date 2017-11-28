var inquirer = require("inquirer");
var mysql = require('mysql');
var table = require('console.table');
var Table = require('cli-table');
var total;
var pSales;
var con = mysql.createConnection({
	host: "localhost",
	user: "Ben",
	password: "bgrant88",
	database: "bamazon"

});

start();

function start() {

	con.query("SELECT * FROM departments", function(err, result, fields) {
		if (err) throw err;

		for (var i = 0; i < result.length; i++) {

			total = result[i].department_id;
		}
	});

	inquirer
		.prompt([

			{
				type: "list",
				message: "\nWhat would you like to do?",
				choices: ["View Product Sales by Department", "Create New Department", 
				"exit"
				],
				name: "options",
			}
		]).then(function(input) {

			switch (input.options) {

				case 'View Product Sales by Department':
					viewSales();
					break;

				case 'Create New Department':
					newDept();
					break;

				case 'exit':
					exit();
					break;
			}
		})
}

function viewSales(){


con.query("SELECT * FROM departments", function(err, result, fields) {
		if (err) throw err;


		for (var i = 0; i < result.length; i++) {
			console.table([
			{
			department_id: result[i].department_id,
			department_name: result[i].dept_name,
			over_head_costs: result[i].over_head_costs,
			 product_sales: result[i].product_sales
			}
				])

		}
	})
}



// function newDept(){




	
// }



function exit(){

	console.log("\nBYE!!");
			con.end();
}