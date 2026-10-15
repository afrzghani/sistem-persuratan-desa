import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function CompletedLettersChart({
  data,
  selectedYear,
  tahunTersedia,
  onYearChange,
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">
            Surat Selesai
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Jumlah surat yang selesai setiap bulan
          </p>
        </div>

        {/* Pilih Tahun */}
        <select
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-emerald-500"
          value={selectedYear}
          onChange={(e) => onYearChange(e.target.value)}
        >
          {tahunTersedia.map((tahun) => (
            <option key={tahun} value={tahun}>
              {tahun}
            </option>
          ))}
        </select>
      </div>

      {/* Chart */}
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 10,
              right: 10,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />

            <XAxis dataKey="bulan" tickLine={false} axisLine={false} />

            <YAxis
              allowDecimals={false}
              tickLine={false}
              axisLine={false}
            />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="jumlah"
              stroke="#059669"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default CompletedLettersChart;