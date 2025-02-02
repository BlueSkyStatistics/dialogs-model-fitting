


class simpleRaschModel extends baseModal {
    static dialogId = 'simpleRaschModel'
    static t = baseModal.makeT(simpleRaschModel.dialogId)

    constructor() {
        var config = {
            id: simpleRaschModel.dialogId,
            label: simpleRaschModel.t('title'),
            modalType: "two",
            RCode: `
require(eRm);
require(TAM);
if (!validateDataRasch( vars =c({{selected.destinationvars | safe}}), data ="{{dataset.name}}"))
{
    cat("\nAll variables being analyzed to create a simple  RASCH model must be dichotomous with unique values of either 0 or 1. Please recode the variables (see Data->Recode) to meet these requirements and re-run the analysis")
} else
{
    if ("{{selected.estimation | safe}}"=="CML")
    {
        {{selected.modelname | safe}} <- eRm::RM({{dataset.name}}[,c({{selected.destinationvars | safe}})], se={{selected.stderr | safe}}, sum0={{selected.normalize | safe}}) 
        BSkySummaryeRm({{selected.modelname | safe}})
    }
    if ("{{selected.estimation | safe}}"=="MML")
    {
        {{selected.modelname | safe}}<-TAM::tam.mml({{dataset.name}}[,c({{selected.destinationvars | safe}})]) 
        BSkySummary.tam.mml({{selected.modelname | safe}},verbose=FALSE)
    }
}

`
        };
        var objects = {
            content_var: { el: new srcVariableList(config, { action: "move" }) },
            modelname: {
                el: new input(config, {
                    no: 'modelname',
                    label: simpleRaschModel.t('modelname'),
                    placeholder: "",
                    required: true,
                    type: "character",
                    extraction: "TextAsIs",
                    value: "simpleRaschModel1",
                    overwrite: "dataset"
                })
            },
            destinationvars: {
                el: new dstVariableList(config, {
                    label: simpleRaschModel.t('destinationvars'),
                    no: "destinationvars",
                    required: true,
                    filter: "Numeric|Ordinal|Nominal|Scale",
                    extraction: "NoPrefix|UseComma|Enclosed",
                }), r: ['{{ var | safe}}']
            },


            label1: { el: new labelVar(config, { label: simpleRaschModel.t('estimationlbl'), style: "mt-2", h: 6 }) },
            cmlrad: {
                el: new radioButton(config, {
                    label: simpleRaschModel.t('rad1'),
                    no: "estimation",
                    increment: "cml",
                    value: "CML",
                    state: "checked",
                    extraction: "ValueAsIs",
                    dependent_objects: ['stderr', 'normalize']
                })
            },
            stderr: {
                el: new checkbox(config, {
                    label: simpleRaschModel.t('chk1'),
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
                    label: simpleRaschModel.t('chk2'),
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
                    label: simpleRaschModel.t('rad2'),
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
                name: simpleRaschModel.t('navigation'),
                icon: "icon-s",
                modal: config.id
            }
        };
        super(config, objects, content);
        
        this.help = {
            title: simpleRaschModel.t('help.title'),
            r_help: simpleRaschModel.t('help.r_help'),  //r_help: "help(data,package='utils')",
            body: simpleRaschModel.t('help.body')
        }
;
    }
}

module.exports = {
    render: () => new simpleRaschModel().render()
}
