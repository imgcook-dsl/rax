'use strict';
import { createElement, useState, useEffect, memo } from 'rax';
import jsonp from 'fetch-jsonp';
import View from 'rax-view';
import Image from 'rax-image';
import Text from 'rax-text';

import styles from './List.css';

export default memo(props => {
  const [state, setState] = useState({ count: '2.1万观看', title: '跟着我走', favo: '1.3万' });

  // constructor
  useState(() => {
    fetchList();
    dataHandler();
  });

  // componentDidMount
  useEffect(() => {
    console.log('didMount');
  }, []);

  function fetchYouName() {
    const a = '1';
    return a + 10;
  }
  function fetchList() {
    return jsonp('https://www.imgcook.com/editor#/?id=22228', { token: '123123', body: { id: 1 } })
      .then(response => response.json())
      .then((data, error) => {
        data.msg = '123123';
        return data;
      })
      .catch(e => {
        console.log('error', e);
      });
  }
  const dataHandler = dataMap => {
    dataMap.id = '1111111';
    return dataMap;
  };
  return (
    <View style={styles.block_311}>
      <View style={styles.box}>
        <Image
          style={styles.layer}
          source={{ uri: 'https://img.alicdn.com/tfs/TB1GDkvvEY1gK0jSZFMXXaWcVXa-696-1032.png' }}
        />
        <View style={styles.hd}>
          <View style={styles.container}>
            <View style={styles.color} />
            <Text style={styles.liveBroadcast}>直播中</Text>
          </View>
          {1 == 1 && <Text style={styles.wanguankan}>1.3万观看</Text>}
        </View>
        <View style={styles.bd}>
          <Text style={styles.title}>{state.title}</Text>
          <View style={styles.block_2}>
            <View style={styles.outer}>
              <Image
                style={styles.caipiao}
                source={{ uri: 'https://img.alicdn.com/tfs/TB1f6ozvxD1gK0jSZFyXXciOVXa-96-96.png' }}
              />
              <Text style={styles.info}>翡翠定制专家</Text>
            </View>
            <View style={styles.block}>
              <View style={styles.iconcollectionwhitWrap}>
                <Image
                  style={styles.iconcollectionwhit}
                  source={{ uri: 'https://img.alicdn.com/tfs/TB1EgB1u1bviK0jSZFNXXaApXXa-32-26.png' }}
                />
              </View>
              <Text style={styles.wan}>1.2万</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
});
