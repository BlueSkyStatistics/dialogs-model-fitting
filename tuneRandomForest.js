


class tuneRandomForest extends baseModal {
    static dialogId = 'tuneRandomForest'
    static t = baseModal.makeT(tuneRandomForest.dialogId)

    constructor() {
        var config = {
            id: tuneRandomForest.dialogId,
            label: tuneRandomForest.t('title'),
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
                    label: tuneRandomForest.t('dependentvar'),
                    no: "dependentvar",
                    filter: "String|Numeric|Logical|Ordinal|Nominal|Scale",
                    extraction: "Prefix|UseComma",
                    required: true,
                }), r: ['{{ var | safe}}']
            },
            independentvars: {
                el: new dstVariableList(config, {
                    label: tuneRandomForest.t('independentvars'),
                    no: "independentvars",
                    required: true,
                    filter: "Numeric|Logical|Ordinal|Nominal|Scale",
                    extraction: "NoPrefix|UseComma|Enclosed",
                }), r: ['{{ var | safe}}']
            },
            ntreetry: {
                el: new inputSpinner(config, {
                    no: "ntreetry",
                    label: tuneRandomForest.t('ntreetry'),
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
                    label: tuneRandomForest.t('stepfactor'),
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
                    label: tuneRandomForest.t('improve'),
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
                    label: tuneRandomForest.t('trace'),
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
                    label: tuneRandomForest.t('plot'),
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
                name: tuneRandomForest.t('navigation'),
                icon: "icon-tune",
                modal: config.id
            }
        };
        super(config, objects, content);
        
        this.help = {
            title: tuneRandomForest.t('help.title'),
            r_help: "help(data,package='utils')",
            body: tuneRandomForest.t('help.body')
        }
;
    }
}

module.exports = {
    render: () => new tuneRandomForest().render()
}
