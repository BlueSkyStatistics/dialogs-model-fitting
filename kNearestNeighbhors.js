/**
  * This file is protected by copyright (c) 2023-2025 by BlueSky Statistics, LLC.
  * All rights reserved. The copy, modification, or distribution of this file is not
  * allowed without the prior written permission from BlueSky Statistics, LLC.
 */




class kNearestNeighbhors extends baseModal {
    static dialogId = 'kNearestNeighbhors'
    static t = baseModal.makeT(kNearestNeighbhors.dialogId)

    constructor() {
        var config = {
            id: kNearestNeighbhors.dialogId,
            label: kNearestNeighbhors.t('title'),
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
            header: { el: new labelVar(config, { label: kNearestNeighbhors.t('header'), style: "mt-3",h: 6 }) },
            content_var: { el: new srcVariableList(config, {action: "move"}) },
            dependentvar: {
                el: new dstVariable(config, {
                    label: kNearestNeighbhors.t('dependentvar'),
                    no: "dependentvar",
                    required: true,
                    filter: "String|Numeric|Logical|Ordinal|Nominal|Scale",
                    extraction: "NoPrefix|UseComma",
                }), r: ['{{ var | safe}}']
            },
            independentvars: {
                el: new dstVariableList(config, {
                    label: kNearestNeighbhors.t('independentvars'),
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
                    label: kNearestNeighbhors.t('Seed'),
                    placeholder: "Enter a value for seed",
                    extraction: "TextAsIs",
                    value: 123
                }),
            },
            Group2: { el: new labelVar(config, { label: kNearestNeighbhors.t('Group2'),  style: "mt-3", h: 6 }) },
            noneighbhors: {
                el: new inputSpinner(config, {
                    no: 'noneighbhors',
                    label: kNearestNeighbhors.t('noneighbhors'),
                    min: 0,
                    max: 9999999,
                    step: 1,
                    extraction: "NoPrefix|UseComma"
                })
            },
            Group1: { el: new labelVar(config, { label: kNearestNeighbhors.t('Group1'), style: "mt-3",h: 6 }) },
            splitPercentage: {
                el: new inputSpinner(config, {
                    no: 'splitPercentage',
                    label: kNearestNeighbhors.t('splitPercentage'),
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
                    label: kNearestNeighbhors.t('trainDatasetName'),
                    placeholder: "",
                    extraction: "TextAsIs",
                    value: "trainData"
                }),
            },
            testDatasetName: {
                el: new input(config, {
                    no: 'testDatasetName',
                    label: kNearestNeighbhors.t('testDatasetName'),
                    placeholder: "",
                    required: true,
                    extraction: "TextAsIs",
                    value: "testData"
                }),
            },
            predictedValues: {
                el: new input(config, {
                    no: 'predictedValues',
                    label: kNearestNeighbhors.t('predictedValues'),
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
                name: kNearestNeighbhors.t('navigation'),
               // icon: "icon-knn",
               icon: "icon-network",
                modal: config.id
            }
        }
        super(config, objects, content);
        
        this.help = {
            title: kNearestNeighbhors.t('help.title'),
            r_help: kNearestNeighbhors.t('help.r_help'),  //r_help: "help(data,package='utils')",
            body: kNearestNeighbhors.t('help.body')
        }
;
    }
}

module.exports = {
    render: () => new kNearestNeighbhors().render()
}
