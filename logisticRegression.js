


class logisticRegression extends baseModal {
    static dialogId = 'logisticRegression'
    static t = baseModal.makeT(logisticRegression.dialogId)

    constructor() {
        var config = {
            id: logisticRegression.dialogId,
            label: logisticRegression.t('title'),
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
        BSkyFormat(exp(cbind(OR=coef({{selected.modelname | safe}}), stats::confint({{selected.modelname | safe}},level=0.95))),singleTableOutputHeader="Odds ratio(OR) and 95% Confidence interval ")
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
                    label: logisticRegression.t('modelname'),
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
                    label: logisticRegression.t('dependent'),
                    no: "dependent",
                    filter: "Numeric|Date|Logical|Ordinal|Nominal|Scale",
                    extraction: "NoPrefix|UseComma",
                    required: true,
                }), r: ['{{ var | safe}}']
            },
            independent: {
                el: new dstVariableList(config, {
                    label: logisticRegression.t('independent'),
                    no: "independent",
                    required: true,
                    filter: "String|Numeric|Logical|Ordinal|Nominal|Scale",
                    extraction: "NoPrefix|UsePlus",
                }), r: ['{{ var | safe}}']
            },
            generateplotchk: {
                el: new checkbox(config, {
                    label: logisticRegression.t('generateplotchk'),
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
                    label: logisticRegression.t('destination2'),
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
                name: logisticRegression.t('navigation'),
                icon: "icon-logistic_white_comp",
                modal: config.id
            }
        };
        super(config, objects, content);
        
        this.help = {
            title: logisticRegression.t('help.title'),
            r_help: logisticRegression.t('help.r_help'),  //r_help: "help(data,package='utils')",
            body: logisticRegression.t('help.body')
        }
;
    }
}

module.exports = {
    render: () => new logisticRegression().render()
}
