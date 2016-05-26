Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
    launch: function() {

		this.add({
			xtype: 'rallycombobox',
			stateful: true,
			stateId: this.getContext().getScopedStateId('initiative'),
			width: 600,
			fieldLabel: 'Select Initiative:',
			// Display Template
			displayTpl: Ext.create('Ext.XTemplate','<tpl for=".">','{FormattedID} - {Name}','</tpl>'),
			// List Template
			tpl: Ext.create('Ext.XTemplate','<tpl for=".">','<div class="x-boundlist-item">{FormattedID} - {Name}</div>','</tpl>'),
			storeConfig: {
				autoLoad: true,
				model: 'PortfolioItem/Initiative',
				fetch: ['FormattedID','Name','Description'],
				sorters: [
					{
						property: 'ObjectID',
						direction: 'ASC'
					}
				],
				remoteGroup: false,
				remoteSort: false,
				remoteFilter: false,
				limit: Infinity,
				// context: {
				// 	project: project_oid,
				// 	projectScopeDown: true,
				// 	projectScopeUp: false
				// }
			},
			listeners: {
				// // select: this._onSelect,
				select: this._onLoad,
				ready: this._onLoad,
				scope: this
			}
		});
		
		var panelDesc = new Ext.Panel({
            id: 'panelDesc',
            title: 'Initiative Description',
            width: '100%',
            height: 300,
            overflowY: 'auto',
            bodyPadding: 10
        });
        this.add(panelDesc);
        
        var panelBlockers = new Ext.Panel({
            id: 'panelBlockers',
            title: 'Blockers',
            width: 1000,
            height: 300,
            overflowY: 'auto',
            bodyPadding: 10
        });
        this.add(panelBlockers);

    },
    
    _onLoad: function(a) {
        var combo = this.down('rallycombobox');
        var initiativeDesc = combo.getRecord().get("Description");

		var that = this;
		var panelDesc = that.down('#panelDesc');
		panelDesc.removeAll();

		panelDesc.add({
		  xtype: 'box',
		  autoEl: {id: 'myelement', cn: initiativeDesc}
		});
        
    }
    
});
