/**
  * This file is protected by copyright (c) 2023-2025 by BlueSky Statistics, LLC.
  * All rights reserved. The copy, modification, or distribution of this file is not
  * allowed without the prior written permission from BlueSky Statistics, LLC.
 */




class ratingScaleMultiFacetedModel extends baseModal {
    static dialogId = 'ratingScaleMultiFacetedModel'
    static t = baseModal.makeT(ratingScaleMultiFacetedModel.dialogId)

    constructor() {
        var config = {
            id: ratingScaleMultiFacetedModel.dialogId,
            label: ratingScaleMultiFacetedModel.t('title'),
            modalType: "two",
            RCode: `
require(TAM);

if (validateDataRatingScale(vars=c({{selected.destinationvars | safe}}),data= "{{dataset.name}}"))
{
    {{selected.modelname | safe}} <- tam.mml.mfr( {{dataset.name}}[,c({{selected.destinationvars | safe}})]  ,  facets={{dataset.name}}[,c("{{selected.secondlevel | safe}}"),drop=FALSE] , formulaA = ~ item+step+{{selected.secondlevel | safe}} , pid = {{dataset.name}}\${{selected.firstlevel | safe}},verbose=FALSE)
    BSkySummary.tam.mml({{selected.modelname | safe}})
}
`
        };
        var objects = {
            content_var: { el: new srcVariableList(config, { action: "move" }) },
            modelname: {
                el: new input(config, {
                    no: 'modelname',
                    label: ratingScaleMultiFacetedModel.t('modelname'),
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
                    label: ratingScaleMultiFacetedModel.t('destinationvars'),
                    no: "destinationvars",
                    required: true,
                    filter: "String|Numeric|Logical|Ordinal|Nominal|Scale",
                    extraction: "NoPrefix|UseComma|Enclosed",
                }), r: ['{{ var | safe}}']
            },
            firstlevel: {
                el: new dstVariable(config, {
                  label: ratingScaleMultiFacetedModel.t('firstlevel'),
                  no: "firstlevel",
                  filter: "String|Numeric|Date|Logical|Ordinal|Nominal|Scale",
                  extraction: "NoPrefix|UseComma",
                  required: true,
                }),
              },
              secondlevel: {
                el: new dstVariable(config, {
                  label: ratingScaleMultiFacetedModel.t('secondlevel'),
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
                name: ratingScaleMultiFacetedModel.t('navigation'),
                icon: "icon-rsmf",
                modal: config.id
            }
        };
        super(config, objects, content);
        
        this.help = {
            title: ratingScaleMultiFacetedModel.t('help.title'),
            r_help: ratingScaleMultiFacetedModel.t('help.r_help'),  //r_help: "help(data,package='utils')",
            body: ratingScaleMultiFacetedModel.t('help.body')
        }
;
    }
}

module.exports = {
    render: () => new ratingScaleMultiFacetedModel().render()
}
