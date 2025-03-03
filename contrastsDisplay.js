/**
  * This file is protected by copyright (c) 2023-2025 by BlueSky Statistics, LLC.
  * All rights reserved. The copy, modification, or distribution of this file is not
  * allowed without the prior written permission from BlueSky Statistics, LLC.
 */




class contrastsDisplay extends baseModal {
    static dialogId = 'contrastsDisplay'
    static t = baseModal.makeT(contrastsDisplay.dialogId)

    constructor() {
        var config = {
            id: contrastsDisplay.dialogId,
            label: contrastsDisplay.t('title'),
            modalType: "two",
            RCode: `
#Display contrasts
BSkyFormat( contrasts({{dataset.name}}\${{selected.target | safe}}) ,singleTableOutputHeader=paste("Contrasts for","{{selected.target | safe}}" ))
            `
        }
        var objects = {
            content_var: { el: new srcVariableList(config) },
            target: {
                el: new dstVariable(config, {
                    label: contrastsDisplay.t('target'),
                    no: "target",
                    filter: "Numeric|Logical|Ordinal|Nominal",
                    extraction: "NoPrefix|UseComma",
                    required: true
                }), r: ['{{ var | safe}}']
            },
        }
        const content = {
            left: [objects.content_var.el.content],
            right: [objects.target.el.content],
            nav: {
                name: contrastsDisplay.t('navigation'),
                icon: "icon-eye",
                modal: config.id
            }
        }
        super(config, objects, content);
        
        this.help = {
            title: contrastsDisplay.t('help.title'),
            r_help: contrastsDisplay.t('help.r_help'),  //r_help: "help(data,package='utils')",
            body: contrastsDisplay.t('help.body')
        }
;
    }
}

module.exports = {
    render: () => new contrastsDisplay().render()
}
