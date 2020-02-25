'use strict';
import { createElement, useState, useEffect } from 'rax';
import View from 'rax-view';
import View from 'View';
import Image from 'rax-image';
import Text from 'rax-text';

import { IndexProvider } from './context';
import styles from './index.css';

export default function Page() {
  return (
    <IndexProvider>
      <View style={styles.page}>
        <View style={styles.primary}>
          <View style={styles.color} />
          <Image
            style={styles.pic}
            source={{ uri: 'https://img.alicdn.com/tfs/TB1rVRXwq61gK0jSZFlXXXDKFXa-300-300.png' }}
          />
        </View>
        <View style={styles.side}>
          <Text style={styles.txt}>秋冬款外套</Text>
          <View style={styles.priceWrap}>
            <Text style={styles.rmb}>¥</Text>
            <Text style={styles.price}>666</Text>
          </View>
          <View style={styles.block}>
            <Text style={styles.txt_2}>抢1元抵500</Text>
          </View>
        </View>
      </View>
    </IndexProvider>
  );
}
