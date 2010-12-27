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