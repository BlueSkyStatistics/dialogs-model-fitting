/**
  * This file is protected by copyright (c) 2023-2025 by BlueSky Statistics, LLC.
  * All rights reserved. The copy, modification, or distribution of this file is not
  * allowed without the prior written permission from BlueSky Statistics, LLC.
 */


var localization = {
    en: {
        title: "Tune Random Forest Model",
        navigation: "Tune",
        dependentvar: "Dependent variable",
        independentvars: "Independent variable(s)",
        ntreetry: "No. of trees to try",
        stepfactor: "Step factor",
        improve: "Improve",
        trace: "Trace",
        plot: "Plot",
        help: {
            title: "Tune Random Forest Model",
            r_help: "help(tuneRF,package='randomForest')",
            body: `
                <b>Description</b></br>
Starting with the default value of mtry, search for the optimal value (with respect to Out-of-Bag error estimate) of mtry for randomForest. 
<br/>
<b>Usage</b>
<br/>
<code> 
tuneRF(x, y, ntreeTry=50, stepFactor=2, improve=0.05, trace=TRUE, plot=TRUE,  ...)
</code> <br/>
<b>Arguments</b><br/>
<ul>
<li>
x : matrix or data frame of predictor variables
</li>
<li>
y : response vector (factor for classification, numeric for regression)
</li>
<li>
ntreeTry : number of trees used at the tuning step.
</li>
<li>
stepFactor : at each iteration, mtry is inflated (or deflated) by this value.
</li>
<li>
improve : the (relative) improvement in OOB error must be by this much for the search to continue
</li>
<li>
trace : whether to print the progress of the search.
</li>
<li>
plot : whether to plot the OOB error as function of mtry.
</li>
<li>
... : options to be given to randomForest
</li>
</ul>
<b>Value</b></br>
Returns a matrix whose first column contains the mtry values searched, and the second column the corresponding OOB error.</br>
<b>Package</b></br>
randomForest​;BlueSky</br>
<b>Help</b></br>
For detailed help click on the R icon on the top right hand side of this dialog overlay or run the following command in the R syntax editor help(tuneRF,package='randomForest')
`}
    }
}

class tuneRandomForest extends baseModal {
    constructor() {
        var config = {
            id: "tuneRandomForest",
            label: localization.en.title,
            modalType: "two",
            RCode: `
require(randomForest)
bskyTuningResults <- tuneRF({{dataset.name}}[,c({{selected.independentvars | safe}})], {{selected.dependentvar | safe}}, ntreeTry={{selected.ntreetry | safe}}, stepFactor= {{selected.stepfactor | safe}},improve= {{selected.improve | safe}}, trace={{selected.trace | safe}}, plot={{selected.plot | safe}})          
BSkyFormat(bskyTuningResults, singleTableOutputHeader="Tuning Results")
`
        };
        var objects = {
            content_var: { el: new srcVariableList(config, {action: "move"}) },
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
            ntreetry: {
                el: new inputSpinner(config, {
                    no: "ntreetry",
                    label: localization.en.ntreetry,
                    min: 1,
                    max: 999999999,
                    step: 1,
                    value: 50,
                    extraction: "NoPrefix|UseComma"
                })
            },
            stepfactor: {
                el: new inputSpinner(config, {
                    no: "stepfactor",
                    label: localization.en.stepfactor,
                    min: 1,
                    max: 999999999,
                    step: 1,
                    value: 2,
                    extraction: "NoPrefix|UseComma"
                })
            },
            improve: {
                el: new inputSpinner(config, {
                    no: "improve",
                    label: localization.en.improve,
                    min: 0,
                    max: 999999999,
                    step: 0.01,
                    value: 0.05,
                    extraction: "NoPrefix|UseComma"
                })
            },
            trace: {
                el: new checkbox(config, {
                    //   label: "Click to Enable Input", 
                    no: "trace",
                    label: localization.en.trace,
                    bs_type: "valuebox",
                    extraction: "BooleanValue",
                    true_value: "TRUE",
                    false_value: "FALSE",
                    newline: true,
                    //required: true,
                })
            },
            plot: {
                el: new checkbox(config, {
                    //   label: "Click to Enable Input", 
                    no: "plot",
                    label: localization.en.plot,
                    bs_type: "valuebox",
                    extraction: "BooleanValue",
                    true_value: "TRUE",
                    false_value: "FALSE",
                    newline: true,
                    //required: true,
                })
            },
        };
        const content = {
            left: [objects.content_var.el.content],
            right: [objects.dependentvar.el.content, objects.independentvars.el.content, objects.ntreetry.el.content, objects.stepfactor.el.content, objects.improve.el.content, objects.trace.el.content, objects.plot.el.content],
            nav: {
                name: localization.en.navigation,
                icon: "icon-tune",
                modal: config.id
            }
        };
        super(config, objects, content);
        this.help = localization.en.help;
    }
}
module.exports.item = new tuneRandomForest().render()