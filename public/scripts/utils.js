

/* Add event listener to register and insert a new habit */
document.getElementById("new-habit-form").addEventListener("submit", function(event){
    event.preventDefault(); // Prevent the default form submission

    // Gather form data
    const habitName = document.getElementById('habit-name').value;
    const habitColor = document.getElementById('habit-color').value;
    const habitDescription = document.getElementById('habit-description').value;


    // Create an object to hold the data
    const habitData = {
        name: habitName,
        description: habitDescription,
        frequency: habitFrequency
    };

    // Send the data to the backend server
    fetch('/new-habit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(habitData) // Convert the object to JSON
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Success:', data);
        // Optionally, you can close the popup or reset the form here
    })
    .catch((error) => {
        console.error('Error:', error);
    });

});

