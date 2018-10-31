const icon = {
  move: ['top', 'bottom', 'left', 'right', 'bank', 'phenix', 'bankOut', 'door'],
  type: ['move', 'gather', 'fight', 'gatherfight', 'bank', 'phenix'],
  size: {
    amakna: {
      move: {
        top: {
          width: 17.22,
          height: 25,
          marginLeft: 17.22 / 2,
          topMargin: 25,
        },
        bottom: {
          width: 17.22,
          height: 25,
          marginLeft: 17.22 / 2,
          topMargin: 0,
        },
        left: {
          width: 32.04,
          height: 17.22,
          marginLeft: 34.75,
          topMargin: 17.22 / 2,
        },
        right: {
          width: 32.04,
          height: 17.22,
          marginLeft: 32.04 - 34.75,
          topMargin: 17.22 / 2,
        },
        door: {
          width: 32.04,
          height: 32.04,
          marginLeft: 16.02,
          topMargin: 16.02,
        },
        zindex: 9999,
      },
      bank: {
        top: {
          width: 17.22,
          height: 25,
          marginLeft: -2.5,
          topMargin: 25,
        },
        bottom: {
          width: 17.22,
          height: 25,
          marginLeft: -2.5,
          topMargin: 0,
        },
        left: {
          width: 32.04,
          height: 17.22,
          marginLeft: 34.75,
          topMargin: -2.5,
        },
        right: {
          width: 32.04,
          height: 17.22,
          marginLeft: 32.04 - 34.75,
          topMargin: -2.5,
        },
        zindex: 9998,
      },
      phenix: {
        top: {
          width: 17.22,
          height: 25,
          marginLeft: 20,
          topMargin: 25,
        },
        bottom: {
          width: 17.22,
          height: 25,
          marginLeft: 20,
          topMargin: 0,
        },
        left: {
          width: 32.04,
          height: 17.22,
          marginLeft: 34.75,
          topMargin: 20,
        },
        right: {
          width: 32.04,
          height: 17.22,
          marginLeft: 32.04 - 34.75,
          topMargin: 20,
        },
        zindex: 9997,
      },
    },
    incarnam: {
      move: {
        top: {
          width: 52.69,
          height: 76.62,
          marginLeft: 52.69 / 2,
          topMargin: 76.62,
        },
        bottom: {
          width: 52.69,
          height: 76.62,
          marginLeft: 52.69 / 2,
          topMargin: 0,
        },
        left: {
          width: 98.19,
          height: 52.69,
          marginLeft: 106.5,
          topMargin: 52.69 / 2,
        },
        right: {
          width: 98.19,
          height: 52.69,
          marginLeft: 98.19 - 106.5,
          topMargin: 52.69 / 2,
        },
        door: {
          width: 98.19,
          height: 98.19,
          marginLeft: 16.02,
          topMargin: 16.02,
        },
        zindex: 9999,
      },
      bank: {
        top: {
          width: 17.22,
          height: 25,
          marginLeft: -2.5,
          topMargin: 25,
        },
        bottom: {
          width: 17.22,
          height: 25,
          marginLeft: -2.5,
          topMargin: 0,
        },
        left: {
          width: 32.04,
          height: 17.22,
          marginLeft: 34.75,
          topMargin: -2.5,
        },
        right: {
          width: 32.04,
          height: 17.22,
          marginLeft: 32.04 - 34.75,
          topMargin: -2.5,
        },
        zindex: 9998,
      },
      phenix: {
        top: {
          width: 17.22,
          height: 25,
          marginLeft: 20,
          topMargin: 25,
        },
        bottom: {
          width: 17.22,
          height: 25,
          marginLeft: 20,
          topMargin: 0,
        },
        left: {
          width: 32.04,
          height: 17.22,
          marginLeft: 34.75,
          topMargin: 20,
        },
        right: {
          width: 32.04,
          height: 17.22,
          marginLeft: 32.04 - 34.75,
          topMargin: 20,
        },
        zindex: 9997,
      },
    },
  },
};

export default icon;
