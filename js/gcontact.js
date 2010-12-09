var Picker = {
	AUTH_SCOPE: 'http://www.google.com/m8/feeds/',
	CONTACTS_URL: 'http://www.google.com/m8/feeds/contacts/default/full',

	serviceName: 0,
	contactsService: 0,
	container: 0,

	login: function() {
		if (this.serviceName != 0 && typeof(this.serviceName) != 'undefined') {
			// Obtain a login token
			google.accounts.user.login(this.AUTH_SCOPE);
			// Create a new persistant service object
			this.contactsService = new google.gdata.contacts.ContactsService(this.serviceName);
		} else {
			this.error('Service name undefined, call setServiceName()');
		}
	},
  
    logout: function() {
		google.accounts.user.logout();
		this.container.html("");
		this.container.append('<h3>Please Sign In To' +
			' Use This Feature</h3><input type=\'button\'' + 
			' value=\'Sign In\' onclick=\'Picker.login()\' /></p>');
    },
  
	error: function(errorMessage) {
		if (this.errorCallback != 0 && typeof(this.errorCallback) 
			!= 'undefined') {
			this.errorCallback(errorMessage);
		} else {
			alert(errorMessage);
		}
	},
  
	setServiceName: function(serviceName) {
		this.serviceName = serviceName;
	},
  

	setErrorCallback: function(callback) {
		this.errorCallback = callback;
    },

	processContactFeed: function(feedRoot) {
		var entries = feedRoot.feed.entry;
		var b =[];
		for (var i = 0; i < entries.length; i++) {
			var entry = entries[i];
			var name = 0;
			if (entry.getTitle() && entry.getTitle().getText()) {
				name = entry.getTitle().getText();
			} else if (entry.getEmailAddresses()) {
				name = entry.getEmailAddresses()[0].getAddress();
			} else {
				name = 'Untitled Contact';
			}
			b.push(name);
		}

		alert("your contacts are :"+b);
	},

	populateContacts: function() {
		var query = new google.gdata.contacts.ContactQuery(this.CONTACTS_URL);
		query.setParam('max-results', 1000);
    
		this.contactsService.getContactFeed(query, this.processContactFeed, this.error);
	},


	render: function(divId) {
		this.container = $("#"+divId);
        
		// Make sure that the client library is initialized
		google.gdata.client.init(this.error);

		if (google.accounts.user.checkLogin(this.AUTH_SCOPE)) {
			this.login();

			this.container.html("");
			this.container.append(
				'<h3>Click to logout</h3>\
				<input type=\'button\' value=\'Logout\'\
				onclick=\'Picker.logout()\' /></p>');

			var groups = this.populateContacts();
		} else {
			// Display a login button
			this.container.html("");
			this.container.append(
				'<h3>Please Sign In To Use This Feature</h3>\
				<input type=\'button\' value=\'Sign In\'\
				onclick=\'Picker.login()\' /></p>');
		}
	}
}