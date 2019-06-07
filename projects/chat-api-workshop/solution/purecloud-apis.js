/* globals getUserInput disableForm addUiMessage prepopulateUserInput */

// Get SDK reference
const platformClient = require('platformClient');
const client = platformClient.ApiClient.instance;

// Select PureCloud environment
client.setEnvironment('mypurecloud.com');

// Create API instance
const webChatApi = new platformClient.WebChatApi();

// Static values used by chat
const ORGANIZATION_ID = 'YOUR-ORG-ID';
const DEPLOYMENT_ID = 'YOUR-DEPLOYMENT-ID';
const QUEUE_NAME = 'YOUR-QUEUE-NAME';
const GUEST_IMAGE = 'https://i.imgur.com/NDHLXG7.jpg';

// Chat variables
let chatInfo, socket;
let isTyping;
let typingIndicatorTimer;
const memberCache = {};



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
		// Set typing indicator
		if ($('#chat-message').val() !== '') setTypingIndicator();

		// Enter pressed, send message
		if (e.which == 13) {
			sendMessage($('#chat-message').val());
		}
	});
});



// Initiates a chat
function startChat() {
	// Get chat data
	const data = getUserInput();

	// Build request to create new chat
	const createChatBody = {
		organizationId: ORGANIZATION_ID,
		deploymentId: DEPLOYMENT_ID,
		routingTarget: {
			targetType: 'QUEUE',
			targetAddress: QUEUE_NAME,
		},
		memberInfo: {
			displayName: `${data.lastName}, ${data.firstName}`,
			avatarImageUrl: GUEST_IMAGE,
			customFields: {
				firstName: data.firstName,
				lastName: data.lastName,
				email: data.email,
				customField1Label: 'AccountNumber',
				customField1: data.accountNumber
			}
		}
	};

	// Create chat
	webChatApi.postWebchatGuestConversations(createChatBody)
		.then((createChatResponse) => {
			// Store chat info
			chatInfo = createChatResponse;

			// Set JWT
			client.setJwt(chatInfo.jwt);

			// Connect to notifications
			socket = new WebSocket(chatInfo.eventStreamUri);

			// Connection opened
			socket.addEventListener('open', function (event) {
				console.log('WebSocket connected');
			});

			// Listen for messages
			socket.addEventListener('message', function (event) {
				const message = JSON.parse(event.data);

				// Chat message
				if (message.metadata) {
					switch (message.metadata.type) {
						case 'message': {
							// Handle chat message
							handleMessage(message);
							break;
						}
						case 'member-change': {
							// Handle member state change
							handleMemberChange(message);
							break;
						}
						case 'typing-indicator': {
							// Handle typing indicator
							handleTyping(message);
							break;
						}
						default: {
							console.log('Unknown message type: ' + message.metadata.type);
						}
					}
				}
			});
		})
		.catch(console.error);

	// Disable chat data form
	disableForm();
}

// Processes incoming chat messages
function handleMessage(message) {
	console.log('message', message);

	switch (message.eventBody.bodyType) {
		// Chat messages. The main thing that's going on here.
		case 'standard': {
			clearTypingIndicator(true);
			getMember(message.eventBody.sender.id)
				.then((member) => {
					addUiMessage(`${member.memberData.displayName} - ${message.eventBody.body}`, member.memberData.avatarImageUrl);
				})
				.catch(console.error);
			break;
		}
		// Join/leave messages
		case 'member-join':
		case 'member-leave': {
			// Ignore these messages; duplicates of member-change message types
			break;
		}
		default: {
			console.error(`unknown body type: ${message.eventBody.body}`);
		}
	}
}

// Processes member stat changed events
function handleMemberChange(message) {
	console.log('member-change', message);

	// Suppress if the state hasn't changed
	if (memberCache[message.eventBody.member.id] && memberCache[message.eventBody.member.id].state === message.eventBody.member.state)
		return;

	// Retrieve member
	getMember(message.eventBody.member.id)
		.then((member) => {
			// Update state cache
			memberCache[member.memberData.id].state = message.eventBody.member.state;

			// Ignore ACD participant
			if (member.memberData.role === 'ACD') return;

			// Determine display name and proper grammar
			let user = member.memberData.role === 'CUSTOMER' ? 'you have' : `${member.memberData.displayName} has`;
			
			// Write message to UI
			if (message.eventBody.member.state === 'CONNECTED')
				addUiMessage(`${user} joined the chat`, member.memberData.avatarImageUrl);
			else if (message.eventBody.member.state === 'DISCONNECTED')
				addUiMessage(`${user} left the chat`, member.memberData.avatarImageUrl);
		})
		.catch(console.error);
}

// Process typing indicator
function handleTyping(message) {
	console.log('typing-indicator', message);

	getMember(message.eventBody.sender.id)
		.then((member) => {
			// Don't display your own typing indicator. That would be silly.
			if (member.memberData.role === 'CUSTOMER') return;

			// Display who is typing
			$('#typing-indicator').text(`${member.memberData.displayName} is typing...`);
			clearTypingIndicator();
		})
		.catch(console.error);
}

// Remove typing indicator text
function clearTypingIndicator(immediate = false) {
	if (typingIndicatorTimer)
		clearTimeout(typingIndicatorTimer);

	if (immediate)
		$('#typing-indicator').text('');
	else
		typingIndicatorTimer = setTimeout(() => $('#typing-indicator').text(''), 4000);
}

// Send a message to the chat
function sendMessage(message) {
	if (!chatInfo || !message || message === '') return;

	console.log('sending message: ' + message);

	webChatApi.postWebchatGuestConversationMemberMessages(chatInfo.id, chatInfo.member.id, {
		body: message
	})
		.then(() => {
			console.log('message sent');
			if (isTyping) {
				clearTimeout(isTyping);
				isTyping = undefined;
			}
			$('#chat-message').val('');
		})
		.catch(console.error);
}

function setTypingIndicator() {
	// Abort if we're already typing. Don't want to spam the API.
	if (!chatInfo || isTyping) return;

	// Store local indicator
	isTyping = setTimeout(() => isTyping = undefined, 3000);

	// Invoke API
	webChatApi.postWebchatGuestConversationMemberTyping(chatInfo.id, chatInfo.member.id)
		.then(() => console.log('typing indicator sent'))
		.catch(console.error);
}

// Ends the chat session
function endChat() {
	console.log('Removing self from chat');

	webChatApi.deleteWebchatGuestConversationMember(chatInfo.id, chatInfo.member.id)
		.then(() => {
			console.log('disconnected');

			// Enable the form again
			disableForm(false);

			// Close web socket
			socket.close();
		})
		.catch(console.error);
}

// Get member data
function getMember(id) {
	return new Promise((resolve, reject) => {
		// Resolve with cached value if we have it
		if (!memberCache[id]) memberCache[id] = {};
		if (memberCache[id].memberData) return resolve(memberCache[id]);

		// Get value from API
		// This has the potential to make duplicate concurrent requests, 
		// but it's unlikely and won't hurt anything since it would be no more than 1 or 2 duplicates.
		webChatApi.getWebchatGuestConversationMember(chatInfo.id, id)
			.then((data) => {
				console.log('member data', data);
				memberCache[id].memberData = data;
				resolve(memberCache[id]);
			})
			.catch(reject);
	});
}
