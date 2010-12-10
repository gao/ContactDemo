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


snow.dm.registerDao("group",(function(){
			
	var groups = getGroups();
			
	var groupDao = {

		getId: function(objectType,data){
			return data.id;
		},
				
		get: function(objectType,id){
			var group = getGroupDataById(id);
			if (group){
				return $.extend({},group);
			}else{
				return null;
			}
		},		
				
		find: function(objectType,opts){
			var a = [];
			for (var i = 0; i < groups.length; i++){
				var u = groups[i];
				a.push($.extend({},u)); 
			}
			return a;
		},
				
		save: function(objectType,data){
			//if it is an update (assume that if there is an id, it exists)
			if (data.id){
				var idx = getIndexForGroupId(data.id);
				//this will support partial update
				groups[idx] = $.extend(groups[idx], data);	
			}
			//if it is a create
			else{
				data.id = snow.util.uuid(17);
				var group = $.extend({},data);
				groups.push(group);		
			}

			localStorage.groups = JSON.stringify(groups);

			return groupDao.get(objectType,data.id);
	
		},
				
		remove: function(objectType,id){
			var idx = getIndexForGroupId(id);
			if (idx != null) {
				snow.util.array.remove(groups, idx);
				localStorage.groups = JSON.stringify(groups);
			}
		}
	};
			
	function getGroupDataById(groupId){
		var idx = getIndexForGroupId(groupId);
		if (idx != null){
			return groups[i];
		}else{
			return null;
		}
	}
			
	function getIndexForGroupId(groupId){
		for (i = 0; i < groups.length; i++){
			group = groups[i];
			if (group.id == groupId){
				return i;
			}
		}
		return null;
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

	return groupDao;

})());


snow.dm.registerDao("groupcontact",(function(){
			
			var groupContacts = getGroupContacts();
			
			var groupContactDao = {

				getId: function(objectType,data){
					return data.id;
				},
				
				get: function(objectType,id){
					var groupContact = getGroupContactDataById(id);
					if (groupContact){
						return $.extend({},groupContact);
					}else{
						return null;
					}
				},		
				
				find: function(objectType,opts){
					var a = [];
					for (var i = 0; i < groupContacts.length; i++){
						var u = groupContacts[i];
						a.push($.extend({},u)); 
					}
					return a;
				},
				
				save: function(objectType,data){
					//if it is an update (assume that if there is an id, it exists)
					if (data.id){
						var idx = getIndexForGroupContactId(data.id);
						//this will support partial update
						groupContacts[idx] = $.extend(groupContacts[idx], data);	
					}
					//if it is a create
					else{
						data.id = snow.util.uuid(17);
						var groupContact = $.extend({},data);
						groupContacts.push(groupContact);		
					}
					localStorage.groupContacts = JSON.stringify(groupContacts);
					return groupContactDao.get(objectType,data.id);
					
					
				},
				
				remove: function(objectType,id){
					var idx = getIndexForGroupContactId(id);
					if (idx != null) {
						snow.util.array.remove(groupContacts, idx);
						localStorage.groupContacts = JSON.stringify(groupContacts);
					}
				}
			};
			
			function getGroupContactDataById(groupContactId){
				var idx = getIndexForGroupContactId(groupContactId);
				if (idx != null){
					return groupContacts[i];
				}else{
					return null;
				}
			}
			
			function getIndexForGroupContactId(groupContactId){
				for (i = 0; i < groupContacts.length; i++){
					groupContact = groupContacts[i];
					if (groupContact.id == groupContactId){
						return i;
					}
				}
				return null;
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

			return groupContactDao;
})());