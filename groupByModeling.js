
var localization = {
    en: {
        title: "Group By Modeling",
        navigation: "By Group",
        modelselected:"Select a model to compare statistics for each group",
        lbl2: "Save results to output or to datasets",
        rd1: "Display results in Output",
        rd2: "Enter prefix for datasets",
        grp1: "Select the grouping variable",
        dependent: "Variable to Predict",
        independent: "Independent variable(s)",

        help: {
            title: "Group By Modeling",
            r_help: "help(glance, package='broom')",
            body: `
            <b>Description</b>
            <br/>
            <br/>
            Supports the creation of a model for groups within the dataset and displays the model statistics in a single output table to enable easy analysis of model information for each group
            <br/>
            We use the following functions
            <br/>
            glance
            <br/>
            tidy
            <br/>
            augment
            <br/>
            <br/>
            
            <b>Description:</b> glance
            <br/>
            <br/>
            Construct a single row summary "glance" of a model, fit, or other object. glance methods always return either a one-row data frame (except on NULL, which returns an empty data frame)
            <br/>
            <br/>
            <b>Usage</b>
            <br/>
            <br/>
            glance(x, ...)
            <br/>
            <br/>
            <b>Arguments</b>
            <br/>
            <br/>
            x model or other R object to convert to single-row data frame
            <br/>
            ... other arguments passed to methods
            <br/>
            <br/>
            
            <b>Description:</b> tidy
            <br/>
            <br/>
            Tidy the results of a model into a data frame. The output of tidy is always a data.frame with disposable row names. It is therefore suited for further manipulation by packages like dplyr, reshape2, ggplot2 and ggvis.
            <br/>
            <br/>
            <b>Usage</b>
            <br/>
            <br/>
            tidy(x, ...)
            <br/>
            <br/>
            <b>Arguments</b>
            <br/>
            <br/>
            x model or other R object to convert to single-row data frame
            <br/>
            ... other arguments passed to methods
            <br/>
            <br/>

            <b>Description:</b> augment
            <br/>
            <br/>
            Augment data according to a tidied model. Given an R statistical model or other non-tidy object, add columns to the original dataset such as predictions, residuals and cluster assignments.
            <br/>
            <br/>
            <b>Usage</b>
            <br/>
            <br/>
            augment(x, ...)
            <br/>
            <br/>
            <b>Arguments</b>
            <br/>
            <br/>
            x model or other R object to convert to single-row data frame
            <br/>
            ... other arguments passed to methods
            <br/>
            <br/>

            <b>Help</b>
            <br/>
            help(glance, package="broom")
            <br/>
            help(tidy, package="broom")
            <br/>
            help(augment,, package="broom")
            <br/>
            <b>Packages:</b>
            <br/> 
            broom
    `}
    }
}



class groupByModeling extends baseModal {
    constructor() {
        var config = {
            id: "groupByModeling",
            label: localization.en.title,
            modalType: "two",
            RCode: `
            require(broom);
            require(dplyr);

    local({
        if ("{{selected.grp123 | safe}}" == "DisplayResultsInOutput")
        {
            if ("{{selected.modelselected | safe}}"=="Multinomial Logistic")
            {
                m1=LoadPackage("nnet")
                if (!grepl("ERROR", m1)) 
                {
                    by_{{dataset.name}}= group_by({{dataset.name}},{{selected.grp1 | safe}})
                    glanceResults <-do(by_{{dataset.name}}, glance( multinom({{selected.dependent | safe}} ~ {{selected.independent | safe}}, data = .)))
                    BSkyFormat(as.data.frame(glanceResults),decimalDigitsRounding=4,engNotationSetting=BSkyGetEngNotationSetting(),singleTableOutputHeader="Model Statistics for each group as returned by the function Glance")
                    
                    tidyResults<-do(by_{{dataset.name}}, tidy( multinom({{selected.dependent | safe}} ~ {{selected.independent | safe}}, data = .)))
                    BSkyFormat(as.data.frame(tidyResults),decimalDigitsRounding=4,engNotationSetting=BSkyGetEngNotationSetting(),singleTableOutputHeader="Model Statistics for each group as returned by the function Tidy")
                    
                    augmentResults<-do(by_{{dataset.name}}, augment( multinom({{selected.dependent | safe}} ~ {{selected.independent | safe}}, data = .)))
                    BSkyFormat(as.data.frame(augmentResults),decimalDigitsRounding=4,engNotationSetting=BSkyGetEngNotationSetting(),singleTableOutputHeader="Model Statistics for each group as returned by the function Augment")
                }
            }
            else if ("{{selected.modelselected | safe}}"=="Anova")
            {
                by_{{dataset.name}}= group_by({{dataset.name}},{{selected.grp1 | safe}})
                                glanceResults <-do(by_{{dataset.name}}, 
                glance( aov({{selected.dependent | safe}} ~ {{selected.independent | safe}}, data = .)))
                BSkyFormat(as.data.frame(glanceResults),decimalDigitsRounding=4,engNotationSetting=BSkyGetEngNotationSetting(),singleTableOutputHeader="Model Statistics for each group as returned by the function Glance")
                
                tidyResults<-do(by_{{dataset.name}}, 
                tidy( aov({{selected.dependent | safe}} ~ {{selected.independent | safe}}, data = .)))
                BSkyFormat(as.data.frame(tidyResults),decimalDigitsRounding=4,engNotationSetting=BSkyGetEngNotationSetting(),singleTableOutputHeader="Model Statistics for each group as returned by the function Tidy")
                
                augmentResults<-do(by_{{dataset.name}}, 
                augment( aov({{selected.dependent | safe}} ~ {{selected.independent | safe}}, data = .)))
                BSkyFormat(as.data.frame(augmentResults),decimalDigitsRounding=4,engNotationSetting=BSkyGetEngNotationSetting(),singleTableOutputHeader="Model Statistics for each group as returned by the function Augment")
            }
            else if ("{{selected.modelselected | safe}}"=="Regression")
            {
                by_{{dataset.name}}= group_by({{dataset.name}},{{selected.grp1 | safe}})
                glanceResults <-do(by_{{dataset.name}}, 
                glance( lm({{selected.dependent | safe}} ~ {{selected.independent | safe}}, data = .)))
                BSkyFormat(as.data.frame(glanceResults),decimalDigitsRounding=4,engNotationSetting=BSkyGetEngNotationSetting(),singleTableOutputHeader="Model Statistics for each group as returned by the function Glance")
                
                tidyResults<-do(by_{{dataset.name}}, 
                tidy( lm({{selected.dependent | safe}} ~ {{selected.independent | safe}}, data = .)))
                BSkyFormat(as.data.frame(tidyResults),decimalDigitsRounding=4,engNotationSetting=BSkyGetEngNotationSetting(),singleTableOutputHeader="Model Statistics for each group as returned by the function Tidy")
                
                augmentResults<-do(by_{{dataset.name}}, 
                augment( lm({{selected.dependent | safe}} ~ {{selected.independent | safe}}, data = .)))
                BSkyFormat(as.data.frame(augmentResults),decimalDigitsRounding=4,engNotationSetting=BSkyGetEngNotationSetting(),singleTableOutputHeader="Model Statistics for each group as returned by the function Augment")
            }
        }
        
        if ("{{selected.grp123 | safe}}" == "SaveResultsToDatasets")
        {
            if ("{{selected.modelselected | safe}}"=="Multinomial Logistic")
            {
                m1=LoadPackage("nnet")
                if (!grepl("ERROR", m1)) 
                {
                    by_{{dataset.name}}= group_by({{dataset.name}},{{selected.grp1 | safe}})
                    
                    {{selected.prefixName | safe}}Glance_Results <<-do(by_{{dataset.name}}, glance( multinom({{selected.dependent | safe}} ~ {{selected.independent | safe}}, data = .)))
                    
                    #BSkyFormat(as.data.frame(glanceResults),decimalDigitsRounding=4,engNotationSetting=BSkyGetEngNotationSetting(),singleTableOutputHeader="Model Statistics for each group as returned by the function Glance")
                    
                    {{selected.prefixName | safe}}Tidy_Results<<-do(by_{{dataset.name}}, tidy( multinom({{selected.dependent | safe}} ~ {{selected.independent | safe}}, data = .)))
                    #BSkyFormat(as.data.frame(tidyResults),decimalDigitsRounding=4,engNotationSetting=BSkyGetEngNotationSetting(),singleTableOutputHeader="Model Statistics for each group as returned by the function Tidy")
                    
                    {{selected.prefixName | safe}}Augment_Results<<-do(by_{{dataset.name}}, augment( multinom({{selected.dependent | safe}} ~ {{selected.independent | safe}}, data = .)))
                    #BSkyFormat(as.data.frame(augmentResults),decimalDigitsRounding=4,engNotationSetting=BSkyGetEngNotationSetting(),singleTableOutputHeader="Model Statistics for each group as returned by the function Augment")
                }
            }
            else if ("{{selected.modelselected | safe}}"=="Anova")
            {
                by_{{dataset.name}}= group_by({{dataset.name}},{{selected.grp1 | safe}})
                                {{selected.prefixName | safe}}Glance_Results <<-do(by_{{dataset.name}}, 
                glance( aov({{selected.dependent | safe}} ~ {{selected.independent | safe}}, data = .)))
                #BSkyFormat(as.data.frame(glanceResults),decimalDigitsRounding=4,engNotationSetting=BSkyGetEngNotationSetting(),singleTableOutputHeader="Model Statistics for each group as returned by the function Glance")
                
                {{selected.prefixName | safe}}Tidy_Results<<-do(by_{{dataset.name}}, 
                tidy( aov({{selected.dependent | safe}} ~ {{selected.independent | safe}}, data = .)))
                #BSkyFormat(as.data.frame(tidyResults),decimalDigitsRounding=4,engNotationSetting=BSkyGetEngNotationSetting(),singleTableOutputHeader="Model Statistics for each group as returned by the function Tidy")
                
                {{selected.prefixName | safe}}Augment_Results<<-do(by_{{dataset.name}}, 
                augment( aov({{selected.dependent | safe}} ~ {{selected.independent | safe}}, data = .)))
                #BSkyFormat(as.data.frame(augmentResults),decimalDigitsRounding=4,engNotationSetting=BSkyGetEngNotationSetting(),singleTableOutputHeader="Model Statistics for each group as returned by the function Augment")
            }
            else if ("{{selected.modelselected | safe}}"=="Regression")
            {
                by_{{dataset.name}}= group_by({{dataset.name}},{{selected.grp1 | safe}})
                {{selected.prefixName | safe}}Glance_Results <<-do(by_{{dataset.name}}, 
                glance( lm({{selected.dependent | safe}} ~ {{selected.independent | safe}}, data = .)))
                #BSkyFormat(as.data.frame(glanceResults),decimalDigitsRounding=4,engNotationSetting=BSkyGetEngNotationSetting(),singleTableOutputHeader="Model Statistics for each group as returned by the function Glance")
                
                {{selected.prefixName | safe}}Tidy_Results<<-do(by_{{dataset.name}}, 
                tidy( lm({{selected.dependent | safe}} ~ {{selected.independent | safe}}, data = .)))
                #BSkyFormat(as.data.frame(tidyResults),decimalDigitsRounding=4,engNotationSetting=BSkyGetEngNotationSetting(),singleTableOutputHeader="Model Statistics for each group as returned by the function Tidy")
                
                {{selected.prefixName | safe}}Augment_Results<<-do(by_{{dataset.name}}, 
                augment( lm({{selected.dependent | safe}} ~ {{selected.independent | safe}}, data = .)))
                #BSkyFormat(as.data.frame(augmentResults),decimalDigitsRounding=4,engNotationSetting=BSkyGetEngNotationSetting(),singleTableOutputHeader="Model Statistics for each group as returned by the function Augment")
                
            }
        }
    }) 
        
    if (exists("{{selected.prefixName | safe}}Glance_Results"))
    {
        {{selected.prefixName | safe}}Glance_Results <<- as.data.frame({{selected.prefixName | safe}}Glance_Results)
    }
    BSkyDoesDatasetExist =exists("{{selected.prefixName | safe}}Glance_Results")
    BSkyLoadRefreshDataframe(dframe={{selected.prefixName | safe}}Glance_Results,load.dataframe=BSkyDoesDatasetExist)

    if (exists("{{selected.prefixName | safe}}Tidy_Results"))
    {
        {{selected.prefixName | safe}}Tidy_Results <<- as.data.frame({{selected.prefixName | safe}}Tidy_Results)
    }
    BSkyDoesDatasetExist =exists("{{selected.prefixName | safe}}Tidy_Results")
    BSkyLoadRefreshDataframe(dframe={{selected.prefixName | safe}}Tidy_Results,load.dataframe=BSkyDoesDatasetExist)

    if (exists("{{selected.prefixName | safe}}Augment_Results"))
    {
        {{selected.prefixName | safe}}Augment_Results <<- as.data.frame({{selected.prefixName | safe}}Augment_Results)
    }
    BSkyDoesDatasetExist =exists("{{selected.prefixName | safe}}Augment_Results")
    BSkyLoadRefreshDataframe(dframe={{selected.prefixName | safe}}Augment_Results,load.dataframe=BSkyDoesDatasetExist)
    if (exists("BSkyDoesDatasetExist"))
    {
        rm(BSkyDoesDatasetExist)
    }
`
        }
        var objects = {
            modelselected: {
                el: new selectVar(config, {
                    no: 'modelselected',
                    label: localization.en.modelselected,
                    multiple: false,
                    extraction: "NoPrefix|UseComma",
                    options: ["Regression", "Anova", "Multinomial Logistic"],
                    default: "Regression"
                    
                })
            },

            lbl2: { el: new labelVar(config, { label: localization.en.lbl2, h: 6 }) },
            rd1: {
                el: new radioButton(config, {
                    label: localization.en.rd1,
                    no: "grp123",
                    increment: "",
                    value: "DisplayResultsInOutput",
                    state: "checked",
                    extraction: "ValueAsIs"
                })
            },
            rd2: {
                el: new radioButton(config, {
                    label: localization.en.rd2,
                    no: "grp123",
                    increment: "",
                    value: "SaveResultsToDatasets",
                    state: "",
                    extraction: "ValueAsIs"

                })
            },
            prefixName: {
                el: new input(config, {
                    no: 'prefixName',
                    label: "Dataset Prefix",
                    placeholder: "",
                    value:"",
                    style: "ml-4",
                    extraction: "NoPrefix|UseComma",
                    type: "character",
                    overwrite: "dataset"
                })
            },            
           
            content_var: { el: new srcVariableList(config, {action: "move"}) },

            grp1: {
                el: new dstVariable(config, {
                    label: localization.en.grp1,
                    no: "grp1",
                    filter: "String|Numeric|Date|Logical|Ordinal|Nominal|Scale",
                    extraction: "NoPrefix|UseComma",
                    required: true
                }), r: ['{{ var | safe}}']
            },
            dependent: {
                el: new dstVariable(config, {
                    label: localization.en.dependent,
                    no: "dependent",
                    filter: "String|Numeric|Date|Logical|Ordinal|Nominal|Scale",
                    extraction: "NoPrefix|UseComma",
                    required: true,
                }), r: ['{{ var | safe}}']
            },
            independent: {
                el: new dstVariableList(config, {
                    label: localization.en.independent,
                    no: "independent",
                    filter: "String|Numeric|Date|Logical|Ordinal|Nominal|Scale",
                    extraction: "NoPrefix|UsePlus",
                    required: true
                }), r: ['{{ var | safe}}']
            },
            
        }
        const content = {
            head: [objects.modelselected.el.content,
                objects.lbl2.el.content, objects.rd1.el.content,
                objects.rd2.el.content,objects.prefixName.el.content,],
            left: [objects.content_var.el.content],
            right: [objects.grp1.el.content, objects.dependent.el.content, objects.independent.el.content],
            nav: {
                name: localization.en.navigation,
                icon: "icon-group",
                modal: config.id
            }
        }
        super(config, objects, content);
        this.help = localization.en.help;
    }
}
module.exports.item = new groupByModeling().render()