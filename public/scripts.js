document.getElementById('ask-button').addEventListener('click', async () => {
    const userInput = document.getElementById('user-input').value.trim();
    const responseDiv = document.getElementById('response');

    // Clear previous response
    responseDiv.textContent = '';

    if (userInput === '') {
        alert('Please enter a question.');
        return;
    }

    responseDiv.textContent = 'Processing...';

    try {
        const response = await fetch('/ask', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userInput }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        responseDiv.textContent = result.answer || 'No answer received from the server.';
    } catch (error) {
        console.error('Error:', error);
        responseDiv.textContent = 'An error occurred while processing your request. Please try again later.';
    }
});
