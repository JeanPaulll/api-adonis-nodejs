'use strict';
const User = use('App/Models/User');
const {validate} = use('Validator');

class AuthController {

    async register({request, auth, response}) {
        const validation = await validate(request.all(), {
            username: 'required|min:3|max:254',
            email: 'required|min:3|max:80',
            password: 'required|min:3|max:60'
        });
        if (validation.fails()) {
            return response.status(401).send({error: 'Não autorizado!'});
        }
        try {
            let user = await User.create(request.all());
            let token = await auth.generate(user);
            Object.assign(user, token);
            return response.json(user);
        } catch (e) {
            console.log(e);
            return response.status(401).send({error: 'Não autorizado!', msg: e});
        }
    }

    async login({request, auth, response}) {
        let {email, password} = request.all();
        try {
            if (await auth.attempt(email, password)) {
                let user = await User.findBy('email', email);
                let token = await auth.generate(user);
                Object.assign(user, token);
                return response.json(user);
            }
        } catch (e) {
            console.log(e);
            return response.json({message: 'Erro ao logar, email ou senha inválido!'});
        }
    }

    async getPosts({request, response}) {
        let data = await Post.query().with('user').fetch();
        return response.json(data);
    }
}

module.exports = AuthController;