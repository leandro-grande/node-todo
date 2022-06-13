import express, { NextFunction, Request, Response } from 'express';
import { v4 as uuid } from 'uuid';
import { Todos, Users } from './types/Users';

import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

const users: Users[] = [];

const checkExistsUserAccount = (request: Request, response: Response, next: NextFunction) => {
  const { username } = request.headers;

  const user = users.find(user => user.username === username);

  if (!user) {
    return response.status(404).json({ error: "User does not exist" })
  }

  request.user = user;

  return next()
}

app.post("/users", (request, response) => {
  const { name, username } = request.body;

  const userAlreadyExists = users.some(user => user.username === username)

  if (userAlreadyExists ) {
    return response.status(400).json({ error: "User already exist" })
  }

  const user = {
    id: uuid(),
    name,
    username,
    todos: []
  }

  users.push(user);

  return response.status(201).json(user)
});

app.post("/todos", checkExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body;
  const { user } = request;

  const todo: Todos = {
    id: uuid(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date(),
  }

  user.todos.push(todo);

  return response.status(201).json(todo);
});

app.get("/todos", checkExistsUserAccount, (request, response) => {
  const {user} = request;

  return response.status(200).json(user.todos)
});

app.put("/todos/:id", checkExistsUserAccount, (request, response) => {
  const { id } = request.params;
  const { user } = request;
  const { title, deadline } = request.body;

  const todo = user.todos.find(todo => todo.id === id);

  if (!todo) {
    return response.status(404).json({ error: "Todo does not exist" })
  }

  todo.title = title;
  todo.deadline = new Date(deadline);
  
  return response.status(201).json(todo);
});

app.patch("/todos/:id/done", checkExistsUserAccount, (request, response) => {
  const { id } = request.params;
  const { user } = request;

  const todo = user.todos.find(todo => todo.id === id);

  if (!todo) {
    return response.status(404).json({ error: "Todo does not exist" })
  }

  todo.done = true;

  return response.status(201).json(todo);
});

app.delete("/todos/:id", checkExistsUserAccount, (request, response) => {
  const { id } = request.params;
  const { user } = request;

  const todo = user.todos.find(todo => todo.id === id);

  if (!todo) {
    return response.status(404).json({ error: "Todo does not exist" })
  }

  user.todos.splice(user.todos.indexOf(todo), 1)

  return response.status(204).send();
})

app.listen(3333);