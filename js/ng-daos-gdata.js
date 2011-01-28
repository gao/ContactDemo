
snow.dm.registerDao("contact",new GoogleContactDao());

snow.dm.registerDao("group",new GoogleGroupDao());

snow.dm.registerDao("groupcontact",new GoogleGroupContactDao());

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
	chrome.extension.getBackgroundPage().ng.contact.deleteContact(editLink,callback);
}

ng.daos.updateContact = function(data,callback){
	var contact = snow.dm.get("contact",data.id);
	var selfLink = contact.selfLink;
	var editLink = contact.editLink;
	return chrome.extension.getBackgroundPage().ng.contact.updateContact(editLink,selfLink,data,callback);
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
