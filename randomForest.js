/**
  * This file is protected by copyright (c) 2023-2025 by BlueSky Statistics, LLC.
  * All rights reserved. The copy, modification, or distribution of this file is not
  * allowed without the prior written permission from BlueSky Statistics, LLC.
 */


var localization = {
    en: {
        title: "Random Forest",
        label1: "Random forest can be run in supervised or unsupervised node. To run in unsupervised mode, don't specify a dependent variable.",
        navigation: "Random Forest",
        modelname: "Enter model name",
        dependentvar: "Dependent variable",
        independentvars: "Independent variable(s)",
        ntree: "No. of trees",
        mtry: "mtry",
        proximity: "Proximity:",
        newds: "Specify dataset name to store proximity:",
        predictor: "Save predicted values:",
        newcolname: "Specify new column name for predicted values:",
        help: {
            title: "Random Forest",
            r_help: "help(randomForest,package='randomForest')",
            body: `
                <b>Description</b></br>
randomForest implements Breiman's random forest algorithm (based on Breiman and Cutler's original Fortran code) for classification and regression. It can also be used in unsupervised mode for assessing proximities among data points.
<br/>
<b>Usage</b>
<br/>
<code> 
randomForest(x, y=NULL,  ntree=500, importance=FALSE, proximity, ...)
</code> <br/>
<b>Arguments</b><br/>
<ul>
<li>
x : A data frame or a matrix of predictors, or a formula describing the model to be fitted (for the print method, an randomForest object).
</li>
<li>
y: A response vector. If a factor, classification is assumed, otherwise regression is assumed. If omitted, randomForest will run in unsupervised mode.
</li>
<li>
ntree : Number of trees to grow. This should not be set to too small a number, to ensure that every input row gets predicted at least a few times.
</li>
<li>
importance : Should importance of predictors be assessed? 
</li>
<li>
proximity : Should proximity measure among the rows be calculated?
</li>
<li>
... : optional parameters to be passed to the low level function randomForest.default.
</li>
</ul>
<b>Value</b><br/>
An object of class randomForest, which is a list with the following components:<br/>
call: the original call to randomForest<br/>
type: one of regression, classification, or unsupervised.<br/>
predicted: the predicted values of the input data based on out-of-bag samples.<br/>
importance:	a matrix with nclass + 2 (for classification) or two (for regression) columns. For classification, the first nclass columns are the class-specific measures computed as mean descrease in accuracy. The nclass + 1st column is the mean descrease in accuracy over all classes. The last column is the mean decrease in Gini index. For Regression, the first column is the mean decrease in accuracy and the second the mean decrease in MSE. If importance=FALSE, the last measure is still returned as a vector.<br/>
importanceSD: The “standard errors” of the permutation-based importance measure. For classification, a p by nclass + 1 matrix corresponding to the first nclass + 1 columns of the importance matrix. For regression, a length p vector.<br/>
localImp: a p by n matrix containing the casewise importance measures, the [i,j] element of which is the importance of i-th variable on the j-th case. NULL if localImp=FALSE.<br/>
ntree: number of trees grown.<br/>
mtry: number of predictors sampled for spliting at each node.<br/>
forest: (a list that contains the entire forest; NULL if randomForest is run in unsupervised mode or if keep.forest=FALSE.<br/>
err.rate: (classification only) vector error rates of the prediction on the input data, the i-th element being the (OOB) error rate for all trees up to the i-th.<br/>
confusion: (classification only) the confusion matrix of the prediction (based on OOB data).<br/>
votes: (classification only) a matrix with one row for each input data point and one column for each class, giving the fraction or number of (OOB) ‘votes’ from the random forest.<br/>
oob.times: number of times cases are ‘out-of-bag’ (and thus used in computing OOB error estimate)<br/>
proximity: if proximity=TRUE when randomForest is called, a matrix of proximity measures among the input (based on the frequency that pairs of data points are in the same terminal nodes).<br/>
mse	: (regression only) vector of mean square errors: sum of squared residuals divided by n.<br/>
rsq	: (regression only) “pseudo R-squared”: 1 - mse / Var(y).<br/>
test: if test set is given (through the xtest or additionally ytest arguments), this component is a list which contains the corresponding predicted, err.rate, confusion, votes (for classification) or predicted, mse and rsq (for regression) for the test set. If proximity=TRUE, there is also a component, proximity, which contains the proximity among the test set as well as proximity between test and training data.<br/>
<b>Package</b></br>
randomForest​;BlueSky</br>
<b>Help</b></br>
For detailed help click on the R icon on the top right hand side of this dialog overlay or run the following command in the R syntax editor</br>
help(randomForest,package='randomForest')
                `}
    }
}

class randomForest extends baseModal {
    constructor() {
        var config = {
            id: "randomForest",
            label: localization.en.title,
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
            label1: { el: new labelVar(config, { label: localization.en.label1, h: 6 }) },
            modelname: {
                el: new input(config, {
                    no: 'modelname',
                    label: localization.en.modelname,
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
                    label: localization.en.dependentvar,
                    no: "dependentvar",
                    filter: "String|Numeric|Logical|Ordinal|Nominal|Scale",
                    extraction: "Prefix|UseComma",
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
            ntree: {
                el: new inputSpinner(config, {
                    no: "ntree",
                    label: localization.en.ntree,
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
                    label: localization.en.mtry,
                    min: 0,
                    max: 999999999,
                    step: 1,
                    extraction: "NoPrefix|UseComma"
                })
            },
            proximity: {
                el: new checkbox(config, {
                    label: localization.en.proximity,
                    no: "proximity",
                    required: true,
                    dependant_objects: ["newds"],
                })
            },
            newds: {
                el: new input(config, {
                    no: 'newds',
                    label: localization.en.newds,
                    placeholder: "",
                    ml:2,
                    type: "character",
                    extraction: "TextAsIs",
                    value: ""
                })
            },
            predictor: {
                el: new checkbox(config, {
                    label: localization.en.predictor,
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
                    label: localization.en.newcolname,
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
                name: localization.en.navigation,
                icon: "icon-random_forest",
                modal: config.id
            }
        };
        super(config, objects, content);
        this.help = localization.en.help;
    }
}
module.exports.item = new randomForest().render()