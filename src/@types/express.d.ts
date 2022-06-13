type Todos = {
  id: string;
	title: string;
	done: boolean;
	deadline: Date; 
	created_at: Date;
}

declare namespace Express {
  export interface Request {
    user: {
      id: string;
      name: string;
      username: string;
      todos: Todos[];
    }
  }
}