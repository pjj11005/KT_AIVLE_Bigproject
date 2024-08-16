import { PureComponent } from 'react';
import {
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Line,
} from 'recharts';

const data = [
  {
    name: '월',
    total: 4000,
    common: 2400,
    caution: 1600,
  },
  {
    name: '화',
    total: 4100,
    common: 2500,
    caution: 1600,
  },
  {
    name: '수',
    total: 4200,
    common: 2500,
    caution: 1600,
  },
  {
    name: '목',
    total: 4300,
    common: 2400,
    caution: 1900,
  },
  {
    name: '금',
    total: 4500,
    common: 2900,
    caution: 1600,
  },
  {
    name: '토',
    total: 5000,
    common: 3400,
    caution: 1600,
  },
  {
    name: '일',
    total: 3000,
    common: 1400,
    caution: 1600,
  },
];

export default class StackedBarChart extends PureComponent {
  static demoUrl = 'https://codesandbox.io/p/sandbox/stacked-bar-chart-7fwfgj';

  render() {
    return (
      <ResponsiveContainer
        width="100%"
        height={300}
        style={{ backgroundColor: 'white' }}
      >
        <ComposedChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <CartesianGrid stroke="white" />
          <Bar dataKey="common" barSize={35} fill="#1B1A3F" />
          <Bar dataKey="caution" barSize={35} fill="#dcdcdc" />
          <Line type="monotone" dataKey="total" stroke="#413ea0" />
        </ComposedChart>
      </ResponsiveContainer>
    );
  }
}
