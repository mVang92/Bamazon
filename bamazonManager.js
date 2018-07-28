var inquirer = require("inquirer")
var mysql = require("mysql")

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "root",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("----------------------")
    console.log("   Welcome, Manager!  ");
    console.log("----------------------\n")
    promptMngr();
});

function promptMngr() {
    inquirer.prompt([
        {
            name: "command",
            message: "\nSelect an option:",
            type: "list",
            choices: ["Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
        }
    ]).then(function (choice) {
        switch (choice.command) {
            case "Products for Sale":
                showItems();
                break;
            case "View Low Inventory":
                viewLowInv();
                break;
            case "Add to Inventory":
                addInv();
                break;
            case "Add New Product":
                addNew();
                break;
        };
    });
}

function showItems() {
    connection.query("SELECT * FROM products", function (err, results) {
        for (var i = 0; i < results.length; i++) {
            console.log(
                results[i].item_id +
                " | " + results[i].product_name +
                " | $" + results[i].consumer_price);
        }
        promptMngr();
    });
}

function viewLowInv() {
    // console.log("Low Inv");
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function (err, results) {
        for (var i = 0; i < results.length; i++) {
            console.log(
                results[i].item_id +
                " | " + results[i].product_name +
                " | " + results[i].stock_quantity + " in stock.");
        }
        promptMngr();
    });
}

function addInv() {
    // console.log("Add Inv");
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;
        inquirer.prompt([
            {
                name: "item",
                message: "\nSelect the product you want to update.",
                type: "list",
                choices: function () {
                    var choices = [];
                    for (var i = 0; i < results.length; i++) {
                        choices.push(results[i].item_id + " | " + results[i].product_name)
                    }
                    return choices;
                }
            }
        ]).then(function (chosenItem) {
            var splitItemId = chosenItem.item.split(" ", 1);
            var quantity = parseInt(splitItemId - 1);
            inquirer.prompt([{
                name: "addInv",
                message: "Enter the amount you want to add.",
                type: "input",
                validate: function (value) {
                    if (parseInt(value) < 0) {
                        console.log("\nPlease enter a valid input.")
                        return false;
                    } else if (parseInt(value) > 0) {
                        updateDb(results, quantity, value, splitItemId);
                        return true;
                    }
                }
            }]);
        });
    });
}

function addNew() {
    console.log("add new");
    promptMngr();
}

function updateDb(results, quantity, value, splitItemId) {
    var query = connection.query(
        "UPDATE products SET ? WHERE ?",
        [
            {
                stock_quantity: parseInt(results[quantity].stock_quantity) + parseInt(value)
            },
            {
                item_id: splitItemId
            }
        ],
        function (err, res) {
            var product = " product.";
            if (value > 1) {
                product = " products.";
            }
            process.stdout.write(results[splitItemId - 1].product_name);
            process.stdout.write(" updated by ")
            process.stdout.write(value)
            process.stdout.write(" more")
            process.stdout.write(product)
        }
    );
}