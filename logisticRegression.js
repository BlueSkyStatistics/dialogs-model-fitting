/**
  * This file is protected by copyright (c) 2023-2025 by BlueSky Statistics, LLC.
  * All rights reserved. The copy, modification, or distribution of this file is not
  * allowed without the prior written permission from BlueSky Statistics, LLC.
 */


var localization = {
    en: {
        title: "Logistic Regression",
        navigation: "Logistic, basic",
        modelname: "Enter model name",
        dependent: "Dependent variable",
        independent: "Independent variable(s)",
        generateplotchk: "Plot residuals vs fitted, normal Q-Q , scale-location and residuals vs leverage",
        destination2: "Specify a variable with weights",
        help: {
            title: "Logistic Regression",
            r_help: "help(glm, package ='stats')",
            body: `
<b>Description</b></br>
Builds a binary logistic regression model. We use glm function passing the parameter family =binomial(link='logit'). We display a summary of the model, analysis of variance tables and McFadden R2.<br/>
You can score the model by selecting the model created on the top right hand corner of the main application screen and select the Score button. You can choose to display a confusion matrix and a ROC curve<br/>
The default model name is Logistic1 which you can change.<br/><br/>
NOTE: When specifying a variable containing weights, be aware that since we use the option na.exlude to build the model, all NA values are automatically removed from the dependent and independent variables.<br/> 
This can cause a mismatch as NA values are NOT automatically removed from the weighting variable. <br/>
In this situation you will see the error variable lengths differ (found for (weights))<br/>
To address this error go to Variables>Missing Values>Remove NAs and select the dependent, independent variables and the weighting variable to remove missing values from and rebuild the model.<br/>
<br/>
<b>Usage</b>
<br/>
<code> 
modelname <- glm(dependentVariable ~ var1+var2+var3...,family =binomial(link='logit'),data=datasetName)
#Summarizing the model<br/>
summary(modelname)<br/>
#Displaying the Anova table<br/>
anova(modelname)<br/>
#Plots residuals vs. fitted, normal Q-Q, scale-location, residuals vs. leverage<br/>
plot(modelname)<br/>
#McFadden R2<br/>
pR2(Logistic1)<br/>
#odds ratio and 95% confidence interval<br/>
exp(cbind(OR=coef(Logistic1), confint(Logistic1,level=0.95)))<br/>
#Plot the model<br/>
plot(Logistic1)<br/>
</code> <br/>
<b>Arguments</b><br/>
<ul>
<li>
depVar: Name of the dependent variable.  If we have a dataset cars, with a variable class that we want to predict (dependent variable is class) enter class
</li>
<li>
indepVars: Names of the independent variable, separated by +. If we have a dataset cars, with independent  variable horsepower, enginesize, specify horsepower+enginesize). Categorical variables are automatically dummy coded.​
</li>
<li>
data: Name of the dataframe. When you open data frames or datasets e.g. csv, Excel files, SAS files in BlueSky Statistics, they are named Dataset1, Dataset2, Dataset3 So enter data=Dataset1​
</li>
</ul>
<b>Package</b></br>
glm</br>
<b>Help</b></br>
help(glm, package ='stats')</br>
<b>References</b></br>
https://datascienceplus.com/perform-logistic-regression-in-r/</br>
https://www.machinelearningplus.com/machine-learning/logistic-regression-tutorial-examples-r/</br>
<b>Other</b></br>
Click the R Help icon to get detailed R help​</br>
			`}
    }
}

class logisticRegression extends baseModal {
    constructor() {
        var config = {
            id: "logisticRegression",
            label: localization.en.title,
            modalType: "two",
            RCode: `
require(MASS);
require(pscl);
require(equatiomatic)
require(textutils)
#Builds a logistic model 
{{selected.modelname | safe}}= glm({{selected.dependent | safe}} ~ {{selected.independent | safe}}, {{if(options.selected.destination2 != "")}}weights = {{selected.destination2 | safe}},{{/if}} family =binomial(link='logit'), na.action=na.exclude, 
data={{dataset.name}})
local(
{
    if(!is.null( {{selected.modelname | safe}} ) )
    {
        #Display theoretical model equation and coefficients
        #Display theoretical model
        reg_formula = equatiomatic::extract_eq({{selected.modelname | safe}}, raw_tex = FALSE,\n\t wrap = TRUE, intercept = "alpha", ital_vars = FALSE) 
        BSkyFormat(reg_formula)
        #Display coefficients
        reg_equation = equatiomatic::extract_eq({{selected.modelname | safe}}, use_coefs = TRUE,\n\t wrap = TRUE,ital_vars = FALSE, coef_digits = BSkyGetDecimalDigitSetting() )
        BSkyFormat(reg_equation)
        #Summarizing the model
        BSky_Logistic = summary({{selected.modelname | safe}})
        BSkyFormat(BSky_Logistic, singleTableOutputHeader="Model Summary")
        #Analysis of variance
        BSky_anova = anova({{selected.modelname | safe}}, test="Chisq")
        BSkyFormat(as.data.frame(BSky_anova),singleTableOutputHeader="Analysis of Deviance Table")
        BSkyFormat(attr(BSky_anova, "heading"))
        #McFadden R2
        BSkyFormat( pR2({{selected.modelname | safe}}) ,singleTableOutputHeader="McFadden R2")
        #odds ratio and 95% confidence interval
        BSkyFormat(exp(cbind(OR=coef({{selected.modelname | safe}}), confint.glm({{selected.modelname | safe}},level=0.95))),singleTableOutputHeader="Odds ratio(OR) and 95% Confidence interval ")
        {{if (options.selected.generateplotchk == "TRUE")}}#Displaying plots\nplot({{selected.modelname | safe}}){{/if}} 
        #Adding attributes to support scoring
        #We don't add dependent and independent variables as this is handled by our functions
        attr(.GlobalEnv\${{selected.modelname | safe}},"classDepVar")= class({{dataset.name}}[, c("{{selected.dependent | safe}}")])
        attr(.GlobalEnv\${{selected.modelname | safe}},"depVarSample")= sample({{dataset.name}}[, c("{{selected.dependent | safe}}")], size = 2, replace = TRUE)
          }
}
)
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
                    value: "Logistic1",
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
            independent: {
                el: new dstVariableList(config, {
                    label: localization.en.independent,
                    no: "independent",
                    required: true,
                    filter: "String|Numeric|Logical|Ordinal|Nominal|Scale",
                    extraction: "NoPrefix|UsePlus",
                }), r: ['{{ var | safe}}']
            },
            generateplotchk: {
                el: new checkbox(config, {
                    label: localization.en.generateplotchk,
                    no: "generateplotchk",
                    bs_type: "valuebox",
                    style: "mt-2 mb-3",
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
                    extraction: "Prefix|UseComma",
                   // wrapped: 'weight=%val%,',
                })
            },
        };
        
        const content = {
            left: [objects.content_var.el.content],
            right: [objects.modelname.el.content, objects.dependent.el.content, objects.independent.el.content, objects.generateplotchk.el.content, objects.destination2.el.content],
            nav: {
                name: localization.en.navigation,
                icon: "icon-logistic_white_comp",
                modal: config.id
            }
        };
        super(config, objects, content);
        this.help = localization.en.help;
    }
}
module.exports.item = new logisticRegression().render()