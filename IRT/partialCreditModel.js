/**
  * This file is protected by copyright (c) 2023-2025 by BlueSky Statistics, LLC.
  * All rights reserved. The copy, modification, or distribution of this file is not
  * allowed without the prior written permission from BlueSky Statistics, LLC.
 */




class partialCreditModel extends baseModal {
    static dialogId = 'partialCreditModel'
    static t = baseModal.makeT(partialCreditModel.dialogId)

    constructor() {
        var config = {
            id: partialCreditModel.dialogId,
            label: partialCreditModel.t('title'),
            modalType: "two",
            RCode: `
require(eRm);
require(TAM);

if (validateDataPartialCredit(vars =c({{selected.destinationvars | safe}}), data ="{{dataset.name}}"))
{
    if ("{{selected.estimation | safe}}"=="CML")
    {
        {{selected.modelname | safe}} <- eRm::PCM({{dataset.name}}[,c({{selected.destinationvars | safe}})], se={{selected.stderr | safe}}, sum0={{selected.normalize | safe}}) 
        BSkySummaryeRm({{selected.modelname | safe}})
    }
    if ("{{selected.estimation | safe}}"=="MML")
    {
        {{selected.modelname | safe}} <- tam.mml({{dataset.name}}[,c({{selected.destinationvars | safe}})]  , irtmodel="PCM",verbose=FALSE )
        BSkySummary.tam.mml({{selected.modelname | safe}})
    }
}
`
        };
        var objects = {
            content_var: { el: new srcVariableList(config, { action: "move" }) },
            modelname: {
                el: new input(config, {
                    no: 'modelname',
                    label: partialCreditModel.t('modelname'),
                    placeholder: "",
                    required: true,
                    type: "character",
                    extraction: "TextAsIs",
                    value: "partialCreditcvxModel1",
                    overwrite: "dataset"
                })
            },
            destinationvars: {
                el: new dstVariableList(config, {
                    label: partialCreditModel.t('destinationvars'),
                    no: "destinationvars",
                    required: true,
                    filter: "Numeric|Ordinal|Nominal|Scale",
                    extraction: "NoPrefix|UseComma|Enclosed",
                }), r: ['{{ var | safe}}']
            },


            label1: { el: new labelVar(config, { label: partialCreditModel.t('estimationlbl'), style: "mt-2", h: 6 }) },
            cmlrad: {
                el: new radioButton(config, {
                    label: partialCreditModel.t('rad1'),
                    no: "estimation",
                    increment: "cml",
                    value: "CML",
                    state: "checked",
                    extraction: "ValueAsIs",
                    dependant_objects: ['stderr', 'normalize']
                })
            },
            stderr: {
                el: new checkbox(config, {
                    label: partialCreditModel.t('chk1'),
                    no: "stderr",
                    style: "ml-4",
                    bs_type: "valuebox",
                    extraction: "TextAsIs",
                    true_value: "TRUE",
                    false_value: "FALSE",
                    state: "checked",
                    newline: true,
                })
            },
            normalize: {
                el: new checkbox(config, {
                    label: partialCreditModel.t('chk2'),
                    no: "normalize",
                    style: "ml-4",
                    bs_type: "valuebox",
                    extraction: "TextAsIs",
                    true_value: "TRUE",
                    false_value: "FALSE",
                    state: "checked",
                    newline: true,
                })
            },

            mmlrad: {
                el: new radioButton(config, {
                    label: partialCreditModel.t('rad2'),
                    no: "estimation",
                    increment: "mml",
                    value: "MML",
                    extraction: "ValueAsIs"
                })
            }

        };
        const content = {
            left: [objects.content_var.el.content],
            right: [objects.modelname.el.content, objects.destinationvars.el.content,
            objects.label1.el.content,
            objects.cmlrad.el.content, objects.stderr.el.content, objects.normalize.el.content,
            objects.mmlrad.el.content
            ],
            nav: {
                name: partialCreditModel.t('navigation'),
                icon: "icon-pc",
                modal: config.id
            }
        };
        super(config, objects, content);
        
        this.help = {
            title: partialCreditModel.t('help.title'),
            r_help: partialCreditModel.t('help.r_help'),  //r_help: "help(data,package='utils')",
            body: partialCreditModel.t('help.body')
        }
;
    }
}

module.exports = {
    render: () => new partialCreditModel().render()
}
