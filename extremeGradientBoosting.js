/**
  * This file is protected by copyright (c) 2023-2025 by BlueSky Statistics, LLC.
  * All rights reserved. The copy, modification, or distribution of this file is not
  * allowed without the prior written permission from BlueSky Statistics, LLC.
 */




class extremeGradientBoosting extends baseModal {
    static dialogId = 'extremeGradientBoosting'
    static t = baseModal.makeT(extremeGradientBoosting.dialogId)

    constructor() {
        var config = {
            id: extremeGradientBoosting.dialogId,
            label: extremeGradientBoosting.t('title'),
            modalType: "two",
            RCode: `
require(xgboost);
require(ggplot2);
#Setting a seed
set.seed({{selected.seed | safe}})
#Creating the model
{{selected.model | safe}} <- xgboost::xgboost(data = as.matrix({{dataset.name}}[,c({{selected.independentvars | safe}})]), label = {{dataset.name}}\${{selected.dependentvar | safe}},  params = list(booster = "gbtree", objective = "{{selected.objective | safe}}", eta={{selected.eta | safe}}, gamma={{selected.gamma | safe}}, max_depth={{selected.maxdepth | safe}}, max_delta_step ={{selected.maxdeltastep | safe}}, min_child_weight={{selected.minchildweight | safe}}), nrounds={{selected.nrounds | safe}}, base_score={{selected.basescore | safe}}, verbose ={{selected.Verbose | safe}}, {{if (options.selected.numclasses !== "")}}  num_class= {{selected.numclasses | safe}}, {{/if}} print_every_n = {{selected.printevery | safe}})
#Variable importance
BSkyImpMatrix <- xgboost::xgb.importance (feature_names =c({{selected.independentvars | safe}}) ,model = {{selected.model | safe}})
#Graph the importance
print(xgb.ggplot.importance(importance_matrix = BSkyImpMatrix ) +ggtitle("Feature Importance Bar Plot") +labs(y="Importance(Gain)"))
#Importance in tabular format
BSkyFormat(as.data.frame(BSkyImpMatrix ),singleTableOutputHeader = "Feature Importance")
#Setting attributes to support scoring
attr(.GlobalEnv\${{selected.model | safe}},"depvar")="'{{selected.dependentvar | safe}}'"
attr(.GlobalEnv\${{selected.model | safe}},"indepvar")="c({{selected.independentvars | safe}})"
attr(.GlobalEnv\${{selected.model | safe}},"classDepVar")= class({{dataset.name}}[, c("{{selected.dependentvar | safe}}")])
attr(.GlobalEnv\${{selected.model | safe}},"depVarSample")= sample({{dataset.name}}[, c("{{selected.dependentvar | safe}}")], size = 2, replace = TRUE)
#Plot the tree
#xgboost::xgb.plot.tree(model={{selected.model | safe}})
rm(BSkyImpMatrix)
`
        };
        var objects = {
            label1: { el: new labelVar(config, { label: extremeGradientBoosting.t('label1'), h: 6 }) },
            content_var: { el: new srcVariableList(config, {action: "move"}) },
            model: {
                el: new input(config, {
                    no: 'model',
                    label: extremeGradientBoosting.t('model'),
                    placeholder: "",
                    required: true,
                    type: "character",
                    extraction: "TextAsIs",
                    value: "xgboostModel",
                    overwrite: "dataset"
                })
            },
            dependentvar: {
                el: new dstVariable(config, {
                    label: extremeGradientBoosting.t('dependentvar'),
                    no: "dependentvar",
                    filter: "Numeric|Scale",
                    extraction: "NoPrefix|UseComma",
                    // required:true,
                }), r: ['{{ var | safe}}']
            },
            independentvars: {
                el: new dstVariableList(config, {
                    label: extremeGradientBoosting.t('independentvars'),
                    no: "independentvars",
                    //required:true,
                    filter: "String|Numeric|Logical|Ordinal|Nominal|Scale",
                    extraction: "NoPrefix|UseComma|Enclosed",
                }), r: ['{{ var | safe}}']
            },
            seed: {
                el: new inputSpinner(config, {
                    no: "seed",
                    label: extremeGradientBoosting.t('seed'),
                    min: 0,
                    max: 999999999,
                    step: 1,
                    value: 12345,
                    extraction: "NoPrefix|UseComma"
                })
            },
            nrounds: {
                el: new inputSpinner(config, {
                    no: "nrounds",
                    label: extremeGradientBoosting.t('nrounds'),
                    min: 0,
                    max: 10,
                    step: 1,
                    value: 5,
                    extraction: "NoPrefix|UseComma"
                })
            },
            maxdepth: {
                el: new advancedSlider(config, {
                    no: "maxdepth",
                    label: extremeGradientBoosting.t('maxdepth'),
                    min: 0,
                    max: 10,
                    step: 1,
                    value: 6,
                    extraction: "NoPrefix|UseComma"
                })
            },
            minchildweight: {
                el: new advancedSlider(config, {
                    no: "minchildweight",
                    label: extremeGradientBoosting.t('minchildweight'),
                    min: 0,
                    max: 10,
                    step: 1,
                    value: 1,
                    extraction: "NoPrefix|UseComma"
                })
            },
            maxdeltastep: {
                el: new advancedSlider(config, {
                    no: "maxdeltastep",
                    label: extremeGradientBoosting.t('maxdeltastep'),
                    min: 0,
                    max: 10,
                    step: 1,
                    value: 1,
                    extraction: "NoPrefix|UseComma"
                })
            },
            eta: {
                el: new advancedSlider(config, {
                    no: "eta",
                    label: extremeGradientBoosting.t('eta'),
                    min: 0,
                    max: 1,
                    step: 0.1,
                    value: 0.3,
                    extraction: "NoPrefix|UseComma"
                })
            },
            gamma: {
                el: new advancedSlider(config, {
                    no: "gamma",
                    label: extremeGradientBoosting.t('gamma'),
                    min: 0,
                    max: 1,
                    step: 0.1,
                    value: 0,
                    extraction: "NoPrefix|UseComma"
                })
            },
            objective: {
                el: new comboBox(config, {
                    no: 'objective',
                    label: extremeGradientBoosting.t('objective'),
                    multiple: false,
                    extraction: "NoPrefix|UseComma",
                    options: ["reg:squarederror", "reg:logistic", "binary:logistic", "binary:logitraw", "multi:softmax", "multi:softprob", "rank:pairwise"],
                    default: "reg:logistic"
                })
            },
            numclasses: {
                el: new inputSpinner(config, {
                    no: 'numclasses',
                    label: extremeGradientBoosting.t('numclasses'),
                    min: 0,
                    max: 9999999,
                    step: 1,
                    extraction: "NoPrefix|UseComma"
                })
            },
            basescore: {
                el: new inputSpinner(config, {
                    no: "basescore",
                    label: extremeGradientBoosting.t('basescore'),
                    min: 0,
                    max: 100,
                    step: 0.1,
                    value: 0.5,
                    extraction: "NoPrefix|UseComma"
                })
            },
            Verbose: {
                el: new comboBox(config, {
                    no: 'Verbose',
                    label: extremeGradientBoosting.t('Verbose'),
                    multiple: false,
                    extraction: "NoPrefix|UseComma",
                    options: ["0", "1", "2"],
                    default: "0"
                })
            },
            printevery: {
                el: new comboBox(config, {
                    no: 'printevery',
                    label: extremeGradientBoosting.t('printevery'),
                    multiple: false,
                    extraction: "NoPrefix|UseComma",
                    options: ["0", "1", "2"],
                    default: "0"
                })
            },
        };
        var taskParameters = {
            el: new optionsVar(config, {
                no: "taskParameters",
                name: extremeGradientBoosting.t('OptvarTaskparam'),
                content: [
                    objects.objective.el,
                    objects.numclasses.el,
                    objects.basescore.el,
                ]
            })
        };
        var advanced = {
            el: new optionsVar(config, {
                no: "advanced",
                name: extremeGradientBoosting.t('OptvarAdvDiagnostics'),
                content: [
                    objects.Verbose.el,
                    objects.printevery.el,
                ]
            })
        };
        var paramsTreeBoosting = {
            el: new optionsVar(config, {
                no: "paramsTreeBoosting",
                name: extremeGradientBoosting.t('OptvarTreeBoostparam'),
                content: [
                    objects.maxdepth.el,
                    objects.minchildweight.el,
                    objects.maxdeltastep.el,
                    objects.eta.el,
                    objects.gamma.el,
                ]
            }
            )
        };
        const content = {
            head: [objects.label1.el.content],
            left: [objects.content_var.el.content],
            right: [objects.model.el.content, objects.dependentvar.el.content, objects.independentvars.el.content, objects.seed.el.content, objects.nrounds.el.content],
            bottom: [paramsTreeBoosting.el.content, taskParameters.el.content, advanced.el.content],
            nav: {
                name: extremeGradientBoosting.t('navigation'),
                icon: "icon-xgb",
                modal: config.id
            }
        };
        super(config, objects, content);
        
        this.help = {
            title: extremeGradientBoosting.t('help.title'),
            r_help: extremeGradientBoosting.t('help.r_help'),  //r_help: "help(data,package='utils')",
            body: extremeGradientBoosting.t('help.body')
        }
;
    }
}

module.exports = {
    render: () => new extremeGradientBoosting().render()
}
