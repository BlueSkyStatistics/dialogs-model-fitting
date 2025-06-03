/**
  * This file is protected by copyright (c) 2023-2025 by BlueSky Statistics, LLC.
  * All rights reserved. The copy, modification, or distribution of this file is not
  * allowed without the prior written permission from BlueSky Statistics, LLC.
 */


var localization = {
    en: {
        title: "Naive Bayes",
        navigation: "Naive Bayes",
        modelname: "Enter model name",
        dependentvar: "Dependent variable",
        independentvars: "Independent variable(s)",
        help: {
            title: "Naive Bayes",
            r_help: "help(NaiveBayes,package='klaR')",
            body: `
                <b>Description</b></br>
Computes the conditional a-posterior probabilities of a categorical class variable given independent predictor variables using the Bayes rule. 
<br/>
<b>Usage</b>
<br/>
<code> 
NaiveBayes(formula, data, ...,  na.action = na.pass)
</code> <br/>
<b>Arguments</b><br/>
<ul>
<li>
formula : a formula of the form class ~ x1 + x2 + .... Interactions are not allowed.
</li>
<li>
data: a data frame of predictors (caegorical and/or numeric).
</li>
<li>
na.action : a function to specify the action to be taken if NAs are found. The default action is not to count them for the computation of the probability factors. An alternative is na.omit, which leads to rejection of cases with missing values on any required variable. (NOTE: If given, this argument must be named.)
</li>
<li>
... : arguments passed to density.
</li>
</ul>
<b>Package</b></br>
caret;klaR</br>
<b>Help</b></br>
For detailed help click on the R icon on the top right hand side of this dialog overlay or run the following command in the R syntax editor</br>
help(NaiveBayes,package='klaR')
`}
    }
}

class naiveBayes extends baseModal {
    constructor() {
        var config = {
            id: "naiveBayes",
            label: localization.en.title,
            modalType: "two",
            RCode: `
require(caret);
require(klaR);
{{selected.modelname | safe}} <- NULL
{{selected.modelname | safe}} <- NaiveBayes({{selected.dependentvar | safe}}~{{selected.independentvars | safe}}, data={{dataset.name}}, na.action =na.omit)
local(
{
    if( !exists('{{selected.modelname | safe}}' ) || is.null({{selected.modelname | safe}}) )
    {
        cat('\\nError: Couldn\\'t generate model. The common issue is that, at least one of the predictor contains NA.')
        #set following to false. Because we cant put load refresh inside of any block (like if, else, for etc..)
    } else
    {
        #Adding dependentvar to naiveBayes model so that it can be used in predict()
        {{selected.modelname | safe}}\${{selected.dependentvar | safe}} <<- '{{selected.dependentvar | safe}}'
        #Changing headers of scale and factor variables
        tblcount <- length({{selected.modelname | safe}}$tables)
        for(i in 1: tblcount)
        {
            varname <- names({{selected.modelname | safe}}$tables)[[i]]
            varclass <- eval(parse(text=paste('class({{dataset.name}}$',varname,')', collapse='', sep='')))
            if(varclass == "factor")
            {
            Grouping = eval( parse( text=paste( 'dimnames({{selected.modelname | safe}}$tables$',varname,')[[1]]', collapse='', sep='') ) )
            Probabilities = eval( parse( text=paste( 'dimnames({{selected.modelname | safe}}$tables$',varname,')[[2]]', collapse='', sep='') ) )
            eval( parse( text=paste( 'dimnames({{selected.modelname | safe}}$tables$',varname,') =NULL', collapse='', sep='') ) )
            eval( parse( text=paste( 'dimnames({{selected.modelname | safe}}$tables$',varname,') = list(Grouping=Grouping, Probabilities = Probabilities)', collapse='', sep='') ) )
            }
            else
            {
            colnames({{selected.modelname | safe}}$tables[[i]]) <- c("Mean", "Std.Dev")
            }
        }
        for(i in 1: tblcount)
        {
            title <- names({{selected.modelname | safe}}$tables)[[i]] 
            BSkyFormat( ({{selected.modelname | safe}}$tables)[[i]] , singleTableOutputHeader=title)
        }
        heading =paste0('Class distribution of variable ', '{{selected.dependentvar | safe}}',collapse='', sep='')
        BSkyFormat({{selected.modelname | safe}}$apriori,singleTableOutputHeader= heading)
        #Adding attributes to support scoring
        attr(.GlobalEnv\${{selected.modelname | safe}},"depvar")="{{selected.dependentvar | safe}}"
        #The line below is commented as getModelIndependentVariables(modelname) works correctly for this call of model
        #The paste code below does not work correctly
        #attr(.GlobalEnv\${{selected.modelname | safe}},"indepvar")=paste(str_split("{{selected.independentvars}}",fixed("+")),sep=",", collapse="")
        attr(.GlobalEnv\${{selected.modelname | safe}},"classDepVar")= class({{dataset.name}}[, c("{{selected.dependentvar | safe}}")])
        attr(.GlobalEnv\${{selected.modelname | safe}},"depVarSample")= sample({{dataset.name}}[, c("{{selected.dependentvar | safe}}")], size = 2, replace = TRUE)
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
                    value: "NaiveBayesModel1",
                    overwrite: "dataset"
                })
            },
            dependentvar: {
                el: new dstVariable(config, {
                    label: localization.en.dependentvar,
                    no: "dependentvar",
                    filter: "Numeric|Ordinal|Nominal",
                    extraction: "NoPrefix|UseComma",
                    required: true,
                }), r: ['{{ var | safe}}']
            },
            independentvars: {
                el: new dstVariableList(config, {
                    label: localization.en.independentvars,
                    no: "independentvars",
                    required: true,
                    filter: "Numeric|Logical|Ordinal|Nominal|Scale",
                    extraction: "NoPrefix|UsePlus",
                }), r: ['{{ var | safe}}']
            },
        };
        const content = {
            left: [objects.content_var.el.content],
            right: [objects.modelname.el.content, objects.dependentvar.el.content, objects.independentvars.el.content,],
            nav: {
                name: localization.en.navigation,
              // icon: "icon-nb",
               //We may want to revert to this
               icon: "icon-p_a_given_b",
                modal: config.id
            }
        };
        super(config, objects, content);
        this.help = localization.en.help;
    }
}
module.exports.item = new naiveBayes().render()