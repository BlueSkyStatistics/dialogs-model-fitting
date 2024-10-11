


class multiLayerPerceptron extends baseModal {
    static dialogId = 'multiLayerPerceptron'
    static t = baseModal.makeT(multiLayerPerceptron.dialogId)

    constructor() {
        var config = {
            id: multiLayerPerceptron.dialogId,
            label: multiLayerPerceptron.t('title'),
            modalType: "two",
            RCode: `
require(RSNNS);
require(NeuralNetTools);
#Setting a seed
set.seed({{selected.seed | safe}})
#Creating the model
if ( class({{dataset.name}}[, c({{selected.dependentvar | safe}})]) == "factor")
{
    {{selected.model | safe}}<-mlp( x={{dataset.name}}[, c({{selected.independentvars | safe}})], y=RSNNS::decodeClassLabels({{dataset.name}}[, c({{selected.dependentvar | safe}})]), size = {{selected.layers | safe}}, maxit = {{selected.iter | safe}},
    learnFunc = "{{selected.tf | safe}}" {{if (options.selected.learnfuncparams !== "")}}, learnFuncParams = c({{selected.learnfuncparams | safe}}) {{/if}})
} else
{
    {{selected.model | safe}}<-mlp( x={{dataset.name}}[, c({{selected.independentvars | safe}})], y={{dataset.name}}[, c({{selected.dependentvar | safe}})], size = {{selected.layers | safe}}, maxit = {{selected.iter | safe}},
    learnFunc = "{{selected.tf | safe}}" {{if (options.selected.learnfuncparams !== "")}}, learnFuncParams = c({{selected.learnfuncparams | safe}}) {{/if}})
}
local({
    #Summarizing the model
    BSkyRes<-summary({{selected.model | safe}})
    #Extracting and displaying model information
    BSkyInfo<-extractNetInfo({{selected.model | safe}})
    BSkyFormat(BSkyInfo)
    #Plotting the neural net
    NeuralNetTools::plotnet({{selected.model | safe}})
    #Setting attributes to support scoring
    attr(.GlobalEnv\${{selected.model | safe}},"depvar")="{{selected.dependentvar | safe}}"
    attr(.GlobalEnv\${{selected.model | safe}},"indepvar")="{{selected.independentvars | safe}}"
    attr(.GlobalEnv\${{selected.model | safe}},"classDepVar")= class({{dataset.name}}[, c({{selected.dependentvar | safe}})])
    attr(.GlobalEnv\${{selected.model | safe}},"depVarSample")= sample({{dataset.name}}[, c({{selected.dependentvar | safe}})], size = 2, replace = TRUE)
})
`
        }
        var objects = {
            label1: { el: new labelVar(config, { label: multiLayerPerceptron.t('label1'), h: 6 }) },
            content_var: { el: new srcVariableList(config, {action: "move"}) },
            model: {
                el: new input(config, {
                    no: 'model',
                    label: multiLayerPerceptron.t('model'),
                    placeholder: "",
                    value: "mlp1",
                    extraction: "NoPrefix|UseComma",
                    required: true,
                    type: "character",
                    overwrite: "dataset"
                })
            },
            dependentvar: {
                el: new dstVariableList(config, {
                    label: multiLayerPerceptron.t('dependentvar'),
                    no: "dependentvar",
                    filter: "Numeric|Ordinal|Nominal|Scale",
                    extraction: "NoPrefix|UseComma|Enclosed",
                    required: true,
                }), r: ['{{ var | safe}}']
            },
            independentvars: {
                el: new dstVariableList(config, {
                    label: multiLayerPerceptron.t('independentvars'),
                    no: "independentvars",
                    filter: "Numeric|Ordinal|Nominal|Scale",
                    extraction: "NoPrefix|UseComma|Enclosed",
                    required: true,
                }), r: ['{{ var | safe}}']
            },
            seed: {
                el: new inputSpinner(config, {
                    no: "seed",
                    label: multiLayerPerceptron.t('seed'),
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
                    label: multiLayerPerceptron.t('iter'),
                    min: 0,
                    max: 100000000000,
                    step: 100,
                    value: 100,
                    extraction: "NoPrefix|UseComma"
                })
            },
            tf: {
                el: new comboBox(config, {
                    no: 'tf',
                    label: multiLayerPerceptron.t('tf'),
                    multiple: false,
                    extraction: "NoPrefix|UseComma",
                    default: "Std_Backpropagation",
                    options: ["Std_Backpropagation", "BackpropBatch", "BackpropChunk", "BackpropMomentum", "BackpropWeightDecay", "Rprop", "Quickprop", "SCG"]
                })
            },
            label2: { el: new labelVar(config, { label: multiLayerPerceptron.t('label2'), style: "mt-4",h: 6 }) },
            layers: {
                el: new input(config, {
                    no: "layers",
                    label: multiLayerPerceptron.t('layers'),
                    allow_spaces:true,
                    placeholder: "",
                    extraction: "TextAsIs",
                    value: 5,
                    wrapped: 'c(%val%)',
                    required: true,
                })
            },
            learnfuncparams: {
                el: new input(config, {
                    no: "learnfuncparams",
                    allow_spaces:true,
                    label: multiLayerPerceptron.t('learnfuncparams'),
                    placeholder: "",
                    extraction: "TextAsIs",
                    value: "",
                })
            },
        }
        const content = {
            head: [objects.label1.el.content],
            left: [objects.content_var.el.content],
            right: [objects.model.el.content, objects.dependentvar.el.content, objects.independentvars.el.content,],
            bottom: [objects.seed.el.content, objects.iter.el.content, objects.tf.el.content, objects.label2.el.content, objects.layers.el.content, objects.learnfuncparams.el.content],
            nav: {
                name: multiLayerPerceptron.t('navigation'),
                icon: "icon-mlp",
                modal: config.id
            }
        }
        super(config, objects, content);
        
        this.help = {
            title: multiLayerPerceptron.t('help.title'),
            r_help: "help(data,package='utils')",
            body: multiLayerPerceptron.t('help.body')
        }
;
    }
}

module.exports = {
    render: () => new multiLayerPerceptron().render()
}
