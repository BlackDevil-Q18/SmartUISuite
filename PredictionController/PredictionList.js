define('PredictionList',[],function(){

	'use strict';


var dataStorage =  localStorage;
var ListPredictionMEM = null;

var predictionSort = function(a,b){
	return b.p-a.p;
}

var updateStorage = function(_ListName,baseRecords){
	var status = false;
	try{
		if(dataStorage){
			ListPredictionMEM[_ListName]=baseRecords;
			dataStorage.ListPredictionMEM = JSON.stringify(ListPredictionMEM);
			status = true;
		}

	} catch (err){
		//do nothing
	}

	return status;
}

var fetchFromStorage = function(_ListName){
	var baseRecords = [];
	if(dataStorage){
			if(ListPredictionMEM===null){
				if(dataStorage.ListPredictionMEM){
					ListPredictionMEM = JSON.parse(dataStorage.ListPredictionMEM)
				}else{
					dataStorage.ListPredictionMEM = "{}";
					ListPredictionMEM = {};
				}
			}
		if(ListPredictionMEM[_ListName]){
			return ListPredictionMEM[_ListName];
		}
	}
	return baseRecords;
}


var ListPrediction = function(_ListName){
		var _ListName = _ListName;
		var learningActive = true;
		var predictionActive = true;
		
	return {

		ItemOrderPrediction : function(ItemList){
								var resultOrderList =[];
								if(_ListName){
									var baseRecords = fetchFromStorage(_ListName);
									baseRecords.sort(predictionSort);
									if(ItemList && Array.isArray(ItemList)===true){
										var noRecordsItems = [];
										ItemList.forEach(function(_item){
											var tempItemHolder = null;
											for(var recItr=0;recItr<baseRecords.length;recItr++){
												var _record = baseRecords[recItr];
												if(_item.dataset.inteluid){
													if(_item.dataset.inteluid===_record.id){
														tempItemHolder = _item;
														_record.item = _item;
														break;
													}
												}else{
													if(_item.id===_record.id){
														tempItemHolder = _item;
														_record.item = _item;
														break;
													}
												}
											}
											if(tempItemHolder===null){
												noRecordsItems.push(_item);
											}
										});
										resultOrderList = baseRecords.map(function(_base){
											if(_base.item!==undefined){
												var itemLink = _base.item;
												delete _base.item;
												return itemLink;

											}
										})
										resultOrderList = resultOrderList.concat(noRecordsItems);
									}else{
										resultOrderList = baseRecords.map(function(_record){
															return _record.id;
										});
									}
								}
								return resultOrderList;

								},
		ItemOrderUpdate : function(_item){
								if(_ListName){
									var baseRecords = fetchFromStorage(_ListName);
									var updateFlag = false;
									var _ItemUID=_item;
									if(typeof _item!=="string"){
										_ItemUID = _item.dataset.inteluid;
									}
									for(var itr=0;itr<baseRecords.length;itr++){
										if(baseRecords[itr].id===_ItemUID){
											baseRecords[itr].p = baseRecords[itr].p + 1;
											updateFlag = true;
											break;
										}
									}
									if(updateFlag===true){
										return updateStorage(_ListName,baseRecords);
									}else{
										baseRecords.push({
											id:_ItemUID,
											p:1
										});
										return updateStorage(_ListName,baseRecords);
									}
								}
								
							}
	}
}

return ListPrediction;
});
