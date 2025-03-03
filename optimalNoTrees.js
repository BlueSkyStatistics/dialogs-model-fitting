/**
  * This file is protected by copyright (c) 2023-2025 by BlueSky Statistics, LLC.
  * All rights reserved. The copy, modification, or distribution of this file is not
  * allowed without the prior written permission from BlueSky Statistics, LLC.
 */


var localization = {
    en: {
        title: "Optimal No of Trees",
        navigation: "Optimize",
        dependentvar: "Dependent variable",
        independentvars: "Independent variable(s)",
        label1: "Tree simulating settings",
        startval: "Start value",
        endval: "End value",
        stepval: "Step value",
        mtry: "mtry",
        help: {
            title: "Optimal No of Trees",
            r_help: "help(randomForest,package='randomForest')",
            body: `
                <b>Description</b></br>
Starting with the default value of mtry, search for the optimal value (with respect to Out-of-Bag error estimate) of ntree (no of trees to grow) for randomForest. The function BSkyMultiRandomForest calls the function randomForest with the arguments defined below
<br/>
<b>Usage</b>
<br/>
<code> 
BSkyMultiRandomForest(x , y=NULL, startval, endval, stepval, mtry)
</code> <br/>
<b>Arguments</b><br/>
<ul>
<li>
x : a data frame or a matrix of predictors, or a formula describing the model to be fitted (for the print method, an randomForest object).
</li>
<li>
y :  A response vector. If a factor, classification is assumed, otherwise regression is assumed. If omitted, randomForest will run in unsupervised mode.
</li>
<li>
startval : starting value for ntree argument in randomForest().
</li>
<li>
endval : ending value for ntree argument in randomForest().
</li>
<li>
stepval : count by which startval should be incremented in every iteration till it reaches endval value.
</li>
<li>
mtry : Number of variables randomly sampled as candidates at each split. Note that the default values are different for classification (sqrt(p) where p is number of variables in x) and regression (p/3)
</li>
</ul>
<b>Value</b><br/>
Prints the optimal number of trees. Also displays a table with ntree and the corresponding Out-of-Bag error<br/>
<b>Package</b></br>
randomForest​;BlueSky</br>
<b>Help</b></br>
For detailed help click on the R icon on the top right hand side of this dialog overlay or run the following command in the R syntax editor help(randomForest,package='randomForest')
                `}
    }
}

class optimalNoTrees extends baseModal {
    constructor() {
        var config = {
            id: "optimalNoTrees",
            label: localization.en.title,
            modalType: "two",
            RCode: `
require(randomForest)
oobdf <- BSkyMultiRandomForest(x = {{dataset.name}}[,c({{selected.independentvars | safe}})], y={{selected.dependentvar | safe}}, startval={{selected.startval | safe}}, endval={{selected.endval | safe}}, stepval={{selected.stepval | safe}}{{if (options.selected.mtry !== "")}} , mtry = {{selected.mtry | safe}}  {{/if}}) 
BSkyFormat(oobdf, singleTableOutputHeader="Results")          
`
        };
        var objects = {
            content_var: { el: new srcVariableList(config) },
            dependentvar: {
                el: new dstVariable(config, {
                    label: localization.en.dependentvar,
                    no: "dependentvar",
                    filter: "String|Numeric|Logical|Ordinal|Nominal|Scale",
                    extraction: "Prefix|UseComma",
                    required: true,
                }), r: ['{{ var | safe}}']
            },
            independentvars: {
                el: new dstVariableList(config, {
                    label: localization.en.independentvars,
                    no: "independentvars",
                    required: true,
                    filter: "Numeric|Logical|Ordinal|Nominal|Scale",
                    extraction: "NoPrefix|UseComma|Enclosed",
                }), r: ['{{ var | safe}}']
            },
            label1: { el: new labelVar(config, { label: localization.en.label1, h: 6 }) },
            startval: {
                el: new inputSpinner(config, {
                    no: "startval",
                    label: localization.en.startval,
                    min: 1,
                    max: 999999999,
                    step: 1,
                    value: 200,
                    extraction: "NoPrefix|UseComma"
                })
            },
            endval: {
                el: new inputSpinner(config, {
                    no: "endval",
                    label: localization.en.endval,
                    min: 1,
                    max: 999999999,
                    step: 1,
                    value: 500,
                    extraction: "NoPrefix|UseComma"
                })
            },
            stepval: {
                el: new inputSpinner(config, {
                    no: "stepval",
                    label: localization.en.stepval,
                    min: 1,
                    max: 999999999,
                    step: 1,
                    value: 50,
                    extraction: "NoPrefix|UseComma"
                })
            },
            mtry: {
                el: new inputSpinner(config, {
                    no: "mtry",
                    label: localization.en.mtry,
                    min: 0,
                    max: 999999999,
                    step: 1,
                    value: 2,
                    extraction: "NoPrefix|UseComma"
                })
            },
        };
        const content = {
            left: [objects.content_var.el.content],
            right: [objects.dependentvar.el.content, objects.independentvars.el.content, objects.label1.el.content, objects.startval.el.content, objects.endval.el.content, objects.stepval.el.content, objects.mtry.el.content],
            nav: {
                name: localization.en.navigation,
                icon: "icon-optimize",
                modal: config.id
            }
        };
        super(config, objects, content);
        this.help = localization.en.help;
    }
}
module.exports.item = new optimalNoTrees().render()