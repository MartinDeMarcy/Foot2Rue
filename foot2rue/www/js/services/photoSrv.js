'use strict'; 

angular.module('app.services.photoSrv', [])

.factory('photoSrv', function(){

	return {
			getPhotoByUser: function(userId) {
				return userId;
			}
		}
});
