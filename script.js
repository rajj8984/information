document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('infoForm');
    const emailInput = document.getElementById('email');
    const topicSelect = document.getElementById('topic');
    const otherTopicGroup = document.getElementById('otherTopicGroup');
    const otherTopicInput = document.getElementById('otherTopic');
    
    // Function to validate Gmail
    function isValidGmail(email) {
        const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
        return gmailRegex.test(email);
    }

    // Handle topic selection change
    topicSelect.addEventListener('change', function() {
        if (this.value === 'Other') {
            otherTopicGroup.style.display = 'block';
            otherTopicInput.required = true;
        } else {
            otherTopicGroup.style.display = 'none';
            otherTopicInput.required = false;
            otherTopicInput.value = '';
        }
    });

    // Add real-time validation for email
    emailInput.addEventListener('input', function() {
        const email = this.value;
        if (email && !isValidGmail(email)) {
            this.setCustomValidity('Please enter a valid Gmail address (example@gmail.com)');
            this.classList.add('error');
        } else {
            this.setCustomValidity('');
            this.classList.remove('error');
        }
    });

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Get form values
        const name = document.getElementById('name').value;
        const personalNumber = document.getElementById('personalNumber').value;
        const email = document.getElementById('email').value;
        const topic = topicSelect.value === 'Other' ? otherTopicInput.value : topicSelect.value;

        // Validate Gmail
        if (!isValidGmail(email)) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = 'Please use a valid Gmail address (example@gmail.com)';
            form.insertBefore(errorDiv, form.querySelector('button'));
            
            // Remove error message after 5 seconds
            setTimeout(() => {
                errorDiv.remove();
            }, 5000);
            return;
        }

        try {
            // Send data to server
            const response = await fetch('http://localhost:3000/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    personalNumber,
                    email,
                    topic
                })
            });

            if (!response.ok) {
                throw new Error('Failed to save data');
            }

            // Create and show success message
            const messageDiv = document.createElement('div');
            messageDiv.className = 'success-message';
            messageDiv.textContent = 'You will receive a call in 5 to 10 minutes';
            form.parentNode.insertBefore(messageDiv, form.nextSibling);

            // Clear form
            form.reset();
            otherTopicGroup.style.display = 'none';

            // Remove message after 10 seconds
            setTimeout(() => {
                messageDiv.remove();
            }, 10000);

        } catch (error) {
            console.error('Error:', error);
            alert('There was an error submitting the form. Please try again.');
        }
    });
});
