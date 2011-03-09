/**
 * The Exalted controller class.
 * 
 * @author Bill
 */
Ex = {
	activeAbility : false,
	activeWeapon  : false,
	flurryPenalty : true,
	healthPenalty : 0,
	
	flurrying     : false,
	usingKata     : false,
	stoneBones    : false,
	lethalPaper   : false,
	
	activeFlurryWeapon : false,
	currentFlurryIndex : 0,
	flurryPenaltyCount : 0,
	
	stats    : {},
	flurries : [],
	
	init : function ()
	{
		Ext.getCmp('homePanel').show();
		Ext.getCmp('chooseWeapon').addListener(
			'cardswitch',
			function (e, obj) {
				Ex.activeWeapon = Ex.updateWeapon(obj.value);
			}
		);
		Ext.getCmp('chooseFlurryWeapon').addListener(
			'cardswitch',
			function (e, obj) {
				Ex.activeFlurryWeapon = Ex.updateWeapon(obj.value);
			}
		);
		Ext.getCmp('chooseLPFanWeapon').addListener(
			'cardswitch',
			function (e, obj) {
				Ex.activeWeapon = Ex.updateWeapon(obj.value);
			}
		);
		
		if (Ex.Chr.init) {
			Ex.Chr.init();
		}
	},
	
	resetActiveWeapon : function (card)
	{
		var list = Ext.getCmp(card);
		if (!list) {
			return;
		}
		
		var comp = list.getComponent(0);
		if (!comp) {
			return;
		}
		
		var value = comp.value;
		
		list.setActiveItem(comp);
		Ex.activeWeapon = Ex.updateWeapon(value);
	},
	
	updateWeapon : function (wepIndex)
	{
		if (!Ex.Chr.weapons[Ex.activeAbility]) {
			return;
		}
		
		var wepObj = Ex.Chr.weapons[Ex.activeAbility];
		if (!wepObj[wepIndex]) {
			return;
		}
		
		return wepObj[wepIndex];
	},
	
	pageToggle : function (curPage, newPage)
	{
		if (!Ext.getCmp(curPage) || !Ext.getCmp(newPage)) {
			return;
		}
		
		Ext.getCmp(curPage).hide();
		Ext.getCmp(newPage).show();
	},
	
	getHealthPenalty : function ()
	{
		if (Ex.healthPenalty >= 0) {
			return 0;
		}
		
		if (Ex.stoneBones) {
			return Math.ceil(Ex.healthPenalty / 2);
		}
		
		return Ex.healthPenalty;
	},
	
	attackAbilityToggle : function (ability)
	{
		Ex.activeAbility = ability;
		
		Ext.getCmp('abilityToolbar').setTitle(ability);
		
		var weps;
		if (!Ex.Chr.weapons[ability]) {
			Ext.Msg.alert(
				'Sorry',
				'No weapons have been defined for this ability.',
				Ext.emptyFn
			);
			
			weps = [{name: 'none'}];
		} else {
			weps = Ex.Chr.weapons[ability];
		}
		
		var weapLists = {
			base   : Ext.getCmp('chooseWeapon'),
			flurry : Ext.getCmp('chooseFlurryWeapon'),
			lpfan  : Ext.getCmp('chooseLPFanWeapon')
		};
		
		for (var wname in weapLists) {
			if (!weapLists.hasOwnProperty(wname)) {
				continue;
			}
			
			weapLists[wname].removeAll();
			
			for (var i = 0; i < weps.length; i++) {
				if (wname == 'flurry') {
					if (weps[i].special && weps[i].special.flurry) {
						continue;
					}
				} else if (wname == 'lpfan') {
					if (!weps[i].special || !weps[i].special.lethalPaper) {
						continue;
					} else if (weps[i].special.flurry) {
						continue;
					}
				}
				
				weapLists[wname].insert(i, {
					html  : weps[i].name,
					value : i
				});
			}
			
			if (wname == 'flurry') {
				weapLists[wname].insert(0, {
					html  : 'none',
					value : -1
				});
			}
			
			weapLists[wname].doLayout();
		}
		
		Ex.activeWeapon = Ex.updateWeapon(0);
	},
	
	addFlurryAction : function ()
	{
		if (!Ex.activeFlurryWeapon) {
			Ex.flurries[Ex.currentFlurryIndex] = {
				index  : 0,
				weapon : {
					name  : 'none',
					stats : false
				}
			};
			return;
		}
		
		var used = 0;
		for (var k = 0; k < Ex.flurries.length; k++) {
			if (Ex.flurries[k].weapon.name == Ex.activeFlurryWeapon.name) {
				used++;
			}
		}
		
		if (Ex.activeFlurryWeapon.stats.rate
			&& used
		    && used >= Ex.activeFlurryWeapon.stats.rate
		) {
			Ext.Msg.alert(
				'Rate Exceeded',
				'This weapon has now been used more than its rate : ' + Ex.activeFlurryWeapon.stats.rate + '.',
				Ext.emptyFn
			);
		}
		
		var stats = Ex._physicalAttack(
			Ex.activeAbility,
			Ex.activeFlurryWeapon
		);
		
		stats.index = Ext.getCmp('chooseFlurryWeapon').getActiveIndex();
		
		Ex.flurries[Ex.currentFlurryIndex] = stats;
	},
	
	nextFlurryAction : function (prev)
	{
		var attackIndex = 0;
		if (prev) {
			attackIndex = Ex.currentFlurryIndex - 1;
			if (attackIndex < 0) {
				Ex.currentFlurryIndex = 0;
				Ex.flurries = [];
				Ex.pageToggle('flurryPanel', 'pcPanel');
				return;
			}
		} else if (Ex.flurries.length > 0) {
			attackIndex = Ex.flurries.length;
		}
		
		Ex.currentFlurryIndex = attackIndex;
		
		if (Ex.flurries[attackIndex]) {
			var current = Ex.flurries[attackIndex];
			var car     = Ext.getCmp('chooseFlurryWeapon');
			
			car.setActiveItem(current.index);
		}
		
		Ext.getCmp('flurryToolbar').setTitle(
			'Flurry Attack #' + (attackIndex - 1 + 2)
		);
	},
	
	flurryPewPewAction : function (e)
	{
		if (Ex.flurryPenalty) {
			var penalty = 0 - Ex.flurries.length;
			for (var i = 0; i < Ex.flurries.length; i++) {
				if (!Ex.flurries[i].index) {
					penalty--;
					continue;
				}
				
				Ex.flurries[i].accuracy += penalty;
				Ex.flurries[i].accList.push({
					'name'  : "Flurry Penalty",
					'count' : penalty
				});
				penalty--;
			}
		}
		
		var changeFlurryCallback = function (e) {
			var button  = Ext.getCmp('flurryResultsStunt');
			var pressed = button.getPressed();
			button.setPressed(pressed, false);
			button.doLayout();
			
			Ex.flurryResultsToggle(e.callIndex);
		};
		
		var list = Ext.getCmp('flurryResultsList');
		list.removeAll();
		
		var pressed = false;
		for (var j = 0; j < Ex.flurries.length; j++) {
			if (j == 0) {
				pressed = true;
			} else {
				pressed = false;
			}
			
			list.insert(j, {
				text      : '#' + (j - 1 + 2),
				callIndex : j,
				handler   : changeFlurryCallback,
				pressed   : pressed
			});
		}
		
		list.setHeight(35);
		list.doLayout();
		
		Ex.pageToggle('flurryPanel', 'flurryResultsPanel');
		
		Ex.flurryResultsToggle(0);
	},
	
	flurryResultsToggle : function (index)
	{
		Ex.stats = Ex.flurries[index];
		
		Ex.pcResultsToggle('all', 'flurryResultsPanel');
		
		Ext.getCmp('flurryResultsTypes').setPressed(
			'flurryResultsTypesAll',
			true,
			true
		);
		
		Ext.getCmp('flurryResultsList').setPressed(index, true);
		
		if (Ex.stats.stunt) {
			Ext.getCmp('flurryResultsStunt').setPressed(
				'flurryStunt-' + Ex.stats.stunt,
				true
			);
		}
	},
	
	physicalDefendAction : function (e)
	{
		if (!Ex.activeAbility) {
			Ext.Msg.alert(
				'Fail Whale',
				'You must select an ability before parrying.',
				Ext.emptyFn
			);
			return;
		} else if (!Ex.activeWeapon || !Ex.activeWeapon.stats) {
			Ext.Msg.alert(
				'Fail Whale',
				'You must select a valid weapon before parrying.',
				Ext.emptyFn
			);
			return;
		}
		
		var stats = Ex._physicalAttack(
			Ex.activeAbility,
			Ex.activeWeapon
		);
		
		var weaponDefense = 0;
		if (stats.defense) {
			weaponDefense = stats.defense;
		}
		
		var dv = Ex._physicalParry(
			Ex.activeAbility,
			weaponDefense
		);
		
		Ext.Msg.alert(
			'Parry DV',
			dv,
			Ext.emptyFn
		);
	},
	
	physicalAttackAction : function (e)
	{
		if (!Ex.activeAbility) {
			Ext.Msg.alert(
				'Fail Whale',
				'You must select an ability before attacking.',
				Ext.emptyFn
			);
			return;
		}
		
		if (Ex.activeWeapon.handler) {
			Ex.activeWeapon.handler.call(e);
			return;
		}
		
		Ex.stats = Ex._physicalAttack(
			Ex.activeAbility,
			Ex.activeWeapon
		);
		
		Ext.getCmp('lightResultsToolbar').setTitle(
			Ex.activeWeapon.name
		);
		
		Ex.pageToggle('pcPanel', 'resultsPanel');
		
		var list  = Ext.getCmp('lightResultsToolbarList');
		var stunt = Ext.getCmp('resultsStunt');
		
		list.setPressed(0, true);
		stunt.setPressed(0, false);
		stunt.setPressed(1, false);
		stunt.setPressed(2, false);
		
		Ex.pcResultsToggle('all');
	},
	
	pcResultsToggle : function (type, panel)
	{
		var html = '';
		var list = {};
		
		if (!panel) {
			panel = 'resultsPanel';
		}
		
		if (Ex.stats[type]) {
			list = Ex.stats[type];
			
			for (var i = 0; i < list.length; i++) {
				html += list[i].name + ": " + list[i].count + "<br />";
			}
			
			if (type == 'accList') {
				if (Ex.stats.stunt) {
					html += "Stunt: " + Ex.stats.stunt + "<br />";
				} else {
					html += "Stunt: ?<br />";
				}
			} else if (type == 'damageList') {
				html += "Successes: ?<br />";
			}
		} else {
			var statValue;
			html += "Weapon: " + Ex.stats.weapon.name + "<br />";
			
			for (var name in Ex.stats) {
				if (name == 'weapon' || name == 'accList' || name == 'damageList' || name == 'index') {
					continue;
				}
				
				statValue = Ex.stats[name];
				if (name == 'accuracy') {
					if (Ex.stats.stunt) {
						statValue = statValue + Ex.stats.stunt;
					} else {
						statValue = statValue + ' + Stunt';
					}
				} else if (name == 'damage') {
					statValue = statValue + ' + Successes';
				} else if (name == 'cost') {
					if (Ex.stats.stunt) {
						statValue = statValue - (Ex.stats.stunt * 2);
					}
				}
				
				html += name + ": " + statValue + "<br />";
			}
		}
		
		Ext.getCmp(panel).update(html);
		
		Ext.getCmp(panel).doLayout();
	},
	
	_physicalParry : function (type, defense)
	{
		var value = 0;
		
		value += Ex.Chr.atr.dexterity;
		value += Ex.Chr.abil[type];
		value += defense;
		
		value = Math.ceil(value / 2);
		
		if (Ex.healthPenalty) {
			value += Ex.getHealthPenalty();
		}
		
		return value;
	},
	
	_physicalAttack : function (type, weapon)
	{
		var attStats = {
			'accuracy'   : 0,
			'accList'    : [],
			'damage'     : 0,
			'damageList' : [],
			'damageType' : "B",
			'speed'      : 6,
			'defense'    : 0,
			'cost'       : 0,
			'rate'       : 0,
			'weapon'     : weapon
		};
		
		var dieCount = 0;
		var dieList  = [];
		
		var damageCount = 0;
		var damageList  = [];
		
		// Add in base attributes and abilities.
		dieCount += Ex.Chr.atr.dexterity;
		dieList.push({
			'name'  : "Dexterity",
			'count' : Ex.Chr.atr.dexterity
		});
		
		dieCount += Ex.Chr.abil[type];
		dieList.push({
			'name'  : type,
			'count' : Ex.Chr.abil[type]
		});
		
		damageCount += Ex.Chr.atr.strength;
		damageList.push({
			'name'  : "Strength",
			'count' : Ex.Chr.atr.strength
		});
		
		// Add in all the weapon stats.
		dieCount += weapon.stats.accuracy;
		dieList.push({
			'name'  : weapon.name,
			'count' : weapon.stats.accuracy
		});
		
		damageCount += weapon.stats.damage;
		damageList.push({
			'name'  : weapon.name,
			'count' : weapon.stats.damage
		});
		
		attStats.cost       += weapon.stats.cost;
		attStats.defense    += weapon.stats.defense;
		attStats.speed       = weapon.stats.speed;
		attStats.damageType  = weapon.stats.type;
		attStats.rate        = weapon.stats.rate;
		
		if (Ex.healthPenalty) {
			var hp = Ex.getHealthPenalty();
			
			dieCount += hp;
			dieList.push({
				'name'  : "Health Penalty",
				'count' : hp
			});
			
			damageCount += hp;
			damageList.push({
				'name'  : "Health Penalty",
				'count' : hp
			});
		}
		
		// If using Kata, add essence stats.
		if (Ex.usingKata) {
			dieCount += Ex.Chr.atr.essence;
			dieList.push({
				'name'  : "Kata Bracers",
				'count' : Ex.Chr.atr.essence
			});
			
			damageCount += Ex.Chr.atr.essence;
			damageList.push({
				'name'  : "Kata Bracers",
				'count' : Ex.Chr.atr.essence
			});
			
			attStats.defense    += Ex.Chr.atr.essence;
			attStats.damageType  = "L";
		}
		
		if (Ex.stoneBones) {
			damageCount += Ex.Chr.atr.essence;
			damageList.push({
				'name'  : "Unbreakable Bones of Stone",
				'count' : Ex.Chr.atr.essence
			});
		}
		
		if (weapon.special && weapon.special.specialty) {
			dieCount += weapon.special.specialty;
			dieList.push({
				'name'  : "Weapon Specialty",
				'count' : weapon.special.specialty
			});
			
			attStats.defense += weapon.special.specialty;
		}
		
		var useLethalPaper = false
		if (weapon.special && weapon.special.lethalPaper) {
			useLethalPaper = true;
		}
		
		if (Ex.lethalPaper && useLethalPaper) {
			attStats.cost += 3;
			
			if (Ex.lethalPaper == 'accuracy') {
				dieCount += Ex.Chr.atr.essence;
				dieList.push({
					'name'  : "Lethal Paper Fan Attack",
					'count' : Ex.Chr.atr.essence
				});
			} else if (Ex.lethalPaper == 'damage') {
				damageCount += Ex.Chr.atr.essence;
				damageList.push({
					'name'  : "Lethal Paper Fan Attack",
					'count' : Ex.Chr.atr.essence
				});
			} else if (Ex.lethalPaper == 'defense') {
				attStats.defense += Ex.Chr.atr.essence;
			} else if (Ex.lethalPaper == 'speed') {
				attStats.speed -= Ex.Chr.atr.essence;
				if (attStats.speed < 1) {
					attStats.speed = 1;
				}
			}
		}
		
		if (Ex.flurryPenaltyCount) {
			dieCount += Ex.flurryPenaltyCount;
			dieList.push({
				'name'  : "Flurry Penalty",
				'count' : Ex.flurryPenaltyCount
			});
		}
		
		attStats.accuracy   = dieCount;
		attStats.accList    = dieList;
		attStats.damage     = damageCount;
		attStats.damageList = damageList;
		
		return attStats;
	}
};

// Check to see if a character was defined.
if (typeof Ex_Character != "undefined" && Ex_Character) {
	Ex.Character = Ex_Character;
	Ex.Chr       = Ex_Character;
}
