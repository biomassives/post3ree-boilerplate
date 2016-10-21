import React, { Component } from 'react'

import s from './checkbox.pcss'

export default class Checkbox extends Component {
    render() {
        const { text, ...rest } = this.props;
        return (
            <label className={s.checkboxWrapper}>
                <input className={s.checkbox} type="checkbox" { ...rest }/>
                { text }
            </label>
        )
    }
}