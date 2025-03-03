/**
  * This file is protected by copyright (c) 2023-2025 by BlueSky Statistics, LLC.
  * All rights reserved. The copy, modification, or distribution of this file is not
  * allowed without the prior written permission from BlueSky Statistics, LLC.
 */



class mixedModelsBasic extends baseModal {
    static dialogId = 'mixedModelsBasic'
    static t = baseModal.makeT(mixedModelsBasic.dialogId)

    constructor() {
        var config = {
            id: mixedModelsBasic.dialogId,
            label: mixedModelsBasic.t('title'),
            modalType: "two",
            RCode: `
`
        };
        var objects = {
            content_var: { el: new srcVariableList(config, {action: "copy",scroll: true }) },
            modelname: {
                el: new input(config, {
                    no: 'modelname',
                    label: mixedModelsBasic.t('modelname'),
                    placeholder: "",
                    required: true,
                    type: "character",
                    extraction: "TextAsIs",
                    value: "MixedModel1",
                    overwrite: "dataset"
                })
            },
            tvarbox1: {
                el: new dstVariable(config, {
                    label: mixedModelsBasic.t('tvarbox1'),
                    no: "tvarbox1",
                    filter: "Numeric|Scale",
                    extraction: "NoPrefix|UseComma",
                    required: true,
                }), r: ['{{ var | safe}}']
            },
            tvarbox2: {
                el: new formulaBuilder(config, {
                    no: "tvarbox2",
                    label: mixedModelsBasic.t('formulaBuilder'),
                })
            },
            NestingVar: {
                el: new dstVariable(config, {
                    label: mixedModelsBasic.t('NestingVar'),
                    no: "NestingVar",
                    required: true,
                    filter: "String|Numeric|Date|Logical|Ordinal|Nominal|Scale",
                    extraction: "NoPrefix|UseComma",
                }), r: ['{{ var | safe}}']
            },
            label1: { el: new labelVar(config, { label: mixedModelsBasic.t('label1'), h: 5 }) },
            Cov: {
                el: new comboBox(config, {
                    no: 'Cov',
                    label: mixedModelsBasic.t('Cov'),
                    multiple: false,
                    extraction: "NoPrefix|UseComma",
                    options: ["Intercept Only", "Slopes only", "Intercept and Slopes (uncorrelated)", "Intercept and Slopes (correlated)"],
                    default: "Intercept Only"
                })
            },
            estimator: {
                el: new comboBox(config, {
                    no: 'estimator',
                    label: mixedModelsBasic.t('estimator'),
                    multiple: false,
                    extraction: "NoPrefix|UseComma",
                    options: ["REML", "ML"],
                    default: "REML"
                })
            },
            randomvars: {
                el: new dstVariableList(config, {
                    label: mixedModelsBasic.t('randomvars'),
                    no: "randomvars",
                    filter: "String|Numeric|Date|Logical|Ordinal|Nominal|Scale",
                    extraction: "NoPrefix|UseComma",
                }), r: ['{{ var | safe}}']
            },
            ICC: {
                el: new checkbox(config, {
                    label: mixedModelsBasic.t('ICC'),
                    no: "ICC",
                    extraction: "Boolean",
                    newline: true,
                })
            },
            ls: {
                el: new checkbox(config, {
                    label: mixedModelsBasic.t('ls'),
                    no: "ls",
                    extraction: "Boolean",
                    newline: true,
                })
            },
            fixedandobserved: {
                el: new checkbox(config, {
                    label: mixedModelsBasic.t('fixedandobserved'),
                    no: "fixedandobserved",
                    extraction: "Boolean",
                    newline: true,
                })
            },
            CHB7: {
                el: new checkbox(config, {
                    label: mixedModelsBasic.t('CHB7'),
                    no: "CHB7",
                    extraction: "Boolean",
                    newline: true,
                })
            },
            CHQ5: {
                el: new checkbox(config, {
                    label: mixedModelsBasic.t('CHQ5'),
                    no: "CHQ5",
                    extraction: "Boolean",
                    newline: true,
                })
            },
            CHQ2: {
                el: new checkbox(config, {
                    label: mixedModelsBasic.t('CHQ2'),
                    no: "CHQ2",
                    extraction: "Boolean",
                    newline: true,
                    required: true,
                    dependant_objects: ["suffix"],
                })
            },
            suffix: {
                el: new input(config, {
                    no: 'suffix',
                    label: mixedModelsBasic.t('suffix'),
                    extraction: "NoPrefix|UseComma",
                    type: "character",
                    ml: 4,
                })
            },
            CHQ1: {
                el: new checkbox(config, {
                    label: mixedModelsBasic.t('CHQ1'),
                    no: "CHQ1",
                    extraction: "Boolean",
                })
            },
            label2: { el: new labelVar(config, { no: 'label2', label: mixedModelsBasic.t('label2'), style: "mt-3", h: 5 }) },
            CHB6: {
                el: new checkbox(config, {
                    label: mixedModelsBasic.t('CHB6'),
                    no: "CHB6",
                    extraction: "Boolean",
                })
            },
            label3: { el: new labelVar(config, { no: 'label3', label: mixedModelsBasic.t('label3'), style: "mt-0", h: 7 }) },
            RAD1: {
                el: new radioButton(config, { label: mixedModelsBasic.t('rad1'), no: "GRP3", increment: "RAD1", value: "RAD1", state: "checked", extraction: "ValueAsIs" })
            },
            RAD2: {
                el: new radioButton(config, { label: mixedModelsBasic.t('rad2'), no: "GRP3", increment: "RAD2", value: "RAD2", state: "", extraction: "ValueAsIs" })
            },
            RAD3: {
                el: new radioButton(config, { label: mixedModelsBasic.t('rad3'), no: "GRP3", increment: "RAD3", value: "RAD3", state: "", extraction: "ValueAsIs" })
            },
            forcecont: {
                el: new radioButton(config, { label: mixedModelsBasic.t('forcecont'), no: "GRP3", increment: "forcecont", value: "TRUE", state: "", extraction: "ValueAsIs" })
            },
            label4: { el: new labelVar(config, { no: 'label4', label: mixedModelsBasic.t('label4'), style: "mt-3", h: 5 }) },
            RAD10: {
                el: new radioButton(config, { label: mixedModelsBasic.t('rad10'), no: "GRP1", increment: "RAD10", value: "RAD10", state: "checked", extraction: "ValueAsIs" })
            },
            RAD4: {
                el: new radioButton(config, { label: mixedModelsBasic.t('rad4'), no: "GRP1", increment: "RAD4", value: "RAD4", state: "", extraction: "ValueAsIs" })
            },
            RAD5: {
                el: new radioButton(config, { label: mixedModelsBasic.t('rad5'), no: "GRP1", increment: "RAD5", value: "RAD5", state: "", extraction: "ValueAsIs" })
            },
            label5: { el: new labelVar(config, { no: 'label5', label: mixedModelsBasic.t('label5'), style: "mt-1, ml-3", h: 8 }) },
            RAD6: {
                el: new radioButton(config, { label: mixedModelsBasic.t('rad6'), no: "GRP4", increment: "RAD6", style: "ml-4 mt-0", value: "RAD6", state: "checked", extraction: "ValueAsIs" })
            },
            RAD7: {
                el: new radioButton(config, { label: mixedModelsBasic.t('rad7'), no: "GRP4", increment: "RAD7", style: "ml-4", value: "RAD7", state: "", extraction: "ValueAsIs" })
            },
            RAD13: {
                el: new radioButton(config, { label: mixedModelsBasic.t('rad13'), no: "GRP4", increment: "RAD13", style: "ml-4", value: "RAD13", state: "", extraction: "ValueAsIs" })
            },
            RAD14: {
                el: new radioButton(config, { label: mixedModelsBasic.t('rad14'), no: "GRP4", increment: "RAD14", style: "ml-4", value: "RAD14", state: "", extraction: "ValueAsIs" })
            },
            Rsquared: {
                el: new checkbox(config, {
                    label: mixedModelsBasic.t('Rsquared'),
                    no: "Rsquared",
                    extraction: "Boolean",
                })
            },
            label6: { el: new labelVar(config, { no: 'label6', label: mixedModelsBasic.t('label6'), style: "mt-3", h: 5 }) },
            label7: { el: new labelVar(config, { no: 'label7', label: mixedModelsBasic.t('label7'), h: 7 }) },
            label8: { el: new labelVar(config, { no: 'label8', label: mixedModelsBasic.t('label8'), h: 7 }) },
        };
        var advanced = {
            el: new optionsVar(config, {
                no: "advanced",
                name: mixedModelsBasic.t('advanced'),
                content: [
                    objects.ICC.el,
                    objects.ls.el,
                    objects.fixedandobserved.el,
                    objects.CHB7.el,
                    objects.CHQ5.el,
                    objects.CHQ2.el,
                    objects.suffix.el,
                    objects.CHQ1.el,
                    objects.label2.el,
                    objects.CHB6.el,
                    objects.label3.el,
                    objects.RAD1.el,
                    objects.RAD2.el,
                    objects.RAD3.el,
                    objects.forcecont.el,
                    objects.label4.el,
                    objects.RAD10.el,
                    objects.RAD4.el,
                    objects.RAD5.el,
                    objects.label5.el,
                    objects.RAD6.el,
                    objects.RAD7.el,
                    objects.RAD13.el,
                    objects.RAD14.el,
                    objects.Rsquared.el,
                    objects.label6.el,
                    objects.label7.el,
                    objects.label8.el,
                ]
            })
        };
        const content = {
            left: [objects.content_var.el.content],
            right: [objects.modelname.el.content, objects.tvarbox1.el.content, objects.tvarbox2.el.content, objects.NestingVar.el.content, objects.label1.el.content, objects.Cov.el.content, objects.estimator.el.content, objects.randomvars.el.content],
            bottom: [advanced.el.content],
            nav: {
                name: mixedModelsBasic.t('navigation'),
                icon: "icon-mmb",
                modal: config.id
            }
        };
        super(config, objects, content);
        
        this.help = {
            title: mixedModelsBasic.t('help.title'),
            r_help: mixedModelsBasic.t('help.r_help'),  //r_help: "help(data,package='utils')",
            body: mixedModelsBasic.t('help.body')
        }
;
    }
    prepareExecution(instance) {
        var temp = "";
        var tempoutput = "";
        var errorRaised = false;
        var res = [];
        let cmd = {};
        let snippet0 = "\nrequire(lme4);\nrequire(lmerTest);\nrequire(ggplot2);\nrequire(reghelper);\nrequire(emmeans);\nrequire(visreg);\nrequire(performance);\nrequire(equatiomatic);\nrequire(textutils);\nrequire(r2mlm);";
        temp = temp + snippet0 + "\n";
        temp = temp + "\n# [Mixed Effects (Basic)]\n";
        let snippet1 = { RCode: 'lme4::lmer( {{selected.tvarbox1 | safe}}  ~1 + (1 | {{selected.NestingVar | safe}} ), {{selected.estimator | safe}} , data = {{dataset.name}})\n' }
        let snippet2 = { RCode: 'cat (\"The covariance structure you selected: {{selected.cov | safe}} is invalid, you need to select Intercept Only or add variable(s) to the random effects\")' }
        let snippet3 = { RCode: 'lmer({{selected.tvarbox1 | safe}} ~ {{selected.tvarbox2 | safe}} + (1| {{selected.NestingVar | safe}}), {{selected.estimator | safe}}, data = {{dataset.name}})\n' }
        let snippet4 = { RCode: 'cat (\"The covariance structure you selected: {{selected.cov | safe}} is invalid, as you have selected a nesting unit: {{selected.NestingVar | safe}} but have not added variables producing slopes within the nesting unit. You need to select a different covariance structure or add variables\")' }
        let snippet5 = { RCode: 'cat (\"The covariance structure you selected: {{selected.cov | safe}} is invalid as you are attempting to analyze the random variance of: {{selected.randomvars | safe}} within nesting unit: {{selected.NestingVar | safe}}. Please select a different covariance structure or remove the {{selected.randomvars | safe}} variable(s) from the random effects box.\")' }
        
let snippet6 = { RCode: `
###########
###Original code
###########
moderator.above <- mean({{dataset.name}}\${{selected.firstterm | safe}}) + sd({{dataset.name}}\${{selected.firstterm | safe}})
moderator.avg  <- mean({{dataset.name}}\${{selected.firstterm | safe}})
moderator.below <- mean({{dataset.name}}\${{selected.firstterm | safe}}) - sd({{dataset.name}}\${{selected.firstterm | safe}})
mylist <- list({{selected.firstterm | safe}}=c(moderator.above,moderator.avg,moderator.below)) 
simple.slopes1a<-as.data.frame(emtrends({{selected.modelname | safe}}, ~{{selected.secondterm | safe}}, var="{{selected.firstterm | safe}}" ,at=mylist))
t.1a<-as.matrix(simple.slopes1a[2]/simple.slopes1a[3])
colnames(t.1a)<-("t")
df.1a<- as.matrix(simple.slopes1a[4])
p.1a = 2 * pt(t.1a, df.1a, lower.tail=FALSE)
colnames(p.1a)<-("p")
df.1a<- as.matrix(simple.slopes1a[4])
simple.slopes1<-cbind(simple.slopes1a,t.1a,p.1a)
BSkyFormat(simple.slopes1, singleTableOutputHeader ="Simple slope analysis")

###########
###New code
###########

moderator.above <- mean({{dataset.name}}\${{selected.firstterm | safe}}) + sd({{dataset.name}}\${{selected.firstterm | safe}})
moderator.avg  <- mean({{dataset.name}}\${{selected.firstterm | safe}})
moderator.below <- mean({{dataset.name}}\${{selected.firstterm | safe}}) - sd({{dataset.name}}\${{selected.firstterm | safe}})
mylist <- list({{selected.firstterm | safe}}=c(moderator.above,moderator.avg,moderator.below)) 
BSkyEmmForSimpleEffects <- emmeans::emmeans({{selected.modelname | safe}}, ~ {{selected.firstterm | safe}}*{{selected.secondterm | safe}}, at=mylist)
BSkySimpleEffects <- emmeans::contrast(BSkyEmmForSimpleEffects, "pairwise",by="{{selected.firstterm | safe}}")
BSkyFormat(data.frame(BSkySimpleEffects), singleTableOutputHeader ="Simple effects tests")

#simple.slopes1a<-as.data.frame(emtrends({{selected.modelname | safe}}, ~{{selected.secondterm | safe}}, var="{{selected.firstterm | safe}}" ,at=mylist))
#t.1a<-as.matrix(simple.slopes1a[2]/simple.slopes1a[3])
#colnames(t.1a)<-("t")
#df.1a<- as.matrix(simple.slopes1a[4])
#p.1a = 2 * pt(t.1a, df.1a, lower.tail=FALSE)
#colnames(p.1a)<-("p")
#df.1a<- as.matrix(simple.slopes1a[4])
#simple.slopes1<-cbind(simple.slopes1a,t.1a,p.1a)
#BSkyFormat(simple.slopes1, singleTableOutputHeader ="Simple effects tests")
`
}

let snippet7 = { RCode: `
BSkyEmmForSimpleEffects <- emmeans::emmeans({{selected.modelname | safe}}, ~ {{selected.firstterm | safe}}*{{selected.secondterm | safe}})
BSkySimpleEffects <- emmeans::contrast(BSkyEmmForSimpleEffects, "revpairwise", by = "{{selected.firstterm | safe}}", adjust = "none")
BSkyFormat(data.frame(BSkySimpleEffects), singleTableOutputHeader = paste(\"Simple effects for\",  "{{selected.firstterm | safe}}", "by", "{{selected.secondterm | safe}}", sep= \" \", collapse=\"\") )\n
`
}
let snippet81 = { RCode: `
BSkyRsquared <- r2mlm::r2mlm({{selected.modelname | safe}})
BSkyFormat(as.data.frame(unclass(BSkyRsquared[[1]])), singleTableOutputHeader = "Decomposition")
BSkyFormat(as.data.frame(unclass(BSkyRsquared[[2]])), singleTableOutputHeader = "Cluster Specific Effects")
`
}


        
        var code_vars = {
            dataset: {
                name: getActiveDataset()
            },
            selected: {
                tvarbox1: instance.objects.tvarbox1.el.getVal(),
                tvarbox2: instance.objects.tvarbox2.el.getVal(),
                NestingVar: instance.objects.NestingVar.el.getVal(),
                cov: instance.objects.Cov.el.getVal()[0],
                estimator: instance.objects.estimator.el.getVal() == "REML" ? "REML=TRUE" : "REML=FALSE",
                randomvars: instance.objects.randomvars.el.getVal(),
                modelname: instance.objects.modelname.el.getVal(),
                ICC: instance.objects.ICC.el.getVal() ? "TRUE" : "FALSE",
                GRP1: common.getCheckedRadio("mixedModelsBasic_GRP1"),
                GRP3: common.getCheckedRadio("mixedModelsBasic_GRP3"),
                GRP4: common.getCheckedRadio("mixedModelsBasic_GRP4"),
                ls: instance.objects.ls.el.getVal() ? "TRUE" : "FALSE",
                fixedandobserved: instance.objects.fixedandobserved.el.getVal() ? "TRUE" : "FALSE",
                CHB7: instance.objects.CHB7.el.getVal() ? "TRUE" : "FALSE",
                CHB6: instance.objects.CHB6.el.getVal() ? "TRUE" : "FALSE",
                CHQ5: instance.objects.CHQ5.el.getVal() ? "TRUE" : "FALSE",
                CHQ2: instance.objects.CHQ2.el.getVal() ? "TRUE" : "FALSE",
                CHQ1: instance.objects.CHQ1.el.getVal() ? "TRUE" : "FALSE",
                Rsquared: instance.objects.Rsquared.el.getVal() ?"TRUE" : "FALSE",
                suffix: instance.objects.suffix.el.getVal(),
                themes : themeRsyntax
            }
        }

        let results = {}
        let twoWayInteractions = {}
        let covariates = {}
        let fixedEffects = {}
        var singeDependentVar =false
        var  countFixedandCovariates
        let counttwoWayInteractions =0
        results = getFixedEffectsandCovariates(code_vars.selected.tvarbox2)
        covariates = results["covariates"]
        fixedEffects = results["fixedEffects"]
        singeDependentVar =checkSingleDepVar(results)
        countFixedandCovariates = checkSingleDepVar(results)
        twoWayInteractions = listOfAll2WayInteractions(code_vars.selected.tvarbox2, covariates);
        counttwoWayInteractions =Object.keys(twoWayInteractions).length

       
        if (code_vars.selected.NestingVar.length != 0 && code_vars.selected.tvarbox2 === "" && code_vars.selected.randomvars.length == 0 && code_vars.selected.cov === "Intercept Only") {
            tempoutput = instance.dialog.renderSample(snippet1.RCode, code_vars)
        }
        else if (code_vars.selected.NestingVar != "" && code_vars.selected.tvarbox2 === "" && code_vars.selected.randomvars.length == 0 && code_vars.selected.cov != "Intercept Only") {
            tempoutput = instance.dialog.renderSample(snippet2.RCode, code_vars)
            errorRaised = true;

        }
        else if (code_vars.selected.NestingVar != "" && code_vars.selected.tvarbox2 != "" && code_vars.selected.randomvars.length == 0 && code_vars.selected.cov == "Intercept Only") {
            tempoutput = instance.dialog.renderSample(snippet3.RCode, code_vars)
        }
        else if (code_vars.selected.NestingVar != "" && code_vars.selected.tvarbox2 != "" && code_vars.selected.randomvars == "" && code_vars.selected.cov != "Intercept Only") {
            tempoutput = instance.dialog.renderSample(snippet4.RCode, code_vars)
            errorRaised = true;
        }
        else if (code_vars.selected.NestingVar != "" && code_vars.selected.randomvars != "" && code_vars.selected.cov == "Intercept Only") {
            tempoutput = instance.dialog.renderSample(snippet5.RCode, code_vars)
            errorRaised = true;
        }
        else if (code_vars.selected.NestingVar != "" && code_vars.selected.randomvars != "" && code_vars.selected.cov == "Slopes only") {
            let tvarbox2 = "";
            if (code_vars.selected.tvarbox2 == "") {
                tvarbox2 = "1";
            }
            else {
                tvarbox2 = code_vars.selected.tvarbox2
            }
            tempoutput = tempoutput + "lmer(" + code_vars.selected.tvarbox1 + "~" + tvarbox2;
            code_vars.selected.randomvars.forEach(function (value) {
                tempoutput += "+" + "( 0+" + value + "|" + code_vars.selected.NestingVar + ")";
            }
            )
            tempoutput += "," + code_vars.selected.estimator + ", data =" + code_vars.dataset.name + ")\n";
        }
        else if (code_vars.selected.NestingVar != "" && code_vars.selected.randomvars != "" && code_vars.selected.cov == "Intercept and Slopes (correlated)") {
            let tvarbox2 = "";
            if (code_vars.selected.tvarbox2 == "") {
                tvarbox2 = "1";
            }
            else {
                tvarbox2 = code_vars.selected.tvarbox2
            }
            tempoutput = tempoutput + "lmer(" + code_vars.selected.tvarbox1 + "~" + tvarbox2;
            code_vars.selected.randomvars.forEach(function (value) {
                tempoutput += "+" + "(" + value + "|" + code_vars.selected.NestingVar + ")";
            }
            )
            tempoutput += "," + code_vars.selected.estimator + ", data =" + code_vars.dataset.name + ")\n";
        }
        else if (code_vars.selected.NestingVar != "" && code_vars.selected.randomvars != "" && code_vars.selected.cov == "Intercept and Slopes (uncorrelated)") {
            let tvarbox2 = "";
            if (code_vars.selected.tvarbox2 == "") {
                tvarbox2 = "1";
            }
            else {
                tvarbox2 = code_vars.selected.tvarbox2
            }
            tempoutput = tempoutput + "lmer(" + code_vars.selected.tvarbox1 + "~" + tvarbox2;
            code_vars.selected.randomvars.forEach(function (value) {
                tempoutput += "+" + "(" + value + "||" + code_vars.selected.NestingVar + ")";
            }
            )
            tempoutput += "," + code_vars.selected.estimator + ", data =" + code_vars.dataset.name + ")\n";
        }
        else if (code_vars.selected.NestingVar != "" && code_vars.selected.tvarbox2 != "" && code_vars.selected.randomvars == "") {
            tempoutput += "lmer(" + code_vars.selected.tvarbox1 + "~" + code_vars.selected.tvarbox2 + "+ (1| " + code_vars.selected.NestingVar + ")," + code_vars.selected.estimator + ", data =" + code_vars.dataset.name + ")";
        }
        else if (code_vars.selected.NestingVar == "" && code_vars.selected.tvarbox2 != "" && code_vars.selected.randomvars == "") {
            tempoutput += "lmer(" + code_vars.selected.tvarbox1 + "~" + code_vars.selected.tvarbox2 + code_vars.selected.estimator + ", data =" + code_vars.dataset.name + ")\n";
        }
        if (errorRaised) {
            res.push({ cmd: tempoutput, cgid: newCommandGroup(`${instance.config.id}`, `${instance.config.label}`), oriR: instance.config.RCode, code_vars: code_vars })
            return res;
        }
        if (!errorRaised) 
        {
            if ((code_vars.selected.NestingVar != "" && code_vars.selected.randomvars != "" && code_vars.selected.tvarbox2 == ""))
            {
                tempoutput += "BSkyFormat(\"The equatiomatic package only supports models where each random effect has a corresponding fixed effect. You specified variables as randomly varying without including the corresponding fixed effect\")" + "\n";
            }
            else
            {
                tempoutput += "#Display theoretical model equation and coefficients\n";
                tempoutput += "#Display theoretical model\n";
                tempoutput += "reg_formula = equatiomatic::extract_eq(" + code_vars.selected.modelname + ", raw_tex = FALSE, wrap = TRUE, \n\t intercept = \"alpha\", ital_vars = FALSE)\n"; 
                tempoutput += "BSkyFormat(reg_formula)\n";
                tempoutput += "#Display coefficients\n";
                tempoutput += "reg_equation = equatiomatic::extract_eq(" + code_vars.selected.modelname + ", wrap = TRUE, \n\tital_vars = FALSE, use_coefs = TRUE, coef_digits = BSkyGetDecimalDigitSetting())\n";
                tempoutput += "BSkyFormat(reg_equation)\n";
            }
           // if ( !(code_vars.selected.NestingVar.length != 0 && code_vars.selected.tvarbox2 === "" && code_vars.selected.randomvars.length == 0 && code_vars.selected.cov === "Intercept Only"))
           if (code_vars.selected.tvarbox2 != "")
            {
                tempoutput += "#Anova and Effect sizes\n";
                tempoutput += "BSky.Anova.Table <-anova(" + code_vars.selected.modelname + ")\n";
                tempoutput += "BSkyFormat(as.data.frame(BSky.Anova.Table), singleTableOutputHeader = \"ANOVA Table\")\n";
                tempoutput += "#Calculating Effect sizes\n";
                tempoutput += "BSky.effect.sizes <- with(BSky.Anova.Table, NumDF / DenDF * BSky.Anova.Table$\"F value\" / (1 + NumDF / DenDF * BSky.Anova.Table$\"F value\"))\n";
                tempoutput += "names(BSky.effect.sizes) <- row.names(BSky.Anova.Table)\n";
                tempoutput += "BSkyFormat(BSky.effect.sizes, singleTableOutputHeader = \"Effect Sizes: Semi-partial R-squared\")";
            }
            else
            {
                tempoutput += "BSkyFormat(\"Anova table is not generated as there are no predictors\")";
            }
            tempoutput = temp + "#Creating and summarizing the mixed model\n" + code_vars.selected.modelname + " <- " + tempoutput + "\n";
            tempoutput += "BSkySummaryRes <- summary(" + code_vars.selected.modelname + ")" + "\n";
            tempoutput += "#We store the results of the print into an object to suppress the plain text output from R\n";
            tempoutput += "BSkySummaryRes <- BSkyprint.summary.merMod (BSkySummaryRes, correlation =TRUE )\n";
            tempoutput += "BSkyRandomEffectsTest <- lmerTest::ranova(MixedModel1)\n"
            tempoutput += "BSkyFormat(as.data.frame(BSkyRandomEffectsTest), singleTableOutputHeader = \"Likelihood ratio test of random effects\")\n"
                        
        }

        if (code_vars.selected.Rsquared == "TRUE") {
            let allColAttr = fetchAllColumnAttributes();
            let noOfFactors = getNoOFFactorVariablesInFixedEffectsRandomEffects(fixedEffects, code_vars.selected.randomvars, allColAttr)
            if (noOfFactors ==0)
            {
                tempoutput += instance.dialog.renderSample(snippet81.RCode, code_vars)
            }
            else{
                tempoutput += "cat(\"ERROR: Rsquared for mixed effects models is not supported when there are factor variables.\")\n"
            }
        }
        if (code_vars.selected.GRP3 == "RAD2" || code_vars.selected.GRP3 == "RAD3" || code_vars.selected.GRP3 == "forcecont") 
        {
            
            var delimiters = ":"
            var modelVariables = [];
            var printstring = "";
            tempoutput += "\n#Interaction Plots\n";

            if (counttwoWayInteractions > 0)
            {
                if (code_vars.selected.GRP3 == "RAD2") {
                 for (var interaction in twoWayInteractions) {
                    modelVariables = interaction.split(delimiters);
                    printstring = "Effect of " + modelVariables[0] + " as a function of " + modelVariables[1];
                    tempoutput += "print(graph_model(" + code_vars.selected.modelname + ", y =" + code_vars.selected.tvarbox1 + ", x = " + modelVariables[0] + ", lines =" + modelVariables[1] + ", labels = list(title = \"" + printstring + "\")))" + "\n";
                    printstring = "Effect of " + modelVariables[1] + " as a function of " + modelVariables[0];
                    tempoutput += "print(graph_model(" + code_vars.selected.modelname + ", y =" + code_vars.selected.tvarbox1 + ", x = " + modelVariables[1] + ", lines =" + modelVariables[0] + ", bargraph = TRUE" + ", labels = list(title = \"" + printstring + "\")))" + "\n";
                    }
                }
                else if (code_vars.selected.GRP3 == "RAD3") {
                    for (var interaction in twoWayInteractions) {
                        modelVariables = interaction.split(delimiters);
                        printstring = "Effect of " + modelVariables[0] + " as a function of " + modelVariables[1];
                        tempoutput += "#Interaction plots\n";
                        tempoutput += "print(graph_model(" + code_vars.selected.modelname + ", y =" + code_vars.selected.tvarbox1 + ", x = " + modelVariables[0] + ", lines =" + modelVariables[1] + ", bargraph = TRUE" + ", labels = list(title = \"" + printstring + "\")))" + "\n";
                        printstring = "Effect of " + modelVariables[0] + " as a function of " + modelVariables[1];
                        tempoutput += "print(graph_model(" + code_vars.selected.modelname + ", y =" + code_vars.selected.tvarbox1 + ", x = " + modelVariables[1] + ", lines =" + modelVariables[0] + ", bargraph = TRUE" + ", labels = list(title = \"" + printstring + "\")))" + "\n";
                    }
                }
                else if (code_vars.selected.GRP3 == "forcecont") {
                    for (var interaction in twoWayInteractions) {
                        modelVariables = interaction.Split(delimiters);
                        printstring = "Effect of " + modelVariables[0] + " as a function of " + modelVariables[1];
                        tempoutput += "#Interaction plots\n";
                        tempoutput += "print(graph_model(" + code_vars.selected.modelname + ", y =" + code_vars.selected.tvarbox1 + ", x = " + modelVariables[0] + ", lines =" + modelVariables[1] + ", bargraph = FALSE" + ", labels = list(title = \"" + printstring + "\")))" + "\n";
                        printstring = "Effect of " + modelVariables[0] + " as a function of " + modelVariables[1];
                        tempoutput += "print(graph_model(" + code_vars.selected.modelname + ", y =" + code_vars.selected.tvarbox1 + ", x = " + modelVariables[1] + ", lines =" + modelVariables[0] + ", bargraph = FALSE" + ", labels = list(title = \"" + printstring + "\")))" + "\n";
                    }
                }
            }
        else
            {
            tempoutput += "cat(\"Interaction plots cannot be generated  as there are no interactions specified\")\n";

           }

        }
       
        if (code_vars.selected.GRP3 == "RAD4") {
            for (var effect in fixedEffects) {
                tempoutput += "\n#Estimated Marginal Means using method using Kenward Rogers";
                tempoutput += "\nBSkyResultsEmmeans<-emmeans::emmeans(" + code_vars.selected.modelname + ", pairwise ~" + effect + ")";
                tempoutput += "\nBSkyFormat(data.frame(BSkyResultsEmmeans), singleTableOutputHeader =\"Estimated Marginal Means for " +
                    code_vars.selected.tvarbox1 + " by " + effect + " using method = Kenward-Roger with no adjustment\")\n";
            }
        }
        if (code_vars.selected.ICC == "TRUE") {
            tempoutput += "\n#Intraclass Correlation Coefficient\n";
            tempoutput += "BSkyICC <-performance::icc(" + code_vars.selected.modelname + ")\n";
            tempoutput += "BSkyICCAsMatrix <-matrix(c(BSkyICC$ICC_adjusted, BSkyICC$ICC_conditional), nrow = 2, ncol = 1, dimnames = list(c(\"adjusted\", \"conditional\"), c(\"Values\")))\n";
            tempoutput += "BSkyFormat(BSkyICCAsMatrix, singleTableOutputHeader = \"Intraclass Correlation Coefficient\")\n";
        }
        if (code_vars.selected.GRP1 == "RAD4") {
            for (var key in fixedEffects) {
                tempoutput += "\n#Estimated Marginal Means using method using Kenward Rogers";
                tempoutput += "\nBSkyResultsEmmeans<-emmeans::emmeans(" + code_vars.selected.modelname + ", pairwise ~" + key + ")";
                tempoutput += "\nBSkyFormat(data.frame(BSkyResultsEmmeans), singleTableOutputHeader =\"Estimated Marginal Means for " +
                    code_vars.selected.tvarbox1 + " by " + key + " using method = Kenward-Roger with no adjustment\")\n";
            }
        }
        if (code_vars.selected.ls == "TRUE") {
            tempoutput += "\n#Least square means\n";
            if (Object.keys(fixedEffects).length != 0) {
                tempoutput += "BSkylsmeans <-lmerTest::lsmeansLT(" + code_vars.selected.modelname + ")\n";
                tempoutput += "BSkyFormat(as.data.frame(BSkylsmeans), singleTableOutputHeader =\"Least Square Means\")\n";
            }
            else {
                tempoutput += "BSkyFormat(\"Least square means cannot be computed as there are no categorical fixed effects\")\n";
            }
        }
        if (code_vars.selected.GRP1 == "RAD5" && code_vars.selected.GRP4 == "RAD6") {
            for (var key in fixedEffects) {
                tempoutput += "\n#Estimated marginal means using method Satterthwaite and no adjustment\n";
                tempoutput += "BSkyResultsEmmeans<-emmeans::emmeans(" + code_vars.selected.modelname + ", pairwise ~" + key + ", lmer.df = \"satterthwaite\", adjust = \"none\" )" + "\n";
                tempoutput += "BSkyFormat(data.frame(BSkyResultsEmmeans), singleTableOutputHeader =\"Estimated Marginal Means for " +
                    code_vars.selected.tvarbox1 + " by " + key + " using method = Sattherthwaite with no adjustment\")" + "\n";
            }
        }
        if (code_vars.selected.GRP1 == "RAD5" && code_vars.selected.GRP4 == "RAD7") {
            for (var effect in fixedEffects) {
                tempoutput += "\n#Estimated marginal means using method Satterthwaite and adjustment =Tukey\n";
                tempoutput += "BSkyResultsEmmeans<-emmeans::emmeans(" + code_vars.selected.modelname + ", pairwise ~" + effect + ", lmer.df = \"satterthwaite\" , adjust = \"tukey\" )" + "\n";
                tempoutput += "BSkyFormat(data.frame(BSkyResultsEmmeans), singleTableOutputHeader =\"Estimated Marginal Means for " +
                    code_vars.selected.tvarbox1 + " by " + effect + " using method = Satterthwaite with adjustment = Tukey\")" + "\n";
            }
        }
        if (code_vars.selected.GRP1 == "RAD5" && code_vars.selected.GRP4 == "RAD13") {
            for (var effect in fixedEffects) {
                tempoutput += "\n#Estimated marginal means using method Satterthwaite and adjustment =Bonferroni\n";
                tempoutput += "BSkyResultsEmmeans<-emmeans::emmeans(" + code_vars.selected.modelname + ", pairwise ~" + effect + ", lmer.df = \"satterthwaite\" , adjust = \"bonferroni\" )" + "\n";
                tempoutput += "BSkyFormat(data.frame(BSkyResultsEmmeans), singleTableOutputHeader =\"Estimated Marginal Means for " +
                    code_vars.selected.tvarbox1 + " by " + effect + " using method = Satterthwaite with adjustment = Bonferroni\")" + "\n";
            }
        }
        if (code_vars.selected.GRP1 == "RAD5" && code_vars.selected.GRP4 == "RAD14") {
            for (var effect in fixedEffects) {
                tempoutput += "\n#Estimated marginal means using method Satterthwaite and adjustment =FDR";
                tempoutput += "\nBSkyResultsEmmeans<-emmeans::emmeans(" + code_vars.selected.modelname + ", pairwise ~" + effect + ", lmer.df = \"satterthwaite\" , adjust = \"FDR\" )";
                tempoutput += "\nBSkyFormat(data.frame(BSkyResultsEmmeans), singleTableOutputHeader =\"Estimated Marginal Means for " +
                    code_vars.selected.tvarbox1 + " by " + effect + " using method = Satterthwaite with adjustment = FDR\")" + "\n";
            }
        }
     
        if (code_vars.selected.CHB6 == "TRUE" ) 
        {
           /*  if (code_vars.selected.cov == "Intercept Only")
            {
                tempoutput += "\ncat(\"ERROR: Simple slopes cannot be computed when covariance structure is intercept only\")";
            } */
           if (counttwoWayInteractions ==0)
            {
                tempoutput += "\nBSkyFormat(\"ERROR: Simple slopes cannot be computed when there are no interactions specified\")";

            }
            else
            {
                //Let this comment remain, I need this for testing as this worked in certain scenarios and I may have to revert
                /*  tempoutput += "\n#Simple Effects Tests.";
                tempoutput += "\nBSkyResSimpleSlopes <- " + "simple_slopes(" + code_vars.selected.modelname + ")\n";
                tempoutput += "#Simple slopes returns a dataframe class where columns can be \n#list type, we need to convert it to a string type to display correctly.";
                tempoutput += "\nif (!is.null(BSkyResSimpleSlopes))\n{";
                tempoutput += "\nBSkyResSimpleSlopesAsDataframe <- createDataFrameFromList(BSkyResSimpleSlopes)";
                tempoutput += "\nBSkyFormat(BSkyResSimpleSlopesAsDataframe, singleTableOutputHeader = \"Simple Slopes Analysis\")";
                tempoutput += "\n}"; */
                let allColAttr = fetchAllColumnAttributes();
                let interactionTerms =""
                let firstTermMeasure =""
                let secondTermMeasure =""
                for (var interaction in twoWayInteractions) 
                {
                    interactionTerms = interaction.split(":");  
                    firstTermMeasure = allColAttr[interactionTerms [0]].Measure;
                    secondTermMeasure = allColAttr[interactionTerms [1]].Measure;
                    if (firstTermMeasure =="scale" && secondTermMeasure =="factor"  )
                    {
                        code_vars.selected.firstterm  = interactionTerms [0]
                        code_vars.selected.secondterm = interactionTerms [1]
                        tempoutput += instance.dialog.renderSample(snippet6.RCode, code_vars)
                        
                    }
                    if ( firstTermMeasure =="factor" && secondTermMeasure =="scale" )
                    {
                        code_vars.selected.firstterm  = interactionTerms [1]
                        code_vars.selected.secondterm = interactionTerms [0]
                        tempoutput += instance.dialog.renderSample(snippet6.RCode, code_vars)

                    }
                    if ( firstTermMeasure =="factor" && secondTermMeasure =="factor" )
                    {
                        code_vars.selected.firstterm  = interactionTerms [0]
                        code_vars.selected.secondterm = interactionTerms [1]
                        tempoutput += instance.dialog.renderSample(snippet7.RCode, code_vars)
                        code_vars.selected.firstterm  = interactionTerms [1]
                        code_vars.selected.secondterm = interactionTerms [0]
                        tempoutput += instance.dialog.renderSample(snippet7.RCode, code_vars)


                    }
                }
            }
        }
        let varsForMissing = ""
        varsForMissing = getVariablesInMixedModel(code_vars.selected.tvarbox1, code_vars.selected.NestingVar, covariates, fixedEffects, code_vars.selected.randomvars);
            if (code_vars.selected.CHQ1 == "TRUE" || code_vars.selected.CHQ2 == "TRUE") {
            if (code_vars.selected.CHQ1 == "TRUE") {
                tempoutput += "\n\n#Observed Spaghetti plots.\n";
                if (Object.keys(covariates).length != 0) {
                    for (var covar in covariates) {
                        tempoutput += "ggplot(data =" + code_vars.dataset.name + ", aes(x = " + covar + ", y = " + code_vars.selected.tvarbox1 +
                            ",group = " + code_vars.selected.NestingVar + "))" + "+\n\t geom_point() +\n\t geom_line() +\n\t xlab(\"" + covar + "\")" +
                            "+\n\t ylab(\"" + code_vars.selected.tvarbox1 + "\")" + " +\n\t ylim(min(" + code_vars.dataset.name + "$" + code_vars.selected.tvarbox1 + "),max(" + code_vars.dataset.name + "$" + code_vars.selected.tvarbox1 + "))" + "+\n\t ggtitle(\"Observed Spaghetti Plots\")" + "+\n\t scale_x_continuous(breaks = seq(min(" + code_vars.dataset.name + "$" + covar + "), max(" + code_vars.dataset.name + "$" + covar + ")))" + "+" + code_vars.selected.themes;
                    }
                }
                else {
                    tempoutput += "BSkyFormat(\"Observed Spaghetti plots cannot be computed as there are no covariates\")\n";
                }
            }
            if (code_vars.selected.CHQ2 == "TRUE") {
                tempoutput += "\n#Estimated Spaghetti plots.\n";
                if (Object.keys(covariates).length != 0) {
                    if (code_vars.selected.suffix == null || code_vars.selected.suffix == "")
                        code_vars.selected.suffix = "Pred";
                    let predictions = code_vars.selected.tvarbox1 + "_" + code_vars.selected.suffix;
                    tempoutput += code_vars.dataset.name + "$" + predictions + "<- predict(" + code_vars.selected.modelname + "," + code_vars.dataset.name + "[,c(" + varsForMissing + ")]" + ")\n";
                    for (var covar in covariates) {
                        tempoutput += "ggplot(data =" + code_vars.dataset.name + ", aes(x = " + covar + ", y = " + predictions +
                            ",group = " + code_vars.selected.NestingVar + "))" + " +\n\t geom_point() +\n\t geom_line() +\n\t xlab(\"" + covar + "\")" +
                            " +\n\t ylab(\"" + code_vars.selected.tvarbox1 + "\")" + " +\n\t ylim(min(" + code_vars.dataset.name + "$" + code_vars.selected.tvarbox1 + "),max(" + code_vars.dataset.name + "$" + code_vars.selected.tvarbox1 + "))" + " +\n\t ggtitle(\"Estimated Spaghetti Plots\")" + " +\n\t scale_x_continuous(breaks = seq(min(" + code_vars.dataset.name + "$" + covar + "), max(" + code_vars.dataset.name + "$" + covar + ")))" + "+" + code_vars.selected.themes;
                    }
                }
                else {
                    tempoutput += "BSkyFormat(\"Estimated Spaghetti plots cannot be computed as there are no covariates\")\n  ";
                }
            }
        }
        if (code_vars.selected.CHQ5 == "TRUE") {
            tempoutput += "\n#Residual vs. Estimated plot.\n";
            tempoutput += "{\n plot(resid(" + code_vars.selected.modelname + ") ~fitted(" + code_vars.selected.modelname + "), main =\"Residual vs. Fitted\", xlab = \"Fitted\",ylab = \"Residuals\") \n  abline(h = 0)\n}\n";
        }
        if (code_vars.selected.CHB7 == "TRUE") {
            tempoutput += "\n#Normal vs Q-Q Plots.\n";
            tempoutput += "qqnorm(ranef(" + code_vars.selected.modelname + ")$" + code_vars.selected.NestingVar + "[[1]], main = \"Normal Q-Q Plots\")\n";
        }
        if (code_vars.selected.fixedandobserved == "TRUE") {
            tempoutput += "\n#Plot of fixed effects and observed data\n";
            tempoutput += "BSkyFixedEffectsObserved<-visreg(" + code_vars.selected.modelname + ", main =\"Plot Fixed Effects and Observed Data\"," + ", ylab =\"Estimated" + code_vars.selected.tvarbox1 + "score\")\n";
        }
        tempoutput += "\n#Setting attributes for the dependent and independent variable. This will be used when scoring the model\n";
        tempoutput += "attr(" + code_vars.selected.modelname + ", \"depvar\") <-" + "\"'" + code_vars.selected.tvarbox1 + "'\"\n";
        tempoutput += "attr(" + code_vars.selected.modelname + ", \"indepvar\") <-" + "\"c(" + varsForMissing + ")\"\n";
        tempoutput += "attr(" + code_vars.selected.modelname + ", \"classDepVar\") <-" + "class(" + code_vars.dataset.name +  "[, c(\"" +  code_vars.selected.tvarbox1 + "\")]" + ")\n"
        tempoutput += "attr(" + code_vars.selected.modelname + ", \"depVarSample\") <-" + "sample(" + code_vars.dataset.name +  "[, c(\"" +  code_vars.selected.tvarbox1 + "\")]" + ", size = 2, replace = TRUE)\n"
        tempoutput += "\n#Removing temporary objects\n";
        tempoutput += "if (exists('BSkySummaryRes')){rm(BSkySummaryRes)}\n";
        tempoutput += "if (exists('BSkyResultsEmmeans')){rm(BSkyResultsEmmeans)}\n";
        tempoutput += "if (exists('BSkyResSimpleSlopes')){rm(BSkyResSimpleSlopes)}\n";
        tempoutput += "if (exists('BSkyResSimpleSlopesAsDataframe')){rm(BSkyResSimpleSlopesAsDataframe)}\n";
        tempoutput += "if (exists('BSkyFixedEffectsObserved')){rm(BSkyFixedEffectsObserved)}\n";
        tempoutput += "if (exists('reg_formula')){rm(reg_formula)}\n";
        tempoutput += "if (exists('reg_equation')){rm(reg_equation)}\n";
        tempoutput = tempoutput + "\n\n";
        res.push({ cmd: tempoutput, cgid: newCommandGroup(`${instance.config.id}`, `${instance.config.label}`), oriR: instance.config.RCode, code_vars: code_vars })
        return res;
    }
}

module.exports = {
    render: () => new mixedModelsBasic().render()
}
