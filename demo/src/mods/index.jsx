'use strict';
import { createElement, useState, useEffect, memo } from 'rax';
import View from 'rax-view';
import Picture from 'rax-picture';
import Text from 'rax-text';

import './index.module.css';

export default memo(props => {
  const [state, setState] = useState({ items: [{ itemTitle: '111111.8', itemPrice: '80.8' }] });

  return (
    <View className="mod">
      {state.items.map((item, index) => {
        return (
          <View key={index} className="row-i0" data-track-type={'ALL'}>
            <View className="item-wrapper">
              <Picture
                className="item"
                source={{
                  uri: 'https://img.alicdn.com/imgextra/i1/O1CN019xxCyz1U6OCPl00vy_!!6000000002468-2-tps-508-484.png'
                }}
                autoScaling={false}
                autoWebp={false}
              />
            </View>
            <View className="wrapper">
              <Text className="title" lines={1}>
                {item.itemTitle}
              </Text>
              <View className="button-wrapper">
                <Text className="button" lines={1}>
                  黄油夹心 营养早餐
                </Text>
              </View>
              <Text className="tag" lines={1}>
                爆卖21323件
              </Text>
              <View className="wrapper-inner">
                <View className="price-wrapper">
                  <Text className="label" lines={1}>
                    红包抵后
                  </Text>
                  <Text className="yuan" lines={1}>
                    ￥
                  </Text>
                  <Text className="price" lines={1}>
                    {item.itemPrice}
                  </Text>
                </View>
                <View className="group">
                  <Text className="money-info" lines={1}>
                    原价￥
                  </Text>
                  <Text className="money" lines={1}>
                    10.9
                  </Text>
                </View>
              </View>
            </View>
            <View className="wrapper-1">
              <Picture
                className="shop-logo"
                source={{
                  uri: 'https://img.alicdn.com/imgextra/i1/O1CN01Fw0aHK1N8x6mYKY5x_!!6000000001526-2-tps-310-156.png'
                }}
                autoScaling={false}
                autoWebp={false}
              />
              <Text className="caption" lines={1}>
                马上抢
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
});
