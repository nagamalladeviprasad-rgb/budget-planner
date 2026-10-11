const AUTH_API_URL = "http://localhost:5000/api/auth";


// ===============================
// REGISTER
// ===============================

document
    .getElementById("registerForm")
    .addEventListener("submit", async function(event) {

        event.preventDefault();

        const name =
            document.getElementById("registerName").value;

        const email =
            document.getElementById("registerEmail").value;

        const password =
            document.getElementById("registerPassword").value;


        try {

            const response = await fetch(
                `${AUTH_API_URL}/register`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        name: name,
                        email: email,
                        password: password
                    })
                }
            );


            const data = await response.json();

            const message =
                document.getElementById("message");


            if (response.ok) {

                message.textContent =
                    "✅ Registration successful!";

                message.style.color = "green";

                document
                    .getElementById("registerForm")
                    .reset();

            } else {

                message.textContent =
                    "❌ " + data.message;

                message.style.color = "red";

            }

        } catch (error) {

            console.error(error);

            document.getElementById("message")
                .textContent =
                "❌ Backend connection failed!";

        }

    });


// ===============================
// LOGIN
// ===============================

document
    .getElementById("loginForm")
    .addEventListener("submit", async function(event) {

        event.preventDefault();


        const email =
            document.getElementById("loginEmail").value;

        const password =
            document.getElementById("loginPassword").value;


        try {

            const response = await fetch(
                `${AUTH_API_URL}/login`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                }
            );


            const data = await response.json();

            const message =
                document.getElementById("message");


            if (response.ok) {

                // Save login token
                localStorage.setItem(
                    "token",
                    data.token
                );

                // Save user information
                localStorage.setItem(
                    "user",
                    JSON.stringify(data.user)
                );


                message.textContent =
                    "✅ Login successful!";

                message.style.color = "green";


                // Open Budget Planner
                setTimeout(function() {

                    window.location.href =
                        "index.html";

                }, 1000);


            } else {

                message.textContent =
                    "❌ " + data.message;

                message.style.color = "red";

            }

        } catch (error) {

            console.error(error);

            document.getElementById("message")
                .textContent =
                "❌ Backend connection failed!";

        }

    });