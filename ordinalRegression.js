



class ordinalRegression extends baseModal {
    static dialogId = 'ordinalRegression'
    static t = baseModal.makeT(ordinalRegression.dialogId)

    constructor() {
        var config = {
            id: ordinalRegression.dialogId,
            label: ordinalRegression.t('title'),
            modalType: "two",
           /* 
These comments are needed for compatibilty and reference
           RCode: `
require(equatiomatic)
require(MASS)
{{selected.model | safe}} = MASS::polr({{selected.dependent | safe}}~{{selected.formula | safe}}, 
    method = '{{selected.method | safe}}', Hess = TRUE, weights ={{selected.weights | safe}}, 
    na.action=na.exclude, data={{dataset.name}})
local({
    #Display theoretical model equation and coefficients
    #Display theoretical model
    reg_formula = equatiomatic::extract_eq({{selected.model | safe}}, raw_tex = FALSE,\n\t wrap = TRUE, intercept = "alpha", ital_vars = FALSE) 
    BSkyFormat(reg_formula)
    #Display coefficients
    reg_equation = equatiomatic::extract_eq({{selected.model | safe}}, use_coefs = TRUE,\n\t wrap = TRUE,ital_vars = FALSE, coef_digits = BSkyGetDecimalDigitSetting() )
    BSkyFormat(reg_equation)
    BSky_Ordinal_Regression_Summary_{{selected.model | safe}} = summary({{selected.model | safe}})
    #Getting the coefficients
    ctable <- coef(BSky_Ordinal_Regression_Summary_{{selected.model | safe}} )

    #Creating the p-value from the z-value
    p <- pnorm(abs(ctable[, "t value"]), lower.tail = FALSE) * 2

    #Creating the p-value from the t-value
    p2 <- pt(abs(ctable[, "t value"]),lower.tail=FALSE, df={{selected.model | safe}}$df.residual)*2

    #Storing the p values in the return structure
    BSky_Ordinal_Regression_Summary_{{selected.model | safe}}[[1]] <- cbind(BSky_Ordinal_Regression_Summary_{{selected.model | safe}}[[1]] , "p.value(z)" = p, "p.value(t)" = p2)

    #Displaying results
    BSkyFormat(BSky_Ordinal_Regression_Summary_{{selected.model | safe}})

    #Compute Odds ratio and Confidence Interval
    obj1 = cbind(exp(coef({{selected.model | safe}})), exp(confint({{selected.model | safe}})))
    dimnames(obj1)[[2]][1] <- "Odds ratio"
    #Display odds ratio and confidence interval
    BSkyFormat(obj1, singleTableOutputHeader="Odds Ratio and Confidence Interval")
    }
)
` */
RCode: `
require(equatiomatic)
require(textutils)
require(broom)
{{selected.model | safe}} = MASS::polr({{selected.dependent | safe}}~{{selected.formula | safe}}, 
    method = '{{selected.method | safe}}', Hess = TRUE, weights ={{selected.weights | safe}}, 
    na.action=na.exclude, data = na.omit({{dataset.name}}[, {{selected.all_vars | safe}}]))
  
#Display theoretical model equation and coefficients
#Display theoretical model
reg_formula = equatiomatic::extract_eq({{selected.model | safe}}, raw_tex = FALSE,\n\t wrap = TRUE, intercept = "alpha", ital_vars = FALSE) 
BSkyFormat(reg_formula)
#Display coefficients in the model equation
reg_equation = equatiomatic::extract_eq({{selected.model | safe}}, use_coefs = TRUE,\n\t wrap = TRUE,ital_vars = FALSE, coef_digits = BSkyGetDecimalDigitSetting() )
BSkyFormat(reg_equation)

#Using tidy to get the model statistics with Unexponentiated coefficients
BSky_Results_tidy <-  as.data.frame(broom::tidy({{selected.model | safe}}, conf.int = TRUE, conf.level = 0.95, \n\texponentiate = FALSE, quick = FALSE))
#Computing p values
BSky_Ordinal_Regression_Summary_{{selected.model | safe}} = summary({{selected.model | safe}})
#Getting the coefficients
BSky_ctable <- coef(BSky_Ordinal_Regression_Summary_{{selected.model | safe}} )

#Creating the p-value from the z-value
p <- pnorm(abs(BSky_ctable[, "t value"]), lower.tail = FALSE) * 2

#Creating the p-value from the t-value
p2 <- pt(abs(BSky_ctable[, "t value"]),lower.tail=FALSE, df={{selected.model | safe}}$df.residual)*2

#Setting the names of the numerics to NULL to avoid duplication of the term column
names(p) <-NULL
names(p2) <-NULL

#Storing the p values in the return structure
BSky_Results_tidy <- cbind(BSky_Results_tidy , "p.value(z)" = p, "p.value(t)" = p2)

#Renaming statistics with t.value
names(BSky_Results_tidy) <- str_replace(names(BSky_Results_tidy), "statistic", "t.value")
    
#Displaying the results
BSkyFormat(BSky_Results_tidy, singleTableOutputHeader="Coefficients and Statistics (Unexponentiated)")

#Using tidy to get the model statistics
BSky_Results_tidy <-  as.data.frame(broom::tidy({{selected.model | safe}}, conf.int = TRUE, conf.level = 0.95, \n\texponentiate = TRUE, quick = FALSE))

#Computing p values
BSky_Ordinal_Regression_Summary_{{selected.model | safe}} = summary({{selected.model | safe}})
#Getting the coefficients
BSky_ctable <- coef(BSky_Ordinal_Regression_Summary_{{selected.model | safe}} )

#Creating the p-value from the z-value
BSky_p <- pnorm(abs(BSky_ctable[, "t value"]), lower.tail = FALSE) * 2

#Creating the p-value from the t-value
BSky_p2 <- stats::pt(abs(BSky_ctable[, "t value"]),lower.tail=FALSE, df={{selected.model | safe}}$df.residual)*2

#Setting the names of the numerics to NULL to avoid duplication of the term column
names(BSky_p) <-NULL
names(BSky_p2) <-NULL


#Storing the p values in the return structure
BSky_Results_tidy <- cbind(BSky_Results_tidy , "p.value(z)" = BSky_p, "p.value(t)" = BSky_p2)

#Renaming statistics with t.value
names(BSky_Results_tidy) <- stringr::str_replace(names(BSky_Results_tidy), "statistic", "t.value")
    
#Displaying the results
BSkyFormat(BSky_Results_tidy, outputTableIndex = c( tableone=1) ,outputColumnIndex = c(tableone=c(1,2, 5,6)), singleTableOutputHeader="Coefficients and Statistics (Exponentiated)")

BSky_Results_glance <-as.data.frame(glance({{selected.model | safe}}))
BSkyFormat(BSky_Results_glance, singleTableOutputHeader="Model Statistics")  

#Displaying loglikelihood
#To print loglikelihood
BSkyLogLikelihood = ({{selected.model | safe}}\$deviance)/-2
cat ("LogLikelihood:", round (BSkyLogLikelihood, BSkyGetDecimalDigitSetting()) )

#To get test of all slopes equal to zero
#First I run a null model with only intercept as a predictor, then I compare

{{selected.model | safe}}_null = MASS::polr({{selected.dependent | safe}}~1, 
    method = '{{selected.method | safe}}', Hess = TRUE, weights ={{selected.weights | safe}}, 
    na.action=na.exclude, data = na.omit({{dataset.name}}[, {{selected.all_vars | safe}}]))
BSkyTestSlopes <- stats::anova({{selected.model | safe}}, {{selected.model | safe}}_null)
BSkyTestSlopes <- as.data.frame(BSkyTestSlopes)
BSkyTestSlopes <- cbind(Description= c("Null model", "Specified model"), BSkyTestSlopes)
BSkyFormat(as.data.frame(BSkyTestSlopes), singleTableOutputHeader = "Test of all slopes equal to zero" )

#Hosmer-Lemeshow goodness of fit tests
BSkyHosmer <-generalhoslem::logitgof({{dataset.name}}\${{selected.dependent | safe}}, fitted({{selected.model | safe}}))
BSkyFormat(BSkyHosmer, outputTableIndex = c(tableone=1))

#Pulkstenis-Robinson goodness of fit chi-squared
BSkyPulkstenis <- generalhoslem::pulkrob.chisq( {{selected.model | safe}}, {{selected.rCharacterArray | safe}})
BSkyFormat(BSkyPulkstenis, outputTableIndex = c(tableone=1))

#Pulkstenis-Robinson deviance test
BSkyDeviance <- generalhoslem::pulkrob.deviance({{selected.model | safe}}, {{selected.rCharacterArray | safe}})
BSkyFormat(BSkyDeviance, outputTableIndex = c(tableone=1))

#To get Somers' D, Goodman-Kruskal Gamma, Kendall's Tau-A
#All use DescTools and I produce 95% CIs, which Minitab does not.
#DescTools::SomersDelta(cleaned_web_survey_data$Q17,cleaned_web_survey_data$Q3, conf.level = 0.95)
#DescTools::GoodmanKruskalGamma(cleaned_web_survey_data$Q17,cleaned_web_survey_data$Q3, conf.level = 0.95)
#DescTools::KendallTauA(cleaned_web_survey_data$Q17,cleaned_web_survey_data$Q3, conf.level = 0.95)

#Adding attributes to support scoring
attr(.GlobalEnv\${{selected.model | safe}},"classDepVar") = class({{dataset.name}}[, c("{{selected.dependent | safe}}")])
attr(.GlobalEnv\${{selected.model | safe}},"depVarSample") = sample({{dataset.name}}[, c("{{selected.dependent | safe}}")], size = 2, replace = TRUE)

#removing temporary objects
if (exists("reg_formula")) rm(reg_formula)
if (exists("reg_equation")) rm(reg_equation)
if (exists("BSky_Results_tidy")) rm(BSky_Results_tidy)
if (exists("BSky_Ordinal_Regression_Summary_{{selected.model | safe}}")) rm(BSky_Ordinal_Regression_Summary_{{selected.model | safe}})
if (exists("{{selected.model | safe}}_null")) rm({{selected.model | safe}}_null)
if (exists("BSky_ctable")) rm(BSky_ctable)
if (exists("BSky_p")) rm(BSky_p)
if (exists("BSky_p2")) rm(BSky_p2)
if (exists("BSky_Results_tidy")) rm(BSky_Results_tidy)
if (exists("BSky_Results_glance")) rm(BSky_Results_glance)
if (exists("BSkyHosmer")) rm(BSkyHosmer)
if (exists("BSkyPulkstenis")) rm(BSkyPulkstenis)
if (exists("BSkyDeviance")) rm(BSkyDeviance)
if (exists("BSkyLogLikelihood")) rm(BSkyLogLikelihood)
`

        };
        var objects = {
            content_var: { el: new srcVariableList(config, {action: "move"}) },
            model: {
                el: new input(config, {
                    no: 'model',
                    label: ordinalRegression.t('modelname'),
                    placeholder: "",
                    required: true,
                    type: "character",
                    extraction: "TextAsIs",
                    value: "OrdinalReg",
                    overwrite: "dataset"
                })
            },

            label1: { el: new labelVar(config, { label: ordinalRegression.t('label1'), style: "mt-2", h: 6 }) },
            logit: {
                el: new radioButton(config, {
                    label: ordinalRegression.t('logit'),
                    no: "method",
                    increment: "logit",
                    value: "logistic",
                    state: "checked",
                    extraction: "ValueAsIs"
                })
            },
            probit: {
                el: new radioButton(config, {
                    label: ordinalRegression.t('probit'),
                    no: "method",
                    increment: "probit",
                    value: "probit",
                    state: "",
                    extraction: "ValueAsIs"
                })
            },

            dependent: {
                el: new dstVariable(config, {
                    label: ordinalRegression.t('dependent'),
                    no: "dependent",
                    filter: "Numeric|Ordinal",
                    extraction: "NoPrefix|UseComma",
                    required: true,
                }), r: ['{{ var | safe}}']
            },
            formulaBuilder: {
                el: new formulaBuilder(config, {
                    no: "formula",
                    required:true,
                })
            },
            generateplotchk: {
                el: new checkbox(config, {
                    label: ordinalRegression.t('generateplotchk'),
                    no: "generateplotchk",
                    bs_type: "valuebox",
                    extraction: "BooleanValue",
                    true_value: "TRUE",
                    false_value: "FALSE",
                })
            },
            weights: {
                el: new dstVariable(config, {
                    label: ordinalRegression.t('weights'),
                    no: "weights",
                    filter: "String|Numeric|Date|Logical|Ordinal|Nominal|Scale",
                    extraction: "NoPrefix|UseComma",
                }), r: ['{{ var | safe}}']
            },
        };
        const content = {
            left: [objects.content_var.el.content],
            right: [objects.model.el.content, objects.label1.el.content, objects.logit.el.content, objects.probit.el.content,objects.dependent.el.content, objects.formulaBuilder.el.content,  objects.weights.el.content],
            nav: {
                name: ordinalRegression.t('navigation'),
                icon: "icon-regression_ordinal",
                modal: config.id
            }
        };
        super(config, objects, content);
        
        this.help = {
            title: ordinalRegression.t('help.title'),
            r_help: ordinalRegression.t('help.r_help'),  //r_help: "help(data,package='utils')",
            body: ordinalRegression.t('help.body')
        }
;
    }

    prepareExecution(instance) {
        var res = [];
        var code_vars = {
            dataset: {
                name: $(`#${instance.config.id}`).attr('dataset') ? $(`#${instance.config.id}`).attr('dataset') : getActiveDataset()
            },
            selected: instance.dialog.extractData()
        }
        let results = getFixedEffectsandCovariates(code_vars.selected.formula);
        let independentVars =Object.values(results.covariates).concat( Object.values(results.fixedEffects)).toString();
        code_vars.selected.rCharacterArray = stringToRCharacterArray(independentVars)
        code_vars.selected.all_vars = stringToRCharacterArray(independentVars  +","+code_vars.selected.dependent)
        const cmd = instance.dialog.renderR(code_vars);
        res.push({ cmd: cmd, cgid: newCommandGroup(`${instance.config.id}`, `${instance.config.label}`), oriR: instance.config.RCode, code_vars: code_vars })
        return res;
       
    }

}

module.exports = {
    render: () => new ordinalRegression().render()
}


