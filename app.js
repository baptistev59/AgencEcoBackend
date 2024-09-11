const express = require('express');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const SECRET_KEY = "votre_cle_secrete";

// Utilisateurs pré-enregistrés avec mots de passe hachés
const users = [
    {
        id: 1,
        email: "john@example.com",
        password: bcrypt.hashSync("password123", 10), // Mot de passe haché
        name: "John Doe",
    },
    {
        id: 2,
        email: "jane@example.com",
        password: bcrypt.hashSync("mypassword", 10), // Mot de passe haché
        name: "Jane Smith",
    },
];

// Articles existants
const articles = [
    { id: 1, title: "Les bases de Node.js", description: "Introduction à Node.js", publicationDate: "2023-01-01" },
    { id: 2, title: "REST API avec Express", description: "API RESTful avec Express.js", publicationDate: "2023-02-15" },
    // autres articles...
];

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Authentification des utilisateurs
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email de l'utilisateur
 *               password:
 *                 type: string
 *                 description: Mot de passe de l'utilisateur
 *     responses:
 *       200:
 *         description: Authentification réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Email ou mot de passe incorrect
 */
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    
    const user = users.find(u => u.email === email);
    if (!user) {
        return res.status(401).json({ message: "Email ou mot de passe incorrect" });
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({ message: "Email ou mot de passe incorrect" });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });

    res.status(200).json({ token });
});

/**
 * @swagger
 * /articles:
 *   get:
 *     summary: Retourne la liste de tous les articles
 *     tags: [Articles]
 *     responses:
 *       200:
 *         description: Liste des articles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Article'
 */
app.get('/articles', (req, res) => {
    res.status(200).json(articles);
});

/**
 * @swagger
 * /articles/{id}:
 *   get:
 *     summary: Récupère un article par son ID
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de l'article à récupérer
 *     responses:
 *       200:
 *         description: Article récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Article'
 *       404:
 *         description: Article non trouvé
 */
app.get('/articles/:id', (req, res) => {
    const article = articles.find(a => a.id === parseInt(req.params.id));
    if (!article) {
        return res.status(404).send('Article non trouvé');
    }
    res.status(200).json(article);
});

/**
 * @swagger
 * /articles:
 *   post:
 *     summary: Crée un nouvel article
 *     tags: [Articles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Article'
 *     responses:
 *       201:
 *         description: L'article créé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Article'
 */
app.post('/articles', (req, res) => {
    const newArticle = {
        id: articles.length + 1,
        title: req.body.title,
        description: req.body.description,
        publicationDate: req.body.publicationDate || new Date().toISOString(),
    };
    articles.push(newArticle);
    res.status(201).json(newArticle);
});

/**
 * @swagger
 * /articles/{id}:
 *   put:
 *     summary: Met à jour un article par son ID
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de l'article à mettre à jour
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Article'
 *     responses:
 *       200:
 *         description: Article mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Article'
 *       404:
 *         description: Article non trouvé
 */
app.put('/articles/:id', (req, res) => {
    const article = articles.find(a => a.id === parseInt(req.params.id));
    if (!article) {
        return res.status(404).send('Article non trouvé');
    }

    article.title = req.body.title || article.title;
    article.description = req.body.description || article.description;
    article.publicationDate = req.body.publicationDate || article.publicationDate;

    res.status(200).json(article);
});

/**
 * @swagger
 * /articles/{id}:
 *   delete:
 *     summary: Supprime un article
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de l'article à supprimer
 *     responses:
 *       200:
 *         description: Article supprimé avec succès
 *       404:
 *         description: Article non trouvé
 */
app.delete('/articles/:id', (req, res) => {
    const articleIndex = articles.findIndex(a => a.id === parseInt(req.params.id));
    if (articleIndex === -1) {
        return res.status(404).send('Article non trouvé');
    }

    articles.splice(articleIndex, 1);
    res.status(200).send('Article supprimé avec succès');
});

// Swagger documentation route
const options = {
    definition: {
        openapi: '3.0.0',
        info: { title: 'Articles API', version: '1.0.0' },
    },
    apis: ['./app.js'],
};
const openapiSpecification = swaggerJsdoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification));

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
