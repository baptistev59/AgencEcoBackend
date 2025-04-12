const express = require('express');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Données d'utilisateurs fictifs (non utilisées ici, juste à titre d’exemple)
const users = [
    {
        id: 1,
        email: "john@example.com",
        name: "John Doe",
    },
    {
        id: 2,
        email: "jane@example.com",
        name: "Jane Smith",
    },
];

// Données d'articles (stockées en mémoire)
const articles = [
    {
        id: 1,
        title: "Les bases de Node.js",
        description: "Introduction aux concepts fondamentaux de Node.js",
        content: "Node.js est un environnement d'exécution JavaScript orienté serveur. Il permet de créer des applications back-end performantes et évolutives...",
        publicationDate: "2023-01-01",
    },
    {
        id: 2,
        title: "REST API avec Express",
        description: "Comment créer une API REST avec Express.js",
        content: "Express est un framework minimaliste et flexible pour Node.js. Il facilite la création d'API robustes, et permet de gérer facilement les routes, les middlewares et les réponses HTTP...",
        publicationDate: "2023-02-15",
    },
    {
        id: 3,
        title: "L’éco-conception web expliquée",
        description: "Pourquoi l'éco-conception est essentielle dans le développement moderne.",
        content: "L’éco-conception consiste à minimiser l’impact environnemental d’un site web tout en maintenant sa performance. Elle repose sur des principes comme la réduction du poids des pages, l’optimisation des images, et la sobriété fonctionnelle.",
        publicationDate: "2023-03-20",
    },
    {
        id: 4,
        title: "Les bonnes pratiques du HTML sémantique",
        description: "Un site web accessible commence par une structure HTML claire.",
        content: "Utiliser les bonnes balises HTML (comme <article>, <section>, <nav>, etc.) améliore l’accessibilité et le référencement naturel (SEO). Ces balises permettent aussi aux lecteurs d’écran de mieux interpréter le contenu.",
        publicationDate: "2023-04-05",
    }
];

/**
 * @swagger
 * components:
 *   schemas:
 *     Article:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - content
 *       properties:
 *         id:
 *           type: integer
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         content:
 *           type: string
 *         publicationDate:
 *           type: string
 *           format: date
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
 *         required: true
 *         schema:
 *           type: integer
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
 *         description: L'article a été créé
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
        content: req.body.content,
        publicationDate: req.body.publicationDate || new Date().toISOString().split('T')[0],
    };
    articles.push(newArticle);
    res.status(201).json(newArticle);
});

/**
 * @swagger
 * /articles/{id}:
 *   put:
 *     summary: Met à jour un article existant
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
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
    article.content = req.body.content || article.content;
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
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'article à supprimer
 *     responses:
 *       200:
 *         description: Article supprimé avec succès
 *       404:
 *         description: Article non trouvé
 */
app.delete('/articles/:id', (req, res) => {
    const index = articles.findIndex(a => a.id === parseInt(req.params.id));
    if (index === -1) {
        return res.status(404).send('Article non trouvé');
    }
    articles.splice(index, 1);
    res.status(200).send('Article supprimé avec succès');
});

// Swagger setup
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'AgencEco Articles API',
            version: '1.0.0',
            description: 'API pour la gestion des actualités sur le site AgencEco',
        },
    },
    apis: ['./app.js'],
};

const swaggerSpec = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(3000, () => {
    console.log('✅ Serveur lancé sur http://localhost:3000');
    console.log('📚 Documentation Swagger sur http://localhost:3000/api-docs');
});
