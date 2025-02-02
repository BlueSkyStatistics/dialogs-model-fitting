



class multiNomialLogistic extends baseModal {
    static dialogId = 'multiNomialLogistic'
    static t = baseModal.makeT(multiNomialLogistic.dialogId)

    constructor() {
        var config = {
            id: multiNomialLogistic.dialogId,
            label: multiNomialLogistic.t('title'),
            modalType: "two",
            RCode: `
require(nnet)
{{selected.modelname | safe}} = nnet::multinom( {{selected.dependent | safe}}~{{selected.formula | safe}}, weights ={{selected.destination2 | safe}} , na.action = na.exclude, data={{dataset.name}}, trace=FALSE)
BSky_Multinom_Summary_{{selected.modelname | safe}} = summary({{selected.modelname | safe}}, cor = FALSE, Wald=TRUE)
BSkyFormat(BSky_Multinom_Summary_{{selected.modelname | safe}})
#remove(BSky_Multinom_Summary_{{selected.modelname | safe}})
#remove({{selected.modelname | safe}})

#Coefficients/Std. Errors
BSkyFormat(summary({{selected.modelname | safe}})$coefficients/summary({{selected.modelname | safe}})$standard.errors, singleTableOutputHeader = "Coefficients/Std. Errors")

#2-tailed Z test
BSkyFormat((1 - pnorm(abs(summary({{selected.modelname | safe}})$coefficients/summary({{selected.modelname | safe}})$standard.errors), 0, 1)) * 2,singleTableOutputHeader = "2-tailed Z test")

#Exponentiated  Coefficients
BSkyFormat(exp(coef({{selected.modelname | safe}})),singleTableOutputHeader = "Exponentiated  Coefficients")

#Adding attributes to support scoring
attr(.GlobalEnv\${{selected.modelname | safe}},"classDepVar")= class({{dataset.name}}[, c("{{selected.dependent | safe}}")])
attr(.GlobalEnv\${{selected.modelname | safe}},"depVarSample")= sample({{dataset.name}}[, c("{{selected.dependent | safe}}")], size = 2, replace = TRUE)

`
        };
        var objects = {
            content_var: { el: new srcVariableList(config, {action: "move"}) },
            modelname: {
                el: new input(config, {
                    no: 'modelname',
                    label: multiNomialLogistic.t('modelname'),
                    placeholder: "",
                    required: true,
                    type: "character",
                    extraction: "TextAsIs",
                    value: "MLM",
                    overwrite: "dataset"
                })
            },
            dependent: {
                el: new dstVariable(config, {
                    label: multiNomialLogistic.t('dependent'),
                    no: "dependent",
                    filter: "Numeric|Date|Logical|Ordinal|Nominal|Scale",
                    extraction: "NoPrefix|UseComma",
                    required: true,
                }), r: ['{{ var | safe}}']
            },
            formulaBuilder: {
                el: new formulaBuilder(config, {
                    no: "formula",
                    required:true
                })
            },
            generateplotchk: {
                el: new checkbox(config, {
                    label: multiNomialLogistic.t('generateplotchk'),
                    no: "generateplotchk",
                    bs_type: "valuebox",
                    extraction: "BooleanValue",
                    true_value: "TRUE",
                    false_value: "FALSE",
                })
            },
            destination2: {
                el: new dstVariable(config, {
                    label: multiNomialLogistic.t('destination2'),
                    no: "destination2",
                    filter: "String|Numeric|Date|Logical|Ordinal|Nominal|Scale",
                    extraction: "NoPrefix|UseComma",
                }), r: ['{{ var | safe}}']
            },
        };
        const content = {
            left: [objects.content_var.el.content],
            right: [objects.modelname.el.content, objects.dependent.el.content, objects.formulaBuilder.el.content,  objects.destination2.el.content],
            nav: {
                name: multiNomialLogistic.t('navigation'),
                icon: "icon-ml",
                modal: config.id
            }
        };
        super(config, objects, content);
        
        this.help = {
            title: multiNomialLogistic.t('help.title'),
            r_help: multiNomialLogistic.t('help.r_help'),  //r_help: "help(data,package='utils')",
            body: multiNomialLogistic.t('help.body')
        }
;
    }
}

module.exports = {
    render: () => new multiNomialLogistic().render()
}
