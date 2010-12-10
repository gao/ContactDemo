var Picker = {
	AUTH_SCOPE: 'http://www.google.com/m8/feeds/',
	CONTACTS_URL: 'http://www.google.com/m8/feeds/contacts/default/full',
	GROUPS_URL: 'http://www.google.com/m8/feeds/groups/default/full',

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

	processGroupFeed: function(feedRoot) {
		var entries = feedRoot.feed.entry;
		var groupStore = new Array();
		for (var i = 0; i < entries.length; i++) {
			var entry = entries[i];
			var id = entry.getId().getValue()
			var name = entry.getTitle().getText();

			var group = $.extend({},{id: id, name: name});
			groupStore.push(group);	
			localStorage.groups = JSON.stringify(groupStore);
		}
		//alert("set group storage");
		snow.ui.display('group');
		
	},

	processContactFeed: function(feedRoot) {
		var entries = feedRoot.feed.entry;
		var contactStore = new Array();
		for (var i = 0; i < entries.length; i++) {
			var entry = entries[i];
			var name = 0;
			var address = "none";
			var phone = "none";

			var id = entry.getId().getValue();
			if (entry.getTitle() && entry.getTitle().getText()) {
				name = entry.getTitle().getText();
			} else if (entry.getEmailAddresses().length > 0) {
				name = entry.getEmailAddresses()[0].getAddress();
			} else {
				name = 'Untitled Contact';
			}
			
			if(entry.getPhoneNumbers().length > 0){
				phone = entry.getPhoneNumbers()[0].getValue();
			}

			if(entry.getPostalAddresses().length > 0){
				address = entry.getPostalAddresses()[0].getValue();
			}
			
			var contact = $.extend({},{id: id, name: name, phone:phone,address:address});
			contactStore.push(contact);	
			localStorage.contacts = JSON.stringify(contactStore);
		}
		//alert("set contact storage");
		snow.ui.display('contact');

	},

	populateContacts: function() {
		var query = new google.gdata.contacts.ContactQuery(this.CONTACTS_URL);
		query.setParam('max-results', 1000);
    
		this.contactsService.getContactFeed(query, this.processContactFeed, this.error);
	},

	populateGroups: function() {
		var query = new google.gdata.contacts.ContactQuery(this.GROUPS_URL);
		query.setParam('max-results', 1000);
    
		this.contactsService.getContactGroupFeed(query, this.processGroupFeed, this.error);
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

			//loading the data
			var groups = this.populateGroups();
			var contacts = this.populateContacts();

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