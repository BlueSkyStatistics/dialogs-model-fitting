


class linearRegressionLegacy extends baseModal {
    static dialogId = 'linearRegressionLegacy'
    static t = baseModal.makeT(linearRegressionLegacy.dialogId)

    constructor() {
        var config = {
            id: linearRegressionLegacy.dialogId,
            label: linearRegressionLegacy.t('title'),
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
                    label: linearRegressionLegacy.t('modelname'),
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
                    label: linearRegressionLegacy.t('dependent'),
                    no: "dependent",
                    filter: "Numeric|Scale",
                    extraction: "NoPrefix|UseComma",
                    required: true,
                }), r: ['{{ var | safe}}']
            },
            independent: {
                el: new dstVariableList(config, {
                    label: linearRegressionLegacy.t('independent'),
                    no: "independent",
                    required: true,
                    filter: "String|Numeric|Logical|Ordinal|Nominal|Scale",
                    extraction: "NoPrefix|UsePlus",
                }), r: ['{{ var | safe}}']
            },
            nointercept: {
                el: new checkbox(config, {
                    label: linearRegressionLegacy.t('nointercept'),
                    no: "nointercept",
                    bs_type: "valuebox",
                    extraction: "BooleanValue",
                    true_value: "TRUE",
                    false_value: "FALSE",
                })
            },
            generateplotchk: {
                el: new checkbox(config, {
                    label: linearRegressionLegacy.t('generateplotchk'),
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
                    label: linearRegressionLegacy.t('weights'),
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
                name: linearRegressionLegacy.t('navigation'),
                icon: "icon-linear_regression_white_comp",
                modal: config.id
            }
        };
        super(config, objects, content);
        
        this.help = {
            title: linearRegressionLegacy.t('help.title'),
            r_help: linearRegressionLegacy.t('help.r_help'),  //r_help: "help(data,package='utils')",
            body: linearRegressionLegacy.t('help.body')
        }
;
    }
}

module.exports = {
    render: () => new linearRegressionLegacy().render()
}
