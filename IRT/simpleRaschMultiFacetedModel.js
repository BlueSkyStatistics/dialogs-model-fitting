/**
  * This file is protected by copyright (c) 2023-2025 by BlueSky Statistics, LLC.
  * All rights reserved. The copy, modification, or distribution of this file is not
  * allowed without the prior written permission from BlueSky Statistics, LLC.
 */


var localization = {
    en: {
        title: "Simple Rasch Model (Multi-faceted)",
        navigation: "Simple Rasch Model (Multi-faceted)",
        modelname: "Enter model name",
        destinationvars: "Items",
        firstlevel: "First level variable",
        secondlevel: "Second level variable",
        help: {
            title: "Simple Rasch Model (Multi-faceted)",
            r_help: "help(tam.mml.mfr, package=TAM)",
            body: `
            <b>Description</b>
            <br/>
            Generates parameter estimates for a multi-faceted simple rasch model
            <br/><br/>
            <b>Usage</b>
            <br/>
            <code>
            tam.mml.mfr( resp,facets=,formulaA = ~ formulaA = ~ item+rater,pid = ,verbose=FALSE)
            </code>
            <br/><br/>
            <b>Arguments</b>
            <br/>
            <ul>
            <li>
            resp: Data frame with polychotomous item responses k=0,...,K. Missing responses must be declared as NA.
            </li>
            <li>
            formulaA: Design formula (only applies to tam.mml.mfr). See detailed help. It is also to possible to set all effects of a facet to zero, e.g. item*step + 0*rater (see detailed help).
            </li>
            <li>
            facets: A data frame with facet entries (only applies to tam.mml.mfr)
            </li>
            <li>
            pid: An optional vector of person identifiers
            </li>
            <li>
            verbose: Logical indicating whether output should be printed during iterations. 
            </li>
            </ul>

            <br/><br/><br/>
            <b>Packages</b>
            <br/>
            TAM
            <br/><br/>
            <b>Help</b>
            <br/>
            help(tam.mml.mfr, package='TAM')
`}
    }
}

class simpleRaschMultiFacetedModel extends baseModal {
    constructor() {
        var config = {
            id: "simpleRaschMultiFacetedModel",
            label: localization.en.title,
            modalType: "two",
            RCode: `
require(TAM);

if (!validateDataRasch( vars =c({{selected.destinationvars | safe}}), data ="{{dataset.name}}"))
{
    cat("\nAll variables being analyzed to create a multi-faceted Simple Rasch Model must have unique values of either 0 or 1. Please recode the variables (see Data->Recode) to meet these requirements and re-run the analysis")
} else
{
    {{selected.modelname | safe}} <- tam.mml.mfr( {{dataset.name}}[,c({{selected.destinationvars | safe}})]  ,  facets={{dataset.name}}[,c("{{selected.secondlevel | safe}}"),drop=FALSE] , formulaA = ~ item+{{selected.secondlevel | safe}} , pid = {{dataset.name}}\${{selected.firstlevel | safe}},verbose=FALSE)
    BSkySummary.tam.mml({{selected.modelname | safe}})
}
`
        };
        var objects = {
            content_var: { el: new srcVariableList(config, { action: "move" }) },
            modelname: {
                el: new input(config, {
                    no: 'modelname',
                    label: localization.en.modelname,
                    placeholder: "",
                    required: true,
                    type: "character",
                    extraction: "TextAsIs",
                    value: "simpleRaschMultiFacetedModel1",
                    overwrite: "dataset"
                })
            },
            destinationvars: {
                el: new dstVariableList(config, {
                    label: localization.en.destinationvars,
                    no: "destinationvars",
                    required: true,
                    filter: "String|Numeric|Logical|Ordinal|Nominal|Scale",
                    extraction: "NoPrefix|UseComma|Enclosed",
                }), r: ['{{ var | safe}}']
            },
            firstlevel: {
                el: new dstVariable(config, {
                  label: localization.en.firstlevel,
                  no: "firstlevel",
                  filter: "String|Numeric|Date|Logical|Ordinal|Nominal|Scale",
                  extraction: "NoPrefix|UseComma",
                  required: true,
                }),
              },
              secondlevel: {
                el: new dstVariable(config, {
                  label: localization.en.secondlevel,
                  no: "secondlevel",
                  filter: "String|Numeric|Date|Logical|Ordinal|Nominal|Scale",
                  extraction: "NoPrefix|UseComma",
                  required: true,
                }),
              },
           

        };
        const content = {
            left: [objects.content_var.el.content],
            right: [objects.modelname.el.content, objects.destinationvars.el.content,
            objects.firstlevel.el.content, objects.secondlevel.el.content
            ],
            nav: {
                name: localization.en.navigation,
                icon: "icon-smf",
                modal: config.id
            }
        };
        super(config, objects, content);
        this.help = localization.en.help;
    }
}
module.exports.item = new simpleRaschMultiFacetedModel().render()