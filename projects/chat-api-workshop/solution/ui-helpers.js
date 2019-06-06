/*** UI functions ***/

// Returns the chat data from the form
function getUserInput() {
	return {
		firstName: $('#chat-data-firstname').val(),
		lastName: $('#chat-data-lastname').val(),
		email: $('#chat-data-email').val(),
		accountNumber: $('#chat-data-accountnumber').val()
	};
}

// Adds a message to the chat UI with a timestamp. Will render any HTML in the message. 
function addUiMessage(message, imageUrl) {
	let image = imageUrl ? `<img class="member-image" src="${imageUrl}" /> ` : '';
	$('#chat-messages').append($('<ul>').addClass('list-group-item').html(`${image}${getTimestamp()} - ${message}`));
	$('#chat-messages').scrollTop($('#chat-messages')[0].scrollHeight);
}

// Disables the chat data form. Pass in false to enable the form.
function disableForm(disabled = true) {
	$('.chat-form-element').prop('disabled', disabled);
	$('#button-start-chat').prop('disabled', disabled);
	$('#button-end-chat').prop('disabled', !disabled);
}



/*** Helper functions ***/

// Gets a timestamp in hh:mm:ss format
function getTimestamp(d = new Date()) {
	return `${d.getHours() > 12 ? d.getHours() - 12 : d.getHours()}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`;
}

// Puts data into the fields
function prepopulateUserInput() {
	$('#chat-data-firstname').val('Praenomen');
	$('#chat-data-lastname').val('Gens');
	$('#chat-data-email').val('praenomen.gens@calidumlitterae.com');
	$('#chat-data-accountnumber').val('ASDF-1234');
}
