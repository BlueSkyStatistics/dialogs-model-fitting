/**
  * This file is protected by copyright (c) 2023-2025 by BlueSky Statistics, LLC.
  * All rights reserved. The copy, modification, or distribution of this file is not
  * allowed without the prior written permission from BlueSky Statistics, LLC.
 */




class simpleRaschMultiFacetedModel extends baseModal {
    static dialogId = 'simpleRaschMultiFacetedModel'
    static t = baseModal.makeT(simpleRaschMultiFacetedModel.dialogId)

    constructor() {
        var config = {
            id: simpleRaschMultiFacetedModel.dialogId,
            label: simpleRaschMultiFacetedModel.t('title'),
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
                    label: simpleRaschMultiFacetedModel.t('modelname'),
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
                    label: simpleRaschMultiFacetedModel.t('destinationvars'),
                    no: "destinationvars",
                    required: true,
                    filter: "String|Numeric|Logical|Ordinal|Nominal|Scale",
                    extraction: "NoPrefix|UseComma|Enclosed",
                }), r: ['{{ var | safe}}']
            },
            firstlevel: {
                el: new dstVariable(config, {
                  label: simpleRaschMultiFacetedModel.t('firstlevel'),
                  no: "firstlevel",
                  filter: "String|Numeric|Date|Logical|Ordinal|Nominal|Scale",
                  extraction: "NoPrefix|UseComma",
                  required: true,
                }),
              },
              secondlevel: {
                el: new dstVariable(config, {
                  label: simpleRaschMultiFacetedModel.t('secondlevel'),
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
                name: simpleRaschMultiFacetedModel.t('navigation'),
                icon: "icon-smf",
                modal: config.id
            }
        };
        super(config, objects, content);
        
        this.help = {
            title: simpleRaschMultiFacetedModel.t('help.title'),
            r_help: simpleRaschMultiFacetedModel.t('help.r_help'),  //r_help: "help(data,package='utils')",
            body: simpleRaschMultiFacetedModel.t('help.body')
        }
;
    }
}

module.exports = {
    render: () => new simpleRaschMultiFacetedModel().render()
}
