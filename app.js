const TaskAPI = {
    tasks: JSON.parse(localStorage.getItem('tasks')) || [],
  
    save() {
      localStorage.setItem('tasks', JSON.stringify(this.tasks));
    },
  
    getAll() {
      return Promise.resolve(this.tasks);
    },
  
    create(task) {
      const newTask = { id: Date.now(), ...task, status: 'Pending' };
      this.tasks.push(newTask);
      this.save();
      return Promise.resolve(newTask);
    },
  
    getById(id) {
      const task = this.tasks.find(t => t.id === id);
      return Promise.resolve(task || null);
    },
  
    update(id, updatedTask) {
      const index = this.tasks.findIndex(t => t.id === id);
      if (index !== -1) {
        this.tasks[index] = { ...this.tasks[index], ...updatedTask };
        this.save();
        return Promise.resolve(this.tasks[index]);
      }
      return Promise.reject('Task not found');
    },
  
    delete(id) {
      const index = this.tasks.findIndex(t => t.id === id);
      if (index !== -1) {
        this.tasks.splice(index, 1);
        this.save();
        return Promise.resolve();
      }
      return Promise.reject('Task not found');
    },
  
    reorder(fromIndex, toIndex) {
      const [task] = this.tasks.splice(fromIndex, 1);
      this.tasks.splice(toIndex, 0, task);
      this.save();
    }
  };
  
  // Router
  class Router {
    constructor() {
      this.routes = {};
      window.addEventListener('popstate', () => this.render());
    }
  
    addRoute(path, callback) {
      this.routes[path] = callback;
    }
  
    navigate(path) {
      history.pushState({}, '', path);
      this.render();
    }
  
    render() {
      const path = window.location.pathname || '/';
      const route = this.routes[path] || this.routes['/'];
      route();
    }
  }
  
  // SPA Views
  const App = {
    router: new Router(),
  
    init() {
      this.router.addRoute('/', () => this.renderTaskList());
      this.router.addRoute('/add', () => this.renderAddTaskForm());
      this.router.addRoute('/edit', () => this.renderEditTaskForm());
      this.router.addRoute('/task', () => this.renderTaskDetail());
  
      document.getElementById('home-btn').addEventListener('click', () => this.router.navigate('/'));
      document.getElementById('add-task-btn').addEventListener('click', () => this.router.navigate('/add'));
  
      this.router.render();
      this.checkReminders();
    },
  
    async renderTaskList() {
      const tasks = await TaskAPI.getAll();
      const content = document.getElementById('content');
      content.innerHTML = `
        <div class="task-list">
          <h2>Tasks</h2>
          <div class="filters">
            <input type="text" id="search" placeholder="Search tasks...">
            <select id="priority-filter">
              <option value="all" selected>All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <ul id="task-list">
            ${tasks.map(task => `
              <li class="task-item priority-${(task.priority || 'Medium').toLowerCase()}" data-id="${task.id}" draggable="true">
                <span>${task.title} (${task.priority || 'Medium'}) - ${task.dueDate}${task.reminder ? ' (Reminder Set)' : ''}</span>
                <div>
                  <button class="view-btn">View</button>
                  <button class="edit-btn">Edit</button>
                  <button class="delete-btn">Delete</button>
                </div>
              </li>
            `).join('')}
          </ul>
        </div>
      `;
  
      const searchInput = document.getElementById('search');
      const priorityFilter = document.getElementById('priority-filter');
      const taskList = document.getElementById('task-list');
  
      const updateTaskList = () => {
        const keyword = searchInput.value.toLowerCase();
        const priority = priorityFilter.value;
        let filtered = tasks;
  
        if (priority !== 'all') {
          filtered = filtered.filter(t => (t.priority || 'Medium') === priority);
        }
        filtered = filtered.filter(t => 
          t.title.toLowerCase().includes(keyword) || 
          t.dueDate.includes(keyword) || 
          (t.priority || 'Medium').toLowerCase().includes(keyword)
        );
  
        taskList.innerHTML = filtered.map(task => `
          <li class="task-item priority-${(task.priority || 'Medium').toLowerCase()}" data-id="${task.id}" draggable="true">
            <span>${task.title} (${task.priority || 'Medium'}) - ${task.dueDate}${task.reminder ? ' (Reminder Set)' : ''}</span>
            <div>
              <button class="view-btn">View</button>
              <button class="edit-btn">Edit</button>
              <button class="delete-btn">Delete</button>
            </div>
          </li>
        `).join('');
        this.addDragAndDropListeners();
      };
  
      searchInput.addEventListener('input', updateTaskList);
      priorityFilter.addEventListener('change', updateTaskList);
  
      content.querySelectorAll('.view-btn').forEach(btn => 
        btn.addEventListener('click', () => this.router.navigate(`/task?id=${btn.parentElement.parentElement.dataset.id}`))
      );
      content.querySelectorAll('.edit-btn').forEach(btn => 
        btn.addEventListener('click', () => this.router.navigate(`/edit?id=${btn.parentElement.parentElement.dataset.id}`))
      );
      content.querySelectorAll('.delete-btn').forEach(btn => 
        btn.addEventListener('click', () => this.deleteTask(btn.parentElement.parentElement.dataset.id))
      );
  
      this.addDragAndDropListeners();
    },
  
    addDragAndDropListeners() {
      const taskList = document.getElementById('task-list');
      let draggedItem = null;
  
      taskList.addEventListener('dragstart', (e) => {
        draggedItem = e.target.closest('.task-item');
        draggedItem.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
      });
  
      taskList.addEventListener('dragend', () => {
        draggedItem.classList.remove('dragging');
        draggedItem = null;
      });
  
      taskList.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
      });
  
      taskList.addEventListener('drop', (e) => {
        e.preventDefault();
        const dropTarget = e.target.closest('.task-item');
        if (dropTarget && draggedItem !== dropTarget) {
          const allItems = [...taskList.querySelectorAll('.task-item')];
          const fromIndex = allItems.indexOf(draggedItem);
          const toIndex = allItems.indexOf(dropTarget);
          TaskAPI.reorder(fromIndex, toIndex);
          this.renderTaskList();
        }
      });
  
      taskList.addEventListener('dragenter', (e) => {
        const target = e.target.closest('.task-item');
        if (target && target !== draggedItem) {
          target.classList.add('drag-over');
        }
      });
  
      taskList.addEventListener('dragleave', (e) => {
        const target = e.target.closest('.task-item');
        if (target) {
          target.classList.remove('drag-over');
        }
      });
    },
  
    renderAddTaskForm() {
      const content = document.getElementById('content');
      content.innerHTML = `
        <form id="task-form">
          <h2>Add Task</h2>
          <label>Title:</label>
          <input type="text" id="title" required>
          <label>Description:</label>
          <textarea id="description" required></textarea>
          <label>Due Date:</label>
          <input type="date" id="dueDate" required>
          <label>Priority:</label>
          <select id="priority">
            <option value="Low">Low</option>
            <option value="Medium" selected>Medium</option>
            <option value="High">High</option>
          </select>
          <label>Set Reminder:</label>
          <input type="checkbox" id="reminder">
          <button type="submit">Save Task</button>
        </form>
      `;
  
      document.getElementById('task-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const task = {
          title: document.getElementById('title').value,
          description: document.getElementById('description').value,
          dueDate: document.getElementById('dueDate').value,
          priority: document.getElementById('priority').value,
          reminder: document.getElementById('reminder').checked
        };
        if (!task.title || !task.dueDate) {
          alert('Title and Due Date are required!');
          return;
        }
        TaskAPI.create(task).then(() => this.router.navigate('/'));
      });
    },
  
    async renderEditTaskForm() {
      const urlParams = new URLSearchParams(window.location.search);
      const id = Number(urlParams.get('id'));
      const task = await TaskAPI.getById(id);
      if (!task) {
        alert('Task not found');
        this.router.navigate('/');
        return;
      }
  
      const content = document.getElementById('content');
      content.innerHTML = `
        <form id="task-form">
          <h2>Edit Task</h2>
          <label>Title:</label>
          <input type="text" id="title" value="${task.title}" required>
          <label>Description:</label>
          <textarea id="description" required>${task.description}</textarea>
          <label>Due Date:</label>
          <input type="date" id="dueDate" value="${task.dueDate}" required>
          <label>Priority:</label>
          <select id="priority">
            <option value="Low" ${task.priority === 'Low' ? 'selected' : ''}>Low</option>
            <option value="Medium" ${task.priority === 'Medium' ? 'selected' : ''}>Medium</option>
            <option value="High" ${task.priority === 'High' ? 'selected' : ''}>High</option>
          </select>
          <label>Set Reminder:</label>
          <input type="checkbox" id="reminder" ${task.reminder ? 'checked' : ''}>
          <button type="submit">Update Task</button>
        </form>
      `;
  
      document.getElementById('task-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const updatedTask = {
          title: document.getElementById('title').value,
          description: document.getElementById('description').value,
          dueDate: document.getElementById('dueDate').value,
          priority: document.getElementById('priority').value,
          reminder: document.getElementById('reminder').checked
        };
        TaskAPI.update(id, updatedTask).then(() => this.router.navigate('/'));
      });
    },
  
    async renderTaskDetail() {
      const urlParams = new URLSearchParams(window.location.search);
      const id = Number(urlParams.get('id'));
      const task = await TaskAPI.getById(id);
      if (!task) {
        alert('Task not found');
        this.router.navigate('/');
        return;
      }
  
      const content = document.getElementById('content');
      content.innerHTML = `
        <div class="task-detail">
          <h2>${task.title}</h2>
          <p><strong>Description:</strong> ${task.description}</p>
          <p><strong>Due Date:</strong> ${task.dueDate}</p>
          <p><strong>Priority:</strong> ${task.priority || 'Medium'}</p>
          <p><strong>Status:</strong> ${task.status}</p>
          <p><strong>Reminder:</strong> ${task.reminder ? 'Set' : 'Not Set'}</p>
        </div>
      `;
    },
  
    deleteTask(id) {
      if (confirm('Are you sure you want to delete this task?')) {
        TaskAPI.delete(Number(id)).then(() => this.renderTaskList());
      }
    },
  
    checkReminders() {
      
      if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        Notification.requestPermission();
      }
  
      const check = async () => {
        const tasks = await TaskAPI.getAll();
        const now = new Date();
  
        tasks.forEach(task => {
          if (task.reminder && task.status === 'Pending') {
            const dueDate = new Date(task.dueDate + 'T00:00:00');
            const timeDiff = dueDate - now;
            
            if (timeDiff > 0 && timeDiff <= 86400000 && Notification.permission === 'granted') {
              new Notification(`Task Reminder: ${task.title}`, {
                body: `Due on ${task.dueDate}. Priority: ${task.priority || 'Medium'}`,
                icon: 'https://via.placeholder.com/16' 
              });
              
            }
          }
        });
      };
  
      
      setInterval(check, 60000);
      check(); 
    }
  };
  
  
  App.init();