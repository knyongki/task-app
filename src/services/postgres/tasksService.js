const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class NotesService {
  constructor() {
    this._pool = new Pool();
  }

  async addTask({
    title, body, owner
  }) {
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO tasks VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
      values: [id, title, body, createdAt, updatedAt, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Tugas gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getTasks(owner) {
    const query = {
      text: `SELECT * FROM tasks
      WHERE tasks.owner = $1`,
      values: [owner],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }

  async getTaskById(id) {
    const query = {
      text: `SELECT tasks.*, users.username 
      FROM tasks
      LEFT JOIN users ON users.id = tasks.owner
      WHERE tasks.id = $1`,
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Tugas tidak ditemukan');
    }

    return result.rows[0];
  }

  async editTaskById(id, { title, body }) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: 'UPDATE tasks SET title = $1, body = $2, updated_at = $3 WHERE id = $4 RETURNING id',
      values: [title, body, updatedAt, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui tugas. Id tidak ditemukan');
    }
  }

  async deleteTaskById(id) {
    const query = {
      text: 'DELETE FROM tasks WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Tugas gagal dihapus. Id tidak ditemukan');
    }
  }

  async verifyTaskOwner(id, owner) {
    const query = {
      text: 'SELECT * FROM tasks WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Tugas tidak ditemukan');
    }

    const task = result.rows[0];

    if (task.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

}

module.exports = NotesService;
