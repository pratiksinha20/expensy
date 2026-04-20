import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import { usePriceHistory } from '../hooks/useProductData'
import { Spinner } from './SharedComponents'
import { STORE_INFO } from '../data/mockData'

const DEFAULT_COLORS = ['#D8CFBC', '#ff9900', '#2874f0', '#ff3465', '#16a34a', '#9B59B6']

function getColor(storeName, idx) {
  const info = STORE_INFO[storeName]
  return info?.color ?? DEFAULT_COLORS[idx % DEFAULT_COLORS.length]
}

// Merge all store history points into a single time-series array for Recharts
function buildChartData(history) {
  const stores   = Object.keys(history)
  const allDates = new Set()

  stores.forEach(store => {
    history[store].forEach(pt => allDates.add(pt.date))
  })

  const sorted = [...allDates].sort()

  return sorted.map(date => {
    const row = { date: new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) }
    stores.forEach(store => {
      const pt = history[store].find(p => p.date === date)
      row[store] = pt ? Number(pt.price) : undefined
    })
    return row
  })
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-midnight-lighter border border-olive/30 rounded-xl shadow-card p-4 text-sm backdrop-blur-sm">
      <p className="font-semibold text-sand mb-2.5 text-xs uppercase tracking-wider">{label}</p>
      {payload.map(entry => (
        <div key={entry.dataKey} className="flex items-center gap-2.5 mb-1.5 last:mb-0">
          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: entry.color }} />
          <span className="text-sand/60 text-xs">{entry.dataKey}</span>
          <span className="font-semibold text-sand ml-auto">₹{Number(entry.value).toLocaleString('en-IN')}</span>
        </div>
      ))}
    </div>
  )
}

export default function PriceHistoryChart({ productId }) {
  const { history, loading } = usePriceHistory(productId)

  if (loading) return (
    <div className="flex justify-center py-10"><Spinner /></div>
  )

  const stores    = Object.keys(history)
  const chartData = buildChartData(history)

  if (!stores.length || chartData.length < 2) return (
    <div className="text-center py-12 text-sm text-olive">
      <div className="w-16 h-16 bg-olive/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <span className="text-2xl">📊</span>
      </div>
      <p className="font-medium text-sand/60 mb-1">Not enough history yet</p>
      <p className="text-olive text-xs">Check back after the next price scrape</p>
    </div>
  )

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-base font-semibold text-sand font-display">Price Trend</h3>
        <div className="flex items-center gap-3">
          {stores.map((store, idx) => (
            <div key={store} className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ background: getColor(store, idx) }} />
              <span className="text-[10px] text-sand/50 font-medium">{store}</span>
            </div>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(86, 84, 73, 0.15)" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: '#565449' }}
            tickLine={false}
            axisLine={{ stroke: 'rgba(86, 84, 73, 0.2)' }}
          />
          <YAxis
            tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`}
            tick={{ fontSize: 11, fill: '#565449' }}
            tickLine={false}
            axisLine={false}
            width={55}
          />
          <Tooltip content={<CustomTooltip />} />
          {stores.map((store, idx) => (
            <Line
              key={store}
              type="monotone"
              dataKey={store}
              stroke={getColor(store, idx)}
              strokeWidth={2.5}
              dot={false}
              activeDot={{
                r: 5,
                strokeWidth: 2,
                stroke: '#11120D',
                fill: getColor(store, idx),
              }}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
