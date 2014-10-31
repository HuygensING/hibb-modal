Backbone = require 'backbone'
$ = require 'jquery'

# util = require 'funcky.util'

tpl = require './login.jade'

###
@class
@extends Backbone.View
###
class Login extends Backbone.View
	###
	@constructs
	###
	initialize: (@options) ->
		@render()

	render: ->
		@$el.append tpl()

		@

	events: ->
		'click button.federated': '_handleFederatedLogin'

	_handleFederatedLogin: (ev) ->
		wl = window.location;
		hsURL = wl.origin + wl.pathname
		loginURL = 'https://secure.huygens.knaw.nl/saml2/login'

		form = $ '<form>'
		form.attr
			method: 'POST'
			action: loginURL

		hsUrlEl = $('<input>').attr
			name: 'hsurl'
			value: hsURL
			type: 'hidden'

		form.append hsUrlEl
		$('body').append form

		form.submit()

	destroy: ->
		@remove()

module.exports = Login