// import { initialTasks } from "./initialData.js";


const initialTasks = JSON.parse(localStorage.getItem('initialTasks')) || [
  {
    id: 1,
    title: "Launch Epic Career 🚀",
    description: "Create a killer Resume",
    status: "todo",
  },
  {
    id: 2,
    title: "Master JavaScript 💛",
    description: "Get comfortable with the fundamentals",
    status: "doing",
  },
  {
    id: 3,
    title: "Keep on Going 🏆",
    description: "You're almost there",
    status: "doing",
  },

  {
    id: 4,
    title: "Learn Data Structures and Algorithms 📚",
    description:
      "Study fundamental data structures and algorithms to solve coding problems efficiently",
    status: "todo",
  },
  {
    id: 5,
    title: "Contribute to Open Source Projects 🌐",
    description:
      "Gain practical experience and collaborate with others in the software development community",
    status: "done",
  },
  {
    id: 6,
    title: "Build Portfolio Projects 🛠️",
    description:
      "Create a portfolio showcasing your skills and projects to potential employers",
    status: "done",
  },
];


const todoTasks = document.getElementById('todo-tasks');
const doingTasks = document.getElementById('doing-tasks');
const doneTasks = document.getElementById('done-tasks');
const modal = document.getElementById('task-modal');
const taskForm = document.getElementById('task-form');
const cancelBtn = document.getElementById('cancel-btn');
const addTask = document.getElementById('addTaskButton');

// Modal input fields that are stored and showed
const taskIdInput = document.getElementById('task-id');
const taskTitleInput = document.getElementById('task-title');
const taskDescInput = document.getElementById('task-description');
const taskStatusInput = document.getElementById('task-status');

// Current task that I want to show
let currentTask = null;

// Create task function - Element
/**
 * Creates the list element and its respective / relevent classes in the DOM.
 * @param {Object} task - The tasks which are stored in an array and declared as tasks
 * @returns {HTMLLIElement} - The created list item elements
 */
function createTaskElement(initialTasks) {
    const taskElementCreated = document.createElement("li"); // 7. Creates an HTML list item element for a task
    taskElementCreated.className = 'task mt-4 py-5 px-3 mr-2 w-max-[320px] xl:w-[280px] h-[60px] bg-white rounded-lg shadow-[0px_4px_6px_0px_rgba(54,78,126,0.1)] transition-all hover:shadow-md';
    //8. Sets appropriate classes for styling and also creates a className for the new class
    taskElementCreated.innerHTML = `<h3 class="font-bold">${initialTasks.title}</h3>`;
    taskElementCreated.setAttribute('data-id', initialTasks.id);
    // 9. Includes the task title and sets a data-id attribute
    return taskElementCreated;
    // Returns the created DOM element
}

// Showing the task
// Implemented function to show all tasks once the script is running on the main section
/**
 * First cleans the HTML Elements and then Shows or Renders the tasks from the given array to the respactive columns in the DOM
 */
function showSortedTasks() {
    // Clear all columns
    todoTasks.innerHTML = '';
    doingTasks.innerHTML = '';
    doneTasks.innerHTML = '';

    // Sort tasks into columns
    initialTasks.forEach(task => {
        const taskElement = createTaskElement(task);
        
    
        switch(task.status) {
            case 'todo':
                todoTasks.appendChild(taskElement);
                break;   
            case 'doing':
                doingTasks.appendChild(taskElement);
                break;
            case 'done':
                doneTasks.appendChild(taskElement);
                break;
        }
    });

    updateTaskCounts();
}

// Update the task counts in each column header
/**
 * Selects the Element container with the specified id and select the last child of the target parent and gives it the value of length of the Elements in that column
 */
function updateTaskCounts() {
  // 14. Updates the count numbers in each column header
  // 15. selects the DOM at the attribute node and uses the property .textcontent to update / set it with the length of the children nodes/ elements
  document.querySelector('#todo-column span:last-child').textContent = `(${todoTasks.children.length})`; 
  document.querySelector('#doing-column span:last-child').textContent = `(${doingTasks.children.length})`;
  document.querySelector('#done-column span:last-child').textContent = `(${doneTasks.children.length})`;
}

// Function to open modal with task data
/**
 * Matches the Id of the selected task provides the information in the modal.
 * @param {number} taskId - Is the ID of the selected
 * @returns A modal that is populated with the informtion that the corresponds to the matched ID
 */
function openEditModal(taskId) {
    currentTask = initialTasks.find(task => task.id === taskId);
    
    if (!currentTask) return;
  
    // populate the modal with task data that was salected
    taskIdInput.value = currentTask.id;
    taskTitleInput.value = currentTask.title;
    taskDescInput.value = currentTask.description;
    taskStatusInput.value = currentTask.status;
  
    // Show the modal
    modal.classList.remove('hidden');
}

// function to add new dask from the modal
// save new task
/**
 * This allos changes to be made in modal to be savd
 * @param {Event} e - Is the submit event from the form
 * @returns 
 */
function addTasksubmit(e) {
    e.preventDefault();
    validateInputs();
    closeModal();
    showSortedTasks();
};

const setError = (element, message) => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');

    errorDisplay.innerText = message;
    inputControl.classList.add('error');
    inputControl.classList.remove('sucesss');
};

// Creating a cussess
const setSuccess = element => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');

    errorDisplay.innerText = '';
    inputControl.classList.add('sucesss');
    inputControl.classList.remove('error');
};

// Validating inputs
const validateInputs = () => {
    const taskTitleInputValue = taskTitleInput.value.trim();
    const taskDescInputValue = taskDescInput.value.trim();
    const taskStatusInputValue = taskStatusInput.value;

    if(!taskTitleInputValue || taskTitleInputValue.trim() === "") {
        setError(taskTitleInput, "Task title cannot be empty!");
    } else{
        setSuccess(taskTitleInput);
    }

    if(!taskDescInputValue || taskDescInputValue.trim() === "") {
        setError(taskDescInput, "Task description cannot be empty!");
    } else{
        setSuccess(taskDescInput);
    }

    if(!taskStatusInputValue || taskStatusInputValue === "") {
        setError(taskStatusInput, "INVALID STATUS! Please enter only: todo, doing, or done");
    } else{
        setSuccess(taskStatusInput);
    }

    // Store task details in object
    if(taskTitleInputValue && taskDescInputValue && taskStatusInputValue) {
        const output = {
            id: initialTasks.length + 1,
            title: taskTitleInputValue,
            description: taskDescInputValue,
            status: taskStatusInputValue
        };
        
        // Add task to the existing array
        initialTasks.push(output);
        
        saveTask();
    }
};

// function to save task into local storage
function saveTask() {
    localStorage.setItem("initialTasks", JSON.stringify(initialTasks)); // convertd array into string version for local storgae to work with it
}


// function to open modal
function openModel() {
    taskTitleInput.value = '';
    taskDescInput.value = '';
    taskStatusInput.value = '';
    modal.classList.remove('hidden')
}

// Function to close modal
/**
 * Closes the task modal and resets the current task variable declared
 * Add the Hidden class to allow the modal to dissapear once it is closed
 */
function closeModal() {
    modal.classList.add('hidden');
    currentTask = null;
}

// Function to Save task changes
/**
 * This allos changes to be made in modal to be savd
 * @param {Event} e - Is the submit event from the form before
 * @returns 
 */
function saveTaskChanges(e) {
    e.preventDefault();
    
    if (!currentTask) return;
  
    // Update task object
    currentTask.title = taskTitleInput.value;
    currentTask.description = taskDescInput.value;
    currentTask.status = taskStatusInput.value;
    
    // Refresh display
    // Refreshes the display and closes the modal
    showSortedTasks();
    closeModal();
}

// Event Listeners
/**
 * Sets up event listener for the selected task that is triggered by a click
 * This will also open the edit model.
 * 
 */
function setupEventListeners() {
    // Event delegation for task clicks
    // Sets up click handlers for task items using event delegation
    // Adds modal control handlers (cancel button, outside click, ESC key)
    // Sets up form submission handler
    [todoTasks, doingTasks, doneTasks].forEach(column => {
        column.addEventListener('click', (e) => {
            const taskElement = e.target.closest('.task');
            if (taskElement) {
                const taskId = parseInt(taskElement.dataset.id);
                openEditModal(taskId);
            }
        });
    });

    // Open modal once add new button is clicked
    addTask.addEventListener('click', openModel);
    taskForm.addEventListener('submit', addTasksubmit);

    // Modal close and opening event listeners
    cancelBtn.addEventListener('click', closeModal);
    // taskForm.addEventListener('update', saveTaskChanges);

    // Close modal when clicking on the ouside of it
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
  
    // Close modal on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
}

// Initialize the board initially there was 8 now there will be 6
/**
 * init function is the main functon that has mor functions within the function
 */
function init() {
    showSortedTasks();
    setupEventListeners();
}

// Start the application
document.addEventListener('DOMContentLoaded', init);