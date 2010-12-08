			google.load("gdata", "2.x");

			google.setOnLoadCallback(initFunc);

			function initFunc() {  
				setupContactsService(); 
			}

			var contactsService;  

			function setupContactsService() {  
				var contactsService = new google.gdata.contacts.ContactsService('GoogleInc-jsguide-1.0');
			} 
			
			function logMeIn() {  
				var scope = 'https://www.google.com/m8/feeds'; 
				var check = google.accounts.user.checkLogin(scope);
				if (check) {
					alert("retrieve Contacts data");
					getMyContacts();
				}else{
					alert("Jump to Google sign in");
					google.accounts.user.login(scope);
				}
			}  

			function logMeOut() {   
				var scope = 'https://www.google.com/m8/feeds'; 
				var check = google.accounts.user.checkLogin(scope);
				if (check) {
					google.accounts.user.logout(); 
				}
			}


			function getMyContacts() { 
				var feedUri = 'http://www.google.com/m8/feeds/contacts/default/full';
				var query = new google.gdata.contacts.ContactQuery(feedUri);
				query.setMaxResults(50);

				// callback method to be invoked when getContactFeed() returns data
				var callback = function(result) {
					var entries = result.feed.entry;
					for (var i = 0; i < entries.length; i++) {
						var contactEntry = entries[i];
						var emailAddresses = contactEntry.getEmailAddresses();
						for (var j = 0; j < emailAddresses.length; j++) {
							var emailAddress = emailAddresses[j].getAddress();
							alert('email = ' + emailAddress);
						}    
					}
				}

				// Error handler
				var handleError = function(e) {
					alert("There was an error!");
					alert(e.cause ? e.cause.statusText : e.message);
				}

				contactsService.getContactFeed(query, callback, handleError);
			}
