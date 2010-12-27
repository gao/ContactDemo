<!-- contacts Dao -->		
	snow.dm.registerDao("contact",(function(){

		var contactStore = getContacts();
		
		var contactDao = {

			getId: function(objectType,data){
				return data.id;
			},
							
			get: function(objectType,id){
				var contact = getContactDataById(id);
				if (contact){
					var groupContacts = getGroupContacts();
					var groups = getGroups();
					var t = contact;
					var contactGroups = [];
					for (var j = 0; j < groupContacts.length; j++){
						var u = groupContacts[j];
						if(u.contactId == t.id){
							for(var k = 0; k<groups.length;k++){
								var s = groups[k];
								s.groupContactId = u.id;
								if(u.groupId == s.id){
									contactGroups.push($.extend({},s)); 
								}
							}
						}
					}
					contact.groups = contactGroups;
					return $.extend({},contact);
				}else{
					return null;
				}
			},

			find: function(objectType,opts){
				//alert("contactStore.length = "+getContacts().length);
				var a = [];
				var groupContacts = getGroupContacts();
				var groups = getGroups();
				
				for (var i = 0; i < contactStore.length; i++){
					var t = contactStore[i];
					var contactGroups = [];
					for (var j = 0; j < groupContacts.length; j++){
						var u = groupContacts[j];
						if(u.contactId == t.id){
							for(var k = 0; k<groups.length;k++){
								var s = groups[k];
								s.groupContactId = u.id;
								if(u.groupId == s.id){
									contactGroups.push($.extend({},s)); 
								}
							}
						}
					}
					t.groups = contactGroups;

					a.push($.extend({},t)); 
				}
				
				return a;
			},
										
			save: function(objectType,data){
				//if it is an update (assume that if there is an id, it exists)
				if (data.id){
					var idx = getIndexForContactId(data.id);
					//this will support partial update
					contactStore[idx] = $.extend(contactStore[idx], data);	
				}
				//if it is a create
				else{
					data.id = snow.util.uuid(17);
					var contact = $.extend({},data);
					contactStore.push(contact);		
				}
				
				localStorage.contacts = JSON.stringify(contactStore);
				return contactDao.get(objectType,data.id);
								
								
			},
							
			remove: function(objectType,id){
				var idx = getIndexForContactId(id);
					if (idx != null) {
						snow.util.array.remove(contactStore, idx);
						localStorage.contacts = JSON.stringify(contactStore);
					}
			}
		};
						
		function getContactDataById(contactId){
			var idx = getIndexForContactId(contactId);
			if (idx != null){
				return contactStore[i];
			}else{
				return null;
			}
		}
						
		function getIndexForContactId(contactId){
			for (i = 0; i < contactStore.length; i++){
				contact = contactStore[i];
				if (contact.id == contactId){
					return i;
				}
			}
			return null;
		}

		function getContacts(){
			var contacts = localStorage.contacts;
			if(contacts == null){
				contacts = new Array();
			}else{
				contacts = JSON.parse(contacts);
			}
			return contacts;
		}

		function getGroupContacts(){
			var groupContacts = localStorage.groupContacts;
			if(groupContacts == null){
				groupContacts = new Array();
			}else{
				groupContacts = JSON.parse(groupContacts);
			}
			return groupContacts;
		}

		function getGroups(){
			var groups = localStorage.groups;
			if(groups == null){
				groups = new Array();
			}else{
				groups = JSON.parse(groups);
			}
			return groups;
		}
						
		return contactDao;

	})());
<!-- /contacts Dao -->