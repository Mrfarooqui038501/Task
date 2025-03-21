
## Setup Instructions

### Clone or Download

- Clone this repository: `git clone https://github.com/Mrfarooqui038501/Task.git` or download the ZIP file.
- Alternatively, copy the `index.html`, `styles.css`, and `app.js` files into a local folder.

### Run the App

- Open `index.html` directly in a modern browser (e.g., Chrome, Firefox, Edge).
- No server or dependencies are required—it runs entirely in the browser.

### Grant Notification Permission (for reminders)

- On first load, the app will request permission for notifications. Click "Allow" to enable reminders.
- If denied, enable manually in browser settings (e.g., Chrome: Settings > Privacy and Security > Site Settings > Notifications).

## Usage

### Home View

- Click "Home" in the nav bar to see the task list.
- Tasks display with priority colors and "(Reminder Set)" if applicable.

### Add a Task

- Click "Add Task" to open the form.
- Fill in title, description, due date, priority, and check "Set Reminder" if desired.
- Click "Save Task" to add it to the list.

### Edit a Task

- In the task list, click "Edit" on a task to modify its details, including the reminder setting.
- Save changes with "Update Task".

### Delete a Task

- Click "Delete" on a task and confirm to remove it.

### View Task Details

- Click "View" on a task to see its full details.

### Search and Filter

- Type in the search bar to filter tasks by title, due date, or priority.
- Use the priority dropdown to filter by High, Medium, Low, or All tasks.

### Reorder Tasks

- Drag a task by clicking and holding, then drop it over another task to reorder the list.

### Task Reminders

- Tasks with reminders set will trigger a browser notification when their due date is within 24 hours.

## Testing

- **Browsers Tested**: Chrome, Firefox, Edge.
- **CRUD Operations**: Add, edit, and delete tasks to verify data persists in `localStorage`.
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
- **Error Handling**: Uses basic `alert` prompts; custom modals could improve UX.
- **Circular References**: Not handled in `localStorage` (unlikely with current task structure).

## Author

Built as a solution for a JavaScript Developer Task by Arman.