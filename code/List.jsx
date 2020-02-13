'use strict';
import { createElement, useState, useEffect, memo } from 'rax';
import jsonp from 'fetch-jsonp';
import View from 'rax-view';
import Image from 'rax-image';
import Text from 'rax-text';

import styles from './List.css';

export default memo(props => {
  const [state, setState] = useState({ count: '21万观看', title: '跟着我走', favo: '13万' });

  // constructor
  useState(() => {
    fetchJsonp();

    console.log('123718723');
    var a = 1;
  });

  // componentDidMount
  useEffect(() => {
    console.log(state.count);
    console.log('didMount');
  }, []);

  function fetchJsonp() {
    jsonp('http://ide.def.alibaba-inc.com/ide?id=4367&repo=page-project/rax-app-1', { body: { name: '111' } })
      .then(response => response.json())
      .then((data, error) => {
        return data;
      })
      .catch(e => {
        console.log('error', e);
      });
  }
  return (
    <View style={styles.block_3}>
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
          {1 == 1 && <Text style={styles.wanguankan}>{state.count}</Text>}
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
              <Text style={styles.wan}>{state.favo}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
});
