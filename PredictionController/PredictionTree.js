define('PredictionTree',['PredictionModel'],function(PredictionModel){
	'use strict';

var localFormCache = undefined;

if(localStorage!==undefined){
	if(localStorage.predictionStorage===undefined){	
		localStorage.predictionStorage=JSON.stringify({});
		localFormCache = {};
	}else{
		localFormCache = JSON.parse(localStorage.predictionStorage);
	}
}
//var localFormCache = localStorage?localStorage.predictionStorage:undefined;



	function filter(baseKeyArray,_treeStructure){
			
		//expecting that baseKeyArray is in reverse order
			var filteredTreeStructureArray = {};
			if(baseKeyArray.length===0){
				return _treeStructure;
			}
			var _compareKeyvalue = baseKeyArray.pop();
			if(_treeStructure[_compareKeyvalue]!==undefined){
				return filter(baseKeyArray,_treeStructure[_compareKeyvalue][1]);
			}else{
				var tempNewTreeStructure = {}
				var allKeys = Object.keys(_treeStructure);
				allKeys.forEach(function(key){
					var _nextLevelChildren = Object.keys(_treeStructure[key][1]?_treeStructure[key][1]:{});
					var _childContainer	   = _treeStructure[key][1];
					_nextLevelChildren.forEach(function(_childKey){
						if(tempNewTreeStructure[_childKey]!==undefined){
							dynamicAppendToTree(tempNewTreeStructure,_childKey,_childContainer);
						}else{
							tempNewTreeStructure[_childKey] = _childContainer[_childKey];
						}
					});
				});

				return filter(baseKeyArray,tempNewTreeStructure);
			}
	}	


function dynamicAppendToTree(tempNewTreeStructure,_childkey,_childContainer){
	if(tempNewTreeStructure[_childkey]!==undefined){
		tempNewTreeStructure[_childkey][0] = tempNewTreeStructure[_childkey][0] + _childContainer[_childkey][0];
		var tempChildKeys = Object.keys(_childContainer[_childkey][1]);
		var treeStructureChildContainer = tempNewTreeStructure[_childkey][1];
		var mergeStructureChildContainer = _childContainer[_childkey][1]
		if(tempChildKeys.length===0){
			return ;
		}else{
			tempChildKeys.forEach(function(_key){
				if(treeStructureChildContainer[_key]!==undefined){
					dynamicAppendToTree(treeStructureChildContainer,_key,mergeStructureChildContainer);
				}else{
					treeStructureChildContainer[_key] = mergeStructureChildContainer[_key];
				}
			})
			//return tempNewTreeStructure;
		}
		
	}
}


	var predictionTree = function(formName){

						var enableLearning = true;
						var enablePrediction = true;

						var _treeModel = [];

						/*var _treeStructure = {Software:[4,
														  {Enovia:[3,
														  			{FaBs:[2,
														  					{
																			'Java and JS':[4,{}]
																		  	}
																		  ],
																	BPS:[1,
																			{
																			'Java and BPS JS':[1,{}]
																			}
																		]
																	}
																   ],																
															'3DExcite':[2,
														  			{'3DX':[1,
														  					{
																			'JS and C++':[1,{}]
																		  	}
																		  ],
																	 'BPS':[1,
														  					{
																			'JS and C++':[1,{}]
																		  	}
																		  ], 
																	}
																   ],
															'Delmia':[5,
														  			{'Del1':[3,
														  					{
																			'JS and C++':[3,{}]
																		  	}
																		  ],
																	 'BPS':[2,
														  					{
																			'JS and C++':[2,{}]
																		  	}
																		  ], 
																	}
																   ]   																
															}
														],
											'Team Lead':[1,
														  {Enovia:[1,
														  			{FaBs:[1,
														  					{
																			'Java':[1,{}]
																		  	}
																		  ]																
																	 }
																   ]																
															}
														]												
											  };
*/

							var _treeStructure = {

												 };


							if(localFormCache!==undefined){
								if(localFormCache[formName]!==undefined){
									var formPredictionCache = JSON.parse(localFormCache[formName]);
									_treeModel = formPredictionCache['_treeModel']!==undefined?formPredictionCache['_treeModel']:[];
									_treeStructure = formPredictionCache['_treeStructure']!==undefined?formPredictionCache['_treeStructure']:{};
									enableLearning = formPredictionCache['enableLearning']!==undefined?formPredictionCache['enableLearning']:true;
									enablePrediction = formPredictionCache['enablePrediction']!==undefined?formPredictionCache['enablePrediction']:true;
								}
							}		

						return 	{
									enableLearning:function(){
											enableLearning = true;
											this.storePredictionData();
									},
									disableLearning:function(){
											enableLearning = false;
											this.storePredictionData();
									},	
									toggleLearning:function(state){
										if(state!==undefined && typeof state === 'boolean'){
											enableLearning = state;
										}else{
											enableLearning = !enableLearning;
										}

										this.storePredictionData();
											console.log("Form Learning is NOW..: "+enableLearning);
									},
									isLearningEnabled:function(){
										return enableLearning;
									},
									enablePrediction:function(){
											enableLearning = true;
											this.storePredictionData();
									},
									disablePrediction:function(){
											enableLearning = false;
											this.storePredictionData();
									},	
									togglePrediction:function(state){
										if(state!==undefined && typeof state === 'boolean'){
											enablePrediction = state;
										}else{
											enablePrediction = !enablePrediction;
										}
										this.storePredictionData();
											console.log("Form Prediction is NOW..: "+enablePrediction);
									},
									isPredictionEnabled:function(){
										return enablePrediction;
									},
									resetPredictionData:function(){
										_treeStructure = {};
										_treeModel = [];									
										this.storePredictionData();
									},
									convertToString: function(){
										var formPredictionData = {
																	'_treeModel' : _treeModel,
																	'_treeStructure' : _treeStructure,
																	'enableLearning' : enableLearning,
																	'enablePrediction': enablePrediction
																	}
										return JSON.stringify(formPredictionData);
									},
									convertToJSON: function(){
										return JSON.parse(_treeStructure);
									},
									setTreeStructure:function(treeStr){
										if(typeof treeStr==="object"){
											_treeStructure = treeStr;
										}else if(typeof treeStr==="string"){
											_treeStructure = this.convertToJSON(treeStr);
										}
									},
									learn:function(formContainer){

										if(enableLearning===false){
											console.log("Learing is disabled for this form");
											return false;
										}

										var inputFieldsList = $(formContainer).find('input');
										var record = {};

										if(_treeModel.length===0){
											var _semantics = {};											
											inputFieldsList.toArray().filter(function(field){
																return 'true'===field.dataset.intel;
															}).forEach(function(field){
																	_semantics[field.id] = parseInt(field.dataset.w);
																	record[field.id]=field.value;
															});
											 var model = PredictionModel.setupModel(_semantics);
											this.setModel(model);
										}else{
											inputFieldsList.toArray().filter(function(field){
																return 'true'===field.dataset.intel;
															}).forEach(function(field){
																	record[field.id]=field.value;
															});
										}
										return this.addRecord(record);
									},
									printTreeStructure:function(){
										console.log(_treeStructure);

									},
									setModel:function(model){
										_treeModel = model?model:[];
									},
									storePredictionData:function(){
										if(localFormCache!==undefined){
											localFormCache[formName] = this.convertToString();
											localStorage.predictionStorage = JSON.stringify(localFormCache);
										}else{
											console.log("No local storage to store this Data");
										}
									},
									addRecord:function(record){
										//var modelSchemaKeys = Object.keys(_treeModel);
										if(enableLearning===false){
											console.log("Learing is disabled for this form");
											return false;
										}

										if(!PredictionModel.validateAgainstModel(_treeModel,record)){
											console.log(" Record failed to validate against Model");
											return false;
										}

										var newTreeStructure = {};
										var tempNewTreeStructure = newTreeStructure;
										var firstRecordKey = null;
										_treeModel.forEach(function(fieldIdKey){
											var value = record[fieldIdKey.id];
											if(null===firstRecordKey){
												firstRecordKey = value;
											}
											if(value!==undefined){
												tempNewTreeStructure[value] = [1,{}];
												tempNewTreeStructure = tempNewTreeStructure[value][1];
											}else{
												tempNewTreeStructure[' '] = [1,{}];
												tempNewTreeStructure = tempNewTreeStructure[' '][1];
											}
											
										});

										if(_treeStructure[firstRecordKey]!==undefined){
											dynamicAppendToTree(_treeStructure,firstRecordKey,newTreeStructure);
										}else{
											_treeStructure[firstRecordKey] = newTreeStructure[firstRecordKey];
										}

										this.storePredictionData();

										return true;
										
									},
									getFilterTreeStructure: function(baseKeyArray,contextTreeStructure){
										var _TreeStructureClone = $.extend(true, {}, _treeStructure);
										var localTreeStructure = contextTreeStructure?contextTreeStructure:_TreeStructureClone;
										return filter(baseKeyArray.reverse(),localTreeStructure);
									}

								};


	};

	return predictionTree;

});
