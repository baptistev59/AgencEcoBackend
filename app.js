const express = require('express');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const cors = require('cors');

// Swagger options
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Articles API',
            version: '1.0.0',
        },
    },
    apis: ['./app.js'], // chemin des fichiers contenant les annotations Swagger
};

const openapiSpecification = swaggerJsdoc(options);

const app = express();
app.use(cors());
app.use(bodyParser.json());

const articles = [
    {
        id: 1,
        title: "Les bases de Node.js",
        description: "Introduction à Node.js et ses fonctionnalités principales.",
        publicationDate: "2023-01-01",
    },
    {
        id: 2,
        title: "REST API avec Express",
        description: "Comment créer une API RESTful avec Express.js.",
        publicationDate: "2023-02-15",
    },
    {
        id: 3,
        title: "MongoDB pour les débutants",
        description: "Guide sur l'utilisation de MongoDB pour des projets simples.",
        publicationDate: "2023-03-10",
    },
    {
        id: 4,
        title: "Déploiement avec Docker",
        description: "Utilisation de Docker pour containeriser les applications.",
        publicationDate: "2023-04-05",
    },
    {
        id: 5,
        title: "Comprendre les Promises en JavaScript",
        description: "Introduction aux Promises et à leur utilisation.",
        publicationDate: "2023-05-12",
    },
    {
        id: 6,
        title: "Utilisation des WebSockets",
        description: "Mettre en place des WebSockets pour des applications temps réel.",
        publicationDate: "2023-06-18",
    },
    {
        id: 7,
        title: "Introduction à GraphQL",
        description: "Découverte de GraphQL pour remplacer REST dans certaines situations.",
        publicationDate: "2023-07-25",
    },
    {
        id: 8,
        title: "Sécurité dans les API REST",
        description: "Principes de sécurité pour protéger vos API REST.",
        publicationDate: "2023-08-30",
    },
    {
        id: 9,
        title: "Tests unitaires avec Jest",
        description: "Introduction aux tests unitaires en JavaScript avec Jest.",
        publicationDate: "2023-09-22",
    },
];

/**
 * @swagger
 * components:
 *   schemas:
 *     Article:
 *       type: object
 *       required:
 *         - id
 *         - title
 *         - description
 *         - publicationDate
 *       properties:
 *         id:
 *           type: integer
 *           description: ID unique de l'article
 *         title:
 *           type: string
 *           description: Titre de l'article
 *         description:
 *           type: string
 *           description: Description de l'article
 *         publicationDate:
 *           type: string
 *           format: date
 *           description: Date de publication de l'article
 *       example:
 *         id: 1
 *         title: "Les bases de Node.js"
 *         description: "Introduction à Node.js et ses fonctionnalités principales."
 *         publicationDate: "2023-01-01"
 */

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
 *         description: ID de l'article
 *     responses:
 *       200:
 *         description: L'article correspondant à l'ID
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
        return res.status(404).send('Article not found');
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
 *     summary: Met à jour un article
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
 *         description: L'article mis à jour
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
        return res.status(404).send('Article not found');
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
        return res.status(404).send('Article not found');
    }

    articles.splice(articleIndex, 1);
    res.status(200).send('Article deleted successfully');
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification));

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
