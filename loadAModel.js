/**
  * This file is protected by copyright (c) 2023-2025 by BlueSky Statistics, LLC.
  * All rights reserved. The copy, modification, or distribution of this file is not
  * allowed without the prior written permission from BlueSky Statistics, LLC.
 */


var localization = {
    en: {
        title: "Load Models from a file",
        navigation: "Load Models",
        filterModels: "Filter models by class",
        modelSelection: "Select a model to save",
        importResp: "Select a file to load models from",
        label1: "All the models in the file specified will be loaded into memory. Note: If you have existing models with the same name, they will be overwritten.",
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
            title: "Load Models",
            r_help: "help(load, package='base')",
            body: `
<b>Description</b></br>
R Model objects saved to the file selected will be loaded.</br>
We will load ALL R objects saved to the selected file. If objects with the same name exist in the R global environment, they will be overwritten.</br>
We will display a message confirming the models built with the application that were loaded.</br>
You have to click the execute button (the horizontal triangle button) to load R objects saved to the selected file. 
<br/>
<b>Usage</b>
<br/>
<code> 
load(file ="path of the file")
</code> <br/>
<b>Arguments</b><br/>
<ul>
<li>
file:file name with path, the model objects selected will be saved to this RData file
</li>
</ul>
<b>Package</b></br>
base</br>
<b>Help</b></br>
For detailed help click on the R icon on the top right hand side of this dialog overlay or run the following command help(load, package = 'base') in the R editor window
</br>
                `}
    }
}

class loadAModel extends baseModal {
    constructor() {
        var config = {
            id: "loadAModel",
            label: localization.en.title,
            modalType: "one",
            RCode: `
base::load(file = "{{selected.importResp | safe}}")
local ({
    #list of all models
    allModels <- BSkyGetAvailableModels(objclasslist ='All_Models')
    #Filtering models loaded from file
    modelsFromFile <- base::Filter(function(x) !is.null(base::attr(eval(parse(text=x)), "BSkyModel")), allModels)
    cat(paste("The following model(s) (separated by comma):", paste(modelsFromFile , collapse =", "), "are loaded from the file\n"))
    #Removing the attribute BSkyModel, we have introduced a variable BSkyTemp to suppress unnecessary output
    BSkyTemp <- sapply(modelsFromFile, function(x) eval(parse (text = paste ("attr(.GlobalEnv$" , x, ", 'BSkyModel') <- NULL" ))))
})
`
        }
        var objects = {
            label1: { el: new labelVar(config, { label: localization.en.label1, no: "label1", h: 8, style: "mt-3" }) },
            
            importResp: {
                el: new fileOpenControl(config, 
                    {
                        no: "importResp", 
                        label: localization.en.importResp,
                        extraction: "TextAsIs"
                    })}
            
        }
        const content = {
            items: [objects.label1.el.content, objects.importResp.el.content ],
            nav: {
                name: localization.en.navigation,
                icon: "icon-package_install",
                modal: config.id,
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
module.exports.item = new loadAModel().render()