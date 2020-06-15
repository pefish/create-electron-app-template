import React from 'react';
import { inject, observer } from 'mobx-react';
import './home.css'
import {
  Menu,
  Icon,
  Button,
  Select,
  Input,
  Modal,
  DatePicker,
  Table,
  Pagination,
} from 'antd';
import HomeStore from '../store/home_store';
import CommonStore from '../store/common_store';
import moment from 'moment'
const Option = Select.Option
const { RangePicker } = DatePicker
@inject('homeStore', 'commonStore')
@observer
export default class Home extends React.Component<{
  homeStore?: HomeStore,
  commonStore?: CommonStore,
  [x: string]: any,
}, any> {

  _renderContent() {
    if (this.props.homeStore!.selectedMenu === `default`) {
      return (
        <div className="home" style={{
          flex: 1,
          display: `flex`,
          flexDirection: `column`,
        }}>
          <span style={{
            color: "black"
          }}>
            {this.props.homeStore!.counter}
          </span>
          <Button type={`primary`} onClick={() => {
            this.props.homeStore!.add()
          }}>加计数</Button>
          <Button type={`primary`} onClick={async () => {
            const [data, err] = await this.props.homeStore!.requestServer()
            if (!err) {
              Modal.info({
                content: JSON.stringify(data),
              })
            }
          }}>IPC请求后端</Button>
          <Button type={`primary`} onClick={async () => {
            const [data, err] = await this.props.homeStore!.netRequestServer()
            if (!err) {
              Modal.info({
                content: JSON.stringify(data),
              })
            }
          }}>网络请求百度</Button>
        </div>
      )
    } else if (this.props.homeStore!.selectedMenu === `default1`) {
      return (
        <div className={'flex1 flex_direction_column display_flex'} style={{
          padding: 10,
          width: 1160,
          height: 760,
        }}>
          <div className={'flex_direction_row display_flex'}>
            <Select
              style={{ width: 120, marginRight: 10, }}
              value={this.props.homeStore!.selectedClass}
              placeholder="类别"
              loading={false}
              onChange={(v) => {
                this.props.homeStore!.selectedClass = v.toString()
              }}
            >
              {["a","b","c"].map((data) => {
                return <Option value={data}>{data}</Option>
              })}
            </Select>
            <Input addonBefore="ID" value={this.props.homeStore!.txid} style={{
              width: 500,
              marginRight: 10,
            }} onChange={(e) => this.props.homeStore!.txid = e.target.value} />
            <Button type="primary" onClick={() => {
              // this.props.homeStore!.doSth()
              Modal.info({
                title: `成功`,
              })
            }} style={{ marginRight: 10 }}>确定</Button>
          </div>
        </div>
      )
    } else if (this.props.homeStore!.selectedMenu === `default2`) {
      return (
        <div className={'flex1 flex_direction_column display_flex'} style={{
          padding: 10,
          width: 1160,
          height: 760,
        }}>
          <div className={'flex_direction_row display_flex'}>
            <Input addonBefore="用户UUID" value={this.props.homeStore!.uuid} style={{
              width: 180,
              marginRight: 10,
            }} onChange={(e) => this.props.homeStore!.uuid = e.target.value} />
            <RangePicker
              value={this.props.homeStore!.time}
              onChange={(v) => {
                this.props.homeStore!.time = [
                  moment(moment(v[0]).utc().format('YYYY-MM-DD')).utc(),
                  moment(moment(v[1]).utc().format('YYYY-MM-DD')).utc()
                ]
              }}
              style={{ marginRight: 10, }}
            />
            <Button type="primary" onClick={() => {
              this.props.homeStore!.loadDatas()
            }} style={{ marginRight: 10 }}>查询</Button>
            <Button onClick={() => {
              // this.props.homeStore!.init()
            }}>清除</Button>
          </div>
          <div style={{
            flex: 1,
            overflow: 'scroll',
            marginTop: 10,
          }}>
            <Table loading={this.props.commonStore!.globalLoading} columns={[
              {
                title: '编号',
                dataIndex: 'id',
                key: 'id',
                // fixed: 'left',
              },
              {
                title: '交易Hash',
                dataIndex: 'tx_id',
                key: 'tx_id',
                render: (text, record) => {
                  return (
                    <div style={{
                      width: 120,
                      overflowWrap: 'break-word'
                    }}><span>{text}</span></div>
                  )
                },
              },
              {
                title: '手续费',
                dataIndex: 'fee',
                key: 'fee',
                render: (text, record) => {
                  return (
                    <div><span>{text && text.removeTrailingZeros_()}</span></div>
                  )
                },
              },
              {
                title: '备注',
                dataIndex: 'mark',
                key: 'mark',
                render: (text, record) => {
                  return (
                    <div style={{
                      width: 120,
                      overflowWrap: 'break-word'
                    }}><span>{text}</span></div>
                  )
                },
              },
              {
                title: '创建时间',
                dataIndex: 'created_at',
                key: 'created_at',
                render: (text, record) => {
                  return (
                    <div style={{
                      width: 100,
                      overflowWrap: 'break-word'
                    }}><span>{moment.utc(text).local().format('YYYY-MM-DD HH:mm:ss')}</span></div>
                  )
                },
              },
              {
                title: '操作',
                key: 'action',
                // fixed: 'right',
                render: (text, record) => {
                  return (
                    <div className={'display_flex flex_direction_column'} style={{
                      width: 70,
                    }}>
                      <a href="javascript:;" style={{ marginBottom: 10, }} onClick={() => {
                        Modal.info({
                          content: "驳回了"
                        })
                      }}>驳回</a>
                      <a href="javascript:;" style={{ marginBottom: 10, }} onClick={() => {
                        Modal.confirm({
                          title: '提示',
                          content: '确认审核通过吗？',
                          okText: '确认',
                          cancelText: '取消',
                          onOk: () => {
                            Modal.info({
                              content: "确认了"
                            })
                          }
                        });
                      }}>普通审核</a>
                    </div>
                  )
                },
              },
            ]} dataSource={this.props.homeStore!.datas} bordered={true} scroll={{
              x: true
            }} pagination={false} />
          </div>
          <Pagination
            style={{
              marginTop: 10,
            }}
            onChange={(page, size) => {
              this.props.homeStore!.page = page
              this.props.homeStore!.size = size as number
              this.props.homeStore!.loadDatas()
            }}
            pageSize={this.props.homeStore!.size}
            current={this.props.homeStore!.page}
            defaultCurrent={1}
            total={this.props.homeStore!.total}
          />
        </div>
      )
      
    } else {
      return <span>nothing</span>
    }
  }

  render() {
    return (
      <div className={`display_flex flex1 flex_direction_row`} style={{
        marginTop: 5,
        borderTopStyle: `solid`,
        borderTopWidth: 1,
        borderTopColor: `#2500001f`,
      }}>
        <div style={{ minWidth: 200, maxWidth: 200, flex: 2 }}>
          <Menu
            defaultSelectedKeys={[this.props.homeStore!.selectedMenu]}
            defaultOpenKeys={['sub1']}
            mode="inline"
            inlineCollapsed={false}
            style={{
              height: `100%`,
            }}
            onSelect={({ key }) => {
              this.props.homeStore!.selectedMenu = key
            }}
          >
            <Menu.Item key="default">
              <Icon type="alipay" />
              <span>Default</span>
            </Menu.Item>
            <Menu.Item key="default1">
              <Icon type="alipay" />
              <span>Default1</span>
            </Menu.Item>
            <Menu.Item key="default2">
              <Icon type="alipay" />
              <span>Default2</span>
            </Menu.Item>
          </Menu>
        </div>
        <div className={`display_flex flex1`}>
          {this._renderContent.bind(this)()}
        </div>
      </div>
    )
  }
}
