/**
 * Defines the Sencha Touch panels that act as pages
 * for this program.
 * 
 * @author Bill
 */

/*
 * The Sencha Touch setup.
 */
Ext.setup({
	tabletStartupScreen : 'tablet_startup.png',
	phoneStartupScreen  : 'phone_startup.png',
	icon                : 'icon.png',
	glossOnIcon         : false,
	onReady             : function() {
		Ex.init();
	}
});

/*
 * Define the Exalted Panel Pages.
 * These are registered with the Sencha Touch ComponentMgr
 * and can be loaded using Ext.getCmp(id).
 */

new Ext.Panel({
	fullscreen  : true,
	id          : 'homePanel',
	layout      : {
		type: 'vbox',
		align: 'left'
	},
	dockedItems : [{
		dock  : 'top',
		xtype : 'toolbar',
		title : 'Exalted Battle'
	}, {
		dock  : 'top',
		xtype : 'toolbar',
		ui    : 'light',
		items : [{
			text    : 'Physical Combat',
			handler : function (e) {
				Ex.pageToggle('homePanel', 'pcPanel');
			}
		}, {
			text    : 'Mental Combat',
			handler : function (e) {
				alert('You are the mentalist!');
			}
		}]
	}]
});

new Ext.Sheet({
	id       : 'pcSheet',
	hidden   : true,
	height   : 300,
	stretchX : true,
	stretchY : true,
	layout   : {
		type  : 'vbox',
		align : 'center',
		pack  : 'center'
	},
	dockedItems: [{
		dock  : 'top',
		xtype : 'toolbar',
		ui    : 'dark',
		id    : 'healthPenaltyToolbar',
		title : 'Health Penalty',
		items : new Ext.SegmentedButton({
			items: [{
				text    : '-0',
				handler : function (e) {
					Ex.healthPenalty = 0;
				}
			}, {
				text    : '-1',
				handler : function (e) {
					Ex.healthPenalty = -1;
				}
			}, {
				text    : '-2',
				handler : function (e) {
					Ex.healthPenalty = -2;
				}
			}, {
				text    : '-4',
				handler : function (e) {
					Ex.healthPenalty = -4;
				}
			}]
		})
	}, {
		dock  : 'top',
		xtype : 'toolbar',
		ui    : 'dark',
		id    : 'kataBracersToolbar',
		title : 'Using Kata Bracers',
		items : new Ext.SegmentedButton({
			items: [{
				text    : 'On',
				handler : function (e) {
					Ex.usingKata = true;
				}
			}, {
				text    : 'Off',
				handler : function (e) {
					Ex.usingKata = false;
				}
			}]
		})
	}, {
		dock  : 'top',
		xtype : 'toolbar',
		ui    : 'light',
		id    : 'stoneBonesToolbar',
		title : 'Unbreakable Bones of Stone',
		items : new Ext.SegmentedButton({
			items: [{
				text    : 'On',
				handler : function (e) {
					Ex.stoneBones = true;
				}
			}, {
				text    : 'Off',
				handler : function (e) {
					Ex.stoneBones = false;
				}
			}]
		})
	}, {
		dock    : 'bottom',
		xtype   : 'button',
		text    : 'Close',
		handler : function (e) {
			Ext.getCmp('pcSheet').hide();
		}
	}]
});

new Ext.Panel({
	fullscreen  : true,
	hidden      : true,
	id          : 'pcPanel',
	layout      : {
		type  : 'vbox',
		pack  : 'justify'
	},
	dockedItems : [{
		dock  : 'top',
		xtype : 'toolbar',
		title : 'Physical Combat',
		items : [{
			text    : 'Back',
			handler : function (e) {
				Ex.pageToggle('pcPanel', 'homePanel');
			}
		}]
	}, {
		dock  : 'top',
		xtype : 'toolbar',
		ui    : 'light',
		id    : 'abilityToolbar',
		items : new Ext.SegmentedButton({
			items: [{
				text    : 'MA',
				handler : function (e) {
					Ex.attackAbilityToggle('ma');
				}
			}, {
				text    : 'Melee',
				handler : function (e) {
					Ex.attackAbilityToggle('melee');
				}
			}, {
				text    : 'Thrown',
				handler : function (e) {
					Ex.attackAbilityToggle('thrown');
				}
			}, {
				text    : 'Archery',
				handler : function (e) {
					Ex.attackAbilityToggle('archery');
				}
			}]
		})
	},{
		dock  : 'top',
		xtype : 'toolbar',
		ui    : 'light',
		id    : 'moreButton',
		items : [{
			dock    : 'bottom',
			xtype   : 'button',
			text    : 'Extras',
			handler : function (e) {
				Ext.getCmp('pcSheet').show();
			}
		}]
	}],
	items : [{
		xtype     : 'carousel',
		ui        : 'dark',
		indicator : true,
		hidden    : false,
		id        : 'chooseWeapon',
		height    : 100,
		width     : 500,
		items     : [{
			html : 'none',
			cls  : 'card cardnone'
		}]
	},
	new Ext.Button({
		ui      : 'decline',
		text    : 'Attack',
		handler : function (e) {
			Ex.physicalAttackAction(e);
		}
	}),
	new Ext.Button({
		ui      : 'decline',
		text    : 'Parry',
		handler : function (e) {
			Ex.physicalDefendAction(e);
		}
	})
	]
});

new Ext.Panel({
	fullscreen  : true,
	hidden      : true,
	id          : 'flurryPanel',
	layout      : {
		type  : 'hbox',
		pack  : 'center'
	},
	dockedItems : [{
		dock  : 'top',
		xtype : 'toolbar',
		title : 'Flurry Attack',
		id    : 'flurryToolbar',
		items : [{
			text    : 'Back',
			handler : function (e) {
				if (Ex.flurries.length < 1) {
					Ex.pageToggle('flurryPanel', 'pcPanel');
					Ex.flurrying = false;
				} else {
					Ex.nextFlurryAction(true);
				}
			}
		}]
	}, {
		dock      : 'top',
		xtype     : 'carousel',
		ui        : 'dark',
		indicator : true,
		hidden    : false,
		id        : 'chooseFlurryWeapon',
		height    : 100,
		width     : 500,
		items     : [{
			html: 'none',
			cls : 'card cardnone'
		}]
    }],
	items : [
		new Ext.Button({
			ui      : 'decline',
			text    : 'Add Attack',
			handler : function (e) {
				Ex.addFlurryAction();
				Ex.nextFlurryAction(false);
			}
		}),
		new Ext.Button({
			ui    : 'decline',
			text  : 'Finish Flurry',
			handler : function (e) {
				Ex.addFlurryAction();
				Ex.flurryPewPewAction();
			}
		})
	]
});

new Ext.Panel({
	fullscreen  : true,
	hidden      : true,
	id          : 'lpFanPanel',
	layout      : {
		type  : 'hbox',
		pack  : 'center'
	},
	dockedItems : [{
		dock  : 'top',
		xtype : 'toolbar',
		title : 'Lethal Paper Fan Attack',
		id    : 'lpFanToolbar',
		items : [{
			text    : 'Back',
			handler : function (e) {
				Ex.lethalPaper = false;
				
				Ext.getCmp('lethalPaperFanButtons').setPressed('lethalPaperFanOff', true);
				
				if (Ex.flurries.length < 1) {
					Ex.pageToggle('lpFanPanel', 'pcPanel');
					Ex.resetActiveWeapon('chooseWeapon');
				} else {
					Ex.pageToggle('lpFanPanel', 'flurryPanel');
					Ex.resetActiveWeapon('chooseFlurryWeapon');
				}
			}
		}]
	}, {
		dock  : 'top',
		xtype : 'toolbar',
		ui    : 'dark',
		id    : 'lethalPaperToolbar',
		title : 'Bonus',
		items : new Ext.SegmentedButton({
			id    : 'lethalPaperFanButtons',
			items : [{
				text    : 'Off',
				id      : 'lethalPaperFanOff',
				handler : function (e) {
					Ex.lethalPaper = false;
				}
			}, {
				text    : 'Speed',
				handler : function (e) {
					Ex.lethalPaper = 'speed';
				}
			}, {
				text    : 'Damage',
				handler : function (e) {
					Ex.lethalPaper = 'damage';
				}
			}, {
				text    : 'Accuracy',
				handler : function (e) {
					Ex.lethalPaper = 'accuracy';
				}
			}, {
				text    : 'Defense',
				handler : function (e) {
					Ex.lethalPaper = 'defense';
				}
			}]
		})
	}, {
		dock      : 'top',
		xtype     : 'carousel',
		ui        : 'dark',
		indicator : true,
		hidden    : false,
		id        : 'chooseLPFanWeapon',
		height    : 100,
		width     : 500,
		items     : [{
			html: 'none',
			cls : 'card cardnone'
		}]
    }],
	items : [
		new Ext.Button({
			ui      : 'decline',
			text    : 'Attack',
			handler : function (e) {
				Ext.getCmp('lpFanPanel').hide();
				
				if (Ex.flurrying) {
					Ex.addFlurryAction();
					Ex.nextFlurryAction(false);
				} else {
					Ex.physicalAttackAction(e);
				}
			}
		}),
		new Ext.Button({
			ui      : 'decline',
			text    : 'Parry',
			handler : function (e) {
				Ex.physicalDefendAction(e);
			}
		})
	]
});

new Ext.Panel({
	fullscreen  : true,
	hidden      : true,
	id          : 'resultsPanel',
	layout      : {
		type  : 'vbox',
		align : 'justify'
	},
	dockedItems : [{
		dock  : 'top',
		xtype : 'toolbar',
		title : 'Results',
		items : [{
			text    : 'Back',
			handler : function (e) {
				Ex.resetActiveWeapon('chooseWeapon');
				
				Ex.pageToggle('resultsPanel', 'pcPanel');
				Ext.getCmp('resultsPanel').update('');
				Ext.getCmp('resultsPanel').doLayout();
			}
		}]
	}, {
		dock  : 'top',
		xtype : 'toolbar',
		ui    : 'light',
		id    : 'lightResultsToolbar',
		items : new Ext.SegmentedButton({
			id : 'lightResultsToolbarList',
			items: [{
				text    : 'All',
				id      : 'lightResultsToolbarAll',
				handler : function (e) {
					Ex.pcResultsToggle('all');
				}
			}, {
				text    : 'Accuracy',
				handler : function (e) {
					Ex.pcResultsToggle('accList');
				}
			}, {
				text    : 'Damage',
				handler : function (e) {
					Ex.pcResultsToggle('damageList');
				}
			}]
		})
	}, {
		dock  : 'top',
		xtype : 'toolbar',
		ui    : 'light',
		title : 'Stunt',
		layout : {},
		items : [
			new Ext.SegmentedButton({
				id    : 'resultsStunt',
				items : [{
					text    : '0 die',
					id      : 'regStunt-0',
					handler : function (e) {
						Ex.stats.stunt = 0;
						Ex.pcResultsToggle('all');
					}
				}, {
					text    : '1 die',
					id      : 'regStunt-1',
					handler : function (e) {
						Ex.stats.stunt = 1;
						Ex.pcResultsToggle('all');
					}
				}, {
					text    : '2 die',
					id      : 'regStunt-2',
					handler : function (e) {
						Ex.stats.stunt = 2;
						Ex.pcResultsToggle('all');
					}
				}, {
					text    : '3 die',
					id      : 'regStunt-3',
					handler : function (e) {
						Ex.stats.stunt = 3;
						Ex.pcResultsToggle('all');
					}
				}]
			})
		]
	}]
});

new Ext.Panel({
	fullscreen  : true,
	hidden      : true,
	id          : 'flurryResultsPanel',
	layout      : {
		type  : 'vbox',
		align : 'justify'
	},
	dockedItems : [{
		dock  : 'top',
		xtype : 'toolbar',
		title : 'Results',
		items : [{
			text    : 'Back',
			handler : function (e) {
				Ex.flurrying = false;
				Ex.resetActiveWeapon('chooseFlurryWeapon');
				
				Ex.pageToggle('flurryResultsPanel', 'pcPanel');
				Ext.getCmp('flurryResultsPanel').update('');
				Ext.getCmp('flurryResultsPanel').doLayout();
			}
		}]
	}, {
		dock  : 'top',
		xtype : 'toolbar',
		ui    : 'light',
		items : new Ext.SegmentedButton({
			id    : 'flurryResultsList',
			items : []
		})
	}, {
		dock  : 'top',
		xtype : 'toolbar',
		ui    : 'dark',
		layout : {},
		items : [
			new Ext.SegmentedButton({
				id    : 'flurryResultsTypes',
				items : [{
					text    : 'All',
					id      : 'flurryResultsTypesAll',
					handler : function (e) {
						Ex.pcResultsToggle('all', 'flurryResultsPanel');
					}
				}, {
					text    : 'Accuracy',
					handler : function (e) {
						Ex.pcResultsToggle('accList', 'flurryResultsPanel');
					}
				}, {
					text    : 'Damage',
					handler : function (e) {
						Ex.pcResultsToggle('damageList', 'flurryResultsPanel');
					}
				}]
			})
		]
	}, {
		dock  : 'top',
		xtype : 'toolbar',
		ui    : 'light',
		layout : {},
		items : [
			new Ext.SegmentedButton({
				id    : 'flurryResultsStunt',
				items : [{
					text    : '0 die',
					id      : 'flurryStunt-0',
					handler : function (e) {
						var index = Ext.getCmp('flurryResultsList').getPressed().callIndex;
						Ex.flurries[index].stunt = 0;
						Ex.stats.stunt = 0;
						Ex.pcResultsToggle('all', 'flurryResultsPanel');
					}
				}, {
					text    : '1 die',
					id      : 'flurryStunt-1',
					handler : function (e) {
						var index = Ext.getCmp('flurryResultsList').getPressed().callIndex;
						Ex.flurries[index].stunt = 1;
						Ex.stats.stunt = 1;
						Ex.pcResultsToggle('all', 'flurryResultsPanel');
					}
				}, {
					text    : '2 die',
					id      : 'flurryStunt-2',
					handler : function (e) {
						var index = Ext.getCmp('flurryResultsList').getPressed().callIndex;
						Ex.flurries[index].stunt = 2;
						Ex.stats.stunt = 2;
						Ex.pcResultsToggle('all', 'flurryResultsPanel');
					}
				}, {
					text    : '3 die',
					id      : 'flurryStunt-3',
					handler : function (e) {
						var index = Ext.getCmp('flurryResultsList').getPressed().callIndex;
						Ex.flurries[index].stunt = 3;
						Ex.stats.stunt = 3;
						Ex.pcResultsToggle('all', 'flurryResultsPanel');
					}
				}]
			})
		]
	}]
});
