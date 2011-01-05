	var ng = ng || {};
	ng.contact = ng.contact || {};		

	ng.contact.getData = function(callback){
		ng.contact.fetchContactList(callback);
		ng.contact.fetchGroupList(callback);
	};

	ng.contact.getToken = function(callback) {
		var callbackData = function(){
			ng.contact.getData(callback);
		}

		ng.core.oauth.authorize(function() {
			var url = "http://www.google.com/m8/feeds";
			ng.core.oauth.sendSignedRequest(url, callbackData, {});
		});
	};

	ng.contact.fetchGroupList = function(callback) {
		var callbackData = function(text,xhr){
			onGroups(text,xhr,callback);
		}

		ng.core.oauth.authorize(function() {
			var url = "http://www.google.com/m8/feeds/groups/default/full";
			ng.core.oauth.sendSignedRequest(url, callbackData, {
				'parameters' : {
					'alt' : 'json',
					'max-results' : 100
				}
			});
		});
	};

	ng.contact.fetchContactList = function(callback) {
		var callbackData = function(text,xhr){
			onContacts(text,xhr,callback);
		}

		ng.core.oauth.authorize(function() {
			var url = "http://www.google.com/m8/feeds/contacts/default/full";
			ng.core.oauth.sendSignedRequest(url, callbackData, {
				'parameters' : {
					'alt' : 'json',
					'max-results' : 100
				}
			});
		});
	};
	
	var contacts = null;
	var groups = null;
	var hasGetContactsData = false;
	var hasGetGroupsData = false;

	function onContacts(text, xhr,callback) {
		contacts = [];
		var data = JSON.parse(text);
		for (var i = 0, entry; entry = data.feed.entry[i]; i++) {
			var contact = {
				'name' : entry['title']['$t'],
				'id' : entry['id']['$t'],
				'emails' : [],
				'groupIds' : []
			};

			if (entry['gd$email']) {
				var emails = entry['gd$email'];
				for (var j = 0, email; email = emails[j]; j++) {
					contact['emails'].push(email['address']);
				}
			 }

			if (!contact['name']) {
				contact['name'] = contact['emails'][0] || "<Unknown>";
			}
			
			if (entry['gContact$groupMembershipInfo']) {
				var groupIds = entry['gContact$groupMembershipInfo'];
				for (var m = 0, groupId; groupId = groupIds[m]; m++) {
					contact['groupIds'].push(groupId['href']);
				}
			 }

			contacts.push(contact);
  
			localStorage.contacts = JSON.stringify(contacts);
		}

		hasGetContactsData = true;
		if(hasGetContactsData && hasGetGroupsData){
  			if(callback){
				callback();
			}
		}
	};

	function onGroups(text, xhr,callback) {
		groups = [];
		var data = JSON.parse(text);
		for (var i = 0, entry; entry = data.feed.entry[i]; i++) {
			var group = {
				'name' : entry['title']['$t'],
				'id' : entry['id']['$t']
			};

			groups.push(group);
			localStorage.groups = JSON.stringify(groups);
		}

		hasGetGroupsData = true;
		if(hasGetContactsData && hasGetGroupsData){
  			if(callback){
				callback();
			}
		}
	};			

			

			

			