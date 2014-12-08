# Huygens ING Backbone Modal

Renders a modal.

Example usage:

modal = new Modal
	title: "My title!"
	html: $('<div />').html('lalala')
	submitValue: 'OK'

modal.on 'cancel', => cancelAction()
modal.on 'submit', => modal.messageAndFade 'success', 'Modal submitted!'

## Changelog