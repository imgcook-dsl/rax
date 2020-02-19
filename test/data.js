module.exports = {
  componentName: 'Page',
  fileName: 'index',
  id: 'Shape_0',
  props: {
    style: {
      border: 'none'
    }
  },
  className: 'box',
  children: [
    {
      componentName: 'View',
      id: 'Shape_1',
      props: {},
      children: [
        {
          componentName: 'PuiTab',
          props: {
            data: ['Tab1', 'Tab2', 'Tab3', 'Tab4', 'Tab5', 'Tab6', 'Tab7', 'Tab8'],
            isScroll: true,
            width: 600,
            itemWidth: 100,
            defaultSelected: true,
            styles: {
              container: {
                border: '1px solid #f8e71c'
              }
            }
          }
        }
      ]
    },
    {
      componentName: 'PuiCategorySelect',
      smart: {
        layerProtocol: {
          component: {
            params: {
              width: '',
              height: '',
              autoPlay: false,
              showsPagination: true,
              paginationStyle: '',
              loop: true,
              index: 0,
              autoPlayInterval: 3000,
              onChange: function() {},
              direaction: 'horizontal'
            },
            package: '@ali/puicom-rax-category-select'
          }
        }
      },
      props: {
        theme: 'zc',
        filterKey: 'cateId11',
        defaultValue: '0',
        panelAttributes: {
          shouldInitialRender: true
        },
        dataSource: [
          {
            value: '1',
            name: '全部1',
            count: 10,
            _key: 1
          },
          {
            value: '2',
            name: '全部2',
            count: 10,
            _key: 2
          },
          {
            value: '3',
            name: '全部3',
            count: 10,
            _key: 3
          },
          {
            value: '4',
            name: '全部4',
            count: 10,
            _key: 4
          },
          {
            value: '5',
            name: '全部5',
            count: 10,
            _key: 5
          }
        ],
        filterValue: '4'
      }
    },
    {
      componentName: 'Image',
      props: {
        source: {
          uri: 'https://img.alicdn.com/tfs/TB16LH0dAT2gK0jSZPcXXcKkpXa-1252-942.png'
        },
        resizeMode: 'contain',
        quality: 'high',
        style: {
          width: 200,
          height: 200
        }
      }
    },
    {
      componentName: 'ScrollView',
      props: {
        style: {
          width: 500,
          height: 500
        }
      },
      children: [
        {
          componentName: 'Div',
          props: {
            style: {
              width: 200,
              height: 200,
              backgroundColor: '#4a90e2'
            }
          },
          children: [
            {
              componentName: 'Text',
              props: {
                numberOfLines: '1'
              }
            }
          ]
        },
        {
          componentName: 'Div',
          props: {
            style: {
              width: 200,
              height: 200
            }
          }
        },
        {
          componentName: 'Div',
          props: {
            style: {
              width: 300,
              height: 1000,
              backgroundColor: '#b8e986'
            }
          }
        }
      ]
    }
  ]
};
