


class naiveBayes extends baseModal {
    static dialogId = 'naiveBayes'
    static t = baseModal.makeT(naiveBayes.dialogId)

    constructor() {
        var config = {
            id: naiveBayes.dialogId,
            label: naiveBayes.t('title'),
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
                    label: naiveBayes.t('modelname'),
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
                    label: naiveBayes.t('dependentvar'),
                    no: "dependentvar",
                    filter: "Numeric|Ordinal|Nominal",
                    extraction: "NoPrefix|UseComma",
                    required: true,
                }), r: ['{{ var | safe}}']
            },
            independentvars: {
                el: new dstVariableList(config, {
                    label: naiveBayes.t('independentvars'),
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
                name: naiveBayes.t('navigation'),
              // icon: "icon-nb",
               //We may want to revert to this
               icon: "icon-p_a_given_b",
                modal: config.id
            }
        };
        super(config, objects, content);
        
        this.help = {
            title: naiveBayes.t('help.title'),
            r_help: naiveBayes.t('help.r_help'),  //r_help: "help(data,package='utils')",
            body: naiveBayes.t('help.body')
        }
;
    }
}

module.exports = {
    render: () => new naiveBayes().render()
}
