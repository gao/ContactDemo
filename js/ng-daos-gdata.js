
snow.dm.registerDao("contact",new GoogleContactDao());

snow.dm.registerDao("group",new GoogleGroupDao());

var ng = ng || {};
ng.daos = ng.daos || {};

ng.daos.dataProviderType = "googleData";

ng.daos.hasToken = function(){
	return chrome.extension.getBackgroundPage().ng.core.oauth.hasToken();
}

ng.daos.flushData = function(callback){
	chrome.extension.getBackgroundPage().ng.contact.getData(callback);
}

ng.daos.getToken = function(callback){
	return chrome.extension.getBackgroundPage().ng.contact.getToken(callback);
}

ng.daos.logOut = function(){
	chrome.extension.getBackgroundPage().ng.core.logout();
}

ng.daos.createContact = function(data,callback){
	return chrome.extension.getBackgroundPage().ng.contact.createContact(data,callback);
}

ng.daos.deleteContact = function(id,callback){
	var contact = snow.dm.get("contact",id);
	var editLink = contact.editLink;
	var _callback = function(){
		snow.dm.remove("contact",id);
		callback();
	}
	chrome.extension.getBackgroundPage().ng.contact.deleteContact(editLink,_callback);
}

ng.daos.createGroup = function(data,callback){
	return chrome.extension.getBackgroundPage().ng.contact.createGroup(data,callback);
}

ng.daos.deleteGroup = function(id,callback){
	var group = snow.dm.get("group",id);
	var editLink = group.editLink;
	chrome.extension.getBackgroundPage().ng.contact.deleteGroup(editLink,callback);
}

ng.daos.updateGroup = function(data,callback){
	var group = snow.dm.get("group",data.id);
	var editLink = group.editLink;
	return chrome.extension.getBackgroundPage().ng.contact.updateGroup(editLink,data,callback);
}
