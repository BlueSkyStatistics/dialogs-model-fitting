


class optimalNoTrees extends baseModal {
    static dialogId = 'optimalNoTrees'
    static t = baseModal.makeT(optimalNoTrees.dialogId)

    constructor() {
        var config = {
            id: optimalNoTrees.dialogId,
            label: optimalNoTrees.t('title'),
            modalType: "two",
            RCode: `
require(randomForest)
oobdf <- BSkyMultiRandomForest(x = {{dataset.name}}[,c({{selected.independentvars | safe}})], y={{selected.dependentvar | safe}}, startval={{selected.startval | safe}}, endval={{selected.endval | safe}}, stepval={{selected.stepval | safe}}{{if (options.selected.mtry !== "")}} , mtry = {{selected.mtry | safe}}  {{/if}}) 
BSkyFormat(oobdf, singleTableOutputHeader="Results")          
`
        };
        var objects = {
            content_var: { el: new srcVariableList(config) },
            dependentvar: {
                el: new dstVariable(config, {
                    label: optimalNoTrees.t('dependentvar'),
                    no: "dependentvar",
                    filter: "String|Numeric|Logical|Ordinal|Nominal|Scale",
                    extraction: "Prefix|UseComma",
                    required: true,
                }), r: ['{{ var | safe}}']
            },
            independentvars: {
                el: new dstVariableList(config, {
                    label: optimalNoTrees.t('independentvars'),
                    no: "independentvars",
                    required: true,
                    filter: "Numeric|Logical|Ordinal|Nominal|Scale",
                    extraction: "NoPrefix|UseComma|Enclosed",
                }), r: ['{{ var | safe}}']
            },
            label1: { el: new labelVar(config, { label: optimalNoTrees.t('label1'), h: 6 }) },
            startval: {
                el: new inputSpinner(config, {
                    no: "startval",
                    label: optimalNoTrees.t('startval'),
                    min: 1,
                    max: 999999999,
                    step: 1,
                    value: 200,
                    extraction: "NoPrefix|UseComma"
                })
            },
            endval: {
                el: new inputSpinner(config, {
                    no: "endval",
                    label: optimalNoTrees.t('endval'),
                    min: 1,
                    max: 999999999,
                    step: 1,
                    value: 500,
                    extraction: "NoPrefix|UseComma"
                })
            },
            stepval: {
                el: new inputSpinner(config, {
                    no: "stepval",
                    label: optimalNoTrees.t('stepval'),
                    min: 1,
                    max: 999999999,
                    step: 1,
                    value: 50,
                    extraction: "NoPrefix|UseComma"
                })
            },
            mtry: {
                el: new inputSpinner(config, {
                    no: "mtry",
                    label: optimalNoTrees.t('mtry'),
                    min: 0,
                    max: 999999999,
                    step: 1,
                    value: 2,
                    extraction: "NoPrefix|UseComma"
                })
            },
        };
        const content = {
            left: [objects.content_var.el.content],
            right: [objects.dependentvar.el.content, objects.independentvars.el.content, objects.label1.el.content, objects.startval.el.content, objects.endval.el.content, objects.stepval.el.content, objects.mtry.el.content],
            nav: {
                name: optimalNoTrees.t('navigation'),
                icon: "icon-optimize",
                modal: config.id
            }
        };
        super(config, objects, content);
        
        this.help = {
            title: optimalNoTrees.t('help.title'),
            r_help: optimalNoTrees.t('help.r_help'),  //r_help: "help(data,package='utils')",
            body: optimalNoTrees.t('help.body')
        }
;
    }
}

module.exports = {
    render: () => new optimalNoTrees().render()
}
