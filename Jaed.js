var Ex;
if (typeof Ex == "undefined" || !Ex) {
	Ex = {};
}

Ex.Character = {
	atr : {
		strength   : 1,
		dexterity  : 3,
		stamina    : 3,
		essence    : 5
	},
	
	abil : {
		archery    : 0,
		ma         : 6,
		melee      : 0,
		thrown     : 0
	},
	
	weapons : {
		ma : [{
			name    : "Flurry Of August Leaves",
			handler : function (e) {
				Ex.flurryPenalty = false;
				Ex.pageToggle('pcPanel', 'flurryPanel');
				Ex.flurrying = true;
				Ex.flurries = [];
				Ex.currentFlurryIndex = 0;
				
				Ext.getCmp('lethalPaperFanButtons').setPressed(
					'lethalPaperFanOff',
					true
				);
				Ex.lethalPaper = false;
				
				Ex.nextFlurryAction(false);
			},
			special : {
				flurry : true
			}
		}, {
			name    : "Lethal Paper Fan Attack",
			handler : function (e) {
				Ex.pageToggle('pcPanel', 'lpFanPanel');
				
				Ex.activeWeapon = false;
				var list = Ext.getCmp('chooseLPFanWeapon');
				if (list) {
					var value = list.getComponent(0).value;
					if (value) {
						Ex.activeWeapon = Ex.updateWeapon(value);
					}
				}
			}
		}, {
			name  : "Perfect War Fan",
			stats : {
				speed    : 5,
				accuracy : 4,
				damage   : 2,
				type     : "L",
				defense  : 3,
				rate     : 3,
				cost     : 0
			},
			special : {
				specialty   : 1,
				lethalPaper : true,
			}
		}, {
			name  : "Sleeve / Cloth",
			stats : {
				speed    : 5,
				accuracy : -1,
				damage   : 7,
				type     : "L",
				defense  : 3,
				rate     : 2,
				cost     : 3
			},
			special : {
				specialty : 1
			}
		}, {
			name  : "Paper Fan",
			stats : {
				speed    : 5,
				accuracy : 2,
				damage   : 1,
				type     : "L",
				defense  : 2,
				rate     : 3,
				cost     : 3
			},
			special : {
				specialty : 1
			}
		}, {
			name : "Fine War Fan",
			stats : {
				speed    : 5,
				accuracy : 3,
				damage   : 1,
				type     : "L",
				defense  : 2,
				rate     : 3,
				cost     : 0
			},
			special : {
				specialty   : 1,
				lethalPaper : true,
			}
		}, {
			name  : "Unarmed (Punch)",
			stats : {
				speed    : 5,
				accuracy : 0,
				damage   : 0,
				type     : "B",
				defense  : 2,
				rate     : 3,
				cost     : 0
			}
		}, {
			name  : "Unarmed (Kick)",
			stats : {
				speed    : 5,
				accuracy : 0,
				damage   : 3,
				type     : "B",
				defense  : -2,
				rate     : 2,
				cost     : 0
			}
		}, {
			name  : "Unarmed (Clinch)",
			stats : {
				speed    : 6,
				accuracy : 0,
				damage   : 0,
				type     : "B",
				defense  : 0,
				rate     : 1,
				cost     : 0
			}
		}, {
			name    : "Flurry",
			handler : function (e) {
				Ex.flurryPenalty = true;
				Ex.flurrying = true;
				Ex.pageToggle('pcPanel', 'flurryPanel');
				Ex.flurries = [];
				Ex.currentFlurryIndex = 0;
				Ex.nextFlurryAction(false);
			},
			special : {
				flurry : true
			}
		}]
	}
};

// Define aliases.
Ex.Chr       = Ex.Character;
Ex_Character = Ex.Character;
