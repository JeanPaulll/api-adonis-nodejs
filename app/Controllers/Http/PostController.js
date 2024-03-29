'use strict';
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Post = use('App/Models/Post');
const {validate} = use('Validator');

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
        let {page} = request.all();
        page = page ? page : 1;
        return await Post.query().with('user').paginate(page ? page : 1, 3);
        // return response.status(200).send({data: data});
    }

    /**
     * Create/save a new post.
     * POST posts
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async store({request, auth, response}) {
        const validation = await validate(request.all(), {
            titulo: 'required|min:3|max:255',
            descricao: 'required|min:3|max:255'
        });

        if (validation.fails()) {
            return response.status(401).send({error: 'Não autorizado!'});
        }

        const data = await auth.user.posts().create(request.all());
        await data.load('user');
        return response.json({data})
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
        await data.load('user');
        return data
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
        const validation = await validate(data, {
            titulo: 'required',
            descricao: 'required',
        });
        if (validation.fails()) {
            return response.status(401).send({error: 'Não autorizado!'});
        }
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
            return response.status(401).send({error: 'Não autorizado!'})
        }
        await data.delete();
        return response.status(200).send(params.id);
    }
}

module.exports = PostController;
