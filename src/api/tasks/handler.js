class NotesHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postTaskHandler = this.postTaskHandler.bind(this);
    this.getTasksHandler = this.getTasksHandler.bind(this);
    this.getTaskByIdHandler = this.getTaskByIdHandler.bind(this);
    this.putTaskByIdHandler = this.putTaskByIdHandler.bind(this);
    this.deleteTaskByIdHandler = this.deleteTaskByIdHandler.bind(this);
  }

  async postTaskHandler(request, h) {
    this._validator.validateTaskPayload(request.payload);
    const { title = 'untiled', body } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    const taskId = await this._service.addTask({
      title, body, owner: credentialId,
    });

    const response = h.response({
      status: 'success',
      message: 'Tugas berhasil ditambahkan',
      data: {
        taskId,
      },
    });
    response.code(201);
    return response;
  }

  async getTasksHandler(request) {
    const { id: credentialId } = request.auth.credentials;
    const tasks = await this._service.getTasks(credentialId);
    return {
      status: 'success',
      data: {
        tasks,
      },
    };
  }

  async getTaskByIdHandler(request) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyTaskOwner(id, credentialId);
    const task = await this._service.getTaskById(id);
    return {
      status: 'success',
      data: {
        task,
      },
    };
  }

  async putTaskByIdHandler(request) {
    this._validator.validateTaskPayload(request.payload);
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyTaskOwner(id, credentialId);
    await this._service.editTaskById(id, request.payload);

    return {
      status: 'success',
      message: 'Tugas berhasil diperbarui',
    };
  }

  async deleteTaskByIdHandler(request) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyTaskOwner(id, credentialId);
    await this._service.deleteTaskById(id);
    return {
      status: 'success',
      message: 'tugas berhasil dihapus',
    };
  }
}

module.exports = NotesHandler;
