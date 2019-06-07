/* globals getUserInput disableForm addUiMessage prepopulateUserInput */

// Get SDK reference

// Select PureCloud environment

// Create API instance

// Static values used by chat
const ORGANIZATION_ID = 'YOUR-ORG-ID';
const DEPLOYMENT_ID = 'YOUR-DEPLOYMENT-ID';
const QUEUE_NAME = 'YOUR-QUEUE-NAME';
const GUEST_IMAGE = 'https://i.imgur.com/NDHLXG7.jpg';

// Chat variables
let chatInfo, socket;
let isTyping;
let typingIndicatorTimer;



// Actions when page is loaded
$(document).ready(() => {
	// Load data into the UI so you don't have to type it every time
	prepopulateUserInput();

	// Start chat button click
	$('#button-start-chat').click(startChat);

	// End chat button click
	$('#button-end-chat').click(endChat);

	// Chat message input
	$('#chat-message').keypress(function (e) {
		// Enter pressed, send message
		if (e.which == 13) {
			sendMessage($('#chat-message').val());
		}
	});
});



// Initiates a chat
function startChat() {

}

// Processes incoming chat messages
function handleMessage(message) {
	console.log('message', message);
}

// Processes member stat changed events
function handleMemberChange(message) {
	console.log('member-change', message);
}

// Process typing indicator
function handleTyping(message) {
	console.log('typing-indicator', message);
}

// Send a message to the chat
function sendMessage(message) {
	console.log('sending message: ' + message);
}

// Ends the chat session
function endChat() {
	console.log('Removing self from chat');
}

// Get member data
function getMember(id) {
}
