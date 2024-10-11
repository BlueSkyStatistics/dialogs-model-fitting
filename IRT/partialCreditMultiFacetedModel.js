


class partialCreditMultiFacetedModel extends baseModal {
    static dialogId = 'partialCreditMultiFacetedModel'
    static t = baseModal.makeT(partialCreditMultiFacetedModel.dialogId)

    constructor() {
        var config = {
            id: partialCreditMultiFacetedModel.dialogId,
            label: partialCreditMultiFacetedModel.t('title'),
            modalType: "two",
            RCode: `
require(TAM);

if (validateDataPartialCredit(vars =c({{selected.destinationvars | safe}}), data ="{{dataset.name}}"))
{
    {{selected.modelname | safe}} <- tam.mml.mfr( {{dataset.name}}[,c({{selected.destinationvars | safe}})]  ,  facets={{dataset.name}}[,c("{{selected.secondlevel | safe}}"),drop=FALSE] , formulaA = ~ item*step+{{selected.secondlevel | safe}} , pid = {{dataset.name}}\${{selected.firstlevel | safe}},verbose=FALSE)
BSkySummary.tam.mml({{selected.modelname | safe}})
}
`
        };
        var objects = {
            content_var: { el: new srcVariableList(config, { action: "move" }) },
            modelname: {
                el: new input(config, {
                    no: 'modelname',
                    label: partialCreditMultiFacetedModel.t('modelname'),
                    placeholder: "",
                    required: true,
                    type: "character",
                    extraction: "TextAsIs",
                    value: "partialCreditMultiFacetedModel1",
                    overwrite: "dataset"
                })
            },
            destinationvars: {
                el: new dstVariableList(config, {
                    label: partialCreditMultiFacetedModel.t('destinationvars'),
                    no: "destinationvars",
                    required: true,
                    filter: "String|Numeric|Logical|Ordinal|Nominal|Scale",
                    extraction: "NoPrefix|UseComma|Enclosed",
                }), r: ['{{ var | safe}}']
            },
            firstlevel: {
                el: new dstVariable(config, {
                  label: partialCreditMultiFacetedModel.t('firstlevel'),
                  no: "firstlevel",
                  filter: "String|Numeric|Date|Logical|Ordinal|Nominal|Scale",
                  extraction: "NoPrefix|UseComma",
                  required: true,
                }),
              },
              secondlevel: {
                el: new dstVariable(config, {
                  label: partialCreditMultiFacetedModel.t('secondlevel'),
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
                name: partialCreditMultiFacetedModel.t('navigation'),
                icon: "icon-pcmf",
                modal: config.id
            }
        };
        super(config, objects, content);
        
        this.help = {
            title: partialCreditMultiFacetedModel.t('help.title'),
            r_help: "help(data,package='utils')",
            body: partialCreditMultiFacetedModel.t('help.body')
        }
;
    }
}

module.exports = {
    render: () => new partialCreditMultiFacetedModel().render()
}
