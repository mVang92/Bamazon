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

function promptMngr(){
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
        console.log("\nItems Available for Sale")
        for (var i = 0; i < results.length; i++) {
            console.log(
                results[i].item_id +
                " | " + results[i].product_name +
                " | $" + results[i].consumer_price);
        }
        promptMngr();
    });
}

function viewLowInv(){
    console.log("view low");
    promptMngr();
}

function addInv(){
    console.log("add inv");
    promptMngr();
}

function addNew(){
    console.log("add new");
    promptMngr();
}