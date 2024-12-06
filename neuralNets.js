


class neuralNets extends baseModal {
    static dialogId = 'neuralNets'
    static t = baseModal.makeT(neuralNets.dialogId)

    constructor() {
        var config = {
            id: neuralNets.dialogId,
            label: neuralNets.t('title'),
            modalType: "two",
            RCode: `
require(neuralnet);
require(NeuralNetTools);
#Setting a seed
set.seed({{selected.seed | safe}})
#Creating the model
{{selected.model | safe}}<-neuralnet::neuralnet( formula={{selected.dependentvar | safe}} ~ {{selected.independentvars | safe}}, data = {{dataset.name}}, hidden = c({{selected.layers | safe}}),threshold ={{selected.threshold | safe}},  stepmax = {{selected.iter | safe}}, rep ={{selected.rep | safe}}, algorithm= "{{selected.tf | safe}}",learningrate.factor = list(minus = {{selected.minus | safe}}, plus = {{selected.upper | safe}}),lifesign = '{{selected.lifesign | safe}}', lifesign.step = {{selected.lifesignstep | safe}}, err.fct = '{{selected.errfct | safe}}', act.fct = '{{selected.OutActFunc | safe}}', linear.output = {{selected.linearoutput | safe}},  likelihood = {{selected.likelihood | safe}})
if (!is.null({{selected.model | safe}}))
{
    #Plotting the model
    NeuralNetTools::plotnet({{selected.model | safe}})
    plot({{selected.model | safe}},rep="best")
    #Listing weights
    NeuralNetTools::neuralweights({{selected.model | safe}})
    #Setting attributes to support scoring
    attr(.GlobalEnv\${{selected.model | safe}},"depvar")="'{{selected.dependentvar | safe }}'"
    attr(.GlobalEnv\${{selected.model | safe}},"indepvar")=paste(stringr::str_split("{{selected.independentvars}}",fixed("+")),sep=",", collapse="")
    attr(.GlobalEnv\${{selected.model | safe}},"classDepVar")= class({{dataset.name}}[, c("{{selected.dependentvar | safe}}")])
    attr(.GlobalEnv\${{selected.model | safe}},"depVarSample")= sample({{dataset.name}}[, c("{{selected.dependentvar | safe}}")], size = 2, replace = TRUE)
}
`
        }
        var objects =
        {
            label1: { el: new labelVar(config, { label: neuralNets.t('label1'), h: 6 }) },
            content_var: { el: new srcVariableList(config, {action: "move"}) },
            model: {
                el: new input(config, {
                    no: 'model',
                    label: neuralNets.t('model'),
                    placeholder: "",
                    extraction: "NoPrefix|UseComma",
                    required: true,
                    type: "character",
                    overwrite: "dataset"
                })
            },
            dependentvar: {
                el: new dstVariableList(config, {
                    label: neuralNets.t('dependentvar'),
                    no: "dependentvar",
                    filter: "Numeric|Logical|Ordinal|Nominal|Scale",
                    extraction: "NoPrefix|UsePlus",
                    required: true,
                }), r: ['{{ var | safe}}']
            },
            independentvars: {
                el: new dstVariableList(config, {
                    label: neuralNets.t('independentvars'),
                    no: "independentvars",
                    filter: "Numeric|Ordinal|Nominal|Scale",
                    extraction: "NoPrefix|UsePlus",
                    required: true,
                }), r: ['{{ var | safe}}']
            },
            seed: {
                el: new inputSpinner(config, {
                    no: "seed",
                    label: neuralNets.t('seed'),
                    min: 0,
                    max: 100000000000,
                    step: 1,
                    value: 12345,
                    extraction: "NoPrefix|UseComma"
                })
            },
            iter: {
                el: new inputSpinner(config, {
                    no: "iter",
                    label: neuralNets.t('iter'),
                    min: 0,
                    max: 100000000000,
                    step: 1000,
                    value: 10000,
                    extraction: "NoPrefix|UseComma"
                })
            },
            tf: {
                el: new comboBox(config, {
                    no: 'tf',
                    label: neuralNets.t('tf'),
                    multiple: false,
                    extraction: "NoPrefix|UseComma",
                    default: "rprop+",
                    options: ["rprop+", "rprop-", "sag", "slr",]
                })
            },
            threshold: {
                el: new inputSpinner(config, {
                    no: "threshold",
                    label: neuralNets.t('threshold'),
                    min: 0,
                    max: 100000000000,
                    step: 0.01,
                    value: 0.01,
                    extraction: "NoPrefix|UseComma"
                })
            },
            label2: { el: new labelVar(config, { label: neuralNets.t('label2'), style: "mt-4", h: 6 }) },
            layers: {
                el: new input(config, {
                    no: "layers",
                    allow_spaces:true,
                    label: neuralNets.t('layers'),
                    placeholder: "",
                    extraction: "TextAsIs",
                    value: 5,
                    required: true,
                })
            },
            OutActFunc: {
                el: new comboBox(config, {
                    no: "OutActFunc",
                    label: neuralNets.t('OutActFunc'),
                    multiple: false,
                    extraction: "NoPrefix|UseComma",
                    default: "logistic",
                    options: ["logistic", "tanh"]
                })
            },
            rep: {
                el: new inputSpinner(config, {
                    no: "rep",
                    label: neuralNets.t('rep'),
                    min: 1,
                    max: 99999999,
                    step: 100,
                    value: 1,
                    extraction: "NoPrefix|UseComma"
                })
            },
            label3: { el: new labelVar(config, { no: 'label3', label: neuralNets.t('label3'), style:"mt-3",h: 6 }) },
            minus: {
                el: new inputSpinner(config, {
                    no: "minus",
                    label: neuralNets.t('minus'),
                    min: 0,
                    max: 10000000000,
                    step: 0.1,
                    value: 0.5,
                    extraction: "NoPrefix|UseComma"
                })
            },
            upper: {
                el: new inputSpinner(config, {
                    no: "upper",
                    label: neuralNets.t('upper'),
                    min: 0,
                    max: 99999999,
                    step: 0.1,
                    value: 1.2,
                    extraction: "NoPrefix|UseComma"
                })
            },
            lifesign: {
                el: new comboBox(config, {
                    no: 'lifesign',
                    label: neuralNets.t('lifesign'),
                    multiple: false,
                    extraction: "NoPrefix|UseComma",
                    options: ["none", "minimal", "full"],
                    default: "none"
                })
            },
            lifesignstep: {
                el: new inputSpinner(config, {
                    no: "lifesignstep",
                    label: neuralNets.t('lifesignstep'),
                    min: 1,
                    max: 9999999999,
                    step: 1000,
                    value: 1000,
                    extraction: "NoPrefix|UseComma"
                })
            },
            errfct: {
                el: new comboBox(config, {
                    no: "errfct",
                    label: neuralNets.t('errfct'),
                    multiple: false,
                    extraction: "NoPrefix|UseComma",
                    options: ["sse", "ce"],
                    default: "sse"
                })
            },
            linearoutput: {
                el: new comboBox(config, {
                    no: "linearoutput",
                    label: neuralNets.t('linearoutput'),
                    multiple: false,
                    extraction: "NoPrefix|UseComma",
                    options: ["TRUE", "FALSE"],
                    default: "TRUE"
                })
            },
            likelihood: {
                el: new comboBox(config, {
                    no: "likelihood",
                    label: neuralNets.t('likelihood'),
                    multiple: false,
                    extraction: "NoPrefix|UseComma",
                    options: ["TRUE", "FALSE"],
                    default: "FALSE"
                }
                )
            },
        };
        var advanced = {
            el: new optionsVar(config, {
                no: "advanced",
                name: neuralNets.t('advanced_lbl'),
                content: [
                    objects.rep.el,
                    objects.label3.el,
                    objects.minus.el,
                    objects.upper.el,
                    objects.lifesign.el,
                    objects.lifesignstep.el,
                    objects.errfct.el,
                    objects.linearoutput.el,
                    objects.likelihood.el,
                ]
            })
        };
        const content = {
            head: [objects.label1.el.content],
            left: [objects.content_var.el.content],
            right: [objects.model.el.content, objects.dependentvar.el.content, objects.independentvars.el.content,],
            bottom: [objects.seed.el.content, objects.iter.el.content, objects.threshold.el.content, objects.tf.el.content, objects.label2.el.content, objects.layers.el.content, objects.OutActFunc.el.content, advanced.el.content],
            nav: {
                name: neuralNets.t('navigation'),
                icon: "icon-brain",
                modal: config.id
            }
        };
        super(config, objects, content);
        
        this.help = {
            title: neuralNets.t('help.title'),
            r_help: "help(data,package='utils')",
            body: neuralNets.t('help.body')
        }
;
    }
}

module.exports = {
    render: () => new neuralNets().render()
}
