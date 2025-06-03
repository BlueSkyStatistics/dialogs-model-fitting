/**
  * This file is protected by copyright (c) 2023-2025 by BlueSky Statistics, LLC.
  * All rights reserved. The copy, modification, or distribution of this file is not
  * allowed without the prior written permission from BlueSky Statistics, LLC.
 */



var localization = {
    en: {
        title: "Multinomial Logit",
        navigation: "Multinomial Logit",
        modelname: "Enter model name",
        dependent: "Dependent variable",
        independent: "Independent variable(s)",
        generateplotchk: "Plot residuals vs fitted, normal Q-Q , scale-location and residuals vs leverage",
        destination2: "Specify a variable with weights",
        help: {
            title: "Multi-nomial Logit",
            r_help: "help(multinom, package=nnet)",
            body: `
            <b>Description</b></br>
            Fits multinomial log-linear models via neural networks.
            <br/>
            <b>Usage</b>
            <br/>
            <code> 
            multinom(formula, data, weights, subset, na.action,<br/>
                     contrasts = NULL, Hess = FALSE, summ = 0, censored = FALSE,<br/>
                     model = FALSE, ...)<br/>
            </code> <br/>
            <b>Arguments</b><br/>
            <ul>
            <li>
            formula: a formula expression as for regression models, of the form response ~ predictors. The response should be a factor or a matrix with K columns, which will be interpreted as counts for each of K classes. A log-linear model is fitted, with coefficients zero for the first class. An offset can be included: it should be a numeric matrix with K columns if the response is either a matrix with K columns or a factor with K >= 2 classes, or a numeric vector for a response factor with 2 levels. See the documentation of formula() for other details.
            </li>
            <li>
            data: an optional data frame in which to interpret the variables occurring in formula.
            </li>
            <li>
            weights: optional case weights in fitting.
            </li>
            <li>
            subset: expression saying which subset of the rows of the data should be used in the fit. All observations are included by default.
            </li>
            <li>
            na.action: a function to filter missing data.
            </li>
            <li>
            contrasts: a list of contrasts to be used for some or all of the factors appearing as variables in the model formula.
            </li>
            <li>
            Hess: logical for whether the Hessian (the observed/expected information matrix) should be returned.
            </li>
            <li>
            summ: integer; if non-zero summarize by deleting duplicate rows and adjust weights. Methods 1 and 2 differ in speed (2 uses C); method 3 also combines rows with the same X and different Y, which changes the baseline for the deviance.
            </li>
            <li>
            censored: If Y is a matrix with K columns, interpret the entries as one for possible classes, zero for impossible classes, rather than as counts.
            </li>
            <li>
            model: logical. If true, the model frame is saved as component model of the returned object.
            </li>
            <li>
            ... additional arguments for nnet
            </li>
            </ul>
            <b>Details</b></br>
            multinom calls nnet. The variables on the rhs of the formula should be roughly scaled to [0,1] or the fit will be slow or may not converge at all.</br>
            <b>Value</b><br/>
            A nnet object with additional components:<br/>
            <li>
            deviance: the residual deviance, compared to the full saturated model (that explains individual observations exactly). Also, minus twice log-likelihood.
            </li>
            <li>
            edf: the (effective) number of degrees of freedom used by the model
            </li>
            <li>
            AIC: the AIC for this fit.
            </li>
            <li>
            Hessian: (if Hess is true).
            </li>
            <li>
            model: (if model is true).
            </li>
            <b>Examples</b><br/>
            <code> 
            options(contrasts = c("contr.treatment", "contr.poly"))<br/>
            library(MASS)<br/>
            example(birthwt)<br/>
            (bwt.mu <- multinom(low ~ ., bwt))<br/>
            </code>
            <b>Package</b></br>
            nnet</br>
            <b>Help</b></br>
            For detailed help click on the R icon on the top right hand side of this dialog overlay or run the following command help(multinom, package=nnet) by creating a R code chunk by clicking + in the output window
           `}
    }
}

class multiNomialLogistic extends baseModal {
    constructor() {
        var config = {
            id: "multiNomialLogistic",
            label: localization.en.title,
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
                    label: localization.en.modelname,
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
                    label: localization.en.dependent,
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
                    label: localization.en.generateplotchk,
                    no: "generateplotchk",
                    bs_type: "valuebox",
                    extraction: "BooleanValue",
                    true_value: "TRUE",
                    false_value: "FALSE",
                })
            },
            destination2: {
                el: new dstVariable(config, {
                    label: localization.en.destination2,
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
                name: localization.en.navigation,
                icon: "icon-ml",
                modal: config.id
            }
        };
        super(config, objects, content);
        this.help = localization.en.help;
    }
}
module.exports.item = new multiNomialLogistic().render()