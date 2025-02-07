



class glzm extends baseModal {
    static dialogId = 'glzm'
    static t = baseModal.makeT(glzm.dialogId)

    constructor() {
        var config = {
            id: glzm.dialogId,
            label: glzm.t('title'),
            modalType: "two",
            RCode: `
require(MASS);
require(equatiomatic);
require(textutils);
#Removing temporary objects
if (exists("{{selected.modelname | safe}}")) rm({{selected.modelname | safe}})
{{if (options.selected.family == "negative.binomial")}}
{{selected.modelname | safe}} = MASS::glm.nb({{selected.dependent | safe}} ~ {{selected.formula | safe}} {{selected.offset | safe}}, link="{{selected.combokid | safe}}",{{if (options.selected.theta != "")}}init.theta = {{selected.theta | safe}}, {{/if}} {{if(options.selected.weights != "")}}weights = {{selected.weights | safe}},{{/if}} na.action=na.exclude, data={{dataset.name}})
{{#else}}
{{selected.modelname | safe}} = glm({{selected.dependent | safe}}~{{selected.formula | safe}} {{selected.offset | safe}},family ={{selected.family | safe}}(link="{{selected.combokid | safe}}" {{if (options.selected.family == "negative.binomial")}}, theta = {{selected.theta | safe}}{{/if}}), {{if(options.selected.weights != "")}}weights = {{selected.weights | safe}},{{/if}} na.action=na.exclude, data={{dataset.name}})
{{/if}}
{{if (!((options.selected.family == "negative.binomial" && options.selected.combokid =="identity") || (options.selected.family == "negative.binomial" && options.selected.combokid =="sqrt")) )}}
#Display theoretical model equation and coefficients
#Display theoretical model
reg_formula = equatiomatic::extract_eq({{selected.modelname | safe}}, raw_tex = FALSE,\n\t wrap = TRUE, intercept = "alpha", ital_vars = FALSE)  
BSkyFormat(reg_formula)
#Display coefficients
reg_equation = equatiomatic::extract_eq({{selected.modelname | safe}}, use_coefs = TRUE,\n\t wrap = TRUE,ital_vars = FALSE, coef_digits = BSkyGetDecimalDigitSetting() )
BSkyFormat(reg_equation)
{{/if}}
BSky_GLM_Summary_{{selected.modelname | safe}} = summary({{selected.modelname | safe}})
{{if (options.selected.family == "negative.binomial")}}
BSky_orig_class = class(BSky_GLM_Summary_{{selected.modelname | safe}})
BSky_GLM_Summary_{{selected.modelname | safe}} = BSky_GLM_Summary_{{selected.modelname | safe}} [!is.na(names(BSky_GLM_Summary_{{selected.modelname | safe}}))]
class(BSky_GLM_Summary_{{selected.modelname | safe}}) = unique(c("summary.glm", BSky_orig_class))
{{/if}}
BSkyFormat(BSky_GLM_Summary_{{selected.modelname | safe}})
#Coefficients -95% confidence interval
BSkyFormat(cbind(Estimate=coef({{selected.modelname | safe}}),stats::confint({{selected.modelname | safe}},level=0.95)),singleTableOutputHeader='Coefficient estimates and 95% confidence intervals')
{{if (options.selected.expCoefficients =="TRUE")}}
#Exponents of the coefficients and 95% confidence interval
BSkyFormat(exp(cbind(Exp_Coef=coef({{selected.modelname | safe}}),stats::confint({{selected.modelname | safe}},level=0.95))),singleTableOutputHeader='Exponentiated coefficient estimates and 95% confidence intervals')
{{/if}}
#Adding attributes to support scoring
##The attribute indepvar does not have to be populated as the function getModelIndependentVariables handles models of class glm and negbin (negative binomial)
attr(.GlobalEnv\${{selected.modelname | safe}},"depvar")="{{selected.dependent | safe}}"
attr(.GlobalEnv\${{selected.modelname | safe}},"classDepVar")= class({{dataset.name}}[, c("{{selected.dependent | safe}}")])
attr(.GlobalEnv\${{selected.modelname | safe}},"depVarSample")= sample({{dataset.name}}[, c("{{selected.dependent | safe}}")], size = 2, replace = TRUE)
{{/if}}
`
        }
        var objects = {
            modelname: {
                el: new input(config, {
                    no: 'modelname',
                    label: glzm.t('modelname'),
                    placeholder: "",
                    value:"GLZM1",
                    extraction: "NoPrefix|UseComma",
                    required: true,
                    type: "character",
                    overwrite: "dataset"
                })
            },
            content_var: { el: new srcVariableList(config, {action: "move",scroll: true }) },
            dependent: {
                el: new dstVariable(config, {
                    label: glzm.t('dependent'),
                    no: "dependent",
                    filter: "Numeric|Logical|Ordinal|Nominal|Scale",
                    extraction: "NoPrefix|UseComma",
                    required: true,
                }), r: ['{{ var | safe}}']
            },
            formulaBuilder: {
                el: new formulaBuilder(config, {
                    no: "formula",
                    required:true,
                    label: glzm.t('formulaBuilder'),
                })
            },
            offset: {
                el: new dstVariable(config, {
                    label: glzm.t('offset'),
                    no: "offset",
                    filter: "Numeric|Scale",
                    wrapped: '+ offset(%val%)',
                    extraction: "NoPrefix|UseComma",
                }), r: ['{{ var | safe}}']
            },
            weights: {
                el: new dstVariable(config, {
                    label: glzm.t('weights'),
                    no: "weights",
                    filter: "Numeric|Scale",
                    extraction: "NoPrefix|UseComma",
                })
            },
            family: {
                el: new comboBoxWithChilderen(config, {
                    no: 'family',
                    nochild: 'combokid',
                    label: glzm.t('family'),
                    multiple: false,
                    extraction: "NoPrefix|UseComma",
                    options: [
                        { "name": "binomial", "value": ["logit", "probit", "cauchit","log","cloglog"] },
                        { "name": "Gamma", "value": ["inverse","identity",  "log"] },
                        { "name": "gaussian", "value": ["identity", "inverse", "log"] },
                        { "name": "inverse.gaussian", "value": ["1/mu^2","identity", "inverse", "log" ] },
                        { "name": "negative.binomial", "value": ["log", "identity", "sqrt"] },
                        { "name": "poisson", "value": [ "log","identity", "sqrt"] },
                        { "name": "quasi", "value": [ "logit","probit","cloglog","identity","inverse", "log", "1/mu^2","sqrt" ] },
                        { "name": "quasibinomial", "value": ["logit", "probit", "cloglog"] },
                        { "name": "quasipoisson", "value": ["log","identity",  "sqrt"] },
                    ]
                })
            },
            theta: {
                el: new input(config, {
                    no: 'theta',
                    label: glzm.t('theta'),
                    placeholder: "",
                    allow_spaces:true,
                    value:"",
                    width: "w-25",
                    extraction: "NoPrefix|UseComma",
                    type: "numeric",
                })
            },

            expCoefficients: {
                el: new checkbox(config, {
                  label: glzm.t('expCoefficients'),
                  no: "expCoefficients",
                  extraction: "Boolean"
                })
              },
        }
        const content = {
            head: [objects.modelname.el.content],
            left: [objects.content_var.el.content],
            right: [objects.dependent.el.content, objects.formulaBuilder.el.content, objects.offset.el.content, objects.weights.el.content],
            bottom: [objects.family.el.content, objects.theta.el.content, objects.expCoefficients.el.content],
            nav: {
                name: glzm.t('navigation'),
                icon: "icon-glz",
                modal: config.id
            }
        }
        super(config, objects, content);
        
        this.help = {
            title: glzm.t('help.title'),
            r_help: glzm.t('help.r_help'),  //r_help: "help(data,package='utils')",
            body: glzm.t('help.body')
        }
;
    }
}

module.exports = {
    render: () => new glzm().render()
}
