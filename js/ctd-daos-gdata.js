
snow.dm.registerDao("contact",new GoogleContactDao());

snow.dm.registerDao("group",new GoogleGroupDao());

var ctd = ctd || {};
ctd.daos = ctd.daos || {};

ctd.daos.dataProviderType = "googleData";

ctd.daos.hasToken = function(){
	return chrome.extension.getBackgroundPage().oauth.hasToken();
}

ctd.daos.flushData = function(){
	chrome.extension.getBackgroundPage().getData(function(){
		snow.ui.display("group");
		snow.ui.display("contact");
		snow.ui.display("welcome");
	});
}

ctd.daos.getToken = function(callback){
	var _callback = function(){
		snow.ui.display("group");
		snow.ui.display("contact");
		snow.ui.display("welcome");
		callback();
	}
	return chrome.extension.getBackgroundPage().getToken(function(){
		_callback();
	});
}

ctd.daos.logOut = function(){
	chrome.extension.getBackgroundPage().logout();
}
