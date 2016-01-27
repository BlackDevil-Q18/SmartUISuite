define('PredictionModel',[],function(){
	'use strict';

	var perfectSetup = false;
	var PredictionModel = {
						PredictionModelVal : [],
						appendTimeParam:function(){
							//Not implemented yet!
						},
						getWeightage:function(_model,fieldId){	
							var w = null;						
							for(var i=0;i<_model.length;i++){
								if(_model[i].id===fieldId){
									w= _model[i].w;
								}
							}
							return w;
						},
						getIndex:function(_model,fieldId){
							var w = -1;
							for(var i=0;i<_model.length;i++){
								if(_model[i].id===fieldId){
									w= i;
								}
							}
							return w;
						},
						validateAgainstModel: function(_treeModel,record){
							//var treeModelkeys = Object.keys(_treeModel);
							var recordkeys 	  = Object.keys(record);
							if(perfectSetup===true && ((_treeModel.length===recordkeys.length) ||(_treeModel.length<recordkeys.length))){
								return false;
							}
							_treeModel.forEach(function(intelField){
								if(record[intelField.id]===undefined){
									return false;
								}
							});
							return true; 
						},
						covertToModelData:function(_semantics,record){
							var rec = [];
								for(var i=0;i<_semantics.length;i++){
									rec.push("");
								}
							record.forEach(function(fieldRec){
								for(var k=0;k<_semantics.length;k++){
									if(fieldRec.id === _semantics[k].id){
										rec[k]=fieldRec.value;
									}
								}
							});
							return rec;
						},
						setupModel:function(_semantics){
							var that = this;
							if(_semantics && typeof _semantics == 'object'){
								var keys = Object.keys(_semantics);
								keys.forEach(function(_semKey){
									that.PredictionModelVal.push({
										id : _semKey,
										w  : _semantics[_semKey]
									}) 
								});				
							}

						that.PredictionModelVal.sort(function(a,b){return a.w-b.w;});
						return that.PredictionModelVal;
						}

	};

	return PredictionModel;

});
