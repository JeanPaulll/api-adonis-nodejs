'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

/** @typedef {import('@adonisjs/framework/src/View')} View */

const Post = use('App/Models/Post');
const { validateAll } = use('Validator')

/**
 * Resourceful controller for interacting with posts
 */
class PostController {
    /**
     * Show a list of all posts.
     * GET posts
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async index({request, response, view}) {
       return Post.all();
    }

    /**
     * Render a form to be used for creating a new post.
     * GET posts/create
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async create({request, response, view}) {
    }

    /**
     * Create/save a new post.
     * POST posts
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async store({request, response}) {
        const data = request.only(['titulo', 'descricao']);
        await Post.create({
            "titulo" : "Teste Titulo",
            "descricao" : "Teste Descrição",
        })
    }

    /**
     * Display a single post.
     * GET posts/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async show({params, request, response, view}) {
        const data = await Post.findOrFail(params.id);
        await data.load('images');
        return data
    }

    /**
     * Render a form to update an existing post.
     * GET posts/:id/edit
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async edit({params, request, response, view}) {
        const post = await Post.findOrFail(params.id);
        return { post: post.toJSON() };
    }

    /**
     * Update post details.
     * PUT or PATCH posts/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async update({params, request, response}) {
        const data = request.only(['titulo', 'descricao']);
        const validation = await validateAll(data, {
            titulo: 'required',
            descricao: 'required',
        });
        const post = await Post.findOrFail(params.id);
        post.merge(data);
        await post.save();
    }

    /**
     * Delete a post with id.
     * DELETE posts/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async destroy({params, request, response}) {
        const data = await Post.findOrFail(params.id);
        if (data.user_id !== auth.user.id) {
            return response.status(401).send({ error: 'Não autorizado!' })
        }
        await data.delete()
    }
}

module.exports = PostController
