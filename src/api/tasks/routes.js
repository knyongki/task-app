const routes = (handler) => [
  {
    method: 'POST',
    path: '/tasks',
    handler: handler.postTaskHandler,
    options: {
      auth: 'tasksapp_jwt',
    },
  },
  {
    method: 'GET',
    path: '/tasks',
    handler: handler.getTasksHandler,
    options: {
      auth: 'tasksapp_jwt',
    },
  },
  {
    method: 'GET',
    path: '/tasks/{id}',
    handler: handler.getTaskByIdHandler,
    options: {
      auth: 'tasksapp_jwt',
    },
  },
  {
    method: 'PUT',
    path: '/tasks/{id}',
    handler: handler.putTaskByIdHandler,
    options: {
      auth: 'tasksapp_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/tasks/{id}',
    handler: handler.deleteTaskByIdHandler,
    options: {
      auth: 'tasksapp_jwt',
    },
  },
];

module.exports = routes;
