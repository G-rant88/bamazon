var inquirer = require("inquirer");
var mysql = require('mysql');
var table = require('console.table');
var total;
var namey;
var pwy;
var deptArr = [];
var con = mysql.createConnection({
	host: "localhost",
	user: "Ben",
	password: "bgrant88",
	database: "bamazon"
});

con.connect( function(err){
	if(!err){
	ask();
}

});

function ask() {

  console.log("\nWelcome to Bamazon Manager Edition!\n");

  inquirer
    .prompt([{
      type: "confirm",
      message: "Do already have a manager account?",
      name: "conf",
      default: true
    }])
    .then(function(acc) {

      if (acc.conf) {

        signin();
      } 

      else {

        create();
      }

    });

}

function create() {

  inquirer
    .prompt([{
      type: "input",
      message: "Please create a username:",
      name: "user"
    }, {
      type: "password",
      message: "Plese create a password:",
      name: "pws",
      hidden: true,
      mask: "*"
    }])
    .then(function(sign) {

        var sql = "INSERT INTO manager (username, password) VALUES ?";
        values = [

          [sign.user, sign.pws]

        ];

        con.query(sql, [values], function(err, result) {
          if (err) throw err;

  signin();
      });
    });
}

function signin() {

  inquirer
    .prompt([{
      type: "input",
      message: "Please sign in with your username:",
      name: "user2"
    }, {
      type: "password",
      message: "Please sign in with your password:",
      name: "pws2",
      hidden: true,
      mask: "*"
    }])

  .then(function(sign2) {

    con.query("SELECT * FROM manager", function(err, result, fields) {
      if (err) throw err;

      for (var i = 0; i < result.length; i++) {

        if (sign2.user2 === result[i].username && sign2.pws2 === result[i].password) {

          console.log("\nWelcome " + sign2.user2 + "\n");
     
          namey = sign2.user2;
          pwy = sign2.pws2;
       
          start();
          return false;

        }

      };

      console.log("Sorry, wrong username/password. Try again:\n");
      signin();
      return false;

    });

  });

}

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

	con.query("SELECT * FROM departments", function(err, result, fields) {
		if (err) throw err;

		for (var i = 0; i < result.length; i++) {

		deptArr.push(result[i].dept_name);
		
		}
	});

	
	inquirer
		.prompt([

			{
				type: "input",
				message: "Which product would like to add:",
				name: "prod"

			}, {
				type: "list",
				message: "Which department is the product in?",
				choices: deptArr,
				name: "dept"

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

	console.log("\nGoodbye " + namey);
			con.end();
}