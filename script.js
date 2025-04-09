// Wait for the page to load
document.addEventListener('DOMContentLoaded', function() {
    
    // Add event listener for form submission
    const form = document.getElementById('contact-form');
    const result = document.getElementById('result');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(form);
        const object = Object.fromEntries(formData);
        const json = JSON.stringify(object);
        
        // Show loading message
        result.style.display = "block";
        result.innerHTML = "Please wait...";
    
        fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: json
        })
        .then(async (response) => {
            let json = await response.json();
            if (response.status == 200) {
                result.innerHTML = "Message sent successfully!";
                result.style.color = "#4CAF50";
            } else {
                console.log(response);
                result.innerHTML = "Error: " + json.message;
                result.style.color = "#f44336";
            }
        })
        .catch(error => {
            console.log(error);
            result.innerHTML = "Something went wrong! Please try again.";
            result.style.color = "#f44336";
        })
        .then(function() {
            form.reset();
            // Hide the result message after 5 seconds
            setTimeout(() => {
                result.style.display = "none";
            }, 5000);
        });
    });
    
    // Smooth scrolling for navigation links and buttons
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}); 