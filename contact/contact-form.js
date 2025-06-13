document
  .getElementById("contactForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      subject: formData.get("subject"),
      message: formData.get("message"),
    };

    const successDiv = document.getElementById("formSuccess");
    const submitButton = form.querySelector('button[type="submit"]');

    try {
      submitButton.disabled = true;

      const response = await fetch("http://localhost:3000/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        successDiv.style.display = "flex";
        form.reset();
        setTimeout(() => {
          successDiv.style.display = "none";
        }, 5000);
      } else {
        throw new Error(result.error || "Failed to send email");
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
      console.error("Form submission error:", error);
    } finally {
      submitButton.disabled = false;
    }
  });
