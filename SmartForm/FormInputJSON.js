define('FormInputJSON',[],function(){

	'use strict';

	var formConfigCache = null;

	formConfigCache = {
						FormName:"CreateUser",
						Fields:[
								{
									name:"Obj_FirstName",
									label:"First Name",
									type:"textbox"
								},
								{
									name:"Obj_LastName",
									label:"Last Name",
									type:"textbox"
								},
								{
									name:"Obj_Age",
									label:"Age",
									type:"textbox"
								},
								{
									name:"Obj_Designation",
									label:"Designation",
									type:"textbox",
									intel:true,
									weightage:1
								},
								{
									name:"Obj_Company",
									label:"Brand",
									type:"textbox",
									intel:true,
									weightage:2
								},
								{
									name:"Obj_Team",
									label:"Team",
									type:"textbox",
									intel:true,
									weightage:3
								},
								{
									name:"Obj_ProfilDesc",
									label:"Profile Desciption",
									type:"textArea",
									intel:true,
									weightage:4
								},
								{
									name:"Obj_Extra",
									label:"Extra Details",
									type:"textbox"
								}]
						}


	var formJSON = {
		getForm: function(){
			return formConfigCache;
		},
		setForm: function(newFormConfig){
			if(newFormConfig){
				formConfigCache = newFormConfig;
			}
		}
	};

	return formJSON;
	
});
