'use client'
import { PieGraphData } from '@/models/statistics'
import PieChart, {
  Legend,
  Export,
  Series,
  Label,
  Font,
  Connector,
} from 'devextreme-react/pie-chart'

interface PieGraphProps {
  data: PieGraphData[];
}

const PieGraph: React.FC<PieGraphProps> = (props) => {
  const customizeText = (arg: { valueText: string; percentText: string }) => {
    return `${arg.valueText} (${arg.percentText})`
  }

  return (
    <PieChart id="pie" palette={['#566C84', '#256DBB', '#AAD3FF']} dataSource={props.data}>
      <Legend
        orientation="horizontal"
        itemTextPosition="right"
        horizontalAlignment="center"
        verticalAlignment="bottom"
        columnCount={4}
      />
      <Export enabled={false} />
      <Series argumentField="label" valueField="value">
        <Label visible={true} position="outside" customizeText={customizeText}>
          <Font size={13} />
          <Connector visible={false} width={0.5} />
        </Label>
      </Series>
    </PieChart>
  )
}

export default PieGraph
