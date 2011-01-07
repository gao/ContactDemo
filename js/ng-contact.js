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
	
	ng.contact.createContact = function(data) {
		var url = 'http://www.google.com/m8/feeds/contacts/default/full';
		var bodyXmlEntry = '<atom:entry xmlns:atom="http://www.w3.org/2005/Atom" xmlns:gd="http://schemas.google.com/g/2005"><atom:category scheme="http://schemas.google.com/g/2005#kind" term="http://schemas.google.com/contact/2008#contact" />'
		if(data.name){
			bodyXmlEntry = bodyXmlEntry + '<gd:name><gd:fullName>'+data.name+'</gd:fullName></gd:name>';
		}
		if(data.phone){
			bodyXmlEntry = bodyXmlEntry + '<gd:phoneNumber rel="http://schemas.google.com/g/2005#work" primary="true">'+data.phone+'</gd:phoneNumber>';
		}
		if(data.emails){
			for(var i=0;i<data.emails.length;i++){
				if(i == 0){
					bodyXmlEntry = bodyXmlEntry + '<gd:email rel="http://schemas.google.com/g/2005#work" primary="true" address="'+data.emails[i]+'"/>';
				}else if(i == 1){
					bodyXmlEntry = bodyXmlEntry + '<gd:email rel="http://schemas.google.com/g/2005#home"  address="'+data.emails[i]+'"/>';
				}	
			}
		}
		
		bodyXmlEntry = bodyXmlEntry + '</atom:entry>';
		var request = {
		    'method': 'POST',
		    'headers': {
		      'GData-Version': '3.0',
		      'Content-Type': 'application/atom+xml'
		    },
		    'parameters': {
		      'alt': 'json'
		    },
		    'body': bodyXmlEntry
		  };

		ng.core.oauth.sendSignedRequest(url, callback, request);
	};
	
	function callback(resp, xhr) {
		
	};
	
	ng.contact.deleteContact = function(editLink) {
		var url = editLink;
		var request = {
		    'method': 'POST',
		    'headers': {
		      'X-HTTP-Method-Override': 'DELETE',
		      'Content-Type': 'application/atom+xml'
		    }
		  };

		ng.core.oauth.sendSignedRequest(url, deleteCallback, request);
	};
	function deleteCallback(resp, xhr) {
		//localStorage.setItem("deleteStatu",xhr.status);
	};
	
	var contacts = null;
	var groups = null;
	var hasGetContactsData = false;
	var hasGetGroupsData = false;

	function onContacts(text, xhr,callback) {
		//localStorage.setItem("onContacts",text); 
		contacts = [];
		var data = JSON.parse(text);
		for (var i = 0, entry; entry = data.feed.entry[i]; i++) {
			var contact = {
				'name' : entry['title']['$t'],
				'id' : entry['id']['$t'],
				'emails' : [],
				'editLink' : '',
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
			
			if (entry['link']) {
				var links = entry['link'];
				for (var n = 0, link; link = links[n]; n++) {
					if(link['rel'] == "edit"){
						contact['editLink'] = link['href'];
						break;
					}
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

			

			

			