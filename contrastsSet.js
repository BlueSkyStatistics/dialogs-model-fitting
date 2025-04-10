/**
  * This file is protected by copyright (c) 2023-2025 by BlueSky Statistics, LLC.
  * All rights reserved. The copy, modification, or distribution of this file is not
  * allowed without the prior written permission from BlueSky Statistics, LLC.
 */




class contrastsSet extends baseModal {
    static dialogId = 'contrastsSet'
    static t = baseModal.makeT(contrastsSet.dialogId)

    constructor() {
        var config = {
            id: contrastsSet.dialogId,
            label: contrastsSet.t('title'),
            modalType: "two",
            RCode: `
#Set contrasts
contrasts({{dataset.name}}\${{selected.target | safe}}) = {{selected.Contrast | safe}}(nlevels({{dataset.name}}\${{selected.target | safe}}))
#Display contrasts
BSkyFormat( contrasts({{dataset.name}}\${{selected.target | safe}}) ,singleTableOutputHeader=paste("Contrasts for","{{selected.target | safe}}" ))
            `
        }
        var objects = {
            content_var: { el: new srcVariableList(config) },
            target: {
                el: new dstVariable(config, {
                    label: contrastsSet.t('target'),
                    no: "target",
                    filter: "Numeric|Logical|Ordinal|Nominal",
                    extraction: "NoPrefix|UseComma",
                    required: true
                }), r: ['{{ var | safe}}']
            },
            label1: { el: new labelVar(config, { label: contrastsSet.t('label1'),  style: "mt-3", h: 6 }) },
            Dummy: {
                el: new radioButton(config, {
                    label: contrastsSet.t('Dummy'),
                    no: "Contrast",
                    increment: "Dummy",
                    value: "contr.treatment",
                    state: "checked",
                    extraction: "ValueAsIs"
                })
            },
            Deviation: {
                el: new radioButton(config, {
                    label: contrastsSet.t('Deviation'),
                    no: "Contrast",
                    increment: "Deviation",
                    value: "contr.sum",
                    state: "",
                    extraction: "ValueAsIs"
                })
            },
            Helmert: {
                el: new radioButton(config, {
                    label: contrastsSet.t('Helmert'),
                    no: "Contrast",
                    increment: "Helmert",
                    value: "contr.helmert",
                    state: "",
                    extraction: "ValueAsIs"
                })
            },
            Poly: {
                el: new radioButton(config, {
                    label: contrastsSet.t('Poly'),
                    no: "Contrast",
                    increment: "Poly",
                    value: "contr.poly",
                    state: "",
                    extraction: "ValueAsIs"
                })
            },
        }
        const content = {
            left: [objects.content_var.el.content],
            right: [objects.target.el.content, objects.label1.el.content, objects.Dummy.el.content, objects.Deviation.el.content, objects.Helmert.el.content, objects.Poly.el.content],
            nav: {
                name: contrastsSet.t('navigation'),
                icon: "icon-gears",
                modal: config.id
            }
        }
        super(config, objects, content);
        
        this.help = {
            title: contrastsSet.t('help.title'),
            r_help: contrastsSet.t('help.r_help'),  //r_help: "help(data,package='utils')",
            body: contrastsSet.t('help.body')
        }
;
    }
}

module.exports = {
    render: () => new contrastsSet().render()
}
