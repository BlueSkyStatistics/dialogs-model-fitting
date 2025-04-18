/**
  * This file is protected by copyright (c) 2023-2025 by BlueSky Statistics, LLC.
  * All rights reserved. The copy, modification, or distribution of this file is not
  * allowed without the prior written permission from BlueSky Statistics, LLC.
 */


var localization = {
    en: {
        title: "Linear Regression",
        navigation: "Linear, basic(Legacy)",
        modelname: "Enter Model Name",
        dependent: "Dependent variable",
        independent: "Independent variable(s)",
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

class linearRegressionLegacy extends baseModal {
    constructor() {
        var config = {
            id: "linearRegressionLegacy",
            label: localization.en.title,
            modalType: "two",
            RCode: `
require(equatiomatic)
require(textutils)
#Creating the model
{{if (options.selected.nointercept =="TRUE")}}{{selected.modelname | safe}} = lm({{selected.dependent | safe}}~0+{{selected.independent | safe}}, {{ if (options.selected.weights != "")}}weights ={{selected.weights | safe}},{{/if}} na.action=na.exclude, data={{dataset.name}})\n{{#else}}{{selected.modelname | safe}} = lm({{selected.dependent | safe}}~{{selected.independent | safe}}, {{ if (options.selected.weights != "")}}weights ={{selected.weights | safe}},{{/if}} na.action=na.exclude, data={{dataset.name}})\n{{/if}}
##local ({
#Display theoretical model equation and coefficients
#Display theoretical model
reg_formula = equatiomatic::extract_eq({{selected.modelname | safe}}, raw_tex = FALSE,\n\t wrap = TRUE, intercept = "alpha", ital_vars = FALSE) 
BSkyFormat(reg_formula)
#Display coefficients
reg_equation = equatiomatic::extract_eq({{selected.modelname | safe}}, use_coefs = TRUE,\n\t wrap = TRUE,  ital_vars = FALSE, coef_digits = BSkyGetDecimalDigitSetting() )
BSkyFormat(reg_equation)
#Summarizing the model
BSky_LM_Summary_{{selected.modelname | safe}} = summary({{selected.modelname | safe}})
BSkyFormat(BSky_LM_Summary_{{selected.modelname | safe}}, singleTableOutputHeader = "Model Summary")
#Displaying the Anova table
AnovaRes = anova({{selected.modelname | safe}} )
BSkyFormat(as.data.frame(AnovaRes), singleTableOutputHeader = "Anova table")
#Displaying sum of squares table
df = as.data.frame(AnovaRes)
totalrows = nrow(df)
regSumOfSquares = sum(df[1:totalrows - 1, 2])
residualSumOfSquares = df[totalrows, 2]
totalSumOfSquares = regSumOfSquares + residualSumOfSquares
matSumOfSquares = matrix(c(regSumOfSquares, residualSumOfSquares, 
        totalSumOfSquares), nrow = 3, ncol = 1, dimnames = list(c("Sum of squares of regression", 
        "Sum of squares of residuals", "Total sum of squares"), 
        c("Values")))
BSkyFormat(matSumOfSquares, singleTableOutputHeader = "Sum of squares table")
#remove(BSky_LM_Summary_{{selected.modelname | safe}})
#remove({{selected.modelname | safe}})
{{if (options.selected.generateplotchk == "TRUE")}}#displaying plots\n#Plots residuals vs. fitted, normal Q-Q, scale-location, residuals vs. leverage\nplot({{selected.modelname | safe}}){{/if}}
#Adding attributes to support scoring
#We don't add dependent and independent variables as this is handled by our functions
attr(.GlobalEnv\${{selected.modelname | safe}},"classDepVar")= class({{dataset.name}}[, c("{{selected.dependent | safe}}")])
attr(.GlobalEnv\${{selected.modelname | safe}},"depVarSample")= sample({{dataset.name}}[, c("{{selected.dependent | safe}}")], size = 2, replace = TRUE)

##})
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
            right: [objects.modelname.el.content, objects.dependent.el.content, objects.independent.el.content, objects.nointercept.el.content, objects.generateplotchk.el.content, objects.weights.el.content],
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
module.exports.item = new linearRegressionLegacy().render()