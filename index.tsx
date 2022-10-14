import React, { Component, createRef } from 'react';
import BScroll from '@better-scroll/core';
import PullDown from '@better-scroll/pull-down';

BScroll.use(PullDown); // 注册下拉刷新插件

interface IProps {
  children: any;
  scrollEnd: Function;
  pullingDown: Function;
  isOpenPullingDown?: boolean;
  [key: string]: any;
}

const PULL_STATUS_MAP: Record<string, string> = {
  pull: '下拉刷新',
  pulling: '正在刷新',
  success: '刷新成功'
};

export default class ScrollContainer extends Component<IProps> {
  state: Record<string, any> = {
    pullStatus: 'pull'
  }

  scroll: BScroll = null;
  scrollWrapperRef: React.RefObject = createRef();

  componentDidMount() {
    this.initScroll();
  }

  /**
   * 初始化滚动
   */
  initScroll = () => {
    const wraperDOM = this?.scrollWrapperRef?.current;
  
    // 下拉刷新
    const pullDownRefresh = {
      threshold: 50, // 顶部下拉刷新距离。
      stop: 40, // 下拉回弹距离
    };
    const bsConfig: any = {
      click: true,
      scrollY: true,
      scrollX: false,
      pullDownRefresh,
      swipeTime: 1000
    };
    this.scroll = new BScroll(wraperDOM, bsConfig);
    this.scroll.on('pullingDown', this.pullingDown);
    this.scroll.on('scrollEnd', this.scrollEnd);
  }

  /**
   * 下拉刷新
   */
  pullingDown = () => {
    this.updatePullStatus('pulling');
    const { pullingDown } = this.props;
    pullingDown && pullingDown(this.completePullDown);
  }

  /**
   * 完成下拉刷新
   */
  completePullDown = (pullStatus: string) => {
    this.scroll.finishPullDown();
    this.updatePullStatus(pullStatus);
    this.scroll.refresh();
    setTimeout(() => this.updatePullStatus('complete'), 500);
  }

  updatePullStatus = (pullStatus: string) => {
    this.setState({ pullStatus });
  }

  /**
   * 滚动到底部
   */
  scrollEnd = (data: { x: number, y: number }) => {
    const { scrollEnd } = this.props;
    scrollEnd && scrollEnd(data);
  }

  render() {
    const { children, isOpenPullingDown } = this.props; // children需要滚动的元素
    const { pullStatus } = this.state;
    return (<div className="scroll-container" ref={this.scrollWrapperRef}>
      <div className="scroll-container-wrapper">
        {
          isOpenPullingDown &&
          <div className="pulldown-status-wrapper">
            { PULL_STATUS_MAP[pullStatus] }
          </div>
        }
        {children}
      </div>
    </div>);
  }
}
