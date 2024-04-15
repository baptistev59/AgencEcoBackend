const express = require('express');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const cors = require('cors');



const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Todo List API (Learning campus)',
            version: '1.0.0',
        },
    },
    apis: ['./app.js'], // files containing annotations as above
};

const openapiSpecification = swaggerJsdoc(options);

const app = express();
app.use(cors());

app.use(bodyParser.json());

const todos = [ 
    {
        "todolist":[
          {
            "id" : 1,
            "text": "Learn about Polymer",
            "created_at": "Mon Apr 26 06:01:55 +0000 2015",
            "Tags": [
              "Web Development",
              "Web Components"
            ],
            "is_complete" : true
          },
          {
            "id" : 2,
            "text" : "Watch Pluralsight course on Docker",
            "created_at" : "Tue Mar 02 07:01:55 +0000 2015",
            "Tags": [
              "Devops",
              "Docker"
            ],
            "is_complete" : true
          },
          {
            "id" : 3,
            "text" : "Complete presentation prep for Aurelia presentation",
            "created_at" : "Wed Mar 05 10:01:55 +0000 2015",
            "Tags": [
              "Presentation",
              "Aureia"
            ],
            "is_complete" : false
          },
          {
            "id" : 4,
            "text": "Instrument creation of development environment with Puppet",
            "created_at" : "Fri June 30 13:00:00 +0000 2015",
            "Tags": [
              "Devops",
              "Puppet"
            ],
            "is_complete" : false
          },
          {
            "id" : 5,
            "text": "Transition code base to ES6",
            "created_at" : "Mon Aug 01 10:00:00 +0000 2015",
            "Tags": [
              "ES6",
              "Web Development"
            ],
            "is_complete" : false
          },
          {
            "id" : 6,
            "text": "Daploy website",
            "created_at" : "Mon Aug 01 10:00:00 +0000 2015",
            "Tags": [
              "ES6",
              "Web Development"
            ],
            "is_complete" : false
          },
          {
            "id" : 7,
            "text": "Make all testing",
            "created_at" : "Mon Aug 01 10:00:00 +0000 2015",
            "Tags": [
              "ES6",
              "Web Development"
            ],
            "is_complete" : false
          },
          {
            "id" : 8,
            "text": "Send messages to run Team",
            "created_at" : "Mon Aug 01 10:00:00 +0000 2015",
            "Tags": [
              "ES6",
              "Web Development"
            ],
            "is_complete" : false
          },
          {
            "id" : 9,
            "text": "Close Project",
            "created_at" : "Mon Aug 01 10:00:00 +0000 2015",
            "Tags": [
              "ES6",
              "Web Development"
            ],
            "is_complete" : false
          }
        ]
      }
 ];

 /**
 * @swagger
 * components:
 *   schemas:
 *     Todo:
 *       type: object
 *       required:
 *         - id
 *         - text
 *         - created_at
 *         - Tags
 *         - is_complete
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the todo.
 *         text:
 *           type: string
 *           description: The description of the todo.
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: The date of the creation of the todo.
 *         Tags:
 *           type: array
 *           items:
 *             type: string
 *           description: The tags associated with the todo.
 *         is_complete:
 *           type: boolean
 *           description: The status of the todo.
 *       example:
 *         id: 1
 *         text: "Learn about Polymer"
 *         created_at: "Mon Apr 26 06:01:55 +0000 2015"
 *         Tags: ["Web Development", "Web Components"]
 *         is_complete: true
 *
 * /todos:
 *   get:
 *     summary: Returns the list of all the todos
 *     tags: [Todos]
 *     responses:
 *       200:
 *         description: The list of the todos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Todo'
 */
app.get('/todos', (req, res) => {
    res.status(200).json(todos);
});

/**
 * @swagger
 * /todos:
 *   post:
 *     summary: Creates a new todo
 *     tags: [Todos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Todo'
 *     responses:
 *       201:
 *         description: The todo created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 */
app.post('/todos', (req, res) => {
    // Création de la nouvelle tâche avec un ID unique.
    const newTodo = {
        id: todos[0].todolist.length + 1, // Assurez-vous que l'ID est unique dans le tableau todolist.
        text: req.body.text,
        created_at: new Date().toISOString(),
        Tags: req.body.Tags,
        is_complete: req.body.is_complete || false
    };

    // Ajout de la nouvelle tâche au tableau todolist à l'intérieur du premier objet du tableau todos.
    todos[0].todolist.push(newTodo);

    // Envoi de la nouvelle tâche comme réponse.
    res.status(201).json(newTodo);
});

/**
 * @swagger
 * /todos/{id}:
 *   get:
 *     summary: Get a todo by id
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The id of the todo to get
 *     responses:
 *       200:
 *         description: The todo description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 *       404:
 *         description: Todo not found
 */
app.get('/todos/:id', (req, res) => {
  const { id } = req.params;
  const todo = todos[0].todolist.find(t => t.id === parseInt(id));
  if (!todo) {
      return res.status(404).send('Todo not found');
  }
  res.status(200).json(todo);
});


/**
 * @swagger
 * /todos/{id}:
 *   put:
 *     summary: Updates a todo
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The todo id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Todo'
 *     responses:
 *       200:
 *         description: The updated todo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 *       404:
 *         description: The todo was not found
 */
app.put('/todos/:id', (req, res) => {
  // Correction: Accéder au bon tableau qui contient les todos.
  const index = todos[0].todolist.findIndex(t => t.id == req.params.id);

  if (index >= 0) {
      // Correction: Mise à jour correcte en utilisant l'index trouvé dans todolist.
      todos[0].todolist[index] = {
          ...todos[0].todolist[index],
          ...req.body
      };
      // Correction: Renvoyer le todo mis à jour depuis le tableau todolist.
      res.status(200).json(todos[0].todolist[index]);
  } else {
      res.status(404).send("Todo not found");
  }
});

/**
 * @swagger
 * /todos/{id}:
 *   delete:
 *     summary: Deletes a todo
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The todo id to delete
 *     responses:
 *       200:
 *         description: Todo deleted successfully
 *       404:
 *         description: The todo was not found
 */
app.delete('/todos/:id', (req, res) => {
  // Accéder à l'index du todo à supprimer dans la liste des todos
  const index = todos[0].todolist.findIndex(t => t.id == req.params.id);

  if (index >= 0) {
      // Supprimer le todo du tableau
      todos[0].todolist.splice(index, 1);
      res.status(200).send("Todo deleted successfully");
  } else {
      res.status(404).send("Todo not found");
  }
});



app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification));

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});