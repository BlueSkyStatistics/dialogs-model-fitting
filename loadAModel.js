


class loadAModel extends baseModal {
    static dialogId = 'loadAModel'
    static t = baseModal.makeT(loadAModel.dialogId)

    constructor() {
        var config = {
            id: loadAModel.dialogId,
            label: loadAModel.t('title'),
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
            label1: { el: new labelVar(config, { label: loadAModel.t('label1'), no: "label1", h: 8, style: "mt-3" }) },
            
            importResp: {
                el: new fileOpenControl(config, 
                    {
                        no: "importResp", 
                        label: loadAModel.t('importResp'),
                        extraction: "TextAsIs"
                    })}
            
        }
        const content = {
            items: [objects.label1.el.content, objects.importResp.el.content ],
            nav: {
                name: loadAModel.t('navigation'),
                icon: "icon-package_install",
                modal: config.id,
                datasetRequired: false,
            }
        }
        super(config, objects, content);
        
        this.help = {
            title: loadAModel.t('help.title'),
            r_help: loadAModel.t('help.r_help'),  //r_help: "help(data,package='utils')",
            body: loadAModel.t('help.body')
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
    render: () => new loadAModel().render()
}
