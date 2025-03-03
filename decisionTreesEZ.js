/**
  * This file is protected by copyright (c) 2023-2025 by BlueSky Statistics, LLC.
  * All rights reserved. The copy, modification, or distribution of this file is not
  * allowed without the prior written permission from BlueSky Statistics, LLC.
 */




class decisionTreesEZ extends baseModal {
    static dialogId = 'decisionTreesEZ'
    static t = baseModal.makeT(decisionTreesEZ.dialogId)

    constructor() {
        var config = {
            id: decisionTreesEZ.dialogId,
            label: decisionTreesEZ.t('title'),
            modalType: "two",
            splitProcessing: true,
            RCode: `
require(rpart)
require(rpart.plot)
require(partykit)
#Generate a new tree model if the model does not exist of the user has chosen the option to generate a model
if(!{{selected.TreeGenChkbox | safe}} || !exists("{{selected.TxtTreeName | safe}}"))
{
    
    {{selected.TxtTreeName | safe}} = rpart({{selected.dependent | safe}}~{{selected.independent | safe}}{{if(options.selected.weights!="")}}, weights={{selected.weights |safe}} {{/if}}, data = {{dataset.name}}, control = rpart.control(minsplit={{selected.TxtMinSplit | safe}},{{ if (options.selected.minbucket=="")}}minbucket ={{selected.minBucket | safe}},{{/if}}maxdepth={{selected.maxDepth | safe}},cp ={{selected.TxtCP | safe}}))
}
#If the user selected the option to prune the tree, prune it
var ="{{selected.grp1 | safe}}"
if(var != "FALSE")
{
     if(var =='useOptimal')
     {
         bsky_tree = prune({{selected.TxtTreeName | safe}}, cp = {{selected.TxtTreeName | safe}}$cptable[which.min({{selected.TxtTreeName | safe}}$cptable[,"xerror"]),"CP"])
     } else 
     {
         # prune the tree with the complexity parameter (cp) that the user provided
         bsky_tree = prune({{selected.TxtTreeName | safe}}, cp = {{selected.TxtCPPrune | safe}})
     }
} else
{
    #Storing the model specified into bsky_tree for summaries below
    bsky_tree = {{selected.TxtTreeName | safe}}
}
if(var != "FALSE")
{
cat("Statistics for the pruned model are displayed")
}
BSkyFormat(bsky_tree$method, singleTableOutputHeader=c("Tree Type"))
BSkyFormat(as.data.frame(bsky_tree$control), singleTableOutputHeader=c("Control Parameters"))
BSkyFormat(as.data.frame(bsky_tree$cptable), singleTableOutputHeader=c("CP Table"))
BSkyFormat(as.data.frame(bsky_tree$variable.importance), singleTableOutputHeader=c("Variable Importance"))
if({{selected.PlotCVChkbox | safe}})  
{ 
    plotcp(bsky_tree, sub ="Plot of the Complexity Parameter table")  
}
if({{selected.PlotRSQRChkbox | safe}}) 
{ 
    #plot cp table
    rsq.rpart(bsky_tree) 
}
#appropriate for the "anova" method                     
BSkytmp = rpart.plot( {{selected.TxtTreeName | safe}}, type = 5, digits = -getOption("digits"), main="Decision Tree Diagram", roundint = FALSE) 
#Adding attributes to support scoring
#We don't add dependent and independent variables as this is handled by our functions
attr(.GlobalEnv\${{selected.TxtTreeName | safe}},"classDepVar")= class({{dataset.name}}[, c("{{selected.dependent | safe}}")])
attr(.GlobalEnv\${{selected.TxtTreeName | safe}},"depVarSample")= sample({{dataset.name}}[, c("{{selected.dependent | safe}}")], size = 2, replace = TRUE)
rm(bsky_tree)
#Useful commands
#plot(bsky_tree)
#Summarize the model
#summary(bsky_tree)
#Print the cp table
#printcp(bsky_tree)
`
        };
        var objects = {
            content_var: { el: new srcVariableList(config, {action: "move"}) },
            TxtTreeName: {
                el: new input(config, {
                    no: 'TxtTreeName',
                    label: decisionTreesEZ.t('TxtTreeName'),
                    placeholder: "",
                    extraction: "TextAsIs",
                    value: "treeModel1",
                    overwrite: "dataset"
                })
            },
            TreeGenChkbox: {
                el: new checkbox(config, {
                    label: decisionTreesEZ.t('TreeGenChkbox'), no: "TreeGenChkbox",
                    true_value: "TRUE",
                    style: "mt-2 mb-3",
                    false_value: "FALSE",
                    extraction: "Boolean"
                })
            },
            dependent: {
                el: new dstVariable(config, {
                    label: decisionTreesEZ.t('dependent'),
                    no: "dependent",
                    filter: "String|Numeric|Date|Logical|Ordinal|Nominal|Scale",
                    extraction: "NoPrefix|UseComma",
                    required: true,
                }), r: ['{{ var | safe}}']
            },
            weights: {
                el: new dstVariable(config, {
                    label: decisionTreesEZ.t('weights'),
                    no: "weights",
                    filter: "Numeric|Scale",
                    extraction: "NoPrefix|UseComma",
                    required: false,
                }), r: ['{{ var | safe}}']
            },
            independent: {
                el: new dstVariableList(config, {
                    label: decisionTreesEZ.t('independent'),
                    no: "independent",
                    required: true,
                    filter: "String|Numeric|Date|Logical|Ordinal|Nominal|Scale",
                    extraction: "NoPrefix|UsePlus",
                }), r: ['{{ var | safe}}']
            },
            TxtMinSplit: {
                el: new inputSpinner(config, {
                    no: 'TxtMinSplit',
                    label: decisionTreesEZ.t('TxtMinSplit'),
                    min: 0,
                    max: 9999999,
                    step: 1,
                    value: 20,
                    extraction: "NoPrefix|UseComma"
                })
            },
            minBucket: {
                el: new inputSpinner(config, {
                    no: 'minBucket',
                    label: decisionTreesEZ.t('minBucket'),
                    min: 0,
                    max: 9999999,
                    step: 1,
                    extraction: "NoPrefix|UseComma"
                })
            },
            TxtCP: {
                el: new inputSpinner(config, {
                    no: 'TxtCP',
                    label: decisionTreesEZ.t('TxtCP'),
                    min: 0,
                    max: 9999999,
                    step: 0.01,
                    value: 0.01,
                    extraction: "NoPrefix|UseComma"
                })
            },
            maxDepth: {
                el: new inputSpinner(config, {
                    no: 'maxDepth',
                    label: decisionTreesEZ.t('maxDepth'),
                    min: 0,
                    max: 9999999,
                    step: 1,
                    value: 30,
                    extraction: "NoPrefix|UseComma"
                })
            },
            radio1: {
                el: new radioButton(config, {
                    label: decisionTreesEZ.t('rd0'),
                    no: "grp1",
                    increment: "rd0",
                    value: "FALSE",
                    state: "checked",
                    ml: 4,
                    extraction: "ValueAsIs"
                })
            },
            radio2: {
                el: new radioButton(config, {
                    label: decisionTreesEZ.t('rd1'),
                    no: "grp1",
                    increment: "rd1",
                    value: "useOptimal",
                    state: "",
                    ml: 4,
                    extraction: "ValueAsIs"
                })
            },
            radio3: {
                el: new radioButton(config, {
                    label: decisionTreesEZ.t('rd2'),
                    no: "grp1",
                    increment: "rd2",
                    value: "TRUE",
                    state: "",
                    ml: 4,
                    required: true,
                    dependant_objects: ['TxtCPPrune'],
                    extraction: "ValueAsIs"
                })
            },
            input1: {
                el: new inputSpinner(config, {
                    no: 'TxtCPPrune',
                    label: decisionTreesEZ.t('TxtCPPrune'),
                    min: 0,
                    max: 9999999,
                    step: 0.01,
                    ml:3,
                    value: 0.01,
                    extraction: "NoPrefix|UseComma"
                })
            },
            PlotCVChkbox: {
                el: new checkbox(config, {
                    label: decisionTreesEZ.t('PlotCVChkbox'),
                    true_value: "TRUE",
                    false_value: "FALSE",
                    no: "PlotCVChkbox", 
                    extraction: "Boolean"
                })
            },
            PlotRSQRChkbox: {
                el: new checkbox(config, {
                    label: decisionTreesEZ.t('PlotRSQRChkbox'), 
                    no: "PlotRSQRChkbox",
                    true_value: "TRUE",
                    false_value: "FALSE",
                    extraction: "Boolean",
                })
            },
        };
        var plots = {
            el: new optionsVar(config, {
                no: "plots",
                name: decisionTreesEZ.t('OptvarPlots'),
                content: [
                    objects.PlotCVChkbox.el,
                    objects.PlotRSQRChkbox.el
                ]
            })
        };
        var prePruningOptions = {
            el: new optionsVar(config, {
                no: "prePruningOptions",
                name: decisionTreesEZ.t('OptvarPreprune'),
                content: [
                    objects.TxtMinSplit.el,
                    objects.minBucket.el,
                    objects.TxtCP.el,
                    objects.maxDepth.el,
                ]
            })
        };
        var pruneTree = {
            el: new optionsVar(config, {
                no: "pruneTree",
                name: decisionTreesEZ.t('OptvarPrune'),
                content: [
                    objects.radio1.el,
                    objects.radio2.el,
                    objects.radio3.el,
                    objects.input1.el
                ]
            })
        };
        const content = {
            left: [objects.content_var.el.content],
            right: [objects.TxtTreeName.el.content, objects.TreeGenChkbox.el.content, objects.dependent.el.content, objects.independent.el.content,objects.weights.el.content],
            bottom: [prePruningOptions.el.content, pruneTree.el.content, plots.el.content],
            nav: {
                name: decisionTreesEZ.t('navigation'),
                icon: "icon-decision_tree",
                modal: config.id
            }
        };
        super(config, objects, content);
        
        this.help = {
            title: decisionTreesEZ.t('help.title'),
            r_help: decisionTreesEZ.t('help.r_help'),  //r_help: "help(data,package='utils')",
            body: decisionTreesEZ.t('help.body')
        }
;
    }
}

module.exports = {
    render: () => new decisionTreesEZ().render()
}
