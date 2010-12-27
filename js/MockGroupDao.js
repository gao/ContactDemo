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