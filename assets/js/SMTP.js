<script>
    document.querySelector('#contact form').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission

        // Get form data
        const name = document.querySelector('input[name="name"]').value;
        const email = document.querySelector('input[name="email"]').value;
        const message = document.querySelector('textarea[name="message"]').value;

        // Validation
        if (!name || !email || !message) {
            alert("Please fill in all fields.");
            return;
        }

        // Use SMTP.js to send the email
        Email.send({
            SecureToken: "YOUR_SMTPJS_SECURE_TOKEN", // Replace with your SMTP.js secure token
            To: "your-email@example.com", // Replace with your own email address
            From: email,
            Subject: `New message from ${name}`,
            Body: `<strong>Name:</strong> ${name}<br><strong>Email:</strong> ${email}<br><strong>Message:</strong><br>${message}`
        }).then(
            message => {
                if (message === 'OK') {
                    alert("Message sent successfully!");
                    // Clear the form after successful submission
                    document.querySelector('#contact form').reset();
                } else {
                    alert("Failed to send message. Please try again later.");
                    console.error("Error:", message);
                }
            }
        );
    });
</script>
