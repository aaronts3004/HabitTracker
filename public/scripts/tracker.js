
const months_arr = [ "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December" ];

// global variable to store the latest date which the user clicked on
let currentlyClickedDate;

/* ---- Generate the table caption label of the current month ---- */
function setTableCaption() {
    // Find the current month that will be displayed upon opening the window
    // The months returned by <Date.getMonth()> class are zero-indexed!
    const currentMonth = new Date(Date.now());
    const tableElement = document.getElementById("main-table");
    const cap = document.createElement("caption");
    const node = document.createTextNode(months_arr[currentMonth.getMonth()])
    cap.appendChild(node);
    tableElement.appendChild(cap);
}

/* ---- Generate the calendar dates of the current month ----  */ 
function generateTableDays() {
    const currentMonth = new Date(Date.now());
    
    // Shift the 'day' attribute of the <Date> object back to the 1st day of the month
    currentMonth.setDate(1);
    // Get the corresponding (Mon - Sun) day of the week for this day
    let weekDayIndex = currentMonth.getDay();      // Index: Sunday - Saturday : 0 - 6

    // Shift the 'day' back to the LAST day of the previous month (which has index 0)
    currentMonth.setDate(0);
    let prevMonthLastDate = currentMonth.getDate();     // stores the last calendar date(s) of the previous month
    console.log(prevMonthLastDate);
    const arrayOfLastDays = [];                  // to fill up the first boxes of the calendar from Monday onwards
    if (weekDayIndex == 0){
        weekDayIndex = 7;
    }
    while(weekDayIndex > 1){                    
        arrayOfLastDays.push(prevMonthLastDate);
        prevMonthLastDate--;            
        weekDayIndex--;             // Keep pushing dates as long as Monday has not been reached
    }
    console.log(arrayOfLastDays);

    // Sets the boundary for the last calendar date of this month
    const lastDayCurrentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
    
    /* **********************  FILLING THE TABLE CALENDAR  ********************* */
    // Fill the table with boxes/dates depending on the chosen or the current month
    let dateValue = 1;  // Index to create calendar number dates

    let endOfMonthReached = false;

    for (let week = 1; week <= 5; week++){              // Iterate over the 5 rows of the calendar     
        const cur_row = document.getElementById("week" + week);
        for (let dayColumn = 1; dayColumn <= 7; dayColumn++){       // Iterate over the 7 columns of each weekday
            let dayBox = document.createElement("td");          // Insert data into the table
            let dayNumberTag = document.createElement("span");
            if (arrayOfLastDays.length) {       // As long as there are still weekdays from the previous month
                dayNumberTag.textContent = arrayOfLastDays.pop()
                dayBox.setAttribute("class", "blurData");
            } else {
                dayNumberTag.textContent = dateValue;
                dateValue++;

                if(endOfMonthReached){
                    dayBox.setAttribute("class", "blurData");
                }
            }
        
            if (dateValue > lastDayCurrentMonth) {              // Until the last day of the month has been reached
                dateValue = 1;                                  // Then start countin from 1 again
                endOfMonthReached = true;
            }
            dayBox.appendChild(dayNumberTag);       // add the <span> element containing the number of the date
            cur_row.appendChild(dayBox);
        }
    }
}

/* ---- Add event listeners to table boxes ---- */
function togglePopup() {
    const table = document.getElementById("main-table");
    const popup = document.getElementById("popup");
    const newHabitButton = document.getElementById("new-habit-button");
    const markHabitContent = document.getElementById("mark-habit-content");
    const registerHabitContent = document.getElementById("register-habit-content");
    let isPopupVisible = false;

     // Function to toggle popup
     function toggleFunction(event, showMarkHabitContent = true) {
        if (isPopupVisible) {
            hidePopup();
        } else {
            if (showMarkHabitContent) {
                markHabitContent.style.display = 'block';
                registerHabitContent.style.display = 'none';

                if (event.target.tagName === 'td') {
                    const day = event.target.querySelector('span').textContent;
                    const month = document.querySelector('#main-table caption').textContent;
                    const year = new Date().getFullYear(); // Assuming current year
                    clickedDate = `${year}-${months_arr.indexOf(month) + 1}-${day.padStart(2, '0')}`;
                    console.log(clickedDate);
                }
            } else {
                markHabitContent.style.display = 'none';
                registerHabitContent.style.display = 'block';
            }
            showPopup(event);
        }
        event.stopPropagation(); // Prevent the click from being handled by the document listener
    }

    // Function to show popup
    function showPopup(event) {
        popup.style.display = 'block';
        isPopupVisible = true;
    }

    // Function to hide popup
    function hidePopup() {
        popup.style.display = 'none';
        isPopupVisible = false;
    }

    // Add event listener to each table box to show the popup on click
    // Whenever the user clicks on a calendar date, the currently registered 'habits' 
    // should also be retrieved so that they can be displayed on the dropdown of 
    // the habit marking popup window
    table.querySelectorAll("td").forEach(item => {
        item.addEventListener('click', (event) => toggleFunction(event, true));
        
    });

    // Add event listener to "new habit" button to show the register habit content on click
    newHabitButton.addEventListener('click', (event) => toggleFunction(event, false)); // false for registering habit

    // Add click event listener to the document to hide the popup when clicking outside
    document.addEventListener('click', (event) => {
        if (isPopupVisible && !popup.contains(event.target)) {
            hidePopup();
        }
    });

    // Prevent clicks inside the popup from closing it
    popup.addEventListener('click', (event) => {
        event.stopPropagation();
    });
}

// Fetch habits from API endpoint and update the dropdown
async function loadHabits() {
    try {
        console.log("loadHabits()");
        const response = await fetch('/api/habits');
        const habits_array = await response.json();
        // const habits_array = habits_object.habits;

        console.log("At Tracker collected: ");
        console.log(typeof(habits_array));
        console.log(habits_array);
        
        // Get the dropdown select element
        const habitSelect = document.getElementById('habitSelect');
        const newHabitOption = habitSelect.lastElementChild;
        const legend = document.getElementById('habits-legend');
        
        habits_array.forEach(habit => {
            // Create the option for the dropdown display
            const option = document.createElement('option');
            option.textContent = habit.name;
            habitSelect.insertBefore(option, newHabitOption);

            // Add the habit to the legend
            const li = document.createElement('li');
            li.textContent = habit.name;
            const spanEl = document.createElement('span');
            spanEl.setAttribute('class', 'dot');
            spanEl.style.backgroundColor = habit.color;
            li.appendChild(spanEl);
            legend.appendChild(li);

        });
        console.log("--- Loaded habits --- ");
    } catch (error) {
        console.error('Error loading habits:', error);
    }
}

// Event listener for the "Mark Habit" button 
// Necessary to send the previously clicked <td> element
// namely the corresponding calendar date to the server
function markHabit(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    
    // Get the selected date from the calendar
    formData.append('date', currentlyClickedDate);
  
    fetch('/mark-habit', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        console.log('Habit marked successfully');
        // You can add code here to update the UI if needed
      } else {
        console.error('Error marking habit:', data.error);
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
}


// ***** Load the script ****** //
document.addEventListener('DOMContentLoaded', function() {
    setTableCaption();
    generateTableDays();
    togglePopup();
    loadHabits();

    document.getElementById('mark-habit-form').addEventListener('submit', markHabit);
});
