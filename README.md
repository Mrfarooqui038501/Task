# Task Manager SPA

A fully functional Single Page Application (SPA) built with vanilla JavaScript to manage tasks efficiently. It simulates a RESTful API using JavaScript objects and persists data in localStorage. The app supports CRUD operations, task prioritization, filtering, drag-and-drop reordering, and browser notifications for reminders.

## Features

- **Task List Page**: Displays a dynamic list of tasks with options to view, edit, or delete each task.
- **Add Task**: Form to create new tasks with fields for title, description, due date, priority, and an optional reminder.
- **Edit Task**: Update existing tasks through an editable form, including toggling reminders.
- **Delete Task**: Remove tasks with a confirmation prompt.
- **Task Detail View**: View detailed task information (title, description, due date, priority, status, reminder status).
- **Search and Filter**:
  - Search tasks by keyword (title, due date, or priority).
  - Filter tasks by priority (High, Medium, Low, or All).
- **Task Prioritization**: Assign priorities (High, Medium, Low) to tasks, visually distinguished by colors:
  - High: Red border and light red background.
  - Medium: Orange border and light orange background.
  - Low: Green border and light green background.
- **Drag-and-Drop Reordering**: Reorder tasks in the list by dragging and dropping, with the new order saved to localStorage.
- **Task Reminders**: Set reminders for tasks and receive browser notifications when the due date is within 24 hours.

## Technical Details

- **Frontend**: Built with vanilla JavaScript (ES6+ features: const, let, arrow functions, template literals), HTML, and CSS.
- **Routing**: Uses the browser's History API (pushState, popstate) for seamless navigation between views without page reloads.
- **Simulated RESTful API**: Implemented via a TaskAPI object with the following endpoints:
  - `GET /tasks`: Fetch all tasks from localStorage.
  - `POST /tasks`: Create a new task and add it to the array.
  - `GET /tasks/:id`: Retrieve a specific task by ID.
  - `PUT /tasks/:id`: Update an existing task.
  - `DELETE /tasks/:id`: Delete a task.
  - `reorder(fromIndex, toIndex)`: Reorder tasks in the array.
- **Data Storage**: Tasks are stored as JSON in localStorage for persistence across page reloads.
- **Validation**: Ensures required fields (title, due date) are filled before saving tasks.
- **Responsive Design**: CSS provides a modern, card-based UI that adapts to all screen sizes and works across modern browsers.
- **Notifications**: Uses the browser's Notification API to display reminders for tasks due within 24 hours.

## Project Structure

```
task-manager-spa/
├── index.html       # Main HTML file
├── styles.css       # Styles for UI and responsiveness
├── app.js           # Core JavaScript logic
└── README.md        # Project documentation
```

## Setup Instructions

### Clone or Download:
- Clone this repository: `git clone https://github.com/Mrfarooqui038501/Task.git` or download the ZIP file.
- Alternatively, copy the `index.html`, `styles.css`, and `app.js` files into a local folder.

### Run the App:
- Open `index.html` directly in a modern browser (e.g., Chrome, Firefox, Edge).
- No server or dependencies are required—it runs entirely in the browser.

### Grant Notification Permission (for reminders):
- On first load, the app will request permission for notifications. Click "Allow" to enable reminders.
- If denied, enable manually in browser settings (e.g., Chrome: Settings > Privacy and Security > Site Settings > Notifications).

## Usage

### Home View:
- Click "Home" in the nav bar to see the task list.
- Tasks display with priority colors and "(Reminder Set)" if applicable.

### Add a Task:
- Click "Add Task" to open the form.
- Fill in title, description, due date, priority, and check "Set Reminder" if desired.
- Click "Save Task" to add it to the list.

### Edit a Task:
- In the task list, click "Edit" on a task to modify its details, including the reminder setting.
- Save changes with "Update Task".

### Delete a Task:
- Click "Delete" on a task and confirm to remove it.

### View Task Details:
- Click "View" on a task to see its full details.

### Search and Filter:
- Type in the search bar to filter tasks by title, due date, or priority.
- Use the priority dropdown to filter by High, Medium, Low, or All tasks.

### Reorder Tasks:
- Drag a task by clicking and holding, then drop it over another task to reorder the list.

### Task Reminders:
- Tasks with reminders set will trigger a browser notification when their due date is within 24 hours.

## Testing

- **Browsers Tested**: Chrome, Firefox, Edge.
- **CRUD Operations**: Add, edit, and delete tasks to verify data persists in localStorage.
- **Routing**: Use browser back/forward buttons to ensure navigation works.
- **Filtering**: Test search and priority filters with various task combinations.
- **Drag-and-Drop**: Reorder tasks and refresh to confirm the order persists.
- **Reminders**:
  - Add a task with a due date of today or tomorrow, check "Set Reminder", and wait up to 1 minute for a notification (if within 24 hours).
  - Edit the due date to test different scenarios (e.g., past dates should not notify).

### Testing Reminders
1. Add a task with a due date set to today (e.g., "2025-03-17") and "Set Reminder" checked.
2. Wait up to 60 seconds (the check interval) for a notification if the due date is within 24 hours.
3. If no notification appears, ensure:
   - Notification permission is "Allowed" in browser settings.
   - The due date is in the future and within 24 hours.

## Limitations

- **Notifications**: Only work when the app is open or in the background (browser-dependent); no persistent reminders when closed.
- **Reminder Timing**: Fixed to 24 hours before due date; not customizable without code changes.
- **Error Handling**: Uses basic alert prompts; custom modals could improve UX.
- **Circular References**: Not handled in localStorage (unlikely with current task structure).


## Author

Built as a solution for a JavaScript Developer Task by Arman.#   T a s k 
 
 