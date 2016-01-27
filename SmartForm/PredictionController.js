define('PredictionController',['jq'],function(jq){
	'use strict';


function getAllIntelFields(htmlForm){
		var _intelFieldsArray = [];
		var inputFieldsList = htmlForm.find('input').toArray();					
		var _intelFieldsArray = inputFieldsList.filter(function(field){
				return field.dataset.intel==="true";
		});
		return _intelFieldsArray;
}

function getSeperatedRecords(_intelFieldsArray,currentField){
	var Records = {
					_baseRecords:[],
					_toBePredicted:[]
					};

					var currentFieldWeightage = parseInt(currentField.dataset.w);
	_intelFieldsArray.forEach(function(field){
		if(parseInt(field.dataset.w)<=currentFieldWeightage){
				Records._baseRecords.push(field.value);
		}else if(parseInt(field.dataset.w)>currentFieldWeightage){
				Records._toBePredicted.push(field);
		}
	});
	return Records;
}


function maxPresence(contextRecords){
	var maxvalue = "";
	var indexMnt = [];
	var keyArray = Object.keys(contextRecords);
	if(keyArray.length>0){
		var max = contextRecords[keyArray[0]];
		var maxKeyValue = keyArray[0];
		for(var i=1;i<keyArray.length;i++){
			if(contextRecords[keyArray[i]][0]>max[0]){
				max = contextRecords[keyArray[i]];
				maxKeyValue = keyArray[i];
			}
		}
		return maxKeyValue;
	}else{
		return ""; //null this value can be used to let the field be as it is i.e. default value
	}

}


	var PredictionController ={
								   processFormFields: function(htmlForm,currentField){
								   		var _intelFieldsArray = getAllIntelFields(htmlForm);
								   		//var currentFieldWeightage = parseInt(currentField.dataset.w);//PredictionModel.getWeightage(_model,currentField.id);
								   		return getSeperatedRecords(_intelFieldsArray,currentField);	
								   },
								   predictionProcess:function(treeStructure,Records,currentFieldValue){
										var contextRecords = treeStructure.getFilterTreeStructure(Records._baseRecords);
										var _toBePredicted = Records._toBePredicted;
										_toBePredicted.forEach(function(_field){
											var fieldvalue = maxPresence(contextRecords);
											_field.value = fieldvalue;
											contextRecords = treeStructure.getFilterTreeStructure([fieldvalue],contextRecords);
										});
										
								   },
								   Predict:function(htmlForm,currentField,treeStructure){
								   if(treeStructure.isPredictionEnabled()===true){
								   		var RecordsObj = this.processFormFields(htmlForm,currentField);
								   		//var _baseRecords = RecordsObj._baseRecords;
								   		//_baseRecords.push(currentField.value);
								   		//var contextRecords = treeStructure.getFilterTreeStructure(_baseRecords);
								   		this.predictionProcess(treeStructure,RecordsObj,currentField.value);
								   	}
								   }

							 }

	return PredictionController;

});
