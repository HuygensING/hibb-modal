Backbone = require 'backbone'

TOKEN_VAR = 'hi-auth-token'

class User extends Backbone.Model

	isLoggedIn: ->
		@_handleTokenInUrl()

		# TODO Should hi-auth-token be project specific?
		localStorage.getItem(TOKEN_VAR)?

	_handleTokenInUrl: ->
		path = window.location.search.substr 1
		parameters = path.split '&'

		console.log 

		for param in parameters
			[key, value] = param.split('=')

			if key is 'hsid'
				@_setAuthToken value
				history.replaceState? {}, '', window.location.pathname

	_setAuthToken: (token) ->
		localStorage.setItem TOKEN_VAR, token


module.exports = User