

var localization = {
    en: {
        title: "Ordinal Regression",
        navigation: "Ordinal",
        label1:"Test method",
        logit: "Logit",
        probit: "Probit",
        modelname: "Enter model name",
        dependent: "Dependent variable",
        formula: "Independent variable(s)",
        generateplotchk: "Plot residuals vs fitted, normal Q-Q , scale-location and residuals vs leverage",
        weights: "Specify a variable with weights",
        help: {
            title: "Ordinal",
            r_help: "help(polr, package=MASS)",
            body: `
            <b>Description</b></br>
            Fits a logistic or probit regression model to an ordered factor response. The default logistic case is proportional odds logistic regression, after which the function is named.
            <br/>
            <b>Usage</b>
            <br/>
            <code> 
            polr(formula, data, weights, start, ..., subset, na.action,
                 contrasts = NULL, Hess = FALSE, model = TRUE,
                 method = c("logistic", "probit", "loglog", "cloglog", "cauchit"))
            </code> <br/>
            <b>Arguments</b><br/>
            <ul>
            <li>
            formula: a formula expression as for regression models, of the form response ~ predictors. The response should be a factor (preferably an ordered factor), which will be interpreted as an ordinal response, with levels ordered as in the factor. The model must have an intercept: attempts to remove one will lead to a warning and be ignored. An offset may be used. See the documentation of formula for other details.
            </li>
            <li>
            data: an optional data frame in which to interpret the variables occurring in formula.
            </li>
            <li>
            weights: optional case weights in fitting. Default to 1.
            </li>
            <li>
            start: initial values for the parameters. This is in the format c(coefficients, zeta): see the Values section.
            </li>
            <li>
            ... additional arguments to be passed to optim, most often a control argument.
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
            Hess: logical for whether the Hessian (the observed information matrix) should be returned. Use this if you intend to call summary or vcov on the fit.
            </li>
            <li>
            model: logical for whether the model matrix should be returned.
            </li>
            <li>
            method: logistic or probit or (complementary) log-log or cauchit (corresponding to a Cauchy latent variable).
            </li>
            </ul>
            <b>Details</b></br>
            This model is what Agresti (2002) calls a cumulative link model. The basic interpretation is as a coarsened version of a latent variable Y_i which has a logistic or normal or extreme-value or Cauchy distribution with scale parameter one and a linear model for the mean. The ordered factor which is observed is which bin Y_i falls into with breakpoints
            zeta_0 = -Inf < zeta_1 < … < zeta_K = Inf</br>
            This leads to the model</br>
            logit P(Y <= k | x) = zeta_k - eta</br>
            with logit replaced by probit for a normal latent variable, and eta being the linear predictor, a linear function of the explanatory variables (with no intercept). Note that it is quite common for other software to use the opposite sign for eta (and hence the coefficients beta).</br>
            In the logistic case, the left-hand side of the last display is the log odds of category k or less, and since these are log odds which differ only by a constant for different k, the odds are proportional. Hence the term proportional odds logistic regression.</br>
            The log-log and complementary log-log links are the increasing functions F^-1(p) = -log(-log(p)) and F^-1(p) = log(-log(1-p)); some call the first the ‘negative log-log’ link. These correspond to a latent variable with the extreme-value distribution for the maximum and minimum respectively.</br>
            A proportional hazards model for grouped survival times can be obtained by using the complementary log-log link with grouping ordered by increasing times.</br>
            predict, summary, vcov, anova, model.frame and an extractAIC method for use with stepAIC (and step). There are also profile and confint methods.</br>
            <b>Value</b><br/>
            A object of class "polr". This has components
            <li>
            coefficients: the coefficients of the linear predictor, which has no intercept.
            </li>
            <li>
            zeta: the intercepts for the class boundaries.
            </li>
            <li>
            deviance: the residual deviance.
            </li>
            <li>
            fitted.values: a matrix, with a column for each level of the response.
            </li>
            <li>
            lev: the names of the response levels.
            </li>
            <li>
            terms: the terms structure describing the model.
            </li>
            <li>
            df.residual: the number of residual degrees of freedoms, calculated using the weights.
            </li>
            <li>
            edf: the (effective) number of degrees of freedom used by the model
            </li>
            <li>
            n, nobs: the (effective) number of observations, calculated using the weights. (nobs is for use by stepAIC.
            </li>
            <li>
            call: the matched call.
            </li>
            <li>
            method: the matched method used.
            </li>
            <li>
            convergence: the convergence code returned by optim.
            </li>
            <li>
            niter: the number of function and gradient evaluations used by optim.
            </li>
            <li>
            lp: the linear predictor (including any offset).</li>
            <li>
            Hessian: (if Hess is true). Note that this is a numerical approximation derived from the optimization process.
            </li>
            <li>
            model:(if model is true).
            </li>
            <li>
            Note</br>
            The vcov method uses the approximate Hessian: for reliable results the model matrix should be sensibly scaled with all columns having range the order of one.</br>
            Prior to version 7.3-32, method = "cloglog" confusingly gave the log-log link, implicitly assuming the first response level was the ‘best’.</br>
            <br/>
            <b>Examples</b><br/>
            <code> 
            options(contrasts = c("contr.treatment", "contr.poly"))<br/>
            house.plr <- polr(Sat ~ Infl + Type + Cont, weights = Freq, data = housing)<br/>
            house.plr<br/>
            summary(house.plr, digits = 3)<br/>
            ## slightly worse fit from<br/>
            summary(update(house.plr, method = "probit", Hess = TRUE), digits = 3)<br/>
            ## although it is not really appropriate, can fit<br/>
            summary(update(house.plr, method = "loglog", Hess = TRUE), digits = 3)<br/>
            summary(update(house.plr, method = "cloglog", Hess = TRUE), digits = 3)<br/>
            <br/>
            predict(house.plr, housing, type = "p")<br/>
            addterm(house.plr, ~.^2, test = "Chisq")<br/>
            house.plr2 <- stepAIC(house.plr, ~.^2)<br/>
            house.plr2$anova<br/>
            anova(house.plr, house.plr2)<br/>
            <br/>
            house.plr <- update(house.plr, Hess=TRUE)<br/>
            pr <- profile(house.plr)<br/>
            confint(pr)<br/>
            plot(pr)<br/>
            pairs(pr)<br/>
            </code> <br/>
            <b>Package</b></br>
            MASS</br>
            <b>Help</b></br>
            For detailed help click on the R icon on the top right hand side of this dialog overlay or run the following command help(polr, package =MASS) by creating a R code chunk by clicking + in the output window			`}
    }
}

class ordinalRegression extends baseModal {
    constructor() {
        var config = {
            id: "ordinalRegression",
            label: localization.en.title,
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
    na.action=na.exclude, data={{dataset.name}})
  
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
    na.action=na.exclude, data={{dataset.name}})
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
                    label: localization.en.modelname,
                    placeholder: "",
                    required: true,
                    type: "character",
                    extraction: "TextAsIs",
                    value: "OrdinalReg",
                    overwrite: "dataset"
                })
            },

            label1: { el: new labelVar(config, { label: localization.en.label1, style: "mt-2", h: 6 }) },
            logit: {
                el: new radioButton(config, {
                    label: localization.en.logit,
                    no: "method",
                    increment: "logit",
                    value: "logistic",
                    state: "checked",
                    extraction: "ValueAsIs"
                })
            },
            probit: {
                el: new radioButton(config, {
                    label: localization.en.probit,
                    no: "method",
                    increment: "probit",
                    value: "probit",
                    state: "",
                    extraction: "ValueAsIs"
                })
            },

            dependent: {
                el: new dstVariable(config, {
                    label: localization.en.dependent,
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
                    label: localization.en.generateplotchk,
                    no: "generateplotchk",
                    bs_type: "valuebox",
                    extraction: "BooleanValue",
                    true_value: "TRUE",
                    false_value: "FALSE",
                })
            },
            weights: {
                el: new dstVariable(config, {
                    label: localization.en.weights,
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
                name: localization.en.navigation,
                icon: "icon-regression_ordinal",
                modal: config.id
            }
        };
        super(config, objects, content);
        this.help = localization.en.help;
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

        //This is good code below that should work, I may decide to revert to this
        /*   try {
              fs.accessSync(libPath, fs.constants.W_OK);
             
          }
          catch (err) {
              dialog.showMessageBoxSync({type: "question", buttons: ["Ok", "Cancel"], title: "File Permission Error", message: `You need write access to be able to install a R package to the directory selected. Please relaunch the appliaction by selecting the Run as Administrator option`})
              return res;
          } */
       
            const cmd = instance.dialog.renderR(code_vars);
            res.push({ cmd: cmd, cgid: newCommandGroup() })
            return res;
       
    }

}
module.exports.item = new ordinalRegression().render()

