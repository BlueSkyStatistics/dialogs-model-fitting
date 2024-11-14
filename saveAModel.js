
var localization = {
    en: {
        title: "Save Models to a file",
        navigation: "Save Models",
        filterModels: "Filter models by class",
        modelSelection: "Select a model(s) to save",
        importResp: "Select a file to save a model to",
        label1: "NOTE: The model will be saved to a file in the path selected below ONLY when you execute the dialog.",
        levelOfInterest: "When the variable to predict has 2 levels, specify the level of interest. The confusion matrix and related statistics are displayed with the specified level of interest as the reference",
        label12: "Test results: As soon as a model is selected, we will run tests to see whether dependent variables specified in the model are \navailable in the dataset to be scored. The results will be displayed here",
        label2: "Save predicted values and supporting statistics.",
        label3: "Predictions and predicted probabilities where applicable are stored in the dataset being scored as new variables with prefix below",
        label4: "**For dependent variables with 2 levels, the 2nd level is treated as the positive level. See Data > Factor Levels > Reorder Levels Manually to change the order of factor levels and rebuild the model.",
        conflevel: "Save confidence intervals for individual predicted values  **(Valid only for linear models (class lm))",
        roctable: "Show ROC table (**For binary dependent variables only)",
        colname: "Specify column name prefix",
        label5: "**Checking the checkbox above will incur a performance penalty for large datasets.",
        level: "Specify the confidence level",
        confusioncheck: "Generate Confusion Matrix",
        help: {
            title: "Save Models",
            r_help: "help(save, package='base')",
            body: `
    <b>Description</b></br>
    Models selected will be saved to a file in the R data format (.RData extension)</br>
    You can specify a new file by entering a name or selecting an existing file</br>
    If you select an existing file, it will be overwritten.</br>
    You have to click the execute button (the horizontal triangle button) to run the dialog and save the objects to a file. 
    <br/>
    <b>Usage</b>
    <br/>
    <code> 
    save(model1, model2.., file ="path of the file")
    </code> <br/>
    <b>Arguments</b><br/>
    <ul>
    <li>
    model1, model2...: fitted model objects
    </li>
    <li>
    file:file name with path, the model objects selected will be saved to this RData file
    </li>
    </ul>
    <b>Package</b></br>
    base</br>
    <b>Help</b></br>
    For detailed help click on the R icon on the top right hand side of this dialog overlay or run the following command help(save, package = 'base') in the R editor window
    </br>
    `}
    }
}

class saveAModel extends baseModal {
    constructor() {
        var config = {
            id: "saveAModel",
            label: localization.en.title,
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
            label1: { el: new labelVar(config, { label: localization.en.label1, no: "label1", h: 8, style: "mt-3" }) },
            filterModels: {
                el: new selectVar(config, {
                    no: 'filterModels',
                    label: localization.en.filterModels,
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
                    label: localization.en.modelSelection,
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
                        label: localization.en.importResp,
                        extraction: "TextAsIs",
                        required: "true"
                    })},

            
        }
        const content = {
            items: [objects.label1.el.content, objects.importResp.el.content, objects.filterModels.el.content, objects.modelSelection.el.content ],
            nav: {
                name: localization.en.navigation,
                icon: "fas fa-save",
                onclick: `r_before_modal("${config.id}")`,
                modal_id: config.id,
                datasetRequired: false,
            }
        }
        super(config, objects, content);
        this.help = localization.en.help;
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
module.exports.item = new saveAModel().render()