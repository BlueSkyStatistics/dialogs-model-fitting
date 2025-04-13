/**
  * This file is protected by copyright (c) 2023-2025 by BlueSky Statistics, LLC.
  * All rights reserved. The copy, modification, or distribution of this file is not
  * allowed without the prior written permission from BlueSky Statistics, LLC.
 */




class QuantileRegression extends baseModal {
    static dialogId = 'QuantileRegression'
    static t = baseModal.makeT(QuantileRegression.dialogId)

    constructor() {
        var config = {
            id: QuantileRegression.dialogId,
            label: QuantileRegression.t('title'),
			splitProcessing: true,
            modalType: "two",
            RCode: `
library(quantreg)
library(broom)
BSkyFormula = {{selected.depvar | safe}} ~ {{selected.modelterms | safe}}\n
{{selected.modelname | safe}} <- rq({{selected.depvar | safe}} ~ {{selected.modelterms | safe}}, tau = {{selected.quantile | safe}}, data = {{dataset.name}}, method="{{selected.estgrp | safe}}", na.action=na.exclude)

samp.size <- length({{selected.modelname | safe}}$fitted.values)
npar <- length({{selected.modelname | safe}}$coefficients)

BSkyFormat(data.frame(N=c(samp.size), Outcome=c("{{selected.depvar | safe}}")), singleTableOutputHeader="Sample Size and Outcome")
BSkyFormat(t(glance({{selected.modelname | safe}})), singleTableOutputHeader="Model Summary")

{{if ((options.selected.stderrgrp=="rank") | (options.selected.stderrgrp=="iid") | (options.selected.stderrgrp=="nid") | (options.selected.stderrgrp=="ker")) }}
# if se is rank, iid, nid, or ker
mod.coef <- summary({{selected.modelname | safe}}, se="{{selected.stderrgrp | safe}}", alpha=.05)$coefficients
{{#else}}
# if se is boot
mod.coef <- summary({{selected.modelname | safe}}, se="boot", R={{selected.bootsamp | safe}})$coefficients
{{/if}}

{{if ((options.selected.stderrgrp=="iid") | (options.selected.stderrgrp=="nid") | (options.selected.stderrgrp=="ker") | (options.selected.stderrgrp=="boot")) }}
# if se is iid, nid, ker, or boot then need to compute CI ourselves, as output only gives standard error
conf.lower <- mod.coef[ ,"Value"] - qt(c(.025),df=samp.size-npar,lower.tail=FALSE)*mod.coef[ ,"Std. Error"]
conf.upper <- mod.coef[ ,"Value"] + qt(c(.025),df=samp.size-npar,lower.tail=FALSE)*mod.coef[ ,"Std. Error"]
mod.coef <- cbind(mod.coef, conf.lower, conf.upper)
{{/if}}

BSkyFormat(mod.coef, singleTableOutputHeader="Parameter Estimates and 95% Confidence Intervals")

#Setting attributes to support scoring
attr(.GlobalEnv\${{selected.modelname | safe}},"depvar") = "{{selected.depvar | safe}}"
attr(.GlobalEnv\${{selected.modelname | safe}},"indepvar") = paste ("'", paste (base::all.vars(BSkyFormula[-2]), collapse="','"), "'", sep="")
attr(.GlobalEnv\${{selected.modelname | safe}},"classDepVar")= class({{dataset.name}}[, c("{{selected.depvar | safe}}")])
attr(.GlobalEnv\${{selected.modelname | safe}},"depVarSample")= sample({{dataset.name}}[, c("{{selected.depvar | safe}}")], size = 2, replace = TRUE)
if (exists("BSkyFormula")) rm (BSkyFormula)
detach(package:quantreg)
detach(package:SparseM)
`
        }
        var objects = {
            content_var: {
                el: new srcVariableList(config, {
                    action: "move"
                })
            },
			label1: { el: new labelVar(config, { label: QuantileRegression.t('label1'), h: 6 }) },
            modelname: {
                el: new input(config, {
                    no: 'modelname',
                    label: QuantileRegression.t('modelname'),
					style: "mb-3",
                    placeholder: "QuantRegModel1",
                    required: true,
                    type: "character",
                    extraction: "TextAsIs",
                    value: "QuantRegModel1"
                })
            },
            depvar: {
                el: new dstVariable(config, {
                    label: QuantileRegression.t('depvarlabel'),
                    no: "depvar",
                    filter: "Numeric|Scale",
                    required: true,
                    extraction: "NoPrefix|UseComma",
                })
            },
            modelterms: {
                el: new formulaBuilder(config, {
                    no: "modelterms",
					required: true
                })
            }, 
			quantile: {
				el: new inputSpinner(config, {
				no: 'quantile',
				label: QuantileRegression.t('quantilelabel'),
				style: "mt-5",
				min: 0,
				max: 1,
				step: 0.01,
				value: 0.5,
				extraction: "NoPrefix|UseComma"
				})
			},
			estgrplabel: {
				el: new labelVar(config, {
				label: QuantileRegression.t('estgrplabel'), 
				style: "mt-3", 
				h:5
				})
			},			
			br: {
				el: new radioButton(config, {
				label: QuantileRegression.t('brlabel'),
				no: "estgrp",
				style: "ml-3",
				increment: "br",
				value: "br",
				state: "checked",
				extraction: "ValueAsIs"
				})
			},
 			fn: {
				el: new radioButton(config, {
				label: QuantileRegression.t('fnlabel'),
				no: "estgrp",
				style: "ml-3",
				increment: "fn",
				value: "fn",
				state: "",
				extraction: "ValueAsIs"
				})
			},           
 			pfn: {
				el: new radioButton(config, {
				label: QuantileRegression.t('pfnlabel'),
				no: "estgrp",
				style: "ml-3",
				increment: "pfn",
				value: "pfn",
				state: "",
				extraction: "ValueAsIs"
				})
			},
 			sfn: {
				el: new radioButton(config, {
				label: QuantileRegression.t('sfnlabel'),
				no: "estgrp",
				style: "ml-3",
				increment: "sfn",
				value: "sfn",
				state: "",
				extraction: "ValueAsIs"
				})
			},
			stderrgrplabel: {
				el: new labelVar(config, {
				label: QuantileRegression.t('stderrgrplabel'), 
				style: "mt-3", 
				h:5
				})
			},
			rank: {
				el: new radioButton(config, {
				label: QuantileRegression.t('ranklabel'),
				no: "stderrgrp",
				style: "ml-3",
				increment: "rank",
				value: "rank",
				state: "checked",
				extraction: "ValueAsIs"
				})
			},
 			iid: {
				el: new radioButton(config, {
				label: QuantileRegression.t('iidlabel'),
				no: "stderrgrp",
				style: "ml-3",
				increment: "iid",
				value: "iid",
				state: "",
				extraction: "ValueAsIs"
				})
			},
 			nid: {
				el: new radioButton(config, {
				label: QuantileRegression.t('nidlabel'),
				no: "stderrgrp",
				style: "ml-3",
				increment: "nid",
				value: "nid",
				state: "",
				extraction: "ValueAsIs"
				})
			},
 			kernal: {
				el: new radioButton(config, {
				label: QuantileRegression.t('kernallabel'),
				no: "stderrgrp",
				style: "ml-3",
				increment: "kernal",
				value: "ker",
				state: "",
				extraction: "ValueAsIs"
				})
			},
 			bootstrap: {
				el: new radioButton(config, {
				label: QuantileRegression.t('bootstraplabel'),
				no: "stderrgrp",
				style: "ml-3",
				increment: "bootstrap",
				value: "boot",
				state: "",
				extraction: "ValueAsIs"
				})
			},
			bootsamp: {
				el: new inputSpinner(config, {
				no: 'bootsamp',
				label: QuantileRegression.t('bootsamplabel'),
				style: "ml-5",
				min: 100,
				max: 1000000,
				step: 100,
				value: 2000,
				extraction: "NoPrefix|UseComma"
				})
			}			
        };

       
        const content = {
			head: [objects.label1.el.content],
            left: [objects.content_var.el.content],
            right: [
                objects.modelname.el.content, objects.depvar.el.content, objects.modelterms.el.content, objects.quantile.el.content,
				objects.estgrplabel.el.content, objects.br.el.content, objects.fn.el.content, objects.pfn.el.content, objects.sfn.el.content,
				objects.stderrgrplabel.el.content, objects.rank.el.content, objects.iid.el.content, objects.nid.el.content, objects.kernal.el.content, objects.bootstrap.el.content,
				objects.bootsamp.el.content
            ],
            nav: {
                name: QuantileRegression.t('navigation'),
                icon: "icon-linear_regression_white_comp",
                modal: config.id
            }
        }
        super(config, objects, content);
        
        this.help = {
            title: QuantileRegression.t('help.title'),
            r_help: QuantileRegression.t('help.r_help'),  //r_help: "help(data,package='utils')",
            body: QuantileRegression.t('help.body')
        }
;
    }
}

module.exports = {
    render: () => new QuantileRegression().render()
}
