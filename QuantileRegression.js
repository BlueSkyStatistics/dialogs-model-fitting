
var localization = {
    en: {
		label1: "To compare quantile regression model slopes, see \"Model Evaluation > Compare > Quant Reg Models\"",
		title: "Quantile Regression",
        navigation: "Quantile",
        modelname:"Enter model name",
        depvarlabel: "Dependent Variable",
		quantilelabel: "Quantile (0-1)",
		estgrplabel: "Estimation Method",
		brlabel: "Barrodale and Roberts",
		fnlabel: "Frisch-Newton",
		pfnlabel: "Frisch-Newton, preprocessing",
		sfnlabel: "Frisch-Newton, sparse",
		stderrgrplabel: "Standard Error Method",
		ranklabel: "Rank",
		iidlabel: "IID",
		nidlabel: "NID",
		kernallabel: "Kernal",
		bootstraplabel: "Bootstrap",
		bootsamplabel: "Bootstrap Samples",
        help: {
            title: "Quantile Regression",
            r_help: "help(rq, package = 'quantreg')",
            body: `
This fits a quantile regression model, which models a desired quantile (i.e. percentile) of the outcome variable.  A typical quantile to model is 0.5, i.e. the median.  
A model summary and parameter estimates with 95% confidence intervals are provided.
<br/><br/>
<b>Enter Model Name:</b>  the desired name of the model
<br/><br/>
<b>Dependent Variable:</b>  Specify the dependent variable for the model.  The desired quantile of this variable will be modeled.  This must be numeric.
<br/><br/>
<b>Formula Builder:</b>  Specify the model terms using formula notation.  Numeric, factor, ordered factor, and character variables are allowed.  Character variables will be coerced to factors.
<br/><br/>
<b>Quantile (0-1):</b>  Specify the desired quantile to model for the dependent variable.  0.5 (the median) is the default and is a typical quantity.
<br/><br/>
<b>Estimation Method:</b>  Specify the estimation method for the model parameters.  The Barrodale and Roberts method is the default and is efficient for models with 
several thousand observations.  The Frisch-Newton and the Frisch-Newton, preprocessing approach might be advantageous for large and very large problems, respectively, 
especially in cases with a small number of estimated parameters.  For large sample sizes with a large number of parameters, the Frisch-Newton, sparse method may be needed.  
See the references in the R Help for details.
<br/><br/>
<b>Standard Error Method:</b>  Specify the method used to estimate standard errors and confidence intervals.  The Rank method provides confidence intervals only, can be slow 
to run for larger sample sizes (n > 1000), and is based on inverting a rank test.  The IID method assumes the errors are independent and identically distributed (iid).  The NID 
method presumes local linearity in the quantile and computes a sandwich estimate using a local estimate of sparsity.  The Kernal method uses a kernal estimate of the sandwich.  
The Bootstrap method uses a re-sampling bootstrap approach to estimate the standard errors.  See the references in the R Help for details.
<br/><br/>
<b>Bootstrap Samples:</b>  Desired number of bootstrap samples for the bootstrap standard error approach.  The default is 2000 samples.
<br/><br/>
<b>Required R Packages:</b> quantreg, broom
		`}
    }
}

class QuantileRegression extends baseModal {
    constructor() {
        var config = {
            id: "QuantileRegression",
            label: localization.en.title,
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
			label1: { el: new labelVar(config, { label: localization.en.label1, h: 6 }) },
            modelname: {
                el: new input(config, {
                    no: 'modelname',
                    label: localization.en.modelname,
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
                    label: localization.en.depvarlabel,
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
				label: localization.en.quantilelabel,
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
				label: localization.en.estgrplabel, 
				style: "mt-3", 
				h:5
				})
			},			
			br: {
				el: new radioButton(config, {
				label: localization.en.brlabel,
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
				label: localization.en.fnlabel,
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
				label: localization.en.pfnlabel,
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
				label: localization.en.sfnlabel,
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
				label: localization.en.stderrgrplabel, 
				style: "mt-3", 
				h:5
				})
			},
			rank: {
				el: new radioButton(config, {
				label: localization.en.ranklabel,
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
				label: localization.en.iidlabel,
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
				label: localization.en.nidlabel,
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
				label: localization.en.kernallabel,
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
				label: localization.en.bootstraplabel,
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
				label: localization.en.bootsamplabel,
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
                name: localization.en.navigation,
                icon: "icon-linear_regression_white_comp",
                modal: config.id
            }
        }
        super(config, objects, content);
        this.help = localization.en.help;
    }
}
module.exports.item = new QuantileRegression().render()