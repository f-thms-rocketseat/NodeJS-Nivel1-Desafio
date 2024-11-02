import fs from 'node:fs/promises'

const databasePath = new URL('../db.json', import.meta.url)

export class Database {
  #database = {}

  constructor() {
    fs.readFile(databasePath, 'utf8')
      .then(data => {
        this.#database = JSON.parse(data)
      })
      .catch(() => {
        this.#persist()
      })
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database))
  }

  select(table, search) {
    let data = this.#database[table] ?? []

    if (search) {
      data = data.filter(row => {
        return Object.entries(search).some(([key, value]) => {
          console.log(key + " " + value)
          return row[key].toLowerCase().includes(value.toLowerCase())
        })
      })
    }
    return data
  }

  insert(table, data) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data)
    } else {
      this.#database[table] = [data]
    }
    this.#persist()
    return data
  }

  update(table, id, data) {
    console.log(id)
    console.log(data)
    const rowIndex = this.#database[table].findIndex(row => row.id === id)
    if (rowIndex !== -1) {
      let task = this.#database[table][rowIndex]
      task.title = data.title ?  data.title : task.title
      task.description = data.description ? data.description : task.description
      task.completed_at = data.completed_at ? data.completed_at : task.completed_at
      task.updated_at = Date.now()
      this.#database[table][rowIndex] = task
      this.#persist()
    }
  }

  delete(table, id) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id)
    if (rowIndex !== -1) {
      this.#database[table].splice(rowIndex, 1)
      this.#persist()
    }
  }
}