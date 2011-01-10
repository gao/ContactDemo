
snow.dm.registerDao("contact",new GoogleContactDao());

snow.dm.registerDao("group",new GoogleGroupDao());

var ng = ng || {};
ng.daos = ng.daos || {};

ng.daos.dataProviderType = "googleData";

ng.daos.hasToken = function(){
	return chrome.extension.getBackgroundPage().ng.core.oauth.hasToken();
}

ng.daos.flushData = function(){
	chrome.extension.getBackgroundPage().ng.contact.getData(function(){
		snow.ui.display("group");
		snow.ui.display("contact");
		snow.ui.display("welcome");
	});
}

ng.daos.getToken = function(callback){
	var _callback = function(){
		snow.ui.display("group");
		snow.ui.display("contact");
		snow.ui.display("welcome");
		callback();
	}
	return chrome.extension.getBackgroundPage().ng.contact.getToken(function(){
		_callback();
	});
}

ng.daos.logOut = function(){
	chrome.extension.getBackgroundPage().ng.core.logout();
}

ng.daos.createContact = function(data){
	return chrome.extension.getBackgroundPage().ng.contact.createContact(data);
}

ng.daos.deleteContact = function(id){
	var contact = snow.dm.get("contact",id);
	var editLink = contact.editLink;
	chrome.extension.getBackgroundPage().ng.contact.deleteContact(editLink,function(){
		snow.dm.remove("contact",id);
		snow.ui.display("contactInfo");
		snow.ui.display("contact");
	});
}
