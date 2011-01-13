
snow.dm.registerDao("contact",new MockContactDao());

snow.dm.registerDao("group",new MockGroupDao());

var ng = ng || {};
ng.daos = ng.daos || {};

ng.daos.dataProviderType = "mockData";

ng.daos.hasToken = function(){
	var hasToken = localStorage.getItem("oauth_tokenMock") ? true : false;
	return hasToken;
}

ng.daos.flushData = function(callback){
	localStorage.setItem("groups",JSON.stringify(mockGroupDatas));
	localStorage.setItem("contacts",JSON.stringify(mockContactDatas));
	if(callback){
		callback();
	}
}

ng.daos.getToken = function(callback){
	localStorage.setItem("oauth_tokenMock","mockToken");
	if(callback){
		callback();
	}
	var token = localStorage.getItem("oauth_tokenMock");
	return token;
}

ng.daos.logOut = function(){
	localStorage.removeItem("oauth_tokenMock");
}

ng.daos.createContact = function(data,callback){
	snow.dm.save("contact",data);
	if(callback){
		callback();
	}
}

ng.daos.deleteContact = function(id,callback){
	snow.dm.remove("contact",id);
	if(callback){
		callback();
	}
}

ng.daos.createGroup = function(data,callback){
	snow.dm.save("group",group);
	if(callback){
		callback();
	}
}

ng.daos.deleteContact = function(id){
	snow.dm.remove("group",id);
	if(callback){
		callback();
	}
}
