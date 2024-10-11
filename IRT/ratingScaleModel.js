


class ratingScaleModel extends baseModal {
    static dialogId = 'ratingScaleModel'
    static t = baseModal.makeT(ratingScaleModel.dialogId)

    constructor() {
        var config = {
            id: ratingScaleModel.dialogId,
            label: ratingScaleModel.t('title'),
            modalType: "two",
            RCode: `
require(eRm);
require(TAM);

if (validateDataRatingScale(vars=c({{selected.destinationvars | safe}}),data= "{{dataset.name}}"))
{
    if ("{{selected.estimation | safe}}"=="CML")
    {
        {{selected.modelname | safe}} <- eRm::RSM({{dataset.name}}[,c({{selected.destinationvars | safe}})], se={{selected.stderr | safe}}, sum0={{selected.normalize | safe}}) 
        BSkySummaryeRm({{selected.modelname | safe}})
    }
    if ("{{selected.estimation | safe}}"=="MML")
    {
        {{selected.modelname | safe}} <- tam.mml({{dataset.name}}[,c({{selected.destinationvars | safe}})], irtmodel="RSM" ,verbose=FALSE) # this is the rating scale model
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
                    label: ratingScaleModel.t('modelname'),
                    placeholder: "",
                    required: true,
                    type: "character",
                    extraction: "TextAsIs",
                    value: "ratingScaleModel1",
                    overwrite: "dataset"
                })
            },
            destinationvars: {
                el: new dstVariableList(config, {
                    label: ratingScaleModel.t('destinationvars'),
                    no: "destinationvars",
                    required: true,
                    filter: "Numeric|Ordinal|Nominal|Scale",
                    extraction: "NoPrefix|UseComma|Enclosed",
                }), r: ['{{ var | safe}}']
            },


            label1: { el: new labelVar(config, { label: ratingScaleModel.t('estimationlbl'), style: "mt-2", h: 6 }) },
            cmlrad: {
                el: new radioButton(config, {
                    label: ratingScaleModel.t('rad1'),
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
                    label: ratingScaleModel.t('chk1'),
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
                    label: ratingScaleModel.t('chk2'),
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
                    label: ratingScaleModel.t('rad2'),
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
                name: ratingScaleModel.t('navigation'),
                icon: "icon-rs",
                modal: config.id
            }
        };
        super(config, objects, content);
        
        this.help = {
            title: ratingScaleModel.t('help.title'),
            r_help: "help(data,package='utils')",
            body: ratingScaleModel.t('help.body')
        }
;
    }
}

module.exports = {
    render: () => new ratingScaleModel().render()
}
