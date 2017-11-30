var inquirer = require("inquirer");
var mysql = require('mysql');
var table = require('console.table');
var total;
var sales;
var namey;
var pwy;
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

  console.log("\nWelcome to Bamazon!!!\n");

  inquirer
    .prompt([{
      type: "confirm",
      message: "Do already have a customer account?",
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

        var sql = "INSERT INTO customer (username, password) VALUES ?";
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

    con.query("SELECT * FROM customer", function(err, result, fields) {
      if (err) throw err;

      for (var i = 0; i < result.length; i++) {

        if (sign2.user2 === result[i].username && sign2.pws2 === result[i].password) {

          console.log("\nWelcome " + sign2.user2 + "\n");
     
          namey = sign2.user2;
          pwy = sign2.pws2;
       
          display();
          return false;

        }

      };

      console.log("Sorry, wrong username/password. Try again:\n");
      signin();
      return false;

    });

  });

}

function display() {

	con.query("SELECT product_id, product_name, dept_name, price, stock_quant, product_sales FROM products", function(err, result, fields) {
		if (err) throw err;

		console.table(result);

		 for (var i = 0; i < result.length; i++) {
		 	total = result[i].product_id;
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
							"' WHERE product_id = '" + data.prod + "'";

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

							console.log("\nSales updated!");
						agains();

						});
					});
			
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

			console.log("\nBYE "+ namey+ "!!");
			con.end();
		}
	})
}