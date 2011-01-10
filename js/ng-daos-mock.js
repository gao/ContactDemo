
snow.dm.registerDao("contact",new MockContactDao());

snow.dm.registerDao("group",new MockGroupDao());

var ng = ng || {};
ng.daos = ng.daos || {};

ng.daos.dataProviderType = "mockData";

ng.daos.hasToken = function(){
	var hasToken = localStorage.getItem("oauth_tokenMock") ? true : false;
	return hasToken;
}

ng.daos.flushData = function(){
	localStorage.setItem("groups",JSON.stringify(mockGroupDatas));
	localStorage.setItem("contacts",JSON.stringify(mockContactDatas));
	snow.ui.display("group");
	snow.ui.display("contact");
	snow.ui.display("welcome");
}

ng.daos.getToken = function(callback){
	localStorage.setItem("oauth_tokenMock","mockToken");
	callback();
	$logoffButton.show();
	$loginButton.hide();
	var token = localStorage.getItem("oauth_tokenMock");
	return token;
}

ng.daos.logOut = function(){
	localStorage.removeItem("oauth_tokenMock");
}

ng.daos.createContact = function(data){
	snow.dm.save("contact",data);
	snow.ui.display("contactInfo");
	snow.ui.display("contact");
}

ng.daos.deleteContact = function(editLink){
	snow.dm.remove("contact",id);
}