/* For the custom dropdown */ 
const dropdownButton = document.querySelector('.dropdown-button');
const dropdownContent = document.querySelector('.dropdown-content');
const colorOptions = document.querySelectorAll('.color-option');

dropdownButton.addEventListener('click', () => {
    dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';
});

// Close dropdown when clicking outside
window.addEventListener('click', (event) => {
    if (!event.target.matches('.dropdown-button') && !event.target.closest('.custom-dropdown')) {
        dropdownContent.style.display = 'none';
    }
});

// Set selected color value
colorOptions.forEach(option => {
    option.addEventListener('click', (event) => {
        event.stopPropagation();
        const selectedColor = option.getAttribute('data-value');
        dropdownButton.style.backgroundColor = selectedColor; // Change button color
        dropdownContent.style.display = 'none'; // Close dropdown
        // You can also handle the selected color further (e.g., store it in a variable)
        console.log('Selected Color:', selectedColor);
    });
});