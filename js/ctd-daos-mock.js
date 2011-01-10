
snow.dm.registerDao("contact",new MockContactDao());

snow.dm.registerDao("group",new MockGroupDao());

var ctd = ctd || {};
ctd.daos = ctd.daos || {};

ctd.daos.dataProviderType = "mockData";

ctd.daos.hasToken = function(){
	var hasToken = localStorage.getItem("oauth_tokenMock") ? true : false;
	return hasToken;
}

ctd.daos.flushData = function(){
	localStorage.setItem("groups",JSON.stringify(mockGroupDatas));
	localStorage.setItem("contacts",JSON.stringify(mockContactDatas));
	snow.ui.display("group");
	snow.ui.display("contact");
	snow.ui.display("welcome");
}

ctd.daos.getToken = function(callback){
	localStorage.setItem("oauth_tokenMock","mockToken");
	callback();
	$logoffButton.show();
	$loginButton.hide();
	var token = localStorage.getItem("oauth_tokenMock");
	return token;
}

ctd.daos.logOut = function(){
	localStorage.removeItem("oauth_tokenMock");
}

ctd.daos.createContact = function(data){
	
}

ctd.daos.deleteContact = function(editLink){
	snow.dm.remove("contact",id);
}