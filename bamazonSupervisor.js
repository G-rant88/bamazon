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

con.connect( function(err)
{
	if(!err){
	ask();
}

});

function ask() {

  console.log("\nWelcome to Bamazon Supervisor Edition!\n");

  inquirer
    .prompt([{
      type: "confirm",
      message: "Do already have a supervisor account?",
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

        var sql = "INSERT INTO supervisor (username, password) VALUES ?";
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

    con.query("SELECT * FROM supervisor", function(err, result, fields) {
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

function viewSales() {

	con.query("SELECT departments.department_id, departments.dept_name, departments.over_head_costs, SUM(product_sales) AS product_sales, (SUM(product_sales) - departments.over_head_costs) as total_profit from products right JOIN departments on departments.dept_name = products.dept_name GROUP BY departments.department_id;", function(err, result, fields) {
		if (err) throw err;

		 console.table(result);
		 	start();
	})
}

function newDept() {

	inquirer
		.prompt([{
			type: "input",
			message: "What is the department name?",
			name: "names"
		}, {
			type: "input",
			message: "What are the over head costs?",
			name: "over",
			validate: function(num) {
					if (isNaN(num) || num < 1) {
						return false;
					} 

					else {
						return true;
					}
				}

		}]).then(function(input) {

			con.query("INSERT INTO departments(department_id, dept_name, over_head_costs) values(" + (total + 1) + ", '" + input.names + "', " + JSON.parse(input.over) + ")"), (function(err, result, fields) {
	
	
});
			console.log("\nDepartment added.");
			console.log("\nPlease have your Manager add a product to the new department.");

				start();
	});
}

function exit() {

	console.log("\nGoodbye " + namey);
	con.end();
}