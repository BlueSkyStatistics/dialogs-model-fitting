
var localization = {
    en: {
        title: "Make Predictions with KNN",
        navigation: "Predict with KNN",
        dataset_var: "Open datasets",
        header: "KNN is a lazy classifier, it does not create a fitted model that can be used to predict later. It fits and makes predictions at the same time. You need to follow the steps below to make predictions/score.",
        NOTE1: "THE ACTIVE DATASET MUST BE THE DATASET YOU WANT TO BUILD A MODEL ON AND NOT THE DATASET YOU WANT TO SCORE",
        step1: "Step1: As usual, you must select the training dataset in the Datagrid before opening this dialog.",
        step2: "Step2: Select the dependent variable in the training dataset used to fit the model.",
        step3: "Step3: Specify the independent variables in the training dataset.",
        step4: "Step4: Specify the number of neighbors to use to build the model.",
        step5: "Step5: Enter a variable prefix for the new variable containing the predictions.",
        step6: "Step6: Specify the dataset to add predictions to. It must contain the same independent variables used to train the model.",
        dependentvar: "Dependent variable (from training dataset)",
        independentvars: "Independent variable(s) (from training dataset)",
        Seed: "Set Seed",
        datasetToScore: "Dataset to score/predict",
        Group2: "Tuning parameters for KNN",
        noneighbhors: "No. of neighbors (When a value is not specified, default is set to the square root of the number of observations in dataset)",
        testDatasetName: "Enter the name of the dataset to make predictions",
        predictedValues: "Enter variable prefix for predicted values. A new variable is created by appending the prefix to the dependent variable name.",
        help: {
            title: "K Nearest Neighbhors",
            r_help: "help(knn, package ='class')",
            body: `
                <b>Description</b></br>
k-Nearest Neighbor Classification
<br/>
<b>Note: </b></br>
See the help text on the dialog
<br/>
<b>Usage</b>
<br/>
<code> 
knn(train= dataset1, test, cl, k = 1, l = 0, prob = FALSE, use.all = TRUE)
</code> <br/>
<b>Arguments</b><br/>
<ul>
<li>
train: This is the source(active) dataset used to create a fitted model.
</li>
<li>
test: This is the dataset that predicted values will be saved to when the prefix you specified. A new variable is created by appending the prefix to the dependent variable specified from the source dataset.
</li>
<li>
cl: factor of true classifications from the dataset used to fit the model
</li>
<li>
k: number of neighbors considered.
</li>
<li>
l: minimum vote for definite decision, otherwise doubt. (More precisely, less than k-l dissenting votes are allowed, even if k is increased by ties.)
</li>
<li>
prob: If this is true, the proportion of the votes for the winning class are returned as attribute prob.
</li>
<li>
use.all: controls handling of ties. If true, all distances equal to the kth largest are included. If false, a random selection of distances equal to the kth is chosen to use exactly k neighbors.
</li>
</ul>
<b>Value</b></br>
Factor of classifications of test set. doubt will be returned as NA.</br>
<b>Package</b></br>
caret;class</br>
<b>Help</b></br>
help(knn, package ='class')
                `}
    }
}

class KNNPredict extends baseModal {
    constructor() {
        var config = {
            id: "KNNPredict",
            label: localization.en.title,
            modalType: "two",
            RCode: `
require(caret)
require(class)
local(
{
noneighbors = c('{{selected.noneighbhors | safe}}')
if (noneighbors=='')
{
noneighbors =sqrt(nrow({{dataset.name}}))
} else
{
noneighbors =as.numeric(noneighbors )
}
set.seed({{selected.Seed | safe}})
predictions<-knn(train = {{dataset.name}}[,c({{selected.independentvars | safe}})], test={{selected.datasetToScore | safe}}[,c({{selected.independentvars | safe}})], cl = as.factor({{dataset.name}}[,c('{{selected.dependentvar | safe}}')]), k=noneighbors )
#Saving predicted values
eval(parse(text =paste( '{{selected.datasetToScore | safe}}', "$","{{selected.predictedValues | safe}}","{{selected.dependentvar | safe}}","<<-","predictions", sep='')))
}
)
BSkyLoadRefresh("{{selected.datasetToScore | safe}}")     
`
        }
        var objects = {
            dataset_var: { el: new srcDataSetList(config, { 
                action: "move",
                label: localization.en.dataset_var }) },
            datasetToScore: {
                el: new dstVariableList(config, {
                    label: localization.en.datasetToScore,
                    no: "datasetToScore",
                    filter: "Dataset",
                    extraction: "UseComma",
                    required: true,
                })
            },
            NOTE1: { el: new labelVar(config, { label: localization.en.NOTE1, h: 6 }) },
            header: { el: new labelVar(config, { label: localization.en.header, h: 6 }) },
            step1: { el: new labelVar(config, { label: localization.en.step1, h: 6 }) },
            step2: { el: new labelVar(config, { label: localization.en.step2, h: 6 }) },
            step3: { el: new labelVar(config, { label: localization.en.step3, h: 6 }) },
            step4: { el: new labelVar(config, { label: localization.en.step4, h: 6 }) },
            step5: { el: new labelVar(config, { label: localization.en.step5, h: 6 }) },
            step6: { el: new labelVar(config, { label: localization.en.step6, h: 6 }) },
            content_var: { el: new srcVariableList(config, {label: "Source variables (from training dataset)",action: "move"}) },
            dependentvar: {
                el: new dstVariable(config, {
                    label: localization.en.dependentvar,
                    no: "dependentvar",
                    required: true,
                    filter: "String|Numeric|Logical|Ordinal|Nominal|Scale",
                    extraction: "NoPrefix|UseComma",
                }), r: ['{{ var | safe}}']
            },
            independentvars: {
                el: new dstVariableList(config, {
                    label: localization.en.independentvars,
                    no: "independentvars",
                    filter: "String|Numeric|Logical|Ordinal|Nominal|Scale",
                    required: true,
                    extraction: "NoPrefix|UseComma|Enclosed",
                }), r: ['{{ var | safe}}']
            },
            Seed: {
                el: new input(config, {
                    no: 'Seed',
                    allow_spaces:true,
                    label: localization.en.Seed,
                    placeholder: "Enter a value for seed",
                    extraction: "TextAsIs",
                    value: 123
                }),
            },
            Group2: { el: new labelVar(config, { label: localization.en.Group2,  style: "mt-3", h: 6 }) },
            noneighbhors: {
                el: new inputSpinner(config, {
                    no: 'noneighbhors',
                    style: "ml-2",
                    label: localization.en.noneighbhors,
                    min: 0,
                    max: 9999999,
                    step: 1,
                    extraction: "NoPrefix|UseComma"
                })
            },
            /*Group1: { el: new labelVar(config, { label: localization.en.Group1, style: "mt-3",h: 6 }) },
            splitPercentage: {
                el: new inputSpinner(config, {
                    no: 'splitPercentage',
                    label: localization.en.splitPercentage,
                    min: 0,
                    max: 100,
                    step: 1,
                    value: 80,
                    extraction: "NoPrefix|UseComma"
                })
            },*/
           
            predictedValues: {
                el: new input(config, {
                    no: 'predictedValues',
                    label: localization.en.predictedValues,
                    placeholder: "",
                    style: "ml-2",
                    required: true,
                    extraction: "TextAsIs",
                    value: ""
                })
            }
        }
        const content = {
            head: [objects.NOTE1.el.content, objects.header.el.content, objects.step1.el.content, objects.step2.el.content, objects.step3.el.content, objects.step4.el.content, objects.step5.el.content, objects.step6.el.content],
            left: [objects.content_var.el.content, objects.dataset_var.el.content],
            right: [objects.dependentvar.el.content, objects.independentvars.el.content, objects.noneighbhors.el.content, objects.predictedValues.el.content, objects.datasetToScore.el.content ],
            bottom: [objects.Seed.el.content],
            nav: {
                name: localization.en.navigation,
                icon: "icon-y-hat",
                modal: config.id
            }
        }
        super(config, objects, content);
        this.help = localization.en.help;
    }
}
module.exports.item = new KNNPredict().render()