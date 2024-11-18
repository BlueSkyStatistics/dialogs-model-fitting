
var localization = {
    en: {
        title: "K Nearest Neighbors",
        navigation: "KNN",
        dependentvar: "Dependent variable",
        independentvars: "Independent variable(s)",
        header: "KNN is a lazy classifier, it does not create a fit to predict later. It fits and evaluates at the same time. We split the dataset into train and test datasets, then build the model on the training dataset, making predictions on the test dataset and use those predictions to display model evaluation statistics.",
        Seed: "Set Seed",
        Group2: "Tuning parameters for KNN",
        noneighbhors: "No. of neighbors (When a value is not specified, default is set to the square root of the number of observations in dataset)",
        Group1: "Train and test datasets",
        splitPercentage: "Enter split percentage",
        trainDatasetName: "Enter the name of the training dataset",
        testDatasetName: "Enter the name of the testing dataset",
        predictedValues: "Enter variable prefix for predicted values. (You must specify a prefix) Prefixed variables are created in the testing dataset.",
        help: {
            title: "K Nearest Neighbors",
            r_help: "help(knn, package ='class')",
            body: `
                <b>Description</b></br>
k-Nearest Neighbor Classification
<br/>
<b>Note: </b></br>
1. Training and testing datasets are automatically created with KNN based on the split percentage specified<br/>
2. The predicted values are stored in the testing dataset and are used to compute model statistics namely accuracy, kappa, sensitivity.... The confusion matrix is also displayed
<br/>
<b>Usage</b>
<br/>
<code> 
knn(train, test, cl, k = 1, l = 0, prob = FALSE, use.all = TRUE)
</code> <br/>
<b>Arguments</b><br/>
<ul>
<li>
train: matrix or data frame of training set cases.
</li>
<li>
test: matrix or data frame of test set cases. A vector will be interpreted as a row vector for a single case.
</li>
<li>
cl: factor of true classifications of training set
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

class kNearestNeighbhors extends baseModal {
    constructor() {
        var config = {
            id: "kNearestNeighbhors",
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
percentage = {{selected.splitPercentage | safe}}/100
set.seed({{selected.Seed | safe}})
trainIndex <- createDataPartition({{dataset.name}}\${{selected.dependentvar | safe}},p=percentage,list=FALSE)
{{selected.trainDatasetName | safe}} <<- {{dataset.name}} [ trainIndex,]
{{selected.testDatasetName | safe}} <<- {{dataset.name}}[-trainIndex,]
predictions<-knn(train = {{selected.trainDatasetName | safe}}[,c({{selected.independentvars | safe}})], test={{selected.testDatasetName | safe}}[,c({{selected.independentvars | safe}})],cl=as.factor({{selected.trainDatasetName | safe}}[,c('{{selected.dependentvar | safe}}')]),k=noneighbors )
confusionMatrixResults <-with({{selected.testDatasetName | safe}} ,confusionMatrix(predictions,as.factor({{selected.dependentvar | safe}})))
BSkyFormat(confusionMatrixResults$table, singleTableOutputHeader="Confusion Matrix")
#Display accuracy and kappa statistics values
accuracyKappaStats <-as.matrix(confusionMatrixResults$overall)
colnames(accuracyKappaStats) <- c("Values")
BSkyFormat(as.matrix(accuracyKappaStats),singleTableOutputHeader="Accuracy and Kappa Statistics")
#the sensitivity, specificity, positive predictive value, negative predictive value, precision, recall, F1, prevalence, detection rate, detection prevalence and balanced accuracy for each class. For two class systems, this is calculated once using the positive argument
additionalStats<-as.matrix(confusionMatrixResults$byClass)
if (ncol(additionalStats) ==1)
{
colnames(additionalStats) <- c("Values")
}
BSkyFormat(as.matrix(additionalStats),singleTableOutputHeader="Additional Statistics")
#Saving predicted values
eval(parse(text =paste( "{{selected.testDatasetName | safe}}", "$","{{selected.predictedValues | safe}}","{{selected.dependentvar | safe}}","<<-","predictions", sep='')))
}
)
BSkyLoadRefresh("{{selected.trainDatasetName | safe}}")
BSkyLoadRefresh("{{selected.testDatasetName | safe}}")     
`
        }
        var objects = {
            header: { el: new labelVar(config, { label: localization.en.header, style: "mt-3",h: 6 }) },
            content_var: { el: new srcVariableList(config, {action: "move"}) },
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
                    label: localization.en.noneighbhors,
                    min: 0,
                    max: 9999999,
                    step: 1,
                    extraction: "NoPrefix|UseComma"
                })
            },
            Group1: { el: new labelVar(config, { label: localization.en.Group1, style: "mt-3",h: 6 }) },
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
            },
            trainDatasetName: {
                el: new input(config, {
                    no: 'trainDatasetName',
                    required: true,
                    label: localization.en.trainDatasetName,
                    placeholder: "",
                    extraction: "TextAsIs",
                    value: "trainData"
                }),
            },
            testDatasetName: {
                el: new input(config, {
                    no: 'testDatasetName',
                    label: localization.en.testDatasetName,
                    placeholder: "",
                    required: true,
                    extraction: "TextAsIs",
                    value: "testData"
                }),
            },
            predictedValues: {
                el: new input(config, {
                    no: 'predictedValues',
                    label: localization.en.predictedValues,
                    placeholder: "",
                    required: true,
                    extraction: "TextAsIs",
                    value: ""
                })
            }
        }
        const content = {
            head: [objects.header.el.content],
            left: [objects.content_var.el.content],
            right: [objects.dependentvar.el.content, objects.independentvars.el.content],
            bottom: [objects.Seed.el.content, objects.Group2.el.content, objects.noneighbhors.el.content, objects.Group1.el.content, objects.splitPercentage.el.content, objects.trainDatasetName.el.content, objects.testDatasetName.el.content, objects.predictedValues.el.content],
            nav: {
                name: localization.en.navigation,
               // icon: "icon-knn",
               icon: "icon-network",
                modal: config.id
            }
        }
        super(config, objects, content);
        this.help = localization.en.help;
    }
}
module.exports.item = new kNearestNeighbhors().render()