'use strict';

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route');

Route.on('/').render('welcome');

// Login e Cadastro
Route.post('/registrar', 'AuthController.register');
Route.post('/login', 'AuthController.login');

Route.resource('posts', 'PostController')
    .apiOnly()
    .middleware('auth');

// Route.group(() => {
//     Route.get('', 'PostController.index').as('post.index');
//     Route.post('', 'PostController.store');
//     Route.delete('/:id', 'PostController.destroy');
// }).prefix('posts');


