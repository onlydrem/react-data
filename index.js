import React, { Component } from "react"
import {
  Row,
  Col,
  Form,
  Button,
  Table,
  Input,
} from "antd"
import { withRouter } from "react-router-dom"
import { PAGE_PAGESIZE } from "@/constant/constant"
import {
  getArrEqual,
} from "@/utils/filter"
const FormItem = Form.Item
const EditableContext = React.createContext()

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
)

const EditableFormRow = Form.create()(EditableRow)

class EditableCell extends React.Component {
  render () {
    const { renderDom, record, ...restProps } = this.props
    return (
      <td ref={node => (this.cell = node)} {...restProps}>
        <EditableContext.Consumer>
          {form => {
            this.form = form
            if (renderDom) {
              return renderDom(form, record)
            }
          }}
        </EditableContext.Consumer>
      </td>
    )
  }
}

@withRouter
class CreateAuthorition extends Component {
  state = {
    newdataSchool: [],
    bookSelected: 0,
    selectedPageNation: {
      pageNum: 1,
      pageSize: 10
    },
    defaultClassTreeIds: [],
    data: [],
    dataSchool: [],
    schoolCurrentData: [],
    columnsSchoolThree: [
      {
        title: "书名",
        dataIndex: "bookName",
        renderDom: (form, record) => {
          return <span>{record.bookName}</span>
        }
      },
      {
        title: "版本",
        dataIndex: "editionName",
        renderDom: (form, record) => {
          return <span>{record.editionName}</span>
        }
      },
      {
        title: "学科",
        dataIndex: "subjectName",
        renderDom: (form, record) => {
          return <span>{record.subjectName}</span>
        }
      },
      {
        title: "册次",
        dataIndex: "volumeName",
        renderDom: (form, record) => {
          return <span>{record.volumeName}</span>
        }
      },
      {
        title: "数量",
        dataIndex: "classList",
        key: "classList",
        renderDom: (form, record) => {
          return (
            <FormItem style={{ margin: 0 }}>
              {form.getFieldDecorator("total", {
                rules: [
                  {
                    required: true,
                    message: "数量不能为空"
                  }
                ],
                initialValue: record.classList
              })(
                <Input
                // onPressEnter={e => this.addSubmit(form, record)}
                // onBlur={e => this.addSubmit(form, record)}
                />
              )}
            </FormItem>
          )
        }
      }
    ],
    columnsSchoolForSchoolThree: [
      {
        title: "省",
        dataIndex: "provinceName",
        key: "cantonCode",
        renderDom: (form, record) => {
          return <span>{record.provinceName}</span>
        }
      },
      {
        title: "市",
        dataIndex: "cityName",
        key: "cityName",
        renderDom: (form, record) => {
          return <span>{record.cityName}</span>
        }
      },
      {
        title: "县区",
        dataIndex: "countyName",
        key: "county",
        renderDom: (form, record) => {
          return <span>{record.countyName}</span>
        }
      },
      {
        title: "学校名称",
        dataIndex: "schoolTypeName",
        key: "schoolTypeName",
        renderDom: (form, record) => {
          return <span>{record.schoolTypeName}</span>
        }
      },
      {
        title: "数量",
        dataIndex: "classList",
        key: "classList",
        renderDom: (form, record) => {
          return (
            <FormItem style={{ margin: 0 }}>
              {form.getFieldDecorator("total", {
                rules: [
                  {
                    required: true,
                    message: "数量不能为空"
                  }
                ],
                initialValue: record.classList
              })(
                <Input
                // onPressEnter={e => this.addSubmit(form, record)}
                // onBlur={e => this.addSubmit(form, record)}
                />
              )}
            </FormItem>
          )
        }
      }
    ]
  }
  componentDidMount () {

  }
  componentWillUnmount () {
    // 卸载异步操作设置状态
    this.setState = (state, callback) => {
      return
    }
  }
  onSelectedschoolStepRowKeysChange = selectedRowKeys => { // 根据复选框所选Id筛选出数据里面的对象
    const filter = getArrEqual(this.state.schoolOneStepData, selectedRowKeys)
    const unitData = "unitData"
    if (!filter.hasOwnProperty("unitData")) {
      filter.map(item => (item[unitData] = ""))
    }
    this.setState(
      {
        schoolOneSelectedRowKeys: filter,
        dataSchool: filter,
        schoolCurrentData: filter,
        schoolkSelected: filter.length
      },
      () => {
        const classList = "classList"
        if (!this.state.bookTwoOneSelectedRowKeys.hasOwnProperty("classList")) {
          this.state.bookTwoOneSelectedRowKeys.map(
            item => (item[classList] = "")
          )
        }
        const selectedSchoolIdList = this.state.dataSchool.map(item => {
          return item.id // 获取学校id数组
        })
        this.setState({
          schoolList: selectedSchoolIdList
        })
      }
    )
  }

  volumeStudentCount = () => {  // 根据外层表格收集嵌套表格数据
    let arr = []
      this.state.bookClassList.map((book, i) => {
        this.setState(
          {
            ["a" + i]: this.state.dataSchool.map((count, j) => {
              return {
                ...count,
                unitData: (() => {
                  let str = ""
                  this.state.bookClassList[i].listInfo.map(item => {
                    if (item.unitId === count.id) {
                      str = item.totalCount
                    }
                  })
                  return str
                })()
              }
            })
          },
      
        )
      })
     
  }
  // 静态数据分页
  schoolChangePageSizeSelected = async (current, pageSize) => {
    const data = this.state.schoolCurrentData
    await this.setState({
      selectedPageNation: {
        pageSize: pageSize,
        pageNum: current
      },
      dataSchool: data.slice(
        (current - 1) * this.state.selectedPageNation.pageSize,
        current * this.state.selectedPageNation.pageSize
      )
    })
  }
  schoolChangeNumSelected = async (current, pageSize) => {
    const data = this.state.schoolCurrentData
    await this.setState(
      {
        selectedPageNation: {
          pageSize: pageSize,
          pageNum: current
        },
        data: data.slice(
          (current - 1) * this.state.selectedPageNation.pageSize,
          current * this.state.selectedPageNation.pageSize
        )
      },
      () => {
        this.setState({
          dataSchool: data
        })
      }
    )
  }


  // 嵌套表格
  expandedRowRenderSchool = (record, index) => {
    const schoolThreeStepColumns = [
      {
        title: "书名",
        dataIndex: "bookName",
        renderDom: (form, record) => {
          return <span>{record.bookName}</span>
        }
      },
      {
        title: "版本",
        dataIndex: "editionName",
        renderDom: (form, record) => {
          return <span>{record.editionName}</span>
        }
      },
      {
        title: "学科",
        dataIndex: "subjectName",
        renderDom: (form, record) => {
          return <span>{record.subjectName}</span>
        }
      },
      {
        title: "册次",
        dataIndex: "volumeName",
        renderDom: (form, record) => {
          return <span>{record.volumeName}</span>
        }
      },
      {
        title: "适用年级",
        dataIndex: "className",
        renderDom: (form, record) => {
          return <span>{record.className}</span>
        }
      },
      {
        title: "设定数量",
        dataIndex: "unitData",
        key: index,
        renderDom: (form, record) => {
          return (
            <FormItem style={{ margin: 0 }}>
              {form.getFieldDecorator("count", {
                rules: [
                  {
                    required: true,
                    message: "数量不能为空"
                  }
                ],
                initialValue: record.unitData
              })(<Input />)}
            </FormItem>
          )
        }
      }
    ]
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell
      }
    }
    const columns = schoolThreeStepColumns.map((col, index) => {
      return {
        ...col,
        onCell: record => ({
          ...col,
          record
        })
      }
    })

    return (
      <div>
        <Table
          components={components}
          bordered
          rowKey={record => record.id}
          columns={columns}
          expandRowByClick={true}
          dataSource={
            this.state["a" + index]
              ? this.state["a" + index]
              : this.state.userData
          }
          pagination={false}
          rowClassName="editable-row"
        />
      </div>
    )
  }
  render () {
    let {
      totalselected,
      schoolOneSelectedRowKeys,
      selectedPageNation,
      columnsSchoolThree,
      columnsSchoolForSchoolThree,
    } = this.state

    const componentsWarp = {
      body: {
        row: EditableFormRoWarp,
        cell: EditableCellWarp
      }
    }
    const columnsWarp = columnsSchoolThree.map((col, index) => {
      return {
        ...col,
        onCell: record => ({
          ...col,
          record
        })
      }
    })

    const columnsWarpSchool = columnsSchoolForSchoolThree.map((col, index) => {
      return {
        ...col,
        onCell: record => ({
          ...col,
          record
        })
      }
    })

    return (
      <div>
          <div>
            <Row>
              <Col span={14}>
                <Row
                  gutter={12}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    paddingBottom: 12
                  }}
                >
                  <Col span={8}>
                    <Button
                      style={{
                        textAlign: "center",
                        marginRight: 15
                      }}
                      type="primary"
                      onClick={this.volumeClassCount}
                    >
                      填充总数
                      
                    </Button>
                  </Col>
                  
                  <Col span={5} style={{ marginRight: 15 }}>
                    <Input
                      placeholder="按数量填充"
                      onChange={e => this.getCount(e)}
                    ></Input>
                  </Col>
                  <Col span={3}>
                    <Button type="primary" onClick={this.batchFilling}>
                      批量填充
                    </Button>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Table
              components={componentsWarp}
              columns={columnsWarpSchool}
              expandRowByClick={true}
              rowKey={record => record.id}
              expandedRowRender={this.expandedRowRenderSchool}
              dataSource={schoolOneSelectedRowKeys}
              pagination={{
                defaultPageSize: 10,
                total: totalselected,
                showTotal: e => {
                  return "共 " + e + " 条"
                },
                pageSize: selectedPageNation.pageSize,
                current: selectedPageNation.pageNum,
                showSizeChanger: true,
                onShowSizeChange: this.schoolChangePageSizeSelected,
                onChange: this.schoolChangeNumSelected,
                pageSizeOptions: PAGE_PAGESIZE
              }}
            >
            </Table>
          </div>
        </div>
    )
  }
}


