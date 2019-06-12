# Chat API Workshop

This project demonstrates basic usage of the [Guest Chat APIs](https://developer.mypurecloud.com/api/webchat/guestchat.html) to implement a custom WebChat interface in your own web site. This project uses HTML, CSS, and JavaScript without any build processes or frameworks other than jQuery to keep the example as simple as possible. The guest chat APIs can be used from any web, mobile, desktop or any type of app that is capable of making REST API requests and maintaining a WebSocket.

## Student Project

The unsolved student project is located in the `project` directory.

### Resources

* [Guest Chat APIs](https://developer.mypurecloud.com/api/webchat/guestchat.html) - API documentation (start here)
* [JavaScript Guest Chat SDK](https://developer.mypurecloud.com/api/rest/client-libraries/javascript-guest/)
* [Developer Tools API Explorer](https://developer.mypurecloud.com/developer-tools/#/api-explorer) - No-code API testing in your browser
* [Developer Tools WebChat Tester](https://developer.mypurecloud.com/developer-tools/#/webchat) - No-code tool to create web chats. Doesn't use the APIs, but useful for providing a baseline to ensure chat routing works for your queues/users.
* [jQuery](https://api.jquery.com/)
* [Bootstrap](https://getbootstrap.com/docs/4.3/getting-started/introduction/)

#### If you need a PureCloud account

Sign up using this link and let the instructor know your name to add permissions: https://apps.mypurecloud.com/signup/?invite=95851efe-b51c-4a47-9547-7ed27e21f94a

### Requirements

1. Collect user input from the UI
2. Initiate a new chat and connect to the web socket
3. Handle incoming chat events
  1. Resolve display names based on member IDs
  1. Display messgaes
  2. Display join/leave indicators
4. Send messages to the chat
5. Disconnect chat
6. Enable/disable user input buttons based on if there's an active chat

### Extra Credit

Too easy? Do these things!

1. Display typing indicator (suggestion: clear indicator after 4 seconds)
2. Send typing indicator (don't get too spammy, suggest once every 3 seconds)
3. Display chat member images in chat
4. Cache member data to prevent repeated API requests for display name and image
5. Store the JWT in session data and reconnect to the chat on page refresh
  1. Use the JWT
  2. Retrieve chat history from API and populate UI with previous messages
  3. Implement logic to only reconnect within 2 minutes (server-side auto-removes members that drop their connection for too long)

### Instructions

TL;DR Use the JavaScript Guest Chat SDK to implement the requirements listed above. Have fun!

The following files are included with the project. See the `TODO`s for each for suggested tasks in each file. 

* **index.html** - Chat demo page
  * `TODO`: Add script reference to guest chat SDK
* **style.css** - CSS stylesheet for the page
  * No edits required, but feel free to style to your liking
* **ui-helpers.js** - a set of pre-written functions to assist in interacting with the UI
  * No edits required
  * **getUserInput()** - Returns the chat data from the form
  * **addUiMessage(message, imageUrl)** - Adds a message to the chat UI with a timestamp. Will render any HTML in the message. imageUrl is optional.
  * **disableForm(disabled = true)** - Disables the chat data form. Pass in false to enable the form.
  * **prepopulateUserInput()** - fills the user input form. Modify to use your own data if you like.
* **purecloud-apis.js** - a stubbed out file to implement PureCloud API (SDK) operations
  * `TODO`: import the SDK
  * `TODO`: set environment if not using mypurecloud.com
  * `TODO`: provide your own org id, deployment id, and queue name, and use those values when creating the chat
  * `TODO`: build out requirements functionality outlined above

#### Testing the page

You'll need to serve the files somehow. Feel free to use whatever deployment/testing option you're comfortable with. If you're looking for recommendations, check out [http-server](https://www.npmjs.com/package/http-server). It's a node.js project that starts a HTTP server that will serve any files from a local directory. Very easy to use if you already have node installed.


## Solution

**¡¡¡SPOILER ALERT!!!**

The completed project is located in the `solution` directory. Take note that the project is the same as the solution, except that all of the SDK usage and logic has been removed. If you get stuck, you can refer to the solution to see the suggested code for each part.
