<!-- mock group contact Dao -->		
	var MockGroupContactDao = (function(){

		var groupContact = getGroupContact();
		
		function MockGroupContactDao(){};

		// ------ DAO Generic CRUD Interface ------ //
		MockGroupContactDao.prototype.get = function(objectType,id){
			
		};
		
		MockGroupContactDao.prototype.find = function(objectType,opts){			
			var a = [];
			groupContact = getGroupContact();
			
			if(opts.groupId){
				for (var i = 0; i < groupContact.length; i++){
					var u = groupContact[i];
					if(u[0] == opts.groupId){
						a.push($.extend({},u)); 
					}
				}
			}else if(opts.contactId){
				for (var i = 0; i < groupContact.length; i++){
					var u = groupContact[i];
					if(u[1] == opts.contactId){
						a.push($.extend({},u)); 
					}
				}
			}
			
			return a;
		};
		
		MockGroupContactDao.prototype.save = function(objectType,opts){
			groupContact = getGroupContact();
			var isHave = false;
			
			for (var i = 0; i < groupContact.length; i++){
				var u = groupContact[i];
				if(u[0] == opts.groupId && u[1] == opts.contactId){
					isHave = true;
					break;
				}
			}
			
			if(!isHave){
				var groupContactData = [];
				groupContactData.push(opts.groupId);
				groupContactData.push(opts.contactId);
				groupContact.push(groupContactData);	
				localStorage.groupcontact = JSON.stringify(groupContact);
			}
			
		};
		
		MockGroupContactDao.prototype.remove = function(objectType,opts){
			groupContact = getGroupContact();

			for (var i = 0; i < groupContact.length; i++){
				var u = groupContact[i];
				if(u[0] == opts.groupId && u[1] == opts.contactId){
					groupContact.splice(i,1)
					break;
				}
			}

			localStorage.groupcontact = JSON.stringify(groupContact);
		};
		
		// ------ /DAO Generic CRUD Interface ------ //
		
		// ------ Privates ------- //		
		
		function getGroupContact(){
			var groupContact = localStorage.groupcontact;
			if(groupContact == null){
				groupContact = new Array();
			}else{
				groupContact = JSON.parse(groupContact);
			}
			return groupContact;
		}
		
		// ------ /Privates ------- //
						
		return MockGroupContactDao;

	})();
<!-- /mock group contact Dao -->