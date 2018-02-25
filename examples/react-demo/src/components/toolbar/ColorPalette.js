import React, { Component } from 'react';
import styles from './ColorPalette.css'

export default class ColorPalette extends Component {
  constructor(props) {
    super(props)
    //
    this.coolColors = [{
      value: "rgb(0, 0, 0)",
      label: "黑色"
    }, {
      value: "rgb(67, 67, 67)",
      label: "深灰色 4"
    }, {
      value: "rgb(102, 102, 102)",
      label: "深灰色 3"
    }, {
      value: "rgb(153, 153, 153)",
      label: "深灰色 2"
    }, {
      value: "rgb(183, 183, 183)",
      label: "深灰色 1"
    }, {
      value: "rgb(204, 204, 204)",
      label: "灰色"
    }, {
      value: "rgb(217, 217, 217)",
      label: "灰色 1"
    }, {
      value: "rgb(239, 239, 239)",
      label: "灰色 2"
    }, {
      value: "rgb(243, 243, 243)",
      label: "灰色 3"
    }, {
      value: "rgb(255, 255, 255)",
      label: "白色"
    }]
    this.brightColors = [{
      value: "rgb(152, 0, 0)",
      label: "浆果红"
    }, {
      value: "rgb(255, 0, 0)",
      label: "红色"
    }, {
      value: "rgb(255, 153, 0)",
      label: "橙色"
    }, {
      value: "rgb(255, 255, 0)",
      label: "黄色"
    }, {
      value: "rgb(0, 255, 0)",
      label: "绿色"
    }, {
      value: "rgb(0, 255, 255)",
      label: "青色"
    }, {
      value: "rgb(74, 134, 232)",
      label: "矢车菊蓝"
    }, {
      value: "rgb(0, 0, 255)",
      label: "蓝色"
    }, {
      value: "rgb(153, 0, 255)",
      label: "紫色"
    }, {
      value: "rgb(255, 0, 255)",
      label: "洋红色"
    }]
    this.detailedColors = [
      [{
        "value":"rgb(230, 184, 175)","label":"浅浆果红色 3"
      },{
        "value":"rgb(244, 204, 204)","label":"浅红色 3"
      },{
        "value":"rgb(252, 229, 205)","label":"浅橙色 3"
      },{
        "value":"rgb(255, 242, 204)","label":"浅黄色 3"
      },{
        "value":"rgb(217, 234, 211)","label":"浅绿色 3"
      },{
        "value":"rgb(208, 224, 227)","label":"浅青色 3"
      },{
        "value":"rgb(201, 218, 248)","label":"浅矢车菊蓝色 3"
      },{
        "value":"rgb(207, 226, 243)","label":"浅蓝色 3"
      },{
        "value":"rgb(217, 210, 233)","label":"浅紫色 3"
      },{
          "value":"rgb(234, 209, 220)","label":"浅洋红色 3"
      }],
      [{
        "value":"rgb(221, 126, 107)","label":"浅浆果红色 2"
      },{
        "value":"rgb(234, 153, 153)","label":"浅红色 2"
      },{
        "value":"rgb(249, 203, 156)","label":"浅橙色 2"
      },{
        "value":"rgb(255, 229, 153)","label":"浅黄色 2"
      },{
        "value":"rgb(182, 215, 168)","label":"浅绿色 2"
      },{
        "value":"rgb(162, 196, 201)","label":"浅青色 2"
      },{
        "value":"rgb(164, 194, 244)","label":"浅矢车菊蓝色 2"
      },{
        "value":"rgb(159, 197, 232)","label":"浅蓝色 2"
      },{
        "value":"rgb(180, 167, 214)","label":"浅紫色 2"
      },{
        "value":"rgb(213, 166, 189)","label":"浅洋红色 2"
      }],
      [{
        "value":"rgb(204, 65, 37)","label":"浅浆果红色 1"
      },{
        "value":"rgb(224, 102, 102)","label":"浅红色 1"
      },{
        "value":"rgb(246, 178, 107)","label":"浅橙色 1"
      },{
        "value":"rgb(255, 217, 102)","label":"浅黄色 1"
      },{
        "value":"rgb(147, 196, 125)","label":"浅绿色 1"
      },{
        "value":"rgb(118, 165, 175)","label":"浅青色 1"
      },{
        "value":"rgb(109, 158, 235)","label":"浅矢车菊蓝色 1"
      },{
        "value":"rgb(111, 168, 220)","label":"浅蓝色 1"
      },{
        "value":"rgb(142, 124, 195)","label":"浅紫色 1"
      },{
        "value":"rgb(194, 123, 160)","label":"浅洋红色 1"
      }],
      [{
        "value":"rgb(166, 28, 0)","label":"深浆果红色 1"
      },{
        "value":"rgb(204, 0, 0)","label":"深红色 1"
      },{
        "value":"rgb(230, 145, 56)","label":"深橙色 1"
      },{
        "value":"rgb(241, 194, 50)","label":"深黄色 1"
      },{
        "value":"rgb(106, 168, 79)","label":"深绿色 1"
      },{
        "value":"rgb(69, 129, 142)","label":"深青色 1"
      },{
        "value":"rgb(60, 120, 216)","label":"深矢车菊蓝色 1"
      },{
        "value":"rgb(61, 133, 198)","label":"深蓝色 1"
      },{
        "value":"rgb(103, 78, 167)","label":"深紫色 1"
      },{
        "value":"rgb(166, 77, 121)","label":"深洋红色 1"
      }],
      [{
        "value":"rgb(133, 32, 12)","label":"深浆果红色 2"
      },{
        "value":"rgb(153, 0, 0)","label":"深红色 2"
      },{
        "value":"rgb(180, 95, 6)","label":"深橙色 2"
      },{
        "value":"rgb(191, 144, 0)","label":"深黄色 2"
      },{
        "value":"rgb(56, 118, 29)","label":"深绿色 2"
      },{
        "value":"rgb(19, 79, 92)","label":"深青色 2"
      },{
        "value":"rgb(17, 85, 204)","label":"深矢车菊蓝色 2"
      },{
        "value":"rgb(11, 83, 148)","label":"深蓝色 2"
      },{
        "value":"rgb(53, 28, 117)","label":"深紫色 2"
      },{
        "value":"rgb(116, 27, 71)","label":"深洋红色 2"
      }],
      [{
        "value":"rgb(91, 15, 0)","label":"深浆果红色 3"
      },{
        "value":"rgb(102, 0, 0)","label":"深红色 3"
      },{
        "value":"rgb(120, 63, 4)","label":"深橙色 3"
      },{
        "value":"rgb(127, 96, 0)","label":"深黄色 3"
      },{
        "value":"rgb(39, 78, 19)","label":"深绿色 3"
      },{
        "value":"rgb(12, 52, 61)","label":"深青色 3"
      },{
        "value":"rgb(28, 69, 135)","label":"深矢车菊蓝色 3"
      },{
        "value":"rgb(7, 55, 99)","label":"深蓝色 3"
      },{
        "value":"rgb(32, 18, 77)","label":"深紫色 3"
      },{
        "value":"rgb(76, 17, 48)","label":"深洋红色 3"
      }]
    ]
  }

  _renderColorCells(colorItems) {
    return colorItems.map(item => {
      return (
        <td
          key={item.value}
          value={item.value}
          className={styles.colorCell}
          data-selected={item.value === this.props.selected}>
          <div
            className={styles.colorBlock}
            title={item.label}
            style={{backgroundColor: item.value}}></div>
        </td>
      )
    })
  }
  _renderColorSets(colorSet) {
    return colorSet.map((set, index) => {
      return (
        <tr key={index}>{this._renderColorCells(set)}</tr>
      )
    })
  }

  _onClick(evt) {
    let _target = evt.target
    let _value = _target.getAttribute('value') || _target.parentNode.getAttribute('value')

    this.props.onExecCommand(this.props.type, _value)
    this.props.onAfterExecCmd(this.props.type)
  }

  render() {
    let _style = (this.props.isOpen && this.props.position) ? {
      display: "block",
      left: `${this.props.position.left}px`,
      top: `${this.props.position.top}px`
    } : { display: "none" }

    return (
      <div
        ref={el => this.paletteWrapper = el}
        style={_style}
        className={styles.colorPalette}
        onClick={e => this._onClick(e)}>
        <table>
          <tbody>
            <tr>{this._renderColorCells(this.coolColors)}</tr>
          </tbody>
        </table>

        <table>
          <tbody>
            <tr>{this._renderColorCells(this.brightColors)}</tr>
          </tbody>
        </table>

        <table>
          <tbody>{this._renderColorSets(this.detailedColors)}</tbody>
        </table>
      </div>
    );
  }
}
