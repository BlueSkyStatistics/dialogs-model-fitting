



class linearRegressionFormula extends baseModal {
    static dialogId = 'linearRegressionFormula'
    static t = baseModal.makeT(linearRegressionFormula.dialogId)

    constructor() {
        var config = {
            id: linearRegressionFormula.dialogId,
            label: linearRegressionFormula.t('title'),
            modalType: "two",
            RCode: `
require(equatiomatic)
require(textutils)
#Creating the model
{{selected.modelname | safe}} = lm({{selected.dependent | safe}}~{{selected.formula | safe}}, {{selected.weights | safe}} na.action=na.exclude, data={{dataset.name}})
local ({
#Display theoretical model equation and coefficients
#Display theoretical model
reg_formula = equatiomatic::extract_eq({{selected.modelname | safe}}, raw_tex = FALSE,\n\t wrap = TRUE,  intercept = "alpha", ital_vars = FALSE) 
BSkyFormat(reg_formula)
#Display coefficients
reg_equation = equatiomatic::extract_eq({{selected.modelname | safe}}, use_coefs = TRUE,\n\t wrap = TRUE,ital_vars = FALSE, coef_digits = BSkyGetDecimalDigitSetting() )
BSkyFormat(reg_equation)
#Summarizing the model
BSky_LM_Summary_{{selected.modelname | safe}} = summary({{selected.modelname | safe}})
# Computing 95% confidence interval of the coefficients
# BSky_LM_Summary_{{selected.modelname | safe}}$coefficients<- cbind ( BSky_LM_Summary_{{selected.modelname | safe}}$coefficients, stats::confint({{selected.modelname | safe}},level=0.95,type="LR")[rowSums(is.na(stats::confint({{selected.modelname | safe}},level=0.95,type="LR"))) != ncol(stats::confint({{selected.modelname | safe}},level=0.95,type="LR")), ])
BSkyFormat(BSky_LM_Summary_{{selected.modelname | safe}}, singleTableOutputHeader = "Model Summary")
#Displaying the Anova table
AnovaRes = anova({{selected.modelname | safe}} )
BSkyFormat(as.data.frame(AnovaRes), singleTableOutputHeader = "Anova Table")
#Displaying sum of squares table
df = as.data.frame(AnovaRes)
totalrows = nrow(df)
regSumOfSquares = sum(df[1:totalrows - 1, 2])
residualSumOfSquares = df[totalrows, 2]
totalSumOfSquares = regSumOfSquares + residualSumOfSquares
matSumOfSquares = matrix(c(regSumOfSquares, residualSumOfSquares, 
        totalSumOfSquares), nrow = 3, ncol = 1, dimnames = list(c("Sum of squares of Regression", 
        "Sum of squares of residuals", "Total sum of squares"), 
        c("Values")))
BSkyFormat(matSumOfSquares, singleTableOutputHeader = "Sum of squares Table")
#remove(BSky_LM_Summary_{{selected.modelname | safe}})
#remove({{selected.modelname | safe}})
{{if (options.selected.generateplotchk == "TRUE")}}#displaying plots\n#Plots residuals vs. fitted, normal Q-Q, scale-location, residuals vs. leverage\nplot({{selected.modelname | safe}}){{/if}}
#Adding attributes to support scoring
#We don't add dependent and independent variables as this is handled by our functions
attr(.GlobalEnv\${{selected.modelname | safe}},"classDepVar")= class({{dataset.name}}[, c("{{selected.dependent | safe}}")])
attr(.GlobalEnv\${{selected.modelname | safe}},"depVarSample")= sample({{dataset.name}}[, c("{{selected.dependent | safe}}")], size = 2, replace = TRUE)
})
`
        };
        var objects = {
            content_var: { el: new srcVariableList(config, {action: "move",scroll: true }) },
            modelname: {
                el: new input(config, {
                    no: 'modelname',
                    label: linearRegressionFormula.t('modelname'),
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
                    label: linearRegressionFormula.t('dependent'),
                    no: "dependent",
                    filter: "Numeric|Scale",
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
                    label: linearRegressionFormula.t('generateplotchk'), no: "generateplotchk",
                    bs_type: "valuebox",
                    style: "mt-2 mb-3",
                    extraction: "BooleanValue",
                    true_value: "TRUE",
                    false_value: "FALSE",
                })
            },
            weights: {
                el: new dstVariable(config, {
                    label: linearRegressionFormula.t('weights'),
                    no: "weights",
                    filter: "String|Numeric|Date|Logical|Ordinal|Nominal|Scale",
                    extraction: "NoPrefix|UseComma",
                    wrapped: 'weights=c(%val%),',
                }), r: ['{{ var | safe}}']
            },
        };
        const content = {
            left: [objects.content_var.el.content],
            right: [objects.modelname.el.content, objects.dependent.el.content, objects.formulaBuilder.el.content, objects.generateplotchk.el.content, objects.weights.el.content],
            nav: {
                name: linearRegressionFormula.t('navigation'),
                icon: "icon-linear_regression_formula",
                modal: config.id
            }
        };
        super(config, objects, content);
        
        this.help = {
            title: linearRegressionFormula.t('help.title'),
            r_help: "help(data,package='utils')",
            body: linearRegressionFormula.t('help.body')
        }
;
    }
}

module.exports = {
    render: () => new linearRegressionFormula().render()
}
