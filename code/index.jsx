'use strict';
import { createElement, useState, useEffect } from 'rax';
import View from 'rax-view';
import View from 'View';
import PuiTab from 'PuiTab';
import PuiCategorySelect from '@ali/puicom-rax-category-select';
import Image from 'rax-image';
import ScrollView from 'ScrollView';
import Text from 'rax-text';

import { IndexProvider } from './context';
import styles from './index.css';

export default function Page() {
  return (
    <IndexProvider>
      <View>
        <View>
          <PuiTab
            data={['Tab1', 'Tab2', 'Tab3', 'Tab4', 'Tab5', 'Tab6', 'Tab7', 'Tab8']}
            isScroll={undefined}
            width={undefined}
            itemWidth={undefined}
            defaultSelected={undefined}
            styles={{ container: { border: '1px solid #f8e71c' } }}
          />
        </View>
        <PuiCategorySelect
          theme={'zc'}
          filterKey={'cateId11'}
          defaultValue={'0'}
          panelAttributes={{ shouldInitialRender: true }}
          dataSource={[
            { value: '1', name: '全部1', count: 10, _key: 1 },
            { value: '2', name: '全部2', count: 10, _key: 2 },
            { value: '3', name: '全部3', count: 10, _key: 3 },
            { value: '4', name: '全部4', count: 10, _key: 4 },
            { value: '5', name: '全部5', count: 10, _key: 5 }
          ]}
          filterValue={'4'}
        />
        <Image
          source={{ uri: 'https://img.alicdn.com/tfs/TB16LH0dAT2gK0jSZPcXXcKkpXa-1252-942.png' }}
          resizeMode={'contain'}
          quality={'high'}
        />
        <ScrollView>
          <View>
            <Text numberOfLines={'1'}></Text>
          </View>
          <View />
          <View />
        </ScrollView>
      </View>
    </IndexProvider>
  );
}
