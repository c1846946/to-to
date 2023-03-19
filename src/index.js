import './style.css';
import { ProjectFactory, ToDoFactory, projectList, toDoList } from './todos';
const ShortUniqueId = require('short-unique-id');
const uid = new ShortUniqueId({ length: 16 });

//interaction
ProjectFactory('home');
ProjectFactory('Hardware Store');
ProjectFactory('test');
ProjectFactory('butterf;y');

ToDoFactory('test action', 'test');
ToDoFactory(
  'Wash the dishes',
  'home',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  '03/11/1980',
  'priority3'
);
ToDoFactory('Buy shop towels', 'Hardware Store');
ToDoFactory('Sweep the floor', 'home');
console.log(projectList());
console.log(toDoList());

const ScreenController = () => {
  const content = document.querySelector('.content');
  //state of main
  let selection = 'home';
  const pList = projectList();
  const tList = toDoList();
  const activeTList = () => tList.filter((x) => x.remove == false || !x.remove);

  const allProjectsText = 'All Projects';

  const resetMain = (selection) => {
    const main = document.querySelector('.main');
    content.removeChild(main);
    updateMain(selection);
  };

  const selectProject = (e) => {
    //remove active class from all divs
    //add active class to selected div

    //pass selected project to update main
    selection = e.target.innerText;
    resetMain(selection);
  };

  function updateMain(s) {
    //create a main to be removed
    const main = document.createElement('div');
    main.classList.add('main');
    content.appendChild(main);
    //create container to help with page layout
    const container = document.createElement('div');
    container.classList.add('container');
    main.appendChild(container);

    const clickTask = (e) => {
      if (e.target.classList.contains('delete-div')) {
        //add key/value remove:true
        //use find
        //add key value
        tList.find((x) => x.taskId == e.target.dataset.taskId).remove = true;
        //remove task from DOM
        const taskToRemove = document.querySelectorAll(
          `.task[data-task-id='${e.target.dataset.taskId}']`
        );
        resetMain(selection);
      } else if (e.target.classList.contains('checkbox')) {
        console.log('contains checkbox');
      } else {
        console.log('expand');
      }
    };

    const layoutTask = (task, z) => {
      const taskMin = document.createElement('div');
      taskMin.classList.add('task-min');
      task.appendChild(taskMin);
      const checkboxLabel = document.createElement('div');
      checkboxLabel.classList.add('checkbox-label');
      taskMin.appendChild(checkboxLabel);

      const checkbox = document.createElement('input');
      checkboxLabel.appendChild(checkbox);
      checkbox.type = 'checkbox';
      checkbox.name = z.action;
      checkbox.id = z.action;
      checkbox.checked = false;
      checkbox.setAttribute('data-task-id', z.taskId);
      checkbox.classList.add('checkbox');
      checkbox.addEventListener('change', function (e) {
        if (this.checked) {
          checkbox.classList.add('task-checked');
          tList.find(
            (x) => x.taskId == e.target.dataset.taskId
          ).complete = true;
        } else {
          checkbox.classList.remove('task-checked');
          tList.find(
            (x) => x.taskId == e.target.dataset.taskId
          ).complete = false;
        }
      });

      const taskName = document.createElement('div');
      taskName.classList.add('task-name');
      taskName.innerText = z.action;
      checkboxLabel.appendChild(taskName);
      //
      //task.textContent = z.action;
      //
      const deleteDiv = document.createElement('button');
      deleteDiv.classList.add('delete-div');
      deleteDiv.setAttribute('data-task-id', z.taskId);
      deleteDiv.innerText = 'x';
      taskMin.appendChild(deleteDiv);
      //
      const desc = document.createElement('div');
      desc.classList.add('desc');
    };

    const createTaskList = (p) => {
      const pHeading = document.createElement('div');
      pHeading.classList.add('p-heading');
      pHeading.textContent = p;
      container.appendChild(pHeading);
      //create task-container div
      const taskContainer = document.createElement('div');
      taskContainer.classList.add('task-container');
      container.appendChild(taskContainer);
      //filter tasks by project selection
      const tasks = tList.filter((x) => x.project == p);
      //append tasks for this project
      tasks.forEach((z) => {
        if (z.remove != true || !z.remove) {
          const task = document.createElement('div');
          task.classList.add('task');
          task.setAttribute('data-task-id', z.taskId);
          taskContainer.appendChild(task);
          layoutTask(task, z);
          task.addEventListener('click', clickTask);
          //append delete button
          //append checkbox
          //append expand arrow
        }
      });
    };

    //what list(s) to create
    if (s == allProjectsText) {
      pList.forEach((x) => createTaskList(x.name));
    } else createTaskList(s);
  }

  const projectSidebar = () => {
    const sidebar = document.createElement('div');
    sidebar.classList.add('sidebar');
    content.appendChild(sidebar);
    //create sidebar buttons
    pList.forEach((x) => {
      const project = document.createElement('button');
      project.classList.add('sidebar-project');
      project.innerText = x.name;
      sidebar.appendChild(project);
      //add an eventlistener for each project displayed
      project.addEventListener('click', selectProject);
    });
    const all = document.createElement('button');
    all.classList.add('all', 'sidebar-project');
    all.innerText = allProjectsText;
    sidebar.appendChild(all);
    all.addEventListener('click', selectProject);
  };

  projectSidebar();
  updateMain(selection);

  return { updateMain };
};

ScreenController();
