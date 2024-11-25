
var localization = {
    en: {
        title: "Linear Regression",
        navigation: "Linear, basic",
        modelname: "Enter Model Name",
        dependent: "Dependent variable",
        independent: "Independent variable(s)",
        unusualObservations: "Fit and diagnostics for unusual observations",
        nointercept: "Ignore intercept",
        generateplotchk: "Plot residuals vs fitted, normal Q-Q , scale-location and residuals vs leverage",
        weights: "Specify a variable with weights",
        help: {
            title: "Linear Regression",
            r_help: "help(lm, package ='stats')",
            body: `
            <b>Description</b></br>
Builds a linear regression model. Internally calls function lm in stats package. Returns an object called BSkyLinearRegression which is an object  of class lm. Displays a summary of the model, coefficient table, Anova table and sum of squares table and plots the following  residuals vs. fitted, normal Q-Q, theoretical quantiles, residuals vs. leverage. You can optionally specify a variable with weights and choose to ignore the intercept.
<br/>
<b>Usage</b>
<br/>
<code> 
LinearRegModel1 <- lm(depVar~indepVars, dataset)​<br/>
#Summarizing the model<br/>
summary(LinearRegModel1)<br/>
#Displaying the Anova table<br/>
anova(LinearRegModel1)<br/>
#Plots residuals vs. fitted, normal Q-Q, scale-location, residuals vs. leverage<br/>
plot(LinearRegModel1)<br/>
</code> <br/>
<b>Arguments</b><br/>
<ul>
<li>
depVar: Name of the dependent variable.  If we have a dataset cars, with a variable mpg that we want to predict mpg (dependent variable is mpg) enter mpg​
</li>
<li>
indepVars: Names of the dependent variable. If we have a dataset cars, with dependent  variable horsepower, enginesize, enter horsepower+enginesize. Categorical variables are automatically dummy coded.​
</li>
<li>
dataset: Name of the dataframe. When you open data frames or datasets e.g. csv, Excel files, SAS files in BlueSky Statistics, they are named Dataset1, Dataset2, Dataset3 so enter Dataset1
</li>
</ul>
<b>Package</b></br>
stats</br>
<b>Help</b></br>
help(lm, package ='stats')
			`}
    }
}

class linearRegression extends baseModal {
    constructor() {
        var config = {
            id: "linearRegression",
            label: localization.en.title,
            modalType: "two",
            RCode: `
require(magrittr)
require(equatiomatic)
require(textutils)
{{if(options.selected.nointercept =="TRUE")}}
{{selected.modelname | safe}} = lm(formula = {{selected.dependent | safe}}~0+{{selected.independent | safe}}, data={{dataset.name}},
                        {{selected.weights | safe}} na.action=na.exclude)
{{#else}}   
{{selected.modelname | safe}} = lm(formula = {{selected.dependent | safe}}~{{selected.independent | safe}}, data={{dataset.name}},
    {{selected.weights | safe}} na.action=na.exclude)
{{/if}}

#Display theoretical model equation and coefficients

#Display theoretical model
{{selected.modelname | safe}} %>%
    equatiomatic::extract_eq(raw_tex = FALSE,
        wrap = TRUE, intercept = "alpha", ital_vars = FALSE) %>%
        BSkyFormat()       

#Display coefficients
{{selected.modelname | safe}} %>%
    equatiomatic::extract_eq(use_coefs = TRUE,
    wrap = TRUE,  ital_vars = FALSE, coef_digits = BSkyGetDecimalDigitSetting()) %>%
       BSkyFormat()

{{selected.modelname | safe}} %>%
    BSkyFormat()      

#Displaying the Anova table
BSkyAnovaRes = {{selected.modelname | safe}} %>%
            anova() %T>%
			  BSkyFormat(singleTableOutputHeader = "Anova table")

#Displaying sum of squares table
BSkydf = as.data.frame(BSkyAnovaRes)
BSkytotalrows = nrow(BSkydf)
BSkyregSumOfSquares = sum(BSkydf[1:BSkytotalrows - 1, 2])
BSkyresidualSumOfSquares = BSkydf[BSkytotalrows, 2]
BSkytotalSumOfSquares = BSkyregSumOfSquares + BSkyresidualSumOfSquares

matrix(c(BSkyregSumOfSquares, BSkyresidualSumOfSquares, 
        BSkytotalSumOfSquares), nrow = 3, ncol = 1, dimnames = list(c("Sum of squares of regression", 
        "Sum of squares of residuals", "Total sum of squares"), 
        c("Values"))) %>%
            BSkyFormat(singleTableOutputHeader = "Sum of squares table")
 
# Model Plotting
{{if (options.selected.generateplotchk == "TRUE")}}#displaying plots\n#Plots residuals vs. fitted, normal Q-Q, scale-location, residuals vs. leverage\n{{selected.modelname | safe}} %>%\n\tplot(){{/if}}

{{if (options.selected.unusualObservations == "TRUE")}}#Fit and diagnostics for unusual observations\nBSkyUnusualObs({{selected.modelname | safe}},{{dataset.name}}\${{selected.dependent | safe}},"{{selected.dependent | safe}}" ){{/if}}

#Adding attributes to support scoring
#We don't add dependent and independent variables as this is handled by our functions
attr(.GlobalEnv\${{selected.modelname | safe}},"classDepVar")= class({{dataset.name}}[, c("{{selected.dependent | safe}}")])
attr(.GlobalEnv\${{selected.modelname | safe}},"depVarSample")= sample({{dataset.name}}[, c("{{selected.dependent | safe}}")], size = 2, replace = TRUE)
#Removing temporary objects
if (exists("BSkyAnovaRes")) rm (BSkyAnovaRes)
if (exists("BSkydf")) rm (BSkydf)
if (exists("BSkytotalrows")) rm (BSkytotalrows)
if (exists("BSkyregSumOfSquares")) rm (BSkyregSumOfSquares)
if (exists("BSkyresidualSumOfSquares")) rm (BSkyresidualSumOfSquares)
if (exists("BSkytotalSumOfSquares")) rm (BSkytotalSumOfSquares)

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
                    value: "LinearRegModel1",
                    overwrite: "dataset"
                })
            },
            dependent: {
                el: new dstVariable(config, {
                    label: localization.en.dependent,
                    no: "dependent",
                    filter: "Numeric|Scale",
                    extraction: "NoPrefix|UseComma",
                    required: true,
                }), r: ['{{ var | safe}}']
            },
            independent: {
                el: new dstVariableList(config, {
                    label: localization.en.independent,
                    no: "independent",
                    required: true,
                    filter: "String|Numeric|Logical|Ordinal|Nominal|Scale",
                    extraction: "NoPrefix|UsePlus",
                }), r: ['{{ var | safe}}']
            },
            nointercept: {
                el: new checkbox(config, {
                    label: localization.en.nointercept,
                    no: "nointercept",
                    bs_type: "valuebox",
                    extraction: "BooleanValue",
                    true_value: "TRUE",
                    false_value: "FALSE",
                })
            },
            generateplotchk: {
                el: new checkbox(config, {
                    label: localization.en.generateplotchk,
                    no: "generateplotchk",
                    style: "mt-2 mb-3",
                    bs_type: "valuebox",
                    extraction: "BooleanValue",
                    true_value: "TRUE",
                    false_value: "FALSE",
                })
            },
            unusualObservations: {
                el: new checkbox(config, {
                    label: localization.en.unusualObservations,
                    no: "unusualObservations",
                    style: "mt-2 mb-3",
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
                    wrapped: 'weights=c(%val%),',
                }), r: ['{{ var | safe}}']
            },
        };
        const content = {
            left: [objects.content_var.el.content],
            right: [objects.modelname.el.content, objects.dependent.el.content, objects.independent.el.content, objects.nointercept.el.content, objects.generateplotchk.el.content, objects.unusualObservations.el.content,objects.weights.el.content],
            nav: {
                name: localization.en.navigation,
                icon: "icon-linear_regression_white_comp",
                modal: config.id
            }
        };
        super(config, objects, content);
        this.help = localization.en.help;
    }
}
module.exports.item = new linearRegression().render()