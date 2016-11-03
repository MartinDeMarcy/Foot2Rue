'use strict'; 

angular.module('app.services.teamSrv', [])

.factory('teamSrv', function(userSrv){

	return {
			getTeamByUser: function(userId) {
				return userId;
			},

			create: function(team) {
				userSrv.isSigned(function(user) {
					if (user)
					{
						if (angular.isDefined(team) && angular.isDefined(team.name))
						{
							console.log(team);
						}
						else
						{
							console.log("Champs incomplets");
						}
					}
				});
			}

		}
});
