


class randomForest extends baseModal {
    static dialogId = 'randomForest'
    static t = baseModal.makeT(randomForest.dialogId)

    constructor() {
        var config = {
            id: randomForest.dialogId,
            label: randomForest.t('title'),
            modalType: "two",
            RCode: `
require(randomForest);
require(stringr)
{{selected.modelname | safe}} <-NULL
{{if ( options.selected.dependentvar !="")}}
{{selected.modelname | safe}}<-randomForest(x = {{dataset.name}}[,c({{selected.independentvars | safe}})], y={{selected.dependentvar | safe}}, ntree={{selected.ntree | safe}}, {{if (options.selected.mtry !== "")}}mtry = {{selected.mtry | safe}},{{/if}} proximity ={{selected.proximity | safe}}, importance =TRUE) 
{{#else}}
# Running random forest in unsupervised mode as a dependent variable is not specified
{{selected.modelname | safe}}<-randomForest(x = {{dataset.name}}[,c({{selected.independentvars | safe}})], ntree={{selected.ntree | safe}}, {{if (options.selected.mtry !== "")}} mtry = {{selected.mtry | safe}} , {{/if}} proximity ={{selected.proximity | safe}}, importance =TRUE) 
{{/if}}
#logic to show error msg if model is not generated because someone ran it on columns with NA
if( !exists('{{selected.modelname | safe}}' ) || is.null({{selected.modelname | safe}}) )
{
    cat('\\nError: Couldn\\'t generate model.')
} else
{
    bskyret <- BSkyPrintRandomForest({{selected.modelname | safe}})
    BSkyFormat(bskyret)
    BSkyFormat({{selected.modelname | safe}}$importance, singleTableOutputHeader = "Variable Importance Table")
    {{if (options.selected.proximity=="TRUE")}}
    #Saving proximity measures to the dataset 
    .GlobalEnv\${{selected.newds | safe}} <- as.data.frame( {{selected.modelname | safe}}$proximity )
    #Multi-dimensional Scaling Plot of Proximity matrix from randomForest
    {{if ( options.selected.dependentvar !="")}}results <- randomForest::MDSplot({{selected.modelname | safe}}, {{selected.dependentvar | safe}}, main="Multi-dimensional Scaling Plot of Proximity matrix"){{/if}}
    #Loading the newly created Proximity dataset in the grid
    BSkyLoadRefresh({{if (options.selected.newds !== "")}}"{{selected.newds | safe}}"{{/if}})
    {{/if}}
    {{if (options.selected.predictor=="TRUE")}}
    #Adding Predictor column to existing dataset
    {{dataset.name}}\${{selected.newcolname | safe}} <- {{selected.modelname | safe}}$predicted
    BSkyLoadRefresh("{{dataset.name}}")
    {{/if}}
    #Adding attributes to support scoring
    attr(.GlobalEnv\${{selected.modelname | safe}},"indepvar") ="{{selected.independentvars | safe}}"
    {{if ( options.selected.dependentvar !="")}}
    attr(.GlobalEnv\${{selected.modelname | safe}},"classDepVar") = class({{selected.dependentvar | safe}})
    attr(.GlobalEnv\${{selected.modelname | safe}},"depvar") = paste ("'", sub(".*\\\\$", "", '{{selected.dependentvar | safe}}'), "'", sep="")
    attr(.GlobalEnv\${{selected.modelname | safe}},"depVarSample") = sample({{selected.dependentvar | safe}}, size = 2, replace = TRUE)
    {{/if}}
    {{if ( options.selected.dependentvar =="" && options.selected.proximity =="TRUE")}}
    cat ("ERROR: A proximity matrix is not genenerated in unsupervised mode\n")
    {{/if}}
    {{if ( options.selected.dependentvar =="" && options.selected.predictor == "TRUE")}}
    cat ("ERROR: Predictions are not genenerated in unsupervised mode\n")
    {{/if}}
}
`
        };
        var objects = {
            content_var: { el: new srcVariableList(config, {action: "move"}) },
            label1: { el: new labelVar(config, { label: randomForest.t('label1'), h: 6 }) },
            modelname: {
                el: new input(config, {
                    no: 'modelname',
                    label: randomForest.t('modelname'),
                    placeholder: "",
                    required: true,
                    type: "character",
                    extraction: "TextAsIs",
                    value: "BSkyRandomForestModel1",
                    overwrite: "dataset"
                })
            },
            dependentvar: {
                el: new dstVariable(config, {
                    label: randomForest.t('dependentvar'),
                    no: "dependentvar",
                    filter: "String|Numeric|Logical|Ordinal|Nominal|Scale",
                    extraction: "Prefix|UseComma",
                }), r: ['{{ var | safe}}']
            },
            independentvars: {
                el: new dstVariableList(config, {
                    label: randomForest.t('independentvars'),
                    no: "independentvars",
                    required: true,
                    filter: "Numeric|Logical|Ordinal|Nominal|Scale",
                    extraction: "NoPrefix|UseComma|Enclosed",
                }), r: ['{{ var | safe}}']
            },
            ntree: {
                el: new inputSpinner(config, {
                    no: "ntree",
                    label: randomForest.t('ntree'),
                    min: 1,
                    max: 999999999,
                    step: 1,
                    value: 500,
                    extraction: "NoPrefix|UseComma"
                })
            },
            mtry: {
                el: new inputSpinner(config, {
                    no: "mtry",
                    label: randomForest.t('mtry'),
                    min: 0,
                    max: 999999999,
                    step: 1,
                    extraction: "NoPrefix|UseComma"
                })
            },
            proximity: {
                el: new checkbox(config, {
                    label: randomForest.t('proximity'),
                    no: "proximity",
                    required: true,
                    dependant_objects: ["newds"],
                })
            },
            newds: {
                el: new input(config, {
                    no: 'newds',
                    label: randomForest.t('newds'),
                    placeholder: "",
                    ml:2,
                    type: "character",
                    extraction: "TextAsIs",
                    value: ""
                })
            },
            predictor: {
                el: new checkbox(config, {
                    label: randomForest.t('predictor'),
                    no: "predictor",
                    style: "mt-2",
                    required: true,
                    dependant_objects: ["newcolname"],
                })
            },
            newcolname: {
                el: new input(config, {
                    no: 'newcolname',
                    style: "ml-2",
                    label: randomForest.t('newcolname'),
                    placeholder: "",
                    type: "character",
                    extraction: "TextAsIs",
                    value: ""
                })
            },
        };
        var options1 = {
            el: new optionsVar(config, {
                no: "options1",
                content: [
                    objects.proximity.el,
                    objects.newds.el,
                    objects.predictor.el,
                    objects.newcolname.el,
                ]
            }
            )
        }
        const content = {
            head: [objects.label1.el.content],
            left: [objects.content_var.el.content],
            right: [objects.modelname.el.content, objects.dependentvar.el.content, objects.independentvars.el.content, objects.ntree.el.content, objects.mtry.el.content],
            bottom: [options1.el.content],
            nav: {
                name: randomForest.t('navigation'),
                icon: "icon-random_forest",
                modal: config.id
            }
        };
        super(config, objects, content);
        
        this.help = {
            title: randomForest.t('help.title'),
            r_help: randomForest.t('help.r_help'),  //r_help: "help(data,package='utils')",
            body: randomForest.t('help.body')
        }
;
    }
}

module.exports = {
    render: () => new randomForest().render()
}
