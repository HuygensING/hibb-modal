$ = require 'jquery'

Login = require './views/login'
User = require './models/user'

class Main
	_views:
		login: null

	_user: null

	showLoginView: ->
		unless @_views.login?
			@_views.login = new Login
				el: $('body')

	getUser: ->
		unless @_user?
			@_user = new User()

		@_user

module.exports = new Main()