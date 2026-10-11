const API_URL = "http://localhost:5000/api/transactions";

const SAVINGS_API_URL = "http://localhost:5000/api/savings-goals";

let expenseChart;


// ===============================
// ADD TRANSACTION
// ===============================

document.getElementById("transactionForm").addEventListener("submit", async function(event) {

    event.preventDefault();

    const transaction = {
        description: document.getElementById("description").value,
        amount: Number(document.getElementById("amount").value),
        type: document.getElementById("type").value,
        category: document.getElementById("category").value
    };

    try {

        const response = await fetch(API_URL, {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(transaction)
        });

        const data = await response.json();

        if (response.ok) {

            alert("Transaction added successfully!");

            document.getElementById("transactionForm").reset();

            loadTransactions();

        } else {

            alert("Error: " + data.message);

        }

    } catch (error) {

        console.error(error);

        alert("Backend connection failed!");

    }

});


// ===============================
// LOAD TRANSACTIONS
// ===============================

async function loadTransactions() {

    try {

        const response = await fetch(API_URL);

        const transactions = await response.json();

        const list = document.getElementById("transactionList");

        list.innerHTML = "";

        let totalIncome = 0;
        let totalExpenses = 0;

        const categoryTotals = {};


        // Monthly totals
        let monthlyIncome = 0;
        let monthlyExpenses = 0;

        const currentDate = new Date();

        const currentMonth = currentDate.getMonth();

        const currentYear = currentDate.getFullYear();


        transactions.forEach(transaction => {

            // ===============================
            // TOTAL INCOME AND EXPENSES
            // ===============================

            if (transaction.type === "income") {

                totalIncome += transaction.amount;

            }

            if (transaction.type === "expense") {

                totalExpenses += transaction.amount;


                if (categoryTotals[transaction.category]) {

                    categoryTotals[transaction.category] += transaction.amount;

                } else {

                    categoryTotals[transaction.category] =
                        transaction.amount;

                }

            }


            // ===============================
            // MONTHLY SUMMARY
            // ===============================

            const transactionDate =
                new Date(transaction.date);

            const transactionMonth =
                transactionDate.getMonth();

            const transactionYear =
                transactionDate.getFullYear();


            if (
                transactionMonth === currentMonth &&
                transactionYear === currentYear
            ) {

                if (transaction.type === "income") {

                    monthlyIncome += transaction.amount;

                }

                if (transaction.type === "expense") {

                    monthlyExpenses += transaction.amount;

                }

            }


            // ===============================
            // DISPLAY TRANSACTION
            // ===============================

            const div = document.createElement("div");

            div.className = "transaction";

            div.innerHTML = `
                <strong>${transaction.description}</strong><br>
                Amount: ₹${transaction.amount}<br>
                Type: ${transaction.type}<br>
                Category: ${transaction.category}<br><br>

                <button onclick="deleteTransaction('${transaction._id}')">
                    Delete
                </button>
            `;

            list.appendChild(div);

        });


        // ===============================
        // DASHBOARD
        // ===============================

        const balance =
            totalIncome - totalExpenses;

        document.getElementById("totalIncome").textContent =
            "₹" + totalIncome;

        document.getElementById("totalExpenses").textContent =
            "₹" + totalExpenses;

        document.getElementById("balance").textContent =
            "₹" + balance;


        // ===============================
        // MONTHLY SUMMARY DISPLAY
        // ===============================

        const monthlyBalance =
            monthlyIncome - monthlyExpenses;

        document.getElementById("monthlyIncome").textContent =
            "₹" + monthlyIncome;

        document.getElementById("monthlyExpenses").textContent =
            "₹" + monthlyExpenses;

        document.getElementById("monthlyBalance").textContent =
            "₹" + monthlyBalance;


        // ===============================
        // OVERSPENDING ALERT
        // ===============================

        const alertBox =
            document.getElementById("overspendingAlert");

        if (totalExpenses > totalIncome) {

            const overspentAmount =
                totalExpenses - totalIncome;

            alertBox.innerHTML = `
                <div class="alert warning">
                    🚨 Warning! Your expenses are higher than your income.
                    <br>
                    You have overspent by ₹${overspentAmount}.
                </div>
            `;

        } else {

            const remainingAmount =
                totalIncome - totalExpenses;

            alertBox.innerHTML = `
                <div class="alert safe">
                    ✅ Good! Your expenses are within your income.
                    <br>
                    Remaining balance: ₹${remainingAmount}
                </div>
            `;

        }


        // ===============================
        // UPDATE CHART
        // ===============================

        updateChart(categoryTotals);

    } catch (error) {

        console.error(
            "Error loading transactions:",
            error
        );

    }

}


// ===============================
// CREATE / UPDATE PIE CHART
// ===============================

function updateChart(categoryTotals) {

    const ctx =
        document.getElementById("expenseChart");

    const labels =
        Object.keys(categoryTotals);

    const values =
        Object.values(categoryTotals);


    if (expenseChart) {

        expenseChart.destroy();

    }


    expenseChart = new Chart(ctx, {

        type: "pie",

        data: {

            labels: labels,

            datasets: [{

                label: "Expenses",

                data: values

            }]

        },

        options: {

            responsive: true,

            plugins: {

                legend: {
                    position: "bottom"
                },

                title: {

                    display: true,

                    text: "Expenses by Category"

                }

            }

        }

    });

}


// ===============================
// DELETE TRANSACTION
// ===============================

async function deleteTransaction(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this transaction?"
    );

    if (!confirmDelete) {

        return;

    }


    try {

        const response = await fetch(
            `${API_URL}/${id}`,
            {
                method: "DELETE"
            }
        );

        const data = await response.json();


        if (response.ok) {

            alert(
                "Transaction deleted successfully!"
            );

            loadTransactions();

        } else {

            alert(
                "Error deleting transaction"
            );

        }

    } catch (error) {

        console.error(error);

        alert("Delete failed!");

    }

}


// ===============================
// SAVINGS GOALS
// ===============================

document.getElementById("savingsGoalForm").addEventListener("submit", async function(event) {

    event.preventDefault();


    const goal = {

        name:
            document.getElementById("goalName").value,

        targetAmount:
            Number(
                document.getElementById("targetAmount").value
            ),

        savedAmount:
            Number(
                document.getElementById("savedAmount").value
            )

    };


    try {

        const response =
            await fetch(SAVINGS_API_URL, {

                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json"

                },

                body: JSON.stringify(goal)

            });


        const data =
            await response.json();


        if (response.ok) {

            alert(
                "Savings goal added successfully!"
            );

            document
                .getElementById("savingsGoalForm")
                .reset();

            document
                .getElementById("savedAmount")
                .value = 0;

            loadSavingsGoals();

        } else {

            alert(
                "Error: " + data.message
            );

        }

    } catch (error) {

        console.error(error);

        alert(
            "Savings goal connection failed!"
        );

    }

});


// ===============================
// LOAD SAVINGS GOALS
// ===============================

async function loadSavingsGoals() {

    try {

        const response =
            await fetch(SAVINGS_API_URL);

        const goals =
            await response.json();


        const list =
            document.getElementById(
                "savingsGoalList"
            );

        list.innerHTML = "";


        goals.forEach(goal => {

            let percentage =
                (goal.savedAmount /
                goal.targetAmount) * 100;


            percentage =
                Math.min(percentage, 100);


            const div =
                document.createElement("div");

            div.className = "goal";


            div.innerHTML = `

                <h3>🎯 ${goal.name}</h3>

                <p>
                    Saved: ₹${goal.savedAmount}
                    / ₹${goal.targetAmount}
                </p>

                <div class="progress-container">

                    <div
                        class="progress-bar"
                        style="width: ${percentage}%"
                    ></div>

                </div>

                <p>
                    Progress:
                    ${percentage.toFixed(1)}%
                </p>

                <button
                    onclick="deleteSavingsGoal('${goal._id}')"
                >
                    Delete Goal
                </button>

            `;


            list.appendChild(div);

        });

    } catch (error) {

        console.error(
            "Error loading savings goals:",
            error
        );

    }

}


// ===============================
// DELETE SAVINGS GOAL
// ===============================

async function deleteSavingsGoal(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this savings goal?"
    );


    if (!confirmDelete) {

        return;

    }


    try {

        const response =
            await fetch(
                `${SAVINGS_API_URL}/${id}`,
                {
                    method: "DELETE"
                }
            );


        if (response.ok) {

            alert(
                "Savings goal deleted successfully!"
            );

            loadSavingsGoals();

        } else {

            alert(
                "Error deleting savings goal"
            );

        }

    } catch (error) {

        console.error(error);

        alert("Delete failed!");

    }

}


// ===============================
// LOAD DATA WHEN PAGE OPENS
// ===============================

loadTransactions();

loadSavingsGoals();