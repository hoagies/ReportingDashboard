Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
    launch: function() {

		this.add({
			xtype: 'rallycombobox',
			id: 'comboInitiative',
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
            title: 'Blockers - User Stories',
            width: 1000,
            height: 300,
            overflowY: 'auto',
            bodyPadding: 10
        });
        this.add(panelBlockers);

    },
    
    _onLoad: function(a) {
    	
    	// ***************************************
    	// Load Initiative Description Panel
    	// ***************************************
        var combo = this.down('rallycombobox');
        var initiativeDesc = combo.getRecord().get("Description");

		var that = this;
		var panelDesc = that.down('#panelDesc');
		panelDesc.removeAll();

		panelDesc.add({
		  xtype: 'box',
		  autoEl: {cn: initiativeDesc}
		});
        
        // ***************************************
    	// Load Blockers Panel
    	// ***************************************
  //      if (this.down('#panelBlockers')) {
		// 	this.down('#panelBlockers').destroy();
		// }
		var panelBlockers = that.down('#panelBlockers');
		panelBlockers.removeAll();

		panelBlockers.add({
		// this.add({
			xtype: 'rallygrid',
			header: false,
			width: '95%',
			columnCfgs: [
				{
					text: 'ID', dataIndex: 'FormattedID', flex: 10
				},
				{
					text: 'Name', dataIndex: 'Name', flex: 30
				},
				{
					text: 'Blocked', dataIndex: 'Blocked', flex: 30
				},
				{
					text: 'Blocked Reason', dataIndex: 'BlockedReason', flex: 30
				}
			],
			enableEditing: false,
			showRowActionsColumn: false,
			showPagingToolbar: false,
			storeConfig: {
				model: 'userstory',
				pageSize: 200,
				filters: [that._getFilterGrid()]
			}
			// ******************************
			// For Tooltip
			// ******************************
			// listeners: {
			// 	itemclick: function(g, record, item) {
			// 		tooltipvalue = record.get('FormattedID') + ' - ' + record.get('Name');
			// 		Ext.create('Rally.ui.tooltip.ToolTip', {
			// 			target : item,
			// 			destroyAfterHide: true,
			// 			// hideDelay: 0,
			// 			html: '<p><strong>' + tooltipvalue + '</strong></p>'
			// 		}).showNow();
			// 	}
			// 	// select: this._getRecordOnSelectedRow,
			// 	// load : function(g, record, index, options){
			// 		// this._getRecordOnSelectedRow(g, record, 0, options);
			// 	// },
			// 	// scope: this
			// }
			
		});
        
    },
    
    // _getFilterGrid: function(record,id) {
    _getFilterGrid: function() {
		var filters = Ext.create('Rally.data.QueryFilter', {
			property: 'Blocked',
			operator: '=',
			value: true
		});
		
		var comboInitiative = this.down('#comboInitiative');
		var initiativeID = comboInitiative.getRecord().get('FormattedID');
		filters = filters.and(Ext.create('Rally.data.QueryFilter', {
			property: 'Feature.Parent.Parent.FormattedID',
			operator: '=',
			value: initiativeID
		}));
		
		// filters = filters.and(Ext.create('Rally.data.QueryFilter', {
		// 	property: 'Project.Name',
		// 	operator: '=',
		// 	value: record
		// }));

		return filters;
	},
    
});
