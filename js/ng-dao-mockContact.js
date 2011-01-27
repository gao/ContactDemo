<!-- mock contact Dao -->		
	var MockContactDao = (function(){

		var contactStore = getContacts();
		
		function MockContactDao(){};

		// ------ DAO Generic CRUD Interface ------ //
		MockContactDao.prototype.getId = function(objectType,data){
			return data.id;
		};
							
		MockContactDao.prototype.get = function(objectType,id){
			var contact = getContactDataById(id);
			var groupIds = this.getGroups(objectType,id);
			contact.groupIds = groupIds;
			if (contact){
				return $.extend({},contact);
			}else{
				return null;
			}
		};

		MockContactDao.prototype.find = function(objectType,opts){
			var a = [];
			contactStore = getContacts();
			if(opts && opts.groupId){
				for(var i = 0; i<contactStore.length;i++){
					var contact = contactStore[i];
					var groupIds = this.getGroups(objectType,contact.id);
					if(groupIds){
						var exist = false;
						for(var j = 0 ;j<groupIds.length;j++){
							if(groupIds[j] == opts.groupId){
								exist = true;
								break;
							}
						}
						if(exist){
							contact.groupIds = groupIds;
							a.push(contact);
						}
					}
				}	
			}else{
				for(var i = 0; i<contactStore.length;i++){
					var contact = contactStore[i];
					var groupIds = this.getGroups(objectType,contact.id);
					contact.groupIds = groupIds;
					a.push(contact);
				}
			}
				
			return a;
		};
										
		MockContactDao.prototype.save = function(objectType,data){
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
			return this.get(objectType,data.id);					
								
		};
							
		MockContactDao.prototype.remove = function(objectType,id){
			var idx = getIndexForContactId(id);
			if (idx != null) {
				snow.util.array.remove(contactStore, idx);
				localStorage.contacts = JSON.stringify(contactStore);
			}
		};
		
		MockContactDao.prototype.getGroups = function(objectType,id){
			var groupContact = snow.dm.find("groupcontact",{contactId:id});
			var groupIds = [];
			for(var i=0;i<groupContact.length;i++){
				var groupContactData = groupContact[i];
				groupIds.push(groupContactData[0]);
			}
			return groupIds;
		};
		// ------ /DAO Generic CRUD Interface ------ //
		
		// ------ Privates ------- //				
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

		// ------ /Privates ------- //
						
		return MockContactDao;

	})();
<!-- /mock contact Dao -->