/**
  * This file is protected by copyright (c) 2023-2025 by BlueSky Statistics, LLC.
  * All rights reserved. The copy, modification, or distribution of this file is not
  * allowed without the prior written permission from BlueSky Statistics, LLC.
 */




class saveAModel extends baseModal {
    static dialogId = 'saveAModel'
    static t = baseModal.makeT(saveAModel.dialogId)

    constructor() {
        var config = {
            id: saveAModel.dialogId,
            label: saveAModel.t('title'),
            modalType: "one",
            RCode: `
local ({
#Saving the model names to a list so we can save attributes
BSkySavedModels = list({{selected.modelSelection | safe}})
lapply(BSkySavedModels, data.table::setattr, name ="BSkyModel", value=TRUE)
base::save({{selected.modelSelection | safe}}, file = "{{selected.importResp | safe}}")
})
`,
            pre_start_r: JSON.stringify({
                modelSelection: "BSkyGetAvailableModels(objclasslist ='All_Models')",
            })
        }
        var objects = {
            label1: { el: new labelVar(config, { label: saveAModel.t('label1'), no: "label1", h: 8, style: "mt-3" }) },
            filterModels: {
                el: new selectVar(config, {
                    no: 'filterModels',
                    label: saveAModel.t('filterModels'),
                    multiple: false,
                    extraction: "NoPrefix|UseComma",
                    options: ["adaboost", "All_Models", "BinaryTree", "blasso", "C5.0", "earth", "gbm", "glm", "glmnet", "knn3", "ksvm", "lm", "lmerModLmerTest", "lognet", "mlp", "multinom", "NaiveBayes", "nn", "nnet", "polr", "randomForest", "RandomForest", "ranger", "real_adaboost", "rlm", "rpart", "rq", "rsnns", "train", "xgb.Booster"],
                    default: "All_Models",
                    onselect_r: { modelSelection: "BSkyGetAvailableModels( objclasslist = c('{{value}}'))" }
                })
            },
            modelSelection: {
                el: new comboBox(config, {
                    no: 'modelSelection',
                    label: saveAModel.t('modelSelection'),
                    multiple: true,
                    extraction: "NoPrefix|UseComma",
                    options: [],
                    multiple:true,
                    default: "",
                    required: true,
                })
            },

            importResp: {
                el: new fileSaveControl(config, 
                    {
                        no: "importResp", 
                        label: saveAModel.t('importResp'),
                        extraction: "TextAsIs",
                        required: "true"
                    })},

            
        }
        const content = {
            items: [objects.label1.el.content, objects.importResp.el.content, objects.filterModels.el.content, objects.modelSelection.el.content ],
            nav: {
                name: saveAModel.t('navigation'),
                icon: "fas fa-save",
                onclick: `r_before_modal('${config.id}')`,
                modal_id: config.id,
                datasetRequired: false,
            }
        }
        super(config, objects, content);
        
        this.help = {
            title: saveAModel.t('help.title'),
            r_help: saveAModel.t('help.r_help'),  //r_help: "help(data,package='utils')",
            body: saveAModel.t('help.body')
        }
;
    }
     prepareExecution(instance) {
        var res = [];
        let messageString  =""
        var code_vars = {
            dataset: {
                name: getActiveDataset()
            },
            selected: instance.dialog.extractData()
        }
        /* This code is valuable for reuse*/
        /*   let results = hasWritePermission(code_vars.selected.importResp)
        if (!results) {
            const cmd = instance.dialog.renderR(code_vars);
            messageString = "You need write access to the path " + code_vars.selected.importResp +" to be able to save the mode. Please choose a folder you have write permissions to";
            dialog.showMessageBoxSync({ type: "error", buttons: ["Ok", "Cancel"], title: "Write Permission Error", message: messageString  })
            return res;
        }
       
        let fullPath = code_vars.selected.importResp +"/"+ code_vars.selected.modelSelection + ".RData";
        if (fs.existsSync(fullPath)) {
            messageString = "A file with the same name already exists, do you want to overwrite?"
            let response = dialog.showMessageBoxSync({ type: "error", buttons: ["Ok", "Cancel"], title: "File exists", message: messageString  })
            if (response ==2) return res
          } */
        const cmd = instance.dialog.renderR(code_vars);
        res.push({ cmd: cmd, cgid: newCommandGroup(`${instance.config.id}`, `${instance.config.label}`), oriR: instance.config.RCode, code_vars: code_vars })
        return res;
    } 
}

module.exports = {
    render: () => new saveAModel().render()
}
