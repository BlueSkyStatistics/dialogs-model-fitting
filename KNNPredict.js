/**
  * This file is protected by copyright (c) 2023-2025 by BlueSky Statistics, LLC.
  * All rights reserved. The copy, modification, or distribution of this file is not
  * allowed without the prior written permission from BlueSky Statistics, LLC.
 */




class KNNPredict extends baseModal {
    static dialogId = 'KNNPredict'
    static t = baseModal.makeT(KNNPredict.dialogId)

    constructor() {
        var config = {
            id: KNNPredict.dialogId,
            label: KNNPredict.t('title'),
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
                label: KNNPredict.t('dataset_var') }) },
            datasetToScore: {
                el: new dstVariableList(config, {
                    label: KNNPredict.t('datasetToScore'),
                    no: "datasetToScore",
                    filter: "Dataset",
                    extraction: "UseComma",
                    required: true,
                })
            },
            NOTE1: { el: new labelVar(config, { label: KNNPredict.t('NOTE1'), h: 6 }) },
            header: { el: new labelVar(config, { label: KNNPredict.t('header'), h: 6 }) },
            step1: { el: new labelVar(config, { label: KNNPredict.t('step1'), h: 6 }) },
            step2: { el: new labelVar(config, { label: KNNPredict.t('step2'), h: 6 }) },
            step3: { el: new labelVar(config, { label: KNNPredict.t('step3'), h: 6 }) },
            step4: { el: new labelVar(config, { label: KNNPredict.t('step4'), h: 6 }) },
            step5: { el: new labelVar(config, { label: KNNPredict.t('step5'), h: 6 }) },
            step6: { el: new labelVar(config, { label: KNNPredict.t('step6'), h: 6 }) },
            content_var: { el: new srcVariableList(config, {label: "Source variables (from training dataset)",action: "move"}) },
            dependentvar: {
                el: new dstVariable(config, {
                    label: KNNPredict.t('dependentvar'),
                    no: "dependentvar",
                    required: true,
                    filter: "String|Numeric|Logical|Ordinal|Nominal|Scale",
                    extraction: "NoPrefix|UseComma",
                }), r: ['{{ var | safe}}']
            },
            independentvars: {
                el: new dstVariableList(config, {
                    label: KNNPredict.t('independentvars'),
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
                    label: KNNPredict.t('Seed'),
                    placeholder: "Enter a value for seed",
                    extraction: "TextAsIs",
                    value: 123
                }),
            },
            Group2: { el: new labelVar(config, { label: KNNPredict.t('Group2'),  style: "mt-3", h: 6 }) },
            noneighbhors: {
                el: new inputSpinner(config, {
                    no: 'noneighbhors',
                    style: "ml-2",
                    label: KNNPredict.t('noneighbhors'),
                    min: 0,
                    max: 9999999,
                    step: 1,
                    extraction: "NoPrefix|UseComma"
                })
            },
            /*Group1: { el: new labelVar(config, { label: KNNPredict.t('Group1'), style: "mt-3",h: 6 }) },
            splitPercentage: {
                el: new inputSpinner(config, {
                    no: 'splitPercentage',
                    label: KNNPredict.t('splitPercentage'),
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
                    label: KNNPredict.t('predictedValues'),
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
                name: KNNPredict.t('navigation'),
                icon: "icon-y-hat",
                modal: config.id
            }
        }
        super(config, objects, content);
        
        this.help = {
            title: KNNPredict.t('help.title'),
            r_help: KNNPredict.t('help.r_help'),  //r_help: "help(data,package='utils')",
            body: KNNPredict.t('help.body')
        }
;
    }
}

module.exports = {
    render: () => new KNNPredict().render()
}
