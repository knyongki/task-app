const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');

class UsersService {
  constructor() {
    this._pool = new Pool();
  }

  async addUser({
    username,
    fullname,
    password,
  }) {
    await this.verifyUsername(username);

    const id = `users-${nanoid(16)}`;
    const hashPassword = await bcrypt.hash(password, 10);

    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id',
      values: [id, username, fullname, hashPassword],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new Error('User gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async verifyUsername(username) {
    const query = {
      text: 'SELECT username FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this._pool.query(query);

    if (result.rows.length > 0) {
      throw new Error('Gagal menambahkan user, username sudah digunakan');
    }

    return result.rows[0];
  }

  async getUserById(id) {
    const query = {
      text: 'SELECT id, username, fullname FROM users WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new Error('User tidak ditemukan');
    }

    return result.rows[0];
  }

  async verifyUserCredential(username, password) {
    const query = {
      text: 'SELECT id, password FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new Error('Krediensial yang Anda berikan salah');
    }

    const { id, password: hashPassword } = result.rows[0];

    const match = await bcrypt.compare(password, hashPassword);

    if (!match) {
      throw new Error('Kredensial yang Anda berikan salah');
    }

    return id;
  }
}

module.exports = UsersService;